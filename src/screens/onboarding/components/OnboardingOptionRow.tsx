import { HugeiconsIcon } from "@hugeicons/react-native";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

import { AppText } from "../../../components/ui/AppText";
import { IOSPressable } from "../../../components/ui/ios-pressable";
import type { OnboardingMetrics, OnboardingTheme } from "./onboarding-theme";
import { onboardingLift } from "./onboarding-theme";

export type OnboardingRowControl = "check" | "none";

/**
 * The one row shape the whole setup flow is built from.
 *
 * Before this there were three near-identical row implementations —
 * `languageRow`, `gridCard`, and a dead `optionRow` / `goalRow` pair — each with
 * its own height, radius, border and selected treatment. They had drifted, so
 * the language step and the goal step were visibly different components asking
 * the same kind of question.
 *
 * Selection is expressed as: accent border + accent wash + accent label. The
 * border *width* is constant (see `rowBorderWidth`); only its colour changes.
 * Animating width would reflow the row's contents by a pixel and the list
 * twitches as the selection moves down it.
 */
export function OnboardingOptionRow({
  label,
  sublabel,
  leading,
  leadingBackground,
  selected,
  onPress,
  locale,
  theme,
  metrics,
  control = "none",
  disabled = false,
  testID,
  accessibilityRole = "radio",
}: {
  label: string;
  sublabel?: string;
  leading?: React.ReactNode;
  /** Tint for the leading chip. Defaults to the neutral sunken surface. */
  leadingBackground?: string;
  selected: boolean;
  onPress: () => void;
  locale: string;
  theme: OnboardingTheme;
  metrics: OnboardingMetrics;
  control?: OnboardingRowControl;
  disabled?: boolean;
  testID?: string;
  accessibilityRole?: "radio" | "checkbox";
}) {
  const styles = React.useMemo(
    () => createStyles(theme, metrics),
    [metrics, theme],
  );

  return (
    <IOSPressable
      testID={testID}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={sublabel ? `${label}. ${sublabel}` : label}
      accessibilityState={{ checked: selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      pressScale={0.985}
      style={[styles.row, selected && styles.rowSelected]}
    >
      {leading ? (
        <View
          style={[
            styles.leading,
            leadingBackground ? { backgroundColor: leadingBackground } : null,
          ]}
        >
          {leading}
        </View>
      ) : null}

      <View style={styles.copy}>
        <AppText
          style={[styles.label, selected && styles.labelSelected]}
          languageCode={locale}
          latinRole="bold"
          align="start"
          fullWidth
          numberOfLines={2}
        >
          {label}
        </AppText>
        {sublabel ? (
          <AppText
            style={styles.sublabel}
            languageCode={locale}
            align="start"
            fullWidth
            numberOfLines={2}
          >
            {sublabel}
          </AppText>
        ) : null}
      </View>

      {control === "check" ? (
        <View style={[styles.check, selected && styles.checkSelected]}>
          {selected ? (
            <HugeiconsIcon
              icon={Tick02Icon}
              size={16}
              color={theme.onAccent}
              strokeWidth={3}
            />
          ) : null}
        </View>
      ) : null}
    </IOSPressable>
  );
}

/**
 * Level, as a bar chart that fills up.
 *
 * The old level list used five unrelated Hugeicons — a leaf, a bot, a rocket, a
 * book, a lightning bolt — all tinted the same blue. Five arbitrary glyphs
 * carry no ordering, so the user had to read all five labels to work out that
 * the list ran beginner-to-advanced. Bars encode the ordering in the shape
 * itself, so the list is scannable before a single word is read.
 */
export function OnboardingLevelBars({
  filled,
  total = 4,
  theme,
  selected,
}: {
  filled: number;
  total?: number;
  theme: OnboardingTheme;
  selected: boolean;
}) {
  const activeColor = selected ? theme.accent : theme.mutedInk;
  const restColor = selected ? "rgba(255,107,74,0.25)" : theme.ringTrack;

  return (
    <View style={barStyles.wrap}>
      {Array.from({ length: total }, (_, i) => {
        // Shortest bar is 34% of the tallest; anything lower disappears.
        const heightRatio = 0.34 + (i / Math.max(1, total - 1)) * 0.66;
        return (
          <View
            key={i}
            style={[
              barStyles.bar,
              {
                height: `${heightRatio * 100}%`,
                backgroundColor: i < filled ? activeColor : restColor,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const barStyles = StyleSheet.create({
  wrap: {
    // Bars grow upward from a common baseline, so the row reads as a chart
    // rather than as centred tick marks.
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 3,
    height: 20,
  },
  bar: {
    width: 4,
    borderRadius: 2,
  },
});

function createStyles(theme: OnboardingTheme, metrics: OnboardingMetrics) {
  return StyleSheet.create({
    row: {
      width: "100%",
      minHeight: metrics.rowMinHeight,
      // RTL row order is mirrored by the layout engine (forceRTL / document.dir).
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: metrics.rowPadX,
      paddingVertical: 10,
      borderRadius: metrics.rowRadius,
      borderCurve: "continuous",
      borderWidth: metrics.rowBorderWidth,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      ...onboardingLift(theme),
    },
    rowSelected: {
      borderColor: theme.accentBorder,
      backgroundColor: theme.accentWash,
    },
    leading: {
      width: metrics.leadingSize,
      height: metrics.leadingSize,
      borderRadius: metrics.leadingRadius,
      borderCurve: "continuous",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      backgroundColor: theme.surfaceSunken,
    },
    copy: {
      flex: 1,
      minWidth: 0,
      gap: 2,
    },
    label: {
      color: theme.ink,
      fontSize: metrics.labelSize,
      lineHeight: Math.round(metrics.labelSize * 1.3),
    },
    labelSelected: {
      color: theme.accentInk,
    },
    sublabel: {
      color: theme.mutedInk,
      fontSize: metrics.subLabelSize,
      lineHeight: Math.round(metrics.subLabelSize * 1.35),
    },
    check: {
      width: 26,
      height: 26,
      borderRadius: 9,
      borderCurve: "continuous",
      borderWidth: 2,
      borderColor: theme.borderStrong,
      backgroundColor: "transparent",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    checkSelected: {
      borderColor: theme.accent,
      backgroundColor: theme.accent,
    },
  });
}
