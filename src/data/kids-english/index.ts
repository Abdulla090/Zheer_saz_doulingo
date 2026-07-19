// ── Kids English — section configs, data builder ─────────────────────────────

import kidsUnit1Animals from "./unit-1-animals";
import kidsUnit2ColorsAndNumbers from "./unit-2-colors-and-numbers";
import kidsUnit3DailyRoutines from "./unit-3-daily-routines";
import kidsUnit4Food from "./unit-4-kids-food";
import kidsUnit5Family from "./unit-5-kids-family";
import {
  resolveUnitLessonStatus,
  type LessonListItem,
  type LessonType,
  type SectionDataItem,
  type SectionTheme,
} from "../list-items";
import type { UnitBank } from "../types";

export const KIDS_UNITS: UnitBank[] = Array.from({ length: 100 }, (_, i) => {
  const originals = [
    kidsUnit1Animals,
    kidsUnit2ColorsAndNumbers,
    kidsUnit3DailyRoutines,
    kidsUnit4Food,
    kidsUnit5Family,
  ];
  return originals[i % originals.length];
});

export const kidsSectionConfigs: {
  theme: SectionTheme;
  displayTheme: SectionTheme;
}[] = Array.from({ length: 100 }, (_, i) => {
  const themes: { theme: SectionTheme; displayTheme: SectionTheme }[] = [
    { theme: "green", displayTheme: "green" },
    { theme: "orange", displayTheme: "orange" },
    { theme: "blue", displayTheme: "blue" },
    { theme: "purple", displayTheme: "purple" },
    { theme: "red", displayTheme: "red" },
  ];
  return themes[i % themes.length];
});

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

/** Build kids-English path sections from persisted progress (0 = first lesson current). */
export function buildKidsSectionData(
  nextLessonPathIndex: number,
): SectionDataItem[] {
  let kidsPathIndex = 0;

  return kidsSectionConfigs.map(
    ({ theme, displayTheme }, sectionIndex): SectionDataItem => {
      const startGlobalIndex = sectionIndex * KIDS_PATTERN.length;

      const data: LessonListItem[] = KIDS_PATTERN.map(
        (lessonType, itemIndex) => {
          const currentGlobalIndex = startGlobalIndex + itemIndex;
          const pathIndex = kidsPathIndex++;
          const itemStatus = resolveUnitLessonStatus(
            pathIndex,
            nextLessonPathIndex,
            itemIndex,
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
        },
      );

      return { unitIndex: sectionIndex, title: "", theme, displayTheme, data };
    },
  );
}

/** @deprecated Use buildKidsSectionData(index) */
export const kidsSectionData = buildKidsSectionData(0);
