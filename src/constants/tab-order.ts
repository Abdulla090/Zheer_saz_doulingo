import { ENABLE_SHOP } from "./feature-flags";

/** Icons inside the main glass pill (left → right). */
export const TAB_PILL_ROUTES = (
  ENABLE_SHOP
    ? (["index", "feed", "dashboard", "subscription"] as const)
    : (["index", "feed", "dashboard"] as const)
);

/** Detached circular button — profile / settings. */
export const TAB_FAB_ROUTE = "more" as const;

/** Full visual order for tab transitions (pill + FAB). */
export const TAB_VISUAL_ROUTES = [
  ...TAB_PILL_ROUTES,
  TAB_FAB_ROUTE,
] as const;

export type TabPillRoute = (typeof TAB_PILL_ROUTES)[number];
export type TabVisualRoute = (typeof TAB_VISUAL_ROUTES)[number];

export function getTabVisualIndex(routeName: string): number {
  const idx = (TAB_VISUAL_ROUTES as any).indexOf(routeName);
  return idx >= 0 ? idx : 0;
}
