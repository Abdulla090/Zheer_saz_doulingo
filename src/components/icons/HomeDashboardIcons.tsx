import React from "react";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";

/** 3D coffee cup for the featured lesson card */
export function CoffeeCupIllustration({
  width = 88,
  height = 88,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 88 88" fill="none">
      <Defs>
        <LinearGradient id="cupGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="1" stopColor="#E2E8F0" />
        </LinearGradient>
        <LinearGradient id="saucerGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#F8FAFC" />
          <Stop offset="1" stopColor="#CBD5E1" />
        </LinearGradient>
      </Defs>
      <Ellipse cx="44" cy="72" rx="30" ry="8" fill="rgba(15,23,42,0.12)" />
      <Ellipse cx="44" cy="70" rx="28" ry="7" fill="url(#saucerGrad)" />
      <Path
        d="M26 38h30c4 0 7 3 7 7v18c0 8-6 14-14 14H33c-8 0-14-6-14-14V45c0-4 3-7 7-7z"
        fill="url(#cupGrad)"
      />
      <Path
        d="M56 42h6c5 0 9 4 9 9s-4 9-9 9h-6"
        stroke="#E2E8F0"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <Ellipse cx="41" cy="40" rx="14" ry="4" fill="#F1F5F9" />
      <Circle cx="58" cy="58" r="9" fill="#D97706" />
      <Circle cx="58" cy="58" r="6" fill="#F59E0B" />
      <Circle cx="55" cy="55" r="2" fill="#FDE68A" />
    </Svg>
  );
}

/** Map-path icon for PATH tab */
export function PathTabIcon({
  size = 24,
  color = "#B4B8C3",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 18c2-4 4-6 8-6s6 2 8 6M4 12c2-3 5-5 8-5s6 2 8 5M4 6c2-2 4-3 8-3s6 1 8 3"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Storefront for SHOP tab */
export function ShopTabIcon({
  size = 24,
  color = "#B4B8C3",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 9l2-5h14l2 5M5 9v11h14V9M9 20v-6h6v6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Rect x="9" y="13" width="6" height="4" rx="1" stroke={color} strokeWidth={2} />
    </Svg>
  );
}
