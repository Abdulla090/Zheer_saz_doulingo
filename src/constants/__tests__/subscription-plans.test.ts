import { describe, expect, it } from "@jest/globals";

import {
  getSubscriptionPlanCopy,
  SUBSCRIPTION_PLAN_DATA,
  SUBSCRIPTION_PLAN_ORDER,
} from "../subscription-plans";
import { AI_CREDIT_COSTS, PLAN_FEATURES } from "../../types/entitlements";

describe("subscription and AI credit catalog", () => {
  it("keeps the requested four plans and grants", () => {
    expect(SUBSCRIPTION_PLAN_ORDER).toEqual(["free", "plus", "pro", "max"]);
    expect(SUBSCRIPTION_PLAN_DATA).toMatchObject({
      free: { priceIqd: 0, includedCredits: 250, durationDays: null },
      plus: { priceIqd: 10_000, includedCredits: 2_500, durationDays: 30 },
      pro: { priceIqd: 15_000, includedCredits: 4_500, durationDays: 30 },
      max: { priceIqd: 25_000, includedCredits: 8_000, durationDays: 30 },
    });
  });

  it("labels Pro and Max with clear value tags and 30-day allowance copy", () => {
    const copy = getSubscriptionPlanCopy("en");
    expect(copy.tags.pro).toBe("MOST POPULAR");
    expect(copy.tags.max).toBe("BEST VALUE");
    expect(copy.walletNote).toBe(
      "AI credits are valid for 30 days. Renew to receive a fresh monthly allowance.",
    );
    expect(copy.benefits.plus.join(" ")).toContain("IELTS & DET Preparation Preview");
    expect(copy.benefits.max.join(" ")).toContain("Unlimited AI Teacher");
  });

  it("locks paid paths on Free and reserves full exam access for Max", () => {
    expect(PLAN_FEATURES.free.street_path).toBe(false);
    expect(PLAN_FEATURES.free.kids_path).toBe(false);
    expect(PLAN_FEATURES.plus.street_path).toBe(true);
    expect(PLAN_FEATURES.pro.exam_full).toBe(false);
    expect(PLAN_FEATURES.max.exam_full).toBe(true);
    expect(PLAN_FEATURES.max.mock_exam_full).toBe(true);
  });

  it("uses the requested server-backed AI prices", () => {
    expect(AI_CREDIT_COSTS).toEqual({
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
    });
  });
});
