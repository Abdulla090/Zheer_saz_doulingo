import { describe, expect, it, jest } from "@jest/globals";
import { getLessonQuestions } from "../lesson-content";
import { buildNormalSectionData, getSkippedUnitsCount } from "../normal-english";
import { useSettingsStore } from "../../stores/useSettingsStore";

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

jest.mock("react-native-mmkv", () => ({
  createMMKV: jest.fn(() => ({
    getString: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
  })),
}));

describe("normal English path routing", () => {
  it("keeps placement-skipped units routed to the active curriculum slice", () => {
    useSettingsStore.getState().setEnglishLevel(5);

    const skippedUnits = getSkippedUnitsCount(5);
    const firstPathIndex = skippedUnits * 10;
    const sections = buildNormalSectionData(firstPathIndex);
    const firstVisibleLesson = sections[0]?.data[0];

    expect(sections[0]?.unitIndex).toBe(skippedUnits);
    expect(firstVisibleLesson?.pathIndex).toBe(firstPathIndex);
    expect(firstVisibleLesson?.lessonId).toBe(0);
    expect(firstVisibleLesson?.displayUnitNumber).toBe(skippedUnits + 1);

    const questions = getLessonQuestions(
      firstVisibleLesson!.lessonId,
      firstVisibleLesson!.sectionItemIndex,
      "normal",
    );
    const lessonText = JSON.stringify(questions);

    expect(lessonText).toContain("How have you been");
    expect(lessonText).not.toContain("Food, Dining");
  });
});
