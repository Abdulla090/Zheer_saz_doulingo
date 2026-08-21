import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { getLessonQuestions, type LessonPathMode } from "../lesson-content";
import { NORMAL_UNITS } from "../normal-english";
import { ALL_UNITS } from "../units";
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

const wordCount = (value: string) =>
  value.trim().split(/\s+/).filter(Boolean).length;

describe("lesson answer-choice quality", () => {
  beforeEach(() => {
    useSettingsStore.getState().setEnglishLevel(1);
    useLocaleStore.setState({
      selectedUiLanguage: "ku",
      selectedSourceLanguage: "ku",
      selectedTargetLanguage: "en",
      locale: "ku",
    });
  });

  it("does not reveal the answer by making it the only developed option", () => {
    const paths: {
      mode: Exclude<LessonPathMode, "kids" | "custom">;
      units: typeof NORMAL_UNITS;
    }[] = [
      { mode: "normal", units: NORMAL_UNITS },
      { mode: "street", units: ALL_UNITS },
    ];

    for (const { mode, units } of paths) {
      units.forEach((unit, unitIndex) => {
        unit.forEach((_, lessonIndex) => {
          const questions = getLessonQuestions(unitIndex, lessonIndex, mode);

          questions.forEach((question) => {
            if (
              question.type !== "multiple_choice" &&
              question.type !== "conversation_pick" &&
              question.type !== "conversation_complete"
            ) {
              return;
            }

            const wrongLengths = question.options
              .filter((option) => option !== question.correctAnswer)
              .map(wordCount);
            expect(wrongLengths.length).toBeGreaterThan(0);

            const answerLength = wordCount(question.correctAnswer);
            const longestWrong = Math.max(...wrongLengths);
            const obviousGiveaway =
              answerLength > longestWrong + 2 &&
              answerLength / Math.max(longestWrong, 1) >= 1.45;

            if (obviousGiveaway) {
              throw new Error(
                `Length giveaway in ${mode} unit ${unitIndex + 1}, lesson ${lessonIndex + 1}, ${question.type}: ` +
                  JSON.stringify({ answer: question.correctAnswer, options: question.options }),
              );
            }
          });
        });
      });
    }
  });
});
