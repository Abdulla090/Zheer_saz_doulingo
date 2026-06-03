import { Platform } from "react-native";

/** CustomTabBar inner row: icon + label + vertical padding (excludes home indicator). */
export const TAB_BAR_INNER_HEIGHT = 52;
export const TAB_BAR_TOP_PADDING = 6;
/** iOS 26–style floating bar inset from screen edges. */
export const TAB_BAR_FLOAT_MARGIN_H = 14;
export const TAB_BAR_FLOAT_MARGIN_BOTTOM = 4;
export const TAB_BAR_CORNER_RADIUS = 30;
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
  // iOS NativeTabs handles bottom insets automatically (SDK 55+).
  if (Platform.OS === "ios") {
    return 16;
  }
  // Android + web use the floating glass tab bar.
  return tabBarTotalHeight(deviceBottomInset) + 12;
}

/** @deprecated Use tabBarTotalHeight — old floating bar constant */
export const FLOATING_TAB_BAR_HEIGHT = TAB_BAR_INNER_HEIGHT;
