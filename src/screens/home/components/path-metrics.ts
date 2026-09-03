import { Platform } from "react-native";

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

/*
 * Section header heights.
 *
 * `getItemLayout` has to agree with what the header components actually lay
 * out, so the numbers live here rather than only inside each header's
 * StyleSheet. Each value is the header's own height plus its bottom margin,
 * because both occupy space in the list.
 *
 * Unit 0 renders no header at all (both header components return null for
 * `unitIndex === 0`), which is why the layout builder takes a per-section
 * height function instead of one constant.
 */

/** `NormalEnglishPathScreen`'s `darkStyles.sectionHeader`: 48 + 2 margin. */
export const NORMAL_SECTION_HEADER_HEIGHT = 50;

/** `ListSectionHeader`'s `wrap`: 56 + 4 margin. Used by the street path. */
export const STREET_SECTION_HEADER_HEIGHT = 60;

/**
 * The kids path passes no `renderSectionHeader`, so its section header cells
 * render nothing and take no space.
 */
export const KIDS_SECTION_HEADER_HEIGHT = 0;

/**
 * Outer row height for the kids path.
 *
 * `KidsPathListRow` wraps `ListItem` in a `minHeight: 108` container, so the
 * row is taller than the 90pt node slot `getPathMetrics` reports.
 */
export const KIDS_ROW_HEIGHT = 108;

/**
 * Whether a path renders at its narrow web scale.
 *
 * `ListItem` decides its own row height from this, and `getItemLayout` has to
 * report the same number, so the rule lives here instead of being spelled out
 * at each site.
 */
export function isCompactWebPath(screenWidth: number): boolean {
  return Platform.OS === "web" && screenWidth < 768;
}

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
