import { usesJsTabBar } from "@/constants/tab-mode";
import { Platform } from "react-native";

/** CustomTabBar icon row height (icon-only, no labels). */
export const TAB_BAR_INNER_HEIGHT = Platform.OS === "android" ? 66 : 64;
/** @deprecated No longer used — pill and FAB share TAB_BAR_INNER_HEIGHT. */
export const TAB_BAR_TOP_PADDING = 0;
/** Detached profile FAB — same outer height as the pill glass. */
export const TAB_BAR_FAB_SIZE = TAB_BAR_INNER_HEIGHT;
/** Floating bar inset from screen edges. */
export const TAB_BAR_FLOAT_MARGIN_H = Platform.OS === "android" ? 16 : 14;
export const TAB_BAR_FLOAT_MARGIN_BOTTOM = Platform.OS === "android" ? 6 : 4;
export const TAB_BAR_CORNER_RADIUS = TAB_BAR_INNER_HEIGHT / 2;
export const TAB_BAR_ROW_GAP = 10;
export const TAB_BAR_ACTIVE_CHIP = 56;
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
    TAB_BAR_INNER_HEIGHT +
    tabBarBottomInset(deviceBottomInset) +
    TAB_BAR_FLOAT_CLEARANCE
  );
}

/** Scroll content padding so lists clear the tab bar. */
export function tabBarScrollPadding(deviceBottomInset: number): number {
  if (usesJsTabBar()) {
    return tabBarTotalHeight(deviceBottomInset) + 12;
  }
  // NativeTabs — system chrome + safe area; light bottom breathing room.
  return Platform.OS === "web" ? tabBarTotalHeight(deviceBottomInset) + 12 : 24;
}

/** @deprecated Use tabBarTotalHeight — old floating bar constant */
export const FLOATING_TAB_BAR_HEIGHT = TAB_BAR_INNER_HEIGHT;
