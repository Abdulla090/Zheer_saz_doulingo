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
      return <HugeiconsIcon icon={SparklesIcon} {...common} />;
    case "cup":
      return <HugeiconsIcon icon={Trophy} {...common} />;
    case "video":
      return <HugeiconsIcon icon={Video01Icon} {...common} />;
    case "reading":
      return <HugeiconsIcon icon={BookOpen02Icon} {...common} />;
    case "listening":
      return <HugeiconsIcon icon={HeadphonesIcon} {...common} />;
    case "game":
      return <HugeiconsIcon icon={Gamepad2Icon} {...common} />;
    case "speaking":
      return <HugeiconsIcon icon={Mic01Icon} {...common} />;
    case "conversation":
      return <HugeiconsIcon icon={Message01Icon} {...common} />;
    default:
      return <HugeiconsIcon icon={SparklesIcon} {...common} />;
  }
}
