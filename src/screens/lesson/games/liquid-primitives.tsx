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
    withSpring,
    withTiming,
} from "react-native-reanimated";

import { Icon3DCheck, Icon3DX } from "@/components/icons/Icon3D";
import { crossShadow } from "@/utils/shadows";
import { Glass, Motion, Radius, Type, USE_GAME_BLUR, iOS } from "./game-design";

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
          offsetY: 12,
          opacity: 0.12,
          blur: 28,
          elevation: 10,
        }),
        style,
      ]}
    >
      {isNative && USE_GAME_BLUR && (
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
      {Platform.OS !== "web" && USE_GAME_BLUR && (
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
  color = "rgba(255,255,255,0.92)",
  hint,
  style,
}: {
  children: React.ReactNode;
  color?: string;
  hint?: string;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <View style={le.wrap}>
      <View style={le.labelRow}>
        <View style={le.accentDot} />
        <Text style={[Type.eyebrow, { color }, style]}>{children}</Text>
      </View>
      {hint ? <Text style={[Type.hint, le.hint]}>{hint}</Text> : null}
    </View>
  );
}

const le = StyleSheet.create({
  wrap: { gap: 6 },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  accentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: iOS.systemTeal,
    ...crossShadow({ color: iOS.systemTeal, offsetY: 0, opacity: 0.55, blur: 6 }),
  },
  hint: { color: "rgba(255,255,255,0.62)", paddingLeft: 14 },
});

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
    p.value = withTiming(target, { duration: Motion.colorMs, easing: Motion.ease });
  }, [state, p]);

  const surfaceStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      p.value,
      [0, 1, 2, 3],
      [
        Glass.surface,
        iOS.systemGreen,
        iOS.systemRed,
        "rgba(255,255,255,0.98)",
      ],
    ),
    borderColor: interpolateColor(
      p.value,
      [0, 1, 2, 3],
      [
        Glass.border,
        iOS.systemGreen,
        iOS.systemRed,
        Glass.borderFocus,
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
        "rgba(255,255,255,0.95)",
        "rgba(255,255,255,0.96)",
        "rgba(255,255,255,0.96)",
        "rgba(10,132,255,0.12)",
      ],
    ),
    borderColor: interpolateColor(
      p.value,
      [0, 1, 2, 3],
      [
        "rgba(148,197,255,0.45)",
        "rgba(255,255,255,0.65)",
        "rgba(255,255,255,0.65)",
        "rgba(10,132,255,0.35)",
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
        borderWidth: 1.5,
        overflow: "hidden",
        minHeight: 58,
        ...crossShadow({ color: "#000", offsetY: 8, opacity: 0.08, blur: 20, elevation: 3 }),
      },
      surfaceStyle,
      style,
    ]}>
      {Platform.OS !== "web" && USE_GAME_BLUR && !isStrongState && (
        <BlurView
          intensity={Glass.blurMedium}
          tint="light"
          style={[StyleSheet.absoluteFill, { borderRadius: Radius.lg }]}
        />
      )}
      {!isStrongState && (
        <LinearGradient
          colors={["rgba(255,255,255,0.32)", "rgba(186,230,255,0.08)", "rgba(255,255,255,0)"]}
          locations={[0, 0.45, 1]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            borderRadius: Radius.lg,
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
          scale.value = withSpring(0.97, Motion.soft);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, Motion.soft);
        }}
        style={lo.pressable}
      >
        {showLetter && (
          <Animated.View style={[lo.letterCircle, letterBgStyle]}>
            {!isStrongState && (
              <LinearGradient
                colors={["rgba(255,255,255,0.98)", "rgba(186,230,255,0.72)"]}
                start={{ x: 0.15, y: 0.05 }}
                end={{ x: 0.85, y: 0.95 }}
                style={StyleSheet.absoluteFill}
              />
            )}
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
    paddingVertical: 15,
    paddingHorizontal: 18,
    gap: 14,
    zIndex: 1,
    minHeight: 58,
  },
  letterCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    overflow: "hidden",
  },
  letterText: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  optText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
    letterSpacing: -0.15,
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
          if (!disabled) scale.value = withSpring(0.96, Motion.soft);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, Motion.soft);
        }}
        style={[
          lpb.btn,
          disabled
            ? {
                backgroundColor: "rgba(255,255,255,0.12)",
                borderColor: "rgba(255,255,255,0.22)",
                ...crossShadow({ color: "#000", offsetY: 4, opacity: 0.08, blur: 12, elevation: 2 }),
              }
            : {
                backgroundColor: color,
                borderColor: "rgba(255,255,255,0.28)",
                ...crossShadow({
                  color,
                  offsetY: 10,
                  opacity: 0.38,
                  blur: 22,
                  elevation: 8,
                }),
              },
        ]}
      >
        {!disabled && (
          <LinearGradient
            colors={["rgba(255,255,255,0.38)", "rgba(255,255,255,0)"]}
            style={lpb.sheen}
            pointerEvents="none"
          />
        )}
        {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
        <Text style={[lpb.label, { color: disabled ? "rgba(255,255,255,0.42)" : textColor }]}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const lpb = StyleSheet.create({
  btn: {
    height: 54,
    borderRadius: Radius.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
    overflow: "hidden",
    borderWidth: 1,
  },
  sheen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1.1,
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
        onPressIn={() => { scale.value = withSpring(0.96, Motion.soft); }}
        onPressOut={() => { scale.value = withSpring(1, Motion.soft); }}
        style={[
          lgb.btn,
          {
            backgroundColor: "rgba(255,255,255,0.28)",
            borderColor: "rgba(255,255,255,0.32)",
          },
        ]}
      >
        {Platform.OS !== "web" && USE_GAME_BLUR && (
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
    p.value = withTiming(target, { duration: Motion.colorMs, easing: Motion.ease });
  }, [state, p]);

  const surfaceStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      p.value,
      [0, 1, 2, 3],
      [
        Glass.surface,
        iOS.systemGreen,
        iOS.systemRed,
        "#FFFFFF",
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
      {Platform.OS !== "web" && USE_GAME_BLUR && !isStrongState && (
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
        onPressIn={() => { scale.value = withSpring(0.94, Motion.soft); }}
        onPressOut={() => { scale.value = withSpring(1, Motion.soft); }}
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
    width: "100%",
  },
  label: {
    fontWeight: "700",
    letterSpacing: -0.1,
    width: "100%",
  },
});
