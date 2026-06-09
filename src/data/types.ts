// ─────────────────────────────────────────────────────────────────────────────
// Shared types for all game questions and lesson/unit banks
// ─────────────────────────────────────────────────────────────────────────────

import type { AnswerTier } from "../utils/answer-tier";
import type { KidsChoice, KidsGameStep, KidsSceneKey } from "./kids-games";

export type { KidsChoice, KidsGameStep, KidsSceneKey } from "./kids-games";

export type VoiceQuestion = {
  type: "voice";
  prompt: string;
  targetWord: string;
  targetKurdish: string;
  xp: number;
};

export type SentenceBuilderQuestion = {
  type: "sentence_builder";
  kurdishSentence: string;
  wordBank: string[];
  correctWords: string[];
  xp: number;
};

export type MultipleChoiceQuestion = {
  type: "multiple_choice";
  prompt: string;
  promptLang: "ku" | "en";
  correctAnswer: string;
  options: string[];
  xp: number;
};

export type PairMatchQuestion = {
  type: "pair_match";
  pairs: { english: string; kurdish: string }[];
  xp: number;
};

export type FillBlankQuestion = {
  type: "fill_blank";
  sentenceParts: [string, string];
  kurdishHint: string;
  correctAnswer: string;
  options: string[];
  xp: number;
};

export type ConversationPickQuestion = {
  type: "conversation_pick";
  situation: string;
  theyAsk: string;
  options: string[];
  correctAnswer: string;
  optionTiers: Record<string, AnswerTier>;
  explanation: string;
  xp: number;
};

/** Kids path — scene, bubbles, feed, shadow, pick, yes/no, treasure chest */
export type KidsPlayQuestion = {
  type: "kids_play";
  variant: "scene" | "bubble" | "feed" | "shadow" | "pick" | "yes_no" | "treasure";
  prompt: string;
  promptLang?: "en" | "ku";
  scene?: KidsSceneKey;
  mascotEmoji?: string;
  correctId: string;
  choices: KidsChoice[];
  shownEmoji?: string;
  shownLabel?: string;
  spokenWord?: string;
  matches?: boolean;
  shadowSlotIds?: string[];
  treasureRevealEmoji?: string;
  treasureRevealLabel?: string;
  xp: number;
};

export type GameQuestion =
  | VoiceQuestion
  | SentenceBuilderQuestion
  | MultipleChoiceQuestion
  | PairMatchQuestion
  | FillBlankQuestion
  | ConversationPickQuestion
  | KidsPlayQuestion;

// ── ONE lesson's worth of content (unique per dot) ────────────────────────────
export type LessonBank = {
  topic: string;           // short English topic name, e.g. "Basic Greetings"
  topicKu: string;         // Kurdish, e.g. "سڵاوی سەرەکی"
  topicAr?: string;        // Arabic topic
  words:         { english: string; kurdish: string; arabic?: string }[];
  voices:        { prompt: string; target: string; targetKurdish: string; targetArabic?: string }[];
  sentences:     { english: string[]; kurdish: string; arabic?: string }[];
  fillBlanks:    { parts: [string, string]; hint: string; answer: string; wrongs: [string, string, string]; arabicHint?: string }[];
  conversations: {
    situation:   string;
    theyAsk:     string;
    correct:     string;
    wrong1:      string;
    wrong2:      string;
    wrong3:      string;
    explanation: string;
  }[];
  /** When set, kids mode runs this 10-step interactive flow instead of the generic mix. */
  kidsGames?: KidsGameStep[];
};

// ── A full unit = 10 unique lesson banks ─────────────────────────────────────
export type UnitBank = LessonBank[];

export type LessonPathMode = "street" | "normal" | "kids";
