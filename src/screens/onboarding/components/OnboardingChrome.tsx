import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import React from "react";
import { Platform, StyleSheet, useWindowDimensions, View } from "react-native";

import { AppText } from "../../../components/ui/AppText";
import { IOSPressable } from "../../../components/ui/ios-pressable";
import {
  LoginPrimaryButton,
  LoginPrimaryButtonLabel,
} from "../../../components/ui/LoginPrimaryButton";
import { OnboardingProgressBar } from "./OnboardingProgressBar";
import {
  ONBOARDING_DESIGN,
  ONBOARDING_GUTTER,
  ONBOARDING_PAPER_SHADOW,
  ONBOARDING_SPACE,
  resolveOnboardingSize,
} from "./onboarding-design";

export function OnboardingTopBar({
  current: _current,
  total: _total,
  locale,
  topInset,
  onBack,
  onSkip,
  skipLabel,
  backLabel,
}: {
  current: number;
  total: number;
  locale: string;
  topInset: number;
  onBack?: () => void;
  onSkip?: () => void;
  skipLabel?: string;
  backLabel?: string;
}) {
  const isRtl = locale === "ku" || locale === "ar";
  const { width, height } = useWindowDimensions();
  const size = resolveOnboardingSize(width, height);
  const compact = size === "xs" || size === "sm";

  return (
    <View
      style={[
        styles.topBar,
        compact && styles.topBarCompact,
        { paddingHorizontal: ONBOARDING_GUTTER[size] },
        { paddingTop: Math.max(topInset, 8) + (compact ? 6 : 10) },
      ]}
    >
      <AppText
        style={styles.brand}
        languageCode="en"
        forceLatinFont
        latinRole="bold"
      >
        twino
      </AppText>

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
              latinRole="medium"
              numberOfLines={1}
            >
              {skipLabel}
            </AppText>
          </IOSPressable>
        ) : onBack ? (
          <IOSPressable
            testID="onboarding-back"
            accessibilityRole="button"
            accessibilityLabel={backLabel}
            onPress={onBack}
            pressScale={0.92}
            style={[styles.roundControl, ONBOARDING_PAPER_SHADOW]}
          >
            <HugeiconsIcon
              icon={isRtl ? ArrowRight01Icon : ArrowLeft01Icon}
              size={20}
              color={ONBOARDING_DESIGN.ink}
              strokeWidth={2.1}
            />
          </IOSPressable>
        ) : null}
      </View>
    </View>
  );
}

export function OnboardingFooter({
  label,
  locale,
  bottomInset,
  onPress,
  disabled = false,
  hint,
  testID = "onboarding-continue",
  current,
  total,
}: {
  label: string;
  locale: string;
  bottomInset: number;
  onPress: () => void;
  disabled?: boolean;
  hint?: string;
  testID?: string;
  current?: number;
  total?: number;
}) {
  const { width, height } = useWindowDimensions();
  const size = resolveOnboardingSize(width, height);
  const compact = size === "xs" || size === "sm";

  return (
    <View
      style={[
        styles.footer,
        compact && styles.footerCompact,
        { paddingHorizontal: ONBOARDING_GUTTER[size] },
        { paddingBottom: Math.max(bottomInset, Platform.OS === "ios" ? 12 : 10) },
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

      <LoginPrimaryButton
        testID={testID}
        accessibilityLabel={label}
        disabled={disabled}
        onPress={onPress}
      >
        <LoginPrimaryButtonLabel languageCode={locale} align="center">
          {label}
        </LoginPrimaryButtonLabel>
      </LoginPrimaryButton>

      {typeof current === "number" && typeof total === "number" ? (
        <View style={styles.footerProgress}>
          <OnboardingProgressBar index={current - 1} total={total} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    width: "100%",
    maxWidth: 1120,
    alignSelf: "center",
    minHeight: 76,
    paddingBottom: ONBOARDING_SPACE.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 20,
  },
  topBarCompact: {
    minHeight: 62,
    paddingBottom: ONBOARDING_SPACE.xs,
  },
  brand: {
    color: ONBOARDING_DESIGN.ink,
    fontSize: 27,
    lineHeight: 32,
    letterSpacing: -1.3,
  },
  topActions: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 12,
  },
  roundControl: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ONBOARDING_DESIGN.paperRaised,
    alignItems: "center",
    justifyContent: "center",
  },
  textControl: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  skipText: {
    // Skip is a real escape route, not fine print — it needs to be findable.
    color: ONBOARDING_DESIGN.ink,
    fontSize: 15,
    lineHeight: 20,
  },
  footer: {
    width: "100%",
    maxWidth: 640,
    alignSelf: "center",
    paddingTop: ONBOARDING_SPACE.md,
    gap: ONBOARDING_SPACE.md,
    flexShrink: 0,
    backgroundColor: ONBOARDING_DESIGN.canvas,
    zIndex: 30,
  },
  footerCompact: {
    paddingTop: ONBOARDING_SPACE.sm,
  },
  footerHint: {
    color: ONBOARDING_DESIGN.mutedInk,
    fontSize: 11,
    lineHeight: 15,
    paddingHorizontal: 16,
  },
  footerProgress: {
    width: "100%",
    paddingTop: ONBOARDING_SPACE.xs,
  },
});
