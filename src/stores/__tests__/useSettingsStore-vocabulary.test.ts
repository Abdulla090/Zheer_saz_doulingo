import { describe, expect, it, jest } from "@jest/globals";
import {
  mergeTutorVocabulary,
  resolveFocusModeEnabled,
} from "../useSettingsStore";

jest.mock("react-native-mmkv", () => ({
  createMMKV: jest.fn(() => ({
    getString: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe("mergeTutorVocabulary", () => {
  it("promotes mastered words and keeps review words unique", () => {
    expect(
      mergeTutorVocabulary(["Hello"], ["Plan", "coffee"], {
        wordsIntroduced: ["Coffee", "Travel"],
        wordsMastered: ["plan", "HELLO"],
        wordsForReview: ["travel", "Airport"],
      }),
    ).toEqual({
      knownWords: ["Hello", "plan"],
      wordsInProgress: ["coffee", "Travel", "Airport"],
    });
  });
});

describe("resolveFocusModeEnabled", () => {
  it("defaults to focus mode without overriding an explicit opt-out", () => {
    expect(resolveFocusModeEnabled(undefined)).toBe(true);
    expect(resolveFocusModeEnabled(true)).toBe(true);
    expect(resolveFocusModeEnabled(false)).toBe(false);
  });
});
