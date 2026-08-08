/*
 * Which pet stands beside a unit's path, and where.
 *
 * The path used to draw whichever pet the user picked in settings, at every
 * curve peak — so every mascot down the whole path was the same character. Here
 * the pet is chosen from the unit's own theme colour instead, so a unit reads as
 * one colour family: node, header and companion all agree, and crossing into the
 * next unit visibly hands over to a new face.
 *
 * Each theme lists more than one pet because a unit is long enough to host two
 * peaks. They are ordered best-match first, so a short unit showing only one pet
 * still shows the closest one.
 */

import type { MascotId } from "../../../constants/mascots";
import type { SectionTheme } from "../../../data/list-items";

const THEME_MASCOTS: Record<SectionTheme, readonly MascotId[]> = {
  green: ["orbit", "sprout"],
  mint: ["sprout", "orbit"],
  blue: ["waddle", "moonbun"],
  purple: ["violet", "momo"],
  yellow: ["quacks", "buzzwell"],
  orange: ["pingo", "ember"],
  red: ["ember", "sparkle"],
  gray: ["biscuit", "pingo"],
};

const FALLBACK_MASCOTS: readonly MascotId[] = THEME_MASCOTS.green;

/** The pet for a unit's Nth companion, keyed to that unit's theme colour. */
export function mascotForUnit(
  theme: SectionTheme,
  slot: number,
): MascotId {
  const roster = THEME_MASCOTS[theme] ?? FALLBACK_MASCOTS;
  const index = ((slot % roster.length) + roster.length) % roster.length;
  return roster[index] as MascotId;
}

/*
 * Companions sit at the curve's extremes, where the path swings furthest from
 * centre and leaves a gap wide enough for a pet. Anchoring them to the *unit*
 * rather than to a running global count is what keeps them from drifting: units
 * are 10 lessons and the curve's period is 8, so a global `% 4` rule lands at a
 * different place inside every unit.
 */
const CURVE_PEAK_PERIOD = 4;
const CURVE_PEAK_PHASE = 2;

function isCurvePeak(globalIndex: number): boolean {
  return globalIndex % CURVE_PEAK_PERIOD === CURVE_PEAK_PHASE;
}

/** Every peak row inside the unit that owns `globalIndex`. */
function unitPeakOffsets(
  globalIndex: number,
  sectionItemIndex: number,
  unitLessonCount: number,
): number[] {
  const unitStart = globalIndex - sectionItemIndex;
  const offsets: number[] = [];
  for (let offset = 0; offset < unitLessonCount; offset += 1) {
    if (isCurvePeak(unitStart + offset)) offsets.push(offset);
  }
  return offsets;
}

export type UnitMascotSlot = {
  /** 0 for the unit's opening companion, 1 for the mid-unit one. */
  slot: number;
};

/*
 * A unit hosts two companions: one greeting the learner near lesson 1, one
 * waiting around the midpoint. Both are snapped to the nearest curve peak rather
 * than pinned to a literal lesson number — a pet placed on a straight stretch
 * would land on top of the path instead of beside it.
 */
export function unitMascotSlot(
  globalIndex: number,
  sectionItemIndex: number,
  unitLessonCount: number,
): UnitMascotSlot | null {
  if (!isCurvePeak(globalIndex)) return null;

  const peaks = unitPeakOffsets(globalIndex, sectionItemIndex, unitLessonCount);
  if (peaks.length === 0) return null;

  const opening = peaks[0] as number;
  const midpoint = Math.floor(unitLessonCount / 2);

  let middle = peaks.reduce(
    (best, offset) =>
      Math.abs(offset - midpoint) < Math.abs(best - midpoint) ? offset : best,
    opening,
  );
  // The opening peak can also be the closest to the midpoint in a short unit;
  // step to the next peak so the two companions never collapse onto one row.
  if (middle === opening && peaks.length > 1) middle = peaks[1] as number;

  if (sectionItemIndex === opening) return { slot: 0 };
  if (sectionItemIndex === middle) return { slot: 1 };
  return null;
}
