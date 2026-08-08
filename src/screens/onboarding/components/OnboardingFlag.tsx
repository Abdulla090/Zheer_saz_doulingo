import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Line, Path, Rect } from "react-native-svg";

/**
 * Language flags, drawn rather than typed.
 *
 * The obvious implementation is a regional-indicator emoji (🇷🇺), and that is
 * what this flow used to do. Two problems:
 *
 *   1. Kurdish has no emoji flag. Kurdistan is not an ISO 3166 region, so there
 *      is no code point to render — and Kurdish is this app's primary source
 *      language, so the one row that matters most is the one that can't work.
 *   2. Regional indicators have no glyph in the default Windows font stack, so
 *      on the web build every flag silently degrades to a letter pair ("RU").
 *
 * Drawing them fixes both, and lets the badge sit on an exact pixel grid instead
 * of inheriting emoji metrics that differ per platform.
 *
 * These are honest small-size reductions, not exact reproductions: at 30×22 the
 * Union Jack's off-centre red saltire and the Saudi shahada are both below one
 * pixel, so they are simplified to the shapes that actually read at that size.
 */
export type FlagCode = "ku" | "ar" | "en" | "ru" | "es";

const W = 30;
const H = 22;

/**
 * A `rays`-point star, used for the Kurdistan sun.
 *
 * The flag's sun has exactly 21 rays (one per letter of the Kurdish alphabet) —
 * worth generating properly rather than approximating with a plain disc, since
 * it is the detail a Kurdish speaker will look for first.
 */
function starPath(
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  rays: number,
): string {
  const points: string[] = [];
  for (let i = 0; i < rays; i += 1) {
    const tip = (i * 2 * Math.PI) / rays - Math.PI / 2;
    const valley = tip + Math.PI / rays;
    points.push(`${(cx + outer * Math.cos(tip)).toFixed(2)},${(cy + outer * Math.sin(tip)).toFixed(2)}`);
    points.push(`${(cx + inner * Math.cos(valley)).toFixed(2)},${(cy + inner * Math.sin(valley)).toFixed(2)}`);
  }
  return `M${points.join("L")}Z`;
}

const KURDISTAN_SUN = starPath(W / 2, H / 2, 7.4, 3.5, 21);

function FlagArt({ code }: { code: FlagCode }) {
  switch (code) {
    /* Kurdistan — red / white / green bands, 21-ray golden sun. */
    case "ku":
      return (
        <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <Rect x={0} y={0} width={W} height={H / 3} fill="#ED2024" />
          <Rect x={0} y={H / 3} width={W} height={H / 3} fill="#FFFFFF" />
          <Rect x={0} y={(H / 3) * 2} width={W} height={H / 3} fill="#278E43" />
          <Path d={KURDISTAN_SUN} fill="#FEBD11" />
          <Circle cx={W / 2} cy={H / 2} r={3.4} fill="#FEBD11" />
        </Svg>
      );

    /* Saudi Arabia — green field, shahada line above the sword. */
    case "ar":
      return (
        <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <Rect x={0} y={0} width={W} height={H} fill="#006C35" />
          <Rect x={6} y={7.5} width={18} height={2.4} rx={1.2} fill="#FFFFFF" />
          <Rect x={5} y={13} width={20} height={1.8} rx={0.9} fill="#FFFFFF" />
          <Rect x={4.6} y={12.4} width={2.6} height={3} rx={1.3} fill="#FFFFFF" />
        </Svg>
      );

    /* United Kingdom — simplified Union Jack (centred saltire). */
    case "en":
      return (
        <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <Rect x={0} y={0} width={W} height={H} fill="#012169" />
          {/* White saltire */}
          <Line x1={0} y1={0} x2={W} y2={H} stroke="#FFFFFF" strokeWidth={6} />
          <Line x1={W} y1={0} x2={0} y2={H} stroke="#FFFFFF" strokeWidth={6} />
          {/* Red saltire, inset inside the white */}
          <Line x1={0} y1={0} x2={W} y2={H} stroke="#C8102E" strokeWidth={2.4} />
          <Line x1={W} y1={0} x2={0} y2={H} stroke="#C8102E" strokeWidth={2.4} />
          {/* White cross, then red cross inside it */}
          <Rect x={0} y={H / 2 - 3.6} width={W} height={7.2} fill="#FFFFFF" />
          <Rect x={W / 2 - 3.6} y={0} width={7.2} height={H} fill="#FFFFFF" />
          <Rect x={0} y={H / 2 - 2} width={W} height={4} fill="#C8102E" />
          <Rect x={W / 2 - 2} y={0} width={4} height={H} fill="#C8102E" />
        </Svg>
      );

    /* Russia — white / blue / red bands. */
    case "ru":
      return (
        <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <Rect x={0} y={0} width={W} height={H / 3} fill="#FFFFFF" />
          <Rect x={0} y={H / 3} width={W} height={H / 3} fill="#0039A6" />
          <Rect x={0} y={(H / 3) * 2} width={W} height={H / 3} fill="#D52B1E" />
        </Svg>
      );

    /* Spain — red / yellow / red, 1:2:1. */
    case "es":
    default:
      return (
        <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <Rect x={0} y={0} width={W} height={H / 4} fill="#AA151B" />
          <Rect x={0} y={H / 4} width={W} height={H / 2} fill="#F1BF00" />
          <Rect x={0} y={(H / 4) * 3} width={W} height={H / 4} fill="#AA151B" />
        </Svg>
      );
  }
}

/**
 * The flag plus its frame.
 *
 * `overflow: "hidden"` on a plain View does the rounding instead of an SVG
 * `clipPath`, which react-native-svg implements differently per platform. The
 * hairline is not decoration — the white band of the Russian flag is invisible
 * against a white row without it.
 */
export function OnboardingFlag({
  code,
  borderColor,
}: {
  code: string;
  borderColor: string;
}) {
  const resolved: FlagCode =
    code === "ku" || code === "ar" || code === "en" || code === "ru" || code === "es"
      ? code
      : "en";

  return (
    <View style={[styles.frame, { borderColor }]}>
      <FlagArt code={resolved} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: W,
    height: H,
    borderRadius: 5,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
});
