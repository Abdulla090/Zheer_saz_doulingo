/**
 * Client-side Gemini configuration.
 *
 * Gemini credentials never ship in the app. REST requests go through the
 * authenticated Supabase `gemini-generate` Edge Function.
 */
export function getGeminiApiKey(): string {
  return (
    process.env.EXPO_PUBLIC_GEMINI_API_KEY?.trim() ||
    process.env.GEMINI_API_KEY?.trim() ||
    ""
  );
}

export function hasDirectGeminiKey(): boolean {
  return Boolean(getGeminiApiKey());
}

export function isGeminiConfigured(): boolean {
  return Boolean(
    hasDirectGeminiKey() ||
      (process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() &&
        process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim()),
  );
}

/** REST model for speech grading and text generation. */
export const GEMINI_SPEECH_MODEL =
  "gemini-3.6-flash";

export function isGeminiLiveConfigured(): boolean {
  return isGeminiConfigured();
}

export function getGeminiLiveWebSocketUrl(ephemeralToken: string): string {
  return (
    "wss://generativelanguage.googleapis.com/ws/" +
    "google.ai.generativelanguage.v1alpha.GenerativeService." +
    "BidiGenerateContentConstrained?access_token=" +
    encodeURIComponent(ephemeralToken)
  );
}

export const GEMINI_LIVE_MODEL = "gemini-3.1-flash-live-preview";
export const GEMINI_LIVE_INPUT_RATE = 16_000;
export const GEMINI_LIVE_OUTPUT_RATE = 24_000;
