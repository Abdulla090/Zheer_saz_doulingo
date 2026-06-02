/** Client-side Gemini config (Expo requires EXPO_PUBLIC_ prefix). */
export function getGeminiApiKey(): string | undefined {
  const key = process.env.EXPO_PUBLIC_GEMINI_API_KEY?.trim();
  return key || undefined;
}

export function isGeminiConfigured(): boolean {
  return Boolean(getGeminiApiKey());
}

export const GEMINI_SPEECH_MODEL =
  process.env.EXPO_PUBLIC_GEMINI_MODEL?.trim() || "gemini-2.0-flash";
