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
