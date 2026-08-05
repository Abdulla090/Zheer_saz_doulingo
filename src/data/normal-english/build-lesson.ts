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
  arabicParts?: [string, string];
  arabicAnswer?: string;
  arabicWrongs?: [string, string, string];
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
  theyAskAr?: string;
  correctAr?: string;
  wrong1Ar?: string;
  wrong2Ar?: string;
  wrong3Ar?: string;
};

function splitSentence(en: string): string[] {
  return en.replace(/[.!?]+$/g, "").split(/\s+/).filter(Boolean);
}

function toSpeaks(phrases: Phrase[]): Speak[] {
  return phrases.map((p) => ({
    prompt: `ئەم ڕستەیە بە ئینگلیزی بڵێ:`,
    target: p.en,
    targetKurdish: p.ku,
    ...(p.ar ? { promptAr: `قل هذه الجملة بالإنجليزية:`, targetArabic: p.ar } : {}),
  }));
}

function toSentences(phrases: Phrase[]): Sentence[] {
  return phrases.map((p) => ({
    english: splitSentence(p.en),
    kurdish: p.ku,
    ...(p.ar ? { arabic: p.ar } : {}),
  }));
}

/**
 * Author one fill-in-the-blank from a sentence containing a `___` placeholder.
 *
 *   fill("Could you ___ this at the register?", "hold", ["keep", "save", "stay"], ku, ar)
 *
 * Keeping the blank inline means `parts[0] + answer + parts[1]` always reads
 * back as the original sentence, which is what the game renders. Pass `arBlank`
 * (an Arabic sentence with its own `___`) to localize the drill itself rather
 * than only the hint.
 */
export function fill(
  blanked: string,
  answer: string,
  wrongs: [string, string, string],
  hint: string,
  arabicHint?: string,
  arBlank?: { sentence: string; answer: string; wrongs: [string, string, string] },
): Fill {
  const [before = "", after = ""] = blanked.split("___");
  const base: Fill = {
    parts: [before, after],
    hint,
    answer,
    wrongs,
    ...(arabicHint ? { arabicHint } : {}),
  };
  if (!arBlank) return base;
  const [arBefore = "", arAfter = ""] = arBlank.sentence.split("___");
  return {
    ...base,
    arabicParts: [arBefore, arAfter],
    arabicAnswer: arBlank.answer,
    arabicWrongs: arBlank.wrongs,
  };
}

/**
 * Build a full lesson bank.
 *
 * Each game slot draws from its OWN pool so a learner never meets the same
 * sentence twice inside one lesson. `phrases` is the vocabulary list only;
 * `speakPhrases`, `sentencePhrases` and `fills` carry different material on the
 * same topic. When a pool is omitted the slot falls back to a *disjoint* slice
 * of `phrases` rather than repeating the first three entries everywhere.
 */
export function buildLesson(
  topic: string,
  topicKu: string,
  phrases: Phrase[],
  extras?: {
    /** Sentences for the speaking game — distinct from `phrases`. */
    speakPhrases?: Phrase[];
    /** Sentences for the sentence-builder game — distinct from the above. */
    sentencePhrases?: Phrase[];
    /** Fully authored overrides, used as-is when present. */
    speak?: Speak[];
    sentences?: Sentence[];
    fills?: Fill[];
    convos?: Convo[];
  },
  topicAr?: string,
): LessonBank {
  const speakPool = extras?.speakPhrases ?? phrases.slice(0, 3);
  const sentencePool =
    extras?.sentencePhrases ??
    (phrases.length >= 6 ? phrases.slice(3, 6) : phrases.slice(0, 3));

  return {
    topic,
    topicKu,
    ...(topicAr ? { topicAr } : {}),
    words: phrases.map((p) => ({ english: p.en, kurdish: p.ku, ...(p.ar ? { arabic: p.ar } : {}) })),
    voices: extras?.speak ?? toSpeaks(speakPool),
    sentences: extras?.sentences ?? toSentences(sentencePool),
    fillBlanks: extras?.fills ?? [],
    conversations: extras?.convos ?? [],
  };
}

export type { Phrase, Speak, Sentence, Fill, Convo };
