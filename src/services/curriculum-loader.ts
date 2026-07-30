import { getBundledUnits } from "../data/content-registry";
import type { LessonBank, LessonPathMode, UnitBank } from "../data/types";
import { appStorage } from "../lib/app-storage";
import { supabase } from "../lib/supabase";
import { useLocaleStore } from "../stores/useLocaleStore";

const CACHE_PREFIX = "twino.curriculum.cache.v2.";

type CurriculumPackRow = {
  content: unknown;
  version: number;
};

export type CurriculumPublishResult =
  | { ok: true }
  | { ok: false; error: string };

function cacheKey(mode: LessonPathMode, sourceLanguage: string, targetLanguage: string) {
  return `${CACHE_PREFIX}${mode}.${sourceLanguage}.${targetLanguage}`;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isLessonBank(value: unknown): value is LessonBank {
  if (!value || typeof value !== "object") return false;
  const lesson = value as Partial<LessonBank>;

  return (
    typeof lesson.topic === "string" &&
    typeof lesson.topicKu === "string" &&
    Array.isArray(lesson.words) &&
    lesson.words.every(
      (word) =>
        word &&
        typeof word.english === "string" &&
        typeof word.kurdish === "string",
    ) &&
    Array.isArray(lesson.voices) &&
    lesson.voices.every(
      (voice) =>
        voice &&
        typeof voice.prompt === "string" &&
        typeof voice.target === "string" &&
        typeof voice.targetKurdish === "string",
    ) &&
    Array.isArray(lesson.sentences) &&
    lesson.sentences.every(
      (sentence) =>
        sentence &&
        isStringArray(sentence.english) &&
        typeof sentence.kurdish === "string",
    ) &&
    Array.isArray(lesson.fillBlanks) &&
    lesson.fillBlanks.every(
      (fill) =>
        fill &&
        isStringArray(fill.parts) &&
        fill.parts.length === 2 &&
        typeof fill.hint === "string" &&
        typeof fill.answer === "string" &&
        isStringArray(fill.wrongs) &&
        fill.wrongs.length === 3,
    ) &&
    Array.isArray(lesson.conversations) &&
    lesson.conversations.every(
      (conversation) =>
        conversation &&
        [
          conversation.situation,
          conversation.theyAsk,
          conversation.correct,
          conversation.wrong1,
          conversation.wrong2,
          conversation.wrong3,
          conversation.explanation,
        ].every((field) => typeof field === "string"),
    )
  );
}

/** Reject malformed or partial database payloads before they reach gameplay. */
export function isUnitBankArray(value: unknown): value is UnitBank[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (unit) =>
        Array.isArray(unit) && unit.length > 0 && unit.every(isLessonBank),
    )
  );
}

export function isCompleteCurriculumPack(
  mode: LessonPathMode,
  value: unknown,
): value is UnitBank[] {
  if (!isUnitBankArray(value)) return false;
  if (mode !== "normal") return true;
  return value.length === 18 && value.every((unit) => unit.length === 10);
}

/** Only complete production packs may reach gameplay, regardless of target language. */
export function isLoadableCurriculumPack(
  mode: LessonPathMode,
  _targetLanguage: string,
  value: unknown,
): value is UnitBank[] {
  return isCompleteCurriculumPack(mode, value);
}

function getNativeLearningStrings(units: UnitBank[]): string[] {
  return units.flatMap((unit) =>
    unit.flatMap((lesson) => [
      lesson.topicKu,
      ...lesson.words.map((word) => word.kurdish),
      ...lesson.voices.flatMap((voice) => [voice.prompt, voice.targetKurdish]),
      ...lesson.sentences.map((sentence) => sentence.kurdish),
      ...lesson.fillBlanks.map((fill) => fill.hint),
      ...lesson.conversations.flatMap((conversation) => [
        conversation.situation,
        conversation.explanation,
      ]),
    ]),
  ).filter((text) => text.trim().length > 0);
}

/** Prevent publishing Kurdish placeholders under a Russian language label. */
export function hasExpectedSourceScript(
  sourceLanguage: string,
  units: UnitBank[],
): boolean {
  if (sourceLanguage !== "ru") return true;
  const strings = getNativeLearningStrings(units);
  if (strings.length === 0) return false;
  const cyrillicStrings = strings.filter((text) => /[А-Яа-яЁё]/u.test(text));
  return cyrillicStrings.length / strings.length >= 0.9;
}

/** Fetch the published pack for the learner's exact language pair and cache it offline. */
export async function fetchRemoteCurriculum(
  mode: LessonPathMode,
  sourceLanguage = useLocaleStore.getState().selectedSourceLanguage,
  targetLanguage = useLocaleStore.getState().selectedTargetLanguage,
): Promise<UnitBank[] | null> {
  try {
    const { data, error } = await supabase
      .from("curriculum_packs")
      .select("content, version")
      .eq("path_mode", mode)
      .eq("source_language", sourceLanguage)
      .eq("target_language", targetLanguage)
      .eq("is_published", true)
      .maybeSingle();

    if (error) {
      console.warn(`[curriculum-loader] Could not fetch ${mode}/${sourceLanguage}-${targetLanguage}:`, error.message);
      return null;
    }

    const row = data as CurriculumPackRow | null;
    if (
      !row ||
      !isLoadableCurriculumPack(mode, targetLanguage, row.content) ||
      !hasExpectedSourceScript(sourceLanguage, row.content)
    ) {
      if (row) {
        console.warn(`[curriculum-loader] Rejected invalid published pack ${mode}/${sourceLanguage}-${targetLanguage}.`);
      }
      return null;
    }

    appStorage.setItemSync(
      cacheKey(mode, sourceLanguage, targetLanguage),
      JSON.stringify({ version: row.version, content: row.content }),
    );
    return row.content;
  } catch (error) {
    console.warn(`[curriculum-loader] Failed to fetch ${mode}/${sourceLanguage}-${targetLanguage}:`, error);
    return null;
  }
}

/** Publish an editor snapshot. Database RLS limits this to curriculum admins. */
export async function publishCurriculumPack(
  mode: LessonPathMode,
  sourceLanguage: string,
  targetLanguage: string,
  units: UnitBank[],
  userId: string,
): Promise<CurriculumPublishResult> {
  if (!isLoadableCurriculumPack(mode, targetLanguage, units)) {
    return {
      ok: false,
      error: mode === "normal"
        ? "Normal courses must contain all 18 units with 10 lessons in every unit."
        : "The curriculum is incomplete or malformed.",
    };
  }
  if (sourceLanguage === targetLanguage) {
    return { ok: false, error: "Source and target languages must be different." };
  }
  if (!hasExpectedSourceScript(sourceLanguage, units)) {
    return {
      ok: false,
      error: "Russian packs must contain Russian source text in at least 90% of learner-facing fields.",
    };
  }

  const { error } = await supabase.from("curriculum_packs").upsert(
    {
      path_mode: mode,
      source_language: sourceLanguage,
      target_language: targetLanguage,
      content: units,
      is_published: true,
      updated_by: userId,
    },
    { onConflict: "path_mode,source_language,target_language" },
  );

  if (error) return { ok: false, error: error.message };

  appStorage.setItemSync(
    cacheKey(mode, sourceLanguage, targetLanguage),
    JSON.stringify({ version: Date.now(), content: units }),
  );
  return { ok: true };
}

export function getUnitsFromCacheOrBundle(
  mode: LessonPathMode,
  sourceLanguage = useLocaleStore.getState().selectedSourceLanguage,
  targetLanguage = useLocaleStore.getState().selectedTargetLanguage,
): UnitBank[] {
  try {
    const cached = appStorage.getItemSync(cacheKey(mode, sourceLanguage, targetLanguage));
    if (cached) {
      const parsed = JSON.parse(cached) as { content?: unknown };
      if (
        isLoadableCurriculumPack(mode, targetLanguage, parsed.content) &&
        hasExpectedSourceScript(sourceLanguage, parsed.content)
      ) {
        return parsed.content;
      }
    }
  } catch {
    // A corrupt cache must never block the audited bundled fallback.
  }

  // The audited normal course is bundled for English and Arabic targets.
  // Arabic learner-facing fields are part of every bundled lesson bank.
  if (
    mode === "normal" &&
    ["en", "ar"].includes(targetLanguage) &&
    ["ku", "ar"].includes(sourceLanguage) &&
    sourceLanguage !== targetLanguage
  ) {
    return getBundledUnits("normal");
  }

  // Street and Kids retain their existing bundled/cache behavior for supported pairs.
  if (mode !== "normal" && sourceLanguage === "ku" && targetLanguage === "en") {
    return getBundledUnits(mode);
  }

  // Never silently show Kurdish content to a language pair with no published pack.
  return [];
}
