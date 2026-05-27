/**
 * Path lesson icons — explicit colors, no nested Svg in SvgButton.
 * Imported lesson SVGs lack stroke/fill and break inside parent <Svg> on Android.
 */
import {
  BookOpen,
  Dumbbell,
  Gamepad2,
  Headphones,
  Mic,
  Star,
  Video,
} from "lucide-react-native";
import React from "react";

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
};

export function LessonPathIcon({ type, color, size = 28 }: Props) {
  const strokeWidth = 2.4;
  const common = { color, size, strokeWidth };

  switch (type) {
    case "practice":
    case "cup":
      return <Star {...common} fill={color} />;
    case "video":
      return <Video {...common} />;
    case "reading":
      return <BookOpen {...common} />;
    case "listening":
      return <Headphones {...common} />;
    case "game":
      return <Gamepad2 {...common} />;
    case "speaking":
      return <Mic {...common} />;
    case "conversation":
      return <Dumbbell {...common} />;
    default:
      return <Star {...common} fill={color} />;
  }
}
