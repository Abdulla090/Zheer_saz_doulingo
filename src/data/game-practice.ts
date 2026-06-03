import {
  getLessonQuestions,
  type GameQuestion,
  type LessonPathMode,
} from "./lesson-content";

export type PracticeGameKind =
  | "pair_match"
  | "sentence_builder"
  | "voice_listen"
  | "voice_speak"
  | "conversation_pick"
  | "fill_blank";

function findVoiceIndex(questions: GameQuestion[], occurrence: number): number {
  let seen = 0;
  for (let i = 0; i < questions.length; i++) {
    if (questions[i].type === "voice") {
      if (seen === occurrence) return i;
      seen++;
    }
  }
  return questions.findIndex((q) => q.type === "voice");
}

/** First question index for a practice game in the shuffled lesson queue. */
export function findPracticeQuestionIndex(
  kind: PracticeGameKind,
  unitIndex = 0,
  lessonIndex = 0,
  mode: LessonPathMode = "street",
): number {
  const questions = getLessonQuestions(unitIndex, lessonIndex, mode);

  if (kind === "voice_listen") return findVoiceIndex(questions, 0);
  if (kind === "voice_speak") return findVoiceIndex(questions, 1);

  const type =
    kind === "conversation_pick"
      ? "conversation_pick"
      : kind === "fill_blank"
        ? "fill_blank"
        : kind === "pair_match"
          ? "pair_match"
          : "sentence_builder";

  const idx = questions.findIndex((q) => q.type === type);
  return idx >= 0 ? idx : 0;
}

export function buildPracticeLessonParams(
  kind: PracticeGameKind,
  opts?: { id?: number; li?: number; pi?: number; mode?: LessonPathMode },
) {
  const id = opts?.id ?? 0;
  const li = opts?.li ?? 0;
  const pi = opts?.pi ?? 0;
  const mode = opts?.mode ?? "street";
  const q = findPracticeQuestionIndex(kind, id, li, mode);
  return {
    pathname: "/lesson" as const,
    params: {
      id: String(id),
      li: String(li),
      pi: String(pi),
      mode,
      q: String(q),
    },
  };
}
