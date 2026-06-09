// ── Kids English — section configs, data builder ─────────────────────────────

import { KIDS_UNLOCK_UNITS_2_AND_3_FOR_TEST } from "../../constants/feature-flags";
import kidsUnit1Animals from "./unit-1-animals";
import kidsUnit2ColorsAndNumbers from "./unit-2-colors-and-numbers";
import kidsUnit3DailyRoutines from "./unit-3-daily-routines";
import kidsUnit4Food from "./unit-4-kids-food";
import kidsUnit5Family from "./unit-5-kids-family";
import {
  resolveLessonStatus,
  type LessonListItem,
  type LessonStatus,
  type LessonType,
  type SectionDataItem,
  type SectionTheme,
} from "../list-items";
import type { UnitBank } from "../types";

export const KIDS_UNITS: UnitBank[] = [
  kidsUnit1Animals,
  kidsUnit2ColorsAndNumbers,
  kidsUnit3DailyRoutines,
  kidsUnit4Food,
  kidsUnit5Family,
];

export const kidsSectionConfigs: {
  theme: SectionTheme;
  displayTheme: SectionTheme;
}[] = [
  { theme: "green", displayTheme: "green" },
  { theme: "orange", displayTheme: "orange" },
  { theme: "blue", displayTheme: "blue" },
  { theme: "purple", displayTheme: "purple" },
  { theme: "red", displayTheme: "red" },
];

// 10 dots per kids unit
const KIDS_PATTERN: LessonType[] = [
  "practice",
  "practice",
  "speaking",
  "practice",
  "conversation",
  "speaking",
  "practice",
  "speaking",
  "conversation",
  "gift",
];

function resolveKidsLessonStatus(
  pathIndex: number,
  nextLessonPathIndex: number,
): LessonStatus {
  if (KIDS_UNLOCK_UNITS_2_AND_3_FOR_TEST && pathIndex >= KIDS_PATTERN.length * KIDS_UNITS.length) {
    return "completed";
  }
  return resolveLessonStatus(pathIndex, nextLessonPathIndex);
}

/** Build kids-English path sections from persisted progress (0 = first lesson current). */
export function buildKidsSectionData(
  nextLessonPathIndex: number,
): SectionDataItem[] {
  let kidsPathIndex = 0;

  return kidsSectionConfigs.map(
    ({ theme, displayTheme }, sectionIndex): SectionDataItem => {
      const startGlobalIndex = sectionIndex * KIDS_PATTERN.length;

      const data: LessonListItem[] = KIDS_PATTERN.map((lessonType, itemIndex) => {
        const currentGlobalIndex = startGlobalIndex + itemIndex;
        const pathIndex = kidsPathIndex++;
        const itemStatus = resolveKidsLessonStatus(
          pathIndex,
          nextLessonPathIndex,
        );

        return {
          id: `kids-level-${currentGlobalIndex}`,
          pathIndex,
          globalIndex: currentGlobalIndex,
          sectionItemIndex: itemIndex,
          type: lessonType,
          sectionTheme: theme,
          displayTheme,
          status: itemStatus,
          isCurrent: itemStatus === "current",
          progressSegments: itemStatus === "current" ? 2 : 0,
          lessonId: sectionIndex,
        };
      });

      return { unitIndex: sectionIndex, title: "", theme, displayTheme, data };
    },
  );
}

/** @deprecated Use buildKidsSectionData(index) */
export const kidsSectionData = buildKidsSectionData(0);
