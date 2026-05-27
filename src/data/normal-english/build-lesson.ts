import type { LessonBank } from "../types";

type Phrase = { en: string; ku: string };
type Speak = { prompt: string; target: string; targetKurdish: string };
type Sentence = { english: string[]; kurdish: string };
type Fill = {
  parts: [string, string];
  hint: string;
  answer: string;
  wrongs: [string, string, string];
};
type Convo = {
  situation: string;
  theyAsk: string;
  correct: string;
  wrong1: string;
  wrong2: string;
  wrong3: string;
  explanation: string;
};

function splitSentence(en: string): string[] {
  return en.replace(/[.!?]+$/g, "").split(/\s+/).filter(Boolean);
}

function defaultSpeaks(phrases: Phrase[]): Speak[] {
  return phrases.slice(0, 3).map((p) => ({
    prompt: "ئەم جملەیە بە ئینگلیزی بڵێ",
    target: p.en,
    targetKurdish: p.ku,
  }));
}

function defaultSentences(phrases: Phrase[]): Sentence[] {
  return phrases.slice(0, 3).map((p) => ({
    english: splitSentence(p.en),
    kurdish: p.ku,
  }));
}

function defaultFills(phrases: Phrase[]): Fill[] {
  return phrases.slice(0, 2).map((p) => {
    const words = splitSentence(p.en);
    const answer = words[Math.min(2, words.length - 1)] ?? words[0];
    const wrongs: [string, string, string] = ["maybe", "just", "really"];
    return {
      parts: [words.slice(0, words.indexOf(answer)).join(" ") + " ", words.slice(words.indexOf(answer) + 1).join(" ")],
      hint: p.ku,
      answer,
      wrongs,
    };
  });
}

/** Build a full lesson bank from real-world phrases + optional rich extras. */
export function buildLesson(
  topic: string,
  topicKu: string,
  phrases: Phrase[],
  extras?: {
    speak?: Speak[];
    sentences?: Sentence[];
    fills?: Fill[];
    convos?: Convo[];
  },
): LessonBank {
  return {
    topic,
    topicKu,
    words: phrases.map((p) => ({ english: p.en, kurdish: p.ku })),
    voices: extras?.speak ?? defaultSpeaks(phrases),
    sentences: extras?.sentences ?? defaultSentences(phrases),
    fillBlanks: extras?.fills ?? defaultFills(phrases),
    conversations: extras?.convos ?? [],
  };
}

export type { Phrase, Speak, Sentence, Fill, Convo };
