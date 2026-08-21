import { create } from "zustand";
import { appStorage } from "../lib/app-storage";
import type {
  ExamId,
  MockExamAttemptRecord,
  UserExamReadiness,
} from "../types/exam-center";
import { calculateExamReadiness } from "../services/exam-center-service";

const STORAGE_KEY = "twino.exam_store.v1";

interface CompletedTopicState {
  score: number;
  completedAt: string;
  mistakes: string[];
  mastered: boolean;
}

interface ExamStoreState {
  selectedExam: ExamId;
  readiness: Record<ExamId, UserExamReadiness>;
  completedTopics: Record<string, CompletedTopicState>;
  mockExamHistory: MockExamAttemptRecord[];
  targetScores: {
    ielts: number;
    det: number;
  };

  // Actions
  setSelectedExam: (exam: ExamId) => void;
  recordTopicCompletion: (
    topicId: string,
    exam: ExamId,
    scorePercent: number,
    mistakes: string[],
  ) => void;
  recordQualificationResult: (
    exam: ExamId,
    scorePercent: number,
    weakSkills: string[],
  ) => void;
  recordMockExamAttempt: (attempt: MockExamAttemptRecord) => void;
  setTargetScore: (exam: ExamId, target: number) => void;
  getExamReadiness: (exam: ExamId) => UserExamReadiness;
  isTopicCompleted: (topicId: string) => boolean;
  getTopicScore: (topicId: string) => number;
}

const DEFAULT_READINESS: Record<ExamId, UserExamReadiness> = {
  ielts: {
    overallScorePercent: 35,
    readingPercent: 40,
    listeningPercent: 35,
    writingPercent: 30,
    speakingPercent: 35,
    estimatedIeltsBand: 5.5,
    estimatedDetScore: 90,
    qualifiedForMock: false,
    weakSkillTags: ["True/False/Not Given", "Task 2 PEEL Essay Structure"],
    strongSkillTags: ["Basic Vocabulary"],
    recommendedTopicIds: ["ielts-read-01", "ielts-write-01"],
    lastUpdated: new Date().toISOString(),
  },
  det: {
    overallScorePercent: 35,
    readingPercent: 40,
    listeningPercent: 35,
    writingPercent: 30,
    speakingPercent: 35,
    estimatedIeltsBand: 5.5,
    estimatedDetScore: 90,
    qualifiedForMock: false,
    weakSkillTags: ["Read and Select", "Write About the Photo"],
    strongSkillTags: ["Basic Dictation"],
    recommendedTopicIds: ["det-read-01", "det-prod-01"],
    lastUpdated: new Date().toISOString(),
  },
};

function loadPersistedState(): Partial<ExamStoreState> {
  try {
    const raw = appStorage.getItemSync(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function persistState(state: {
  selectedExam: ExamId;
  readiness: Record<ExamId, UserExamReadiness>;
  completedTopics: Record<string, CompletedTopicState>;
  mockExamHistory: MockExamAttemptRecord[];
  targetScores: { ielts: number; det: number };
}) {
  try {
    appStorage.setItemSync(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn("Failed to persist ExamStore:", err);
  }
}

export const useExamStore = create<ExamStoreState>((set, get) => {
  const persisted = loadPersistedState();

  const initialState = {
    selectedExam: (persisted.selectedExam as ExamId) || "ielts",
    readiness: {
      ielts: persisted.readiness?.ielts || DEFAULT_READINESS.ielts,
      det: persisted.readiness?.det || DEFAULT_READINESS.det,
    },
    completedTopics: persisted.completedTopics || {},
    mockExamHistory: persisted.mockExamHistory || [],
    targetScores: persisted.targetScores || { ielts: 7.5, det: 125 },
  };

  return {
    ...initialState,

    setSelectedExam: (exam: ExamId) => {
      set({ selectedExam: exam });
      const current = get();
      persistState({
        selectedExam: exam,
        readiness: current.readiness,
        completedTopics: current.completedTopics,
        mockExamHistory: current.mockExamHistory,
        targetScores: current.targetScores,
      });
    },

    recordTopicCompletion: (topicId, exam, scorePercent, mistakes) => {
      set((state) => {
        const updatedTopics = {
          ...state.completedTopics,
          [topicId]: {
            score: scorePercent,
            completedAt: new Date().toISOString(),
            mistakes,
            mastered: scorePercent >= 75,
          },
        };

        const scoresMap: Record<string, number> = {};
        for (const [id, data] of Object.entries(updatedTopics)) {
          scoresMap[id] = data.score;
        }

        const updatedReadinessForExam = calculateExamReadiness(
          exam,
          scoresMap,
          state.readiness[exam].qualificationScorePercent,
        );

        const updatedReadiness = {
          ...state.readiness,
          [exam]: updatedReadinessForExam,
        };

        const nextState = {
          completedTopics: updatedTopics,
          readiness: updatedReadiness,
        };

        persistState({
          selectedExam: state.selectedExam,
          readiness: updatedReadiness,
          completedTopics: updatedTopics,
          mockExamHistory: state.mockExamHistory,
          targetScores: state.targetScores,
        });

        return nextState;
      });
    },

    recordQualificationResult: (exam, scorePercent, weakSkills) => {
      set((state) => {
        const scoresMap: Record<string, number> = {};
        for (const [id, data] of Object.entries(state.completedTopics)) {
          scoresMap[id] = data.score;
        }

        const updatedReadinessForExam = calculateExamReadiness(
          exam,
          scoresMap,
          scorePercent,
        );

        updatedReadinessForExam.qualifiedForMock = scorePercent >= 50;
        updatedReadinessForExam.qualificationScorePercent = scorePercent;
        updatedReadinessForExam.qualificationTestedAt = new Date().toISOString();
        if (weakSkills.length > 0) {
          updatedReadinessForExam.weakSkillTags = weakSkills;
        }

        const updatedReadiness = {
          ...state.readiness,
          [exam]: updatedReadinessForExam,
        };

        persistState({
          selectedExam: state.selectedExam,
          readiness: updatedReadiness,
          completedTopics: state.completedTopics,
          mockExamHistory: state.mockExamHistory,
          targetScores: state.targetScores,
        });

        return { readiness: updatedReadiness };
      });
    },

    recordMockExamAttempt: (attempt) => {
      set((state) => {
        const updatedHistory = [attempt, ...state.mockExamHistory];
        persistState({
          selectedExam: state.selectedExam,
          readiness: state.readiness,
          completedTopics: state.completedTopics,
          mockExamHistory: updatedHistory,
          targetScores: state.targetScores,
        });
        return { mockExamHistory: updatedHistory };
      });
    },

    setTargetScore: (exam, target) => {
      set((state) => {
        const updatedTargets = { ...state.targetScores, [exam]: target };
        persistState({
          selectedExam: state.selectedExam,
          readiness: state.readiness,
          completedTopics: state.completedTopics,
          mockExamHistory: state.mockExamHistory,
          targetScores: updatedTargets,
        });
        return { targetScores: updatedTargets };
      });
    },

    getExamReadiness: (exam) => {
      return get().readiness[exam] || DEFAULT_READINESS[exam];
    },

    isTopicCompleted: (topicId) => {
      return Boolean(get().completedTopics[topicId]?.mastered);
    },

    getTopicScore: (topicId) => {
      return get().completedTopics[topicId]?.score ?? 0;
    },
  };
});
