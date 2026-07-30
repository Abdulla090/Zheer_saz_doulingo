import type { LessonPathMode } from "../../../data/lesson-content";

const STREET_LESSON_BUTTON_SIZE = 54;
const NORMAL_LESSON_BUTTON_SIZE = 58;
const KIDS_LESSON_BUTTON_SIZE = 56;
const ITEM_SLOT_HEIGHT = 88;
const NORMAL_ITEM_SLOT_HEIGHT = 92;
const KIDS_ITEM_SLOT_HEIGHT = 90;

export function getPathMetrics(
  pathMode: LessonPathMode,
  compactWeb = false,
) {
  const isKids = pathMode === "kids";
  const isNormal = pathMode === "normal";

  if (compactWeb) {
    return {
      lessonButtonSize: isKids ? 48 : isNormal ? 50 : 46,
      slotHeight: isKids ? 76 : isNormal ? 78 : 74,
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
