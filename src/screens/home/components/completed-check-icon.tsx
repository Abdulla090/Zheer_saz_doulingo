import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

/** White checkmark used inside completed gold lesson nodes. */
export function CompletedCheckIcon({
  width = 32,
  height = 32,
  color = "#FFFFFF",
}: {
  width?: number;
  height?: number;
  color?: string;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24">
      <Circle
        cx={12}
        cy={12}
        r={9}
        fill="none"
        stroke={color}
        strokeWidth={2.2}
      />
      <Path
        d="M8 12.2l2.6 2.6L16 9.4"
        fill="none"
        stroke={color}
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
