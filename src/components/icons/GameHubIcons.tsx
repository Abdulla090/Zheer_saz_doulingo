import { HomePalette } from "@/components/ui/ios-liquid-home";
import { crossShadow } from "@/utils/shadows";
import {
  Bot,
  Link2,
  ListOrdered,
  MessagesSquare,
  Mic,
  Sparkles,
} from "lucide-react-native";
import React from "react";
import { View, type ViewStyle } from "react-native";

const C = HomePalette;

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
    <GameIconTile size={size} backgroundColor="#DBEAFE">
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
    <GameIconTile size={size} backgroundColor="#EEF2FF">
      <ListOrdered size={glyph} color={C.blue} strokeWidth={2.1} />
    </GameIconTile>
  );
}

export function PairWordsGameIcon({ size = 60 }: GameIconProps) {
  const glyph = Math.round(size * 0.48);
  return (
    <GameIconTile size={size} backgroundColor="#D1FAE5">
      <Link2 size={glyph} color="#059669" strokeWidth={2.1} />
    </GameIconTile>
  );
}

export function SpeakUpGameIcon({ size = 60 }: GameIconProps) {
  const glyph = Math.round(size * 0.48);
  return (
    <GameIconTile size={size} backgroundColor="#EDE9FE">
      <Mic size={glyph} color="#7C3AED" strokeWidth={2.1} fill="#7C3AED22" />
    </GameIconTile>
  );
}

export function AiTeacherGameIcon({ size = 60 }: GameIconProps) {
  const glyph = Math.round(size * 0.48);
  return (
    <GameIconTile size={size} backgroundColor="#FEF3C7">
      <Bot size={glyph} color="#D97706" strokeWidth={2.1} fill="#D9770618" />
    </GameIconTile>
  );
}

export function VoiceTutorGameIcon({ size = 64 }: GameIconProps) {
  const glyph = Math.round(size * 0.48);
  return (
    <GameIconTile
      size={size}
      backgroundColor="#E0E7FF"
      style={crossShadow({
        color: C.blue,
        offsetY: 6,
        blur: 14,
        opacity: 0.12,
        elevation: 4,
      })}
    >
      <Sparkles size={glyph} color={C.blue} strokeWidth={2.1} fill={`${C.blue}18`} />
    </GameIconTile>
  );
}

/** @deprecated Use SpeakUpGameIcon */
export const ListenUpGameIcon = SpeakUpGameIcon;
