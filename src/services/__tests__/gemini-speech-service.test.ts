import { describe, expect, it } from "@jest/globals";
import {
  countReadingWords,
  normalizeReadingPracticeParagraphs,
} from "../gemini-speech-service";

describe("gemini-speech-service reading practice helpers", () => {
  it("pads short AI output to the requested word count", () => {
    const paragraphs = normalizeReadingPracticeParagraphs(
      ["This is too short."],
      "Intermediate",
      1,
      130,
    );

    expect(paragraphs).toHaveLength(1);
    expect(countReadingWords(paragraphs[0])).toBeGreaterThanOrEqual(130);
  });

  it("creates the requested paragraph count when Gemini returns too few paragraphs", () => {
    const paragraphs = normalizeReadingPracticeParagraphs(
      ["Only one short paragraph."],
      "Advanced",
      3,
      90,
    );

    expect(paragraphs).toHaveLength(3);
    expect(paragraphs.every((paragraph) => countReadingWords(paragraph) >= 90)).toBe(true);
  });

  it("clamps paragraph and word count to safe practice limits", () => {
    const paragraphs = normalizeReadingPracticeParagraphs([], "Beginner", 9, 500);

    expect(paragraphs).toHaveLength(3);
    expect(paragraphs.every((paragraph) => countReadingWords(paragraph) >= 220)).toBe(true);
  });
});
