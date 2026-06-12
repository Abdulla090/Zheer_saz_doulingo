// ── Normal English — section configs, data builder, and guidebook data ─────────

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
import {
  resolveLessonStatus,
  type LessonListItem,
  type LessonType,
  type SectionDataItem,
  type SectionTheme,
} from "../list-items";
import type { UnitBank } from "../types";

export const NORMAL_UNITS: UnitBank[] = [
  unit1EverydayEssentials,
  unit2SocialAndDailyLife,
  unit3WorkAndBusiness,
  unit4DeepConversations,
  unit5SpecialEncounters,
  unit6TravelAndExploring,
  unit7IdiomsAndSlang,
  unit8DigitalLife,
  unit9Relationships,
  unit10HealthEmergencies,
  unit11MoneyShopping,
  unit12RealWorldMastery,
  unit13OpinionsAndConfidence,
];

export const normalSectionConfigs: {
  theme: SectionTheme;
  displayTheme: SectionTheme;
}[] = [
  { theme: "blue", displayTheme: "blue" },
  { theme: "green", displayTheme: "green" },
  { theme: "purple", displayTheme: "purple" },
  { theme: "orange", displayTheme: "orange" },
  { theme: "red", displayTheme: "red" },
  { theme: "blue", displayTheme: "blue" },
  { theme: "green", displayTheme: "green" },
  { theme: "purple", displayTheme: "purple" },
  { theme: "orange", displayTheme: "orange" },
  { theme: "red", displayTheme: "red" },
  { theme: "yellow", displayTheme: "yellow" },
  { theme: "mint", displayTheme: "mint" },
  { theme: "purple", displayTheme: "purple" },
];

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
export function buildNormalSectionData(
  nextLessonPathIndex: number,
): SectionDataItem[] {
  let normalPathIndex = 0;

  return normalSectionConfigs.map(
    ({ theme, displayTheme }, sectionIndex): SectionDataItem => {
      const pattern =
        sectionIndex === 0
          ? (["practice" as LessonType, ...BASE_PATTERN])
          : BASE_PATTERN;

      const startGlobalIndex =
        sectionIndex === 0 ? 0 : 25 + (sectionIndex - 1) * 24;

      const data: LessonListItem[] = pattern.map((lessonType, itemIndex) => {
        const currentGlobalIndex = startGlobalIndex + itemIndex;
        const pathIndex = normalPathIndex++;
        const itemStatus = resolveLessonStatus(pathIndex, nextLessonPathIndex, itemIndex === 0);

        return {
          id: `ne-level-${currentGlobalIndex}`,
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

/** @deprecated Use buildNormalSectionData(index) */
export const normalSectionData = buildNormalSectionData(0);
