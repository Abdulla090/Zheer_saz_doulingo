import { ENABLE_SHOP } from "@/constants/feature-flags";

/** Left → right order in CustomTabBar / NativeTabs (Games · Home · Shop? · Profile). */
export const TAB_VISUAL_ROUTES = (
  ENABLE_SHOP
    ? (["feed", "index", "subscription", "more"] as const)
    : (["feed", "index", "more"] as const)
);

export type TabVisualRoute = (typeof TAB_VISUAL_ROUTES)[number];

export function getTabVisualIndex(routeName: string): number {
  const idx = TAB_VISUAL_ROUTES.indexOf(routeName as TabVisualRoute);
  return idx >= 0 ? idx : 0;
}
