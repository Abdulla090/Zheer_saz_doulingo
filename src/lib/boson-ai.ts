/**
 * Legacy compatibility shim.
 *
 * Direct Boson credentials are intentionally unsupported because any
 * EXPO_PUBLIC_* secret can be extracted from a production bundle. Twino uses
 * its authenticated Gemini gateway or the device speech engine instead.
 */
export function isBosonConfigured(): boolean {
  return false;
}

export async function generateSpeech(_text: string, _voice = "default") {
  throw new Error("Legacy Boson TTS is disabled in production.");
}

export async function playBosonSpeech(text: string) {
  await generateSpeech(text);
}
