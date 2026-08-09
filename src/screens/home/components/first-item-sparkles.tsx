import React from "react";
import { View } from "react-native";
import Svg, { G, Path } from "react-native-svg";

import { FX_ALLOW_DECORATION } from "../../../utils/native-perf";

const SPARKLE_COLOR = "rgba(255, 232, 166, 0.85)";

const SPARKLES = [
  { left: 42, top: 10, size: 14, path: "M7 1L8.5 4.7L12.2 6.2L8.5 7.7L7 11.4L5.5 7.7L1.8 6.2L5.5 4.7Z" },
  { left: 54, top: 42, size: 12, path: "M6 0.9L7.3 4L10.4 5.3L7.3 6.6L6 9.7L4.7 6.6L1.6 5.3L4.7 4Z" },
  { left: 62, top: 26, size: 9, path: "M4.5 0.6L5.5 2.9L7.8 3.9L5.5 4.9L4.5 7.2L3.5 4.9L1.2 3.9L3.5 2.9Z" },
] as const;

/**
 * Static sparkle accents — no looping animation for scroll performance.
 *
 * One `Svg` holding three translated paths rather than three positioned `Svg`s:
 * each `Svg` is a native view with its own canvas, and the sparkles carry no
 * layout of their own to justify that. Skipped outright on older hardware, where
 * the first row's decoration is not worth the extra surface.
 */
export const FirstItemSparkles = ({ size }: { size: number }) => {
  if (!FX_ALLOW_DECORATION) return null;

  return (
    <View
      style={{
        pointerEvents: "none" as any,
        position: "absolute",
        left: 0,
        top: 0,
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: "hidden",
        zIndex: 3,
      }}
    >
      <Svg width={size} height={size}>
        {SPARKLES.map((sparkle) => (
          <G
            key={`${sparkle.left}-${sparkle.top}`}
            transform={`translate(${sparkle.left} ${sparkle.top})`}
          >
            <Path d={sparkle.path} fill={SPARKLE_COLOR} />
          </G>
        ))}
      </Svg>
    </View>
  );
};
