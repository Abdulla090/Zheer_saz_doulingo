import type { GameQuestion, KidsPlayQuestion } from "./types";
import type { KidsGameStep, KidsChoice } from "./kids-games";

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

function shuffleChoices(choices: KidsChoice[], seed: number): KidsChoice[] {
  return shuffle(choices, seed);
}

function kidsPlay(
  partial: Omit<KidsPlayQuestion, "type" | "xp">,
  xp = 15,
): KidsPlayQuestion {
  return { type: "kids_play", xp, ...partial };
}

export function kidsStepToQuestion(step: KidsGameStep, seed: number): GameQuestion {
  switch (step.kind) {
    case "scene":
      return kidsPlay({
        variant: "scene",
        scene: step.scene,
        prompt: step.prompt,
        promptLang: "en",
        correctId: step.correctId,
        choices: shuffleChoices(step.choices, seed),
      });
    case "bubble":
      return kidsPlay({
        variant: "bubble",
        prompt: step.prompt,
        promptLang: "en",
        correctId: step.correctId,
        choices: shuffleChoices(step.choices, seed + 1),
      });
    case "feed":
      return kidsPlay({
        variant: "feed",
        mascotEmoji: step.mascotEmoji,
        prompt: step.prompt,
        promptLang: "en",
        correctId: step.correctId,
        choices: shuffleChoices(step.choices, seed + 2),
      });
    case "shadow": {
      const items = shuffleChoices(step.items, seed + 3);
      return kidsPlay({
        variant: "shadow",
        prompt: step.prompt,
        promptLang: "en",
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
        prompt: step.kurdishPrompt,
        promptLang: "ku",
        correctId: step.correctId,
        choices: shuffleChoices(step.choices, seed + 5),
      });
    case "simon":
      return kidsPlay({
        variant: "pick",
        prompt: step.phrase,
        promptLang: "en",
        correctId: step.correctId,
        choices: shuffleChoices(step.choices, seed + 6),
      });
    case "train": {
      const extras = step.extraWords ?? ["the", "a", "is"];
      const bank = shuffle(
        [...step.words, ...extras.filter((w) => !step.words.includes(w))],
        seed + 7,
      );
      return {
        type: "sentence_builder",
        kurdishSentence: step.kurdishHint,
        wordBank: bank,
        correctWords: [...step.words],
        xp: 20,
      };
    }
    case "trick":
      return kidsPlay({
        variant: "yes_no",
        prompt: `Does "${step.spokenWord}" match?`,
        promptLang: "en",
        correctId: step.matches ? "yes" : "no",
        choices: [],
        shownEmoji: step.showEmoji,
        shownLabel: step.showLabel,
        spokenWord: step.spokenWord,
        matches: step.matches,
      });
    case "echo":
      return {
        type: "voice",
        prompt: step.prompt,
        targetWord: step.target,
        targetKurdish: step.targetKurdish,
        imageRequire: step.imageRequire,
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
      ).slice(0, 3);
      return kidsPlay({
        variant: "treasure",
        prompt: "Tap the chest, then pick the matching word!",
        promptLang: "en",
        correctId: step.correctId,
        choices: options,
        treasureRevealEmoji: reveal.emoji,
        treasureRevealLabel: reveal.label,
      });
    }
    default:
      return kidsPlay({
        variant: "pick",
        prompt: "Choose one!",
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
  return steps.map((step, i) => kidsStepToQuestion(step, base + i));
}
