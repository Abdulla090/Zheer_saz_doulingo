import { HugeiconsIcon } from "@hugeicons/react-native";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
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
    <HugeiconsIcon
      icon={CheckmarkCircle02Icon}
      size={size}
      color={color}
      strokeWidth={2.4}
    />
  );
}
