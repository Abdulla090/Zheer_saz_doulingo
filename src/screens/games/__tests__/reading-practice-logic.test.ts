import { describe, expect, it } from "@jest/globals";
import {
  analyzeReadingPassage,
  evaluateGeminiReading,
  evaluateReadingTranscript,
  mergeReadingTranscript,
} from "../reading-practice-logic";

describe("reading practice assessment logic", () => {
  const passage = ["One two three. Four five six."];

  it("counts the generated passage before recording", () => {
    expect(analyzeReadingPassage(passage)).toEqual({
      wordCount: 6,
      sentenceCount: 2,
      paragraphCount: 1,
    });
  });

  it("merges continuous recognition chunks without duplicating cumulative text", () => {
    expect(mergeReadingTranscript("One two three", "One two three four five")).toBe(
      "One two three four five",
    );
    expect(mergeReadingTranscript("One two three", "three four five")).toBe(
      "One two three four five",
    );
  });

  it("scores correct words, sentences, order, pace, and duration", () => {
    const result = evaluateReadingTranscript(
      "One two three four five six",
      passage,
      "Beginner",
      4,
    );

    expect(result.correctWords).toBe(6);
    expect(result.totalWords).toBe(6);
    expect(result.correctSentences).toBe(2);
    expect(result.totalSentences).toBe(2);
    expect(result.coverageScore).toBe(100);
    expect(result.orderScore).toBe(100);
    expect(result.durationSeconds).toBe(4);
  });

  it("maps Gemini correctness onto the exact target passage shape", () => {
    const result = evaluateGeminiReading({
      transcript: "One two three four six",
      pronunciationScore: 82,
      wordAnalysis: [
        { word: "wrong label", correct: true },
        { word: "two", correct: true },
        { word: "three", correct: true },
        { word: "four", correct: true },
        { word: "five", correct: false },
        { word: "six", correct: true },
      ],
      paragraphs: passage,
      difficulty: "Beginner",
      durationSeconds: 8,
    });

    expect(result.wordResults.map((word) => word.word)).toEqual([
      "One",
      "two",
      "three.",
      "Four",
      "five",
      "six.",
    ]);
    expect(result.correctWords).toBe(5);
    expect(result.correctSentences).toBe(1);
    expect(result.pronunciationScore).toBe(82);
  });
});
