/**
 * Geometry for the Duolingo answer area shared by the word-building games
 * (`SentenceBuilderGame`, `ListenBuildGame`).
 *
 * The one rule that matters: a wrapped flex line must be exactly `ROW_STRIDE`
 * tall. Tile cells therefore carry a *fixed* height plus a fixed bottom margin
 * instead of letting the tallest tile size the line — the rails are drawn behind
 * the row at fixed multiples of that stride, so line k always rests on rail k no
 * matter how the words wrap. Leaving the line height to content is exactly what
 * makes wrapped words float in empty space above the rail.
 */

/** Tile (and therefore line box) height. */
export const ROW_H = 52;
/** Vertical space between a line's tiles and the next line's tiles. */
export const ROW_GAP = 14;
/** Total height of one wrapped line, rails included. */
export const ROW_STRIDE = ROW_H + ROW_GAP;
/** Rail offset below a tile's bottom edge. */
export const RAIL_DROP = 2;
/**
 * Rail stroke, shared by every game that draws an answer rail — the word
 * builders, the fill-blank slot and the conversation reply bubble. One constant
 * so the blank in one exercise doesn't read heavier than the blank in the next.
 */
export const RAIL_H = 2;
/** Matching corner radius for the stroke. */
export const RAIL_RADIUS = 1;
/** Duolingo keeps at least two rails visible even for a one-line answer. */
export const MIN_RAILS = 2;
/** Horizontal gap between tiles on the same line. */
export const TILE_GAP = 8;

/**
 * How many rails the answer needs before anything is placed.
 *
 * Measurement is impossible until words land, and rails appearing mid-solve
 * looks broken, so the finished answer is greedily packed using an approximation
 * of each tile's width. Live measurement can only ever add rails on top of this,
 * so an under-estimate self-corrects and an over-estimate just shows one extra
 * empty rail — which is what the reference design does anyway.
 */
export function estimateRailCount(words: string[], contentWidth: number): number {
  if (contentWidth <= 0) return MIN_RAILS;

  // 19px DIN Next Rounded Bold averages ~0.57em per glyph; the constant covers
  // horizontal padding (30), borders (4) and the inter-tile gap (8).
  const tileWidth = (w: string) => Math.min(contentWidth, 42 + w.length * 10.9);

  let lines = 1;
  let used = 0;
  for (const w of words) {
    const width = tileWidth(w);
    if (used > 0 && used + width > contentWidth) {
      lines += 1;
      used = width;
    } else {
      used += width;
    }
  }
  return Math.max(MIN_RAILS, lines);
}

/** Lines a measured row height corresponds to. */
export function linesFromHeight(height: number): number {
  return Math.max(1, Math.round(height / ROW_STRIDE));
}

/**
 * Fallback tile width, used only until a cell has reported its real layout.
 * Same glyph metric as `estimateRailCount`, kept separate because this one sizes
 * a single tile rather than packing a line.
 */
export function estimateTileWidth(word: string): number {
  "worklet";
  return Math.max(54, Math.min(220, 32 + word.length * 11.2));
}

/**
 * Which slot a dragged tile has moved onto, from how far it travelled.
 *
 * `delta` is normalised to reading order (positive = later in the sentence), so
 * RTL needs no special case here — only the caller flips the sign of the raw
 * gesture translation. A neighbour is taken over once the drag passes its
 * midpoint, which is what makes the gap open under the finger rather than a
 * whole tile-width late.
 */
export function resolveHoverTarget(
  index: number,
  delta: number,
  widths: number[],
  words: string[],
  count: number,
): number {
  "worklet";
  const step = delta > 0 ? 1 : -1;
  const distance = Math.abs(delta);
  /*
   * Reorder only after the dragged tile's centre has crossed the neighbour's
   * centre.  The old calculation used `neighbourWidth / 2` alone, which made
   * a short tile reorder after a tiny movement while its own footprint still
   * overlapped the neighbour.  Including both tile widths and the reserved
   * inter-tile gap keeps the live sibling displacement collision-free.
   */
  const draggedWidth = widths[index] ?? estimateTileWidth(words[index] ?? "");
  let hover = index;
  let accumulated = 0;
  for (let target = index + step; target >= 0 && target < count; target += step) {
    const w = widths[target] ?? estimateTileWidth(words[target] ?? "");
    const midpoint = accumulated + draggedWidth * 0.5 + TILE_GAP + w * 0.5;
    if (distance <= midpoint) break;
    hover = target;
    accumulated += w + TILE_GAP;
  }
  return hover;
}

/**
 * Signed `translateX` a resting tile needs so the row opens a gap at `hoverIdx`.
 *
 * `translateX` is physical and is never mirrored by the layout engine, so RTL has
 * to flip the sign explicitly: "shift towards the start of the sentence" is left
 * under LTR and right under RTL.
 */
export function resolveSiblingOffset(
  index: number,
  dragIdx: number,
  hoverIdx: number,
  gap: number,
  isRtl: boolean,
): number {
  "worklet";
  if (dragIdx === -1 || dragIdx === index) return 0;
  const dir = isRtl ? -1 : 1;
  if (index > dragIdx && hoverIdx >= index) return -gap * dir;
  if (index < dragIdx && hoverIdx <= index) return gap * dir;
  return 0;
}
