import type { SectionDataItem } from "../data/list-items";
import { buildSectionData } from "../data/list-items";
import { buildNormalSectionData } from "../data/normal-english";
import { buildKidsSectionData } from "../data/kids-english";

export type PathProgressSummary = {
  streetTotal: number;
  streetCompleted: number;
  streetPercent: number;
  normalTotal: number;
  normalCompleted: number;
  normalPercent: number;
  kidsTotal: number;
  kidsCompleted: number;
  kidsPercent: number;
};

function countLessons(sections: SectionDataItem[]): number {
  return sections.reduce((n, s) => n + s.data.length, 0);
}

let streetTotalCache: number | null = null;
let normalTotalCache: number | null = null;
let kidsTotalCache: number | null = null;

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

function kidsLessonTotal(): number {
  if (kidsTotalCache == null) {
    kidsTotalCache = countLessons(buildKidsSectionData(999_999));
  }
  return kidsTotalCache;
}

export function getPathProgressSummary(
  streetNextIndex: number,
  normalNextIndex: number,
  kidsNextIndex = 0,
): PathProgressSummary {
  const streetTotal = streetLessonTotal();
  const normalTotal = normalLessonTotal();
  const kidsTotal = kidsLessonTotal();
  const streetCompleted = Math.min(streetNextIndex, streetTotal);
  const normalCompleted = Math.min(normalNextIndex, normalTotal);
  const kidsCompleted = Math.min(kidsNextIndex, kidsTotal);

  return {
    streetTotal,
    streetCompleted,
    streetPercent: streetTotal > 0 ? streetCompleted / streetTotal : 0,
    normalTotal,
    normalCompleted,
    normalPercent: normalTotal > 0 ? normalCompleted / normalTotal : 0,
    kidsTotal,
    kidsCompleted,
    kidsPercent: kidsTotal > 0 ? kidsCompleted / kidsTotal : 0,
  };
}
