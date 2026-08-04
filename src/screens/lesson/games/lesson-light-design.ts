/**
 * Lesson shell — aligned with home liquid glass (HomePalette).
 */

import { HomePalette } from "../../../components/ui/ios-liquid-home";
import { Easing } from "react-native-reanimated";

const H = HomePalette;

export const L = {
  bg: H.meshBottom,
  bgSoft: H.meshMid,
  blue: H.blue,
  bluePress: "#2348D4",
  navy: H.navy,
  navySoft: "#3D4F6F",
  gray: H.gray,
  grayLight: H.grayLight,
  track: H.track,
  trackInner: "#DCE3EA",
  cardTint: "#F8FAFC",
  cardTintBorder: "#E2E8F0",
  border: H.divider,
  red: "#EF4444",
  green: "#10B981",
  greenDeep: "#047857",
  redDeep: "#B91C1C",
  gold: H.gold,
  slotDash: "#C5CED8",
  shadow: "rgba(0, 0, 0, 0.04)",
} as const;

export const LightMotion = {
  press: { damping: 28, stiffness: 380, mass: 0.38, overshootClamping: true },
  soft: { damping: 26, stiffness: 300, mass: 0.45, overshootClamping: true },
  colorMs: 180,
  ease: Easing.out(Easing.cubic),
} as const;

export const LightRadius = {
  card: 20,
  tile: 15,
  btn: 16,
  pill: 999,
} as const;

/** All in-lesson games use the premium light shell (white canvas). */
export function usesLightLessonShell(_type?: string): boolean {
  return true;
}

/* ────────────────────────────────────────────────────────────────────
 * Duolingo-faithful tokens — used in normal (non-kids, non-street)
 * light mode only.  Kids & street modes keep their current styling.
 * ──────────────────────────────────────────────────────────────────── */
export const Duo = {
  /* Core brand */
  green:       "#58CC02",
  greenDark:   "#58A700",
  greenBg:     "#D7FFB8",
  greenBorder: "#A5ED6E",
  greenText:   "#58A700",

  red:         "#FF4B4B",
  redDark:     "#EA2B2B",
  redBg:       "#FFDFE0",
  redBorder:   "#FFB2B2",
  redBgDeep:   "#FFC1C1",
  redText:     "#EA2B2B",

  /*
   * System accent — orange, not blue. Used for selection, the speaker glyph,
   * active rails and any "in progress" affordance. `accent*` is the canonical
   * name; the `blue*` keys below are kept as aliases so existing street/kids
   * call sites keep compiling, and they now resolve to orange too.
   */
  accent:       "#FF9600",
  accentDark:   "#E08600",
  accentBg:     "#FFF3DE",
  accentBorder: "#FFCE7A",
  accentText:   "#C86D00",

  blue:        "#FF9600",
  blueDark:    "#E08600",
  blueBg:      "#FFF3DE",
  blueBorder:  "#FFCE7A",

  yellow:      "#FFC800",

  /* Hearts — discrete row in the lesson header */
  heart:       "#FF4B4B",
  heartSpent:  "#E5E5E5",

  /* Neutrals */
  eel:         "#4B4B4B",
  hare:        "#777777",
  swan:        "#AFAFAF",
  snow:        "#FFFFFF",
  border:      "#E5E5E5",
  borderDark:  "#D6D6D6",
  bgSoft:      "#F7F7F7",

  /* Word-bank underline rails */
  rail:        "#E5E5E5",
  railActive:  "#FF9600",

  /* Tile 3D depth */
  tileDepth:   4,
  tilePressedDepth: 2,
} as const;

/**
 * Duolingo-faithful motion.
 *
 * Tiles compress into their own bottom rim rather than scaling down — the depth
 * shrinks while the face travels the same distance, so the tile reads as a
 * physical key being pushed. Springs are critically damped (no wobble) except
 * the reward pop, which is allowed a single overshoot.
 */
export const DuoMotion = {
  /** Tile / button press — fast, no bounce back. */
  press:    { damping: 30, stiffness: 520, mass: 0.5, overshootClamping: true },
  /** Release — slightly softer so the rim re-inflates smoothly. */
  release:  { damping: 22, stiffness: 380, mass: 0.55, overshootClamping: true },
  /** Reward pop on a correct reveal — one gentle overshoot. */
  pop:      { damping: 12, stiffness: 320, mass: 0.5, overshootClamping: false },
  /** Feedback sheet slide-in. */
  sheet:    { damping: 26, stiffness: 260, mass: 0.75, overshootClamping: true },
  /** Progress bar fill. */
  progress: { damping: 24, stiffness: 180, mass: 0.6, overshootClamping: true },
  /** Tile state cross-fade (ms). */
  colorMs:  200,
  /** Word flying from bank into a slot (ms). */
  flyMs:    300,
} as const;

export const LightType = {
  title: {
    fontSize: 26,
    fontWeight: "800" as const,
    letterSpacing: -0.6,
    lineHeight: 33,
    color: Duo.eel,
    fontFamily: "DINNextRoundedBold",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500" as const,
    letterSpacing: -0.15,
    color: L.gray,
    lineHeight: 22,
    fontFamily: "DINNextRoundedRegular",
  },
  promptKu: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: L.navy,
    fontFamily: "DINNextRoundedBold",
  },
  promptEn: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: L.gray,
    fontFamily: "DINNextRoundedMedium",
  },
  questionHeroBadge: {
    fontSize: 10,
    fontWeight: "800" as const,
    letterSpacing: 1.2,
    color: L.blue,
    fontFamily: "DINNextRoundedBold",
    textTransform: "uppercase" as const,
  },
  questionHero: {
    fontSize: 22,
    fontWeight: "700" as const,
    lineHeight: 32,
    letterSpacing: -0.35,
    color: "#FFFFFF",
    fontFamily: "DINNextRoundedBold",
  },
  questionHeroKids: {
    fontSize: 22,
    fontWeight: "700" as const,
    lineHeight: 32,
    letterSpacing: -0.35,
    color: L.navy,
    fontFamily: "DINNextRoundedBold",
  },
  questionHeroBadgeKids: {
    fontSize: 10,
    fontWeight: "800" as const,
    letterSpacing: 1.2,
    color: "#0284C7",
    fontFamily: "DINNextRoundedBold",
    textTransform: "uppercase" as const,
  },
  tile: {
    fontSize: 19,
    fontWeight: "700" as const,
    color: Duo.eel,
    fontFamily: "DINNextRoundedBold",
    backgroundColor: "transparent",
  },
  label: {
    fontSize: 11,
    fontWeight: "800" as const,
    letterSpacing: 0.6,
    color: L.grayLight,
    fontFamily: "DINNextRoundedBold",
    textTransform: "uppercase" as const,
  },
  dialogueBadge: {
    fontSize: 10,
    fontWeight: "800" as const,
    letterSpacing: 1.1,
    color: "#6B4FD4",
    fontFamily: "DINNextRoundedBold",
    textTransform: "uppercase" as const,
  },
  dialogueText: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600" as const,
    lineHeight: 25,
    letterSpacing: -0.2,
    color: L.navy,
    fontFamily: "DINNextRoundedMedium",
  },
};
