import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    background: '#F7F5F0',
    foreground: '#0F172A',
    card: '#EFF1F4',
    surface: '#EFF1F4',
    surfaceRaised: '#FCFBF8',
    cardBorder: '#DCE1E7',
    primary: '#FF6B4A',
    onPrimary: '#FFFFFF',
    primaryGlow: 'rgba(255, 107, 74, 0.2)',
    secondary: '#3B82F6',
    muted: '#E7EAEE',
    mutedForeground: '#64748B',
    border: '#DCE1E7',
    success: '#10B981',
    successBg: '#D1FAE5',
    warning: '#D97706',
    warningBg: '#FFF7ED',
    error: '#EF4444',
  },
  dark: {
    background: '#10161C',
    foreground: '#F5F7FA',
    card: '#161D24',
    surface: '#161D24',
    surfaceRaised: '#1B232C',
    cardBorder: '#27313B',
    primary: '#FF6B4A',
    onPrimary: '#FFFFFF',
    primaryGlow: 'rgba(255, 107, 74, 0.4)',
    secondary: '#3B82F6',
    muted: '#202832',
    mutedForeground: '#A1A9B4',
    border: '#27313B',
    success: '#10B981',
    successBg: 'rgba(16, 185, 129, 0.2)',
    warning: '#FBBF24',
    warningBg: 'rgba(251, 191, 36, 0.12)',
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
