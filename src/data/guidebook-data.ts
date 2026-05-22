// ─────────────────────────────────────────────────────────────────────────────
// Guidebook data — extracted from each unit's lesson banks for quick reference
// ─────────────────────────────────────────────────────────────────────────────

import { ALL_UNITS } from "./units";
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

/**
 * Builds guidebook data for a specific unit by extracting vocabulary,
 * key phrases from sentences and conversations.
 */
export function getGuidebookForUnit(unitIndex: number): GuidebookUnit | null {
  const unitBank = ALL_UNITS[unitIndex];
  const config = sectionConfigs[unitIndex];
  if (!unitBank || !config) return null;

  const lessons: GuidebookLesson[] = unitBank.map((lesson) => {
    // Collect key phrases from sentences + conversations
    const phrases: GuidebookPhrase[] = [];

    // Add sentence examples as phrases
    lesson.sentences.forEach((s) => {
      phrases.push({
        english: s.english.join(" "),
        kurdish: s.kurdish,
      });
    });

    // Add conversation examples
    lesson.conversations.forEach((c) => {
      phrases.push({
        english: c.correct,
        kurdish: c.explanation,
      });
    });

    return {
      topic: lesson.topic,
      topicKu: lesson.topicKu,
      words: [...lesson.words],
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

/** Pre-build guidebooks for all units */
export const ALL_GUIDEBOOKS: (GuidebookUnit | null)[] = sectionConfigs.map(
  (_, i) => getGuidebookForUnit(i),
);
