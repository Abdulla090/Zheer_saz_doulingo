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

describe("Subagent 3 Units Russian Leaks", () => {
  beforeEach(() => {
    useLocaleStore.setState({
      selectedUiLanguage: "ku",
      selectedSourceLanguage: "ku",
      selectedTargetLanguage: "ru",
      locale: "ku",
    });
  });

  function logCoverage(unit: any, name: string) {
    const words = unit.flatMap((l: any) => l.words);
    const voices = unit.flatMap((l: any) => l.voices);
    const sentences = unit.flatMap((l: any) => l.sentences);
    const fills = unit.flatMap((l: any) => l.fillBlanks);
    const convos = unit.flatMap((l: any) => l.conversations);
    console.log(`${name} raw coverage:`, {
      topicsRu: unit.filter((l: any) => Boolean(l.topicRu)).length + "/" + unit.length,
      wordsRu: words.filter((w: any) => Boolean(w.russian)).length + "/" + words.length,
      voicesRu: voices.filter((v: any) => Boolean(v.promptRu && v.targetRussian)).length + "/" + voices.length,
      sentencesRu: sentences.filter((s: any) => Boolean(s.russian)).length + "/" + sentences.length,
      fillsRu: fills.filter((f: any) => Boolean(f.russianHint)).length + "/" + fills.length,
      convosRu: convos.filter((c: any) => Boolean(c.correctRu)).length + "/" + convos.length,
    });
  }

  it("checks NORMAL_UNITS[2] (unit-11-money-shopping)", () => {
    logCoverage(NORMAL_UNITS[2], "Unit 11");
    const leaks = checkUnit(NORMAL_UNITS[2], "unit11", 2);
    console.log("Unit 11 leaks count:", leaks.length, leaks.slice(0, 5));
    expect(leaks.length).toBe(0);
  });

  it("checks NORMAL_UNITS[9] (unit-10-health-emergencies)", () => {
    logCoverage(NORMAL_UNITS[9], "Unit 10");
    const leaks = checkUnit(NORMAL_UNITS[9], "unit10", 9);
    console.log("Unit 10 leaks count:", leaks.length, leaks.slice(0, 5));
    expect(leaks.length).toBe(0);
  });

  it("checks NORMAL_UNITS[12] (unit-13-opinions-and-confidence)", () => {
    logCoverage(NORMAL_UNITS[12], "Unit 13");
    const leaks = checkUnit(NORMAL_UNITS[12], "unit13", 12);
    console.log("Unit 13 leaks count:", leaks.length, leaks.slice(0, 5));
    expect(leaks.length).toBe(0);
  });

  it("checks NORMAL_UNITS[16] (unit-12-real-world-mastery)", () => {
    logCoverage(NORMAL_UNITS[16], "Unit 12");
    const leaks = checkUnit(NORMAL_UNITS[16], "unit12", 16);
    console.log("Unit 12 leaks count:", leaks.length, leaks.slice(0, 5));
  });

  it("checks NORMAL_UNITS[10] (unit-15-logic-plans)", () => {
    logCoverage(NORMAL_UNITS[10], "Unit 15");
    const leaks = checkUnit(NORMAL_UNITS[10], "unit15", 10);
    console.log("Unit 15 leaks count:", leaks.length, leaks.slice(0, 5));
  });

  it("checks NORMAL_UNITS[13] (unit-16-science-media)", () => {
    logCoverage(NORMAL_UNITS[13], "Unit 16");
    const leaks = checkUnit(NORMAL_UNITS[13], "unit16", 13);
    console.log("Unit 16 leaks count:", leaks.length, leaks.slice(0, 5));
  });
});
