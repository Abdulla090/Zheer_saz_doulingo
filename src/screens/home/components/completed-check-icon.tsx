import { CheckCircle2 } from "lucide-react-native";
import React from "react";

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
  const size = Math.max(width, height);
  return (
    <CheckCircle2
      size={size}
      color={color}
      strokeWidth={2.4}
      fill={`${color}33`}
    />
  );
}
