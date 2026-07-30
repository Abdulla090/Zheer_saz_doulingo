import { describe, expect, it } from "@jest/globals";
import type { UnitBank } from "../types";
import unit5 from "../normal-english/unit-1-everyday-essentials";
import unit6 from "../normal-english/unit-2-social-and-daily-life";
import unit7 from "../normal-english/unit-8-digital-life";
import unit8 from "../normal-english/unit-9-relationships";
import unit9 from "../normal-english/unit-6-travel-and-exploring";
import unit10 from "../normal-english/unit-10-health-emergencies";

const FOUNDATION_UNITS: UnitBank[] = [unit5, unit6, unit7, unit8, unit9, unit10];

describe("Normal English units 5-10 content quality", () => {
  it("ships ten complete lessons in every premium unit", () => {
    FOUNDATION_UNITS.forEach((unit) => {
      expect(unit).toHaveLength(10);
      unit.forEach((lesson) => {
        expect(lesson.words.length).toBeGreaterThanOrEqual(5);
        expect(lesson.voices.length).toBeGreaterThanOrEqual(2);
        expect(lesson.sentences.length).toBeGreaterThanOrEqual(2);
        expect(lesson.fillBlanks.length).toBeGreaterThanOrEqual(2);
        expect(lesson.conversations.length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  it("includes Kurdish and Arabic learning context for every lesson and phrase", () => {
    FOUNDATION_UNITS.flat().forEach((lesson) => {
      expect(lesson.topicKu.trim()).not.toBe("");
      expect(lesson.topicAr?.trim()).not.toBe("");
      lesson.words.forEach((phrase) => {
        expect(phrase.kurdish.trim()).not.toBe("");
        expect(phrase.arabic?.trim()).not.toBe("");
      });
    });
  });

  it("contains no corrupted replacement characters", () => {
    expect(JSON.stringify(FOUNDATION_UNITS)).not.toContain("�");
  });
});
