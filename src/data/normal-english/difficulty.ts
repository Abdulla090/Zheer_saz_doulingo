import type { AnswerTier } from "../../utils/answer-tier";

// The complete 18-unit course is one continuous A1-C1 progression. Every
// lesson must pass through the same difficulty system so later units never
// fall back to unranked authored choices.
export const NORMAL_DIFFICULTY_UNIT_COUNT = 18;

export type NormalLessonDifficulty = {
  step: number;
  progress: number;
  closeDistractorCount: 1 | 2 | 3;
  sentenceExtraCount: 1 | 2 | 3 | 4;
  pairCount: 3 | 4;
  readingSentenceCount: 2 | 3 | 4;
};

/** Difficulty rises across all 180 lessons, not merely by game type. */
export function getNormalLessonDifficulty(
  unitIndex: number,
  lessonIndex: number,
): NormalLessonDifficulty | null {
  if (unitIndex < 0 || unitIndex >= NORMAL_DIFFICULTY_UNIT_COUNT) return null;

  const safeLesson = Math.max(0, Math.min(9, lessonIndex));
  const step = unitIndex * 10 + safeLesson;
  const progress = step / (NORMAL_DIFFICULTY_UNIT_COUNT * 10 - 1);

  return {
    step,
    progress,
    closeDistractorCount: step < 5 ? 1 : step < 50 ? 2 : 3,
    sentenceExtraCount: step < 20 ? 1 : step < 60 ? 2 : step < 110 ? 3 : 4,
    pairCount: step < 10 ? 3 : 4,
    readingSentenceCount: step < 50 ? 2 : step < 100 ? 3 : 4,
  };
}

function normalizedTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9']+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function normalizedKey(text: string): string {
  return normalizedTokens(text).join(" ");
}

function stableNoise(text: string, seed: number): number {
  let hash = seed | 0;
  for (let i = 0; i < text.length; i++) {
    hash = Math.imul(hash ^ text.charCodeAt(i), 16777619);
  }
  return (hash >>> 0) / 0xffffffff;
}

function similarity(candidate: string, correct: string): number {
  const a = normalizedTokens(candidate);
  const b = normalizedTokens(correct);
  if (!a.length || !b.length) return 0;

  const aSet = new Set(a);
  const bSet = new Set(b);
  let shared = 0;
  aSet.forEach((token) => {
    if (bSet.has(token)) shared += 1;
  });
  const union = new Set([...a, ...b]).size || 1;
  const tokenOverlap = shared / union;
  const wordCountMatch = Math.min(a.length, b.length) / Math.max(a.length, b.length);
  const charCountMatch =
    Math.min(candidate.length, correct.length) /
    Math.max(candidate.length, correct.length, 1);

  return tokenOverlap * 0.56 + wordCountMatch * 0.27 + charCountMatch * 0.17;
}

function compareByAnswerSimilarity(
  a: string,
  b: string,
  correct: string,
  seed: number,
): number {
  const scoreDelta = similarity(b, correct) - similarity(a, correct);
  if (Math.abs(scoreDelta) > 0.0001) return scoreDelta;
  return stableNoise(a, seed) - stableNoise(b, seed);
}

function uniqueCandidates(candidates: string[], correct: string): string[] {
  const correctKey = normalizedKey(correct);
  const seen = new Set<string>([correctKey]);
  return candidates.filter((candidate) => {
    const key = normalizedKey(candidate);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function selectProgressiveDistractors({
  correct,
  closeCandidates,
  fallbackCandidates,
  closeCount,
  total = 3,
  seed,
}: {
  correct: string;
  closeCandidates: string[];
  fallbackCandidates: string[];
  closeCount: number;
  total?: number;
  seed: number;
}): string[] {
  const closePool = uniqueCandidates(closeCandidates, correct).sort((a, b) => {
    return compareByAnswerSimilarity(a, b, correct, seed);
  });
  const chosen = closePool.slice(0, Math.min(closeCount, total));

  const fallbackPool = uniqueCandidates(
    [...fallbackCandidates, ...closePool],
    correct,
  ).sort((a, b) => compareByAnswerSimilarity(a, b, correct, seed + 41));

  for (const candidate of fallbackPool) {
    if (chosen.some((item) => normalizedKey(item) === normalizedKey(candidate))) continue;
    chosen.push(candidate);
    if (chosen.length >= total) break;
  }

  return chosen.slice(0, total);
}

const GRAMMAR_SWAPS: Record<string, string[]> = {
  am: ["is", "are"],
  is: ["are", "was"],
  are: ["is", "were"],
  was: ["were", "is"],
  were: ["was", "are"],
  have: ["has", "had"],
  has: ["have", "had"],
  do: ["does", "did"],
  does: ["do", "did"],
  this: ["that", "these"],
  that: ["this", "those"],
  these: ["this", "those"],
  those: ["that", "these"],
  my: ["your", "his"],
  your: ["my", "their"],
  in: ["on", "at"],
  on: ["in", "at"],
  at: ["in", "on"],
  to: ["for", "from"],
  for: ["to", "with"],
  morning: ["evening", "afternoon"],
  evening: ["morning", "afternoon"],
};

function preserveCase(source: string, replacement: string): string {
  if (source === source.toUpperCase()) return replacement.toUpperCase();
  if (source[0] === source[0]?.toUpperCase()) {
    return `${replacement[0]?.toUpperCase()}${replacement.slice(1)}`;
  }
  return replacement;
}

/** Creates small grammar/word-order errors that look close to the right sentence. */
export function buildSentenceNearMisses(words: string[]): string[] {
  const misses: string[] = [];

  words.forEach((word, index) => {
    const clean = word.toLowerCase().replace(/[^a-z']/g, "");
    const replacements = GRAMMAR_SWAPS[clean];
    if (!replacements) return;
    replacements.forEach((replacement) => {
      const next = [...words];
      next[index] = preserveCase(word, replacement);
      misses.push(next.join(" "));
    });
  });

  const articleIndex = words.findIndex((word) => /^(a|an|the)$/i.test(word));
  if (articleIndex >= 0 && words.length > 3) {
    misses.push(words.filter((_, index) => index !== articleIndex).join(" "));
  }

  if (words.length > 3) {
    const swapIndex = Math.max(1, Math.min(words.length - 2, Math.floor(words.length / 2)));
    const swapped = [...words];
    [swapped[swapIndex], swapped[swapIndex + 1]] = [
      swapped[swapIndex + 1],
      swapped[swapIndex],
    ];
    misses.push(swapped.join(" "));
  }

  return uniqueCandidates(misses, words.join(" "));
}

export function buildFillDistractors(
  answer: string,
  authoredWrongs: string[],
  closeCount: number,
  fallbackCandidates: string[] = [],
): string[] {
  const clean = answer.toLowerCase().replace(/[^a-z']/g, "");
  const generated = [...(GRAMMAR_SWAPS[clean] ?? [])];

  return uniqueCandidates(
    [
      ...generated.slice(0, closeCount),
      ...authoredWrongs,
      ...fallbackCandidates,
    ],
    answer,
  ).slice(0, 3);
}

export function selectSentenceBuilderExtras(
  candidates: string[],
  correctWords: string[],
  count: number,
  seed: number,
): string[] {
  const correctKeys = new Set(correctWords.map(normalizedKey));
  const seen = new Set<string>();
  return candidates
    .filter((candidate) => {
      const key = normalizedKey(candidate);
      if (!key || correctKeys.has(key) || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => {
      const aScore = Math.max(...correctWords.map((word) => similarity(a, word)), 0);
      const bScore = Math.max(...correctWords.map((word) => similarity(b, word)), 0);
      if (Math.abs(bScore - aScore) > 0.0001) return bScore - aScore;
      return stableNoise(a, seed) - stableNoise(b, seed);
    })
    .slice(0, count);
}

function incompleteConversationVariants(correct: string): string[] {
  const variants: string[] = [];
  const sentences = correct.match(/[^.!?]+[.!?]?/g)?.map((part) => part.trim()).filter(Boolean) ?? [];
  if (sentences.length > 1) {
    variants.push(sentences[0]);
    variants.push(sentences.slice(1).join(" "));
  }

  const clauses = correct
    .split(/\s+[—–-]\s+|;\s+|,\s+/)
    .map((part) => part.trim())
    .filter((part) => normalizedTokens(part).length >= 2);
  if (clauses.length > 1) {
    variants.push(clauses[0]);
    variants.push(clauses.slice(1).join(", "));
  }

  if (!variants.length) {
    const words = correct.split(/\s+/).filter(Boolean);
    if (words.length >= 6) {
      variants.push(words.slice(0, Math.max(3, Math.ceil(words.length * 0.6))).join(" "));
    }
  }

  return uniqueCandidates(variants, correct);
}

function contrastingConversationVariants(correct: string): string[] {
  const replacements: [RegExp, string][] = [
    [/\bcan't\b/i, "can"],
    [/\bcan\b/i, "can't"],
    [/\bshouldn't\b/i, "should"],
    [/\bshould\b/i, "shouldn't"],
    [/\bwouldn't\b/i, "would"],
    [/\bwould\b/i, "wouldn't"],
    [/\bwon't\b/i, "will"],
    [/\bwill\b/i, "won't"],
    [/\bdon't\b/i, "do"],
    [/\bdo\b/i, "don't"],
    [/\bisn't\b/i, "is"],
    [/\bis\b/i, "isn't"],
    [/\baren't\b/i, "are"],
    [/\bare\b/i, "aren't"],
  ];
  const variants: string[] = [];

  for (const [pattern, replacement] of replacements) {
    if (!pattern.test(correct)) continue;
    variants.push(correct.replace(pattern, (match) => preserveCase(match, replacement)));
    break;
  }

  const lower = correct.toLowerCase().trim();
  if (/^yes\b/i.test(lower)) {
    variants.push("No, thank you. Maybe another time.");
    variants.push("I'm not sure yet, let me think about it.");
  } else if (/^no\b/i.test(lower)) {
    variants.push("Yes, please! That would be great.");
    variants.push("Sure, I would really appreciate that.");
  } else if (/^(sure|of course|definitely|absolutely)\b/i.test(lower)) {
    variants.push("I'm sorry, but I won't be able to right now.");
    variants.push("I wish I could, but I'm currently busy.");
  } else if (/^(i think|in my opinion|i believe)\b/i.test(lower)) {
    variants.push("I see what you mean, though I feel differently.");
    variants.push("I'm not entirely sure that's the best option.");
  } else if (/^(sorry|excuse me|pardon)\b/i.test(lower)) {
    variants.push("No worries at all, take your time.");
    variants.push("That's totally fine, don't worry about it.");
  } else if (/^(thank you|thanks)\b/i.test(lower)) {
    variants.push("You're very welcome! Let me know if you need anything.");
  } else {
    variants.push("Actually, that might not work out as planned.");
    variants.push("Let me check on that and get back to you shortly.");
    variants.push("I'm not quite sure yet. Could we come back to that?");
  }

  return uniqueCandidates(variants, correct);
}

export function buildConversationDistractors(
  entry: {
    correct: string;
    wrong1: string;
    wrong2: string;
    wrong3: string;
  },
  count: number,
  seed = 0,
): string[] {
  const words = entry.correct.split(/\s+/).filter(Boolean);
  const sentenceMisses = words.length >= 3 ? buildSentenceNearMisses(words) : [];
  const contrasting = contrastingConversationVariants(entry.correct);
  const incomplete = incompleteConversationVariants(entry.correct);

  const fullLengthPool = uniqueCandidates(
    [...sentenceMisses, ...contrasting, entry.wrong1, entry.wrong2, entry.wrong3],
    entry.correct,
  ).sort((a, b) => compareByAnswerSimilarity(a, b, entry.correct, seed));

  const allPool = uniqueCandidates(
    [...sentenceMisses, ...contrasting, ...incomplete, entry.wrong1, entry.wrong2, entry.wrong3],
    entry.correct,
  ).sort((a, b) => compareByAnswerSimilarity(a, b, entry.correct, seed));

  const chosen: string[] = [];
  if (words.length >= 4 && fullLengthPool.length > 0) {
    chosen.push(fullLengthPool[0]);
  }

  for (const candidate of allPool) {
    if (chosen.includes(candidate)) continue;
    chosen.push(candidate);
    if (chosen.length >= count) break;
  }

  return chosen.slice(0, count);
}

export function buildProgressiveConversationChoices(
  entry: {
    correct: string;
    wrong1: string;
    wrong2: string;
    wrong3: string;
  },
  closeCount: number,
): { options: string[]; optionTiers: Record<string, AnswerTier> } {
  const words = entry.correct.split(/\s+/).filter(Boolean);
  const sentenceMisses = words.length >= 3 ? buildSentenceNearMisses(words) : [];
  const contrasting = contrastingConversationVariants(entry.correct);
  const incomplete = incompleteConversationVariants(entry.correct);
  const primaryPartial = sentenceMisses[0] || incomplete[0] || contrasting[0];
  const remainingNearMisses = uniqueCandidates(
    [
      ...sentenceMisses.slice(1),
      ...contrasting,
      ...incomplete,
    ],
    entry.correct,
  ).sort((a, b) => compareByAnswerSimilarity(a, b, entry.correct, closeCount * 53));
  const nearMisses = uniqueCandidates(
    [primaryPartial, ...remainingNearMisses].filter(Boolean),
    entry.correct,
  ).slice(0, closeCount);
  const nearMissKeys = new Set(nearMisses.map(normalizedKey));
  const balancedRemainder = buildConversationDistractors(
    entry,
    6,
    closeCount * 97,
  ).filter((candidate) => !nearMissKeys.has(normalizedKey(candidate)));
  const candidates = uniqueCandidates(
    [...nearMisses, ...balancedRemainder, entry.wrong1, entry.wrong2, entry.wrong3],
    entry.correct,
  ).slice(0, 3);
  const options = [entry.correct, ...candidates];
  const optionTiers: Record<string, AnswerTier> = {
    [entry.correct]: "great",
  };

  candidates.forEach((candidate, index) => {
    if (candidate === nearMisses[0]) optionTiers[candidate] = "good";
    else if (candidate === nearMisses[1]) optionTiers[candidate] = "bad";
    else optionTiers[candidate] = index === 0 ? "bad" : "terrible";
  });

  return { options, optionTiers };
}

export function orderByLessonDifficulty<T>(
  items: T[],
  score: (item: T) => number,
  progress: number,
): T[] {
  const direction = progress < 0.5 ? 1 : -1;
  return [...items].sort((a, b) => (score(a) - score(b)) * direction);
}
