/**
 * Soft 2.5D surfaces — premium home-style buttons (gloss gradient + gentle depth).
 * Matches path lesson nodes and Phingo home CTAs.
 */

import { cssPressStyle, cssReleaseStyle } from "@/components/animations/motion";
import { LiquidGlassSurface } from "@/components/LiquidGlassSurface";
import { prefersLiquidGlass } from "@/utils/liquid-glass-color";
import { crossShadow } from "@/utils/shadows";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import Animated from "react-native-reanimated";

export type SoftColorPair = { face: string; rim: string };

export function softDepth(sizeOrFixed: number, ratio = 0.05, min = 2, max = 6): number {
  return Math.min(max, Math.max(min, Math.round(sizeOrFixed * ratio)));
}

/** Darken a #RRGGBB hex for rim / shadow (simple lerp toward black). */
export function softRimFromFace(face: string, amount = 0.22): string {
  const hex = face.replace("#", "");
  if (hex.length !== 6) return face;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const f = 1 - amount;
  const to = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n * f))).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

export function softFaceBorders(locked = false) {
  return {
    borderWidth: 1.5,
    borderColor: locked ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.22)",
    borderTopColor: locked ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.72)",
    borderLeftColor: "rgba(255,255,255,0.28)",
    borderRightColor: "rgba(255,255,255,0.2)",
  } as const;
}

type SoftGlossProps = {
  borderRadius: number;
  strong?: boolean;
  width?: number | `${number}%`;
  height?: number | `${number}%`;
};

export function SoftGloss({
  borderRadius,
  strong = true,
  width = "100%",
  height = "100%",
}: SoftGlossProps) {
  return (
    <>
      <LinearGradient
        colors={
          strong
            ? [
                "rgba(255,255,255,0.42)",
                "rgba(255,255,255,0.08)",
                "rgba(0,0,0,0.05)",
              ]
            : [
                "rgba(255,255,255,0.22)",
                "rgba(255,255,255,0.04)",
                "rgba(0,0,0,0.04)",
              ]
        }
        locations={[0, 0.45, 1]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width,
          height,
          borderRadius,
        }}
        pointerEvents="none"
      />
      {strong && typeof width === "number" && typeof height === "number" && (
        <LinearGradient
          colors={[
            "rgba(255,255,255,0.32)",
            "rgba(255,255,255,0)",
            "rgba(255,255,255,0)",
          ]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 0.55 }}
          style={{
            position: "absolute",
            top: height * 0.06,
            left: width * 0.1,
            width: width * 0.52,
            height: height * 0.3,
            borderRadius: borderRadius * 0.65,
            opacity: 0.8,
          }}
          pointerEvents="none"
        />
      )}
    </>
  );
}

type SoftSurfaceProps = {
  faceColor: string;
  rimColor?: string;
  borderRadius: number;
  depth?: number;
  pressed?: boolean;
  locked?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
};

/** Static soft surface — iOS gloss + shadow (no hard bottom rim). */
export function SoftSurface({
  faceColor,
  rimColor,
  borderRadius,
  depth: depthProp,
  pressed = false,
  locked = false,
  children,
  style,
  innerStyle,
  fullWidth,
}: SoftSurfaceProps) {
  const shadow = rimColor ?? softRimFromFace(faceColor, 0.12);
  const pressScale = pressed ? 0.98 : 1;
  const useGlass = prefersLiquidGlass(faceColor);

  if (useGlass) {
    return (
      <View
        style={[
          { transform: [{ scale: pressScale }], ...(fullWidth ? { width: "100%" } : null) },
          style,
        ]}
      >
        <LiquidGlassSurface borderRadius={borderRadius} style={fullWidth ? { width: "100%" } : undefined}>
          <View style={innerStyle}>{children}</View>
        </LiquidGlassSurface>
      </View>
    );
  }

  return (
    <View
      style={[
        {
          borderRadius,
          backgroundColor: faceColor,
          overflow: "hidden",
          transform: [{ scale: pressScale }],
          ...(fullWidth ? { width: "100%" } : null),
          ...softFaceBorders(locked),
          ...crossShadow({
            color: shadow,
            offsetY: depthProp ?? 8,
            opacity: locked ? 0.1 : 0.22,
            blur: 20,
            elevation: 5,
          }),
        },
        style,
      ]}
    >
      <SoftGloss borderRadius={borderRadius} strong={!locked} />
      <View style={[innerStyle, { zIndex: 1 }]}>{children}</View>
    </View>
  );
}

type SoftPressableButtonProps = {
  onPress: () => void;
  faceColor: string;
  rimColor?: string;
  borderRadius?: number;
  depth?: number;
  disabled?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  onPressIn?: () => void;
  onPressOut?: () => void;
  /** Stretch to parent width (default false — fits content). */
  fullWidth?: boolean;
};

export function SoftPressableButton({
  onPress,
  faceColor,
  rimColor,
  borderRadius = 16,
  depth: depthProp,
  disabled = false,
  children,
  style,
  contentStyle,
  onPressIn,
  onPressOut,
  fullWidth = false,
}: SoftPressableButtonProps) {
  const [pressed, setPressed] = useState(false);
  const shadow = rimColor ?? softRimFromFace(faceColor, 0.12);
  const useGlass = prefersLiquidGlass(faceColor);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={
        disabled
          ? undefined
          : () => {
              setPressed(true);
              onPressIn?.();
            }
      }
      onPressOut={
        disabled
          ? undefined
          : () => {
              setPressed(false);
              onPressOut?.();
            }
      }
      style={[
        { opacity: disabled ? 0.55 : 1, alignSelf: fullWidth ? "stretch" : "flex-start" },
        fullWidth ? { width: "100%" } : null,
        style,
      ]}
    >
      <Animated.View
        style={[
          {
            borderRadius,
            overflow: "hidden",
            transform: [{ scale: pressed ? 0.97 : 1 }],
            ...(useGlass
              ? null
              : {
                  backgroundColor: faceColor,
                  ...softFaceBorders(),
                  ...crossShadow({
                    color: shadow,
                    offsetY: depthProp ?? 8,
                    opacity: 0.26,
                    blur: 18,
                    elevation: 5,
                  }),
                }),
          },
          pressed ? cssPressStyle : cssReleaseStyle,
          contentStyle,
        ]}
      >
        {useGlass ? (
          <LiquidGlassSurface borderRadius={borderRadius} style={fullWidth ? { width: "100%" } : undefined}>
            {children}
          </LiquidGlassSurface>
        ) : (
          <>
            <SoftGloss borderRadius={borderRadius} />
            <View style={{ zIndex: 1 }}>{children}</View>
          </>
        )}
      </Animated.View>
    </Pressable>
  );
}

type SoftCircleButtonProps = {
  size: number;
  onPress?: () => void;
  faceColor: string;
  rimColor?: string;
  disabled?: boolean;
  /** Path lesson nodes — smaller depth, softer gloss, no hard rim. */
  preset?: "default" | "path";
  children: React.ReactNode;
};

export function SoftCircleButton({
  size,
  onPress,
  faceColor,
  rimColor,
  disabled,
  preset = "default",
  children,
}: SoftCircleButtonProps) {
  const [pressed, setPressed] = useState(false);
  const isPath = preset === "path";
  const shadow = rimColor ?? softRimFromFace(faceColor, isPath ? 0.08 : 0.12);
  const r = size / 2;
  const useGlass = prefersLiquidGlass(faceColor);
  const pathBorders = isPath
    ? {
        borderWidth: 1,
        borderColor: disabled ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.18)",
        borderTopColor: disabled ? "rgba(255,255,255,0.32)" : "rgba(255,255,255,0.55)",
        borderLeftColor: "rgba(255,255,255,0.22)",
        borderRightColor: "rgba(255,255,255,0.14)",
      }
    : softFaceBorders(disabled);

  const face = (
    <Animated.View
      style={{
        width: size,
        height: size,
        borderRadius: r,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        transform: [{ scale: pressed ? (isPath ? 0.96 : 0.94) : 1 }],
        ...(useGlass
          ? null
          : {
              backgroundColor: faceColor,
              ...pathBorders,
              ...crossShadow({
                color: shadow,
                offsetY: isPath ? 3 : 6,
                opacity: disabled ? 0.08 : isPath ? 0.14 : 0.22,
                blur: isPath ? 10 : 14,
                elevation: isPath ? 2 : 4,
              }),
            }),
        ...(pressed ? cssPressStyle : cssReleaseStyle),
      }}
    >
      {useGlass ? (
        <LiquidGlassSurface
          borderRadius={r}
          style={{ width: size, height: size }}
          contentStyle={{
            width: size,
            height: size,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {children}
        </LiquidGlassSurface>
      ) : (
        <>
          <SoftGloss
            borderRadius={r}
            width={size}
            height={size}
            strong={!disabled && preset === "default"}
          />
          <View style={{ zIndex: 1 }}>{children}</View>
        </>
      )}
    </Animated.View>
  );

  if (!onPress || disabled) {
    return face;
  }

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={{ width: size, height: size }}
    >
      {face}
    </Pressable>
  );
}
