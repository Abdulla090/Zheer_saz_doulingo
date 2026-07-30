import type { LessonBank } from "../types";

type Phrase = { en: string; ku: string; ar?: string };
type Speak = { prompt: string; target: string; targetKurdish: string; promptAr?: string; targetArabic?: string };
type Sentence = { english: string[]; kurdish: string; arabic?: string };
type Fill = {
  parts: [string, string];
  hint: string;
  answer: string;
  wrongs: [string, string, string];
  arabicHint?: string;
};
type Convo = {
  situation: string;
  theyAsk: string;
  correct: string;
  wrong1: string;
  wrong2: string;
  wrong3: string;
  explanation: string;
  situationAr?: string;
  explanationAr?: string;
};

function splitSentence(en: string): string[] {
  return en.replace(/[.!?]+$/g, "").split(/\s+/).filter(Boolean);
}

function cleanFillToken(token: string): string {
  return token.replace(/^[^A-Za-z']+|[^A-Za-z']+$/g, "");
}

function defaultSpeaks(phrases: Phrase[]): Speak[] {
  return phrases.slice(0, 3).map((p) => ({
    prompt: `ئەم ڕستەیە بە ئینگلیزی بڵێ:`,
    target: p.en,
    targetKurdish: p.ku,
    ...(p.ar ? { promptAr: `قل هذه الجملة بالإنجليزية:`, targetArabic: p.ar } : {}),
  }));
}

function defaultSentences(phrases: Phrase[]): Sentence[] {
  return phrases.slice(0, 3).map((p) => ({
    english: splitSentence(p.en),
    kurdish: p.ku,
    ...(p.ar ? { arabic: p.ar } : {}),
  }));
}

function defaultFills(phrases: Phrase[]): Fill[] {
  const tokenizedPhrases = phrases.map((phrase) => splitSentence(phrase.en));

  return phrases.slice(0, 2).map((p) => {
    const words = splitSentence(p.en);
    const answerIndex = Math.min(2, words.length - 1);
    const answer = cleanFillToken(words[answerIndex] ?? words[0]);
    const candidates = [
      ...tokenizedPhrases.map((tokens) => cleanFillToken(tokens[answerIndex] ?? "")),
      ...tokenizedPhrases.flatMap((tokens) => tokens.slice(1).map(cleanFillToken)),
      "usually",
      "already",
      "instead",
    ];
    const seen = new Set([answer.toLowerCase()]);
    const alternatives = candidates.filter((candidate) => {
      const key = candidate.toLowerCase();
      if (!candidate || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    const wrongs = alternatives.slice(0, 3) as [string, string, string];
    return {
      parts: [words.slice(0, answerIndex).join(" ") + " ", words.slice(answerIndex + 1).join(" ")],
      hint: p.ku,
      answer,
      wrongs,
      ...(p.ar ? { arabicHint: p.ar } : {}),
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
  topicAr?: string,
): LessonBank {
  return {
    topic,
    topicKu,
    ...(topicAr ? { topicAr } : {}),
    words: phrases.map((p) => ({ english: p.en, kurdish: p.ku, ...(p.ar ? { arabic: p.ar } : {}) })),
    voices: extras?.speak ?? defaultSpeaks(phrases),
    sentences: extras?.sentences ?? defaultSentences(phrases),
    fillBlanks: extras?.fills ?? defaultFills(phrases),
    conversations: extras?.convos ?? [],
  };
}

export type { Phrase, Speak, Sentence, Fill, Convo };
