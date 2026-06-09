/**
 * Lottie preset catalog — curated free animations from LottieFiles CDN.
 * Each entry is a public, free-to-use Lottie JSON URL.
 *
 * If you want offline-only animations, download any of these JSONs into
 * `assets/lottie/<name>.json` and swap the URL for `require("../../../assets/lottie/<name>.json")`.
 *
 * To browse more: https://lottiefiles.com/free-animations
 */

export const LOTTIE_PRESETS = {
  // Mascot / character animations (Duolingo-style)
  mascotWave: "https://assets10.lottiefiles.com/packages/lf20_jcikwtux.json",
  mascotCheer: "https://assets3.lottiefiles.com/packages/lf20_touohxv0.json",
  mascotSad: "https://assets9.lottiefiles.com/packages/lf20_ghfpce1h.json",
  mascotThinking: "https://assets7.lottiefiles.com/packages/lf20_yfsb3a1c.json",

  // Feedback animations
  success: "https://assets2.lottiefiles.com/packages/lf20_lk80fpsm.json",
  successCheck: "https://assets1.lottiefiles.com/packages/lf20_s2lryxtd.json",
  error: "https://assets4.lottiefiles.com/packages/lf20_qpwbiyxf.json",
  warning: "https://assets10.lottiefiles.com/packages/lf20_qjosmr4w.json",

  // Engagement animations
  streakFire: "https://assets3.lottiefiles.com/packages/lf20_kkflmtur.json",
  trophy: "https://assets1.lottiefiles.com/packages/lf20_touohxv0.json",
  confetti: "https://assets5.lottiefiles.com/packages/lf20_obhph3sh.json",
  celebration: "https://assets10.lottiefiles.com/packages/lf20_aEFaHc.json",
  heartBeat: "https://assets2.lottiefiles.com/packages/lf20_kdx6cani.json",
  star: "https://assets3.lottiefiles.com/packages/lf20_ks3jxlwj.json",

  // Loading / status
  loading: "https://assets10.lottiefiles.com/packages/lf20_usmfx6bp.json",
  loadingDots: "https://assets1.lottiefiles.com/packages/lf20_b88nh30c.json",
  loadingPulse: "https://assets3.lottiefiles.com/packages/lf20_x62chJ.json",

  // Empty states
  emptyBox: "https://assets10.lottiefiles.com/packages/lf20_ydo1amjm.json",
  noResults: "https://assets3.lottiefiles.com/packages/lf20_ttvteyvs.json",

  // Onboarding / fun
  onboardingWelcome: "https://assets3.lottiefiles.com/packages/lf20_2glqweqs.json",
  rocket: "https://assets10.lottiefiles.com/packages/lf20_ystsffqy.json",
  bookReading: "https://assets10.lottiefiles.com/packages/lf20_dmw3t0vg.json",
} as const;

export type LottiePresetKey = keyof typeof LOTTIE_PRESETS;
