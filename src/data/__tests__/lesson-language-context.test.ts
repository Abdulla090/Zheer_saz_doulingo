import { describe, expect, it, jest } from "@jest/globals";
import { previewLessonQuestions, type LessonPathMode } from "../lesson-content";
import { KIDS_UNITS } from "../kids-english";
import { NORMAL_UNITS } from "../normal-english";
import { ALL_UNITS } from "../units";
import { useLocaleStore } from "../../stores/useLocaleStore";

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
    "conversation_pick",
    "fill_blank",
    "multiple_choice",
    "pair_match",
    "paragraph_speech",
    "sentence_builder",
    "voice",
  ],
  normal: [
    "conversation_pick",
    "fill_blank",
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
    "memory_flip",
    "multiple_choice",
    "pair_match",
    "sentence_builder",
    "voice",
  ],
};

describe("lesson language context", () => {
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
