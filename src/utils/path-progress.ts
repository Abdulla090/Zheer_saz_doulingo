import type { SectionDataItem } from "@/data/list-items";
import { buildSectionData } from "@/data/list-items";
import { buildNormalSectionData } from "@/data/normal-english";

export type PathProgressSummary = {
  streetTotal: number;
  streetCompleted: number;
  streetPercent: number;
  normalTotal: number;
  normalCompleted: number;
  normalPercent: number;
};

function countLessons(sections: SectionDataItem[]): number {
  return sections.reduce((n, s) => n + s.data.length, 0);
}

let streetTotalCache: number | null = null;
let normalTotalCache: number | null = null;

function streetLessonTotal(): number {
  if (streetTotalCache == null) {
    streetTotalCache = countLessons(buildSectionData(999_999));
  }
  return streetTotalCache;
}

function normalLessonTotal(): number {
  if (normalTotalCache == null) {
    normalTotalCache = countLessons(buildNormalSectionData(999_999));
  }
  return normalTotalCache;
}

export function getPathProgressSummary(
  streetNextIndex: number,
  normalNextIndex: number,
): PathProgressSummary {
  const streetTotal = streetLessonTotal();
  const normalTotal = normalLessonTotal();
  const streetCompleted = Math.min(streetNextIndex, streetTotal);
  const normalCompleted = Math.min(normalNextIndex, normalTotal);

  return {
    streetTotal,
    streetCompleted,
    streetPercent: streetTotal > 0 ? streetCompleted / streetTotal : 0,
    normalTotal,
    normalCompleted,
    normalPercent: normalTotal > 0 ? normalCompleted / normalTotal : 0,
  };
}
