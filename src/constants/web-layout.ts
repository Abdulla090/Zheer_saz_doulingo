export const WEB_DESKTOP_BREAKPOINT = 1180;
export const WEB_DESKTOP_NAV_WIDTH = 248;
export const WEB_DESKTOP_RAIL_WIDTH = 352;
export const WEB_DESKTOP_PATH_WIDTH = 760;

export function isDesktopWebWidth(width: number): boolean {
  return width >= WEB_DESKTOP_BREAKPOINT;
}
