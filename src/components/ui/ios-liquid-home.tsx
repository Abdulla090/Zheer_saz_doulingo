/* eslint-disable */
/**
 * iOS 26 Liquid Glass surfaces for the home dashboard.
 * Native GlassView on iOS 26+ (expo-glass-effect); BlurView + specular sheen elsewhere.
 * @see https://docs.expo.dev/versions/latest/sdk/glass-effect/
 */

import { LiquidGlassSurface } from "../LiquidGlassSurface";
import { AppText } from "./AppText";
import { Glass, Motion, Radius } from "../../screens/lesson/games/game-design";
import { IS_ANDROID } from "../../utils/native-perf";
import { crossShadow } from "../../utils/shadows";
import { BlurView } from "expo-blur";
import { hapticImpact } from "../../utils/haptics";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

let GlassViewComponent: React.ComponentType<any> | null = null;
let isGlassEffectAPIAvailable: () => boolean = () => false;

try {
  const glass = require("expo-glass-effect");
  GlassViewComponent = glass.GlassView;
  isGlassEffectAPIAvailable = glass.isGlassEffectAPIAvailable ?? (() => false);
} catch {
  /* expo-glass-effect unavailable in this build */
}

export const HomePalette = {
  blue: "#2B59F3",
  blueGlow: "#0A84FF",
  navy: "#1A2B48",
  gray: "#6B7280",
  grayLight: "#9CA3AF",
  track: "#E8EDF2",
  orange: "#FF9600",
  red: "#FF4B4B",
  gold: "#FFC800",
  divider: "#EEF2F6",
  meshTop: "#E8F0FE",
  meshMid: "#F4F8FF",
  meshBottom: "#FFFFFF",
} as const;

function useNativeLiquidGlass() {
  return Platform.OS === "ios" && isGlassEffectAPIAvailable() && GlassViewComponent != null;
}

/** Compact glass chip — lesson header pills, icon buttons */
export function HomeLiquidPill({
  children,
  onPress,
  size = 44,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  size?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const inner = (
    <LiquidGlassSurface
      borderRadius={size / 2}
      style={[{ width: size, height: size }, style]}
      contentStyle={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </LiquidGlassSurface>
  );

  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  if (!onPress) return inner;

  return (
    <Animated.View style={anim}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.92, Motion.soft);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, Motion.soft);
        }}
      >
        {inner}
      </Pressable>
    </Animated.View>
  );
}

/** Frosted card — primary home sections */
export function HomeLiquidCard({
  children,
  style,
  contentStyle,
  radius = 28,
  interactive = false,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  radius?: number;
  interactive?: boolean;
}) {
  const nativeGlass = useNativeLiquidGlass();
  const GlassView = GlassViewComponent;

  if (nativeGlass && GlassView) {
    return (
      <View
        style={[
          styles.cardShell,
          { borderRadius: radius },
          crossShadow({
            color: "#1A2B48",
            offsetY: 10,
            blur: 28,
            opacity: 0.06,
            elevation: 6,
          }),
          style,
        ]}
      >
        <GlassView
          style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
          glassEffectStyle="regular"
          colorScheme="light"
          isInteractive={interactive}
        />
        <View style={[styles.cardContent, contentStyle]}>{children}</View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.cardShell,
        {
          borderRadius: radius,
          borderWidth: 1,
          borderColor: Glass.border,
          backgroundColor: IS_ANDROID ? "rgba(255,255,255,0.94)" : Glass.surface,
          overflow: "hidden",
        },
        crossShadow({
          color: "#1A2B48",
          offsetY: 10,
          blur: 24,
          opacity: 0.07,
          elevation: 5,
        }),
        style,
      ]}
    >
      {Platform.OS !== "web" && !IS_ANDROID && (
        <BlurView
          intensity={Glass.blurMedium}
          tint="light"
          style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
        />
      )}
      {Platform.OS === "web" && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backdropFilter: "blur(18px) saturate(160%)",
              WebkitBackdropFilter: "blur(18px) saturate(160%)",
            } as any
          ]}
        />
      )}
      <LinearGradient
        colors={[...Glass.sheen]}
        style={[styles.cardSheen, { borderTopLeftRadius: radius, borderTopRightRadius: radius }]}
        pointerEvents="none"
      />
      <View style={[styles.cardContent, contentStyle]}>{children}</View>
    </View>
  );
}

/** iOS-style primary CTA — solid fill + top specular sheen, spring press */
export function HomeLiquidButton({
  label,
  onPress,
  color = HomePalette.blue,
  style,
}: {
  label: string;
  onPress: () => void;
  color?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[{ width: "100%" }, anim, style]}>
      <Pressable
        onPress={() => {
          hapticImpact(Haptics.ImpactFeedbackStyle.Medium);
          onPress();
        }}
        onPressIn={() => {
          scale.value = withSpring(0.965, Motion.soft);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, Motion.soft);
        }}
        style={[
          styles.primaryBtn,
          {
            backgroundColor: color,
            borderColor: "rgba(255,255,255,0.35)",
          },
          crossShadow({
            color,
            offsetY: 8,
            blur: 20,
            opacity: 0.35,
            elevation: 6,
          }),
        ]}
      >
        <LinearGradient
          colors={["rgba(255,255,255,0.42)", "rgba(255,255,255,0.08)", "rgba(255,255,255,0)"]}
          locations={[0, 0.45, 1]}
          style={styles.primarySheen}
          pointerEvents="none"
        />
        <AppText style={styles.primaryLabel}>{label}</AppText>
      </Pressable>
    </Animated.View>
  );
}

/** Featured lesson tile — tinted liquid glass over brand blue */
export function HomeLiquidLessonTile({
  children,
  onPress,
  style,
}: {
  children: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const nativeGlass = useNativeLiquidGlass();
  const GlassView = GlassViewComponent;
  const radius = 28;

  const inner = (
    <>
      {!nativeGlass && (
        <>
          <View
            style={[StyleSheet.absoluteFill, { backgroundColor: HomePalette.blue, borderRadius: radius }]}
          />
          <LinearGradient
            colors={["rgba(255,255,255,0.28)", "rgba(255,255,255,0)"]}
            style={[styles.lessonSheen, { borderTopLeftRadius: radius, borderTopRightRadius: radius }]}
            pointerEvents="none"
          />
        </>
      )}
      <View style={styles.lessonContent}>{children}</View>
    </>
  );

  return (
    <Animated.View style={[anim, style]}>
      <Pressable
        onPress={() => {
          if (Platform.OS !== "web") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        onPressIn={() => {
          scale.value = withSpring(0.985, Motion.soft);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, Motion.soft);
        }}
        style={[
          styles.lessonShell,
          { borderRadius: radius },
          crossShadow({
            color: HomePalette.blue,
            offsetY: 12,
            blur: 24,
            opacity: 0.32,
            elevation: 8,
          }),
        ]}
      >
        {nativeGlass && GlassView ? (
          <>
            <GlassView
              style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
              glassEffectStyle="regular"
              colorScheme="light"
              tintColor={HomePalette.blue}
              isInteractive
            />
            {inner}
          </>
        ) : (
          inner
        )}
      </Pressable>
    </Animated.View>
  );
}

/** Outline XP chip — soft glass rim */
export function HomeLiquidXpChip({ label = "XP" }: { label?: string }) {
  const nativeGlass = useNativeLiquidGlass();
  const GlassView = GlassViewComponent;
  const size = 44;

  if (nativeGlass && GlassView) {
    return (
      <View style={[styles.xpOuter, { width: size, height: size, borderRadius: size / 2 }]}>
        <GlassView
          style={[StyleSheet.absoluteFill, { borderRadius: size / 2 }]}
          glassEffectStyle="clear"
          colorScheme="light"
          tintColor="#BFDBFE"
        />
        <AppText style={styles.xpText}>{label}</AppText>
      </View>
    );
  }

  return (
    <View style={styles.xpOuter}>
      {!IS_ANDROID && (
        <BlurView intensity={Glass.blurLight} tint="light" style={StyleSheet.absoluteFill} />
      )}
      <AppText style={styles.xpText}>{label}</AppText>
    </View>
  );
}

export function HomeMeshBackground() {
  return (
    <>
      <LinearGradient
        colors={[HomePalette.meshTop, HomePalette.meshMid, HomePalette.meshBottom]}
        locations={[0, 0.42, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={styles.meshOrbBlue} pointerEvents="none" />
      <View style={styles.meshOrbTeal} pointerEvents="none" />
    </>
  );
}

export const HomeType = {
  logo: {
    fontSize: 32,
    fontWeight: "800" as const,
    letterSpacing: -0.8,
    fontFamily: "DINNextRoundedBold",
  },
  heading: {
    fontSize: 22,
    fontWeight: "800" as const,
    letterSpacing: -0.4,
    fontFamily: "DINNextRoundedBold",
  },
  section: {
    fontSize: 18,
    fontWeight: "800" as const,
    letterSpacing: -0.3,
    fontFamily: "DINNextRoundedBold",
  },
  body: {
    fontSize: 15,
    fontWeight: "500" as const,
    letterSpacing: -0.15,
    lineHeight: 21,
    fontFamily: "DINNextRoundedRegular",
  },
  caption: {
    fontSize: 13,
    fontWeight: "600" as const,
    letterSpacing: -0.1,
    fontFamily: "DINNextRoundedMedium",
  },
} satisfies Record<string, TextStyle>;

const styles = StyleSheet.create({
  cardShell: {
    overflow: "hidden",
  },
  cardSheen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 56,
  },
  cardContent: {
    position: "relative",
    zIndex: 1,
  },
  primaryBtn: {
    marginTop: 14,
    height: 52,
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
  },
  primarySheen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 26,
  },
  primaryLabel: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 1,
    fontFamily: "DINNextRoundedBold",
    zIndex: 1,
  },
  lessonShell: {
    minHeight: 124,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },
  lessonSheen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 48,
  },
  lessonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    zIndex: 1,
  },
  xpOuter: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "rgba(191,219,254,0.9)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "rgba(239,246,255,0.85)",
  },
  xpText: {
    color: HomePalette.blue,
    fontSize: 13,
    fontWeight: "800",
    fontFamily: "DINNextRoundedBold",
    zIndex: 1,
  },
  meshOrbBlue: {
    position: "absolute",
    top: -80,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(43,89,243,0.08)",
  },
  meshOrbTeal: {
    position: "absolute",
    top: 280,
    left: -70,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(100,210,255,0.07)",
  },
});
