import { describe, expect, it, jest } from "@jest/globals";
import type { LessonBank, UnitBank } from "../../data/types";
import { getBundledUnits } from "../../data/content-registry";
import {
  hasExpectedSourceScript,
  isCompleteCurriculumPack,
  isLoadableCurriculumPack,
  isUnitBankArray,
  getUnitsFromCacheOrBundle,
} from "../curriculum-loader";

jest.mock("../../lib/supabase", () => ({
  supabase: { from: jest.fn() },
}));
jest.mock("../../lib/app-storage", () => ({
  appStorage: {
    getItemSync: jest.fn(() => null),
    setItemSync: jest.fn(),
  },
}));
jest.mock("../../stores/useLocaleStore", () => ({
  useLocaleStore: {
    getState: () => ({
      selectedSourceLanguage: "ku",
      selectedTargetLanguage: "en",
    }),
  },
}));
jest.mock("../../data/content-registry", () => ({
  getBundledUnits: jest.fn(() => []),
}));

function validLesson(): LessonBank {
  return {
    topic: "Checking in",
    topicKu: "چوونە ژوورەوە",
    words: [{ english: "I have a reservation.", kurdish: "حجزم هەیە." }],
    voices: [{ prompt: "Say it.", target: "I have a reservation.", targetKurdish: "حجزم هەیە." }],
    sentences: [{ english: ["I", "have", "a", "reservation"], kurdish: "حجزم هەیە." }],
    fillBlanks: [{ parts: ["I have a ", "."], hint: "حجز", answer: "reservation", wrongs: ["receipt", "refund", "route"] }],
    conversations: [{
      situation: "At a hotel",
      theyAsk: "How can I help?",
      correct: "I have a reservation under Ali.",
      wrong1: "The weather is nice.",
      wrong2: "I work from home.",
      wrong3: "See you next week.",
      explanation: "State the booking and the name it is under.",
    }],
  };
}

function normalPack(): UnitBank[] {
  return Array.from({ length: 18 }, () =>
    Array.from({ length: 10 }, () => validLesson()),
  );
}

describe("curriculum pack validation", () => {
  it("accepts a structurally complete Normal English pack", () => {
    expect(isCompleteCurriculumPack("normal", normalPack())).toBe(true);
  });

  it("rejects a partial Normal English language pack", () => {
    expect(isCompleteCurriculumPack("normal", normalPack().slice(0, 17))).toBe(false);
  });

  it("accepts complete Russian preview units incrementally", () => {
    expect(isLoadableCurriculumPack("normal", "ru", normalPack().slice(0, 2))).toBe(false);
    expect(isLoadableCurriculumPack("normal", "en", normalPack().slice(0, 2))).toBe(false);
    expect(isLoadableCurriculumPack("normal", "ru", [[validLesson()]])).toBe(false);
  });

  it("rejects malformed lesson fields before gameplay", () => {
    const lesson = validLesson() as unknown as Record<string, unknown>;
    lesson.sentences = [{ english: "not-an-array", kurdish: "هەڵە" }];
    expect(isUnitBankArray([[lesson]])).toBe(false);
  });

  it("rejects a Kurdish snapshot mislabeled as Russian", () => {
    expect(hasExpectedSourceScript("ru", normalPack())).toBe(false);
  });

  it("uses the bundled Arabic fields for Kurdish-to-Arabic normal lessons", () => {
    jest.mocked(getBundledUnits).mockReturnValue(normalPack());
    const units = getUnitsFromCacheOrBundle("normal", "ku", "ar");
    expect(units).toHaveLength(18);
    expect(units.every((unit) => unit.length === 10)).toBe(true);
  });
});
