import { evaluateEnglish } from "../ai-teacher-service";

describe("ai-teacher-service", () => {
  it("should fail when input text is too short", async () => {
    await expect(
      evaluateEnglish({
        text: "Too short",
        mode: "writing",
        nativeLang: "ku",
        targetLang: "en",
      })
    ).rejects.toThrow("Answer too short");
  });

  it("should evaluate a valid English sentence successfully", async () => {
    const result = await evaluateEnglish({
      text: "I think learning English is extremely important because it opens up many job opportunities.",
      mode: "writing",
      nativeLang: "ku",
      targetLang: "en",
    });

    expect(result).toBeDefined();
    expect(result.overallBand).toBeGreaterThanOrEqual(4);
    expect(result.overallBand).toBeLessThanOrEqual(9);
    expect(result.criteria.length).toBe(4);
    expect(result.strengths.length).toBeGreaterThanOrEqual(0);
  });
});
