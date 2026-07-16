import type { LessonListItem, SectionDataItem } from "../data/list-items";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import type { SectionList, View } from "react-native";

export type SelectedPathLesson = {
  item: LessonListItem;
  sectionTitle: string;
  anchor?: {
    x: number;
    y: number;
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

      const sectionIndex = sections.findIndex((section) =>
        section.data.some((candidate) => candidate.id === item.id),
      );
      const itemIndex =
        sectionIndex >= 0
          ? sections[sectionIndex].data.findIndex((candidate) => candidate.id === item.id)
          : -1;

      if (sectionIndex >= 0 && itemIndex >= 0) {
        try {
          listRef.current?.scrollToLocation({
            sectionIndex,
            itemIndex,
            animated: true,
            viewPosition: 0.28,
          });
        } catch {
          // The popup still opens if a virtualized row has not measured yet.
        }
      }

      openTimerRef.current = setTimeout(() => {
        openTimerRef.current = null;

        const showPopup = (anchor?: SelectedPathLesson["anchor"]) => {
          if (selectionRequestRef.current !== requestId) return;
          setSelectedLesson({ item, sectionTitle, anchor });
        };

        const root = overlayRootRef.current;
        if (!root || !node) {
          showPopup();
          return;
        }

        root.measureInWindow((rootX, rootY) => {
          node.measureInWindow((nodeX, nodeY, nodeWidth, nodeHeight) => {
            showPopup({
              x: nodeX - rootX + nodeWidth / 2,
              y: nodeY - rootY + nodeHeight + 10,
            });
          });
        });
      }, 180);
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
