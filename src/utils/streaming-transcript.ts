import { Direction, getLanguageDirection } from "../i18n/direction";

const NO_SPACE_BEFORE = /^[,.;:!?%\)\]\}،؛؟»]/u;
const NO_SPACE_AFTER = /[\(\[\{¡¿«]$/u;

/**
 * Merge a transcription update that may be either a cumulative snapshot or a
 * delta. Leading whitespace in deltas is meaningful and must not be trimmed:
 * Gemini commonly sends it as the boundary between streamed words.
 */
export function mergeStreamingTranscript(current: string, update: string): string {
  const normalizedUpdate = update.replace(/\s+/gu, " ");
  const incoming = normalizedUpdate.trimEnd();
  if (!incoming.trim()) return current;

  const snapshot = incoming.trimStart();
  if (!current) return snapshot;
  if (snapshot === current || current.endsWith(snapshot)) return current;
  if (snapshot.startsWith(current)) return snapshot;

  if (/^\s/u.test(incoming)) {
    return `${current.trimEnd()} ${snapshot}`;
  }

  if (
    /\s$/u.test(current) ||
    NO_SPACE_BEFORE.test(snapshot) ||
    NO_SPACE_AFTER.test(current) ||
    snapshot.startsWith("'") ||
    current.endsWith("'")
  ) {
    return current + snapshot;
  }

  // Handle opening inverted punctuation for Spanish without leading space
  if (/^[¡¿«]/u.test(snapshot)) {
    return `${current.trimEnd()} ${snapshot}`;
  }

  // Some providers omit the leading boundary entirely for word-level deltas.
  if (/[^\s,.;:!?%\(\[\{¡¿«،؛؟]$/u.test(current) && /^[\p{L}\p{N}]/u.test(snapshot)) {
    return `${current} ${snapshot}`;
  }

  return current + snapshot;
}

const CYRILLIC_REGEX = /[\u0400-\u04FF]/u;
const ARABIC_SCRIPT_REGEX = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/u;
const SPANISH_SPECIFIC_REGEX = /[áéíóúüñ¡¿ÁÉÍÓÚÜÑ]/u;

export interface DetectedScript {
  languageCode: string;
  direction: Direction;
}

/**
 * Resolves the language code and text direction of a streamed text snippet,
 * respecting the active learner session's target and native languages.
 */
export function detectScriptLanguage(
  text: string,
  preferredSource = "ku",
  preferredTarget = "en",
): DetectedScript {
  const clean = text.trim();
  if (!clean) {
    const fallbackCode = preferredTarget || "en";
    return {
      languageCode: fallbackCode,
      direction: getLanguageDirection(fallbackCode),
    };
  }

  // 1. Cyrillic script (Russian)
  if (CYRILLIC_REGEX.test(clean)) {
    return { languageCode: "ru", direction: "ltr" };
  }

  // 2. Arabic / Kurdish script (RTL)
  if (ARABIC_SCRIPT_REGEX.test(clean)) {
    const isKurdishContext = preferredSource === "ku" || preferredTarget === "ku";
    const languageCode = isKurdishContext ? "ku" : "ar";
    return { languageCode, direction: "rtl" };
  }

  // 3. Spanish (accents, inverted punctuation, or active Spanish target/source)
  if (
    SPANISH_SPECIFIC_REGEX.test(clean) ||
    preferredTarget === "es" ||
    (preferredSource === "es" && preferredTarget !== "en")
  ) {
    return { languageCode: "es", direction: "ltr" };
  }

  // 4. Default to target language (or English if target is non-Latin and text is Latin)
  const defaultCode = preferredTarget === "ru" || preferredTarget === "ar" || preferredTarget === "ku"
    ? "en"
    : preferredTarget || "en";

  return {
    languageCode: defaultCode,
    direction: getLanguageDirection(defaultCode),
  };
}

