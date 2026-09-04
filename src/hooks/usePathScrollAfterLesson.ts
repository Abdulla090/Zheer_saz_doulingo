import type { LessonPathMode } from "../data/lesson-content";
import type { LessonListItem, SectionDataItem } from "../data/list-items";
import { useProgressStore } from "../stores/useProgressStore";
import { scrollPathToCurrentLesson } from "../utils/path-scroll";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, type RefObject } from "react";
import type { SectionList } from "react-native";

export function usePathScrollAfterLesson(
  pathMode: LessonPathMode,
  sections: SectionDataItem[],
  listRef: RefObject<SectionList<LessonListItem, SectionDataItem> | null>,
) {
  /*
   * `sections` is rebuilt whenever progress or the UI language changes, which
   * would change this effect's identity if it were closed over directly. Holding
   * the latest array in a ref keeps the focus callback stable, so the effect
   * runs exactly once per focus entry instead of clearing and rescheduling its
   * scroll timer on every data rebuild while the screen is focused. The timer
   * fires 200ms after focus, well after this effect has committed, so the ref
   * is always current by the time the scroll runs.
   */
  const sectionsRef = useRef(sections);
  useEffect(() => {
    sectionsRef.current = sections;
  }, [sections]);

  useFocusEffect(
    useCallback(() => {
      /*
       * The request is set by the lesson screen just before navigating back, so
       * focus entry is the only moment it needs to be observed — read it from
       * the store directly rather than subscribing and re-rendering this hook.
       */
      const { pathScrollAfterLesson: scrollRequest } = useProgressStore.getState();
      if (scrollRequest === pathMode) {
        useProgressStore.getState().consumePathScrollAfterLesson();
      }

      const timer = setTimeout(() => {
        scrollPathToCurrentLesson(listRef, sectionsRef.current, true, pathMode);
      }, 200);

      return () => clearTimeout(timer);
    }, [pathMode, listRef]),
  );
}
