import type { SectionDataItem } from "../../../data/list-items";

/**
 * `getItemLayout` for the three path SectionLists.
 *
 * Every path row is a fixed height and every section header is a fixed height,
 * so the list never needs to measure a cell to know where it sits. Without this
 * the SectionList has to lay out each cell before it can place the next one,
 * which is what makes a fling over the path stutter: the scroll outruns the
 * measurement pass and the list falls back to `_averageCellLength` guesses,
 * then corrects itself once the real heights arrive.
 *
 * It also makes `scrollToLocation` exact for rows that have never been
 * rendered. Previously any jump past the render window went through
 * `onScrollToIndexFailed`, landed on an estimate, and re-scrolled.
 *
 * ── Flat cell indexing ──
 *
 * `SectionList` flattens sections into one `VirtualizedList`, spending two
 * extra cells per section — one header, one footer:
 *
 *   [s0 header][s0 item 0]…[s0 item n][s0 footer][s1 header]…
 *
 * This mirrors `VirtualizedSectionList.scrollToLocation`, which advances by
 * `getItemCount(section.data) + 2` per section. The index handed to
 * `getItemLayout` is that flat index, not an index into a section.
 *
 * None of the path screens pass `renderSectionFooter`, so footer cells render
 * nothing and take no space.
 */

export type PathCellLayout = {
  length: number;
  offset: number;
  index: number;
};

export type PathItemLayout = (
  data: readonly SectionDataItem[] | null,
  index: number,
) => PathCellLayout;

type Options = {
  /** Sections exactly as handed to the list, in order. */
  sections: readonly SectionDataItem[];
  /** Outer height of one lesson row. */
  rowHeight: number;
  /**
   * Header height including its bottom margin, for sections that draw one.
   *
   * Unit 0 is excluded: both header components (`NormalEnglishPathScreen`'s
   * `NormalSectionHeader` and the street path's `ListSectionHeader`) return
   * `null` when `section.unitIndex === 0`, so that cell occupies no space. Pass
   * 0 for a path that renders no section headers at all, as kids does.
   */
  sectionHeaderHeight: number;
  /**
   * The list's `contentContainerStyle.paddingTop`.
   *
   * Cell offsets are measured from the start of the content container, so the
   * top padding sits above cell 0 and has to be folded into every offset.
   * Without it `scrollToLocation` lands short by exactly that padding — small,
   * but it is the difference between the target row sitting where it was asked
   * to and sitting a few points high.
   */
  contentPaddingTop?: number;
};

/**
 * Precomputes every cell offset once per `sections` change, so the callback the
 * list invokes is a pair of array reads.
 *
 * A naive implementation walks the sections on every call. `VirtualizedList`
 * asks for layouts across its whole render window on each scroll update, so
 * that walk would reintroduce per-frame work in the exact place this is meant
 * to remove it.
 */
export function createPathItemLayout({
  sections,
  rowHeight,
  sectionHeaderHeight,
  contentPaddingTop = 0,
}: Options): PathItemLayout {
  let cellCount = 0;
  for (const section of sections) cellCount += section.data.length + 2;

  const offsets = new Array<number>(cellCount);
  const lengths = new Array<number>(cellCount);

  let cell = 0;
  let offset = contentPaddingTop;

  for (const section of sections) {
    const headerHeight =
      section.unitIndex === 0 ? 0 : sectionHeaderHeight;

    offsets[cell] = offset;
    lengths[cell] = headerHeight;
    cell += 1;
    offset += headerHeight;

    for (let item = 0; item < section.data.length; item += 1) {
      offsets[cell] = offset;
      lengths[cell] = rowHeight;
      cell += 1;
      offset += rowHeight;
    }

    // Section footer: no `renderSectionFooter`, so zero height at the current
    // offset rather than a skipped index.
    offsets[cell] = offset;
    lengths[cell] = 0;
    cell += 1;
  }

  return (_data, index) => {
    if (index < 0 || index >= cellCount) {
      // Out of range means the list is asking about a cell that no longer
      // exists — mid-update, between a `sections` change and this callback
      // being rebuilt. A row-height estimate keeps the list consistent for the
      // one frame it takes to settle, instead of throwing.
      const clamped = Math.max(0, index);
      return {
        length: rowHeight,
        offset: contentPaddingTop + rowHeight * clamped,
        index,
      };
    }
    return { length: lengths[index]!, offset: offsets[index]!, index };
  };
}
