/**
 * Onboarding step model — the single source of truth for progress.
 *
 * The flow spans three components that don't know about each other:
 *
 *   OnboardingFlow        intro slides
 *   OnboardingPetPicker   mascot
 *   LanguageSelectionFlow language / profile / level / goal
 *
 * Each previously hardcoded `total={9}` and its own offset into that 9 —
 * `LanguageSelectionFlow` carried a literal `stepIndex + 3`, where the `3` was
 * really "however many slides OnboardingFlow happens to have". Adding or
 * removing a slide silently desynchronised the progress bar across two files
 * that give no hint they are coupled.
 *
 * Now every screen asks this module where it is. Change `ONBOARDING_STEPS` and
 * the whole flow renumbers itself.
 */

export const ONBOARDING_STEPS = [
  "welcome",
  "practice",
  "progress",
  "pet",
  "nativeLanguage",
  "targetLanguage",
  "profile",
  "level",
  "goal",
] as const;

export type OnboardingStepId = (typeof ONBOARDING_STEPS)[number];

/** Intro slides, in order — `OnboardingFlow` renders exactly these. */
export const ONBOARDING_SLIDE_IDS = ["welcome", "practice", "progress"] as const;

export type OnboardingSlideId = (typeof ONBOARDING_SLIDE_IDS)[number];

export const ONBOARDING_TOTAL_STEPS = ONBOARDING_STEPS.length;

/**
 * 1-based position of a step, for the progress bar.
 *
 * `generating` is not a step: it is a transient state shown while the plan is
 * built, so it holds the position of the `goal` step it follows rather than
 * advancing the bar to a stage the user cannot navigate to.
 */
export function onboardingStepNumber(id: OnboardingStepId | "generating"): number {
  const resolved: OnboardingStepId = id === "generating" ? "goal" : id;
  const index = ONBOARDING_STEPS.indexOf(resolved);
  return index < 0 ? 1 : index + 1;
}
