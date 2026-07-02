import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    background: '#FFFFFF',
    foreground: '#0F172A',
    card: '#FFFFFF',
    cardBorder: '#E2E8F0',
    primary: '#FF6B4A',
    primaryGlow: 'rgba(255, 107, 74, 0.2)',
    secondary: '#3B82F6',
    muted: '#F8FAFC',
    mutedForeground: '#64748B',
    border: '#E2E8F0',
    success: '#10B981',
    successBg: '#D1FAE5',
    error: '#EF4444',
  },
  dark: {
    background: '#0F172A',
    foreground: '#FFFFFF',
    card: 'rgba(255, 255, 255, 0.05)',
    cardBorder: 'rgba(255, 255, 255, 0.1)',
    primary: '#FF6B4A',
    primaryGlow: 'rgba(255, 107, 74, 0.4)',
    secondary: '#3B82F6',
    muted: 'rgba(255, 255, 255, 0.05)',
    mutedForeground: '#94A3B8',
    border: 'rgba(255, 255, 255, 0.1)',
    success: '#10B981',
    successBg: 'rgba(16, 185, 129, 0.2)',
    error: '#EF4444',
  },
} as const;

export type ThemeColorName = keyof typeof Colors.light;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
