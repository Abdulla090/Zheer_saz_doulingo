import type { LessonListItem, SectionDataItem } from "../data/list-items";
import type { RefObject } from "react";
import type { SectionList } from "react-native";

const LESSON_ROW_HEIGHT = 66;

export function findCurrentLessonLocation(
  sections: SectionDataItem[],
): { sectionIndex: number; itemIndex: number } | null {
  for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
    const itemIndex = sections[sectionIndex].data.findIndex(
      (item) => item.isCurrent || item.status === "current",
    );
    if (itemIndex >= 0) {
      return { sectionIndex, itemIndex };
    }
  }
  return null;
}

/**
 * Section/item coordinates of a specific lesson, for `scrollToLocation`.
 *
 * Matched on `id` rather than object identity: the path screens rebuild their
 * section data on every progress change, so the item handed to a tap callback
 * is not guaranteed to be the same reference now held in `sections`.
 */
export function findItemLocation(
  sections: SectionDataItem[],
  target: Pick<LessonListItem, "id">,
): { sectionIndex: number; itemIndex: number } | null {
  for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
    const itemIndex = sections[sectionIndex].data.findIndex(
      (item) => item.id === target.id,
    );
    if (itemIndex >= 0) {
      return { sectionIndex, itemIndex };
    }
  }
  return null;
}

export function scrollPathToCurrentLesson(
  listRef: RefObject<SectionList<LessonListItem, SectionDataItem> | null>,
  sections: SectionDataItem[],
  animated = true,
) {
  const location = findCurrentLessonLocation(sections);
  if (!location || !listRef.current) return;

  const runScroll = () => {
    listRef.current?.scrollToLocation({
      sectionIndex: location.sectionIndex,
      itemIndex: location.itemIndex,
      animated,
      viewOffset: LESSON_ROW_HEIGHT * 1.5,
      viewPosition: 0.25,
    });
  };

  requestAnimationFrame(() => {
    try {
      runScroll();
    } catch {
      setTimeout(runScroll, 120);
    }
  });
}
