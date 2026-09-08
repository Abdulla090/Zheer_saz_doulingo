import React from "react";
import Svg, { Path } from "react-native-svg";

/**
 * Finished lesson checkmark icon matching Duolingo reference.
 * Bold rounded white checkmark with a tactile 3D bottom bevel/shadow.
 */
export function CompletedCheckIcon({
  width = 32,
  height = 32,
  color = "#FFFFFF",
}: {
  width?: number;
  height?: number;
  color?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}) {
  const size = Math.max(width, height);

  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      {/* 3D Depth bevel / shadow underneath the checkmark */}
      <Path
        d="M 7 15.5 L 13 23.5 L 25 11.5"
        fill="none"
        stroke="rgba(0, 0, 0, 0.22)"
        strokeWidth={5.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Crisp rounded white checkmark */}
      <Path
        d="M 7 13.5 L 13 21.5 L 25 9.5"
        fill="none"
        stroke={color}
        strokeWidth={5.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
