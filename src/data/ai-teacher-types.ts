export type AiTeacherMode = "speaking" | "writing";

export type AiTeacherCriterionKey =
  | "fluency"
  | "lexical"
  | "grammar"
  | "pronunciation";

export type AiTeacherCriterion = {
  key: AiTeacherCriterionKey;
  label: string;
  band: number;
  note: string;
};

export type AiTeacherPrompt = {
  id: string;
  title: string;
  scenario: string;
  mode: AiTeacherMode;
};

export type AiTeacherRequest = {
  text: string;
  mode: AiTeacherMode;
  promptId?: string;
};

export type AiTeacherResult = {
  overallBand: number;
  criteria: AiTeacherCriterion[];
  strengths: string[];
  improvements: string[];
  sampleRewrite?: string;
};

export type AiTeacherAttempt = AiTeacherResult & {
  id: string;
  savedAt: string;
  mode: AiTeacherMode;
  promptId?: string;
  excerpt: string;
};
