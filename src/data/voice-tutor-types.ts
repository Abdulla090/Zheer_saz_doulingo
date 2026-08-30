// ─── Voice Tutor Shared Types ───────────────────────────────────────────────
// Central type definitions for the 10-level voice tutor system.
// Used by: word banks, analysis engine, settings store, hooks, screens.

/** A single word entry in a level's word bank. */
export interface WordEntry {
  word: string;
  definition: string;
  exampleSentence: string;
  partOfSpeech: "noun" | "verb" | "adjective" | "adverb" | "phrase" | "preposition" | "conjunction" | "pronoun" | "interjection";
}

/** Configuration for a single level (1–10). */
export interface LevelConfig {
  level: number;
  cefr: string;
  description: string;
  sentenceComplexity: string;
  focus: string;
  /** Max words per sentence the tutor should use at this level. */
  maxSentenceWords: number;
  /** Whether corrections/feedback should be in the native language. */
  feedbackInNative: boolean;
}

/** Tracks which words have been taught/mastered during a session. */
export interface SessionWordState {
  /** Words shown to the student this session (by word string). */
  introduced: string[];
  /** Words the student used correctly in a sentence. */
  correct: string[];
  /** Words the student got wrong or skipped — candidates for review. */
  needsReview: string[];
  /** Index into the level's word bank for the next unseen word. */
  currentWordIndex: number;
  /** Counter: how many words since the last mini-conversation break. */
  wordsSinceLastConversation: number;
}

/** A single speech/grammar improvement or native phrasing suggestion. */
export interface GrammarError {
  original: string;
  corrected: string;
  explanation: string;
  category?: "natural_phrasing" | "word_choice" | "grammar" | "collocation";
  nativeTip?: string;
}

/** A real conversation turn captured during a live session. */
export interface RealConversationTurn {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
  /** If AI corrected the user this turn, the correction text. */
  correction?: string;
  /** The word being taught this turn (if in word-drill mode). */
  targetWord?: string;
  /** Whether the user demonstrated correct usage of the target word. */
  wordCorrect?: boolean;
}

/** Complete analysis of a tutoring session — computed from real data only. */
export interface RealAnalysis {
  /** Overall session score (0–100), derived from word mastery rate + grammar. */
  overallScore: number | null;
  /** Pronunciation quality indicator (0–100), null if unavailable. */
  pronunciationScore: number | null;
  /** Fluency indicator (0–100), null if unavailable. */
  fluencyScore: number | null;
  /** Grammar errors extracted from the session transcript. */
  grammarErrors: GrammarError[];
  /** All distinct English words the user spoke during the session. */
  vocabularyUsed: string[];
  /** Words from the word bank that were introduced this session. */
  wordsIntroduced: string[];
  /** Words the user used correctly in sentences. */
  wordsMastered: string[];
  /** Words that need review next session. */
  wordsForReview: string[];
  /** Number of turns in the conversation. */
  turnCount: number;
  /** Real elapsed duration formatted as "X min Y sec". */
  duration: string;
  /** If analysis computation failed, this contains the error message. */
  analysisError?: string;
}

/** Default empty session word state. */
export function createEmptySessionWordState(): SessionWordState {
  return {
    introduced: [],
    correct: [],
    needsReview: [],
    currentWordIndex: 0,
    wordsSinceLastConversation: 0,
  };
}

/** Default empty analysis (all nulls, no faking). */
export function createEmptyAnalysis(): RealAnalysis {
  return {
    overallScore: null,
    pronunciationScore: null,
    fluencyScore: null,
    grammarErrors: [],
    vocabularyUsed: [],
    wordsIntroduced: [],
    wordsMastered: [],
    wordsForReview: [],
    turnCount: 0,
    duration: "0 min 0 sec",
  };
}
