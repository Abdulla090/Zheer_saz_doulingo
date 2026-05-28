/**
 * Path lesson icons — lucide-react-native glyphs with explicit colors.
 * Avoids nested custom SVGs that break on Android inside path buttons.
 */
import {
  BookOpen,
  Gamepad2,
  Headphones,
  MessageCircle,
  Mic,
  Sparkles,
  Trophy,
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
  /** Slightly bolder strokes for the active (current) lesson node */
  active?: boolean;
};

export function LessonPathIcon({ type, color, size = 28, active = false }: Props) {
  const strokeWidth = active ? 2.65 : 2.35;
  const common = { color, size, strokeWidth };

  switch (type) {
    case "practice":
      return <Sparkles {...common} fill={`${color}33`} />;
    case "cup":
      return <Trophy {...common} fill={`${color}44`} />;
    case "video":
      return <Video {...common} fill={`${color}22`} />;
    case "reading":
      return <BookOpen {...common} fill={`${color}18`} />;
    case "listening":
      return <Headphones {...common} />;
    case "game":
      return <Gamepad2 {...common} fill={`${color}22`} />;
    case "speaking":
      return <Mic {...common} fill={`${color}28`} />;
    case "conversation":
      return <MessageCircle {...common} fill={`${color}22`} />;
    default:
      return <Sparkles {...common} fill={`${color}33`} />;
  }
}
