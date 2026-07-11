// ─────────────────────────────────────────────────────────────────────────────
// Guidebook data — extracted from each unit's lesson banks for quick reference
// ─────────────────────────────────────────────────────────────────────────────

import type { AppLocale } from "../i18n";
import { getUnitsForPath } from "./content-access";
import type { LessonPathMode, UnitBank } from "./types";
import { getSkippedUnitsCount, normalSectionConfigs } from "./normal-english";
import { kidsSectionConfigs } from "./kids-english";
import { getPathUnitTitle } from "./path-unit-titles";
import { sectionConfigs } from "./list-items";
import { useSettingsStore } from "../stores/useSettingsStore";

export type GuidebookWord = {
  english: string;
  kurdish: string;
  arabic?: string;
};

export type GuidebookPhrase = {
  english: string;
  kurdish: string;
  arabic?: string;
};

export type GuidebookLesson = {
  topic: string;
  topicKu: string;
  topicAr?: string;
  words: GuidebookWord[];
  phrases: GuidebookPhrase[];
};

export type GuidebookUnit = {
  unitIndex: number;
  title: string;
  displayTheme: string;
  lessons: GuidebookLesson[];
};

type SectionConfig = { displayTheme: string };

function cleanText(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function addPhrase(
  phrases: GuidebookPhrase[],
  seen: Set<string>,
  english: string | undefined,
  kurdish: string | undefined,
  arabic?: string,
) {
  const englishText = cleanText(english);
  if (!englishText) return;

  const key = englishText.toLocaleLowerCase();
  if (seen.has(key)) return;
  seen.add(key);

  phrases.push({
    english: englishText,
    kurdish: cleanText(kurdish) ?? "",
    ...(cleanText(arabic) ? { arabic: cleanText(arabic) } : {}),
  });
}

function buildGuidebookFromUnit(
  unitIndex: number,
  unitBank: UnitBank | undefined,
  config: SectionConfig | undefined,
  title: string,
): GuidebookUnit | null {
  if (!unitBank || !config) return null;

  const lessons: GuidebookLesson[] = unitBank.map((lesson) => {
    const phrases: GuidebookPhrase[] = [];
    const seenPhrases = new Set<string>();

    for (const v of lesson.voices ?? []) {
      addPhrase(phrases, seenPhrases, v.target, v.targetKurdish, v.targetArabic);
    }

    for (const s of lesson.sentences ?? []) {
      if (!s?.english?.length) continue;
      addPhrase(phrases, seenPhrases, s.english.join(" "), s.kurdish, s.arabic);
    }

    for (const c of lesson.conversations ?? []) {
      if (!c?.correct) continue;
      addPhrase(
        phrases,
        seenPhrases,
        c.correct,
        c.explanation,
        c.correctAr ?? c.explanationAr,
      );
    }

    return {
      topic: lesson.topic ?? "",
      topicKu: lesson.topicKu ?? "",
      ...(cleanText(lesson.topicAr) ? { topicAr: cleanText(lesson.topicAr) } : {}),
      words: (lesson.words ?? []).map((word) => ({
        english: word.english,
        kurdish: word.kurdish,
        ...(cleanText(word.arabic) ? { arabic: cleanText(word.arabic) } : {}),
      })),
      phrases,
    };
  });

  return {
    unitIndex,
    title,
    displayTheme: config.displayTheme,
    lessons,
  };
}

/** Builds guidebook data for a street-English unit. */
export function getGuidebookForUnit(
  unitIndex: number,
  locale: AppLocale = "en",
): GuidebookUnit | null {
  return buildGuidebookFromUnit(
    unitIndex,
    getUnitsForPath("street")[unitIndex],
    sectionConfigs[unitIndex],
    getPathUnitTitle("street", unitIndex, locale),
  );
}

/** Builds guidebook data for a normal-English unit. */
export function getGuidebookForNormalUnit(
  unitIndex: number,
  locale: AppLocale = "en",
): GuidebookUnit | null {
  const skippedUnits = getSkippedUnitsCount(
    useSettingsStore.getState().englishLevel || 5,
  );
  const activeUnitIndex =
    unitIndex >= skippedUnits ? unitIndex - skippedUnits : unitIndex;
  const sourceUnitIndex = activeUnitIndex + skippedUnits;

  return buildGuidebookFromUnit(
    activeUnitIndex,
    getUnitsForPath("normal")[activeUnitIndex],
    normalSectionConfigs[sourceUnitIndex] ?? normalSectionConfigs[activeUnitIndex],
    getPathUnitTitle("normal", sourceUnitIndex, locale),
  );
}

/** Builds guidebook data for a kids-English unit. */
export function getGuidebookForKidsUnit(
  unitIndex: number,
  locale: AppLocale = "en",
): GuidebookUnit | null {
  return buildGuidebookFromUnit(
    unitIndex,
    getUnitsForPath("kids")[unitIndex],
    kidsSectionConfigs[unitIndex],
    getPathUnitTitle("kids", unitIndex, locale),
  );
}

/** Resolves guidebook content for either path mode. */
export function getGuidebook(
  mode: LessonPathMode,
  unitIndex: number,
  locale: AppLocale = "en",
): GuidebookUnit | null {
  if (!Number.isFinite(unitIndex) || unitIndex < 0) return null;
  if (mode === "normal") return getGuidebookForNormalUnit(unitIndex, locale);
  if (mode === "kids") return getGuidebookForKidsUnit(unitIndex, locale);
  return getGuidebookForUnit(unitIndex, locale);
}

/** Pre-build guidebooks for street-English units (English titles by default). */
export const ALL_GUIDEBOOKS: (GuidebookUnit | null)[] = sectionConfigs.map(
  (_, i) => getGuidebookForUnit(i),
);
