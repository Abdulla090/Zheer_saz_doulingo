import { Platform } from "react-native";

/** CustomTabBar inner row: icon + label + vertical padding (excludes home indicator). */
export const TAB_BAR_INNER_HEIGHT = 56;
export const TAB_BAR_TOP_PADDING = 8;

/** Bottom inset applied inside the tab bar (home indicator / gesture nav). */
export function tabBarBottomInset(deviceBottomInset: number): number {
  return Math.max(deviceBottomInset, Platform.OS === "android" ? 10 : 6);
}

/** Full tab bar height from the bottom of the screen. */
export function tabBarTotalHeight(deviceBottomInset: number): number {
  return (
    TAB_BAR_TOP_PADDING + TAB_BAR_INNER_HEIGHT + tabBarBottomInset(deviceBottomInset)
  );
}

/** Scroll content padding so lists clear the tab bar. */
export function tabBarScrollPadding(deviceBottomInset: number): number {
  return tabBarTotalHeight(deviceBottomInset) + 12;
}

/** @deprecated Use tabBarTotalHeight — old floating bar constant */
export const FLOATING_TAB_BAR_HEIGHT = TAB_BAR_INNER_HEIGHT;
