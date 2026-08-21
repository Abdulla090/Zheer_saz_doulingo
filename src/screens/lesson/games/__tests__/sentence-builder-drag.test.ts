/**
 * Drag reorder math for the word-building games.
 *
 * These two functions decide where a dragged word lands and how far its
 * neighbours step aside. Both are pure, and both have an RTL sign that is easy
 * to invert by accident — which shows up as words reordering backwards in
 * Kurdish, not as a visual glitch.
 */

import { describe, expect, it } from "@jest/globals";

import {
  TILE_GAP,
  resolveHoverTarget,
  resolveSiblingOffset,
} from "../duo-answer-rails";

// Four equal 100px tiles: "a b c d".
const WIDTHS = [100, 100, 100, 100];
const WORDS = ["a", "b", "c", "d"];
const COUNT = 4;

const hover = (index: number, delta: number) =>
  resolveHoverTarget(index, delta, WIDTHS, WORDS, COUNT);

describe("resolveHoverTarget", () => {
  it("keeps a short dragged word clear of a wide neighbour", () => {
    expect(resolveHoverTarget(0, 124, [54, 180], ["a", "long-word"], 2)).toBe(0);
    expect(resolveHoverTarget(0, 126, [54, 180], ["a", "long-word"], 2)).toBe(1);
  });

  it("stays put until the neighbour's midpoint is passed", () => {
    expect(hover(0, 0)).toBe(0);
    // The dragged tile must clear its own half-width plus TILE_GAP before the
    // neighbour midpoint is crossed; otherwise the two tiles overlap.
    expect(hover(0, 107)).toBe(0);
    expect(hover(0, 109)).toBe(1);
  });

  it("advances one slot per tile plus gap", () => {
    // Tile 1 is taken after the dragged tile clears both tile midpoints; tile 2
    // then needs one full neighbour plus TILE_GAP and its midpoint.
    expect(hover(0, 2 * 100 + 2 * TILE_GAP - 1)).toBe(1);
    expect(hover(0, 2 * 100 + 2 * TILE_GAP + 1)).toBe(2);
  });

  it("is symmetric backwards", () => {
    expect(hover(3, -107)).toBe(3);
    expect(hover(3, -109)).toBe(2);
    expect(hover(3, -(2 * 100 + 2 * TILE_GAP + 1))).toBe(1);
  });

  it("never runs off either end", () => {
    expect(hover(3, 9999)).toBe(3);
    expect(hover(0, -9999)).toBe(0);
  });

  it("falls back to an estimate for cells that have not reported layout", () => {
    // Empty widths array => estimateTileWidth, which floors at 54.
    expect(resolveHoverTarget(0, 62, [], WORDS, COUNT)).toBe(0);
    expect(resolveHoverTarget(0, 63, [], WORDS, COUNT)).toBe(1);
  });
});

describe("resolveSiblingOffset", () => {
  const GAP = 100 + TILE_GAP;

  it("leaves the dragged tile and un-passed tiles alone", () => {
    expect(resolveSiblingOffset(1, 1, 2, GAP, false)).toBe(0);
    expect(resolveSiblingOffset(3, 0, 1, GAP, false)).toBe(0);
    expect(resolveSiblingOffset(2, -1, -1, GAP, false)).toBe(0);
  });

  it("shifts a passed-over later tile towards the start", () => {
    // Dragging tile 0 onto slot 2: tiles 1 and 2 slide left, tile 3 holds.
    expect(resolveSiblingOffset(1, 0, 2, GAP, false)).toBe(-GAP);
    expect(resolveSiblingOffset(2, 0, 2, GAP, false)).toBe(-GAP);
    expect(resolveSiblingOffset(3, 0, 2, GAP, false)).toBe(0);
  });

  it("shifts a passed-over earlier tile towards the end", () => {
    // Dragging tile 3 back onto slot 1: tiles 1 and 2 slide right.
    expect(resolveSiblingOffset(1, 3, 1, GAP, false)).toBe(GAP);
    expect(resolveSiblingOffset(2, 3, 1, GAP, false)).toBe(GAP);
    expect(resolveSiblingOffset(0, 3, 1, GAP, false)).toBe(0);
  });

  it("mirrors the physical direction under RTL", () => {
    // translateX is not mirrored by the layout engine, so the sign must flip.
    expect(resolveSiblingOffset(1, 0, 2, GAP, true)).toBe(GAP);
    expect(resolveSiblingOffset(1, 3, 1, GAP, true)).toBe(-GAP);
  });
});
