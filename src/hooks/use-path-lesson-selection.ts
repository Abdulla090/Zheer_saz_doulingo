import type { LessonListItem, SectionDataItem } from "../data/list-items";
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

      // Measure node instantly on user tap before any async layout shifts
      root.measureInWindow((rootX, rootY, rootWidth, rootHeight) => {
        node.measureInWindow((nodeX, nodeY, nodeWidth, nodeHeight) => {
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
    },
    [overlayRootRef],
  );

  useEffect(
    () => () => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
    },
    [],
  );

  return { selectedLesson, selectLesson, dismissLesson };
}
