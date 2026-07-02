import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  RobotIcon,
  BookOpen02Icon,
  HeadphonesIcon,
  Link02Icon,
  Sorting01Icon,
  Comment02Icon,
  Mic01Icon,
  RadioIcon,
} from "@hugeicons/core-free-icons";
import React from "react";
import { View, type ViewStyle } from "react-native";

// Safely map Tailwind colors from HTML
const Colors = {
  primary: "#FF6B4A",
  secondary: "#0066FF",
  foreground: "#0F172A",
  mutedForeground: "#64748B",
};

type GameIconProps = {
  size?: number;
};

function GameIconTile({
  size,
  children,
  style,
}: {
  size: number;
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function RolePlayGameIcon({ size = 64 }: GameIconProps) {
  const glyph = Math.round(size * 0.75);
  return (
    <GameIconTile size={size}>
      <HugeiconsIcon icon={Comment02Icon} size={glyph} color={Colors.secondary} strokeWidth={2.5} />
    </GameIconTile>
  );
}

export function OrderWordsGameIcon({ size = 60 }: GameIconProps) {
  const glyph = Math.round(size * 0.75);
  return (
    <GameIconTile size={size}>
      <HugeiconsIcon icon={Sorting01Icon} size={glyph} color={Colors.primary} strokeWidth={2.5} />
    </GameIconTile>
  );
}

export function PairWordsGameIcon({ size = 60 }: GameIconProps) {
  const glyph = Math.round(size * 0.75);
  return (
    <GameIconTile size={size}>
      <HugeiconsIcon icon={Link02Icon} size={glyph} color={Colors.secondary} strokeWidth={2.5} />
    </GameIconTile>
  );
}

export function SpeakUpGameIcon({ size = 60 }: GameIconProps) {
  const glyph = Math.round(size * 0.75);
  return (
    <GameIconTile size={size}>
      <HugeiconsIcon icon={Mic01Icon} size={glyph} color={Colors.primary} strokeWidth={2.5} />
    </GameIconTile>
  );
}

export function AiTeacherGameIcon({ size = 60 }: GameIconProps) {
  const glyph = Math.round(size * 0.75);
  return (
    <GameIconTile size={size}>
      <HugeiconsIcon icon={RobotIcon} size={glyph} color={Colors.foreground} strokeWidth={2.5} />
    </GameIconTile>
  );
}

export function VoiceTutorGameIcon({ size = 64 }: GameIconProps) {
  const glyph = Math.round(size * 0.75);
  return (
    <GameIconTile size={size}>
      <HugeiconsIcon icon={RadioIcon} size={glyph} color="#FFFFFF" strokeWidth={2.5} />
    </GameIconTile>
  );
}

export function SlangDictionaryGameIcon({ size = 64 }: GameIconProps) {
  const glyph = Math.round(size * 0.75);
  return (
    <GameIconTile size={size}>
      <HugeiconsIcon icon={BookOpen02Icon} size={glyph} color={Colors.secondary} strokeWidth={2.5} />
    </GameIconTile>
  );
}

export function PodcastGameIcon({ size = 52 }: GameIconProps) {
  const glyph = Math.round(size * 0.75);
  return (
    <GameIconTile size={size}>
      <HugeiconsIcon icon={HeadphonesIcon} size={glyph} color={Colors.primary} strokeWidth={2.5} />
    </GameIconTile>
  );
}

/** @deprecated Use SpeakUpGameIcon */
export const ListenUpGameIcon = SpeakUpGameIcon;
