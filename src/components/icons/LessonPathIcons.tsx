/**
 * Path lesson icons — Hugeicons glyphs with explicit colors.
 */
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  BookOpen02Icon,
  Gamepad2Icon,
  HeadphonesIcon,
  Message01Icon,
  Mic01Icon,
  SparklesIcon,
  Trophy,
  Video01Icon,
} from "@hugeicons/core-free-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

export type LessonPathIconType =
  | "practice"
  | "video"
  | "reading"
  | "listening"
  | "game"
  | "speaking"
  | "conversation"
  | "cup";

type Props = {
  type: LessonPathIconType;
  color: string;
  size?: number;
  /** Slightly bolder strokes for the active (current) lesson node */
  active?: boolean;
  /** Fill closed Hugeicons shapes for a bolder, solid treatment. */
  filled?: boolean;
  /** Rounded duotone treatment: soft fill under a crisp primary stroke. */
  duotone?: boolean;
};

export function LessonPathIcon({
  type,
  color,
  size = 28,
  active = false,
  filled = false,
  duotone = true,
}: Props) {
  const strokeWidth = filled ? 2.75 : active ? 2.65 : 2.35;
  let icon = SparklesIcon;

  switch (type) {
    case "practice":
      icon = SparklesIcon;
      break;
    case "cup":
      icon = Trophy;
      break;
    case "video":
      icon = Video01Icon;
      break;
    case "reading":
      icon = BookOpen02Icon;
      break;
    case "listening":
      icon = HeadphonesIcon;
      break;
    case "game":
      icon = Gamepad2Icon;
      break;
    case "speaking":
      icon = Mic01Icon;
      break;
    case "conversation":
      icon = Message01Icon;
      break;
    default:
      icon = SparklesIcon;
  }

  if (duotone) {
    return (
      <View style={{ width: size, height: size }}>
        <HugeiconsIcon
          icon={icon}
          color={color}
          fill={color}
          opacity={0.22}
          size={size}
          strokeWidth={0}
          style={StyleSheet.absoluteFill}
        />
        <HugeiconsIcon
          icon={icon}
          color={color}
          fill="none"
          size={size}
          strokeWidth={active ? 2.65 : 2.35}
          style={StyleSheet.absoluteFill}
        />
      </View>
    );
  }

  return (
    <HugeiconsIcon
      icon={icon}
      color={color}
      fill={filled ? color : "none"}
      size={size}
      strokeWidth={strokeWidth}
    />
  );
}
