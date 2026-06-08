// ─────────────────────────────────────────────────────────────────────────────
// Guidebook data — extracted from each unit's lesson banks for quick reference
// ─────────────────────────────────────────────────────────────────────────────

import type { AppLocale } from "@/i18n";
import { getUnitsForPath } from "./content-access";
import type { LessonPathMode, UnitBank } from "./types";
import { normalSectionConfigs } from "./normal-english";
import { kidsSectionConfigs } from "./kids-english";
import { getPathUnitTitle } from "./path-unit-titles";
import { sectionConfigs } from "./list-items";

export type GuidebookWord = {
  english: string;
  kurdish: string;
};

export type GuidebookPhrase = {
  english: string;
  kurdish: string;
};

export type GuidebookLesson = {
  topic: string;
  topicKu: string;
  words: GuidebookWord[];
  phrases: GuidebookPhrase[];
};

export type GuidebookUnit = {
  unitIndex: number;
  title: string;
  displayTheme: string;
  lessons: GuidebookLesson[];
};

type SectionConfig = { displayTheme: string };

function buildGuidebookFromUnit(
  unitIndex: number,
  unitBank: UnitBank | undefined,
  config: SectionConfig | undefined,
  title: string,
): GuidebookUnit | null {
  if (!unitBank || !config) return null;

  const lessons: GuidebookLesson[] = unitBank.map((lesson) => {
    const phrases: GuidebookPhrase[] = [];

    for (const s of lesson.sentences ?? []) {
      if (!s?.english?.length) continue;
      phrases.push({
        english: s.english.join(" "),
        kurdish: s.kurdish ?? "",
      });
    }

    for (const c of lesson.conversations ?? []) {
      if (!c?.correct) continue;
      phrases.push({
        english: c.correct,
        kurdish: c.explanation ?? "",
      });
    }

    return {
      topic: lesson.topic ?? "",
      topicKu: lesson.topicKu ?? "",
      words: [...(lesson.words ?? [])],
      phrases,
    };
  });

  return {
    unitIndex,
    title,
    displayTheme: config.displayTheme,
    lessons,
  };
}

/** Builds guidebook data for a street-English unit. */
export function getGuidebookForUnit(
  unitIndex: number,
  locale: AppLocale = "en",
): GuidebookUnit | null {
  return buildGuidebookFromUnit(
    unitIndex,
    getUnitsForPath("street")[unitIndex],
    sectionConfigs[unitIndex],
    getPathUnitTitle("street", unitIndex, locale),
  );
}

/** Builds guidebook data for a normal-English unit. */
export function getGuidebookForNormalUnit(
  unitIndex: number,
  locale: AppLocale = "en",
): GuidebookUnit | null {
  return buildGuidebookFromUnit(
    unitIndex,
    getUnitsForPath("normal")[unitIndex],
    normalSectionConfigs[unitIndex],
    getPathUnitTitle("normal", unitIndex, locale),
  );
}

/** Builds guidebook data for a kids-English unit. */
export function getGuidebookForKidsUnit(
  unitIndex: number,
  locale: AppLocale = "en",
): GuidebookUnit | null {
  return buildGuidebookFromUnit(
    unitIndex,
    getUnitsForPath("kids")[unitIndex],
    kidsSectionConfigs[unitIndex],
    getPathUnitTitle("kids", unitIndex, locale),
  );
}

/** Resolves guidebook content for either path mode. */
export function getGuidebook(
  mode: LessonPathMode,
  unitIndex: number,
  locale: AppLocale = "en",
): GuidebookUnit | null {
  if (!Number.isFinite(unitIndex) || unitIndex < 0) return null;
  if (mode === "normal") return getGuidebookForNormalUnit(unitIndex, locale);
  if (mode === "kids") return getGuidebookForKidsUnit(unitIndex, locale);
  return getGuidebookForUnit(unitIndex, locale);
}

/** Pre-build guidebooks for street-English units (English titles by default). */
export const ALL_GUIDEBOOKS: (GuidebookUnit | null)[] = sectionConfigs.map(
  (_, i) => getGuidebookForUnit(i),
);
