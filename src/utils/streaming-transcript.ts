const NO_SPACE_BEFORE = /^[,.;:!?%\)\]\}]/u;
const NO_SPACE_AFTER = /[\(\[\{]$/u;

/**
 * Merge a transcription update that may be either a cumulative snapshot or a
 * delta. Leading whitespace in deltas is meaningful and must not be trimmed:
 * Gemini commonly sends it as the boundary between streamed words.
 */
export function mergeStreamingTranscript(current: string, update: string) {
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

  // Some providers omit the leading boundary entirely for word-level deltas.
  if (/[^\s,.;:!?%\(\[\{]$/u.test(current) && /^[\p{L}\p{N}]/u.test(snapshot)) {
    return `${current} ${snapshot}`;
  }

  return current + snapshot;
}
