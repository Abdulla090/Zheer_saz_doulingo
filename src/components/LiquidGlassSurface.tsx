/**
 * Reusable iOS 27 light liquid glass — backdrop blur + edge shading.
 * Includes iOS 27 adjustable intensity customization support for Web, Android, and iOS.
 */

import { LIQUID_GLASS, liquidFrostBase, liquidGlassShellShadow } from "../constants/liquid-glass";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";

let GlassViewComponent: React.ComponentType<{
  style?: StyleProp<ViewStyle>;
  glassEffectStyle?: string;
  colorScheme?: string;
  isInteractive?: boolean;
}> | null = null;
let isGlassEffectAPIAvailable: () => boolean = () => false;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- optional native module
  const glass = require("expo-glass-effect");
  GlassViewComponent = glass.GlassView;
  isGlassEffectAPIAvailable = glass.isGlassEffectAPIAvailable ?? (() => false);
} catch {
  /* optional native module */
}

function FrostWash({
  borderRadius,
  minimal,
  intensity = 0.5,
  isDark,
}: {
  borderRadius: number;
  minimal?: boolean;
  intensity?: number;
  isDark: boolean;
}) {
  // Scale overlay opacities dynamically based on iOS 27 intensity
  const opacityMultiplier = intensity * 1.2;

  if (minimal) {
    return (
      <>
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius,
              backgroundColor: isDark ? "rgba(15,23,42,0.78)" : LIQUID_GLASS.frostUnderlay,
              opacity: Math.min(1, opacityMultiplier),
              pointerEvents: "none",
            },
          ]}
        />
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius,
              backgroundColor: isDark ? "rgba(255,255,255,0.035)" : LIQUID_GLASS.tintWash,
              opacity: Math.min(1, opacityMultiplier * 0.8),
              pointerEvents: "none",
            },
          ]}
        />
      </>
    );
  }

  const frost = isDark ? "rgba(30,41,59,0.74)" : liquidFrostBase();
  return (
    <>
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius,
            backgroundColor: isDark ? "rgba(15,23,42,0.78)" : LIQUID_GLASS.frostUnderlay,
            opacity: Math.min(1, opacityMultiplier * 0.8),
            pointerEvents: "none",
          },
        ]}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius,
            backgroundColor: frost,
            opacity: Math.min(1, opacityMultiplier),
            pointerEvents: "none",
          },
        ]}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius,
            backgroundColor: isDark ? "rgba(255,255,255,0.035)" : LIQUID_GLASS.tintWash,
            opacity: Math.min(1, opacityMultiplier * 0.9),
            pointerEvents: "none",
          },
        ]}
      />
    </>
  );
}

function WebLiquidBackdrop({
  borderRadius,
  intensity = 0.5,
  isDark,
}: {
  borderRadius: number;
  intensity?: number;
  isDark: boolean;
}) {
  const blurVal = Math.round(12 + intensity * 24); // 12px to 36px blur
  const satVal = Math.round(120 + intensity * 90); // 120% to 210% saturation
  const contrastVal = (0.95 + intensity * 0.18).toFixed(2); // 0.95 to 1.13 contrast
  const opacityVal = (0.22 + intensity * 0.48).toFixed(2); // 0.22 to 0.70 opacity

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          borderRadius,
          overflow: "hidden",
          backgroundColor: isDark
            ? `rgba(15, 23, 42, ${Math.max(0.72, Number(opacityVal))})`
            : `rgba(226, 232, 240, ${opacityVal})`,
          backdropFilter: `blur(${blurVal}px) saturate(${satVal}%) contrast(${contrastVal})`,
          WebkitBackdropFilter: `blur(${blurVal}px) saturate(${satVal}%) contrast(${contrastVal})`,
          pointerEvents: "none",
        } as ViewStyle,
      ]}
    />
  );
}

/**
 * iOS 27 edge shading fallback (web / Android / iOS without GlassView API).
 * High-fidelity specular, Fresnel left/right grazing angles, and lensing bottom shades.
 */
export function LiquidGlassEdgeShading({
  borderRadius,
  intensity = 0.5,
}: {
  borderRadius: number;
  intensity?: number;
}) {
  const r = borderRadius;
  const inset = Math.max(6, r * 0.22);
  const opacityMultiplier = intensity * 1.5;

  return (
    <>
      {/* Layer 1 — overhead specular (WWDC highlights layer) */}
      <LinearGradient
        colors={[...LIQUID_GLASS.edgeSpecular]}
        locations={[0, 0.32, 1]}
        style={[
          styles.specularArc,
          {
            borderTopLeftRadius: r,
            borderTopRightRadius: r,
            opacity: Math.min(1, opacityMultiplier),
          },
        ]}
      />
      {/* Layer 2 — Fresnel left rim */}
      <LinearGradient
        colors={[LIQUID_GLASS.edgeFresnel, "rgba(255,255,255,0)"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[
          styles.fresnelLeft,
          {
            borderTopLeftRadius: r,
            borderBottomLeftRadius: r,
            opacity: Math.min(1, opacityMultiplier * 0.8),
          },
        ]}
      />
      {/* Layer 3 — Fresnel right rim */}
      <LinearGradient
        colors={["rgba(255,255,255,0)", LIQUID_GLASS.edgeFresnel]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[
          styles.fresnelRight,
          {
            borderTopRightRadius: r,
            borderBottomRightRadius: r,
            opacity: Math.min(1, opacityMultiplier * 0.8),
          },
        ]}
      />
      {/* Layer 4 — bottom thickness / lensing shade */}
      <LinearGradient
        colors={["rgba(255,255,255,0)", LIQUID_GLASS.edgeBottomShade]}
        locations={[0.5, 1]}
        style={[
          styles.bottomShade,
          {
            borderBottomLeftRadius: r,
            borderBottomRightRadius: r,
            opacity: Math.min(1, opacityMultiplier),
          },
        ]}
      />
      {/* Layer 5 — top catch light (1px) */}
      <View
        style={[
          styles.topEdgeLine,
          {
            left: inset,
            right: inset,
            backgroundColor: LIQUID_GLASS.edgeTopLine,
            opacity: Math.min(1, opacityMultiplier),
          },
        ]}
      />
      {/* Layer 6 — dual rim (Increased Contrast–style separation) */}
      <View
        style={[
          styles.outerRim,
          {
            borderRadius: r,
            borderColor: LIQUID_GLASS.border,
            opacity: Math.min(1, opacityMultiplier * 0.6),
          },
        ]}
      />
      <View
        style={[
          styles.innerRim,
          {
            borderRadius: Math.max(0, r - 1),
            borderColor: LIQUID_GLASS.borderInner,
            opacity: Math.min(1, opacityMultiplier * 0.8),
          },
        ]}
      />
    </>
  );
}

type Props = {
  children: React.ReactNode;
  borderRadius: number;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  shadowDepth?: "tab" | "button";
  /** false when native GlassView draws system edge shading (iOS 26+) */
  edgeShading?: boolean;
  /** iOS 27 Liquid Glass slider adjustment (0.0 to 1.0, default 0.5) */
  intensity?: number;
};

export function LiquidGlassSurface({
  children,
  borderRadius,
  style,
  contentStyle,
  shadowDepth = "button",
  edgeShading,
  intensity = 0.5,
}: Props) {
  const { isDark } = useThemeColors();
  const nativeGlass =
    Platform.OS === "ios" && isGlassEffectAPIAvailable() && GlassViewComponent != null;
  const GlassView = GlassViewComponent;
  const isWeb = Platform.OS === "web";
  
  // Enable native BlurView support for Android in Expo SDK 56!
  const showBlurFallback = (Platform.OS === "ios" || Platform.OS === "android") && !nativeGlass;
  const showEdgeShading = edgeShading ?? !nativeGlass;

  return (
    <View
      style={[
        styles.shell,
        { borderRadius },
        liquidGlassShellShadow(shadowDepth),
        style,
      ]}
    >
      <FrostWash
        borderRadius={borderRadius}
        minimal={isWeb || nativeGlass}
        intensity={intensity}
        isDark={isDark}
      />

      {isWeb ? (
        <WebLiquidBackdrop borderRadius={borderRadius} intensity={intensity} isDark={isDark} />
      ) : nativeGlass && GlassView ? (
        <GlassView
          style={[StyleSheet.absoluteFill, { borderRadius }]}
          glassEffectStyle="regular"
          colorScheme={isDark ? "dark" : "light"}
          isInteractive
        />
      ) : showBlurFallback ? (
        <BlurView
          intensity={Math.round(40 + intensity * 50)} // 40 to 90 blur intensity
          tint={isDark ? "dark" : LIQUID_GLASS.blurTint}
          style={[StyleSheet.absoluteFill, { borderRadius, overflow: "hidden" }]}
        />
      ) : null}

      {showEdgeShading ? <LiquidGlassEdgeShading borderRadius={borderRadius} intensity={intensity} /> : null}

      {!nativeGlass ? (
        <LinearGradient
          colors={
            isDark
              ? ["rgba(255,255,255,0.09)", "rgba(255,255,255,0.025)", "rgba(255,255,255,0)"]
              : [...LIQUID_GLASS.sheen]
          }
          locations={[0, 0.45, 1]}
          style={[
            styles.topSheen,
            {
              borderTopLeftRadius: borderRadius,
              borderTopRightRadius: borderRadius,
              opacity: Math.min(1, intensity * 1.3),
            },
          ]}
        />
      ) : null}

      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  specularArc: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "45%",
    zIndex: 2,
    pointerEvents: "none",
  },
  fresnelLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "18%",
    bottom: 0,
    zIndex: 2,
    pointerEvents: "none",
  },
  fresnelRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "18%",
    bottom: 0,
    zIndex: 2,
    pointerEvents: "none",
  },
  bottomShade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "36%",
    zIndex: 2,
    pointerEvents: "none",
  },
  topEdgeLine: {
    position: "absolute",
    top: 0,
    height: StyleSheet.hairlineWidth,
    maxHeight: 1,
    zIndex: 4,
    opacity: 0.9,
    pointerEvents: "none",
  },
  outerRim: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: StyleSheet.hairlineWidth,
    zIndex: 3,
    pointerEvents: "none",
  },
  innerRim: {
    position: "absolute",
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
    borderWidth: StyleSheet.hairlineWidth,
    zIndex: 3,
    pointerEvents: "none",
  },
  topSheen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    zIndex: 1,
    pointerEvents: "none",
  },
  content: {
    zIndex: 5,
  },
});
