import { describe, expect, it } from "@jest/globals";
import { NORMAL_UNITS } from "../normal-english";
import type { LessonBank } from "../types";

/**
 * A learner should never meet the same sentence twice inside one lesson. The
 * five game slots (words / voices / sentences / fill-blanks / conversations)
 * each drill the lesson topic with *different* material, so repetition across
 * slots means the lesson teaches less than it appears to.
 */

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9' ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Every English string a lesson shows, grouped by which game shows it. */
function englishBySlot(lesson: LessonBank): Record<string, string[]> {
  return {
    words: lesson.words.map((w) => w.english),
    voices: lesson.voices.map((v) => v.target),
    sentences: lesson.sentences.map((s) => s.english.join(" ")),
    fillBlanks: lesson.fillBlanks.map(
      (f) => `${f.parts[0]}${f.answer}${f.parts[1]}`,
    ),
  };
}

describe("Normal English lessons do not repeat themselves", () => {
  it("never shows the same sentence in two different games of one lesson", () => {
    const offenders: string[] = [];

    NORMAL_UNITS.forEach((unit, unitIndex) => {
      unit.forEach((lesson, lessonIndex) => {
        const slots = englishBySlot(lesson);
        const seen = new Map<string, string>();

        Object.entries(slots).forEach(([slot, values]) => {
          values.forEach((value) => {
            const key = normalize(value);
            if (!key) return;
            const previous = seen.get(key);
            if (previous && previous !== slot) {
              offenders.push(
                `unit ${unitIndex} lesson ${lessonIndex} "${lesson.topic}": ` +
                  `"${value}" appears in both ${previous} and ${slot}`,
              );
            } else if (!previous) {
              seen.set(key, slot);
            }
          });
        });
      });
    });

    expect(offenders).toEqual([]);
  });

  it("never repeats a sentence twice inside the same game", () => {
    const offenders: string[] = [];

    NORMAL_UNITS.forEach((unit, unitIndex) => {
      unit.forEach((lesson, lessonIndex) => {
        Object.entries(englishBySlot(lesson)).forEach(([slot, values]) => {
          const seen = new Set<string>();
          values.forEach((value) => {
            const key = normalize(value);
            if (!key) return;
            if (seen.has(key)) {
              offenders.push(
                `unit ${unitIndex} lesson ${lessonIndex} "${lesson.topic}": ` +
                  `${slot} repeats "${value}"`,
              );
            }
            seen.add(key);
          });
        });
      });
    });

    expect(offenders).toEqual([]);
  });

  it("offers distinct fill-blank options so exactly one answer is right", () => {
    const offenders: string[] = [];

    NORMAL_UNITS.forEach((unit, unitIndex) => {
      unit.forEach((lesson, lessonIndex) => {
        lesson.fillBlanks.forEach((blank, blankIndex) => {
          const where = `unit ${unitIndex} lesson ${lessonIndex} fillBlank ${blankIndex}`;
          const options = [blank.answer, ...blank.wrongs].map((o) =>
            normalize(o),
          );
          if (new Set(options).size !== options.length) {
            offenders.push(`${where}: duplicate English options ${options.join(" / ")}`);
          }
          if (blank.arabicAnswer && blank.arabicWrongs) {
            const ar = [blank.arabicAnswer, ...blank.arabicWrongs].map((o) =>
              o.trim(),
            );
            if (new Set(ar).size !== ar.length) {
              offenders.push(`${where}: duplicate Arabic options ${ar.join(" / ")}`);
            }
          }
        });
      });
    });

    expect(offenders).toEqual([]);
  });

  it("offers distinct conversation replies", () => {
    const offenders: string[] = [];

    NORMAL_UNITS.forEach((unit, unitIndex) => {
      unit.forEach((lesson, lessonIndex) => {
        lesson.conversations.forEach((convo, convoIndex) => {
          const replies = [
            convo.correct,
            convo.wrong1,
            convo.wrong2,
            convo.wrong3,
          ].map((r) => normalize(r));
          if (new Set(replies).size !== replies.length) {
            offenders.push(
              `unit ${unitIndex} lesson ${lessonIndex} conversation ${convoIndex}: duplicate options`,
            );
          }
        });
      });
    });

    expect(offenders).toEqual([]);
  });
});
