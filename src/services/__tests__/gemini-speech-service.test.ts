import { describe, expect, it, jest } from "@jest/globals";
import {
  countReadingSentences,
  countReadingWords,
  generateRolePlayVoiceResponse,
  parseRolePlayTurnPayload,
  parseRolePlayVoiceTurnPayload,
  validateGeneratedReadingPracticeParagraphs,
} from "../gemini-speech-service";

const mockGenerateGeminiContent = jest.fn<
  (...args: unknown[]) => Promise<unknown>
>();
jest.mock("../gemini-gateway", () => ({
  generateGeminiContent: (...args: unknown[]) => mockGenerateGeminiContent(...args),
}));

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

describe("role play coach payload", () => {
  it("parses a coached turn and normalizes unsafe model values", () => {
    const turn = parseRolePlayTurnPayload(`\`\`\`json
      {"reply":"Would you like anything else?","feedback":{"praise":"Clear order.","correction":null,"betterReply":"Could I have a coffee, please?","vocabulary":["anything else","to go","extra"],"scores":{"fluency":112,"naturalness":78.4,"mission":-5},"completedGoalIndexes":[0,0,7]}}
    \`\`\``);

    expect(turn.reply).toBe("Would you like anything else?");
    expect(turn.feedback.scores).toEqual({ fluency: 100, naturalness: 78, mission: 0 });
    expect(turn.feedback.completedGoalIndexes).toEqual([0]);
  });

  it("rejects malformed or incomplete premium feedback", () => {
    expect(() => parseRolePlayTurnPayload("not json")).toThrow("invalid response");
    expect(() => parseRolePlayTurnPayload('{"reply":"Hello"}')).toThrow("incomplete response");
  });

  it("keeps the STT transcript beside the coached voice turn", () => {
    const turn = parseRolePlayVoiceTurnPayload(JSON.stringify({
      transcript: "ممكن قهوة بدون سكر؟",
      reply: "أكيد، قهوة بدون سكر. هل تريد معها شيئاً؟",
      feedback: {
        praise: "طلب واضح وطبيعي.",
        correction: null,
        betterReply: "ممكن قهوة من دون سكر، لو سمحت؟",
        vocabulary: ["من دون سكر"],
        scores: { fluency: 88, naturalness: 91, mission: 80 },
        completedGoalIndexes: [0],
      },
    }));

    expect(turn.transcript).toBe("ممكن قهوة بدون سكر؟");
    expect(turn.reply).toContain("قهوة بدون سكر");
  });

  it("sends recorded audio through the dedicated voice roleplay policy", async () => {
    mockGenerateGeminiContent.mockResolvedValueOnce({
      candidates: [{ content: { parts: [{ text: JSON.stringify({
        transcript: "Можно мне кофе?",
        reply: "Конечно. С молоком или без?",
        feedback: {
          praise: "داواکارییەکەت ڕوون بوو.",
          correction: null,
          betterReply: "Можно мне кофе, пожалуйста?",
          vocabulary: ["пожалуйста"],
          scores: { fluency: 85, naturalness: 86, mission: 75 },
          completedGoalIndexes: [0],
        },
      }) }] } }],
    });

    const turn = await generateRolePlayVoiceResponse({
      scenarioId: "cafe",
      audioBase64: "ZmFrZS1hdWRpbw==",
      mimeType: "audio/webm;codecs=opus",
      history: [],
      goals: ["Заказать напиток"],
      targetLanguageCode: "ru",
      coachLanguageCode: "ku",
    });

    expect(turn.transcript).toBe("Можно мне кофе?");
    expect(mockGenerateGeminiContent).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        contents: [expect.objectContaining({
          parts: expect.arrayContaining([
            expect.objectContaining({ inline_data: {
              mime_type: "audio/webm",
              data: "ZmFrZS1hdWRpbw==",
            } }),
          ]),
        })],
      }),
      expect.objectContaining({ featureKey: "roleplay_voice_response" }),
    );
  });
});
