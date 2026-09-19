import { describe, expect, it, jest } from "@jest/globals";
import { previewLessonQuestions, type LessonPathMode } from "../lesson-content";
import { KIDS_UNITS } from "../kids-english";
import { NORMAL_UNITS } from "../normal-english";
import { ALL_UNITS } from "../units";
import { useLocaleStore } from "../../stores/useLocaleStore";
import { selectWordRescue } from "../../screens/lesson/games/word-rescue";

jest.mock("@react-native-async-storage/async-storage", () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);
jest.mock("react-native-mmkv", () => {
  const values = new Map<string, string>();
  return {
    createMMKV: () => ({
      getString: (key: string) => values.get(key),
      set: (key: string, value: string) => values.set(key, value),
      remove: (key: string) => values.delete(key),
    }),
  };
});

type BundledLessonPathMode = Exclude<LessonPathMode, "custom">;

const PATH_UNITS: [BundledLessonPathMode, typeof ALL_UNITS][] = [
  ["street", ALL_UNITS],
  ["normal", NORMAL_UNITS],
  ["kids", KIDS_UNITS],
];

const EXPECTED_GAME_TYPES: Record<BundledLessonPathMode, string[]> = {
  street: [
    "conversation_complete",
    "conversation_pick",
    "fill_blank",
    "listen_build",
    "multiple_choice",
    "pair_match",
    "paragraph_speech",
    "sentence_builder",
    "voice",
  ],
  normal: [
    "conversation_complete",
    "conversation_pick",
    "fill_blank",
    "listen_build",
    "multiple_choice",
    "pair_match",
    "paragraph_speech",
    "sentence_builder",
    "voice",
  ],
  kids: [
    "fill_blank",
    "image_multiple_choice",
    "image_pair_match",
    "listen_build",
    "memory_flip",
    "multiple_choice",
    "pair_match",
    "sentence_builder",
    "voice",
  ],
};

describe("lesson language context", () => {
  it("mixes Word Rescue with retained multiple choice in real normal-path lessons", () => {
    useLocaleStore.setState({ selectedSourceLanguage: "ku", selectedTargetLanguage: "en" });
    let rescued = 0;
    let retained = 0;
    NORMAL_UNITS.slice(0, 3).forEach((unit, unitIndex) => {
      unit.forEach((lesson, lessonIndex) => {
        const questions = previewLessonQuestions(lesson, unitIndex, lessonIndex, "normal");
        questions.forEach((question, index) => {
          if (question.type !== "multiple_choice") return;
          const puzzle = selectWordRescue(questions, index, "normal", unitIndex, lessonIndex);
          if (puzzle) {
            rescued++;
            expect(puzzle.before + puzzle.word + puzzle.after).toBe(question.correctAnswer);
          } else retained++;
        });
      });
    });
    expect(rescued).toBeGreaterThan(0);
    expect(retained).toBeGreaterThan(0);
    expect(rescued / (rescued + retained)).toBeGreaterThan(0.35);
    expect(rescued / (rescued + retained)).toBeLessThan(0.65);
  });

  it.each(PATH_UNITS)(
    "attaches Kurdish source and English target metadata to every %s unit game",
    (mode, units) => {
      const seenGameTypes = new Set<string>();
      useLocaleStore.setState({
        selectedUiLanguage: "ku",
        selectedSourceLanguage: "ku",
        selectedTargetLanguage: "en",
        locale: "ku",
      });

      units.forEach((unit, unitIndex) => {
        unit.forEach((_, lessonIndex) => {
          const questions = previewLessonQuestions(
            unit[lessonIndex],
            unitIndex,
            lessonIndex,
            mode,
          );

          expect(questions.length).toBeGreaterThan(0);
          questions.forEach((question) => {
            seenGameTypes.add(question.type);
            expect(question.sourceLanguage).toBe("ku");
            expect(question.targetLanguage).toBe("en");
          });
        });
      });

      expect([...seenGameTypes].sort()).toEqual(EXPECTED_GAME_TYPES[mode]);
    },
  );
});
