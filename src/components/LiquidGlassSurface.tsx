/**
 * Reusable iOS 26 light liquid glass — backdrop blur + edge shading.
 */

import { LIQUID_GLASS, liquidFrostBase, liquidGlassShellShadow } from "@/constants/liquid-glass";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

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
}: {
  borderRadius: number;
  minimal?: boolean;
}) {
  if (minimal) {
    return (
      <>
        <View
          style={[
            StyleSheet.absoluteFill,
            { borderRadius, backgroundColor: LIQUID_GLASS.frostUnderlay, pointerEvents: "none" },
          ]}
        />
        <View
          style={[
            StyleSheet.absoluteFill,
            { borderRadius, backgroundColor: LIQUID_GLASS.tintWash, pointerEvents: "none" },
          ]}
        />
      </>
    );
  }

  const frost = liquidFrostBase();
  return (
    <>
      <View
        style={[
          StyleSheet.absoluteFill,
          { borderRadius, backgroundColor: LIQUID_GLASS.frostUnderlay, pointerEvents: "none" },
        ]}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          { borderRadius, backgroundColor: frost, pointerEvents: "none" },
        ]}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          { borderRadius, backgroundColor: LIQUID_GLASS.tintWash, pointerEvents: "none" },
        ]}
      />
    </>
  );
}

function WebLiquidBackdrop({ borderRadius }: { borderRadius: number }) {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          borderRadius,
          overflow: "hidden",
          backgroundColor: LIQUID_GLASS.frostWeb,
          backdropFilter: "blur(24px) saturate(165%) contrast(1.04)",
          WebkitBackdropFilter: "blur(24px) saturate(165%) contrast(1.04)",
          pointerEvents: "none",
        } as ViewStyle,
      ]}
    />
  );
}

/**
 * iOS 26 edge shading fallback (web / Android / iOS without GlassView API).
 * On native GlassView, the system composes specular + rim — do not duplicate.
 */
export function LiquidGlassEdgeShading({ borderRadius }: { borderRadius: number }) {
  const r = borderRadius;
  const inset = Math.max(6, r * 0.22);

  return (
    <>
      {/* Layer 1 — overhead specular (WWDC highlights layer) */}
      <LinearGradient
        colors={[...LIQUID_GLASS.edgeSpecular]}
        locations={[0, 0.32, 1]}
        style={[
          styles.specularArc,
          { borderTopLeftRadius: r, borderTopRightRadius: r },
        ]}
      />
      {/* Layer 2 — Fresnel left rim */}
      <LinearGradient
        colors={[LIQUID_GLASS.edgeFresnel, "rgba(255,255,255,0)"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.fresnelLeft, { borderTopLeftRadius: r, borderBottomLeftRadius: r }]}
      />
      {/* Layer 3 — Fresnel right rim */}
      <LinearGradient
        colors={["rgba(255,255,255,0)", LIQUID_GLASS.edgeFresnel]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.fresnelRight, { borderTopRightRadius: r, borderBottomRightRadius: r }]}
      />
      {/* Layer 4 — bottom thickness / lensing shade */}
      <LinearGradient
        colors={["rgba(255,255,255,0)", LIQUID_GLASS.edgeBottomShade]}
        locations={[0.5, 1]}
        style={[
          styles.bottomShade,
          { borderBottomLeftRadius: r, borderBottomRightRadius: r },
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
          },
        ]}
      />
      {/* Layer 6 — dual rim (Increased Contrast–style separation) */}
      <View
        style={[styles.outerRim, { borderRadius: r, borderColor: LIQUID_GLASS.border }]}
      />
      <View
        style={[
          styles.innerRim,
          { borderRadius: Math.max(0, r - 1), borderColor: LIQUID_GLASS.borderInner },
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
};

export function LiquidGlassSurface({
  children,
  borderRadius,
  style,
  contentStyle,
  shadowDepth = "button",
  edgeShading,
}: Props) {
  const nativeGlass =
    Platform.OS === "ios" && isGlassEffectAPIAvailable() && GlassViewComponent != null;
  const GlassView = GlassViewComponent;
  const isWeb = Platform.OS === "web";
  const iosBlurFallback = Platform.OS === "ios" && !nativeGlass;
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
      <FrostWash borderRadius={borderRadius} minimal={isWeb || nativeGlass} />

      {isWeb ? (
        <WebLiquidBackdrop borderRadius={borderRadius} />
      ) : nativeGlass && GlassView ? (
        <GlassView
          style={[StyleSheet.absoluteFill, { borderRadius }]}
          glassEffectStyle="regular"
          colorScheme="light"
          isInteractive
        />
      ) : iosBlurFallback ? (
        <BlurView
          intensity={68}
          tint={LIQUID_GLASS.blurTint}
          style={[StyleSheet.absoluteFill, { borderRadius, overflow: "hidden" }]}
        />
      ) : null}

      {showEdgeShading ? <LiquidGlassEdgeShading borderRadius={borderRadius} /> : null}

      {!nativeGlass ? (
        <LinearGradient
          colors={[...LIQUID_GLASS.sheen]}
          locations={[0, 0.45, 1]}
          style={[
            styles.topSheen,
            { borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius },
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
