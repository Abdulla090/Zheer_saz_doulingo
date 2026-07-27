import { describe, expect, it } from "@jest/globals";
import {
  countReadingSentences,
  countReadingWords,
  validateGeneratedReadingPracticeParagraphs,
} from "../gemini-speech-service";

describe("gemini-speech-service reading practice helpers", () => {
  it("keeps only model-generated words and formats them for display", () => {
    const modelWords = Array.from({ length: 90 }, (_, index) => `word${index + 1}`).join(" ");
    const paragraphs = validateGeneratedReadingPracticeParagraphs(
      [modelWords],
      1,
      90,
    );

    expect(paragraphs).toHaveLength(1);
    expect(countReadingWords(paragraphs[0])).toBe(90);
    expect(paragraphs[0].split("\n")).toHaveLength(3);
    expect(paragraphs[0]).toContain("word90");
  });

  it("rejects incomplete model output instead of padding it with mock text", () => {
    expect(() =>
      validateGeneratedReadingPracticeParagraphs(["Only one short paragraph."], 1, 90),
    ).toThrow("incomplete passage");
  });

  it("rejects missing passages instead of creating local replacements", () => {
    expect(() => validateGeneratedReadingPracticeParagraphs([], 3, 90)).toThrow(
      "fewer passages",
    );
  });

  it("still counts sentences in generated content", () => {
    expect(countReadingSentences("One sentence. Two sentences! Three?")).toBe(3);
  });
});
