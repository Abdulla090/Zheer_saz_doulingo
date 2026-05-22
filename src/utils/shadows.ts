/**
 * Cross-platform shadow utility for React Native 0.83+ (Expo SDK 55+)
 * Uses `boxShadow` on web (New Architecture) and legacy shadow* props on native.
 * This eliminates the "shadow* style props are deprecated" console warning on web.
 */
import { Platform, ViewStyle, TextStyle } from "react-native";

type ShadowParams = {
  color?: string;
  offsetX?: number;
  offsetY?: number;
  blur?: number;
  spread?: number;
  opacity?: number;
  elevation?: number;
};

/**
 * Returns a cross-platform shadow style.
 * On web: uses `boxShadow` string.
 * On native: uses the standard shadow* props + elevation.
 */
export function crossShadow({
  color = "#000",
  offsetX = 0,
  offsetY = 4,
  blur = 12,
  spread = 0,
  opacity = 0.1,
  elevation = 4,
}: ShadowParams = {}): ViewStyle {
  if (Platform.OS === "web") {
    // Parse hex color and apply opacity
    const rgba = hexToRgba(color, opacity);
    return {
      boxShadow: `${offsetX}px ${offsetY}px ${blur}px ${spread}px ${rgba}`,
    } as any;
  }
  return {
    shadowColor: color,
    shadowOffset: { width: offsetX, height: offsetY },
    shadowOpacity: opacity,
    shadowRadius: blur,
    elevation,
  };
}

/**
 * Returns a cross-platform text shadow style.
 * On web: uses `textShadow` string.
 * On native: uses textShadow* props.
 */
export function crossTextShadow({
  color = "rgba(0,0,0,0.2)",
  offsetX = 0,
  offsetY = 1,
  blur = 2,
}: {
  color?: string;
  offsetX?: number;
  offsetY?: number;
  blur?: number;
} = {}): TextStyle {
  if (Platform.OS === "web") {
    return {
      textShadow: `${offsetX}px ${offsetY}px ${blur}px ${color}`,
    } as any;
  }
  return {
    textShadowColor: color,
    textShadowOffset: { width: offsetX, height: offsetY },
    textShadowRadius: blur,
  };
}

function hexToRgba(hex: string, opacity: number): string {
  // Already rgba/rgb? Just return
  if (hex.startsWith("rgb")) return hex;
  // Handle shorthand
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r},${g},${b},${opacity})`;
}
