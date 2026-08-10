import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import React, { useEffect } from "react";
import { Platform, StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { AppText } from "../../../components/ui/AppText";
import { IOSPressable } from "../../../components/ui/ios-pressable";
import { OnboardingProgressRing } from "./OnboardingProgressRing";
import {
  ONBOARDING_GUTTER,
  ONBOARDING_SPACE,
  resolveOnboardingSize,
} from "./onboarding-design";
import { useOnboardingTheme, type OnboardingTheme } from "./onboarding-theme";

/**
 * Compact reference-matched top bar: back, then circular progress, then skip.
 *
 * Back and progress are deliberately adjacent on the leading edge. They answer
 * the same question — "where am I, and how do I undo this?" — and pairing them
 * frees the entire trailing edge for the one escape hatch that matters.
 *
 * A centered wordmark is intentionally omitted from the active flow. It caused
 * the chrome to compete with the question and made the header feel busier than
 * the compact reference treatment.
 */
export function OnboardingTopBar({
  current,
  total,
  locale,
  topInset,
  onBack,
  onSkip,
  skipLabel,
  backLabel,
  showBrand = false,
}: {
  current: number;
  total: number;
  locale: string;
  topInset: number;
  onBack?: () => void;
  onSkip?: () => void;
  skipLabel?: string;
  backLabel?: string;
  showBrand?: boolean;
}) {
  const isRtl = locale === "ku" || locale === "ar";
  const { width, height } = useWindowDimensions();
  const size = resolveOnboardingSize(width, height);
  const compact = size === "xs" || size === "sm";
  const theme = useOnboardingTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  return (
    <View
      style={[
        styles.topBar,
        compact && styles.topBarCompact,
        { paddingHorizontal: ONBOARDING_GUTTER[size] },
        { paddingTop: Math.max(topInset, 8) + (compact ? 6 : 10) },
      ]}
    >
      <View style={styles.leadGroup}>
        {onBack ? (
          <IOSPressable
            testID="onboarding-back"
            accessibilityRole="button"
            accessibilityLabel={backLabel}
            onPress={onBack}
            pressScale={0.9}
            hitSlop={10}
            style={styles.backControl}
          >
            <HugeiconsIcon
              icon={isRtl ? ArrowRight01Icon : ArrowLeft01Icon}
              size={22}
              color={theme.ink}
              strokeWidth={2.4}
            />
          </IOSPressable>
        ) : (
          // Reserves the arrow's footprint so the ring does not shift sideways
          // between the first step and every step after it.
          <View style={styles.backControl} />
        )}

        <OnboardingProgressRing
          current={current}
          total={total}
          theme={theme}
          isRtl={isRtl}
        />
      </View>

      {showBrand ? (
        <AppText
          style={styles.brand}
          languageCode="en"
          forceLatinFont
          latinRole="bold"
        >
          twino
        </AppText>
      ) : null}

      <View style={styles.topActions}>
        {onSkip && skipLabel ? (
          <IOSPressable
            testID="onboarding-skip"
            accessibilityRole="button"
            accessibilityLabel={skipLabel}
            onPress={onSkip}
            pressScale={0.96}
            style={styles.textControl}
          >
            <AppText
              style={styles.skipText}
              languageCode={locale}
              latinRole="bold"
              numberOfLines={1}
            >
              {skipLabel}
            </AppText>
          </IOSPressable>
        ) : null}
      </View>
    </View>
  );
}

/**
 * Footer: one primary action, pinned.
 *
 * The linear progress bar that used to sit under the button is gone — the ring
 * in the top bar reports the same value, and two progress indicators on one
 * screen is one too many. `current` / `total` are still accepted so existing
 * call sites keep compiling; they are unused.
 *
 * `secondaryLabel` renders a text-only action beneath the button. It is
 * deliberately *not* a second filled button: a returning user signing in is the
 * minority path, and giving it equal visual weight would make the first screen
 * ask the user to choose between two equally-loud options before they have read
 * anything.
 */
export function OnboardingFooter({
  label,
  locale,
  bottomInset,
  onPress,
  disabled = false,
  hint,
  secondaryLabel,
  onSecondaryPress,
  testID = "onboarding-continue",
  secondaryTestID = "onboarding-secondary",
  entranceKey,
}: {
  label: string;
  locale: string;
  bottomInset: number;
  onPress: () => void;
  disabled?: boolean;
  hint?: string;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
  testID?: string;
  secondaryTestID?: string;
  current?: number;
  total?: number;
  entranceKey?: string | number;
}) {
  const { width, height } = useWindowDimensions();
  const size = resolveOnboardingSize(width, height);
  const compact = size === "xs" || size === "sm";
  const theme = useOnboardingTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const reduceMotion = useReducedMotion();
  const reveal = useSharedValue(reduceMotion || entranceKey == null ? 1 : 0);

  useEffect(() => {
    cancelAnimation(reveal);
    if (reduceMotion || entranceKey == null) {
      reveal.value = 1;
      return;
    }
    reveal.value = 0;
    reveal.value = withDelay(
      790,
      withTiming(1, {
        duration: 320,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
      }),
    );
    return () => cancelAnimation(reveal);
  }, [entranceKey, reduceMotion, reveal]);

  const revealStyle = useAnimatedStyle(() => ({
    opacity: reveal.value,
    transform: [
      { translateY: interpolate(reveal.value, [0, 1], [14, 0]) },
      { scale: interpolate(reveal.value, [0, 1], [0.985, 1]) },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.footer,
        compact && styles.footerCompact,
        { paddingHorizontal: ONBOARDING_GUTTER[size] },
        { paddingBottom: Math.max(bottomInset, Platform.OS === "ios" ? 12 : 10) },
        revealStyle,
      ]}
    >
      {hint ? (
        <AppText
          style={styles.footerHint}
          languageCode={locale}
          align="center"
          numberOfLines={2}
        >
          {hint}
        </AppText>
      ) : null}

      <IOSPressable
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        pressScale={0.985}
        style={[styles.primaryButton, disabled && styles.primaryButtonDisabled]}
      >
        <AppText
          style={styles.primaryButtonLabel}
          languageCode={locale}
          latinRole="bold"
          align="center"
          numberOfLines={1}
        >
          {label}
        </AppText>
      </IOSPressable>

      {secondaryLabel && onSecondaryPress ? (
        <IOSPressable
          testID={secondaryTestID}
          accessibilityRole="button"
          accessibilityLabel={secondaryLabel}
          onPress={onSecondaryPress}
          pressScale={0.97}
          style={styles.secondaryControl}
        >
          <AppText
            style={styles.secondaryText}
            languageCode={locale}
            latinRole="bold"
            align="center"
            numberOfLines={1}
          >
            {secondaryLabel}
          </AppText>
        </IOSPressable>
      ) : null}
    </Animated.View>
  );
}

function createStyles(theme: OnboardingTheme) {
  return StyleSheet.create({
    topBar: {
      width: "100%",
      maxWidth: 1120,
      alignSelf: "center",
      minHeight: 72,
      paddingBottom: ONBOARDING_SPACE.sm,
      // RTL row order is mirrored by the layout engine (forceRTL / document.dir).
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      zIndex: 20,
    },
    topBarCompact: {
      minHeight: 60,
      paddingBottom: ONBOARDING_SPACE.xs,
    },
    leadGroup: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    backControl: {
      width: 40,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    brand: {
      color: theme.ink,
      fontSize: 24,
      lineHeight: 30,
      letterSpacing: -1.2,
    },
    topActions: {
      minHeight: 44,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 12,
    },
    textControl: {
      minHeight: 44,
      justifyContent: "center",
      paddingHorizontal: 4,
    },
    skipText: {
      // Skip is a real escape route, not fine print — it needs to be findable.
      color: theme.mutedInk,
      fontSize: 15,
      lineHeight: 20,
    },
    footer: {
      width: "100%",
      maxWidth: 600,
      alignSelf: "center",
      paddingTop: ONBOARDING_SPACE.md,
      gap: ONBOARDING_SPACE.sm,
      flexShrink: 0,
      backgroundColor: "transparent",
      zIndex: 30,
    },
    footerCompact: {
      paddingTop: ONBOARDING_SPACE.sm,
    },
    footerHint: {
      color: theme.accentInk,
      fontSize: 12,
      lineHeight: 16,
      paddingHorizontal: 16,
    },
    primaryButton: {
      width: "100%",
      minHeight: 59,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 18,
      paddingTop: 2,
      borderRadius: 14,
      borderCurve: "continuous",
      borderBottomWidth: 5,
      borderBottomColor: theme.accentPressed,
      backgroundColor: theme.accent,
    },
    primaryButtonDisabled: {
      opacity: 0.46,
    },
    primaryButtonLabel: {
      color: theme.onAccent,
      fontSize: 17,
      lineHeight: 22,
      letterSpacing: -0.15,
    },
    secondaryControl: {
      // 44pt of touch height even though the label is 20pt tall.
      minHeight: 44,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 12,
    },
    secondaryText: {
      color: theme.accentInk,
      fontSize: 14.5,
      lineHeight: 20,
    },
  });
}
