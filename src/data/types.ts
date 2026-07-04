// ─────────────────────────────────────────────────────────────────────────────
// Shared types for all game questions and lesson/unit banks
// ─────────────────────────────────────────────────────────────────────────────

import type { AnswerTier } from "../utils/answer-tier";

export type VoiceQuestion = {
  type: "voice";
  prompt: string;
  targetWord: string;
  targetKurdish: string;
  imageRequire?: any;
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
  promptLang: string;
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

export type ImagePairMatchQuestion = {
  type: "image_pair_match";
  pairs: { english: string; kurdish: string; image: any }[];
  xp: number;
};

export type ImageMultipleChoiceQuestion = {
  type: "image_multiple_choice";
  prompt: string;
  correctAnswer: string;
  image: any;
  options: string[];
  xp: number;
};

export type MemoryFlipQuestion = {
  type: "memory_flip";
  pairs: { english: string; kurdish: string; image: any }[];
  xp: number;
};

export type KidsChoice = {
  id: string;
  emoji: string;
  label: string;
  kurdishLabel?: string;
  arabicLabel?: string;
};

export type KidsPlayQuestion = {
  type: "kids_play";
  xp: number;
  variant: "scene" | "bubble" | "feed" | "shadow" | "pick" | "yes_no" | "treasure";
  prompt: string;
  promptLang: string;
  correctId: string;
  choices: KidsChoice[];
  scene?: string;
  mascotEmoji?: string;
  shadowSlotIds?: string[];
  shownEmoji?: string;
  shownLabel?: string;
  spokenWord?: string;
  matches?: boolean;
  treasureRevealEmoji?: string;
  treasureRevealLabel?: string;
};

export type ParagraphSpeechQuestion = {
  type: "paragraph_speech";
  mode: "practice" | "quiz";
  paragraphs: string[];
  xp: number;
};

export type GameQuestion =
  | VoiceQuestion
  | SentenceBuilderQuestion
  | MultipleChoiceQuestion
  | PairMatchQuestion
  | FillBlankQuestion
  | ConversationPickQuestion
  | ImagePairMatchQuestion
  | ImageMultipleChoiceQuestion
  | MemoryFlipQuestion
  | KidsPlayQuestion
  | ParagraphSpeechQuestion;

// ── ONE lesson's worth of content (unique per dot) ────────────────────────────
export type LessonBank = {
  topic: string;           // short English topic name, e.g. "Basic Greetings"
  topicKu: string;         // Kurdish, e.g. "سڵاوی سەرەکی"
  topicAr?: string;        // Arabic topic
  words:         { english: string; kurdish: string; arabic?: string }[];
  voices:        { prompt: string; target: string; targetKurdish: string; targetArabic?: string; promptAr?: string }[];
  sentences:     { english: string[]; kurdish: string; arabic?: string }[];
  fillBlanks:    { parts: [string, string]; hint: string; answer: string; wrongs: [string, string, string]; arabicHint?: string; arabicParts?: [string, string]; arabicAnswer?: string; arabicWrongs?: [string, string, string] }[];
  conversations: {
    situation:   string;
    theyAsk:     string;
    correct:     string;
    wrong1:      string;
    wrong2:      string;
    wrong3:      string;
    explanation: string;
    situationAr?: string;
    explanationAr?: string;
    theyAskAr?:   string;
    correctAr?:   string;
    wrong1Ar?:    string;
    wrong2Ar?:    string;
    wrong3Ar?:    string;
  }[];
  paragraphSpeeches?: {
    mode: "practice" | "quiz";
    paragraphs: string[];
  }[];
  kidsGames?: any;
};

// ── A full unit = 10 unique lesson banks ─────────────────────────────────────
export type UnitBank = LessonBank[];

export type LessonPathMode = "street" | "normal" | "kids" | "custom";
