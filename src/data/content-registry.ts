import { KIDS_UNITS } from "./kids-english";
import { NORMAL_UNITS } from "./normal-english";
import { ALL_UNITS } from "./units";
import type { LessonBank, UnitBank, LessonPathMode } from "./types";

export function getBundledUnits(mode: LessonPathMode): UnitBank[] {
  if (mode === "normal") return NORMAL_UNITS;
  if (mode === "kids") return KIDS_UNITS;
  return ALL_UNITS;
}

export function createEmptyLesson(): LessonBank {
  return {
    topic: "New Lesson",
    topicKu: "وانەی نوێ",
    words: [],
    voices: [],
    sentences: [],
    fillBlanks: [],
    conversations: [],
  };
}
