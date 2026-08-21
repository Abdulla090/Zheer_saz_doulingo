export type ExamId = "ielts" | "det";

export type ExamSection = "reading" | "listening" | "writing" | "speaking";

export type DetSubscoreCategory =
  | "literacy"
  | "comprehension"
  | "conversation"
  | "production";

export type TopicDifficulty = "beginner" | "intermediate" | "advanced";

export type IeltsTaskType =
  | "true_false_not_given"
  | "matching_headings"
  | "multiple_choice"
  | "sentence_completion"
  | "summary_completion"
  | "matching_information"
  | "map_diagram_labelling"
  | "form_completion"
  | "short_answer"
  | "writing_task1_academic"
  | "writing_task1_general"
  | "writing_task2_essay"
  | "speaking_part1"
  | "speaking_part2_cue_card"
  | "speaking_part3_discussion";

export type DetTaskType =
  | "read_and_select"
  | "fill_in_the_blanks"
  | "read_and_complete"
  | "listen_and_type"
  | "read_aloud"
  | "write_about_photo"
  | "speak_about_photo"
  | "read_then_write"
  | "read_then_speak"
  | "listen_then_speak"
  | "writing_sample"
  | "speaking_sample"
  | "interactive_reading"
  | "interactive_listening";

export type ExamTaskType = IeltsTaskType | DetTaskType;

export interface ExampleComparison {
  prompt: string;
  context?: string;
  weak: {
    text: string;
    score: string;
    explanation: string;
    identifiedErrors: string[];
  };
  good: {
    text: string;
    score: string;
    explanation: string;
    strengths: string[];
  };
  excellent: {
    text: string;
    score: string;
    explanation: string;
    keyHighlights: string[];
    examinerNote: string;
  };
}

export interface VocabularyCollocationItem {
  term: string;
  phonetic?: string;
  definition: string;
  collocations: string[];
  examExample: string;
}

export interface LearnContent {
  overview: string;
  strategyRules: string[];
  stepByStepMethod: string[];
  timeManagementRule: string;
  commonTraps: string[];
  usefulVocabulary: VocabularyCollocationItem[];
  naturalPhrases: string[];
  appropriateIdioms?: string[];
  speakingFrameworks?: {
    name: string;
    description: string;
    structure: string[];
    example: string;
  }[];
  writingTemplates?: {
    name: string;
    purpose: string;
    template: string;
    sampleUsage: string;
  }[];
  paraphrasingTechniques?: {
    technique: string;
    original: string;
    paraphrased: string;
    note: string;
  }[];
  comparativeExamples: ExampleComparison;
  examDayTip: string;
}

export type PracticeTaskType =
  | "multiple_choice"
  | "text_entry"
  | "fill_blanks"
  | "essay_writing"
  | "speaking_recording"
  | "word_selection"
  | "dictation";

export interface PracticeTask {
  id: string;
  title: string;
  instruction: string;
  type: PracticeTaskType;
  prompt: string;
  passage?: string;
  imageUrl?: string;
  audioText?: string;
  options?: string[];
  correctAnswer?: string | string[] | number | number[];
  hints: string[];
  modelAnswer: string;
  sampleBreakdown: string;
  targetTimeSeconds?: number;
  minWords?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  passage?: string;
  imageUrl?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  skillTag: string;
  trapWarning?: string;
}

export interface PreparationTopic {
  id: string;
  exam: ExamId;
  section: ExamSection;
  taskType: ExamTaskType;
  difficulty: TopicDifficulty;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  orderIndex: number;
  learnContent: LearnContent;
  practiceTask: PracticeTask;
  quiz: QuizQuestion[];
}

export interface StrategyItem {
  id: string;
  exam: ExamId;
  section: ExamSection;
  taskType: ExamTaskType;
  difficulty: TopicDifficulty;
  title: string;
  summary: string;
  highValueRules: string[];
  timeManagementFormula: string;
  commonMistakesAndTraps: string[];
  usefulCollocationsAndIdioms: string[];
  examinerRubricFocus: string;
  templateSnippet?: string;
  lastMinuteTip: string;
}

export interface ReadinessQuestionItem {
  id: string;
  exam: ExamId;
  section: ExamSection;
  taskType: ExamTaskType;
  type: PracticeTaskType;
  instruction: string;
  prompt: string;
  passage?: string;
  options?: string[];
  correctAnswer?: string | string[] | number | number[];
  timeLimitSeconds: number;
  skillTag: string;
  difficultyWeight: number; // 1 to 3
}

export interface ReadinessTestDefinition {
  exam: ExamId;
  title: string;
  description: string;
  durationMinutes: number;
  passingScorePercent: number; // 50
  questions: ReadinessQuestionItem[];
}

export interface SpeakingFeedbackCriteria {
  pronunciation: { score: number; note: string };
  fluency: { score: number; note: string };
  pace: { score: number; note: string };
  grammar: { score: number; note: string };
  vocabulary: { score: number; note: string };
  coherence: { score: number; note: string };
  relevance: { score: number; note: string };
}

export interface WritingFeedbackCriteria {
  taskAchievement: { score: number; note: string };
  structure: { score: number; note: string };
  coherence: { score: number; note: string };
  grammar: { score: number; note: string };
  vocabulary: { score: number; note: string };
  accuracy: { score: number; note: string };
}

export interface AIReviewResult {
  overallScore: number;
  estimatedBandOrScore: string; // e.g. "AI Estimated IELTS Band: 7.0" or "AI Estimated DET Score: 120"
  scorePercentage: number;
  strengths: string[];
  weaknesses: string[];
  identifiedErrors: { original: string; correction: string; reason: string }[];
  sampleRewrite: string;
  speakingCriteria?: SpeakingFeedbackCriteria;
  writingCriteria?: WritingFeedbackCriteria;
  recommendedTopicIds: string[];
  examinerAdvice: string;
}

export interface MockExamSection {
  id: string;
  section: ExamSection;
  title: string;
  instruction: string;
  durationMinutes: number;
  questions: ReadinessQuestionItem[];
}

export interface MockExamDefinition {
  id: string;
  exam: ExamId;
  title: string;
  version: string;
  totalDurationMinutes: number;
  sections: MockExamSection[];
}

export interface UserExamReadiness {
  overallScorePercent: number;
  readingPercent: number;
  listeningPercent: number;
  writingPercent: number;
  speakingPercent: number;
  estimatedIeltsBand: number; // e.g. 6.5
  estimatedDetScore: number; // e.g. 115
  qualifiedForMock: boolean;
  qualificationScorePercent?: number;
  qualificationTestedAt?: string;
  weakSkillTags: string[];
  strongSkillTags: string[];
  recommendedTopicIds: string[];
  lastUpdated: string;
}

export interface MockExamAttemptRecord {
  id: string;
  exam: ExamId;
  mockExamId: string;
  completedAt: string;
  durationSeconds: number;
  overallScoreFormatted: string; // "AI Estimated IELTS Band 7.5"
  overallBandOrScore: number;
  sectionScores: {
    reading: { score: number; max: number; bandOrScaled: number };
    listening: { score: number; max: number; bandOrScaled: number };
    writing: { score: number; max: number; bandOrScaled: number };
    speaking: { score: number; max: number; bandOrScaled: number };
  };
  detSubscores?: {
    literacy: number;
    comprehension: number;
    conversation: number;
    production: number;
  };
  strengths: string[];
  weaknesses: string[];
  mistakeSummary: {
    questionId: string;
    section: ExamSection;
    taskType: ExamTaskType;
    prompt: string;
    userAnswer: string;
    correctAnswer: string;
    explanation: string;
    skillTag: string;
  }[];
  aiCoachAdvice: string;
  recommendedTopicIds: string[];
}
