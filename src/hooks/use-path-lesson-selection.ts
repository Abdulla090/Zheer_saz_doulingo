import type { LessonListItem, SectionDataItem } from "../data/list-items";
import { findItemLocation } from "../utils/path-scroll";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import type { SectionList, View } from "react-native";

export type SelectedPathLesson = {
  item: LessonListItem;
  sectionTitle: string;
  /** Lessons in the tapped node's unit, for the popup's "lesson n of m" line. */
  unitLessonCount?: number;
  anchor?: {
    x: number;
    y: number;
    nodeTop: number;
    nodeHeight: number;
    rootWidth: number;
    rootHeight: number;
  };
};

/*
 * Room the popup needs, mirroring the placement maths in `path-lesson-popup`.
 *
 * These decide one thing only: whether the popup can open where the node
 * already is, or whether the list has to scroll first. Scrolling costs a
 * `SCROLL_SETTLE_MS` wait before anything appears, so it is worth being precise
 * — the previous version asked instead whether the node sat in the top quarter
 * of the viewport *or* within 300pt of the bottom, and on a phone-sized
 * viewport that describes very nearly every node. Almost every tap paid for a
 * scroll it did not need, which is why the popup felt instant on a tall desktop
 * window and sluggish on a short one.
 *
 * The card is compact now, so on any ordinary phone viewport at least one of
 * the two directions fits and the popup opens straight away.
 */
const POPUP_HEIGHT = 170;
const POPUP_GAP = 18;
/** Tab bar and home indicator sit under the list. */
const POPUP_BOTTOM_CLEARANCE = 110;
/** Unit header and stats chrome sit over it. */
const POPUP_TOP_CLEARANCE = 16;

/** Settle time for the scroll before measuring — a moving node measures stale. */
const SCROLL_SETTLE_MS = 320;

type WindowMeasurement = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/** Measure both views in the same native round-trip instead of serial hops. */
function measureNodeAgainstRoot(
  root: View,
  node: View,
  onMeasured: (rootBox: WindowMeasurement, nodeBox: WindowMeasurement) => void,
) {
  let rootBox: WindowMeasurement | null = null;
  let nodeBox: WindowMeasurement | null = null;

  const finish = () => {
    if (rootBox && nodeBox) onMeasured(rootBox, nodeBox);
  };

  root.measureInWindow((x, y, width, height) => {
    rootBox = { x, y, width, height };
    finish();
  });
  node.measureInWindow((x, y, width, height) => {
    nodeBox = { x, y, width, height };
    finish();
  });
}

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
    (
      item: LessonListItem,
      sectionTitle: string,
      node: View | null,
      unitLessonCount?: number,
    ) => {
      if (openTimerRef.current) {
        clearTimeout(openTimerRef.current);
        openTimerRef.current = null;
      }
      /*
       * Only collapse an *open* popup. Returning the previous value untouched
       * keeps React from re-rendering the whole path list before the measure
       * has even started — a wasted pass over every node on the common tap.
       */
      setSelectedLesson((previous) => (previous ? null : previous));
      const requestId = selectionRequestRef.current + 1;
      selectionRequestRef.current = requestId;

      const displayPopupWithAnchor = (anchor?: SelectedPathLesson["anchor"]) => {
        if (selectionRequestRef.current !== requestId) return;
        setSelectedLesson({ item, sectionTitle, unitLessonCount, anchor });
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
        measureNodeAgainstRoot(currentRoot, target, (rootBox, nodeBox) => {
          const anchorX = nodeBox.x - rootBox.x + nodeBox.width / 2;
          const nodeTop = nodeBox.y - rootBox.y;

          displayPopupWithAnchor({
            x: anchorX,
            y: nodeTop + nodeBox.height,
            nodeTop,
            nodeHeight: nodeBox.height,
            rootWidth: rootBox.width,
            rootHeight: rootBox.height,
          });
        });
      };

      /*
       * One measurement pass decides placement *and* anchors the popup.
       *
       * `measureInWindow` is an async hop to the UI thread and back. That thread
       * is also laying out the path's nodes, so each hop costs far more than a
       * frame under load. Root and node used to be measured one after the other;
       * starting both together removes one whole native round-trip before the
       * popup can mount.
       */
      measureNodeAgainstRoot(root, node, (rootBox, nodeBox) => {
        if (selectionRequestRef.current !== requestId) return;

        const nodeTop = nodeBox.y - rootBox.y;
        const nodeBottom = nodeTop + nodeBox.height;

        // The popup opens below the node when there is room, and flips above
        // it when there is not. Only when *neither* direction fits does the
        // list have to move.
        const fitsBelow =
          nodeBottom + POPUP_GAP + POPUP_HEIGHT + POPUP_BOTTOM_CLEARANCE <=
          rootBox.height;
        const fitsAbove =
          nodeTop - POPUP_GAP - POPUP_HEIGHT >= POPUP_TOP_CLEARANCE;
        const location = findItemLocation(sections, item);

        if (fitsBelow || fitsAbove || !location || !listRef.current) {
          // Nothing will move, so these coordinates are already final.
          displayPopupWithAnchor({
            x: nodeBox.x - rootBox.x + nodeBox.width / 2,
            y: nodeTop + nodeBox.height,
            nodeTop,
            nodeHeight: nodeBox.height,
            rootWidth: rootBox.width,
            rootHeight: rootBox.height,
          });
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
