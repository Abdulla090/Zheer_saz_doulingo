import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { previewLessonQuestions, type LessonPathMode } from "../lesson-content";
import { NORMAL_UNITS } from "../normal-english";
import { KIDS_UNITS } from "../kids-english";
import { ALL_UNITS } from "../units";
import { useLocaleStore } from "../../stores/useLocaleStore";

jest.mock("@react-native-async-storage/async-storage", () =>
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

function findNonRussianLeaks(units: any[][], mode: LessonPathMode) {
  const leaks: Array<{ unit: number; lesson: number; type: string; field: string; val: any }> = [];
  // English words (2+ Latin chars) or Arabic characters (\u0600-\u06FF) in target fields
  const leakRegex = /[a-zA-Z]{2,}|[\u0600-\u06FF]/;

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
          if (leakRegex.test(q.correctAnswer)) {
            leaks.push({ unit: unitIndex, lesson: lessonIndex, type: q.type, field: "correctAnswer", val: q.correctAnswer });
          }
          q.options?.forEach((opt: string) => {
            if (leakRegex.test(opt)) {
              leaks.push({ unit: unitIndex, lesson: lessonIndex, type: q.type, field: "option", val: opt });
            }
          });
        }
        if (q.type === "sentence_builder" || q.type === "listen_build") {
          q.wordBank?.forEach((w: string) => {
            if (leakRegex.test(w)) {
              leaks.push({ unit: unitIndex, lesson: lessonIndex, type: q.type, field: "wordBank", val: w });
            }
          });
          q.correctWords?.forEach((w: string) => {
            if (leakRegex.test(w)) {
              leaks.push({ unit: unitIndex, lesson: lessonIndex, type: q.type, field: "correctWords", val: w });
            }
          });
        }
        if (q.type === "fill_blank") {
          if (leakRegex.test(q.correctAnswer)) {
            leaks.push({ unit: unitIndex, lesson: lessonIndex, type: q.type, field: "correctAnswer", val: q.correctAnswer });
          }
          q.options?.forEach((opt: string) => {
            if (leakRegex.test(opt)) {
              leaks.push({ unit: unitIndex, lesson: lessonIndex, type: q.type, field: "option", val: opt });
            }
          });
          q.sentenceParts?.forEach((part: string) => {
            if (leakRegex.test(part)) {
              leaks.push({ unit: unitIndex, lesson: lessonIndex, type: q.type, field: "sentenceParts", val: part });
            }
          });
        }
        if (q.type === "pair_match" || q.type === "image_pair_match" || q.type === "memory_flip") {
          q.pairs?.forEach((pair: any) => {
            if (leakRegex.test(pair.english)) {
              leaks.push({ unit: unitIndex, lesson: lessonIndex, type: q.type, field: "pair.target", val: pair.english });
            }
          });
        }
        if (q.type === "conversation_pick" || q.type === "conversation_complete") {
          if (leakRegex.test(q.correctAnswer)) {
            leaks.push({ unit: unitIndex, lesson: lessonIndex, type: q.type, field: "correctAnswer", val: q.correctAnswer });
          }
          if (leakRegex.test(q.theyAsk)) {
            leaks.push({ unit: unitIndex, lesson: lessonIndex, type: q.type, field: "theyAsk", val: q.theyAsk });
          }
          q.options?.forEach((opt: string) => {
            if (leakRegex.test(opt)) {
              leaks.push({ unit: unitIndex, lesson: lessonIndex, type: q.type, field: "option", val: opt });
            }
          });
        }
      });
    });
  });

  return leaks;
}

describe("russian target language leak detection", () => {
  beforeEach(() => {
    useLocaleStore.setState({
      selectedUiLanguage: "ku",
      selectedSourceLanguage: "ku",
      selectedTargetLanguage: "ru",
      locale: "ku",
    });
  });

  it("has ZERO English or Arabic leaks across normal units in Russian mode", () => {
    const leaks = findNonRussianLeaks(NORMAL_UNITS, "normal");
    if (leaks.length > 0) {
      console.log("Normal leaks count:", leaks.length, "Sample:", leaks.slice(0, 10));
    }
    expect(leaks.length).toBe(0);
  });

  it("has ZERO English or Arabic leaks across kids units in Russian mode", () => {
    const leaks = findNonRussianLeaks(KIDS_UNITS, "kids");
    if (leaks.length > 0) {
      console.log("Kids leaks count:", leaks.length, "Sample:", leaks.slice(0, 10));
    }
    expect(leaks.length).toBe(0);
  });

  it("has ZERO English or Arabic leaks across street units in Russian mode", () => {
    const leaks = findNonRussianLeaks(ALL_UNITS, "street");
    if (leaks.length > 0) {
      console.log("Street leaks count:", leaks.length, "Sample:", leaks.slice(0, 10));
    }
    expect(leaks.length).toBe(0);
  });
});
