import type { LessonBank } from "../types";

type Phrase = { en: string; ku: string; ar?: string; ru?: string };
type Speak = { prompt: string; target: string; targetKurdish: string; promptAr?: string; targetArabic?: string; promptRu?: string; targetRussian?: string };
type Sentence = { english: string[]; kurdish: string; arabic?: string; russian?: string };
type Fill = {
  parts: [string, string];
  hint: string;
  answer: string;
  wrongs: [string, string, string];
  arabicHint?: string;
  arabicParts?: [string, string];
  arabicAnswer?: string;
  arabicWrongs?: [string, string, string];
  russianHint?: string;
  russianParts?: [string, string];
  russianAnswer?: string;
  russianWrongs?: [string, string, string];
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
  situationRu?: string;
  explanationRu?: string;
  theyAskRu?: string;
  correctRu?: string;
  wrong1Ru?: string;
  wrong2Ru?: string;
  wrong3Ru?: string;
};

function splitSentence(en: string): string[] {
  return en.replace(/[.!?]+$/g, "").split(/\s+/).filter(Boolean);
}

function toSpeaks(phrases: Phrase[]): Speak[] {
  return phrases.map((p) => ({
    prompt: `چۆن دەڵێیت بە ئینگلیزی:`,
    target: p.en,
    targetKurdish: p.ku,
    ...(p.ar ? { promptAr: `كيف تقول بالإنجليزية:`, targetArabic: p.ar } : {}),
    ...(p.ru ? { promptRu: `Как сказать по-английски:`, targetRussian: p.ru } : {}),
  }));
}

function toSentences(phrases: Phrase[]): Sentence[] {
  return phrases.map((p) => ({
    english: splitSentence(p.en),
    kurdish: p.ku,
    ...(p.ar ? { arabic: p.ar } : {}),
    ...(p.ru ? { russian: p.ru } : {}),
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
  russianHint?: string,
  ruBlank?: { sentence: string; answer: string; wrongs: [string, string, string] }
): Fill {
  const [before = "", after = ""] = blanked.split("___");
  const base: Fill = {
    parts: [before, after],
    hint,
    answer,
    wrongs,
    ...(arabicHint ? { arabicHint } : {}),
    ...(russianHint ? { russianHint } : {}),
  };

  let res = { ...base };
  if (arBlank) {
    const [arBefore = "", arAfter = ""] = arBlank.sentence.split("___");
    res = {
      ...res,
      arabicParts: [arBefore, arAfter],
      arabicAnswer: arBlank.answer,
      arabicWrongs: arBlank.wrongs,
    };
  }
  if (ruBlank) {
    const [ruBefore = "", ruAfter = ""] = ruBlank.sentence.split("___");
    res = {
      ...res,
      russianParts: [ruBefore, ruAfter],
      russianAnswer: ruBlank.answer,
      russianWrongs: ruBlank.wrongs,
    };
  }
  return res;
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
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9' ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildLesson(
  topic: string,
  topicKu: string,
  phrases: Phrase[],
  extras?: {
    /** Sentences for the speaking game - distinct from `phrases`. */
    speakPhrases?: Phrase[];
    /** Sentences for the sentence-builder game - distinct from the above. */
    sentencePhrases?: Phrase[];
    /** Fully authored overrides, used as-is when present. */
    speak?: Speak[];
    sentences?: Sentence[];
    fills?: Fill[];
    convos?: Convo[];
  },
  topicAr?: string,
  topicRu?: string,
): LessonBank {
  const hasAuthoredSpeak = Boolean(extras?.speak || extras?.speakPhrases);
  const hasAuthoredSentence = Boolean(extras?.sentences || extras?.sentencePhrases);

  let wordPool = phrases;
  let speakPool = extras?.speakPhrases ?? [];
  let sentencePool = extras?.sentencePhrases ?? [];

  if (!hasAuthoredSpeak && !hasAuthoredSentence) {
    if (phrases.length >= 6) {
      wordPool = phrases.slice(0, 2);
      speakPool = phrases.slice(2, 4);
      sentencePool = phrases.slice(4, 6);
    } else {
      wordPool = phrases;
      speakPool = phrases.slice(0, 1);
      sentencePool = phrases.slice(1, 2);
    }
  } else if (!hasAuthoredSpeak) {
    speakPool = phrases.slice(0, 2);
  } else if (!hasAuthoredSentence) {
    sentencePool = phrases.slice(0, 2);
  }

  const finalVoices = extras?.speak ?? toSpeaks(speakPool);
  const finalSentences = extras?.sentences ?? toSentences(sentencePool);
  const finalFills = extras?.fills ?? [];

  const usedInOtherSlots = new Set<string>();
  finalVoices.forEach((v) => usedInOtherSlots.add(normalizeText(v.target)));
  finalSentences.forEach((s) => usedInOtherSlots.add(normalizeText(s.english.join(" "))));
  finalFills.forEach((f) => usedInOtherSlots.add(normalizeText(`${f.parts[0]}${f.answer}${f.parts[1]}`)));

  const filteredWords = wordPool.filter((p) => !usedInOtherSlots.has(normalizeText(p.en)));
  const finalWordPool = filteredWords.length >= 2 ? filteredWords : wordPool;

  return {
    topic,
    topicKu,
    ...(topicAr ? { topicAr } : {}),
    ...(topicRu ? { topicRu } : {}),
    words: finalWordPool.map((p) => ({ english: p.en, kurdish: p.ku, ...(p.ar ? { arabic: p.ar } : {}), ...(p.ru ? { russian: p.ru } : {}) })),
    voices: finalVoices,
    sentences: finalSentences,
    fillBlanks: finalFills,
    conversations: extras?.convos ?? [],
  };
}

export type { Phrase, Speak, Sentence, Fill, Convo };
