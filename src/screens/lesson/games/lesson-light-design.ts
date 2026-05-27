/**
 * Premium light lesson shell — Duolingo-style white canvas.
 * Soft elevation, iOS spring press, brand blue CTAs.
 */

import { Easing } from "react-native-reanimated";

export const L = {
  bg: "#FFFFFF",
  bgSoft: "#F7F9FC",
  blue: "#3355FF",
  bluePress: "#2848E8",
  navy: "#1A1A1A",
  navySoft: "#3D3D3D",
  gray: "#6B7280",
  grayLight: "#9CA3AF",
  track: "#E5E7EB",
  trackInner: "#E0E0E0",
  cardTint: "#EAF1FF",
  cardTintBorder: "#D6E4FF",
  border: "#E8EAED",
  red: "#FF4B4B",
  green: "#58CC02",
  greenDeep: "#46A302",
  redDeep: "#E53838",
  gold: "#FFC800",
  slotDash: "#C5CED8",
  shadow: "rgba(15, 23, 42, 0.06)",
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

export function usesLightLessonShell(
  type: string | undefined,
): boolean {
  return type === "sentence_builder" || type === "pair_match";
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
};
