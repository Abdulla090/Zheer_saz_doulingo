import type { LessonPathMode } from "../data/lesson-content";
import type { LessonListItem, SectionDataItem } from "../data/list-items";
import type { RefObject } from "react";
import type { SectionList } from "react-native";
import {
  getPathMetrics,
  KIDS_ROW_HEIGHT,
} from "../screens/home/components/path-metrics";

/**
 * Headroom above the anchored current lesson when auto-scrolling. Fixed pixels
 * so the landing position stays exactly as shipped across all paths.
 */
const SCROLL_VIEW_OFFSET = 99;

/**
 * Outer row height per path, for the fallback offset estimate only — the
 * estimate must match what each list's `getItemLayout` reports. Kids rows are
 * wrapped in a `minHeight: 108` container, so the node slot height alone would
 * undershoot.
 */
function rowHeightForPath(pathMode: LessonPathMode): number {
  if (pathMode === "kids") return KIDS_ROW_HEIGHT;
  return getPathMetrics(pathMode).slotHeight;
}

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
  pathMode: LessonPathMode = "street",
) {
  const location = findCurrentLessonLocation(sections);
  if (!location || !listRef.current) return;

  const runScroll = () => {
    try {
      listRef.current?.scrollToLocation({
        sectionIndex: location.sectionIndex,
        itemIndex: location.itemIndex,
        animated,
        viewOffset: SCROLL_VIEW_OFFSET,
        viewPosition: 0.25,
      });
    } catch {
      // Fallback: estimate scroll offset if section/item is outside rendered window
      try {
        const rowHeight = rowHeightForPath(pathMode);
        let totalItemsBefore = 0;
        for (let s = 0; s < location.sectionIndex; s++) {
          totalItemsBefore += (sections[s]?.data?.length || 0) + 1; // +1 for section header
        }
        totalItemsBefore += location.itemIndex;
        const estimatedOffset = Math.max(0, totalItemsBefore * rowHeight - rowHeight);
        listRef.current?.getScrollResponder()?.scrollTo({
          y: estimatedOffset,
          animated,
        });
      } catch {
        // Safe no-op if list is unmounted or layout not ready
      }
    }
  };

  requestAnimationFrame(() => {
    try {
      runScroll();
    } catch {
      setTimeout(() => {
        try {
          runScroll();
        } catch {
          // Never throw unhandled error from async timers
        }
      }, 120);
    }
  });
}
