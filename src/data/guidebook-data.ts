// ─────────────────────────────────────────────────────────────────────────────
// Guidebook data — extracted from each unit's lesson banks for quick reference
// ─────────────────────────────────────────────────────────────────────────────

import type { LessonPathMode } from "./lesson-content";
import { NORMAL_UNITS, normalSectionConfigs } from "./normal-english";
import { ALL_UNITS } from "./units";
import { sectionConfigs } from "./list-items";
import type { UnitBank } from "./types";

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

type SectionConfig = { title: string; displayTheme: string };

function buildGuidebookFromUnit(
  unitIndex: number,
  unitBank: UnitBank | undefined,
  config: SectionConfig | undefined,
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
    title: config.title,
    displayTheme: config.displayTheme,
    lessons,
  };
}

/** Builds guidebook data for a street-English unit. */
export function getGuidebookForUnit(unitIndex: number): GuidebookUnit | null {
  return buildGuidebookFromUnit(
    unitIndex,
    ALL_UNITS[unitIndex],
    sectionConfigs[unitIndex],
  );
}

/** Builds guidebook data for a normal-English unit. */
export function getGuidebookForNormalUnit(unitIndex: number): GuidebookUnit | null {
  return buildGuidebookFromUnit(
    unitIndex,
    NORMAL_UNITS[unitIndex],
    normalSectionConfigs[unitIndex],
  );
}

/** Resolves guidebook content for either path mode. */
export function getGuidebook(
  mode: LessonPathMode,
  unitIndex: number,
): GuidebookUnit | null {
  if (!Number.isFinite(unitIndex) || unitIndex < 0) return null;
  return mode === "normal"
    ? getGuidebookForNormalUnit(unitIndex)
    : getGuidebookForUnit(unitIndex);
}

/** Pre-build guidebooks for street-English units */
export const ALL_GUIDEBOOKS: (GuidebookUnit | null)[] = sectionConfigs.map(
  (_, i) => getGuidebookForUnit(i),
);
