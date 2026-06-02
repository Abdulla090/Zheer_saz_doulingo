/**
 * Lesson shell — aligned with home liquid glass (HomePalette).
 */

import { HomePalette } from "@/components/ui/ios-liquid-home";
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
  cardTint: "#EEF4FF",
  cardTintBorder: "#D6E4FF",
  border: H.divider,
  red: H.red,
  green: "#58CC02",
  greenDeep: "#46A302",
  redDeep: "#E53838",
  gold: H.gold,
  slotDash: "#C5CED8",
  shadow: "rgba(26, 43, 72, 0.08)",
} as const;

export const LightMotion = {
  press: { damping: 28, stiffness: 380, mass: 0.38, overshootClamping: true },
  soft: { damping: 26, stiffness: 300, mass: 0.45, overshootClamping: true },
  colorMs: 180,
  ease: Easing.out(Easing.cubic),
} as const;

export const LightRadius = {
  card: 20,
  tile: 16,
  btn: 16,
  pill: 999,
} as const;

/** All in-lesson games use the premium light shell (white canvas). */
export function usesLightLessonShell(_type?: string): boolean {
  return true;
}

export const LightType = {
  title: {
    fontSize: 26,
    fontWeight: "800" as const,
    letterSpacing: -0.6,
    color: L.navy,
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
  tile: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: L.navy,
    fontFamily: "DINNextRoundedBold",
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
