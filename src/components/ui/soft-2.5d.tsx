/**
 * Soft 2.5D surfaces — premium home-style buttons (gloss gradient + gentle depth).
 * Matches path lesson nodes and Phingo home CTAs.
 */

import { cssPressStyle, cssReleaseStyle } from "@/components/animations/motion";
import { crossShadow } from "@/utils/shadows";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
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

/** Static rim + face stack (no press). */
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
  const rim = rimColor ?? softRimFromFace(faceColor);
  const depth = depthProp ?? softDepth(borderRadius * 2, 0.08, 3, 5);
  const translateY = pressed ? depth : 0;

  return (
    <View
      style={[
        {
          borderRadius,
          backgroundColor: rim,
          overflow: "hidden",
          ...(fullWidth ? { width: "100%" } : null),
          ...crossShadow({
            color: rim,
            offsetY: depth + 2,
            opacity: locked ? 0.12 : 0.28,
            blur: 18,
            elevation: 5,
          }),
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          {
            borderRadius,
            backgroundColor: faceColor,
            marginBottom: depth,
            overflow: "hidden",
            transform: [{ translateY }],
            ...softFaceBorders(locked),
          },
          innerStyle,
        ]}
      >
        <SoftGloss borderRadius={borderRadius} strong={!locked} />
        {children}
      </Animated.View>
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
}: SoftPressableButtonProps) {
  const [pressed, setPressed] = useState(false);
  const rim = rimColor ?? softRimFromFace(faceColor);
  const depth = depthProp ?? softDepth(52, 0.075, 3, 5);

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
      style={[{ width: "100%", opacity: disabled ? 0.55 : 1 }, style]}
    >
      <View
        style={{
          borderRadius,
          backgroundColor: rim,
          overflow: "hidden",
          ...crossShadow({
            color: rim,
            offsetY: depth + 2,
            opacity: 0.3,
            blur: 20,
            elevation: 6,
          }),
        }}
      >
        <Animated.View
          style={[
            {
              borderRadius,
              backgroundColor: faceColor,
              marginBottom: depth,
              overflow: "hidden",
              transform: [{ translateY: pressed ? depth : 0 }],
              ...softFaceBorders(),
            },
            pressed ? cssPressStyle : cssReleaseStyle,
            contentStyle,
          ]}
        >
          <SoftGloss borderRadius={borderRadius} />
          {children}
        </Animated.View>
      </View>
    </Pressable>
  );
}

type SoftCircleButtonProps = {
  size: number;
  onPress?: () => void;
  faceColor: string;
  rimColor?: string;
  disabled?: boolean;
  children: React.ReactNode;
};

export function SoftCircleButton({
  size,
  onPress,
  faceColor,
  rimColor,
  disabled,
  children,
}: SoftCircleButtonProps) {
  const [pressed, setPressed] = useState(false);
  const rim = rimColor ?? softRimFromFace(faceColor);
  const depth = softDepth(size);
  const r = size / 2;

  const face = (
    <Animated.View
      style={{
        width: size,
        height: size,
        borderRadius: r,
        backgroundColor: faceColor,
        marginBottom: depth,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        transform: [{ translateY: pressed ? depth : 0 }],
        ...softFaceBorders(disabled),
        ...(pressed ? cssPressStyle : cssReleaseStyle),
      }}
    >
      <SoftGloss borderRadius={r} width={size} height={size} strong={!disabled} />
      {children}
    </Animated.View>
  );

  const shell = (
    <View
      style={{
        width: size,
        height: size + depth,
        borderRadius: r,
        backgroundColor: rim,
        overflow: "hidden",
        ...crossShadow({
          color: rim,
          offsetY: depth + 2,
          opacity: disabled ? 0.12 : 0.28,
          blur: 16,
          elevation: 5,
        }),
      }}
    >
      {face}
    </View>
  );

  if (!onPress || disabled) {
    return shell;
  }

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={{ width: size, height: size + depth }}
    >
      {shell}
    </Pressable>
  );
}
