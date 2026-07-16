/* eslint-disable */
/**
 * iOS 26 Liquid Glass surfaces for the home dashboard.
 * Native GlassView on iOS 26+ (expo-glass-effect); BlurView + specular sheen elsewhere.
 * @see https://docs.expo.dev/versions/latest/sdk/glass-effect/
 */

import { LiquidGlassSurface } from "../LiquidGlassSurface";
import {
  CSS_PRESS_MS,
  IOS_BUTTON_PRESS_OPACITY,
  IOS_BUTTON_PRESS_SCALE,
  IOS_BUTTON_PRESS_Y,
  IOS_BUTTON_RELEASE_SPRING,
} from "../animations/motion";
import { AppText } from "./AppText";
import { Glass, Motion, Radius } from "../../screens/lesson/games/game-design";
import { IS_ANDROID } from "../../utils/native-perf";
import { crossShadow } from "../../utils/shadows";
import { useThemeColors } from "../../hooks/useThemeColors";
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
  withTiming,
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
  blue: "#0F172A",
  blueGlow: "#64748B",
  coral: "#334155",
  coralDeep: "#0F172A",
  amber: "#475569",
  navy: "#090D16",
  gray: "#64748B",
  grayLight: "#94A3B8",
  track: "#E2E8F0",
  orange: "#1E293B",
  red: "#0F172A",
  gold: "#334155",
  cream: "#FFFFFF",
  sand: "#F8FAFC",
  divider: "#E2E8F0",
  meshTop: "#FFFFFF",
  meshMid: "#F8FAFC",
  meshBottom: "#F1F5F9",
} as const;

function useNativeLiquidGlass() {
  return (
    Platform.OS === "ios" &&
    isGlassEffectAPIAvailable() &&
    GlassViewComponent != null
  );
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
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);
  const anim = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

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
  const { colors, isDark } = useThemeColors();
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
          colorScheme={isDark ? "dark" : "light"}
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
          borderColor: isDark ? colors.border : Glass.border,
          backgroundColor: IS_ANDROID
            ? (isDark ? colors.surfaceRaised : "rgba(255,255,255,0.94)")
            : (isDark ? colors.surface : Glass.surface),
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
          tint={isDark ? "dark" : "light"}
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
            } as any,
          ]}
        />
      )}
      <LinearGradient
        colors={isDark
          ? ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)", "rgba(255,255,255,0)"]
          : [...Glass.sheen]}
        style={[
          styles.cardSheen,
          { borderTopLeftRadius: radius, borderTopRightRadius: radius },
        ]}
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
  flush = false,
}: {
  label: string;
  onPress: () => void;
  color?: string;
  style?: StyleProp<ViewStyle>;
  /** Remove the default top spacing when the button sits in a fixed footer. */
  flush?: boolean;
}) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);
  const anim = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View style={[{ width: "100%" }, anim, style]}>
      <Pressable
        onPress={() => {
          hapticImpact(Haptics.ImpactFeedbackStyle.Medium);
          onPress();
        }}
        onPressIn={() => {
          scale.value = withTiming(IOS_BUTTON_PRESS_SCALE, { duration: CSS_PRESS_MS });
          opacity.value = withTiming(IOS_BUTTON_PRESS_OPACITY, { duration: CSS_PRESS_MS });
          translateY.value = withTiming(IOS_BUTTON_PRESS_Y, { duration: CSS_PRESS_MS });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, IOS_BUTTON_RELEASE_SPRING);
          opacity.value = withSpring(1, IOS_BUTTON_RELEASE_SPRING);
          translateY.value = withSpring(0, IOS_BUTTON_RELEASE_SPRING);
        }}
        style={[
          styles.primaryBtn,
          flush && styles.primaryBtnFlush,
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
          colors={[
            "rgba(255,255,255,0.42)",
            "rgba(255,255,255,0.08)",
            "rgba(255,255,255,0)",
          ]}
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
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);
  const anim = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));
  const nativeGlass = useNativeLiquidGlass();
  const GlassView = GlassViewComponent;
  const radius = 28;

  const inner = (
    <>
      {!nativeGlass && (
        <>
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: HomePalette.blue, borderRadius: radius },
            ]}
          />
          <LinearGradient
            colors={["rgba(255,255,255,0.28)", "rgba(255,255,255,0)"]}
            style={[
              styles.lessonSheen,
              { borderTopLeftRadius: radius, borderTopRightRadius: radius },
            ]}
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
          if (Platform.OS !== "web")
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        onPressIn={() => {
          scale.value = withTiming(IOS_BUTTON_PRESS_SCALE, { duration: CSS_PRESS_MS });
          opacity.value = withTiming(IOS_BUTTON_PRESS_OPACITY, { duration: CSS_PRESS_MS });
          translateY.value = withTiming(IOS_BUTTON_PRESS_Y, { duration: CSS_PRESS_MS });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, IOS_BUTTON_RELEASE_SPRING);
          opacity.value = withSpring(1, IOS_BUTTON_RELEASE_SPRING);
          translateY.value = withSpring(0, IOS_BUTTON_RELEASE_SPRING);
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
  const { colors, isDark } = useThemeColors();
  const nativeGlass = useNativeLiquidGlass();
  const GlassView = GlassViewComponent;
  const size = 44;

  if (nativeGlass && GlassView) {
    return (
      <View
        style={[
          styles.xpOuter,
          { width: size, height: size, borderRadius: size / 2 },
          isDark && { backgroundColor: colors.surfaceRaised, borderColor: colors.border },
        ]}
      >
        <GlassView
          style={[StyleSheet.absoluteFill, { borderRadius: size / 2 }]}
          glassEffectStyle="clear"
          colorScheme={isDark ? "dark" : "light"}
          tintColor="#BFDBFE"
        />
        <AppText style={[styles.xpText, isDark && { color: colors.foreground }]}>{label}</AppText>
      </View>
    );
  }

  return (
    <View style={[styles.xpOuter, isDark && { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
      {!IS_ANDROID && (
        <BlurView
          intensity={Glass.blurLight}
          tint={isDark ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />
      )}
      <AppText style={[styles.xpText, isDark && { color: colors.foreground }]}>{label}</AppText>
    </View>
  );
}

export function HomeMeshBackground() {
  return (
    <>
      <LinearGradient
        colors={[
          HomePalette.meshTop,
          HomePalette.meshMid,
          HomePalette.meshBottom,
        ]}
        locations={[0, 0.46, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={styles.meshOrbCoral} pointerEvents="none" />
      <View style={styles.meshOrbBlue} pointerEvents="none" />
      <View style={styles.meshOrbAmber} pointerEvents="none" />
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
    width: "100%",
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
  primaryBtnFlush: {
    marginTop: 0,
  },
  primarySheen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
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
    width: "100%",
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
  meshOrbCoral: {
    position: "absolute",
    top: -90,
    left: -70,
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: "rgba(15, 23, 42, 0.05)",
  },
  meshOrbBlue: {
    position: "absolute",
    top: -70,
    right: -62,
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: "rgba(15, 23, 42, 0.03)",
  },
  meshOrbAmber: {
    position: "absolute",
    top: 292,
    left: -74,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "rgba(15, 23, 42, 0.02)",
  },
});
