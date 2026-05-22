// ── Normal English — section configs, data builder, and guidebook data ─────────
// Mirrors list-items.ts but for the "Normal English" learning path.

import unit1EverydayEssentials from "./unit-1-everyday-essentials";
import unit2SocialAndDailyLife from "./unit-2-social-and-daily-life";
import unit3WorkAndBusiness from "./unit-3-work-and-business";
import unit4DeepConversations from "./unit-4-deep-conversations";
import unit5SpecialEncounters from "./unit-5-special-encounters";
import unit6TravelAndExploring from "./unit-6-travel-and-exploring";
import type { LessonListItem, LessonStatus, LessonType, SectionDataItem, SectionTheme } from "../list-items";
import type { UnitBank } from "../types";

export const NORMAL_UNITS: UnitBank[] = [
  unit1EverydayEssentials,
  unit2SocialAndDailyLife,
  unit3WorkAndBusiness,
  unit4DeepConversations,
  unit5SpecialEncounters,
  unit6TravelAndExploring,
];

export const normalSectionConfigs: Array<{
  title: string;
  theme: SectionTheme;
  displayTheme: SectionTheme;
}> = [
  { title: "Unit 1: Everyday Essentials",    theme: "blue",   displayTheme: "blue"   },
  { title: "Unit 2: Social & Daily Life",    theme: "green",  displayTheme: "green"  },
  { title: "Unit 3: Work & Business",        theme: "purple", displayTheme: "purple" },
  { title: "Unit 4: Deep Conversations",     theme: "orange", displayTheme: "orange" },
  { title: "Unit 5: Special Encounters",     theme: "red",    displayTheme: "red"    },
  { title: "Unit 6: Travel & Exploring",     theme: "blue",   displayTheme: "blue"   },
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

const NORMAL_USER_LEVEL = 3; // starter progress

export const normalSectionData: SectionDataItem[] = normalSectionConfigs.map(
  ({ title, theme, displayTheme }, sectionIndex): SectionDataItem => {
    const pattern =
      sectionIndex === 0
        ? (["practice" as LessonType, ...BASE_PATTERN])
        : BASE_PATTERN;

    const startGlobalIndex =
      sectionIndex === 0 ? 0 : 25 + (sectionIndex - 1) * 24;

    // First gray section = first locked one
    const firstGraySectionIndex = normalSectionConfigs.findIndex((s) => s.theme === "gray");
    let targetCurrentGlobalIndex = -1;
    if (firstGraySectionIndex !== -1) {
      const secStart = firstGraySectionIndex === 0 ? 0 : 25 + (firstGraySectionIndex - 1) * 24;
      const firstEligible = pattern.findIndex((t) => t !== "gift");
      targetCurrentGlobalIndex = secStart + firstEligible;
    } else {
      // All sections have content — use level cursor
      targetCurrentGlobalIndex = NORMAL_USER_LEVEL;
    }

    const data: LessonListItem[] = pattern.map((lessonType, itemIndex) => {
      const currentGlobalIndex = startGlobalIndex + itemIndex;
      let itemStatus: LessonStatus =
        currentGlobalIndex <= NORMAL_USER_LEVEL ? "completed" : "locked";
      if (currentGlobalIndex === targetCurrentGlobalIndex) {
        itemStatus = "current";
      }
      return {
        id: `ne-level-${currentGlobalIndex}`,
        globalIndex: currentGlobalIndex,
        sectionItemIndex: itemIndex,
        type: lessonType,
        sectionTheme: theme,
        status: itemStatus,
        isCurrent: itemStatus === "current",
        progressSegments: itemStatus === "current" ? 2 : 0,
        lessonId: sectionIndex,
      };
    });

    return { title, theme, displayTheme, data };
  },
);
