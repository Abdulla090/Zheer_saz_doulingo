import {
  LIQUID_GLASS,
  liquidFrostBase,
  liquidGlassShellShadow,
} from "@/constants/liquid-glass";
import { DynamicColorIOS, Platform, type ViewStyle } from "react-native";

/** Tab bar tokens — extends shared liquid glass. */
export const TAB_BAR_GLASS = {
  ...LIQUID_GLASS,
  iconActive: "#2B59F3",
  iconInactive: "#64748B",
} as const;

export const tabBarFrostBase = liquidFrostBase;

export function tabBarShellShadow(): ViewStyle {
  return liquidGlassShellShadow("tab");
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
