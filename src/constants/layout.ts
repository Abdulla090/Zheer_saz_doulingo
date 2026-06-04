import { Platform } from "react-native";

/** CustomTabBar inner row: icon + label (excludes home indicator). */
export const TAB_BAR_INNER_HEIGHT = Platform.OS === "android" ? 56 : 52;
export const TAB_BAR_TOP_PADDING = Platform.OS === "android" ? 8 : 6;
/** Floating bar inset from screen edges — match iOS 26 compact width. */
export const TAB_BAR_FLOAT_MARGIN_H = Platform.OS === "android" ? 16 : 14;
export const TAB_BAR_FLOAT_MARGIN_BOTTOM = Platform.OS === "android" ? 6 : 4;
export const TAB_BAR_CORNER_RADIUS = 28;
/** Extra scroll clearance above the floating bar. */
export const TAB_BAR_FLOAT_CLEARANCE = 10;

/** Bottom inset applied inside the tab bar (home indicator / gesture nav). */
export function tabBarBottomInset(deviceBottomInset: number): number {
  return Math.max(deviceBottomInset, Platform.OS === "android" ? 10 : 6);
}

/** Full tab bar height from the bottom of the screen (floating glass bar). */
export function tabBarTotalHeight(deviceBottomInset: number): number {
  return (
    TAB_BAR_FLOAT_MARGIN_BOTTOM +
    TAB_BAR_TOP_PADDING +
    TAB_BAR_INNER_HEIGHT +
    tabBarBottomInset(deviceBottomInset) +
    TAB_BAR_FLOAT_CLEARANCE
  );
}

/** Scroll content padding so lists clear the tab bar. */
export function tabBarScrollPadding(deviceBottomInset: number): number {
  // NativeTabs (iOS + Android) — system bar handles safe area.
  if (Platform.OS === "ios" || Platform.OS === "android") {
    return process.env.EXPO_PUBLIC_ANDROID_JS_TABS === "1"
      ? tabBarTotalHeight(deviceBottomInset) + 12
      : 20;
  }
  return tabBarTotalHeight(deviceBottomInset) + 12;
}

/** @deprecated Use tabBarTotalHeight — old floating bar constant */
export const FLOATING_TAB_BAR_HEIGHT = TAB_BAR_INNER_HEIGHT;
