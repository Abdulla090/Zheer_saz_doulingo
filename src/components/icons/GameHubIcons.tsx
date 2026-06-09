import { HomePalette } from "../ui/ios-liquid-home";
import {
  Bot,
  BookOpen,
  Headphones,
  Link2,
  ListOrdered,
  MessagesSquare,
  Mic,
  Radio,
} from "lucide-react-native";
import React from "react";
import { View, type ViewStyle } from "react-native";

const C = HomePalette;

/** Brand-consistent icon wells — avoid per-card rainbow fills */
const TILE_BLUE = "#E8F0FE";
const TILE_NAVY = "#EEF2F6";

type GameIconProps = {
  size?: number;
};

function GameIconTile({
  size,
  backgroundColor,
  children,
  style,
}: {
  size: number;
  backgroundColor: string;
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.28),
          backgroundColor,
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
  const glyph = Math.round(size * 0.48);
  return (
    <GameIconTile size={size} backgroundColor={TILE_BLUE}>
      <MessagesSquare
        size={glyph}
        color={C.blue}
        strokeWidth={2.1}
        fill={`${C.blue}18`}
      />
    </GameIconTile>
  );
}

export function OrderWordsGameIcon({ size = 60 }: GameIconProps) {
  const glyph = Math.round(size * 0.48);
  return (
    <GameIconTile size={size} backgroundColor={TILE_NAVY}>
      <ListOrdered size={glyph} color={C.blue} strokeWidth={2.1} />
    </GameIconTile>
  );
}

export function PairWordsGameIcon({ size = 60 }: GameIconProps) {
  const glyph = Math.round(size * 0.48);
  return (
    <GameIconTile size={size} backgroundColor={TILE_BLUE}>
      <Link2 size={glyph} color={C.blue} strokeWidth={2.1} />
    </GameIconTile>
  );
}

export function SpeakUpGameIcon({ size = 60 }: GameIconProps) {
  const glyph = Math.round(size * 0.48);
  return (
    <GameIconTile size={size} backgroundColor={TILE_BLUE}>
      <Mic size={glyph} color={C.blue} strokeWidth={2.1} fill={`${C.blue}18`} />
    </GameIconTile>
  );
}

export function AiTeacherGameIcon({ size = 60 }: GameIconProps) {
  const glyph = Math.round(size * 0.48);
  return (
    <GameIconTile size={size} backgroundColor={TILE_NAVY}>
      <Bot size={glyph} color={C.navy} strokeWidth={2.1} fill={`${C.navy}14`} />
    </GameIconTile>
  );
}

export function VoiceTutorGameIcon({ size = 64 }: GameIconProps) {
  const glyph = Math.round(size * 0.48);
  return (
    <GameIconTile
      size={size}
      backgroundColor={TILE_BLUE}
    >
      <Radio size={glyph} color={C.blue} strokeWidth={2.1} fill={`${C.blue}18`} />
    </GameIconTile>
  );
}

export function SlangDictionaryGameIcon({ size = 64 }: GameIconProps) {
  const glyph = Math.round(size * 0.48);
  return (
    <GameIconTile
      size={size}
      backgroundColor={TILE_NAVY}
    >
      <BookOpen
        size={glyph}
        color={C.navy}
        strokeWidth={2.1}
        fill={`${C.navy}12`}
      />
    </GameIconTile>
  );
}

export function PodcastGameIcon({ size = 52 }: GameIconProps) {
  const glyph = Math.round(size * 0.48);
  return (
    <GameIconTile size={size} backgroundColor={TILE_BLUE}>
      <Headphones size={glyph} color={C.blue} strokeWidth={2.1} />
    </GameIconTile>
  );
}

/** @deprecated Use SpeakUpGameIcon */
export const ListenUpGameIcon = SpeakUpGameIcon;
