import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { previewLessonQuestions, type LessonPathMode } from "../lesson-content";
import { NORMAL_UNITS } from "../normal-english";
import { KIDS_UNITS } from "../kids-english";
import { ALL_UNITS } from "../units";
import { useLocaleStore } from "../../stores/useLocaleStore";

jest.mock("@react-native-async-storage/async-storage", () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- resolve native dependency inside the hoisted mock.
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

function findEnglishLeaks(units: any[][], mode: LessonPathMode) {
  const leaks: { unit: number; lesson: number; type: string; field: string; val: any }[] = [];
  const englishRegex = /[a-zA-Z]{3,}/;

  units.forEach((unit, unitIndex) => {
    unit.forEach((lesson, lessonIndex) => {
      const questions = previewLessonQuestions(
        lesson,
        unitIndex,
        lessonIndex,
        mode,
      );

      questions.forEach((q: any) => {
        if (q.type === "multiple_choice" || q.type === "image_multiple_choice") {
          if (englishRegex.test(q.correctAnswer)) {
            leaks.push({ unit: unitIndex, lesson: lessonIndex, type: q.type, field: "correctAnswer", val: q.correctAnswer });
          }
          q.options?.forEach((opt: string) => {
            if (englishRegex.test(opt)) {
              leaks.push({ unit: unitIndex, lesson: lessonIndex, type: q.type, field: "option", val: opt });
            }
          });
        }
        if (q.type === "sentence_builder" || q.type === "listen_build") {
          q.wordBank?.forEach((w: string) => {
            if (englishRegex.test(w)) {
              leaks.push({ unit: unitIndex, lesson: lessonIndex, type: q.type, field: "wordBank", val: w });
            }
          });
          q.correctWords?.forEach((w: string) => {
            if (englishRegex.test(w)) {
              leaks.push({ unit: unitIndex, lesson: lessonIndex, type: q.type, field: "correctWords", val: w });
            }
          });
        }
        if (q.type === "fill_blank") {
          if (englishRegex.test(q.correctAnswer)) {
            leaks.push({ unit: unitIndex, lesson: lessonIndex, type: q.type, field: "correctAnswer", val: q.correctAnswer });
          }
          q.options?.forEach((opt: string) => {
            if (englishRegex.test(opt)) {
              leaks.push({ unit: unitIndex, lesson: lessonIndex, type: q.type, field: "option", val: opt });
            }
          });
          q.sentenceParts?.forEach((part: string) => {
            if (englishRegex.test(part)) {
              leaks.push({ unit: unitIndex, lesson: lessonIndex, type: q.type, field: "sentenceParts", val: part });
            }
          });
        }
        if (q.type === "pair_match" || q.type === "image_pair_match" || q.type === "memory_flip") {
          q.pairs?.forEach((pair: any) => {
            if (englishRegex.test(pair.english)) {
              leaks.push({ unit: unitIndex, lesson: lessonIndex, type: q.type, field: "pair.target", val: pair.english });
            }
          });
        }
        if (q.type === "conversation_pick" || q.type === "conversation_complete") {
          if (englishRegex.test(q.correctAnswer)) {
            leaks.push({ unit: unitIndex, lesson: lessonIndex, type: q.type, field: "correctAnswer", val: q.correctAnswer });
          }
          if (englishRegex.test(q.theyAsk)) {
            leaks.push({ unit: unitIndex, lesson: lessonIndex, type: q.type, field: "theyAsk", val: q.theyAsk });
          }
          q.options?.forEach((opt: string) => {
            if (englishRegex.test(opt)) {
              leaks.push({ unit: unitIndex, lesson: lessonIndex, type: q.type, field: "option", val: opt });
            }
          });
        }
      });
    });
  });

  return leaks;
}

describe("arabic target language leak detection", () => {
  beforeEach(() => {
    useLocaleStore.setState({
      selectedUiLanguage: "ku",
      selectedSourceLanguage: "ku",
      selectedTargetLanguage: "ar",
      locale: "ku",
    });
  });

  it("has ZERO English leaks across normal units in Arabic mode", () => {
    const leaks = findEnglishLeaks(NORMAL_UNITS, "normal");
    if (leaks.length > 0) {
      console.log("Normal leaks:", leaks.slice(0, 10));
    }
    expect(leaks.length).toBe(0);
  });

  it("has ZERO English leaks across kids units in Arabic mode", () => {
    const leaks = findEnglishLeaks(KIDS_UNITS, "kids");
    if (leaks.length > 0) {
      console.log("Kids leaks:", leaks.slice(0, 10));
    }
    expect(leaks.length).toBe(0);
  });

  it("has ZERO English leaks across street units in Arabic mode", () => {
    const leaks = findEnglishLeaks(ALL_UNITS, "street");
    if (leaks.length > 0) {
      console.log("Street leaks:", leaks.slice(0, 10));
    }
    expect(leaks.length).toBe(0);
  });
});
