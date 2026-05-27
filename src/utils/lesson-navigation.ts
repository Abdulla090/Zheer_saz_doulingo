import { buildSectionData, type LessonListItem } from "@/data/list-items";
import { buildNormalSectionData } from "@/data/normal-english";
import type { LessonPathMode } from "@/data/lesson-content";

export type LessonRouteParams = {
  pathname: "/lesson";
  params: {
    id: string;
    li: string;
    pi: string;
    mode: LessonPathMode;
    q: string;
  };
};

function findCurrentItem(sections: { data: LessonListItem[] }[]): LessonListItem | null {
  for (const section of sections) {
    const current = section.data.find((d) => d.status === "current");
    if (current) return current;
  }
  for (const section of sections) {
    const unlocked = section.data.find((d) => d.status !== "locked");
    if (unlocked) return unlocked;
  }
  return sections[0]?.data[0] ?? null;
}

export function buildLessonRouteForMode(
  mode: LessonPathMode,
  streetNextIndex: number,
  normalNextIndex: number,
): LessonRouteParams | null {
  const sections =
    mode === "normal"
      ? buildNormalSectionData(normalNextIndex)
      : buildSectionData(streetNextIndex);
  const item = findCurrentItem(sections);
  if (!item) return null;

  return {
    pathname: "/lesson",
    params: {
      id: String(item.lessonId),
      li: String(item.sectionItemIndex),
      pi: String(item.pathIndex),
      mode,
      q: "0",
    },
  };
}
