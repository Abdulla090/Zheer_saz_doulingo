import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { findCurrentLessonLocation, findItemLocation, scrollPathToCurrentLesson } from "../path-scroll";
import type { SectionDataItem } from "../../data/list-items";

function makeSections(count: number, currentLessonLocation?: { section: number; item: number }): SectionDataItem[] {
  return Array.from({ length: count }, (_, sIdx) => ({
    unitIndex: sIdx,
    title: `Unit ${sIdx}`,
    theme: "blue",
    displayTheme: "blue",
    data: Array.from({ length: 5 }, (_, iIdx) => {
      const isCurrent =
        currentLessonLocation?.section === sIdx && currentLessonLocation?.item === iIdx;
      return {
        id: `s${sIdx}-i${iIdx}`,
        pathIndex: sIdx * 5 + iIdx,
        globalIndex: sIdx * 5 + iIdx,
        sectionItemIndex: iIdx,
        type: "practice" as const,
        sectionTheme: "blue",
        displayTheme: "blue",
        status: isCurrent ? ("current" as const) : ("locked" as const),
        isCurrent,
        progressSegments: 0,
        lessonId: sIdx,
      };
    }),
  }));
}

describe("path-scroll", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runAllTimers();
    jest.useRealTimers();
  });

  it("finds current lesson location correctly", () => {
    const sections = makeSections(3, { section: 1, item: 2 });
    const location = findCurrentLessonLocation(sections);
    expect(location).toEqual({ sectionIndex: 1, itemIndex: 2 });
  });

  it("returns null if no current lesson exists", () => {
    const sections = makeSections(3);
    const location = findCurrentLessonLocation(sections);
    expect(location).toBeNull();
  });

  it("finds item by id", () => {
    const sections = makeSections(3);
    const location = findItemLocation(sections, { id: "s2-i3" });
    expect(location).toEqual({ sectionIndex: 2, itemIndex: 3 });
  });

  it("safely handles scrollToLocation when listRef is present", () => {
    const sections = makeSections(2, { section: 0, item: 0 });
    const scrollToLocation = jest.fn();
    const mockRef = {
      current: {
        scrollToLocation,
      } as any,
    };

    scrollPathToCurrentLesson(mockRef, sections, false, "normal");
    jest.runAllTimers();
    expect(scrollToLocation).toHaveBeenCalledWith(
      expect.objectContaining({
        sectionIndex: 0,
        itemIndex: 0,
        animated: false,
      })
    );
  });
});
