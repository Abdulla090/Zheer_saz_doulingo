import { DynamicColorIOS, Platform } from "react-native";

/**
 * Phingo tab bar = always light frosted glass (matches home mesh UI).
 * Do not follow system dark mode — Android BlurView + dark = solid black bar.
 */

export const TAB_BAR_GLASS = {
  frost: "rgba(255, 255, 255, 0.88)",
  frostAndroid: "rgba(252, 254, 255, 0.94)",
  frostUnderlay: "rgba(248, 250, 255, 0.78)",
  sheen: [
    "rgba(255, 255, 255, 0.55)",
    "rgba(236, 242, 255, 0.28)",
    "rgba(255, 255, 255, 0)",
  ] as const,
  border: "rgba(255, 255, 255, 0.85)",
  borderInner: "rgba(43, 89, 243, 0.12)",
  tintBrand: "rgba(43, 89, 243, 0.05)",
  shadow: "#1A2B48",
} as const;

export function tabBarFrostBase(): string {
  return Platform.OS === "android" ? TAB_BAR_GLASS.frostAndroid : TAB_BAR_GLASS.frost;
}

export function nativeTabBarBackground(): string | ReturnType<typeof DynamicColorIOS> {
  if (Platform.OS === "ios") {
    return DynamicColorIOS({
      light: TAB_BAR_GLASS.frost,
      dark: TAB_BAR_GLASS.frost,
    });
  }
  return TAB_BAR_GLASS.frostAndroid;
}
