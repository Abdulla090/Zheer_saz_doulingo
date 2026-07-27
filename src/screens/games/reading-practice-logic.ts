export type ReadingDifficulty = "Beginner" | "Intermediate" | "Advanced";

export type WordResult = {
  word: string;
  normalized: string;
  spoken: boolean;
  orderCorrect: boolean;
};

export type SentenceResult = {
  sentence: string;
  correctWords: number;
  totalWords: number;
  score: number;
  correct: boolean;
};

export type ReadingEvaluation = {
  accuracyScore: number;
  coverageScore: number;
  orderScore: number;
  fluencyScore: number;
  pronunciationScore: number | null;
  correctWords: number;
  totalWords: number;
  correctSentences: number;
  totalSentences: number;
  wpm: number;
  durationSeconds: number;
  transcript: string;
  wordResults: WordResult[];
  sentenceResults: SentenceResult[];
  missedWords: string[];
  strengths: string[];
  nextSteps: string[];
};

export const TARGET_WPM: Record<ReadingDifficulty, number> = {
  Beginner: 90,
  Intermediate: 120,
  Advanced: 145,
};

export function normalizeReadingWord(value: string): string {
  return value
    .toLocaleLowerCase("en")
    .replace(/[^a-z0-9']/g, "")
    .replace(/^'+|'+$/g, "")
    .trim();
}

export function tokenizeReadingText(value: string): string[] {
  return value
    .split(/\s+/)
    .map(normalizeReadingWord)
    .filter(Boolean);
}

export function getReadingTargetWords(paragraphs: string[]) {
  return paragraphs
    .join(" ")
    .split(/\s+/)
    .map((word) => ({ word, normalized: normalizeReadingWord(word) }))
    .filter((item) => item.normalized.length > 0);
}

export function getReadingSentences(paragraphs: string[]): string[] {
  return paragraphs.flatMap((paragraph) =>
    (paragraph.match(/[^.!?\n]+[.!?]?/g) ?? [])
      .map((sentence) => sentence.replace(/\s+/g, " ").trim())
      .filter(Boolean),
  );
}

export function analyzeReadingPassage(paragraphs: string[]) {
  const words = getReadingTargetWords(paragraphs);
  const sentences = getReadingSentences(paragraphs);
  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    paragraphCount: paragraphs.length,
  };
}

/** Joins final speech-recognition chunks without repeating cumulative results. */
export function mergeReadingTranscript(previous: string, incoming: string): string {
  const before = previous.replace(/\s+/g, " ").trim();
  const next = incoming.replace(/\s+/g, " ").trim();
  if (!before) return next;
  if (!next) return before;

  const beforeLower = before.toLocaleLowerCase("en");
  const nextLower = next.toLocaleLowerCase("en");
  if (nextLower.startsWith(beforeLower)) return next;
  if (beforeLower.endsWith(nextLower)) return before;

  const beforeWords = before.split(" ");
  const nextWords = next.split(" ");
  const maxOverlap = Math.min(16, beforeWords.length, nextWords.length);
  for (let overlap = maxOverlap; overlap > 0; overlap -= 1) {
    const tail = beforeWords.slice(-overlap).join(" ").toLocaleLowerCase("en");
    const head = nextWords.slice(0, overlap).join(" ").toLocaleLowerCase("en");
    if (tail === head) {
      return [...beforeWords, ...nextWords.slice(overlap)].join(" ");
    }
  }
  return `${before} ${next}`;
}

function buildSentenceResults(
  paragraphs: string[],
  wordResults: WordResult[],
): SentenceResult[] {
  let wordCursor = 0;
  return getReadingSentences(paragraphs).map((sentence) => {
    const totalWords = tokenizeReadingText(sentence).length;
    const sentenceWords = wordResults.slice(wordCursor, wordCursor + totalWords);
    wordCursor += totalWords;
    const correctWords = sentenceWords.filter((word) => word.spoken).length;
    const orderedWords = sentenceWords.filter((word) => word.orderCorrect).length;
    const score = totalWords
      ? Math.round(((correctWords * 0.75 + orderedWords * 0.25) / totalWords) * 100)
      : 0;
    return {
      sentence,
      correctWords,
      totalWords,
      score,
      correct: score >= 80,
    };
  });
}

function feedbackForAttempt(
  coverageScore: number,
  orderScore: number,
  wpm: number,
  fluencyTarget: number,
  correctSentences: number,
  totalSentences: number,
) {
  const strengths: string[] = [];
  const nextSteps: string[] = [];

  if (coverageScore >= 85) strengths.push("You pronounced most target words clearly.");
  else nextSteps.push("Repeat the highlighted red words before your next attempt.");

  if (orderScore >= 82) strengths.push("Your word order stayed close to the passage.");
  else nextSteps.push("Follow each line in order instead of jumping between phrases.");

  if (totalSentences > 0 && correctSentences === totalSentences) {
    strengths.push("You completed every sentence accurately.");
  } else if (totalSentences > 0) {
    nextSteps.push(`Focus on the ${totalSentences - correctSentences} sentence${totalSentences - correctSentences === 1 ? "" : "s"} below 80%.`);
  }

  if (wpm >= fluencyTarget * 0.75 && wpm <= fluencyTarget * 1.25) {
    strengths.push("Your pace was controlled for this level.");
  } else if (wpm < fluencyTarget * 0.75) {
    nextSteps.push("Try the same passage again at a slightly faster pace.");
  } else {
    nextSteps.push("Slow down so pronunciation stays clear.");
  }

  return {
    strengths: strengths.slice(0, 3),
    nextSteps: nextSteps.slice(0, 3),
  };
}

export function evaluateReadingTranscript(
  transcript: string,
  paragraphs: string[],
  difficulty: ReadingDifficulty,
  durationSecondsInput: number,
): ReadingEvaluation {
  const targetWords = getReadingTargetWords(paragraphs);
  const spokenWords = tokenizeReadingText(transcript);
  const spokenCounts = new Map<string, number>();
  spokenWords.forEach((word) => {
    spokenCounts.set(word, (spokenCounts.get(word) ?? 0) + 1);
  });

  let orderedCursor = 0;
  const wordResults = targetWords.map((target) => {
    const available = spokenCounts.get(target.normalized) ?? 0;
    const spoken = available > 0;
    if (spoken) spokenCounts.set(target.normalized, available - 1);

    const foundAt = spoken
      ? spokenWords.indexOf(target.normalized, orderedCursor)
      : -1;
    const orderCorrect = foundAt >= 0;
    if (orderCorrect) orderedCursor = foundAt + 1;
    return { ...target, spoken, orderCorrect };
  });

  const durationSeconds = Math.max(1, Math.round(durationSecondsInput));
  const correctWords = wordResults.filter((word) => word.spoken).length;
  const orderedWords = wordResults.filter((word) => word.orderCorrect).length;
  const totalWords = targetWords.length;
  const wpm = Math.round((spokenWords.length / durationSeconds) * 60);
  const coverageScore = totalWords ? Math.round((correctWords / totalWords) * 100) : 0;
  const orderScore = correctWords ? Math.round((orderedWords / correctWords) * 100) : 0;
  const fluencyTarget = TARGET_WPM[difficulty];
  const fluencyScore = Math.max(0, Math.min(100, Math.round((wpm / fluencyTarget) * 100)));
  const sentenceResults = buildSentenceResults(paragraphs, wordResults);
  const correctSentences = sentenceResults.filter((sentence) => sentence.correct).length;
  const accuracyScore = Math.round(
    coverageScore * 0.62 + orderScore * 0.23 + fluencyScore * 0.15,
  );
  const feedback = feedbackForAttempt(
    coverageScore,
    orderScore,
    wpm,
    fluencyTarget,
    correctSentences,
    sentenceResults.length,
  );

  return {
    accuracyScore,
    coverageScore,
    orderScore,
    fluencyScore,
    pronunciationScore: null,
    correctWords,
    totalWords,
    correctSentences,
    totalSentences: sentenceResults.length,
    wpm,
    durationSeconds,
    transcript,
    wordResults,
    sentenceResults,
    missedWords: wordResults.filter((word) => !word.spoken).slice(0, 12).map((word) => word.word),
    ...feedback,
  };
}

export function evaluateGeminiReading(input: {
  transcript: string;
  pronunciationScore: number;
  wordAnalysis: { word: string; correct: boolean }[];
  paragraphs: string[];
  difficulty: ReadingDifficulty;
  durationSeconds: number;
}): ReadingEvaluation {
  const local = evaluateReadingTranscript(
    input.transcript,
    input.paragraphs,
    input.difficulty,
    input.durationSeconds,
  );
  const targets = getReadingTargetWords(input.paragraphs);
  const wordResults = targets.map((target, index) => {
    const spoken = input.wordAnalysis[index]?.correct === true;
    return {
      ...target,
      spoken,
      orderCorrect: spoken && (local.wordResults[index]?.orderCorrect ?? true),
    };
  });
  const correctWords = wordResults.filter((word) => word.spoken).length;
  const coverageScore = targets.length ? Math.round((correctWords / targets.length) * 100) : 0;
  const orderedWords = wordResults.filter((word) => word.orderCorrect).length;
  const orderScore = correctWords ? Math.round((orderedWords / correctWords) * 100) : 0;
  const sentenceResults = buildSentenceResults(input.paragraphs, wordResults);
  const correctSentences = sentenceResults.filter((sentence) => sentence.correct).length;
  const pronunciationScore = Math.max(0, Math.min(100, Math.round(input.pronunciationScore)));
  const accuracyScore = Math.round(
    pronunciationScore * 0.55 + coverageScore * 0.25 + orderScore * 0.1 + local.fluencyScore * 0.1,
  );
  const feedback = feedbackForAttempt(
    coverageScore,
    orderScore,
    local.wpm,
    TARGET_WPM[input.difficulty],
    correctSentences,
    sentenceResults.length,
  );

  return {
    ...local,
    accuracyScore,
    coverageScore,
    orderScore,
    pronunciationScore,
    correctWords,
    totalWords: targets.length,
    correctSentences,
    totalSentences: sentenceResults.length,
    wordResults,
    sentenceResults,
    missedWords: wordResults.filter((word) => !word.spoken).slice(0, 12).map((word) => word.word),
    ...feedback,
  };
}
