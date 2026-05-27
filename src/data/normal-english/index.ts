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

export const normalSectionConfigs: Array<{
  title: string;
  theme: SectionTheme;
  displayTheme: SectionTheme;
}> = [
  { title: "Unit 1: Everyday Essentials",       theme: "blue",   displayTheme: "blue"   },
  { title: "Unit 2: Social & Daily Life",       theme: "green",  displayTheme: "green"  },
  { title: "Unit 3: Work & Business",           theme: "purple", displayTheme: "purple" },
  { title: "Unit 4: Deep Conversations",        theme: "orange", displayTheme: "orange" },
  { title: "Unit 5: Special Encounters",        theme: "red",    displayTheme: "red"    },
  { title: "Unit 6: Travel & Exploring",        theme: "blue",   displayTheme: "blue"   },
  { title: "Unit 7: Idioms & Natural Slang",   theme: "green",  displayTheme: "green"  },
  { title: "Unit 8: Digital Life",             theme: "purple", displayTheme: "purple" },
  { title: "Unit 9: Relationships & Feelings",  theme: "orange", displayTheme: "orange" },
  { title: "Unit 10: Health & Emergencies",    theme: "red",    displayTheme: "red"    },
  { title: "Unit 11: Money & Shopping",         theme: "yellow", displayTheme: "yellow" },
  { title: "Unit 12: Real-World Mastery",       theme: "mint",   displayTheme: "mint"   },
  { title: "Unit 13: Opinions & Confidence",   theme: "purple", displayTheme: "purple" },
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

const NORMAL_USER_LEVEL = 3;
const NORMAL_NEXT_PATH_INDEX = NORMAL_USER_LEVEL;

let normalPathIndex = 0;

export const normalSectionData: SectionDataItem[] = normalSectionConfigs.map(
  ({ title, theme, displayTheme }, sectionIndex): SectionDataItem => {
    const pattern =
      sectionIndex === 0
        ? (["practice" as LessonType, ...BASE_PATTERN])
        : BASE_PATTERN;

    const startGlobalIndex =
      sectionIndex === 0 ? 0 : 25 + (sectionIndex - 1) * 24;

    const data: LessonListItem[] = pattern.map((lessonType, itemIndex) => {
      const currentGlobalIndex = startGlobalIndex + itemIndex;
      const pathIndex = normalPathIndex++;
      const itemStatus = resolveLessonStatus(pathIndex, NORMAL_NEXT_PATH_INDEX);

      return {
        id: `ne-level-${currentGlobalIndex}`,
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

    return { title, theme, displayTheme, data };
  },
);
