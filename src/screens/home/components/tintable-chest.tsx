import React, { useMemo } from "react";
import Svg, { Path } from "react-native-svg";

import { shadeHex } from "../../../utils/color-shade";

/**
 * The path's reward chest, recoloured to the unit's own theme colour.
 *
 * The chest artwork otherwise ships as baked SVG assets (gray `chest.svg`, gold
 * `chest-unlocked.svg`), so a unit-coloured chest cannot come from another
 * asset — there would have to be one per unit colour. Instead this component
 * re-declares the closed chest's geometry path-for-path with `chest.svg`
 * (dropping its two clip paths, which cover the whole canvas and clip nothing)
 * and derives every fill from a single base colour.
 *
 * The original fills are all neutral grays, so each fill is the artwork's mid
 * gray (#9A9A9A) scaled by that piece's own luminance ratio: the light band
 * stays light, the dark trims stay dark, and the chest keeps its depth in any
 * hue. Passing "#9A9A9A" reproduces the locked chest exactly.
 */

const CHEST_MID_GRAY = 154; // 0x9A — the artwork's mid gray, the 1.0 of the ramp

type ChestPiece = {
  /** The piece's gray channel in the source artwork (0–255). */
  gray: number;
  d: string;
  opacity?: number;
};

const CHEST_PIECES: readonly ChestPiece[] = [
  {
    gray: 175,
    opacity: 0.3,
    d: "M73.5 38h-72a4 4 0 0 0-4 4v32a4 4 0 0 0 4 4h72a4 4 0 0 0 4-4V42a4 4 0 0 0-4-4",
  },
  {
    gray: 154,
    d: "M5.79 39.737c0-5.537 4.487-10.025 10.024-10.025h42.442c5.536 0 10.025 4.488 10.025 10.025V66.32a4.01 4.01 0 0 1-4.01 4.01H9.799a4.01 4.01 0 0 1-4.01-4.01z",
  },
  {
    gray: 154,
    d: "M3.622 25.227c0-5.536 4.488-10.024 10.025-10.024h47.116c5.536 0 10.025 4.488 10.025 10.024v29.824H3.622z",
  },
  { gray: 216, d: "M74.418 42.772H.61V54.3h73.81z" },
  {
    gray: 216,
    d: "M64.521 25.477h7.897c1.107 0 2.004.898 2.004 2.005v18.295h-9.901zM.61 27.482c0-1.107.897-2.005 2.004-2.005h6.393c1.107 0 2.005.898 2.005 2.005v16.29a2.005 2.005 0 0 1-2.005 2.005H2.614A2.005 2.005 0 0 1 .61 43.772z",
  },
  {
    gray: 216,
    d: "M3.622 14.005c0-1.107.898-2.005 2.005-2.005h10.526c1.107 0 2.005.898 2.005 2.005v20.498H3.622zm52.63 0c0-1.107.898-2.005 2.005-2.005h10.526c1.108 0 2.005.898 2.005 2.005v20.498H56.252z",
  },
  { gray: 237, d: "m3.754 24.145 14.348-3.573v12.65l-14.348-.176z" },
  {
    gray: 191,
    d: "M3.622 31.725h14.536V46.22H3.622zm0 20.819c0-1.108.898-2.005 2.005-2.005h10.526c1.107 0 2.005.897 2.005 2.005V70.39a2.005 2.005 0 0 1-2.005 2.005H5.627a2.005 2.005 0 0 1-2.005-2.005zm51.313 0c0-1.108.897-2.005 2.005-2.005h10.526c1.107 0 2.005.897 2.005 2.005V70.39a2.005 2.005 0 0 1-2.005 2.005H56.94a2.005 2.005 0 0 1-2.005-2.005zm15.853-20.819H56.252V46.22h14.536z",
  },
  { gray: 196, d: "M39.962 49.913H34.45v9.711h5.513z" },
  {
    gray: 154,
    d: "M18.158 55.308H3.622v4.887h14.536zm51.312 0H54.935v4.887H69.47z",
  },
  {
    gray: 137,
    d: "M54.932 63.818h-36.78v2.632h36.779zm1.315-40.178H18.153v2.631h38.094z",
  },
  {
    gray: 136,
    opacity: 0.92,
    d: "M54.932 55.308h-36.78v4.887h36.779z",
  },
  {
    gray: 137,
    opacity: 0.92,
    d: "M56.247 35.305H18.153v7.465h38.094z",
  },
  {
    gray: 191,
    d: "M.61 46.216h73.808V55.3a2.005 2.005 0 0 1-2.005 2.005H2.614A2.005 2.005 0 0 1 .61 55.3z",
  },
  {
    gray: 216,
    d: "M44.345 38.383H29.432a3.007 3.007 0 0 0-3.008 3.007v12.186a3.007 3.007 0 0 0 3.008 3.008h14.911a3.007 3.007 0 0 0 3.008-3.008V41.39a3.007 3.007 0 0 0-3.008-3.007",
  },
  {
    gray: 237,
    d: "M31.101 38.383h-1.668a3.007 3.007 0 0 0-3.008 3.007v12.186a3.007 3.007 0 0 0 3.008 3.008h1.004a.937.937 0 0 0 .936-.958l-.272-12.653z",
  },
  {
    gray: 191,
    d: "M44.345 42.863H29.432a3.007 3.007 0 0 0-3.008 3.008v11.925a3.007 3.007 0 0 0 3.008 3.008h14.911a3.007 3.007 0 0 0 3.008-3.008V45.871a3.007 3.007 0 0 0-3.008-3.008",
  },
  {
    gray: 138,
    d: "M36.543 53.25c2.18 0 3.948-1.587 3.948-3.544s-1.768-3.545-3.948-3.545-3.947 1.587-3.947 3.545 1.767 3.544 3.947 3.544",
  },
  {
    gray: 138,
    d: "M35.647 51.603a1.002 1.002 0 0 1 1.793 0l1.797 3.593a1.002 1.002 0 0 1-.897 1.45h-3.593c-.745 0-1.23-.784-.896-1.45z",
  },
  {
    gray: 237,
    d: "m56.286 16.385 14.47-3.492v7.965l-14.47 3.492zM26.427 42.358h-8.442v3.803h8.442z",
  },
];

export function TintableChest({
  width,
  height,
  color,
}: {
  width: number;
  height: number;
  /** The unit's face colour the chest is recoloured to. */
  color: string;
}) {
  const fills = useMemo(
    () => CHEST_PIECES.map((piece) => shadeHex(color, piece.gray / CHEST_MID_GRAY)),
    [color],
  );

  return (
    <Svg width={width} height={height} viewBox="0 11 75 67">
      {CHEST_PIECES.map((piece, index) => (
        <Path
          key={index}
          d={piece.d}
          fill={fills[index]}
          opacity={piece.opacity}
        />
      ))}
    </Svg>
  );
}
