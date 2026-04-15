export type LessonType =
  | "practice"
  | "video"
  | "reading"
  | "listening"
  | "gift"
  | "game"
  | "speaking"
  | "conversation"
  | "cup";

export type SectionTheme = "purple" | "green" | "blue" | "yellow" | "gray";

export type LessonListItem = {
  id: string;
  globalIndex: number;
  sectionItemIndex: number;
  type: LessonType;
  sectionTheme: SectionTheme;
  status: LessonStatus;
  isCurrent: boolean;
  progressSegments: number;
  lessonId: number;
};

export type LessonStatus = "completed" | "current" | "locked";

export type SectionDataItem = {
  title: string;
  theme: SectionTheme;
  displayTheme: SectionTheme;
  data: LessonListItem[];
};

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

// ── 12 units: first is BLUE, second uses GREEN, rest follow  ──────────────
export const sectionConfigs: Array<{
  title: string;
  theme: SectionTheme;
  displayTheme: SectionTheme;
}> = [
  // Units 1–4: full-color (unlocked from start)
  { title: "یەکەی ١: سڵاوی سەر شەقام",           theme: "blue",   displayTheme: "blue"   },
  { title: "یەکەی ٢: چوونە دەرەوە و پلان",         theme: "green",  displayTheme: "green"  },
  { title: "یەکەی ٣: قسەی ڕۆژانە",               theme: "purple", displayTheme: "purple" },
  { title: "یەکەی ٤: کافتریا و خواردنی خێرا",     theme: "yellow", displayTheme: "yellow" },

  // Units 5–12: gray but with distinct display colors (locked, unlocked progressively)
  { title: "یەکەی ٥: هەستەکان و بێزاری",          theme: "gray",   displayTheme: "blue"   },
  { title: "یەکەی ٦: سۆشیاڵ میدیا و تێکست",       theme: "gray",   displayTheme: "green"  },
  { title: "یەکەی ٧: شەڕەقسە و تێگەیشتن",         theme: "gray",   displayTheme: "purple" },
  { title: "یەکەی ٨: کارو پیشە (Job English)",    theme: "gray",   displayTheme: "yellow" },
  { title: "یەکەی ٩: ئەکادیمی و زانستگا",          theme: "gray",   displayTheme: "blue"   },
  { title: "یەکەی ١٠: تەلەفۆن و چاوپێکەوتن",     theme: "gray",   displayTheme: "green"  },
  { title: "یەکەی ١١: ئەوەرجەنسی و یارمەتی",      theme: "gray",   displayTheme: "purple" },
  { title: "یەکەی ١٢: ئیدیۆم و ئەکسپرێشن",        theme: "gray",   displayTheme: "yellow" },
];

const CURRENT_USER_LEVEL = 45;

const firstGraySectionIndex = sectionConfigs.findIndex((s) => s.theme === "gray");

let targetCurrentGlobalIndex = -1;

if (firstGraySectionIndex !== -1) {
  const sectionStartGlobalIndex =
    firstGraySectionIndex === 0 ? 0 : 25 + (firstGraySectionIndex - 1) * 24;

  const pattern =
    firstGraySectionIndex === 0
      ? (["practice", ...BASE_PATTERN] as LessonType[])
      : BASE_PATTERN;

  const firstEligibleItemOffset = pattern.findIndex((type) => type !== "gift");
  targetCurrentGlobalIndex = sectionStartGlobalIndex + firstEligibleItemOffset;
}

export const sectionData = sectionConfigs.map(
  ({ title, theme, displayTheme }, sectionIndex): SectionDataItem => {
    const pattern =
      sectionIndex === 0
        ? ["practice" as LessonType, ...BASE_PATTERN]
        : BASE_PATTERN;

    const startGlobalIndex =
      sectionIndex === 0 ? 0 : 25 + (sectionIndex - 1) * 24;

    const data: LessonListItem[] = pattern.map((lessonType, itemIndex) => {
      const currentGlobalIndex = startGlobalIndex + itemIndex;

      let itemStatus: LessonStatus =
        currentGlobalIndex <= CURRENT_USER_LEVEL ? "completed" : "locked";

      if (currentGlobalIndex === targetCurrentGlobalIndex) {
        itemStatus = "current";
      }

      return {
        id: `level-${currentGlobalIndex}`,
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
