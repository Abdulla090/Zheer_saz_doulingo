// Only server-owned policies select models, output budgets and provider tools.
export const AI_REQUEST_POLICIES = {
  ai_teacher_writing: { model: "gemini-3.6-flash", maxOutputTokens: 768 },
  ai_teacher_speaking: { model: "gemini-3.6-flash", maxOutputTokens: 768 },
  reading_pronunciation_evaluation: { model: "gemini-3.6-flash", maxOutputTokens: 768 },
  reading_passage_generation: { model: "gemini-3.5-flash-lite", maxOutputTokens: 1024 },
  roleplay_text_response: { model: "gemini-3.5-flash-lite", maxOutputTokens: 512 },
  roleplay_voice_response: { model: "gemini-3.5-flash-lite", maxOutputTokens: 512 },
  study_tutor: { model: "gemini-3.6-flash", maxOutputTokens: 4096 },
} as const;

export function getAiRequestPolicy(feature: unknown) {
  if (typeof feature !== "string" || !Object.hasOwn(AI_REQUEST_POLICIES, feature)) return null;
  return AI_REQUEST_POLICIES[feature as keyof typeof AI_REQUEST_POLICIES];
}

export function isRequestObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
