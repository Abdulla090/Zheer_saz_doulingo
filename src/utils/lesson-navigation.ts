import { buildSectionData, type LessonListItem, type SectionDataItem } from "@/data/list-items";
import { buildNormalSectionData } from "@/data/normal-english";
import type { LessonPathMode } from "@/data/lesson-content";
import { localizePathSections } from "@/data/path-unit-titles";
import type { AppLocale } from "@/i18n";

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

export type CurrentLessonMeta = {
  mode: LessonPathMode;
  sectionTitle: string;
  lessonNumber: number;
  pathIndex: number;
  item: LessonListItem;
};

function findCurrentItem(
  sections: SectionDataItem[],
): { item: LessonListItem; sectionTitle: string } | null {
  for (const section of sections) {
    const current = section.data.find((d) => d.status === "current");
    if (current) return { item: current, sectionTitle: section.title };
  }
  for (const section of sections) {
    const unlocked = section.data.find((d) => d.status !== "locked");
    if (unlocked) return { item: unlocked, sectionTitle: section.title };
  }
  const first = sections[0]?.data[0];
  if (first) {
    return { item: first, sectionTitle: sections[0]?.title ?? "" };
  }
  return null;
}

export function getCurrentLessonMeta(
  mode: LessonPathMode,
  streetNextIndex: number,
  normalNextIndex: number,
  locale: AppLocale = "en",
): CurrentLessonMeta | null {
  const sections =
    mode === "normal"
      ? buildNormalSectionData(normalNextIndex)
      : buildSectionData(streetNextIndex);
  const localized = localizePathSections(sections, mode, locale);
  const found = findCurrentItem(localized);
  if (!found) return null;

  const { item, sectionTitle } = found;
  return {
    mode,
    sectionTitle,
    lessonNumber: item.pathIndex + 1,
    pathIndex: item.pathIndex,
    item,
  };
}

export function buildLessonRouteForMode(
  mode: LessonPathMode,
  streetNextIndex: number,
  normalNextIndex: number,
): LessonRouteParams | null {
  const meta = getCurrentLessonMeta(mode, streetNextIndex, normalNextIndex);
  if (!meta) return null;

  return {
    pathname: "/lesson",
    params: {
      id: String(meta.item.lessonId),
      li: String(meta.item.sectionItemIndex),
      pi: String(meta.item.pathIndex),
      mode,
      q: "0",
    },
  };
}

export function buildLessonRouteFromMeta(meta: CurrentLessonMeta): LessonRouteParams {
  return {
    pathname: "/lesson",
    params: {
      id: String(meta.item.lessonId),
      li: String(meta.item.sectionItemIndex),
      pi: String(meta.item.pathIndex),
      mode: meta.mode,
      q: "0",
    },
  };
}
