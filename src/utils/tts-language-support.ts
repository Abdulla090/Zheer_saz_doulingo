/**
 * Which languages the *device* speech engine can actually pronounce.
 *
 * `useTTS` maps Kurdish onto the `ar-IQ` voice because no shipping Android or
 * iOS TTS engine carries a Sorani voice. That fallback is worse than silence
 * for lesson content: the Arabic voice reads Kurdish orthography with Arabic
 * phonology, so learners hear a word that is not the one on screen. Callers
 * that would otherwise speak source-language text should check this first and
 * render no audio affordance at all when it returns false.
 *
 * This is about the device engine only. Cloud providers (Gemini) are not
 * constrained by the installed voice set and are gated separately.
 */

const DEVICE_TTS_UNSUPPORTED = new Set(["ku", "ckb", "kmr", "sdh"]);

/** Normalize a BCP-47ish tag down to its primary subtag. */
function primarySubtag(languageCode?: string | null): string {
  return (languageCode ?? "")
    .trim()
    .replace(/_/g, "-")
    .split("-")[0]
    .toLowerCase();
}

/** True when the on-device speech engine has a real voice for this language. */
export function isDeviceTtsSupported(languageCode?: string | null): boolean {
  const primary = primarySubtag(languageCode);
  if (!primary) return false;
  return !DEVICE_TTS_UNSUPPORTED.has(primary);
}
