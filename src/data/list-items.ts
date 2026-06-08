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
  unitIndex: number;
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
export const sectionConfigs: {
  theme: SectionTheme;
  displayTheme: SectionTheme;
}[] = [
  { theme: "blue", displayTheme: "blue" },
  { theme: "green", displayTheme: "green" },
  { theme: "purple", displayTheme: "purple" },
  { theme: "yellow", displayTheme: "yellow" },
  { theme: "gray", displayTheme: "blue" },
  { theme: "gray", displayTheme: "green" },
  { theme: "gray", displayTheme: "purple" },
  { theme: "gray", displayTheme: "yellow" },
  { theme: "gray", displayTheme: "blue" },
  { theme: "gray", displayTheme: "green" },
  { theme: "gray", displayTheme: "purple" },
  { theme: "gray", displayTheme: "yellow" },
];

/** Build path sections from persisted progress (0 = first lesson is current). */
export function buildSectionData(nextLessonPathIndex: number): SectionDataItem[] {
  let streetPathIndex = 0;

  return sectionConfigs.map(
    ({ theme, displayTheme }, sectionIndex): SectionDataItem => {
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

      return { unitIndex: sectionIndex, title: "", theme, displayTheme, data };
    },
  );
}

/** @deprecated Use buildSectionData(nextLessonPathIndex) — default for static imports */
export const sectionData = buildSectionData(0);
