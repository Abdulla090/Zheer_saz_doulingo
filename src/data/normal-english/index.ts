// ── Normal English — section configs, data builder, and guidebook data ─────────

import { useSettingsStore } from "../../stores/useSettingsStore";
import unit0BasicGreetingsAndIntroductions from "./unit-0-basic-greetings-and-introductions";
import unit0bElementarySituations from "./unit-0b-elementary-situations";
import unit1EverydayEssentials from "./unit-1-everyday-essentials";
import unit2SocialAndDailyLife from "./unit-2-social-and-daily-life";
import unit3WorkAndBusiness from "./unit-3-work-and-business";
import unit4DeepConversations from "./unit-4-deep-conversations";
import unit5SpecialEncounters from "./unit-5-special-encounters";
import unit6TravelAndExploring from "./unit-6-travel-and-exploring";
import unit7IdiomsAndSlang from "./unit-7-idioms-and-slang";
import unit8DigitalLife from "./unit-8-digital-life";
import unit9Relationships from "./unit-9-relationships";
import unit10HealthEmergencies from "./unit-10-health-emergencies";
import unit11MoneyShopping from "./unit-11-money-shopping";
import unit12RealWorldMastery from "./unit-12-real-world-mastery";
import unit13OpinionsAndConfidence from "./unit-13-opinions-and-confidence";
import unit14FoodDiningStorytelling from "./unit-14-food-dining-storytelling";
import unit15LogicPlansHypotheticals from "./unit-15-logic-plans-hypotheticals";
import unit16ScienceMediaModernIssues from "./unit-16-science-media-modern-issues";
import {
  resolveUnitLessonStatus,
  type LessonListItem,
  type LessonType,
  type SectionDataItem,
  type SectionTheme,
} from "../list-items";
import type { UnitBank } from "../types";

export const NORMAL_UNITS: UnitBank[] = [
  unit0BasicGreetingsAndIntroductions, // Unit 1 (A1)
  unit0bElementarySituations, // Unit 2 (A1-A2)
  unit11MoneyShopping, // Unit 3 (A2)
  unit14FoodDiningStorytelling, // Unit 4 (A2)
  unit1EverydayEssentials, // Unit 5 (A2-B1)
  unit2SocialAndDailyLife, // Unit 6 (B1)
  unit8DigitalLife, // Unit 7 (B1)
  unit9Relationships, // Unit 8 (B1)
  unit6TravelAndExploring, // Unit 9 (B1-B2)
  unit10HealthEmergencies, // Unit 10 (B1-B2)
  unit15LogicPlansHypotheticals, // Unit 11 (B2)
  unit3WorkAndBusiness, // Unit 12 (B2)
  unit13OpinionsAndConfidence, // Unit 13 (B2-C1)
  unit16ScienceMediaModernIssues, // Unit 14 (B2-C1)
  unit7IdiomsAndSlang, // Unit 15 (C1)
  unit4DeepConversations, // Unit 16 (C1)
  unit12RealWorldMastery, // Unit 17 (C1-C2)
  unit5SpecialEncounters, // Unit 18 (C2)
];

/**
 * Per-unit node colour, in order. Unit 1 is orange (the app's system accent, so
 * the path opens on-brand), unit 2 purple, then the rest cycle. `theme` and
 * `displayTheme` are kept equal here: the street path uses `theme: "gray"` to
 * mute later units, but the normal path keeps every unit fully coloured.
 */
export const NORMAL_SECTION_THEME_CYCLE: SectionTheme[] = [
  "orange",
  "purple",
  "blue",
  "green",
  "mint",
  "yellow",
  "red",
];

export const normalSectionConfigs: {
  theme: SectionTheme;
  displayTheme: SectionTheme;
}[] = Array.from({ length: 18 }, (_, unitIndex) => {
  const theme =
    NORMAL_SECTION_THEME_CYCLE[unitIndex % NORMAL_SECTION_THEME_CYCLE.length];
  return { theme, displayTheme: theme };
});

const BASE_PATTERN: LessonType[] = [
  "practice",
  "practice",
  "speaking",
  "practice",
  "conversation",
  "practice",
  "speaking",
  "practice",
  "gift",
  "practice",
];

/** Build normal-English path sections from persisted progress (0 = first lesson current). */
export function getSkippedUnitsCount(level: number): number {
  if (level <= 2) return 0;
  if (level <= 4) return 2;
  if (level <= 6) return 5;
  if (level <= 8) return 10;
  return 14;
}

export function buildNormalSectionData(
  nextLessonPathIndex: number,
): SectionDataItem[] {
  const level = useSettingsStore.getState().englishLevel || 5;
  const skipCount = getSkippedUnitsCount(level);
  const activeUnits = NORMAL_UNITS.slice(skipCount);

  let normalPathIndex = skipCount * 10;

  return activeUnits.map((unit, sectionIndex): SectionDataItem => {
    const sourceUnitIndex = sectionIndex + skipCount;
    const config = normalSectionConfigs[sourceUnitIndex] ??
      normalSectionConfigs[sectionIndex] ?? {
        theme: "blue" as SectionTheme,
        displayTheme: "blue" as SectionTheme,
      };
    const { theme, displayTheme } = config;

    const data: LessonListItem[] = unit.map((_, itemIndex) => {
      const pathIndex = normalPathIndex++;
      const lessonType = BASE_PATTERN[itemIndex % BASE_PATTERN.length];
      const itemStatus = resolveUnitLessonStatus(
        pathIndex,
        nextLessonPathIndex,
        itemIndex,
      );

      return {
        id: `ne-level-${pathIndex}`,
        pathIndex,
        globalIndex: pathIndex,
        sectionItemIndex: itemIndex,
        type: lessonType,
        sectionTheme: theme,
        displayTheme,
        status: itemStatus,
        isCurrent: itemStatus === "current",
        // No per-lesson progress is tracked yet, so the ring stays a neutral
        // "you are here" halo rather than showing an invented fraction.
        progressSegments: 0,
        lessonId: sectionIndex,
        displayUnitNumber: sourceUnitIndex + 1,
      };
    });

    return {
      unitIndex: sourceUnitIndex,
      title: "",
      theme,
      displayTheme,
      data,
    };
  });
}

/** @deprecated Use buildNormalSectionData(index) */
export const normalSectionData = buildNormalSectionData(0);
