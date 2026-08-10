export type PlanId = "free" | "plus" | "pro" | "max";

export type FeatureKey =
  | "normal_path"
  | "street_path"
  | "kids_path"
  | "exam_preview"
  | "exam_enhanced"
  | "exam_full"
  | "mock_exam_preview"
  | "mock_exam_full"
  | "advanced_ai_features"
  | "advanced_ai_evaluation";

export type AiFeatureKey =
  | "live_tutor_5"
  | "live_tutor_10"
  | "live_tutor_15"
  | "ai_teacher_writing"
  | "ai_teacher_speaking"
  | "reading_passage_generation"
  | "reading_pronunciation_evaluation"
  | "roleplay_text_response"
  | "roleplay_voice_response"
  | "dynamic_tts_minute";

export type FeatureAccess = Record<FeatureKey, boolean>;
export type AiPriceCatalog = Record<AiFeatureKey, number>;

export type AccountEntitlements = {
  currentPlan: PlanId;
  expiresAt: string | null;
  features: FeatureAccess;
  creditBalance: number;
  aiPrices: AiPriceCatalog;
};

/**
 * Display fallback only. Edge Functions resolve every charge from the database
 * and never trust these client values.
 */
export const AI_CREDIT_COSTS: AiPriceCatalog = {
  live_tutor_5: 200,
  live_tutor_10: 400,
  live_tutor_15: 600,
  ai_teacher_writing: 15,
  ai_teacher_speaking: 20,
  reading_passage_generation: 5,
  reading_pronunciation_evaluation: 20,
  roleplay_text_response: 5,
  roleplay_voice_response: 10,
  dynamic_tts_minute: 40,
};

export const STATIC_LESSON_TTS_CREDIT_COST = 0;

export const PLAN_FEATURES: Record<PlanId, FeatureAccess> = {
  free: {
    normal_path: true,
    street_path: false,
    kids_path: false,
    exam_preview: false,
    exam_enhanced: false,
    exam_full: false,
    mock_exam_preview: false,
    mock_exam_full: false,
    advanced_ai_features: false,
    advanced_ai_evaluation: false,
  },
  plus: {
    normal_path: true,
    street_path: true,
    kids_path: true,
    exam_preview: true,
    exam_enhanced: false,
    exam_full: false,
    mock_exam_preview: true,
    mock_exam_full: false,
    advanced_ai_features: false,
    advanced_ai_evaluation: false,
  },
  pro: {
    normal_path: true,
    street_path: true,
    kids_path: true,
    exam_preview: true,
    exam_enhanced: true,
    exam_full: false,
    mock_exam_preview: true,
    mock_exam_full: false,
    advanced_ai_features: true,
    advanced_ai_evaluation: false,
  },
  max: {
    normal_path: true,
    street_path: true,
    kids_path: true,
    exam_preview: true,
    exam_enhanced: true,
    exam_full: true,
    mock_exam_preview: true,
    mock_exam_full: true,
    advanced_ai_features: true,
    advanced_ai_evaluation: true,
  },
};

export function aiPrice(
  entitlements: AccountEntitlements | null | undefined,
  feature: AiFeatureKey,
): number {
  return entitlements?.aiPrices[feature] ?? AI_CREDIT_COSTS[feature];
}
