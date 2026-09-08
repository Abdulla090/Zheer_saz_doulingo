import type { LessonListItem, SectionDataItem } from "../data/list-items";
import { findItemLocation } from "../utils/path-scroll";
import { getWebDesktopZoomFactor } from "../constants/web-layout";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { Platform, type SectionList, type View } from "react-native";

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

/** Measure both views in the same native round-trip with a fallback timer. */
function measureNodeAgainstRoot(
  root: View,
  node: View,
  onMeasured: (rootBox: WindowMeasurement, nodeBox: WindowMeasurement) => void,
) {
  let rootBox: WindowMeasurement | null = null;
  let nodeBox: WindowMeasurement | null = null;
  let done = false;

  const finish = () => {
    if (done) return;
    if (rootBox && nodeBox) {
      done = true;
      const zoom = getWebDesktopZoomFactor();
      if (zoom !== 1 && zoom > 0) {
        onMeasured(
          {
            x: rootBox.x / zoom,
            y: rootBox.y / zoom,
            width: rootBox.width / zoom,
            height: rootBox.height / zoom,
          },
          {
            x: nodeBox.x / zoom,
            y: nodeBox.y / zoom,
            width: nodeBox.width / zoom,
            height: nodeBox.height / zoom,
          },
        );
        return;
      }
      onMeasured(rootBox, nodeBox);
    }
  };

  // 1. Web-native DOM measurement (instant, accurate, never throws)
  if (Platform.OS === "web") {
    try {
      const rootEl = root as any;
      const nodeEl = node as any;
      const r = rootEl?.getBoundingClientRect ? rootEl.getBoundingClientRect() : null;
      const n = nodeEl?.getBoundingClientRect ? nodeEl.getBoundingClientRect() : null;
      if (r && n) {
        rootBox = { x: r.left, y: r.top, width: r.width, height: r.height };
        nodeBox = { x: n.left, y: n.top, width: n.width, height: n.height };
        finish();
        return;
      }
    } catch {
      // ignore and fallback
    }
  }

  // 2. React Native native measureInWindow
  try {
    if (typeof (root as any)?.measureInWindow === "function") {
      root.measureInWindow((x, y, width, height) => {
        rootBox = { x: x || 0, y: y || 0, width: width || 0, height: height || 0 };
        finish();
      });
    } else {
      rootBox = { x: 0, y: 0, width: 360, height: 700 };
    }
  } catch {
    rootBox = { x: 0, y: 0, width: 360, height: 700 };
  }

  try {
    if (typeof (node as any)?.measureInWindow === "function") {
      node.measureInWindow((x, y, width, height) => {
        nodeBox = { x: x || 0, y: y || 0, width: width || 0, height: height || 0 };
        finish();
      });
    } else {
      nodeBox = { x: 180, y: 350, width: 80, height: 80 };
    }
  } catch {
    nodeBox = { x: 180, y: 350, width: 80, height: 80 };
  }

  // Safety fallback so popup never hangs if measureInWindow is dropped
  setTimeout(() => {
    if (!done) {
      done = true;
      onMeasured(
        rootBox ?? { x: 0, y: 0, width: 360, height: 700 },
        nodeBox ?? { x: 180, y: 350, width: 80, height: 80 },
      );
    }
  }, 100);
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

      measureNodeAgainstRoot(root, node, (rootBox, nodeBox) => {
        if (selectionRequestRef.current !== requestId) return;

        const nodeTop = nodeBox.y - rootBox.y;

        displayPopupWithAnchor({
          x: nodeBox.x - rootBox.x + (nodeBox.width || 80) / 2,
          y: nodeTop + (nodeBox.height || 80),
          nodeTop,
          nodeHeight: nodeBox.height || 80,
          rootWidth: rootBox.width || 360,
          rootHeight: rootBox.height || 700,
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
