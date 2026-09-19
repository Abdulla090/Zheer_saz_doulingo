import type { GameQuestion, LessonPathMode, MultipleChoiceQuestion } from "../../../data/types";

export type WordRescuePuzzle = {
  word: string;
  before: string;
  after: string;
  letters: string[];
  tiles: { id: number; letter: string }[];
};

// Keep a letter and its accents together, including Arabic vowel marks.
export function splitLetters(text: string): string[] {
  return text.normalize("NFC").toLowerCase().match(/\p{L}\p{M}*/gu) ?? [];
}

export function buildWordRescue(question: MultipleChoiceQuestion): WordRescuePuzzle | null {
  const answer = question.correctAnswer;
  const candidates = [...answer.matchAll(/[\p{L}\p{M}]+(?:['’][\p{L}\p{M}]+)*/gu)]
    .filter(([word]) => !/['’]/.test(word) && splitLetters(word).length >= 3 && splitLetters(word).length <= 10)
    .sort((a, b) => splitLetters(b[0]).length - splitLetters(a[0]).length);
  const match = candidates[0];
  if (!match || match.index === undefined) return null;
  const word = match[0];
  const letters = splitLetters(word);
  // A repeated one-letter word cannot be scrambled into a useful exercise.
  if (new Set(letters).size < 2) return null;
  const tiles = letters.map((letter, id) => ({ id, letter }));
  let seed = Array.from(answer).reduce((n, ch) => (Math.imul(n, 31) + ch.codePointAt(0)!) >>> 0, 17);
  for (let i = tiles.length - 1; i > 0; i--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  if (tiles.every((tile, i) => tile.letter === letters[i])) tiles.push(tiles.shift()!);
  return {
    word,
    before: answer.slice(0, match.index),
    after: answer.slice(match.index + word.length),
    letters,
    tiles,
  };
}

/** Presentation only: preserve authored content, question order, XP and feedback. */
export function selectWordRescue(
  questions: GameQuestion[], index: number, mode: LessonPathMode,
  unitIndex: number, lessonIndex: number,
): WordRescuePuzzle | null {
  const question = questions[index];
  if (mode !== "normal" || question?.type !== "multiple_choice") return null;
  const ordinal = questions.slice(0, index).filter(q => q.type === "multiple_choice").length;
  if ((unitIndex + lessonIndex + ordinal) % 2 !== 0) return null;
  return buildWordRescue(question);
}

/** Reveal the next letter and discard only the incorrect suffix. */
export function hintSelection(puzzle: WordRescuePuzzle, selected: number[]): number[] {
  const prefix: number[] = [];
  for (let i = 0; i < puzzle.letters.length; i++) {
    const id = selected[i];
    if (puzzle.tiles.find(tile => tile.id === id)?.letter !== puzzle.letters[i]) {
      const next = puzzle.tiles.find(tile => tile.letter === puzzle.letters[i] && !prefix.includes(tile.id));
      return next ? [...prefix, next.id] : prefix;
    }
    prefix.push(id);
  }
  return prefix;
}
