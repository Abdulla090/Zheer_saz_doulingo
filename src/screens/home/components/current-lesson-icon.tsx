import React from "react";
import { View } from "react-native";

type CurrentLessonIconProps = {
  children?: React.ReactNode;
};

/** Static wrapper for the active path icon (no bounce animation). */
export function CurrentLessonIcon({ children }: CurrentLessonIconProps) {
  return <View>{children}</View>;
}
