import React from "react";
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";

type IconProps = { size?: number; color?: string };

/**
 * Premium Lowercase rounded geometric Wordmark "phingo"
 */
export function PhingoWordmark({ height = 28 }: { height?: number }) {
  const w = height * 4.2; // Adjusted ratio for lowercase spacing
  return (
    <Svg width={w} height={height} viewBox="0 0 168 40" fill="none">
      <Defs>
        <LinearGradient id="phingoGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#3B9EFF" />
          <Stop offset="1" stopColor="#208AEF" />
        </LinearGradient>
      </Defs>
      {/* p */}
      <Path d="M12 14v18" stroke="url(#phingoGrad)" strokeWidth={4.5} strokeLinecap="round" />
      <Circle cx="21" cy="23" r="7" stroke="url(#phingoGrad)" strokeWidth={4.5} />

      {/* h */}
      <Path d="M38 6v26" stroke="url(#phingoGrad)" strokeWidth={4.5} strokeLinecap="round" />
      <Path d="M38 20c2-4.5 9-4.5 12 0v12" stroke="url(#phingoGrad)" strokeWidth={4.5} strokeLinecap="round" />

      {/* i */}
      <Path d="M62 14v18" stroke="url(#phingoGrad)" strokeWidth={4.5} strokeLinecap="round" />
      <Circle cx="62" cy="7" r="2.5" fill="url(#phingoGrad)" />

      {/* n */}
      <Path d="M78 14v18" stroke="url(#phingoGrad)" strokeWidth={4.5} strokeLinecap="round" />
      <Path d="M78 20c2-4.5 9-4.5 12 0v12" stroke="url(#phingoGrad)" strokeWidth={4.5} strokeLinecap="round" />

      {/* g */}
      <Circle cx="106" cy="21" r="7" stroke="url(#phingoGrad)" strokeWidth={4.5} />
      <Path d="M113 21v9c0 4-3 7-7.5 7h-2.5" stroke="url(#phingoGrad)" strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />

      {/* o */}
      <Circle cx="129" cy="23" r="7" stroke="url(#phingoGrad)" strokeWidth={4.5} />
    </Svg>
  );
}

/**
 * Minimal settings tune slider icon matching the mockup
 */
export function SettingsTuneIcon({ size = 24, color = "#475569" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Top track + circle */}
      <Path
        d="M4 8h10M18 8h2"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Circle cx="16" cy="8" r="2" stroke={color} strokeWidth={2} fill="#FFFFFF" />

      {/* Bottom track + circle */}
      <Path
        d="M4 16h2M10 16h10"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Circle cx="8" cy="16" r="2" stroke={color} strokeWidth={2} fill="#FFFFFF" />
    </Svg>
  );
}

/**
 * 5-bar voice waveform icon for the CTA button
 */
export function WaveformIcon({ size = 20, color = "#FFFFFF" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="9" width="2.5" height="6" rx="1.25" fill={color} />
      <Rect x="7" y="5" width="2.5" height="14" rx="1.25" fill={color} />
      <Rect x="12" y="2" width="2.5" height="20" rx="1.25" fill={color} />
      <Rect x="17" y="5" width="2.5" height="14" rx="1.25" fill={color} />
      <Rect x="22" y="9" width="2.5" height="6" rx="1.25" fill={color} />
    </Svg>
  );
}

export function MicPulseIcon({ size = 22, color = "#2563EB" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="9" y="3" width="6" height="11" rx="3" stroke={color} strokeWidth={1.75} />
      <Path d="M6 11a6 6 0 0012 0M12 17v3" stroke={color} strokeWidth={1.75} strokeLinecap="round" />
    </Svg>
  );
}

/**
 * Suggested card background ring
 */
export function HeroAuraRing({ size = 280 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 280 280">
      <Defs>
        <LinearGradient id="aura" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#EAF2FD" stopOpacity={0.95} />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0.05} />
        </LinearGradient>
      </Defs>
      <Circle cx="140" cy="140" r="132" fill="url(#aura)" />
      <Circle cx="140" cy="140" r="118" fill="none" stroke="#FFFFFF" strokeWidth={1.5} opacity={0.8} />
      <Circle cx="140" cy="140" r="100" fill="none" stroke="#93C5FD" strokeWidth={1} opacity={0.25} />
    </Svg>
  );
}

/**
 * Card 1: Practice Speaking Wave Box
 */
export function CardWaveMini({ size = 36, color = "#208AEF" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <Rect x="0" y="0" width="36" height="36" rx="12" fill="#F0F7FF" />
      <Rect x="8" y="14" width="2.5" height="8" rx="1.25" fill={color} />
      <Rect x="13" y="11" width="2.5" height="14" rx="1.25" fill={color} />
      <Rect x="18" y="8" width="2.5" height="20" rx="1.25" fill={color} />
      <Rect x="23" y="11" width="2.5" height="14" rx="1.25" fill={color} />
      <Rect x="28" y="14" width="2.5" height="8" rx="1.25" fill={color} />
    </Svg>
  );
}

/**
 * Card 2: Travel Essentials Airplane Box
 */
export function AirplaneIcon({ size = 36, color = "#208AEF" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <Rect x="0" y="0" width="36" height="36" rx="12" fill="#F0F7FF" />
      <Path
        d="M23.5 12.5l-6.8 6.8-2.5-.6a0.8 0.8 0 00-.9.4l-.8 1.2 3.2 1.8 1.1 3.2.9-.6a0.8 0.8 0 00.3-.9l-.6-2.5 6.8-6.8a1 1 0 000-1.4v0a1 1 0 00-1.4 0z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M11 25l3.5-3.5" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

/**
 * Card 3: Vocabulary Today Notebook Box
 */
export function BookSparkIcon({ size = 36, color = "#208AEF" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <Rect x="0" y="0" width="36" height="36" rx="12" fill="#F0F7FF" />
      <Rect x="11" y="9" width="14" height="18" rx="2" stroke={color} strokeWidth={1.8} />
      <Path d="M9 13h4M9 18h4M9 23h4" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Circle cx="21" cy="20" r="2.2" fill="#EAB308" />
    </Svg>
  );
}
