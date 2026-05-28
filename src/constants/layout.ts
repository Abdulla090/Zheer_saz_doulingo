/** Space reserved above the floating tab bar (height + typical bottom inset). */
export const FLOATING_TAB_BAR_HEIGHT = 72;
export const TAB_BAR_BOTTOM_MARGIN = 16;
export const TAB_BAR_CLEARANCE = FLOATING_TAB_BAR_HEIGHT + TAB_BAR_BOTTOM_MARGIN + 8;

export function tabBarScrollPadding(bottomInset: number): number {
  return bottomInset + TAB_BAR_CLEARANCE;
}
