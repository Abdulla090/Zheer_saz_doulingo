import { HugeiconsIcon } from "@hugeicons/react-native";
import { Tick01Icon } from "@hugeicons/core-free-icons";
import React from "react";

/** Clean checkmark used to identify a completed path node. */
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
      icon={Tick01Icon}
      size={size}
      color={color}
      strokeWidth={3.2}
    />
  );
}
