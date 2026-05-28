import React from "react";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { GameHubSoftIcon } from "./GameHubSoftIcon";

const GLYPH = 34;

function Glyph({ children }: { children: React.ReactNode }) {
  return (
    <Svg width={GLYPH} height={GLYPH} viewBox="0 0 52 52" fill="none">
      {children}
    </Svg>
  );
}

export function OrderWordsGameIcon({ size = 52 }: { size?: number }) {
  return (
    <GameHubSoftIcon faceColor="#4F7DF5" shadowColor="#2B59F3" size={size}>
      <Glyph>
        <Rect x="12" y="14" width="12" height="12" rx="3" fill="#FFFFFF" opacity={0.95} />
        <Rect x="28" y="14" width="12" height="12" rx="3" fill="#FFFFFF" opacity={0.75} />
        <Rect x="12" y="28" width="12" height="12" rx="3" fill="#FFFFFF" opacity={0.75} />
        <Rect x="28" y="28" width="12" height="12" rx="3" fill="#FFFFFF" opacity={0.55} />
      </Glyph>
    </GameHubSoftIcon>
  );
}

export function PairWordsGameIcon({ size = 52 }: { size?: number }) {
  return (
    <GameHubSoftIcon faceColor="#34D399" shadowColor="#059669" size={size}>
      <Glyph>
        <Circle cx="26" cy="28" r="12" fill="#FFFFFF" opacity={0.9} />
        <Circle cx="30" cy="24" r="2.5" fill="#1A2B48" />
        <Path
          d="M16 30c2-4 6-6 10-6 3 0 6 1 8 3"
          stroke="#2B59F3"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <Circle cx="38" cy="18" r="5" fill="#FBBF24" />
      </Glyph>
    </GameHubSoftIcon>
  );
}

export function ListenUpGameIcon({ size = 52 }: { size?: number }) {
  return (
    <GameHubSoftIcon faceColor="#DDD6FE" shadowColor="#7C3AED" size={size}>
      <Glyph>
        <Path
          d="M16 26v-6a10 10 0 0120 0v6M16 26a4 4 0 004 4v3a4 4 0 01-8 0v-7zm20 0a4 4 0 01-4 4v3a4 4 0 004-4v-7z"
          stroke="#7C3AED"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </Glyph>
    </GameHubSoftIcon>
  );
}

export function SpeakUpGameIcon({ size = 52 }: { size?: number }) {
  return (
    <GameHubSoftIcon faceColor="#DDD6FE" shadowColor="#7C3AED" size={size}>
      <Glyph>
        <Rect x="20" y="14" width="12" height="18" rx="6" fill="#7C3AED" />
        <Path
          d="M16 32h20M26 32v6"
          stroke="#7C3AED"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <Path d="M22 38h8" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" />
      </Glyph>
    </GameHubSoftIcon>
  );
}

export function AiTeacherGameIcon({ size = 52 }: { size?: number }) {
  return (
    <GameHubSoftIcon faceColor="#FDE68A" shadowColor="#F59E0B" size={size}>
      <Glyph>
        <Rect x="14" y="12" width="24" height="28" rx="4" fill="#FFFFFF" />
        <Rect x="18" y="16" width="16" height="3" rx="1.5" fill="#F59E0B" />
        <Rect x="18" y="22" width="12" height="2" rx="1" fill="#FCD34D" />
        <Rect x="18" y="27" width="14" height="2" rx="1" fill="#FCD34D" />
        <Circle cx="36" cy="36" r="10" fill="#2B59F3" />
        <Path
          d="M33 36l2 2 5-6"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Glyph>
    </GameHubSoftIcon>
  );
}

export function RolePlayGameIcon({ size = 52 }: { size?: number }) {
  return (
    <GameHubSoftIcon faceColor="#93C5FD" shadowColor="#2B59F3" size={size}>
      <Glyph>
        <Path
          d="M14 30c0-6 4-10 12-10s12 4 12 10"
          stroke="#1E40AF"
          strokeWidth="2"
          fill="none"
        />
        <Circle cx="20" cy="22" r="3" fill="#1E40AF" />
        <Circle cx="32" cy="22" r="3" fill="#3B82F6" />
        <Rect x="12" y="32" width="28" height="8" rx="4" fill="#1E40AF" opacity={0.15} />
      </Glyph>
    </GameHubSoftIcon>
  );
}
