import React from "react";
import Svg, {
  Circle,
  Ellipse,
  Path,
  Rect,
} from "react-native-svg";

/** Flat 2D coffee cup for lesson card */
export function CoffeeCupFlat({
  width = 80,
  height = 80,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 80 80" fill="none">
      <Ellipse cx="40" cy="68" rx="26" ry="6" fill="#E2E8F0" />
      <Rect x="22" y="28" width="32" height="36" rx="6" fill="#FFFFFF" />
      <Path
        d="M54 32h8c4 0 7 3 7 7v10c0 4-3 7-7 7h-8"
        stroke="#FFFFFF"
        strokeWidth="3"
        fill="none"
      />
      <Rect x="26" y="24" width="24" height="8" rx="4" fill="#F1F5F9" />
      <Circle cx="58" cy="52" r="8" fill="#F59E0B" />
      <Circle cx="58" cy="52" r="5" fill="#FBBF24" />
    </Svg>
  );
}

/** Flat dolphin mascot */
export function DolphinFlat({
  width = 72,
  height = 72,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 72 72" fill="none">
      <Ellipse cx="36" cy="38" rx="28" ry="22" fill="#4FA3F7" />
      <Path
        d="M12 40c8-6 18-8 28-6 6 1 12 4 16 8-6 2-12 2-18 0-4-1-8-1-12 0-4 2-9 0-14-2z"
        fill="#2B59F3"
      />
      <Circle cx="48" cy="30" r="3" fill="#1A2B48" />
      <Circle cx="49" cy="29" r="1" fill="#FFFFFF" />
      <Path
        d="M54 22l10-6v12l-10-4c-2-1-4-1-6 0z"
        fill="#2B59F3"
      />
      <Path
        d="M8 44c4 4 8 6 14 6"
        stroke="#2B59F3"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Flat wooden chest */
export function ChestFlat({
  width = 64,
  height = 64,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 64 64" fill="none">
      <Rect x="10" y="24" width="44" height="28" rx="4" fill="#B45309" />
      <Rect x="10" y="18" width="44" height="10" rx="3" fill="#D97706" />
      <Rect x="28" y="30" width="8" height="10" rx="2" fill="#FCD34D" />
      <Rect x="12" y="26" width="40" height="3" fill="#92400E" />
    </Svg>
  );
}

export function QuestZapFlat({ size = 40 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Circle cx="20" cy="20" r="20" fill="#FEF3C7" />
      <Path
        d="M22 10l-8 12h6l-2 8 10-14h-6l2-6z"
        fill="#F59E0B"
      />
    </Svg>
  );
}

export function QuestHeadphonesFlat({ size = 40 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Circle cx="20" cy="20" r="20" fill="#EDE9FE" />
      <Path
        d="M12 22v-4a8 8 0 0116 0v4M12 22a3 3 0 003 3v2a3 3 0 01-3-3v-5zm16 0a3 3 0 01-3 3v2a3 3 0 003-3v-5z"
        stroke="#7C3AED"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function QuestTargetFlat({ size = 40 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Circle cx="20" cy="20" r="20" fill="#CCFBF1" />
      <Circle cx="20" cy="20" r="10" stroke="#14B8A6" strokeWidth="2" fill="none" />
      <Circle cx="20" cy="20" r="4" fill="#14B8A6" />
    </Svg>
  );
}

export function PathTabIcon({
  size = 24,
  color = "#9CA3AF",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 17c3-5 6-7 8-7s5 2 8 7M4 12c3-4 6-6 8-6s5 2 8 6M4 7c3-3 6-5 8-5s5 2 8 5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function ShopTabIcon({
  size = 24,
  color = "#9CA3AF",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 9h16l-1 11H5L4 9zM6 9l1-4h10l1 4"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Path d="M9 13h6" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function GamesTabIcon({
  size = 24,
  color = "#9CA3AF",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="8" width="16" height="10" rx="4" stroke={color} strokeWidth={2} />
      <Path d="M9 11v4M8 13h2M15 12h2M16 11v4" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function HomeTabIconFlat({
  size = 24,
  color = "#2B59F3",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 10.5L12 4l8 6.5V19a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1v-8.5z"
        fill={color}
      />
    </Svg>
  );
}

export function ProfileTabIconFlat({
  size = 24,
  color = "#9CA3AF",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="9" r="4" stroke={color} strokeWidth={2} />
      <Path
        d="M5 20c0-4 3-6 7-6s7 2 7 6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}
