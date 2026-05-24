/**
 * liquid-primitives.tsx — iOS 26 Liquid Glass building blocks
 *
 * Reusable visual primitives shared across all lesson game screens.
 * Built on:
 *   • expo-blur (BlurView) for native frosted glass
 *   • LinearGradient for top-edge specular sheen
 *   • Reanimated for spring-based press response
 *
 * Components:
 *   <LiquidCard>          — primary frosted glass card (white tint)
 *   <LiquidPill>          — small dark glass pill (header chips)
 *   <LiquidEyebrow>       — uppercase labels above titles
 *   <LiquidOption>        — animated answer option button (idle/correct/wrong)
 *   <LiquidPrimaryButton> — solid CTA button with iOS spring press
 *   <LiquidGhostButton>   — translucent secondary button
 */

import { BlurView } from "expo-blur";
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
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from "react-native-reanimated";

import { Icon3DCheck, Icon3DX } from "@/components/icons/Icon3D";
import { crossShadow } from "@/utils/shadows";
import { Glass, Motion, Radius, Type, iOS } from "./game-design";

/* ════════════════════════════════════════════════════════════════════
 * <LiquidCard>
 * Primary translucent frosted card. Sits over the ocean background.
 * ════════════════════════════════════════════════════════════════════ */
export function LiquidCard({
  children,
  style,
  intensity = Glass.blurMedium,
  radius = Radius.xl,
  tint = "light",
  showSheen = true,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  radius?: number;
  tint?: "light" | "dark";
  showSheen?: boolean;
}) {
  const surface = tint === "light" ? Glass.surface : Glass.surfaceDark;
  const border  = tint === "light" ? Glass.border  : Glass.borderDark;

  // Web fallback: use backdrop-filter; native: BlurView
  const isNative = Platform.OS !== "web";

  return (
    <View
      style={[
        {
          borderRadius: radius,
          borderWidth: 1,
          borderColor: border,
          overflow: "hidden",
          backgroundColor: isNative ? surface : surface,
        },
        !isNative && {
          // @ts-ignore web-only
          backdropFilter: `blur(${intensity / 2}px) saturate(160%)`,
          // @ts-ignore web-only
          WebkitBackdropFilter: `blur(${intensity / 2}px) saturate(160%)`,
        },
        crossShadow({
          color: "#000",
          offsetY: 18,
          opacity: 0.16,
          blur: 36,
          elevation: 14,
        }),
        style,
      ]}
    >
      {isNative && (
        <BlurView
          intensity={intensity}
          tint={tint === "light" ? "light" : "dark"}
          style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
        />
      )}
      {showSheen && (
        <LinearGradient
          colors={tint === "light" ? Glass.sheen : Glass.sheenSoft}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: radius * 2.4,
            borderTopLeftRadius: radius,
            borderTopRightRadius: radius,
          }}
          pointerEvents="none"
        />
      )}
      <View style={{ position: "relative", zIndex: 1 }}>{children}</View>
    </View>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * <LiquidPill>
 * Dark/light glass pill — used for header controls, badges.
 * ════════════════════════════════════════════════════════════════════ */
export function LiquidPill({
  children,
  style,
  height = 44,
  paddingHorizontal = 16,
  intensity = Glass.blurStrong,
  tint = "dark",
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  height?: number;
  paddingHorizontal?: number;
  intensity?: number;
  tint?: "light" | "dark";
}) {
  const surface = tint === "dark" ? Glass.surfaceDark : Glass.surface;
  const border  = tint === "dark" ? Glass.borderDark  : Glass.borderSoft;

  return (
    <View
      style={[
        {
          height,
          paddingHorizontal,
          borderRadius: height / 2,
          borderWidth: 1,
          borderColor: border,
          backgroundColor: surface,
          overflow: "hidden",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        },
        Platform.OS === "web" && {
          // @ts-ignore web-only
          backdropFilter: `blur(${intensity / 2.5}px) saturate(150%)`,
          // @ts-ignore web-only
          WebkitBackdropFilter: `blur(${intensity / 2.5}px) saturate(150%)`,
        },
        style,
      ]}
    >
      {Platform.OS !== "web" && (
        <BlurView
          intensity={intensity}
          tint={tint === "dark" ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />
      )}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, zIndex: 1 }}>
        {children}
      </View>
    </View>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * <LiquidEyebrow>
 * Uppercase preamble label, fluid letter-spacing.
 * ════════════════════════════════════════════════════════════════════ */
export function LiquidEyebrow({
  children,
  color = "rgba(255,255,255,0.85)",
  style,
}: {
  children: React.ReactNode;
  color?: string;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <Text style={[Type.eyebrow, { color }, style]}>
      {children}
    </Text>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * <LiquidOption>
 * The hero answer button used by every game.
 *
 * States: idle | correct | wrong | showCorrect | selected
 * Visual: glass surface tinted with system color when active.
 * ════════════════════════════════════════════════════════════════════ */
export type OptionState = "idle" | "correct" | "wrong" | "showCorrect" | "selected";

export function LiquidOption({
  text,
  state,
  onPress,
  disabled,
  index,
  showLetter = true,
  multiline = true,
  style,
}: {
  text: string;
  state: OptionState;
  onPress: () => void;
  disabled?: boolean;
  index?: number;
  showLetter?: boolean;
  multiline?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  // Animation: 0=idle, 1=correct/showCorrect, 2=wrong, 3=selected
  const p = useSharedValue(0);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    const target =
      state === "correct" || state === "showCorrect" ? 1
      : state === "wrong" ? 2
      : state === "selected" ? 3
      : 0;
    // Always jump instantly to avoid color bleeding through intermediate states
    p.value = target;
  }, [state]);

  const surfaceStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      p.value,
      [0, 1, 2, 3],
      [
        Glass.surface,
        iOS.systemGreen,         // SOLID green when correct
        iOS.systemRed,           // SOLID red when wrong
        "#FFFFFF",               // SOLID white when selected (clear vs ocean)
      ],
    ),
    borderColor: interpolateColor(
      p.value,
      [0, 1, 2, 3],
      [
        Glass.border,
        iOS.systemGreen,
        iOS.systemRed,
        iOS.systemBlue,
      ],
    ),
    transform: [{ scale: scale.value }],
  }));

  const textColorStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      p.value,
      [0, 1, 2, 3],
      ["#0F172A", "#FFFFFF", "#FFFFFF", iOS.blueDeep],
    ) as any,
  }));

  // Letter circle adapts: solid white pill when option is in a strong color state
  const letterBgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      p.value,
      [0, 1, 2, 3],
      [
        "rgba(255,255,255,0.7)",
        "rgba(255,255,255,0.95)",
        "rgba(255,255,255,0.95)",
        "rgba(10,132,255,0.15)",
      ],
    ),
  }));

  const letterTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      p.value,
      [0, 1, 2, 3],
      ["#0F172A", iOS.greenDeep, iOS.redDeep, iOS.blueDeep],
    ) as any,
  }));

  const letter = ["A", "B", "C", "D", "E", "F"][((index ?? 0) % 6)];

  const isCorrectState = state === "correct" || state === "showCorrect";
  // "Strong" = a state with a solid background (no blur shows through)
  const isStrongState = isCorrectState || state === "wrong" || state === "selected";

  return (
    <Animated.View style={[
      {
        borderRadius: Radius.lg,
        borderWidth: 1.4,
        overflow: "hidden",
        ...crossShadow({ color: "#000", offsetY: 6, opacity: 0.10, blur: 14, elevation: 4 }),
      },
      surfaceStyle,
      style,
    ]}>
      {Platform.OS !== "web" && !isStrongState && (
        <BlurView
          intensity={Glass.blurMedium}
          tint="light"
          style={[StyleSheet.absoluteFill, { borderRadius: Radius.lg }]}
        />
      )}
      {!isStrongState && (
        <LinearGradient
          colors={Glass.sheen}
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, height: 26,
            borderTopLeftRadius: Radius.lg,
            borderTopRightRadius: Radius.lg,
          }}
          pointerEvents="none"
        />
      )}
      {isStrongState && (
        <LinearGradient
          colors={["rgba(255,255,255,0.28)", "rgba(255,255,255,0)"]}
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, height: 26,
            borderTopLeftRadius: Radius.lg,
            borderTopRightRadius: Radius.lg,
          }}
          pointerEvents="none"
        />
      )}
      <Pressable
        onPress={() => {
          if (disabled) return;
          if (Platform.OS !== "web") void Haptics.selectionAsync().catch(() => {});
          onPress();
        }}
        disabled={disabled}
        onPressIn={() => {
          scale.value = withSpring(0.97, Motion.press);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, Motion.press);
        }}
        style={lo.pressable}
      >
        {showLetter && (
          <Animated.View style={[lo.letterCircle, letterBgStyle]}>
            <Animated.Text style={[lo.letterText, letterTextStyle]}>
              {letter}
            </Animated.Text>
          </Animated.View>
        )}
        <Animated.Text
          style={[lo.optText, textColorStyle]}
          numberOfLines={multiline ? 3 : 1}
        >
          {text}
        </Animated.Text>
        {isCorrectState && <Icon3DCheck size={22} />}
        {state === "wrong" && <Icon3DX size={22} />}
      </Pressable>
    </Animated.View>
  );
}

const lo = StyleSheet.create({
  pressable: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 14,
    zIndex: 1,
  },
  letterCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
  },
  letterText: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  optText: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 23,
    letterSpacing: -0.2,
  },
});

/* ════════════════════════════════════════════════════════════════════
 * <LiquidPrimaryButton>
 * Solid CTA — used for CHECK / CONTINUE actions.
 * ════════════════════════════════════════════════════════════════════ */
export function LiquidPrimaryButton({
  label,
  color = iOS.systemBlue,
  textColor = "#FFFFFF",
  onPress,
  disabled = false,
  icon,
  style,
}: {
  label: string;
  color?: string;
  textColor?: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[{ width: "100%" }, animStyle, style]}>
      <Pressable
        onPress={() => {
          if (disabled) return;
          if (Platform.OS !== "web") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
          onPress();
        }}
        disabled={disabled}
        onPressIn={() => {
          scale.value = withSpring(0.96, Motion.press);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, Motion.press);
        }}
        style={[
          lpb.btn,
          {
            backgroundColor: disabled ? "rgba(255,255,255,0.25)" : color,
            opacity: disabled ? 0.55 : 1,
            ...crossShadow({
              color: disabled ? "#000" : color,
              offsetY: 8,
              opacity: 0.32,
              blur: 18,
              elevation: 8,
            }),
          },
        ]}
      >
        {/* Specular sheen */}
        <LinearGradient
          colors={["rgba(255,255,255,0.35)", "rgba(255,255,255,0)"]}
          style={lpb.sheen}
          pointerEvents="none"
        />
        {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
        <Text style={[lpb.label, { color: textColor }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const lpb = StyleSheet.create({
  btn: {
    height: 56,
    borderRadius: Radius.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },
  sheen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 22,
  },
  label: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});

/* ════════════════════════════════════════════════════════════════════
 * <LiquidGhostButton>
 * Secondary translucent button — Skip, Cancel, etc.
 * ════════════════════════════════════════════════════════════════════ */
export function LiquidGhostButton({
  label,
  onPress,
  textColor = "#FFFFFF",
  style,
}: {
  label: string;
  onPress: () => void;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[{ width: "100%" }, animStyle, style]}>
      <Pressable
        onPress={() => {
          if (Platform.OS !== "web") void Haptics.selectionAsync().catch(() => {});
          onPress();
        }}
        onPressIn={() => { scale.value = withSpring(0.96, Motion.press); }}
        onPressOut={() => { scale.value = withSpring(1, Motion.press); }}
        style={[
          lgb.btn,
          {
            backgroundColor: "rgba(255,255,255,0.18)",
            borderColor: "rgba(255,255,255,0.32)",
          },
        ]}
      >
        {Platform.OS !== "web" && (
          <BlurView
            intensity={Glass.blurMedium}
            tint="light"
            style={StyleSheet.absoluteFill}
          />
        )}
        <Text style={[lgb.label, { color: textColor, zIndex: 1 }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const lgb = StyleSheet.create({
  btn: {
    height: 56,
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    overflow: "hidden",
  },
  label: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});

/* ════════════════════════════════════════════════════════════════════
 * <LiquidWordChip>
 * Small word-bank / fill-blank chip — frosted glass, spring press.
 * ════════════════════════════════════════════════════════════════════ */
export function LiquidWordChip({
  label,
  state = "idle",
  onPress,
  disabled,
  ghost = false,
  size = "md",
  rtl = false,
}: {
  label: string;
  state?: OptionState;
  onPress?: () => void;
  disabled?: boolean;
  ghost?: boolean;
  size?: "sm" | "md";
  rtl?: boolean;
}) {
  const scale = useSharedValue(1);
  const p = useSharedValue(0);

  React.useEffect(() => {
    const target =
      state === "correct" || state === "showCorrect" ? 1
      : state === "wrong" ? 2
      : state === "selected" ? 3
      : 0;
    // Always jump instantly to avoid color bleeding through intermediate states
    p.value = target;
  }, [state]);

  const surfaceStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      p.value,
      [0, 1, 2, 3],
      [
        Glass.surface,
        iOS.systemGreen,           // SOLID green
        iOS.systemRed,             // SOLID red
        "#FFFFFF",                 // SOLID white when selected
      ],
    ),
    borderColor: interpolateColor(
      p.value,
      [0, 1, 2, 3],
      [Glass.border, iOS.systemGreen, iOS.systemRed, iOS.systemBlue],
    ),
    transform: [{ scale: scale.value }],
  }));

  const textColorStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      p.value,
      [0, 1, 2, 3],
      ["#0F172A", "#FFFFFF", "#FFFFFF", iOS.blueDeep],
    ) as any,
  }));

  const isStrongState = state === "correct" || state === "showCorrect" || state === "wrong" || state === "selected";

  const padding = size === "sm" ? { paddingHorizontal: 14, paddingVertical: 9 } : { paddingHorizontal: 16, paddingVertical: 12 };
  const fontSize = size === "sm" ? 14 : 16;

  // Ghost = used / placeholder slot
  if (ghost) {
    return (
      <View
        style={[
          lwc.chipBase,
          padding,
          {
            borderStyle: "dashed",
            borderColor: "rgba(255,255,255,0.4)",
            backgroundColor: "rgba(255,255,255,0.08)",
          },
        ]}
      >
        <Text style={[lwc.label, { fontSize, opacity: 0, color: "transparent" }]}>{label}</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[lwc.chipBase, padding, surfaceStyle, crossShadow({ color: "#000", offsetY: 4, opacity: 0.12, blur: 10 })]}>
      {Platform.OS !== "web" && !isStrongState && (
        <BlurView
          intensity={Glass.blurMedium}
          tint="light"
          style={[StyleSheet.absoluteFill, { borderRadius: Radius.md }]}
        />
      )}
      <Pressable
        onPress={() => {
          if (!onPress || disabled) return;
          if (Platform.OS !== "web") void Haptics.selectionAsync().catch(() => {});
          onPress();
        }}
        disabled={disabled}
        onPressIn={() => { scale.value = withSpring(0.94, Motion.press); }}
        onPressOut={() => { scale.value = withSpring(1, Motion.press); }}
        style={lwc.pressable}
      >
        <Animated.Text style={[lwc.label, { fontSize }, rtl && { writingDirection: "rtl", textAlign: "right" }, textColorStyle]}>
          {label}
        </Animated.Text>
      </Pressable>
    </Animated.View>
  );
}

const lwc = StyleSheet.create({
  chipBase: {
    borderRadius: Radius.md,
    borderWidth: 1.4,
    overflow: "hidden",
  },
  pressable: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  label: {
    fontWeight: "700",
    letterSpacing: -0.1,
  },
});
