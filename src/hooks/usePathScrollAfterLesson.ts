import type { LessonPathMode } from "../data/lesson-content";
import type { LessonListItem, SectionDataItem } from "../data/list-items";
import { useProgressStore } from "../stores/useProgressStore";
import { scrollPathToCurrentLesson } from "../utils/path-scroll";
import { useFocusEffect } from "expo-router";
import { useCallback, type RefObject } from "react";
import type { SectionList } from "react-native";

export function usePathScrollAfterLesson(
  pathMode: LessonPathMode,
  sections: SectionDataItem[],
  listRef: RefObject<SectionList<LessonListItem, SectionDataItem> | null>,
) {
  const scrollRequest = useProgressStore((s) => s.pathScrollAfterLesson);
  const consumeScrollRequest = useProgressStore((s) => s.consumePathScrollAfterLesson);

  useFocusEffect(
    useCallback(() => {
      if (scrollRequest !== pathMode) return;

      consumeScrollRequest();
      const timer = setTimeout(() => {
        scrollPathToCurrentLesson(listRef, sections, true);
      }, 200);

      return () => clearTimeout(timer);
    }, [pathMode, sections, scrollRequest, consumeScrollRequest, listRef]),
  );
}
