import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import {
  evaluateEnglish,
  evaluateSpokenEnglish,
} from "../ai-teacher-service";
import { generateGeminiContent } from "../gemini-gateway";

jest.mock("../gemini-gateway", () => ({
  generateGeminiContent: jest.fn(),
}));

const mockedGenerate = generateGeminiContent as jest.MockedFunction<
  typeof generateGeminiContent
>;

const AI_RESULT = {
  candidates: [
    {
      content: {
        parts: [
          {
            text: JSON.stringify({
              overallScore: 7.4,
              transcript:
                "I think learning English is important because it creates opportunities.",
              criteria: [
                { key: "fluency", score: 7.2, note: "Ideas connect clearly." },
                { key: "lexical", score: 7.6, note: "Vocabulary fits the topic." },
                { key: "grammar", score: 7.1, note: "Most structures are accurate." },
                { key: "pronunciation", score: 7.5, note: "Speech is intelligible." },
              ],
              strengths: ["Clear main idea."],
              improvements: ["Add one specific example."],
              sampleRewrite: "Learning English creates opportunities in work and study.",
            }),
          },
        ],
      },
    },
  ],
};

describe("ai-teacher-service", () => {
  beforeEach(() => {
    mockedGenerate.mockReset();
    mockedGenerate.mockResolvedValue(AI_RESULT);
  });

  it("should fail when input text is too short", async () => {
    await expect(
      evaluateEnglish({
        text: "Too short",
        mode: "writing",
      })
    ).rejects.toThrow("Answer too short");
  });

  it("should evaluate a valid English sentence successfully", async () => {
    const result = await evaluateEnglish({
      text: "I think learning English is extremely important because it opens up many job opportunities.",
      mode: "writing",
    });

    expect(result).toBeDefined();
    expect(result.overallBand).toBeGreaterThanOrEqual(1);
    expect(result.overallBand).toBeLessThanOrEqual(10);
    expect(result.criteria.length).toBe(4);
    expect(result.source).toBe("ai");
  });

  it("sends the recorded audio for speaking evaluation", async () => {
    const result = await evaluateSpokenEnglish({
      audioBase64: "ZmFrZS1hdWRpbw==",
      mimeType: "audio/webm;codecs=opus",
      promptId: "hometown",
    });

    expect(result.transcript).toContain("learning English");
    expect(result.overallBand).toBe(7.4);
    expect(mockedGenerate).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        contents: [
          expect.objectContaining({
            parts: expect.arrayContaining([
              expect.objectContaining({
                inline_data: {
                  mime_type: "audio/webm",
                  data: "ZmFrZS1hdWRpbw==",
                },
              }),
            ]),
          }),
        ],
      }),
      expect.objectContaining({
        featureKey: "ai_teacher_speaking",
        timeoutMs: 90000,
      }),
    );
  });
});
