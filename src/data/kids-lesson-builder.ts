import type { GameQuestion, KidsPlayQuestion } from "./types";
import type { KidsGameStep, KidsChoice } from "./kids-games";
import { getKidsVoiceImage } from "./kids-image-assets";
import { useLocaleStore } from "../stores/useLocaleStore";

function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffleChoices(choices: KidsChoice[], seed: number, isArabic = false): KidsChoice[] {
  const mapped = isArabic
    ? choices.map((c) => (c.arabicLabel ? { ...c, label: c.arabicLabel } : c))
    : choices;
  return shuffle(mapped, seed);
}

function kidsPlay(
  partial: Omit<KidsPlayQuestion, "type" | "xp">,
  xp = 15,
): KidsPlayQuestion {
  return { type: "kids_play", xp, ...partial };
}

export function kidsStepToQuestion(
  step: KidsGameStep,
  seed: number,
  unitIndex = -1,
  lessonIndex = -1,
): GameQuestion {
  const targetLang = useLocaleStore.getState().selectedTargetLanguage;
  const isArabicTarget = targetLang === "ar";

  switch (step.kind) {
    case "scene":
      return kidsPlay({
        variant: "scene",
        scene: step.scene,
        prompt: isArabicTarget && step.promptAr ? step.promptAr : step.prompt,
        promptLang: isArabicTarget ? "ar" : "en",
        correctId: step.correctId,
        choices: shuffleChoices(step.choices, seed, isArabicTarget),
      });
    case "bubble":
      return kidsPlay({
        variant: "bubble",
        prompt: isArabicTarget && step.promptAr ? step.promptAr : step.prompt,
        promptLang: isArabicTarget ? "ar" : "en",
        correctId: step.correctId,
        choices: shuffleChoices(step.choices, seed + 1, isArabicTarget),
      });
    case "feed":
      return kidsPlay({
        variant: "feed",
        mascotEmoji: step.mascotEmoji,
        prompt: isArabicTarget && step.promptAr ? step.promptAr : step.prompt,
        promptLang: isArabicTarget ? "ar" : "en",
        correctId: step.correctId,
        choices: shuffleChoices(step.choices, seed + 2, isArabicTarget),
      });
    case "shadow": {
      const items = shuffleChoices(step.items, seed + 3, isArabicTarget);
      return kidsPlay({
        variant: "shadow",
        prompt: isArabicTarget && step.promptAr ? step.promptAr : step.prompt,
        promptLang: isArabicTarget ? "ar" : "en",
        correctId: "shadow",
        choices: items,
        shadowSlotIds: shuffle(
          step.items.map((c) => c.id),
          seed + 4,
        ),
      });
    }
    case "native":
      return kidsPlay({
        variant: "pick",
        prompt: isArabicTarget && step.arabicPrompt ? step.arabicPrompt : step.kurdishPrompt,
        promptLang: isArabicTarget ? "ar" : "ku",
        correctId: step.correctId,
        choices: shuffleChoices(step.choices, seed + 5, isArabicTarget),
      });
    case "simon":
      return kidsPlay({
        variant: "pick",
        prompt: isArabicTarget && step.phraseAr ? step.phraseAr : step.phrase,
        promptLang: isArabicTarget ? "ar" : "en",
        correctId: step.correctId,
        choices: shuffleChoices(step.choices, seed + 6, isArabicTarget),
      });
    case "train": {
      const trainWords = isArabicTarget && step.arabicWords ? step.arabicWords : step.words;
      const extras = step.extraWords ?? (isArabicTarget ? ["في", "هو", "الـ"] : ["the", "a", "is"]);
      const bank = shuffle(
        [...trainWords, ...extras.filter((w) => !trainWords.includes(w))],
        seed + 7,
      );
      return {
        type: "sentence_builder",
        kurdishSentence: isArabicTarget && step.arabicHint ? step.arabicHint : step.kurdishHint,
        wordBank: bank,
        correctWords: [...trainWords],
        xp: 20,
      };
    }
    case "trick":
      return kidsPlay({
        variant: "yes_no",
        prompt: isArabicTarget ? `هل كلمة "${step.spokenWord}" تطابق؟` : `Does "${step.spokenWord}" match?`,
        promptLang: isArabicTarget ? "ar" : "en",
        correctId: step.matches ? "yes" : "no",
        choices: [],
        shownEmoji: step.showEmoji,
        shownLabel: isArabicTarget && step.showLabelAr ? step.showLabelAr : step.showLabel,
        spokenWord: step.spokenWord,
        matches: step.matches,
      });
    case "echo":
      return {
        type: "voice",
        prompt: isArabicTarget ? "كرر بالصوت:" : step.prompt,
        targetWord: isArabicTarget && step.targetArabic ? step.targetArabic : step.target,
        targetKurdish: isArabicTarget && step.targetArabic ? step.targetArabic : step.targetKurdish,
        imageRequire:
          getKidsVoiceImage(step.target, unitIndex, lessonIndex) ?? step.imageRequire,
        xp: 20,
      };
    case "treasure": {
      const reveal = step.pool.find((c) => c.id === step.correctId) ?? step.pool[0];
      const options = shuffleChoices(
        step.pool.length >= 3
          ? step.pool
          : [
              ...step.pool,
              { id: "_w1", emoji: "❓", label: "?" },
              { id: "_w2", emoji: "❓", label: "?" },
            ],
        seed + 8,
        isArabicTarget,
      ).slice(0, 3);
      return kidsPlay({
        variant: "treasure",
        prompt: isArabicTarget ? "المس الصندوق واكتشف الكلمة المطابقة!" : "Tap the chest, then pick the matching word!",
        promptLang: isArabicTarget ? "ar" : "en",
        correctId: step.correctId,
        choices: options,
        treasureRevealEmoji: reveal.emoji,
        treasureRevealLabel: isArabicTarget && reveal.arabicLabel ? reveal.arabicLabel : reveal.label,
      });
    }
    default:
      return kidsPlay({
        variant: "pick",
        prompt: "Choose one!",
        promptLang: "en",
        correctId: "a",
        choices: [{ id: "a", emoji: "⭐", label: "Star" }],
      });
  }
}

/** Builds the scripted 10-game kids flow in lesson order (no shuffle). */
export function buildKidsFlowQuestions(
  steps: KidsGameStep[],
  unitIndex: number,
  lessonIndex: number,
): GameQuestion[] {
  const base = unitIndex * 997 + lessonIndex * 137;
  return steps.map((step, i) =>
    kidsStepToQuestion(step, base + i, unitIndex, lessonIndex),
  );
}
