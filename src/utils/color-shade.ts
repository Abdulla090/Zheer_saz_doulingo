/**
 * Multiply a hex colour's channels by `factor`.
 *
 * `factor < 1` darkens, `> 1` lightens. Used to derive dark-mode variants of the
 * path node palette: those colours are tuned against a white canvas and read as
 * glare on a dark one, but they still need to stay recognisably the same hue, so
 * scaling beats maintaining a second hand-picked table that can drift.
 *
 * Anything that is not a 3- or 6-digit hex string is returned unchanged — callers
 * pass values straight from theme tables, and a silent passthrough is safer than
 * throwing inside a render path.
 */
export function shadeHex(hex: string, factor: number): string {
  if (typeof hex !== "string") return hex;

  const raw = hex.trim().replace(/^#/, "");
  const expanded =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw;

  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) return hex;

  const value = Number.parseInt(expanded, 16);
  const scale = (channel: number) =>
    Math.max(0, Math.min(255, Math.round(channel * factor)));

  const r = scale((value >> 16) & 0xff);
  const g = scale((value >> 8) & 0xff);
  const b = scale(value & 0xff);

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
