/**
 * iOS 26–style floating tab bar surface (Liquid Glass on iOS 26+, blur fallback).
 */

import { IS_ANDROID } from "@/utils/native-perf";
import { crossShadow } from "@/utils/shadows";
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

function useTabBarGlass(): boolean {
  return Platform.OS === "ios" && isGlassEffectAPIAvailable() && GlassViewComponent != null;
}

type Props = {
  children: React.ReactNode;
  borderRadius: number;
  style?: StyleProp<ViewStyle>;
};

export function TabBarGlassSurface({ children, borderRadius, style }: Props) {
  const nativeGlass = useTabBarGlass();
  const GlassView = GlassViewComponent;

  const shellStyle = [
    styles.shell,
    { borderRadius },
    !IS_ANDROID &&
      crossShadow({
        color: "#1A2B48",
        offsetY: 8,
        blur: 24,
        opacity: Platform.OS === "ios" ? 0.1 : 0.14,
        elevation: 12,
      }),
    IS_ANDROID && styles.shellAndroid,
    style,
  ];

  if (nativeGlass && GlassView) {
    return (
      <View style={shellStyle}>
        <GlassView
          style={[StyleSheet.absoluteFill, { borderRadius }]}
          glassEffectStyle="regular"
          colorScheme="light"
          isInteractive
        />
        <View style={[styles.borderHairline, { borderRadius }]} pointerEvents="none" />
        <View style={styles.content}>{children}</View>
      </View>
    );
  }

  return (
    <View style={shellStyle}>
      {Platform.OS === "ios" ? (
        <BlurView
          intensity={72}
          tint="systemChromeMaterialLight"
          style={[StyleSheet.absoluteFill, { borderRadius }]}
        />
      ) : IS_ANDROID ? (
        <BlurView
          intensity={55}
          tint="light"
          experimentalBlurMethod="dimezisBlurView"
          style={[StyleSheet.absoluteFill, { borderRadius }]}
        />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            { borderRadius, backgroundColor: "rgba(255,255,255,0.72)" },
          ]}
        />
      )}
      <LinearGradient
        colors={["rgba(255,255,255,0.38)", "rgba(255,255,255,0.06)", "rgba(255,255,255,0)"]}
        locations={[0, 0.42, 1]}
        style={[styles.topSheen, { borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }]}
        pointerEvents="none"
      />
      <View style={[styles.borderHairline, { borderRadius }]} pointerEvents="none" />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.65)",
    backgroundColor: "transparent",
  },
  shellAndroid: {
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: "transparent",
  },
  topSheen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "48%",
  },
  borderHairline: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.5)",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
});
