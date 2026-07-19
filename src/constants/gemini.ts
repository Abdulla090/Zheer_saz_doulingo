/**
 * Client-side Gemini configuration.
 *
 * Gemini credentials never ship in the app. REST requests go through the
 * authenticated Supabase `gemini-generate` Edge Function.
 */
export function isGeminiConfigured(): boolean {
  return Boolean(
    process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim(),
  );
}

/** REST model for speech grading and text generation. */
export const GEMINI_SPEECH_MODEL =
  process.env.EXPO_PUBLIC_GEMINI_MODEL?.trim() || "gemini-3.5-flash";

/** Fallback model when the primary hits quota / rate limits. */
export const GEMINI_FALLBACK_MODEL = "gemini-3.1-flash-lite";

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
