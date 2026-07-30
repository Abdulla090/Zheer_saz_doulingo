import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { getLessonQuestions } from "../lesson-content";
import {
  buildSentenceNearMisses,
  getNormalLessonDifficulty,
} from "../normal-english/difficulty";
import { useLocaleStore } from "../../stores/useLocaleStore";
import { useSettingsStore } from "../../stores/useSettingsStore";

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

jest.mock("react-native-mmkv", () => ({
  createMMKV: jest.fn(() => ({
    getString: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
  })),
}));

const normalized = (value: string) => value.trim().toLowerCase();

describe("normal English lesson difficulty", () => {
  beforeEach(() => {
    useSettingsStore.getState().setEnglishLevel(1);
    useLocaleStore.setState({
      selectedUiLanguage: "ku",
      selectedSourceLanguage: "ku",
      selectedTargetLanguage: "en",
      locale: "ku",
    });
  });

  it("rises continuously through all eighteen units", () => {
    expect(getNormalLessonDifficulty(0, 0)).toMatchObject({
      step: 0,
      closeDistractorCount: 1,
      sentenceExtraCount: 1,
      pairCount: 3,
      readingSentenceCount: 2,
    });
    expect(getNormalLessonDifficulty(0, 4)?.closeDistractorCount).toBe(1);
    expect(getNormalLessonDifficulty(0, 5)?.closeDistractorCount).toBe(2);
    expect(getNormalLessonDifficulty(2, 5)).toMatchObject({
      step: 25,
      closeDistractorCount: 2,
      sentenceExtraCount: 2,
      pairCount: 4,
    });
    expect(getNormalLessonDifficulty(4, 9)).toMatchObject({
      step: 49,
      closeDistractorCount: 2,
      sentenceExtraCount: 2,
      pairCount: 4,
      readingSentenceCount: 2,
    });
    expect(getNormalLessonDifficulty(5, 0)).toMatchObject({
      step: 50,
      closeDistractorCount: 3,
      sentenceExtraCount: 2,
      pairCount: 4,
      readingSentenceCount: 3,
    });
    expect(getNormalLessonDifficulty(17, 9)).toMatchObject({
      step: 179,
      progress: 1,
      closeDistractorCount: 3,
      sentenceExtraCount: 4,
      pairCount: 4,
      readingSentenceCount: 4,
    });
    expect(getNormalLessonDifficulty(18, 0)).toBeNull();
  });

  it("creates close grammar mistakes instead of obviously unrelated sentences", () => {
    const misses = buildSentenceNearMisses(["I", "am", "fine"]);

    expect(misses).toEqual(expect.arrayContaining(["I is fine", "I are fine"]));
  });

  it("keeps every choice game valid throughout all 180 lessons", () => {
    for (let unitIndex = 0; unitIndex < 18; unitIndex += 1) {
      for (let lessonIndex = 0; lessonIndex < 10; lessonIndex += 1) {
        const questions = getLessonQuestions(unitIndex, lessonIndex, "normal");

        expect(questions.length).toBeGreaterThan(0);
        questions.forEach((question) => {
          if (
            question.type !== "multiple_choice" &&
            question.type !== "fill_blank" &&
            question.type !== "conversation_pick"
          ) {
            return;
          }

          const optionKeys = question.options.map(normalized);
          expect(question.options).toHaveLength(4);
          expect(new Set(optionKeys).size).toBe(4);
          expect(optionKeys).toContain(normalized(question.correctAnswer));

          if (question.type === "conversation_pick") {
            expect(Object.keys(question.optionTiers).sort()).toEqual(
              [...question.options].sort(),
            );
          }
        });
      }
    }
  });

  it("adds challenge to each game family as lessons advance", () => {
    const first = getLessonQuestions(0, 0, "normal");
    const middle = getLessonQuestions(2, 5, "normal");
    const last = getLessonQuestions(17, 9, "normal");

    const firstPair = first.find((question) => question.type === "pair_match");
    const lastPair = last.find((question) => question.type === "pair_match");
    expect(firstPair?.type === "pair_match" ? firstPair.pairs : []).toHaveLength(3);
    expect(lastPair?.type === "pair_match" ? lastPair.pairs : []).toHaveLength(4);

    const decoyCounts = (questions: typeof first) =>
      questions
        .filter((question) => question.type === "sentence_builder")
        .map((question) =>
          question.type === "sentence_builder"
            ? question.wordBank.length - question.correctWords.length
            : 0,
        );
    expect(decoyCounts(first)).toEqual([1, 1]);
    expect(decoyCounts(middle)).toEqual([2, 2]);
    expect(decoyCounts(last)).toEqual([4, 4]);

    const firstConversations = first.filter(
      (question) => question.type === "conversation_pick",
    );
    const laterConversations = middle.filter(
      (question) => question.type === "conversation_pick",
    );
    firstConversations.forEach((question) => {
      if (question.type !== "conversation_pick") return;
      expect(Object.values(question.optionTiers)).toContain("good");
    });
    laterConversations.forEach((question) => {
      if (question.type !== "conversation_pick") return;
      expect(Object.values(question.optionTiers)).toEqual(
        expect.arrayContaining(["good", "bad"]),
      );
    });

    const finalReading = last.find(
      (question) => question.type === "paragraph_speech",
    );
    expect(
      finalReading?.type === "paragraph_speech" ? finalReading.paragraphs : [],
    ).toHaveLength(4);
  });
});
