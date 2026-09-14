import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { previewLessonQuestions } from "../lesson-content";
import { NORMAL_UNITS } from "../normal-english";
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

const leakRegex = /[a-zA-Z]{2,}|[\u0600-\u06FF]/;

function checkUnit(unitBank: any, name: string, unitIndex: number) {
  const leaks: any[] = [];
  unitBank.forEach((lesson: any, lessonIndex: number) => {
    const questions = previewLessonQuestions(lesson, unitIndex, lessonIndex, "normal");
    questions.forEach((q: any) => {
      if (q.type === "multiple_choice" || q.type === "image_multiple_choice") {
        if (leakRegex.test(q.correctAnswer)) {
          leaks.push({ lesson: lessonIndex, type: q.type, field: "correctAnswer", val: q.correctAnswer });
        }
        q.options?.forEach((opt: string) => {
          if (leakRegex.test(opt)) {
            leaks.push({ lesson: lessonIndex, type: q.type, field: "option", val: opt });
          }
        });
      }
      if (q.type === "sentence_builder" || q.type === "listen_build") {
        q.wordBank?.forEach((w: string) => {
          if (leakRegex.test(w)) {
            leaks.push({ lesson: lessonIndex, type: q.type, field: "wordBank", val: w });
          }
        });
        q.correctWords?.forEach((w: string) => {
          if (leakRegex.test(w)) {
            leaks.push({ lesson: lessonIndex, type: q.type, field: "correctWords", val: w });
          }
        });
      }
      if (q.type === "fill_blank") {
        if (leakRegex.test(q.correctAnswer)) {
          leaks.push({ lesson: lessonIndex, type: q.type, field: "correctAnswer", val: q.correctAnswer });
        }
        q.options?.forEach((opt: string) => {
          if (leakRegex.test(opt)) {
            leaks.push({ lesson: lessonIndex, type: q.type, field: "option", val: opt });
          }
        });
        q.sentenceParts?.forEach((part: string) => {
          if (leakRegex.test(part)) {
            leaks.push({ lesson: lessonIndex, type: q.type, field: "sentenceParts", val: part });
          }
        });
      }
      if (q.type === "pair_match" || q.type === "image_pair_match" || q.type === "memory_flip") {
        q.pairs?.forEach((pair: any) => {
          if (leakRegex.test(pair.english)) {
            leaks.push({ lesson: lessonIndex, type: q.type, field: "pair.target", val: pair.english });
          }
        });
      }
      if (q.type === "conversation_pick" || q.type === "conversation_complete") {
        if (leakRegex.test(q.correctAnswer)) {
          leaks.push({ lesson: lessonIndex, type: q.type, field: "correctAnswer", val: q.correctAnswer });
        }
        if (leakRegex.test(q.theyAsk)) {
          leaks.push({ lesson: lessonIndex, type: q.type, field: "theyAsk", val: q.theyAsk });
        }
        q.options?.forEach((opt: string) => {
          if (leakRegex.test(opt)) {
            leaks.push({ lesson: lessonIndex, type: q.type, field: "option", val: opt });
          }
        });
      }
    });
  });
  return leaks;
}

describe("Subagent 2 Units Russian Target Language & Leak Tests", () => {
  beforeEach(() => {
    useLocaleStore.setState({
      selectedUiLanguage: "ku",
      selectedSourceLanguage: "ku",
      selectedTargetLanguage: "ru",
      locale: "ku",
    });
  });

  it("checks NORMAL_UNITS[8] (unit-6-travel-and-exploring)", () => {
    const leaks = checkUnit(NORMAL_UNITS[8], "Unit 6 Travel & Exploring", 8);
    expect(leaks.length).toBe(0);
  });

  it("checks NORMAL_UNITS[14] (unit-7-idioms-and-slang)", () => {
    const leaks = checkUnit(NORMAL_UNITS[14], "Unit 7 Idioms & Slang", 14);
    expect(leaks.length).toBe(0);
  });

  it("checks NORMAL_UNITS[6] (unit-8-digital-life)", () => {
    const leaks = checkUnit(NORMAL_UNITS[6], "Unit 8 Digital Life", 6);
    expect(leaks.length).toBe(0);
  });

  it("checks NORMAL_UNITS[7] (unit-9-relationships)", () => {
    const leaks = checkUnit(NORMAL_UNITS[7], "Unit 9 Relationships", 7);
    expect(leaks.length).toBe(0);
  });

  it("checks NORMAL_UNITS[9] (unit-10-health-emergencies)", () => {
    const leaks = checkUnit(NORMAL_UNITS[9], "Unit 10 Health Emergencies", 9);
    expect(leaks.length).toBe(0);
  });
});
