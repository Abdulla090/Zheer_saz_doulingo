import type {
  GuidebookLesson,
  GuidebookUnit,
} from "../../data/guidebook-data";
import type { LessonPathMode } from "../../data/lesson-content";

export type GuidebookEntry = {
  id: string;
  kind: "word" | "phrase";
  english: string;
  kurdish: string;
  sourceLanguage: string;
  targetLanguage: string;
};

export type GuidebookLessonViewModel = {
  id: string;
  index: number;
  topic: string;
  topicKu: string;
  sourceLanguage: string;
  targetLanguage: string;
  words: GuidebookEntry[];
  phrases: GuidebookEntry[];
  entries: GuidebookEntry[];
};

export type GuidebookViewModel = {
  unitLabel: string;
  title: string;
  displayTheme: string;
  lessons: GuidebookLessonViewModel[];
};

export function parseSearchParam(
  raw: string | string[] | undefined,
): string | undefined {
  return Array.isArray(raw) ? raw[0] : raw;
}

export function parseUnitIndex(raw: string | string[] | undefined): number {
  const value = Number.parseInt(parseSearchParam(raw) ?? "0", 10);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

export function parsePathMode(
  raw: string | string[] | undefined,
): LessonPathMode {
  const mode = parseSearchParam(raw);
  if (mode === "normal") return "normal";
  if (mode === "kids") return "kids";
  return "street";
}

function toEntries(
  lesson: GuidebookLesson,
  lessonIndex: number,
  kind: GuidebookEntry["kind"],
  sourceLanguage: string,
  targetLanguage: string,
): GuidebookEntry[] {
  const source = kind === "word" ? lesson.words : lesson.phrases;
  return source.map((entry, entryIndex) => ({
    id: `${kind}-${lessonIndex}-${entryIndex}`,
    kind,
    english: entry.english,
    kurdish: entry.kurdish,
    sourceLanguage,
    targetLanguage,
  }));
}

export function buildGuidebookViewModel(
  guidebook: GuidebookUnit,
): GuidebookViewModel {
  const colonIndex = guidebook.title.indexOf(":");
  const hasUnitPrefix = colonIndex >= 0;
  const unitLabel = hasUnitPrefix
    ? guidebook.title.slice(0, colonIndex).trim()
    : `Unit ${guidebook.unitIndex + 1}`;
  const title = hasUnitPrefix
    ? guidebook.title.slice(colonIndex + 1).trim()
    : guidebook.title.trim();

  const lessons = guidebook.lessons.map((lesson, index) => {
    const words = toEntries(lesson, index, "word", guidebook.sourceLanguage, guidebook.targetLanguage);
    const phrases = toEntries(lesson, index, "phrase", guidebook.sourceLanguage, guidebook.targetLanguage);
    return {
      id: `lesson-${index}`,
      index,
      topic: lesson.topic,
      topicKu: lesson.topicKu,
      sourceLanguage: guidebook.sourceLanguage,
      targetLanguage: guidebook.targetLanguage,
      words,
      phrases,
      entries: [...words, ...phrases],
    };
  });

  return {
    unitLabel,
    title,
    displayTheme: guidebook.displayTheme,
    lessons,
  };
}
