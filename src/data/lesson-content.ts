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

import { GameQuestion, LessonBank } from "./types";
import { ALL_UNITS } from "./units";

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

// ── Build distractor pool from all lesson banks ──────────────────────────────
const ALL_ENGLISH = ALL_UNITS.flatMap(unit =>
  unit.flatMap(lesson => lesson.words.map(w => w.english))
);

// ── Main Generator ────────────────────────────────────────────────────────────
// unitIndex:   which unit (0–11)
// lessonIndex: which lesson within that unit (0–9), maps to a unique bank
export function getLessonQuestions(
  unitIndex: number,
  lessonIndex: number
): GameQuestion[] {
  const unit   = ALL_UNITS[Math.abs(unitIndex) % ALL_UNITS.length];
  const lesson: LessonBank = unit[Math.abs(lessonIndex) % unit.length];
  const seed   = unitIndex * 997 + lessonIndex * 137;

  const words     = shuffle(lesson.words,         seed);
  const voices    = shuffle(lesson.voices,        seed + 1);
  const sentences = shuffle(lesson.sentences,     seed + 2);
  const fills     = shuffle(lesson.fillBlanks,    seed + 3);
  const convos    = shuffle(lesson.conversations, seed + 4);
  const distractors = shuffle(ALL_ENGLISH,        seed + 5);
  const safeD = (i: number) => distractors[Math.abs(i) % distractors.length];

  const questions: GameQuestion[] = [];

  // 1. Pair Match (1×)
  const pairCount = Math.min(4, words.length);
  questions.push({
    type: "pair_match",
    pairs: Array.from({ length: pairCount }, (_, i) => pick(words, i)),
    xp: 15,
  });

  // 2. Multiple Choice (1×)
  const mcWord = pick(words, 4);
  const mcWrongs: string[] = [];
  for (let i = 0; mcWrongs.length < 3; i++) {
    const d = safeD(i + 20);
    if (d !== mcWord.english && !mcWrongs.includes(d)) mcWrongs.push(d);
  }
  questions.push({
    type: "multiple_choice",
    prompt: `${mcWord.kurdish} بە ئینگلیزی چییە؟`,
    promptLang: "ku",
    correctAnswer: mcWord.english,
    options: shuffle([mcWord.english, ...mcWrongs], seed + 10),
    xp: 10,
  });

  // 3. Voice (2×)
  for (let i = 0; i < 2; i++) {
    const v = pick(voices, i);
    questions.push({ type: "voice", prompt: v.prompt, targetWord: v.target, targetKurdish: v.targetKurdish, xp: 20 });
  }

  // 4. Sentence Builder (2×)
  for (let i = 0; i < 2; i++) {
    const s = pick(sentences, i);
    const sentSet = new Set(s.english.map(w => w.toLowerCase()));
    const extra: string[] = [];
    for (let j = 0; extra.length < 2; j++) {
      const d = safeD(seed + i * 7 + j + 30);
      if (!sentSet.has(d.toLowerCase()) && !extra.includes(d)) extra.push(d);
    }
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
    questions.push({
      type: "fill_blank",
      sentenceParts: f.parts,
      kurdishHint: f.hint,
      correctAnswer: f.answer,
      options: shuffle([f.answer, ...f.wrongs], seed + 40 + i),
      xp: 15,
    });
  }

  // 6. Conversation Pick (2×)
  for (let i = 0; i < 2; i++) {
    const c = pick(convos, i);
    questions.push({
      type: "conversation_pick",
      situation: c.situation,
      theyAsk: c.theyAsk,
      correctAnswer: c.correct,
      options: shuffle([c.correct, c.wrong1, c.wrong2, c.wrong3], seed + 50 + i),
      explanation: c.explanation,
      xp: 25,
    });
  }

  return shuffle(questions, seed + 99);
}
