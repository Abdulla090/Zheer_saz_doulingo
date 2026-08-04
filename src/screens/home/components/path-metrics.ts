import type { LessonPathMode } from "../../../data/lesson-content";

const STREET_LESSON_BUTTON_SIZE = 58;
const NORMAL_LESSON_BUTTON_SIZE = 62;
const KIDS_LESSON_BUTTON_SIZE = 60;
const ITEM_SLOT_HEIGHT = 92;
/**
 * Normal path nodes carry a deeper rim and a cast ground shadow, so their slot
 * is taller than street/kids to keep the vertical rhythm even. 62px node →
 * 53px face + 10px rim + shadow ≈ 72px of ink in a 104px slot.
 */
const NORMAL_ITEM_SLOT_HEIGHT = 104;
const KIDS_ITEM_SLOT_HEIGHT = 94;

export function getPathMetrics(
  pathMode: LessonPathMode,
  compactWeb = false,
) {
  const isKids = pathMode === "kids";
  const isNormal = pathMode === "normal";

  if (compactWeb) {
    return {
      lessonButtonSize: isKids ? 52 : isNormal ? 54 : 50,
      slotHeight: isKids ? 80 : isNormal ? 90 : 78,
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
