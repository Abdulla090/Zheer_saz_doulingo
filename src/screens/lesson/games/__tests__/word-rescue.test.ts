import { describe, expect, it } from "@jest/globals";
import type { MultipleChoiceQuestion } from "../../../../data/types";
import { buildWordRescue, hintSelection, selectWordRescue, splitLetters } from "../word-rescue";

const question = (correctAnswer: string): MultipleChoiceQuestion => ({
  type: "multiple_choice", prompt: "وەرگێڕان", promptLang: "ku", correctAnswer,
  options: [correctAnswer, "Another answer"], xp: 10, sourceLanguage: "ku", targetLanguage: "en",
});

describe("Word Rescue", () => {
  it.each(["Hello, my friend!", "I like coffee.", "¡Buenos días!", "Привет, мой друг!", "هذا كتاب جديد", "ئەمە کتێبێکە", "A cafe\u0301 is open."])(
    "preserves the exact answer and letter inventory: %s", answer => {
      const puzzle = buildWordRescue(question(answer))!;
      expect(puzzle).not.toBeNull();
      expect(puzzle.before + puzzle.word + puzzle.after).toBe(answer);
      expect(puzzle.tiles.map(t => t.letter).sort()).toEqual([...puzzle.letters].sort());
      expect(new Set(puzzle.tiles.map(t => t.id)).size).toBe(puzzle.letters.length);
      expect(puzzle.tiles.map(t => t.letter)).not.toEqual(puzzle.letters);
      expect(buildWordRescue(question(answer))).toEqual(puzzle);
    },
  );

  it("alternates across lessons and multiple-choice rounds without mutating content", () => {
    const questions = [question("Hello friend"), question("Good morning")];
    const original = JSON.stringify(questions);
    expect(selectWordRescue(questions, 0, "normal", 0, 0)).not.toBeNull();
    expect(selectWordRescue(questions, 1, "normal", 0, 0)).toBeNull();
    expect(selectWordRescue(questions, 0, "normal", 0, 1)).toBeNull();
    expect(selectWordRescue(questions, 1, "normal", 0, 1)).not.toBeNull();
    expect(selectWordRescue(questions, 0, "kids", 0, 0)).toBeNull();
    expect(selectWordRescue(questions, 0, "street", 0, 0)).toBeNull();
    expect(JSON.stringify(questions)).toBe(original);
  });

  it("retains multiple choice when no useful word can be scrambled", () => {
    for (const answer of ["I am", "123", "aaa", "abcdefghijklmnop"]) {
      expect(buildWordRescue(question(answer))).toBeNull();
    }
  });

  it("keeps vowel marks attached to letters", () => {
    expect(splitLetters("كِتاب")).toEqual(["كِ", "ت", "ا", "ب"]);
    expect(splitLetters("cafe\u0301")).toEqual(["c", "a", "f", "é"]);
  });

  it("repairs a wrong suffix and handles repeated letters without reusing a tile", () => {
    const puzzle = buildWordRescue(question("coffee"))!;
    const wrong = puzzle.tiles.find(t => t.letter === "e")!.id;
    let selected = hintSelection(puzzle, [wrong]);
    expect(puzzle.tiles.find(t => t.id === selected[0])!.letter).toBe("c");
    for (let i = 1; i < puzzle.letters.length; i++) selected = hintSelection(puzzle, selected);
    expect(selected.map(id => puzzle.tiles.find(t => t.id === id)!.letter).join("")).toBe("coffee");
    expect(new Set(selected).size).toBe(6);
    expect(hintSelection(puzzle, selected)).toEqual(selected);
  });
});
