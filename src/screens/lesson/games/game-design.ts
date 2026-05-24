/**
 * game-design.ts — PHINGO design tokens
 *
 * iOS 26 "Liquid Glass" design language:
 *   • Translucent surfaces float over content
 *   • System-color accents with adaptive opacity
 *   • Soft specular highlights via top gradient sheens
 *   • Spring-based fluid press response
 *   • Tight letter-spacing on display type
 *
 * Legacy 3D rim/face tokens are preserved for backward compatibility,
 * new screens should prefer the iOS / Glass tokens below.
 */

import { Easing } from "react-native-reanimated";

export const G = {
  // ── PHINGO brand blues (legacy) ────────────────────────────────────
  blue:        "#1CB0F6",
  blueRim:     "#1490CC",
  blueBg:      "#DDF4FF",
  blueText:    "#0A5F8A",

  green:       "#58CC02",
  greenRim:    "#58A700",
  greenBg:     "#D7FFB8",
  greenText:   "#3C8400",

  red:         "#FF4B4B",
  redRim:      "#EA2B2B",
  redBg:       "#FFE0E0",
  redText:     "#CC0000",

  yellow:      "#FFC800",
  yellowRim:   "#E6A700",
  yellowBg:    "#FFF9E6",
  yellowText:  "#A87800",

  bg:          "#FFFFFF",
  bgSoft:      "#F7F7F7",
  border:      "#E5E5E5",
  borderDark:  "#DADADA",

  optBg:       "#FFFFFF",
  optBorder:   "#E5E5E5",
  optRim:      "#E5E5E5",

  textDark:    "#3C3C3C",
  textMid:     "#777777",
  textLight:   "#AFAFAF",

  rSm:  12,
  rMd:  16,
  rLg:  20,
  rXl:  24,

  px:    16,
  depth: 4,
} as const;

/* ────────────────────────────────────────────────────────────────────
 * iOS 26 — Liquid Glass tokens
 * ──────────────────────────────────────────────────────────────────── */
export const iOS = {
  /* System palette — Apple's iOS 17/26 system colors, slightly adapted
     for Phingo's ocean theme. Use these for accents over glass. */
  systemBlue:    "#0A84FF",
  systemGreen:   "#30D158",
  systemRed:     "#FF453A",
  systemOrange:  "#FF9F0A",
  systemYellow:  "#FFD60A",
  systemPurple:  "#BF5AF2",
  systemTeal:    "#64D2FF",
  systemPink:    "#FF375F",

  /* Tinted backgrounds for active states (over glass surfaces) */
  blueTint:      "rgba(10,132,255,0.15)",
  greenTint:     "rgba(48,209,88,0.15)",
  redTint:       "rgba(255,69,58,0.14)",
  orangeTint:    "rgba(255,159,10,0.15)",

  /* Solid label colors */
  blueDeep:      "#0040DD",
  greenDeep:     "#0E8A2A",
  redDeep:       "#C40C00",
  orangeDeep:    "#B36B00",
} as const;

/* ────────────────────────────────────────────────────────────────────
 * Glass surface tokens
 *
 * Standard glass = primary card (high readability)
 * Soft glass    = secondary surface (chips, pills)
 * Dark glass    = header / overlay pills
 * Inner glass   = nested element on a glass card
 * ──────────────────────────────────────────────────────────────────── */
export const Glass = {
  /* Background fills */
  surface:        "rgba(255,255,255,0.62)",
  surfaceSoft:    "rgba(255,255,255,0.35)",
  surfaceInner:   "rgba(255,255,255,0.5)",
  surfaceDark:    "rgba(15,23,42,0.32)",

  /* Borders — subtle white edge that catches light */
  border:         "rgba(255,255,255,0.55)",
  borderSoft:     "rgba(255,255,255,0.28)",
  borderDark:     "rgba(255,255,255,0.18)",

  /* Top sheen overlay (highlights the upper rim of glass) */
  sheen:          ["rgba(255,255,255,0.55)", "rgba(255,255,255,0)"] as const,
  sheenSoft:      ["rgba(255,255,255,0.3)",  "rgba(255,255,255,0)"] as const,

  /* Blur intensities (BlurView) */
  blurStrong:     60,
  blurMedium:     40,
  blurLight:      24,
} as const;

/* ────────────────────────────────────────────────────────────────────
 * Type scale — modern, tight letter-spacing, premium weights
 * ──────────────────────────────────────────────────────────────────── */
export const Type = {
  /* Display — used for question hero text */
  display: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: "800" as const,
    letterSpacing: -0.7,
  },
  /* Title — section heads inside cards */
  title: {
    fontSize: 21,
    lineHeight: 28,
    fontWeight: "700" as const,
    letterSpacing: -0.4,
  },
  /* Body — option labels, primary content */
  body: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "600" as const,
    letterSpacing: -0.2,
  },
  /* Callout — buttons, emphasized CTA labels */
  callout: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "700" as const,
    letterSpacing: 0.2,
  },
  /* Caption — small chip / hint copy */
  caption: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "600" as const,
    letterSpacing: -0.1,
  },
  /* Eyebrow — uppercase preamble labels */
  eyebrow: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700" as const,
    letterSpacing: 1.4,
    textTransform: "uppercase" as const,
  },
} as const;

/* ────────────────────────────────────────────────────────────────────
 * Spring + timing presets — fluid iOS 26 motion
 * ──────────────────────────────────────────────────────────────────── */
export const Motion = {
  /* Fast tactile press — buttons compress instantly */
  press:   { damping: 18, stiffness: 320, mass: 0.5 },
  /* Standard bounce — selection & enters */
  bounce:  { damping: 16, stiffness: 220, mass: 0.7 },
  /* Soft float — sheets, big surfaces */
  soft:    { damping: 22, stiffness: 180, mass: 0.9 },
  /* Color transition timing */
  colorMs: 220,
  ease:    Easing.out(Easing.cubic),
} as const;

/* ────────────────────────────────────────────────────────────────────
 * Radii — iOS 26 prefers slightly more aggressive rounding
 * ──────────────────────────────────────────────────────────────────── */
export const Radius = {
  pill:   999,
  xl:     32,
  lg:     24,
  md:     18,
  sm:     14,
  xs:     10,
} as const;
