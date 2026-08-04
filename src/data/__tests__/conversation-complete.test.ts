import { describe, expect, it, jest } from "@jest/globals";
import { getLessonQuestions, type LessonPathMode } from "../lesson-content";
import { NORMAL_UNITS } from "../normal-english";
import { ALL_UNITS } from "../units";

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

/**
 * The conversation-complete drill reuses the same authored scenarios as
 * conversation_pick, so the risks are duplication (same scenario twice in one
 * lesson) and malformed option sets (answer missing, or a distractor equal to
 * the answer). Both are data-shape properties worth pinning.
 */
describe("conversation_complete generation", () => {
  const LESSONS: [number, number][] = [
    [0, 0],
    [0, 1],
    [1, 0],
    [2, 3],
    [3, 5],
  ];

  const PATHS: [Exclude<LessonPathMode, "custom">, typeof ALL_UNITS][] = [
    ["normal", NORMAL_UNITS],
    ["street", ALL_UNITS],
  ];

  it.each(LESSONS)("unit %i lesson %i produces a well-formed question", (unit, lesson) => {
    const questions = getLessonQuestions(unit, lesson, "normal");
    const complete = questions.filter((q) => q.type === "conversation_complete");

    // Banks hold 1-2 scenarios; the second one funds this drill, so a
    // single-scenario lesson legitimately has none.
    expect(complete.length).toBeLessThanOrEqual(1);
    if (complete.length === 0) return;

    const q = complete[0] as Extract<
      (typeof questions)[number],
      { type: "conversation_complete" }
    >;

    expect(q.theyAsk.trim().length).toBeGreaterThan(0);
    expect(q.correctAnswer.trim().length).toBeGreaterThan(0);
    // The answer must be pickable.
    expect(q.options).toContain(q.correctAnswer);
    // No duplicate options — a repeated distractor makes two "wrong" tiles identical.
    expect(new Set(q.options).size).toBe(q.options.length);
    expect(q.options.length).toBeGreaterThanOrEqual(2);
    expect(q.xp).toBeGreaterThan(0);
  });

  /**
   * The regression this file was written after: the drill originally indexed
   * `convos[2 % convos.length]`, and since no authored bank holds three
   * scenarios that always resolved to `convos[0]` — the very dialogue the pick
   * drill had just shown. Asserted across every bundled lesson rather than a
   * sample, and the count guard below keeps it from passing vacuously.
   */
  it("never replays a scenario the pick drill already used", () => {
    let checked = 0;

    for (const [path, units] of PATHS) {
      units.forEach((unit, unitIndex) => {
        unit.forEach((_, lessonIndex) => {
          const questions = getLessonQuestions(unitIndex, lessonIndex, path);
          const complete = questions.find((q) => q.type === "conversation_complete");
          if (!complete) return;

          const pickPrompts = questions
            .filter((q) => q.type === "conversation_pick")
            .map((p) => (p as any).theyAsk);

          expect(pickPrompts).not.toContain((complete as any).theyAsk);
          checked++;
        });
      });
    }

    // Guard: if generation stops emitting the drill, fail loudly instead of
    // silently asserting nothing.
    expect(checked).toBeGreaterThan(20);
  });

  it("is deterministic for a given lesson", () => {
    const a = getLessonQuestions(1, 2, "normal").find(
      (q) => q.type === "conversation_complete",
    );
    const b = getLessonQuestions(1, 2, "normal").find(
      (q) => q.type === "conversation_complete",
    );
    expect(a).toEqual(b);
  });

  it("carries lesson language metadata like every other game", () => {
    const q = getLessonQuestions(0, 0, "normal").find(
      (x) => x.type === "conversation_complete",
    );
    expect(q?.sourceLanguage).toBe("ku");
    expect(q?.targetLanguage).toBe("en");
  });

  it("covers every normal unit without throwing", () => {
    NORMAL_UNITS.forEach((unit, unitIndex) => {
      unit.forEach((_, lessonIndex) => {
        const questions = getLessonQuestions(unitIndex, lessonIndex, "normal");
        const complete = questions.filter((q) => q.type === "conversation_complete");
        expect(complete.length).toBeLessThanOrEqual(1);
        for (const q of complete) {
          expect((q as any).options).toContain((q as any).correctAnswer);
        }
      });
    });
  });
});
