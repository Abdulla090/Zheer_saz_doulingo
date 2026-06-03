/** Client-side Gemini config (Expo requires EXPO_PUBLIC_ prefix). */
export function getGeminiApiKey(): string | undefined {
  const key = process.env.EXPO_PUBLIC_GEMINI_API_KEY?.trim();
  return key || undefined;
}

export function isGeminiConfigured(): boolean {
  return Boolean(getGeminiApiKey());
}

/** REST model for speech grading in lessons. */
export const GEMINI_SPEECH_MODEL =
  process.env.EXPO_PUBLIC_GEMINI_MODEL?.trim() || "gemini-2.0-flash";

/**
 * Gemini Live native-audio model (voice-in / voice-out over WebSocket).
 * @see https://ai.google.dev/gemini-api/docs/live-api/capabilities
 */
export const GEMINI_LIVE_MODEL =
  process.env.EXPO_PUBLIC_GEMINI_LIVE_MODEL?.trim() ||
  "gemini-3.1-flash-live-preview";

export const GEMINI_LIVE_WS_HOST = "generativelanguage.googleapis.com";

export function getGeminiLiveWebSocketUrl(): string | null {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return null;
  return `wss://${GEMINI_LIVE_WS_HOST}/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${apiKey}`;
}

/** Input: 16-bit PCM mono 16 kHz. Output: 16-bit PCM mono 24 kHz. */
export const GEMINI_LIVE_INPUT_RATE = 16_000;
export const GEMINI_LIVE_OUTPUT_RATE = 24_000;
