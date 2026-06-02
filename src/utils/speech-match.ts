/** Normalize spoken/text answers for fuzzy comparison. */
export function normalizeSpeech(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\w\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Returns true when the spoken result is close enough to the target phrase. */
export function matchesTarget(result: string, target: string) {
  const r = normalizeSpeech(result);
  const t = normalizeSpeech(target);
  if (!t || !r) return false;
  if (r.includes(t) || t.includes(r)) return true;

  const rWords = r.split(" ");
  const tWords = t.split(" ");
  const keyWords = tWords.filter((w) => w.length > 1);
  if (keyWords.length === 0) {
    return rWords.some((w) => w === t);
  }

  const hits = keyWords.filter((w) =>
    rWords.some((rw) => rw === w || rw.includes(w) || w.includes(rw)),
  );
  return hits.length >= Math.ceil(keyWords.length * 0.5);
}
