/**
 * Floating tab bar — light frosted glass on all platforms.
 * Android: no BlurView (renders solid black on many devices); frost + sheen layers instead.
 */

import { TAB_BAR_GLASS, tabBarFrostBase } from "@/constants/tab-bar-glass";
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

function FrostLayers({ borderRadius }: { borderRadius: number }) {
  const frost = tabBarFrostBase();
  return (
    <>
      <View
        style={[
          StyleSheet.absoluteFill,
          { borderRadius, backgroundColor: TAB_BAR_GLASS.frostUnderlay },
        ]}
        pointerEvents="none"
      />
      <View
        style={[StyleSheet.absoluteFill, { borderRadius, backgroundColor: frost }]}
        pointerEvents="none"
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          { borderRadius, backgroundColor: TAB_BAR_GLASS.tintBrand },
        ]}
        pointerEvents="none"
      />
      <LinearGradient
        colors={[...TAB_BAR_GLASS.sheen]}
        locations={[0, 0.4, 1]}
        style={[
          styles.topSheen,
          { borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius },
        ]}
        pointerEvents="none"
      />
    </>
  );
}

type Props = {
  children: React.ReactNode;
  borderRadius: number;
  style?: StyleProp<ViewStyle>;
};

export function TabBarGlassSurface({ children, borderRadius, style }: Props) {
  const nativeGlass =
    Platform.OS === "ios" && isGlassEffectAPIAvailable() && GlassViewComponent != null;
  const GlassView = GlassViewComponent;

  const shellStyle = [
    styles.shell,
    { borderRadius, borderColor: TAB_BAR_GLASS.border },
    crossShadow({
      color: TAB_BAR_GLASS.shadow,
      offsetY: IS_ANDROID ? 6 : 8,
      blur: IS_ANDROID ? 16 : 22,
      opacity: IS_ANDROID ? 0.08 : 0.11,
      elevation: IS_ANDROID ? 8 : 12,
    }),
    style,
  ];

  return (
    <View style={shellStyle}>
      {nativeGlass && GlassView ? (
        <>
          <FrostLayers borderRadius={borderRadius} />
          <GlassView
            style={[StyleSheet.absoluteFill, { borderRadius }]}
            glassEffectStyle="regular"
            colorScheme="light"
            isInteractive
          />
        </>
      ) : IS_ANDROID ? (
        <FrostLayers borderRadius={borderRadius} />
      ) : Platform.OS === "ios" ? (
        <>
          <FrostLayers borderRadius={borderRadius} />
          <BlurView
            intensity={76}
            tint="systemChromeMaterialLight"
            style={[StyleSheet.absoluteFill, { borderRadius }]}
          />
        </>
      ) : (
        <FrostLayers borderRadius={borderRadius} />
      )}

      <View
        style={[
          styles.borderHairline,
          { borderRadius, borderColor: TAB_BAR_GLASS.borderInner },
        ]}
        pointerEvents="none"
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: "transparent",
  },
  topSheen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "54%",
  },
  borderHairline: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: StyleSheet.hairlineWidth,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
});
