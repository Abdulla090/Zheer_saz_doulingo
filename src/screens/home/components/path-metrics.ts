import type { LessonPathMode } from "../../../data/lesson-content";

const STREET_LESSON_BUTTON_SIZE = 58;
const NORMAL_LESSON_BUTTON_SIZE = 80;
const KIDS_LESSON_BUTTON_SIZE = 60;
const ITEM_SLOT_HEIGHT = 92;
/**
 * The reference path's own numbers: an 80px node in a 78px slot. The slot being
 * *shorter* than the node is deliberate and not a bug — the node's SVG viewBox
 * (`-10 -10 120 130`) is mostly padding, so the drawn token is roughly 73×63 of
 * those 80px. Centring it in 78px leaves the reference's gap between rows.
 *
 * Street and kids still pad from the top: their View-based node hangs a rim and
 * a cast shadow *below* `lessonButtonSize`, so centring would sit them low.
 */
const NORMAL_ITEM_SLOT_HEIGHT = 78;
const KIDS_ITEM_SLOT_HEIGHT = 94;

export function getPathMetrics(
  pathMode: LessonPathMode,
  compactWeb = false,
) {
  const isKids = pathMode === "kids";
  const isNormal = pathMode === "normal";

  if (compactWeb) {
    // Normal keeps the reference's node:slot ratio (80:78) at a smaller scale.
    return {
      lessonButtonSize: isKids ? 52 : isNormal ? 68 : 50,
      slotHeight: isKids ? 80 : isNormal ? 66 : 78,
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
