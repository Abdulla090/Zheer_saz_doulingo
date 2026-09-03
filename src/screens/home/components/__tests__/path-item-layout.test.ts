import { describe, expect, it } from "@jest/globals";

import type { LessonListItem, SectionDataItem } from "../../../../data/list-items";
import { createPathItemLayout } from "../path-item-layout";

const ROW = 74;
const HEADER = 50;

function item(id: string): LessonListItem {
  return {
    id,
    pathIndex: 0,
    globalIndex: 0,
    sectionItemIndex: 0,
    type: "practice",
    sectionTheme: "blue",
    displayTheme: "blue",
    status: "locked",
    isCurrent: false,
    progressSegments: 0,
    lessonId: 0,
  };
}

function section(unitIndex: number, itemCount: number): SectionDataItem {
  return {
    unitIndex,
    title: "",
    theme: "blue",
    displayTheme: "blue",
    data: Array.from({ length: itemCount }, (_, i) =>
      item(`u${unitIndex}-l${i}`),
    ),
  };
}

/*
 * `SectionList` flattens sections into one `VirtualizedList`, spending two extra
 * cells per section (header + footer). These tests pin the layout to that
 * indexing, because a mismatch does not throw — it silently misplaces rows and
 * sends `scrollToLocation` to the wrong offset.
 */
describe("createPathItemLayout", () => {
  it("lays out header, rows and footer in SectionList cell order", () => {
    const sections = [section(0, 3)];
    const layout = createPathItemLayout({
      sections,
      rowHeight: ROW,
      sectionHeaderHeight: HEADER,
    });

    // Unit 0 draws no header, so its header cell has zero height.
    expect(layout(sections, 0)).toEqual({ length: 0, offset: 0, index: 0 });

    expect(layout(sections, 1)).toEqual({ length: ROW, offset: 0, index: 1 });
    expect(layout(sections, 2)).toEqual({ length: ROW, offset: ROW, index: 2 });
    expect(layout(sections, 3)).toEqual({
      length: ROW,
      offset: ROW * 2,
      index: 3,
    });

    // Footer: no `renderSectionFooter`, so zero height at the running offset.
    expect(layout(sections, 4)).toEqual({
      length: 0,
      offset: ROW * 3,
      index: 4,
    });
  });

  it("gives every unit after the first a header of its own", () => {
    const sections = [section(0, 2), section(1, 2)];
    const layout = createPathItemLayout({
      sections,
      rowHeight: ROW,
      sectionHeaderHeight: HEADER,
    });

    // 0: u0 header (0pt), 1-2: u0 rows, 3: u0 footer, 4: u1 header.
    expect(layout(sections, 4)).toEqual({
      length: HEADER,
      offset: ROW * 2,
      index: 4,
    });
    expect(layout(sections, 5)).toEqual({
      length: ROW,
      offset: ROW * 2 + HEADER,
      index: 5,
    });
  });

  it("offsets stay contiguous across the whole list", () => {
    const sections = [section(0, 4), section(1, 3), section(2, 5)];
    const layout = createPathItemLayout({
      sections,
      rowHeight: ROW,
      sectionHeaderHeight: HEADER,
    });

    const cellCount = sections.reduce((n, s) => n + s.data.length + 2, 0);
    for (let i = 1; i < cellCount; i += 1) {
      const prev = layout(sections, i - 1);
      expect(layout(sections, i).offset).toBe(prev.offset + prev.length);
    }

    // Total content height: every row plus one header per unit beyond the first.
    const last = layout(sections, cellCount - 1);
    expect(last.offset + last.length).toBe(ROW * 12 + HEADER * 2);
  });

  it("reports zero-height headers when a path draws none", () => {
    const sections = [section(0, 2), section(1, 2)];
    const layout = createPathItemLayout({
      sections,
      rowHeight: ROW,
      sectionHeaderHeight: 0,
    });

    expect(layout(sections, 4)).toEqual({ length: 0, offset: ROW * 2, index: 4 });
  });

  it("falls back to a row estimate for out-of-range cells", () => {
    /*
     * The list can ask about a cell that no longer exists in the frame between a
     * `sections` change and this callback being rebuilt. Throwing there would
     * take down the screen, so the estimate keeps it consistent for that frame.
     */
    const sections = [section(0, 2)];
    const layout = createPathItemLayout({
      sections,
      rowHeight: ROW,
      sectionHeaderHeight: HEADER,
    });

    expect(layout(sections, 99)).toEqual({
      length: ROW,
      offset: ROW * 99,
      index: 99,
    });
    expect(layout(sections, -1)).toEqual({
      length: ROW,
      offset: 0,
      index: -1,
    });
  });

  it("folds the list's top padding into every offset", () => {
    /*
     * Cell offsets are measured from the start of the content container, so the
     * container's own top padding sits above cell 0. Omitting it sends
     * `scrollToLocation` short by exactly that padding.
     */
    const sections = [section(0, 2), section(1, 2)];
    const layout = createPathItemLayout({
      sections,
      rowHeight: ROW,
      sectionHeaderHeight: HEADER,
      contentPaddingTop: 8,
    });

    expect(layout(sections, 0)).toEqual({ length: 0, offset: 8, index: 0 });
    expect(layout(sections, 1)).toEqual({ length: ROW, offset: 8, index: 1 });
    expect(layout(sections, 4)).toEqual({
      length: HEADER,
      offset: 8 + ROW * 2,
      index: 4,
    });
    // The out-of-range estimate has to sit below the padding too.
    expect(layout(sections, 99).offset).toBe(8 + ROW * 99);
  });

  it("handles an empty section list", () => {
    const layout = createPathItemLayout({
      sections: [],
      rowHeight: ROW,
      sectionHeaderHeight: HEADER,
    });

    expect(layout([], 0)).toEqual({ length: ROW, offset: 0, index: 0 });
  });
});
