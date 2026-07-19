import type { LessonPathMode } from "../../../data/lesson-content";

const STREET_LESSON_BUTTON_SIZE = 76;
const NORMAL_LESSON_BUTTON_SIZE = 82;
const KIDS_LESSON_BUTTON_SIZE = 78;
const ITEM_SLOT_HEIGHT = 106;
const NORMAL_ITEM_SLOT_HEIGHT = 112;
const KIDS_ITEM_SLOT_HEIGHT = 108;

export function getPathMetrics(
  pathMode: LessonPathMode,
  compactWeb = false,
) {
  const isKids = pathMode === "kids";
  const isNormal = pathMode === "normal";

  if (compactWeb) {
    return {
      lessonButtonSize: isKids ? 62 : isNormal ? 64 : 60,
      slotHeight: isKids ? 86 : isNormal ? 88 : 84,
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
