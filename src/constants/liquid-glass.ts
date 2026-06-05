import { Platform, type ViewStyle } from "react-native";

/**
 * iOS 26 Liquid Glass tokens (light chrome).
 *
 * Edge shading stack (custom fallback — native GlassView owns this on iOS 26+):
 * 1. Specular top arc   — virtual light from above (WWDC “highlights layer”)
 * 2. Top hairline       — 1px catch on upper rim
 * 3. Lateral Fresnel    — brighter at grazing left/right edges on capsules
 * 4. Bottom inner shade — subtle lensing / thickness read
 * 5. Outer + inner rim  — separation on white backgrounds (Increased Contrast–like)
 * 6. Inset box-shadow   — web only; top highlight + bottom shade in one paint
 *
 * @see .cursor/skills/goat-expo-skill/references/ios-26-liquid-glass-edge-shading.md
 */

export const LIQUID_GLASS = {
  frost: "rgba(241, 245, 249, 0.78)",
  frostWeb: "rgba(226, 232, 240, 0.58)",
  frostAndroid: "rgba(241, 245, 249, 0.9)",
  frostUnderlay: "rgba(203, 213, 225, 0.38)",
  sheen: [
    "rgba(255, 255, 255, 0.72)",
    "rgba(255, 255, 255, 0.18)",
    "rgba(255, 255, 255, 0)",
  ] as const,
  /** Virtual overhead light — top 38–45% of surface */
  edgeSpecular: [
    "rgba(255, 255, 255, 0.92)",
    "rgba(255, 255, 255, 0.32)",
    "rgba(255, 255, 255, 0)",
  ] as const,
  edgeTopLine: "rgba(255, 255, 255, 0.98)",
  /** Fresnel rim at left/right grazing angles */
  edgeFresnel: "rgba(255, 255, 255, 0.38)",
  edgeBottomShade: "rgba(100, 116, 139, 0.16)",
  border: "rgba(148, 163, 184, 0.44)",
  borderInner: "rgba(255, 255, 255, 0.58)",
  tintWash: "rgba(255, 255, 255, 0.12)",
  shadow: "#334155",
  /** Adaptive float — stronger over busy content, softer on flat white (tune per screen) */
  shadowOpacityLight: 0.1,
  shadowOpacityBusy: 0.18,
  blurTint: "systemChromeMaterialLight" as const,
  activeCircle: "rgba(255, 255, 255, 0.96)",
  activeCircleBorder: "rgba(43, 89, 243, 0.32)",
} as const;

export function liquidFrostBase(): string {
  if (Platform.OS === "web") return LIQUID_GLASS.frostWeb;
  if (Platform.OS === "android") return LIQUID_GLASS.frostAndroid;
  return LIQUID_GLASS.frost;
}

export function liquidGlassShellShadow(depth: "tab" | "button" = "button"): ViewStyle {
  const tab = depth === "tab";
  if (Platform.OS === "web") {
    return {
      boxShadow: tab
        ? [
            "0 0 0 1px rgba(148, 163, 184, 0.34)",
            "0 14px 44px rgba(15, 23, 42, 0.16)",
            "0 4px 16px rgba(15, 23, 42, 0.1)",
            "inset 0 1.5px 0 rgba(255, 255, 255, 0.98)",
            "inset 0 -1px 0 rgba(100, 116, 139, 0.12)",
          ].join(", ")
        : [
            "0 0 0 1px rgba(148, 163, 184, 0.28)",
            "0 8px 28px rgba(15, 23, 42, 0.1)",
            "0 2px 8px rgba(15, 23, 42, 0.06)",
            "inset 0 1.5px 0 rgba(255, 255, 255, 0.95)",
            "inset 0 -1px 0 rgba(100, 116, 139, 0.1)",
          ].join(", "),
    } as ViewStyle;
  }
  return {
    shadowColor: LIQUID_GLASS.shadow,
    shadowOffset: { width: 0, height: tab ? 10 : 6 },
    shadowOpacity: Platform.OS === "ios" ? (tab ? 0.2 : 0.14) : tab ? 0.16 : 0.12,
    shadowRadius: Platform.OS === "ios" ? (tab ? 22 : 16) : tab ? 18 : 14,
    elevation: Platform.OS === "android" ? (tab ? 12 : 6) : 0,
  };
}
