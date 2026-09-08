import { Platform } from "react-native";

export const WEB_DESKTOP_BREAKPOINT = 1180;
export const WEB_DESKTOP_NAV_WIDTH = 248;
export const WEB_DESKTOP_RAIL_WIDTH = 352;
export const WEB_DESKTOP_PATH_WIDTH = 760;

/**
 * Returns the active CSS zoom factor on desktop web (e.g. 1.10), or 1 on native/mobile.
 */
export function getWebDesktopZoomFactor(): number {
  if (Platform.OS !== "web" || typeof document === "undefined") {
    return 1;
  }
  try {
    const docEl = document.documentElement;
    const inlineZoom = (docEl.style as any)?.zoom;
    if (inlineZoom) {
      const parsed = parseFloat(inlineZoom);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed > 5 ? parsed / 100 : parsed;
      }
    }
    if (typeof window !== "undefined" && window.getComputedStyle) {
      const computedZoom = window.getComputedStyle(docEl).zoom;
      if (computedZoom) {
        const parsed = parseFloat(computedZoom);
        if (!isNaN(parsed) && parsed > 0) {
          return parsed > 5 ? parsed / 100 : parsed;
        }
      }
    }
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(min-width: 1024px)").matches
    ) {
      return 1.1;
    }
  } catch {
    return 1;
  }
  return 1;
}

export function isDesktopWebWidth(width: number): boolean {
  if (Platform.OS === "web") {
    const zoom = getWebDesktopZoomFactor();
    return width * zoom >= WEB_DESKTOP_BREAKPOINT || width >= 1060;
  }
  return width >= WEB_DESKTOP_BREAKPOINT;
}

