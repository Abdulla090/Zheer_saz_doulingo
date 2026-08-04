import { describe, expect, it } from "@jest/globals";

import {
  ONBOARDING_SLIDE_IDS,
  ONBOARDING_STEPS,
  ONBOARDING_TOTAL_STEPS,
  onboardingStepNumber,
} from "../onboarding-steps";

describe("onboarding step model", () => {
  it("numbers every step once, in order, with no gaps", () => {
    const numbers = ONBOARDING_STEPS.map((id) => onboardingStepNumber(id));
    expect(numbers).toEqual(
      Array.from({ length: ONBOARDING_TOTAL_STEPS }, (_, i) => i + 1),
    );
  });

  it("keeps the intro slides at the front of the flow", () => {
    // LanguageSelectionFlow used to hardcode `stepIndex + 3`, where 3 was really
    // "however many slides exist". This asserts the relationship it assumed.
    ONBOARDING_SLIDE_IDS.forEach((id, index) => {
      expect(onboardingStepNumber(id)).toBe(index + 1);
    });
    expect(onboardingStepNumber("nativeLanguage")).toBe(
      ONBOARDING_SLIDE_IDS.length + 1,
    );
  });

  it("ends on the mascot picker", () => {
    expect(onboardingStepNumber("pet")).toBe(ONBOARDING_TOTAL_STEPS);
  });

  it("holds the bar steady while the plan is generating", () => {
    // `generating` is a transient state, not a navigable step: advancing the bar
    // there would show progress past a page the user cannot reach.
    expect(onboardingStepNumber("generating")).toBe(onboardingStepNumber("goal"));
  });

  it("falls back to the first step for an unknown id", () => {
    expect(onboardingStepNumber("nope" as never)).toBe(1);
  });
});
