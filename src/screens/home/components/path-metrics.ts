import type { LessonPathMode } from "../../../data/lesson-content";

const STREET_LESSON_BUTTON_SIZE = 55;
const NORMAL_LESSON_BUTTON_SIZE = 76;
const KIDS_LESSON_BUTTON_SIZE = 57;
const ITEM_SLOT_HEIGHT = 88;
/**
 * The reference path's proportions: a 76px node in a 74px slot. The slot being
 * *shorter* than the node is deliberate and not a bug — the node's SVG viewBox
 * (`-10 -10 120 130`) is mostly padding, so the drawn token is roughly 73×63 of
 * those 76px. Centring it in 74px leaves the reference's gap between rows.
 *
 * Street and kids still pad from the top: their View-based node hangs a rim and
 * a cast shadow *below* `lessonButtonSize`, so centring would sit them low.
 */
const NORMAL_ITEM_SLOT_HEIGHT = 74;
const KIDS_ITEM_SLOT_HEIGHT = 90;

export function getPathMetrics(
  pathMode: LessonPathMode,
  compactWeb = false,
) {
  const isKids = pathMode === "kids";
  const isNormal = pathMode === "normal";

  if (compactWeb) {
    // Normal keeps the reference's node:slot ratio at a smaller web scale.
    return {
      lessonButtonSize: isKids ? 50 : isNormal ? 64 : 48,
      slotHeight: isKids ? 76 : isNormal ? 62 : 74,
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
