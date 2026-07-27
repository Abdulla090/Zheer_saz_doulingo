import type { LessonPathMode } from "../../../data/lesson-content";

const STREET_LESSON_BUTTON_SIZE = 70;
const NORMAL_LESSON_BUTTON_SIZE = 76;
const KIDS_LESSON_BUTTON_SIZE = 72;
const ITEM_SLOT_HEIGHT = 98;
const NORMAL_ITEM_SLOT_HEIGHT = 104;
const KIDS_ITEM_SLOT_HEIGHT = 100;

export function getPathMetrics(
  pathMode: LessonPathMode,
  compactWeb = false,
) {
  const isKids = pathMode === "kids";
  const isNormal = pathMode === "normal";

  if (compactWeb) {
    return {
      lessonButtonSize: isKids ? 58 : isNormal ? 60 : 56,
      slotHeight: isKids ? 80 : isNormal ? 82 : 78,
    };
  }

  return {
    lessonButtonSize: isKids
      ? KIDS_LESSON_BUTTON_SIZE
      : isNormal
        ? NORMAL_LESSON_BUTTON_SIZE
        : STREET_LESSON_BUTTON_SIZE,
    slotHeight: isKids
      ? KIDS_ITEM_SLOT_HEIGHT
      : isNormal
        ? NORMAL_ITEM_SLOT_HEIGHT
        : ITEM_SLOT_HEIGHT,
  };
}
