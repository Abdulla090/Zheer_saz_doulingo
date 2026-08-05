/** Normalize spoken/text answers for fuzzy comparison. */
export function normalizeSpeech(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\w\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Speech engines and lesson content disagree on contractions
 * ("I'd like" vs "I would like"), so both sides are expanded before comparing.
 */
const CONTRACTIONS: Record<string, string> = {
  "i'd": "i would",
  "i'm": "i am",
  "i've": "i have",
  "i'll": "i will",
  "it's": "it is",
  "that's": "that is",
  "what's": "what is",
  "let's": "let us",
  "he's": "he is",
  "she's": "she is",
  "there's": "there is",
  "we're": "we are",
  "they're": "they are",
  "you're": "you are",
  "we've": "we have",
  "you've": "you have",
  "don't": "do not",
  "doesn't": "does not",
  "didn't": "did not",
  "isn't": "is not",
  "aren't": "are not",
  "wasn't": "was not",
  "can't": "can not",
  "cannot": "can not",
  "couldn't": "could not",
  "won't": "will not",
  "wouldn't": "would not",
  "shouldn't": "should not",
  "haven't": "have not",
  "hasn't": "has not",
};

function comparableWords(value: string): string[] {
  return normalizeSpeech(value)
    .split(" ")
    .flatMap((word) => (CONTRACTIONS[word] ?? word).split(" "))
    .filter(Boolean);
}

/** Cheap edit distance capped at `max`; returns max + 1 when it is exceeded. */
function editDistanceWithin(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const value = Math.min(
        prev[j]! + 1,
        row[j - 1]! + 1,
        prev[j - 1]! + cost,
      );
      row[j] = value;
      if (value < best) best = value;
    }
    if (best > max) return max + 1;
    prev = row;
  }
  return prev[b.length]!;
}

/** True when two single words are close enough to count as the same word. */
export function spokenWordMatches(target: string, spoken: string): boolean {
  return wordsSimilar(normalizeSpeech(target), normalizeSpeech(spoken));
}

function wordsSimilar(target: string, spoken: string): boolean {
  if (target === spoken) return true;
  // Short words must match exactly — "a"/"at"/"an" are too easy to confuse.
  if (target.length < 4 || spoken.length < 4) return false;
  if (target.startsWith(spoken) || spoken.startsWith(target)) return true;
  return editDistanceWithin(target, spoken, 1) <= 1;
}

/**
 * Fraction of the target's words that appear, in order, in the spoken result.
 * Order matters so a stray repeated word can't inflate the score.
 */
export function speechCoverage(result: string, target: string): number {
  const spoken = comparableWords(result);
  const wanted = comparableWords(target);
  if (!wanted.length) return 0;

  let cursor = 0;
  let hits = 0;
  for (const word of wanted) {
    for (let i = cursor; i < spoken.length; i++) {
      if (wordsSimilar(word, spoken[i]!)) {
        hits++;
        cursor = i + 1;
        break;
      }
    }
  }
  return hits / wanted.length;
}

/** Coverage a multi-word answer needs before it counts as spoken. */
const REQUIRED_COVERAGE = 0.8;
/** Spoken length (relative to the target) needed to rule out a half-said phrase. */
const REQUIRED_LENGTH_RATIO = 0.7;

/** Returns true when the spoken result is close enough to the target phrase. */
export function matchesTarget(result: string, target: string) {
  const spoken = comparableWords(result);
  const wanted = comparableWords(target);
  if (!spoken.length || !wanted.length) return false;

  if (wanted.length === 1) {
    return spoken.some((word) => wordsSimilar(wanted[0]!, word));
  }

  // A partially spoken phrase must not pass: require most of the target's
  // words *and* enough spoken words to account for the whole phrase.
  const coverage = speechCoverage(result, target);
  const lengthRatio = spoken.length / wanted.length;
  return coverage >= REQUIRED_COVERAGE && lengthRatio >= REQUIRED_LENGTH_RATIO;
}

/**
 * True when the learner has clearly started the target phrase but has not
 * finished it yet — used to keep listening instead of grading them early.
 */
export function isPartialUtterance(result: string, target: string) {
  const spoken = comparableWords(result);
  const wanted = comparableWords(target);
  if (!spoken.length || wanted.length < 2) return false;
  if (spoken.length >= wanted.length) return false;
  if (matchesTarget(result, target)) return false;

  // Compare against the slice of the target they should have reached by now.
  const reached = wanted.slice(0, Math.min(wanted.length, spoken.length + 1));
  return speechCoverage(result, reached.join(" ")) >= 0.6;
}
