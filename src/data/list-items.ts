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

export type SectionTheme = "purple" | "green" | "blue" | "yellow" | "gray" | "orange" | "red" | "mint";

export type LessonListItem = {
  id: string;
  pathIndex: number;
  globalIndex: number;
  sectionItemIndex: number;
  type: LessonType;
  sectionTheme: SectionTheme;
  displayTheme: SectionTheme;
  status: LessonStatus;
  isCurrent: boolean;
  progressSegments: number;
  lessonId: number;
};

export type LessonStatus = "completed" | "current" | "locked";

/** Status by position on the path (ignores gaps in globalIndex between units). */
export function resolveLessonStatus(
  pathIndex: number,
  nextLessonPathIndex: number,
): LessonStatus {
  if (pathIndex < nextLessonPathIndex) return "completed";
  if (pathIndex === nextLessonPathIndex) return "current";
  return "locked";
}

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

/** Build path sections from persisted progress (0 = first lesson is current). */
export function buildSectionData(nextLessonPathIndex: number): SectionDataItem[] {
  let streetPathIndex = 0;

  return sectionConfigs.map(
    ({ title, theme, displayTheme }, sectionIndex): SectionDataItem => {
      const pattern =
        sectionIndex === 0
          ? ["practice" as LessonType, ...BASE_PATTERN]
          : BASE_PATTERN;

      const startGlobalIndex =
        sectionIndex === 0 ? 0 : 25 + (sectionIndex - 1) * 24;

      const data: LessonListItem[] = pattern.map((lessonType, itemIndex) => {
        const currentGlobalIndex = startGlobalIndex + itemIndex;
        const pathIndex = streetPathIndex++;
        const itemStatus = resolveLessonStatus(pathIndex, nextLessonPathIndex);

        return {
          id: `level-${currentGlobalIndex}`,
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

      return { title, theme, displayTheme, data };
    },
  );
}

/** @deprecated Use buildSectionData(nextLessonPathIndex) — default for static imports */
export const sectionData = buildSectionData(0);
