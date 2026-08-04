import type { LessonListItem, SectionDataItem } from "../data/list-items";
import { findItemLocation } from "../utils/path-scroll";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import type { SectionList, View } from "react-native";

export type SelectedPathLesson = {
  item: LessonListItem;
  sectionTitle: string;
  anchor?: {
    x: number;
    y: number;
    nodeTop: number;
    nodeHeight: number;
    rootWidth: number;
    rootHeight: number;
  };
};

/**
 * Vertical room the popup needs below a node before it fits there. Mirrors the
 * flip threshold in `path-lesson-popup`: its card runs roughly 200pt, plus an
 * 18pt gap and 80pt of bottom clearance.
 */
const POPUP_CLEARANCE = 300;

/**
 * Top band, as a fraction of viewport height, where a node is too high for the
 * popup to open above it — the unit header and stats chrome live up there.
 */
const TOP_BAND = 0.24;

/** Settle time for the scroll before measuring — a moving node measures stale. */
const SCROLL_SETTLE_MS = 320;

export function usePathLessonSelection(
  listRef: RefObject<SectionList<LessonListItem, SectionDataItem> | null>,
  sections: SectionDataItem[],
  overlayRootRef: RefObject<View | null>,
) {
  const [selectedLesson, setSelectedLesson] = useState<SelectedPathLesson | null>(null);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectionRequestRef = useRef(0);

  const dismissLesson = useCallback(() => {
    selectionRequestRef.current += 1;
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    setSelectedLesson(null);
  }, []);

  const selectLesson = useCallback(
    (item: LessonListItem, sectionTitle: string, node: View | null) => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      setSelectedLesson(null);
      const requestId = selectionRequestRef.current + 1;
      selectionRequestRef.current = requestId;

      const displayPopupWithAnchor = (anchor?: SelectedPathLesson["anchor"]) => {
        if (selectionRequestRef.current !== requestId) return;
        setSelectedLesson({ item, sectionTitle, anchor });
      };

      const root = overlayRootRef.current;
      if (!root || !node) {
        displayPopupWithAnchor();
        return;
      }

      /** Measure, then show. Re-measured after any scroll so the caret lands true. */
      const measureAndShow = () => {
        const currentRoot = overlayRootRef.current;
        const target = node;
        if (!currentRoot || !target) {
          displayPopupWithAnchor();
          return;
        }
        currentRoot.measureInWindow((rootX, rootY, rootWidth, rootHeight) => {
          target.measureInWindow((nodeX, nodeY, nodeWidth, nodeHeight) => {
            const anchorX = nodeX - rootX + nodeWidth / 2;
            const nodeTop = nodeY - rootY;

            displayPopupWithAnchor({
              x: anchorX,
              y: nodeTop + nodeHeight,
              nodeTop,
              nodeHeight,
              rootWidth,
              rootHeight,
            });
          });
        });
      };

      // Decide from the first measurement whether the node needs centring.
      root.measureInWindow((_rootX, rootY, _rootWidth, rootHeight) => {
        if (selectionRequestRef.current !== requestId) return;

        node.measureInWindow((_nodeX, nodeY, _nodeWidth, nodeHeight) => {
          if (selectionRequestRef.current !== requestId) return;

          const nodeTop = nodeY - rootY;
          const nodeBottom = nodeTop + nodeHeight;

          // Too high for the popup to open above it, or too low to open below.
          const nearTop = nodeTop < rootHeight * TOP_BAND;
          const nearBottom = nodeBottom + POPUP_CLEARANCE > rootHeight;
          const location = findItemLocation(sections, item);

          if ((!nearTop && !nearBottom) || !location || !listRef.current) {
            measureAndShow();
            return;
          }

          /*
           * Bring the node to the middle of the viewport, then open. Measuring
           * before the scroll settles would anchor the popup to where the node
           * *was*, which is exactly the off-screen popup this avoids.
           */
          try {
            listRef.current.scrollToLocation({
              sectionIndex: location.sectionIndex,
              itemIndex: location.itemIndex,
              animated: true,
              viewPosition: 0.5,
            });
          } catch {
            measureAndShow();
            return;
          }

          openTimerRef.current = setTimeout(() => {
            openTimerRef.current = null;
            if (selectionRequestRef.current !== requestId) return;
            measureAndShow();
          }, SCROLL_SETTLE_MS);
        });
      });
    },
    [listRef, overlayRootRef, sections],
  );

  useEffect(
    () => () => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
    },
    [],
  );

  return { selectedLesson, selectLesson, dismissLesson };
}
