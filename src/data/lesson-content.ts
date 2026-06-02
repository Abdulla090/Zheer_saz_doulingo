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

export type {
  GameQuestion,
  VoiceQuestion,
  SentenceBuilderQuestion,
  MultipleChoiceQuestion,
  PairMatchQuestion,
  FillBlankQuestion,
  ConversationPickQuestion,
  LessonBank,
  UnitBank,
} from "./types";

import { buildConversationOptionTiers } from "@/utils/answer-tier";
import { GameQuestion, LessonBank } from "./types";
import { NORMAL_UNITS } from "./normal-english";
import { ALL_UNITS } from "./units";

export type LessonPathMode = "street" | "normal";

function getUnitsForPath(mode: LessonPathMode) {
  return mode === "normal" ? NORMAL_UNITS : ALL_UNITS;
}

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

// ── Main Generator ────────────────────────────────────────────────────────────
// unitIndex:   which unit (0–11 street, 0–5 normal)
// lessonIndex: which lesson within that unit (0–9), maps to a unique bank
// mode:        street vs normal english content pool
export function getLessonQuestions(
  unitIndex: number,
  lessonIndex: number,
  mode: LessonPathMode = "street",
): GameQuestion[] {
  const units = getUnitsForPath(mode);
  const unit   = units[Math.abs(unitIndex) % units.length];
  const lesson: LessonBank = unit[Math.abs(lessonIndex) % unit.length];
  const seed   = unitIndex * 997 + lessonIndex * 137;

  const words     = shuffle(lesson.words,         seed);
  const voices    = shuffle(lesson.voices,        seed + 1);
  const sentences = shuffle(lesson.sentences,     seed + 2);
  const fills     = shuffle(lesson.fillBlanks,    seed + 3);
  const convos    = shuffle(lesson.conversations, seed + 4);
  const lessonPool = lessonEnglishPool(lesson);
  const lessonWords = lessonSingleWordPool(lesson);

  const questions: GameQuestion[] = [];
  const isNormal = mode === "normal";

  // 1. Pair Match (1×) — full phrases in normal mode
  const pairCount = Math.min(4, words.length);
  questions.push({
    type: "pair_match",
    pairs: Array.from({ length: pairCount }, (_, i) => pick(words, i)),
    xp: 15,
  });

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
      prompt: isNormal
        ? `چۆن بە ئینگلیزی دەڵێیت:\n«${mcWord.kurdish}»`
        : `${mcWord.kurdish} بە ئینگلیزی چییە؟`,
      promptLang: "ku",
      correctAnswer: mcWord.english,
      options: shuffle([mcWord.english, ...mcWrongs], optionSeed),
      xp: 10,
    });
  };

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
      prompt: `ڕستەی دروست هەڵبژێرە:\n«${mcSource.kurdish}»`,
      promptLang: "ku",
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

  return shuffle(questions, seed + 99);
}
