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

export type SectionTheme =
  "purple" | "green" | "blue" | "yellow" | "gray" | "orange" | "red" | "mint";

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
  displayUnitNumber?: number;
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

/** Every unit remains discoverable by keeping its first lesson available. */
export function resolveUnitLessonStatus(
  pathIndex: number,
  nextLessonPathIndex: number,
  sectionItemIndex: number,
): LessonStatus {
  const status = resolveLessonStatus(pathIndex, nextLessonPathIndex);
  return sectionItemIndex === 0 && status === "locked" ? "current" : status;
}

export type SectionDataItem = {
  unitIndex: number;
  title: string;
  theme: SectionTheme;
  displayTheme: SectionTheme;
  data: LessonListItem[];
};

export const BASE_PATTERN: LessonType[] = [
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

/**
 * Lesson type by position within a unit, which is what varies the node's face
 * icon along the path. Positional rather than content-derived, matching the
 * reference path — a lesson bank carries every exercise kind, so there is no
 * single "type" to read off it.
 *
 * `gift` is excluded: this app resolves chest slots separately via
 * `resolveUnitChestKind`, so a gift here would be a node with no chest.
 */
export function lessonTypeForIndex(sectionItemIndex: number): LessonType {
  const type = BASE_PATTERN[sectionItemIndex % BASE_PATTERN.length];
  return type === "gift" ? "practice" : type;
}

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
export function buildSectionData(
  nextLessonPathIndex: number,
): SectionDataItem[] {
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
        const itemStatus = resolveUnitLessonStatus(
          pathIndex,
          nextLessonPathIndex,
          itemIndex,
        );

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
