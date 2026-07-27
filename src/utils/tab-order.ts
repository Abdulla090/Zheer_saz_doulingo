/**
 * Returns the physical left-to-right render order for a tab bar whose layout
 * coordinates intentionally stay LTR. RTL is applied exactly once here.
 */
export function orderTabsForDirection<T>(
  items: readonly T[],
  isRtl: boolean,
): readonly T[] {
  return isRtl ? [...items].reverse() : items;
}
