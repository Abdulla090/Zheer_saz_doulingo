// ─────────────────────────────────────────────────────────────────────────────
// lesson-content.ts — Procedural Game Engine
//
// Architecture:
//   src/data/types.ts          ← shared type definitions
//   src/data/units/unit-XX.ts  ← 10 unique LessonBanks per unit
//   src/data/units/index.ts    ← assembles ALL_UNITS array
//
// getLessonQuestions(unitIndex, lessonIndex) returns 10 unique games
// sourced from the exact lesson bank for that dot — no content repeats.
//
// Game mix per lesson (10 total):
//   1× PairMatch · 1× MultipleChoice · 2× Voice
//   2× SentenceBuilder · 2× FillBlank · 2× ConversationPick
// ─────────────────────────────────────────────────────────────────────────────

import { buildConversationOptionTiers } from "../utils/answer-tier";
import { getUnitsForPath } from "./content-access";
import { GameQuestion, LessonBank, LessonPathMode, VoiceQuestion } from "./types";
import { useLocaleStore } from "../stores/useLocaleStore";
import { getWord3DImage, getWordsWithDistinctImages } from "../utils/kids-assets";

import arTranslations from "./translations/ar.json";
import kuTranslations from "./translations/ku.json";
import esTranslations from "./translations/es.json";
import ruTranslations from "./translations/ru.json";

const CONTENT_TRANSLATIONS: Record<string, Record<string, string>> = {
  ar: arTranslations as Record<string, string>,
  ku: kuTranslations as Record<string, string>,
  es: esTranslations as Record<string, string>,
  ru: ruTranslations as Record<string, string>,
};

function getTranslatedValue(obj: any, fieldName: string, lang: string): string | null {
  if (!obj) return null;
  const dict = CONTENT_TRANSLATIONS[lang];
  if (!dict) return null;

  const keysToTry: string[] = [];
  const fields = ["english", "kurdish", "prompt", "target", "situation", "explanation", "topic", "topicKu", "answer"];
  for (const f of fields) {
    if (obj[f]) {
      const val = Array.isArray(obj[f]) ? obj[f].join(" ") : String(obj[f]);
      if (val && !keysToTry.includes(val)) {
        keysToTry.push(val);
      }
    }
  }

  for (const key of keysToTry) {
    if (dict[key]) {
      return dict[key];
    }
    const trimmedKey = key.trim();
    if (dict[trimmedKey]) {
      return dict[trimmedKey];
    }
  }

  return null;
}

export type {
  GameQuestion,
  VoiceQuestion,
  SentenceBuilderQuestion,
  MultipleChoiceQuestion,
  PairMatchQuestion,
  FillBlankQuestion,
  ConversationPickQuestion,
  ImagePairMatchQuestion,
  ImageMultipleChoiceQuestion,
  MemoryFlipQuestion,
  KidsPlayQuestion,
  LessonBank,
  UnitBank,
} from "./types";

export type { LessonPathMode } from "./types";

/** English phrases and tokens scoped to one lesson — keeps distractors on-topic. */
function lessonEnglishPool(lesson: LessonBank): string[] {
  return [
    ...lesson.words.map((w) => w.english),
    ...lesson.sentences.map((s) => s.english.join(" ")),
  ];
}

function lessonSingleWordPool(lesson: LessonBank): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const phrase of lessonEnglishPool(lesson)) {
    for (const token of phrase.split(/\s+/)) {
      const key = token.toLowerCase();
      if (token.length > 0 && !seen.has(key)) {
        seen.add(key);
        out.push(token);
      }
    }
  }
  return out;
}

function pickLessonWrongs(
  pool: string[],
  correct: string,
  count: number,
  seed: number,
  filter?: (candidate: string) => boolean,
): string[] {
  const wrongs: string[] = [];
  for (const candidate of shuffle(pool, seed)) {
    if (candidate === correct) continue;
    if (filter && !filter(candidate)) continue;
    if (!wrongs.includes(candidate)) wrongs.push(candidate);
    if (wrongs.length >= count) break;
  }
  return wrongs;
}

function sanitizeFillWrongs(answer: string, wrongs: string[]): string[] {
  const seen = new Set<string>([answer.toLowerCase()]);
  const out: string[] = [];
  for (const w of wrongs) {
    const key = w.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(w);
    }
  }
  return out;
}

// ── Seeded deterministic shuffle ─────────────────────────────────────────────
function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Safe circular accessor (never throws) ───────────────────────────────────
const pick = <T>(arr: T[], i: number): T => arr[Math.abs(i) % arr.length];

function getPromptText(
  key: "how_to_say" | "what_is_word" | "choose_correct" | "say_word" | "which_matches_image",
  nativeLang: string,
  targetLang: string,
  word: string,
): string {
  const getLanguageName = (tLang: string, nLang: string) => {
    if (nLang === "ku") return tLang === "ar" ? "عەرەبی" : "ئینگلیزی";
    if (nLang === "ar") return tLang === "ku" ? "الكردية" : "الإنجليزية";
    if (nLang === "es") return tLang === "ar" ? "árabe" : (tLang === "ku" ? "kurdo" : "inglés");
    if (nLang === "ru") return tLang === "ar" ? "арабском" : (tLang === "ku" ? "курдском" : "английском");
    return tLang === "ar" ? "Arabic" : (tLang === "ku" ? "Kurdish" : "English");
  };

  const langName = getLanguageName(targetLang, nativeLang);

  if (nativeLang === "ku") {
    if (key === "how_to_say") return `چۆن بە ${langName} دەڵێیت:\n«${word}»`;
    if (key === "what_is_word") return `${word} بە ${langName} چییە؟`;
    if (key === "choose_correct") return `ڕستەی دروست هەڵبژێرە:\n«${word}»`;
    if (key === "say_word") return `بڵێ: ${word}`;
    if (key === "which_matches_image") return `کۆدام وشە لەگەڵ وێنەکە دەگونجێت؟`;
  }
  if (nativeLang === "ar") {
    if (key === "how_to_say") return `كيف تقول ب${langName}:\n«${word}»؟`;
    if (key === "what_is_word") return `ما معنى ${word} ب${langName}؟`;
    if (key === "choose_correct") return `اختر الجملة الصحيحة:\n«${word}»`;
    if (key === "say_word") return `قل: ${word}`;
    if (key === "which_matches_image") return `أي كلمة تطابق الصورة؟`;
  }
  if (nativeLang === "es") {
    if (key === "how_to_say") return `¿Cómo se dice en ${langName}:\n«${word}»?`;
    if (key === "what_is_word") return `¿Qué significa ${word} en ${langName}?`;
    if (key === "choose_correct") return `Elige la frase correcta:\n«${word}»`;
    if (key === "say_word") return `Di: ${word}`;
    if (key === "which_matches_image") return `¿Qué palabra coincide con la imagen?`;
  }
  if (nativeLang === "ru") {
    if (key === "how_to_say") return `Как сказать на ${langName}:\n«${word}»?`;
    if (key === "what_is_word") return `Что означает ${word} на ${langName}?`;
    if (key === "choose_correct") return `Выберите правильную фразу:\n«${word}»`;
    if (key === "say_word") return `Скажи: ${word}`;
    if (key === "which_matches_image") return `Какое слово соответствует картинке?`;
  }
  // Default/English
  if (key === "how_to_say") return `How do you say in ${langName}:\n«${word}»?`;
  if (key === "what_is_word") return `What does ${word} mean in ${langName}?`;
  if (key === "choose_correct") return `Choose the correct sentence:\n«${word}»`;
  if (key === "say_word") return `Say: ${word}`;
  if (key === "which_matches_image") return `Which word matches the image?`;
  return word;
}

function mapLessonBankGenerically(lesson: LessonBank, nativeLang: string, targetLang: string): LessonBank {
  if (nativeLang === "ku" && targetLang === "en") return lesson; // Default, no need to map

  const getNativeStr = (obj: any, lang: string, fallbackField: string): string => {
    if (!obj) return "";
    
    // 0. Try dictionary first
    const dictVal = getTranslatedValue(obj, fallbackField, lang);
    if (dictVal != null) return dictVal;

    // 1. Specific field overrides
    if (lang === "ar") {
      if (fallbackField === "prompt" && obj.promptAr) return obj.promptAr;
      if (fallbackField === "targetKurdish" && obj.targetArabic) return obj.targetArabic;
      if (fallbackField === "situation" && obj.situationAr) return obj.situationAr;
      if (fallbackField === "explanation" && obj.explanationAr) return obj.explanationAr;
      if (fallbackField === "topicKu" && obj.topicAr) return obj.topicAr;
    }
    
    // 2. Direct language key check
    if (lang === "en") {
      if (obj.english) {
        if (Array.isArray(obj.english)) return obj.english.join(" ");
        return obj.english;
      }
      if (obj.target) return obj.target;
      if (obj.targetWord) return obj.targetWord;
      if (obj.topic) return obj.topic;
    }
    
    if (lang === "ar" && obj.arabic) return obj.arabic;
    if (lang === "es" && obj.spanish) return obj.spanish;
    if (lang === "ru" && obj.russian) return obj.russian;
    if (lang === "ku" && obj.kurdish) return obj.kurdish;
    
    // 3. Hint checks
    if (lang === "ar" && obj.arabicHint) return obj.arabicHint;
    if (lang === "es" && obj.spanishHint) return obj.spanishHint;
    if (lang === "ru" && obj.russianHint) return obj.russianHint;
    if (lang === "ku" && obj.kurdishHint) return obj.kurdishHint;
    if (obj.hint && typeof obj.hint === "string") return obj.hint;
    
    // 4. Fallbacks: Kurdish is the default source language in the curriculum
    if (obj.kurdish && typeof obj.kurdish === "string") return obj.kurdish;
    if (obj.arabic && typeof obj.arabic === "string") return obj.arabic;
    if (obj.kurdishHint && typeof obj.kurdishHint === "string") return obj.kurdishHint;
    if (obj.topicKu && typeof obj.topicKu === "string") return obj.topicKu;
    if (obj[fallbackField] && typeof obj[fallbackField] === "string") return obj[fallbackField];
    
    return "";
  };

  const getTargetStr = (obj: any, lang: string): string => {
    if (!obj) return "";
    
    // 0. Try dictionary first
    const dictVal = getTranslatedValue(obj, "target", lang);
    if (dictVal != null) return dictVal;

    // 1. Specific field overrides
    if (lang === "ar") {
      if (obj.arabic) {
        if (Array.isArray(obj.arabic)) return obj.arabic.join(" ");
        return obj.arabic;
      }
      if (obj.targetArabic) return obj.targetArabic;
      if (obj.topicAr) return obj.topicAr;
    }
    
    // 2. Default fallback to English (the original curriculum's native structure)
    if (lang === "en" && obj.english) {
      if (Array.isArray(obj.english)) return obj.english.join(" ");
      return obj.english;
    }
    
    return obj.target || obj.targetWord || obj.english || obj.topic || obj.answer || "";
  };

  const getTargetArr = (obj: any, lang: string): string[] => {
    if (!obj) return [];
    
    // 0. Try dictionary first
    const dictVal = getTranslatedValue(obj, "target", lang);
    if (dictVal != null) {
      return dictVal.split(/\s+/);
    }

    // 1. Specific field overrides
    if (lang === "ar") {
      if (obj.arabic) {
        if (Array.isArray(obj.arabic)) return obj.arabic;
        return obj.arabic.split(" ");
      }
      if (obj.targetArabic) return obj.targetArabic.split(" ");
    }
    
    if (lang === "en" && obj.english) {
      if (Array.isArray(obj.english)) return obj.english;
      return obj.english.split(" ");
    }
    
    const targetVal = obj.target || obj.targetWord || obj.english || "";
    if (Array.isArray(targetVal)) return targetVal;
    if (typeof targetVal === "string") return targetVal.split(" ");
    return [];
  };

  return {
    topic: getTargetStr(lesson, targetLang),
    topicKu: getNativeStr(lesson, nativeLang, "topicKu"),
    topicAr: lesson.topicAr,
    words: lesson.words.map((w) => ({
      english: getTargetStr(w, targetLang),
      kurdish: getNativeStr(w, nativeLang, "kurdish"),
      arabic: w.arabic,
    })),
    voices: lesson.voices.map((v) => ({
      prompt: getNativeStr(v, nativeLang, "prompt"),
      target: getTargetStr(v, targetLang),
      targetKurdish: getNativeStr(v, nativeLang, "targetKurdish"),
      targetArabic: v.targetArabic,
    })),
    sentences: lesson.sentences.map((s) => ({
      english: getTargetArr(s, targetLang),
      kurdish: getNativeStr(s, nativeLang, "kurdish"),
      arabic: s.arabic,
    })),

    fillBlanks: lesson.fillBlanks.map((f) => {
      const getAnswer = () => {
        const dictAnswer = getTranslatedValue({ answer: f.answer }, "answer", targetLang);
        if (dictAnswer != null) return dictAnswer;

        if (targetLang === "ar" && f.arabicAnswer) return f.arabicAnswer;
        return f.answer;
      };

      const getParts = () => {
        const fullSentence = f.parts.join(` ${f.answer} `);
        const dictFull = getTranslatedValue({ english: fullSentence }, "english", targetLang);
        if (dictFull != null) {
          const ans = getAnswer();
          if (dictFull.includes(ans)) {
            return dictFull.split(ans);
          }
          return dictFull.split(" ");
        }

        if (targetLang === "ar" && f.arabicParts) return f.arabicParts;
        return f.parts;
      };

      const getWrongs = () => {
        const dictWrongs = f.wrongs.map((w: string) => {
          const trans = getTranslatedValue({ answer: w }, "answer", targetLang);
          return trans != null ? trans : w;
        });
        
        if (dictWrongs.some((w: string, idx: number) => w !== f.wrongs[idx])) {
          return dictWrongs;
        }

        if (targetLang === "ar" && f.arabicWrongs) return f.arabicWrongs;
        return f.wrongs;
      };

      const partsVal = getParts();
      const wrongsVal = getWrongs();

      return {
        ...f,
        hint: getNativeStr(f, nativeLang, "hint"),
        answer: getAnswer(),
        parts: [partsVal[0] || "", partsVal[1] || ""] as [string, string],
        wrongs: [wrongsVal[0] || "", wrongsVal[1] || "", wrongsVal[2] || ""] as [string, string, string],
      };
    }),

    conversations: lesson.conversations.map((c) => {
      const getC = (field: string, arField: string) => {
        const val = (c as any)[field];
        const dictVal = getTranslatedValue({ [field]: val }, field, targetLang);
        if (dictVal != null) return dictVal;

        if (targetLang === "ar" && (c as any)[arField]) return (c as any)[arField];
        return val;
      };
      
      const targetTheyAsk = getC("theyAsk", "theyAskAr");
      const targetCorrect = getC("correct", "correctAr");
      const targetWrong1 = getC("wrong1", "wrong1Ar");
      const targetWrong2 = getC("wrong2", "wrong2Ar");
      const targetWrong3 = getC("wrong3", "wrong3Ar");
      
      return {
        ...c,
        situation: getNativeStr(c, nativeLang, "situation"),
        theyAsk: targetLang === "en" ? c.theyAsk : targetCorrect,
        correct: targetLang === "en" ? c.correct : targetTheyAsk,
        wrong1: targetWrong1,
        wrong2: targetWrong2,
        wrong3: targetWrong3,
        explanation: getNativeStr(c, nativeLang, "explanation"),
      };
    }),
    kidsGames: lesson.kidsGames,
  };
}

function buildLessonQuestionsFromBank(
  rawLesson: LessonBank,
  unitIndex: number,
  lessonIndex: number,
  mode: LessonPathMode,
): GameQuestion[] {
  const nativeLang = useLocaleStore.getState().selectedSourceLanguage;
  const targetLang = useLocaleStore.getState().selectedTargetLanguage;
  const lesson = mapLessonBankGenerically(rawLesson, nativeLang, targetLang);

  // Removed kidsGames full-screen diversion to use standard beautiful React Native UI

  const seed = unitIndex * 997 + lessonIndex * 137;

  const words     = shuffle(lesson.words,         seed);
  const voices    = shuffle(lesson.voices,        seed + 1);
  const sentences = shuffle(lesson.sentences,     seed + 2);
  const fills     = shuffle(lesson.fillBlanks,    seed + 3);
  const convos    = shuffle(lesson.conversations, seed + 4);
  const lessonPool = lessonEnglishPool(lesson);
  const lessonWords = lessonSingleWordPool(lesson);

  const questions: GameQuestion[] = [];
  const isNormal = mode === "normal";
  const isKids = mode === "kids";

  const pushWordMc = (wordIndex: number, optionSeed: number) => {
    const mcWord = pick(words, wordIndex);
    const mcWrongs = pickLessonWrongs(
      words.map((w) => w.english),
      mcWord.english,
      3,
      optionSeed,
    );
    questions.push({
      type: "multiple_choice",
      prompt: getPromptText(
        isNormal ? "how_to_say" : "what_is_word",
        nativeLang,
        targetLang,
        mcWord.kurdish
      ),
      promptLang: nativeLang,
      correctAnswer: mcWord.english,
      options: shuffle([mcWord.english, ...mcWrongs], optionSeed),
      xp: 10,
    });
  };

  if (isKids) {
    // 1. Pair Match (1×)
    const pairCount = Math.min(4, words.length);
    questions.push({
      type: "pair_match",
      pairs: Array.from({ length: pairCount }, (_, i) => pick(words, i)),
      xp: 15,
    });

    // 2. Multiple Choice (1×)
    pushWordMc(0, seed + 10);

    // 3. Sentence Builder (1×)
    if (sentences.length > 0) {
      const s = pick(sentences, 0);
      const sentSet = new Set(s.english.map((w) => w.toLowerCase()));
      const extra = pickLessonWrongs(
        lessonWords,
        "",
        2,
        seed + 20,
        (d) => !sentSet.has(d.toLowerCase()),
      );
      questions.push({
        type: "sentence_builder",
        kurdishSentence: s.kurdish,
        wordBank: shuffle([...s.english, ...extra], seed + 20),
        correctWords: s.english,
        xp: 20,
      });
    }

    // 4. Fill Blank (1×)
    if (fills.length > 0) {
      const f = pick(fills, 0);
      const fillWrongs = sanitizeFillWrongs(f.answer, f.wrongs);
      questions.push({
        type: "fill_blank",
        sentenceParts: f.parts,
        kurdishHint: f.hint,
        correctAnswer: f.answer,
        options: shuffle([f.answer, ...fillWrongs], seed + 40),
        xp: 15,
      });
    } else {
      pushWordMc(1, seed + 40); // fallback
    }

    // 5. Image-to-Word Pair Match (1×)
    // Use words with distinct images so each tile looks different
    const distinctImgWords = getWordsWithDistinctImages(words, 4);
    if (distinctImgWords.length >= 2) {
      questions.push({
        type: "image_pair_match",
        pairs: distinctImgWords.map((w) => ({
          english: w.english,
          kurdish: w.kurdish,
          image: getWord3DImage(w.english),
        })),
        xp: 15,
      });
    } else {
      // Fallback to a regular MC if not enough distinct images
      pushWordMc(2, seed + 55);
    }

    // 6. Which Word Matches the Image (1×)
    const distinctMCImgWords = getWordsWithDistinctImages(words, 1);
    if (distinctMCImgWords.length > 0) {
      const targetWordObj = distinctMCImgWords[0];
      const mcWrongs = pickLessonWrongs(
        words.map((w) => w.english),
        targetWordObj.english,
        3,
        seed + 60
      );
      questions.push({
        type: "image_multiple_choice",
        prompt: "Which word matches the image?",
        correctAnswer: targetWordObj.english,
        image: getWord3DImage(targetWordObj.english),
        options: shuffle([targetWordObj.english, ...mcWrongs], seed + 60),
        xp: 15,
      });
    } else {
      pushWordMc(2, seed + 60); // fallback
    }

    // 7. Memory Flip (1×)
    // Use words with distinct images; offset by 1 so we don't always use the same words as game 5
    const distinctMemWords = getWordsWithDistinctImages(
      [...words.slice(1), ...words.slice(0, 1)], // rotate to get different selection
      3
    );
    if (distinctMemWords.length >= 2) {
      questions.push({
        type: "memory_flip",
        pairs: distinctMemWords.map((w) => ({
          english: w.english,
          kurdish: w.kurdish,
          image: getWord3DImage(w.english),
        })),
        xp: 20,
      });
    } else {
      // Fallback to a regular MC if not enough distinct images
      pushWordMc(3, seed + 65);
    }

    // 8. Voice Games (3×)
    const allVoices: VoiceQuestion[] = [
      ...voices.map(v => ({ type: "voice" as const, prompt: v.prompt, targetWord: v.target, targetKurdish: v.targetKurdish, xp: 20 })),
      ...words.map(w => ({ type: "voice" as const, prompt: getPromptText("say_word", nativeLang, targetLang, w.kurdish), targetWord: w.english, targetKurdish: w.kurdish, xp: 20 })),
      ...sentences.map(s => ({ type: "voice" as const, prompt: getPromptText("say_word", nativeLang, targetLang, s.kurdish), targetWord: s.english.join(" "), targetKurdish: s.kurdish, xp: 20 })),
    ];
    
    const shuffledVoices = shuffle(allVoices, seed + 50);
    for (let i = 0; i < 3; i++) {
      questions.push(pick(shuffledVoices, i));
    }

    return shuffle(questions, seed + 99);
  }

  // ── Normal / Street Mode Generator ─────────────────────────────────────────

  // 1. Pair Match (1×)
  const pairCount = Math.min(4, words.length);
  questions.push({
    type: "pair_match",
    pairs: Array.from({ length: pairCount }, (_, i) => pick(words, i)),
    xp: 15,
  });

  // 2. Multiple Choice (1×)
  const mcSource = isNormal && sentences.length > 0 ? pick(sentences, 0) : null;
  if (isNormal && mcSource) {
    const correctSentence = mcSource.english.join(" ");
    const sentenceWrongs = pickLessonWrongs(
      lessonPool,
      correctSentence,
      3,
      seed + 10,
      (d) => d.split(" ").length > 2,
    );
    questions.push({
      type: "multiple_choice",
      prompt: getPromptText("choose_correct", nativeLang, targetLang, mcSource.kurdish),
      promptLang: nativeLang,
      correctAnswer: correctSentence,
      options: shuffle([correctSentence, ...sentenceWrongs], seed + 10),
      xp: 10,
    });
  } else {
    pushWordMc(4, seed + 10);
  }

  // 3. Voice (2×)
  for (let i = 0; i < 2; i++) {
    const v = pick(voices, i);
    questions.push({ type: "voice", prompt: v.prompt, targetWord: v.target, targetKurdish: v.targetKurdish, xp: 20 });
  }

  // 4. Sentence Builder (2×)
  for (let i = 0; i < 2; i++) {
    const s = pick(sentences, i);
    const sentSet = new Set(s.english.map((w) => w.toLowerCase()));
    const extra = pickLessonWrongs(
      lessonWords,
      "",
      2,
      seed + 20 + i,
      (d) => !sentSet.has(d.toLowerCase()),
    );
    questions.push({
      type: "sentence_builder",
      kurdishSentence: s.kurdish,
      wordBank: shuffle([...s.english, ...extra], seed + 20 + i),
      correctWords: s.english,
      xp: 20,
    });
  }

  // 5. Fill Blank (2×)
  for (let i = 0; i < 2; i++) {
    const f = pick(fills, i);
    const fillWrongs = sanitizeFillWrongs(f.answer, f.wrongs);
    questions.push({
      type: "fill_blank",
      sentenceParts: f.parts,
      kurdishHint: f.hint,
      correctAnswer: f.answer,
      options: shuffle([f.answer, ...fillWrongs], seed + 40 + i),
      xp: 15,
    });
  }

  // 6. Conversation Pick (2×) — fallback to word MC when only one scenario exists
  for (let i = 0; i < 2; i++) {
    const c = convos[i];
    if (!c) {
      pushWordMc(6 + i, seed + 50 + i);
      continue;
    }
    questions.push({
      type: "conversation_pick",
      situation: c.situation,
      theyAsk: c.theyAsk,
      correctAnswer: c.correct,
      optionTiers: buildConversationOptionTiers(c),
      options: shuffle([c.correct, c.wrong1, c.wrong2, c.wrong3], seed + 50 + i),
      explanation: c.explanation,
      xp: 25,
    });
  }

  // 7. Paragraph Speech (if present, or fallback for advanced units)
  if (lesson.paragraphSpeeches && lesson.paragraphSpeeches.length > 0) {
    for (const ps of lesson.paragraphSpeeches) {
      questions.push({
        type: "paragraph_speech",
        mode: ps.mode,
        paragraphs: ps.paragraphs,
        xp: 30, // Higher XP for paragraph reading
      });
    }
  } else {
    // Only add fallback reading practice for unit index >= 2 (Unit 3+)
    // to avoid confusing absolute beginners in Unit 1 (index 0) and Unit 2 (index 1)
    if (unitIndex >= 2) {
      let paragraphsToUse: string[] = [];
      if (sentences.length > 0) {
        // Use sentences from the lesson
        paragraphsToUse = sentences.slice(0, 2).map((s) => s.english.join(" "));
      } else if (voices.length > 0) {
        // Use target words/phrases from the lesson's voices
        paragraphsToUse = [voices.slice(0, 3).map((v) => v.target).join(". ") + "."];
      } else if (words.length > 0) {
        // Use single words from the lesson
        paragraphsToUse = [
          "Let's practice these words: " + words.slice(0, 4).map((w) => w.english).join(", ") + ".",
          "Read them carefully to improve your pronunciation."
        ];
      } else {
        paragraphsToUse = [
          "Let's practice reading some English phrases.",
          "Learning a language is fun when you practice every single day."
        ];
      }

      questions.push({
        type: "paragraph_speech",
        mode: "practice",
        paragraphs: paragraphsToUse,
        xp: 30,
      });
    }
  }

  let result = shuffle(questions, seed + 99);

  // If this is Unit 1, Lesson 1 (normal path), ensure the first game is a pair_match
  if (mode === "normal" && unitIndex === 0 && lessonIndex === 0) {
    const firstQ = result[0];
    if (firstQ && firstQ.type !== "pair_match") {
      const pairMatchIdx = result.findIndex((q) => q.type === "pair_match");
      if (pairMatchIdx !== -1) {
        const pairMatchQ = result[pairMatchIdx];
        // Remove the pair match question from its current index
        result.splice(pairMatchIdx, 1);
        // Remove the first (harder) question
        result.shift();
        // Insert pair match at the beginning
        result.unshift(pairMatchQ);
        // Push the harder question to the end
        result.push(firstQ);
      }
    }
  }

  return result;
}

/** Preview games from a draft lesson bank (admin). */
export function previewLessonQuestions(
  lesson: LessonBank,
  unitIndex: number,
  lessonIndex: number,
  mode: LessonPathMode = "street",
): GameQuestion[] {
  return buildLessonQuestionsFromBank(lesson, unitIndex, lessonIndex, mode);
}

// unitIndex:   which unit (0–11 street, 0–5 normal)
// lessonIndex: which lesson within that unit (0–9), maps to a unique bank
// mode:        street vs normal english content pool
export function getLessonQuestions(
  unitIndex: number,
  lessonIndex: number,
  mode: LessonPathMode = "street",
): GameQuestion[] {
  const units = getUnitsForPath(mode);
  if (units.length === 0) return [];

  const unit = units[Math.abs(unitIndex) % units.length];
  if (!unit?.length) return [];

  const lesson: LessonBank | undefined =
    unit[Math.abs(lessonIndex) % unit.length];
  if (!lesson) return [];

  return buildLessonQuestionsFromBank(lesson, unitIndex, lessonIndex, mode);
}
