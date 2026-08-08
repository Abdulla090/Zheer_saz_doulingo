import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";

import { AppText } from "../../../components/ui/AppText";
import { getMascotExpressionSource } from "../../../constants/mascot-expressions";
import type { MascotExpression } from "../../../constants/mascot-expressions";
import type { OnboardingMetrics, OnboardingTheme } from "./onboarding-theme";
import { onboardingLift } from "./onboarding-theme";

/**
 * The question, asked by the mascot.
 *
 * Every setup step used to open with a small "STEP 3 OF 5" eyebrow above a large
 * serif headline. That is an editorial masthead: it tells the user where they
 * are in a document. This flow is a conversation, so the question now comes out
 * of the mascot's mouth and the step counter moves to the ring in the top bar,
 * where it stops competing with the thing actually being asked.
 *
 * It also means the pet the user is about to choose is present from the first
 * screen rather than appearing once at the end, which is the whole reason the
 * pet exists.
 */
export function OnboardingQuestion({
  question,
  hint,
  locale,
  isRtl,
  theme,
  metrics,
  mascotId,
  expression = "happy",
}: {
  question: string;
  hint?: string;
  locale: string;
  isRtl: boolean;
  theme: OnboardingTheme;
  metrics: OnboardingMetrics;
  mascotId: string;
  expression?: MascotExpression;
}) {
  const styles = React.useMemo(
    () => createStyles(theme, metrics, isRtl),
    [isRtl, metrics, theme],
  );

  return (
    <View style={styles.row}>
      <Image
        source={getMascotExpressionSource(mascotId, expression)}
        style={styles.mascot}
        contentFit="contain"
        transition={200}
        accessibilityIgnoresInvertColors
      />

      <View style={styles.bubbleWrap}>
        {/*
          The tail is a rotated square with borders on exactly the two edges
          that end up facing the mascot, so it inherits the bubble's outline
          without a second shape to keep in sync. It sits *above* the bubble in
          z-order: its fill then covers the short run of bubble border it
          overlaps, which is what makes the join look continuous.
        */}
        <View style={styles.tail} />
        <View style={styles.bubble}>
          <AppText
            style={styles.question}
            languageCode={locale}
            latinRole="bold"
            align="start"
            fullWidth
            accessibilityRole="header"
          >
            {question}
          </AppText>
          {hint ? (
            <AppText
              style={styles.hint}
              languageCode={locale}
              align="start"
              fullWidth
            >
              {hint}
            </AppText>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const TAIL = 14;

function createStyles(
  theme: OnboardingTheme,
  metrics: OnboardingMetrics,
  isRtl: boolean,
) {
  /*
   * `left` / `right` stay physical under RTL in React Native, so the tail is
   * placed explicitly rather than with logical `start` / `end`. The row itself
   * *is* mirrored by the layout engine, which is why the physical side has to
   * flip with `isRtl` — in RTL the mascot ends up on the right and the tail has
   * to point back at it.
   */
  const tailSide = isRtl
    ? { right: -TAIL / 2 - 1 }
    : { left: -TAIL / 2 - 1 };

  const tailBorders = isRtl
    ? { borderTopWidth: 2, borderRightWidth: 2 }
    : { borderLeftWidth: 2, borderBottomWidth: 2 };

  return StyleSheet.create({
    row: {
      width: "100%",
      // RTL row order is mirrored by the layout engine (forceRTL / document.dir).
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    mascot: {
      width: metrics.mascotSize,
      height: metrics.mascotSize,
      flexShrink: 0,
    },
    bubbleWrap: {
      flex: 1,
      minWidth: 0,
      position: "relative",
    },
    bubble: {
      width: "100%",
      borderRadius: 18,
      borderCurve: "continuous",
      borderWidth: 2,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      paddingHorizontal: 14,
      paddingVertical: 12,
      gap: 4,
      ...onboardingLift(theme),
    },
    tail: {
      position: "absolute",
      top: "50%",
      marginTop: -TAIL / 2,
      ...tailSide,
      width: TAIL,
      height: TAIL,
      backgroundColor: theme.surface,
      borderColor: theme.border,
      ...tailBorders,
      transform: [{ rotate: "45deg" }],
      zIndex: 2,
    },
    question: {
      color: theme.ink,
      fontSize: metrics.questionSize,
      lineHeight: Math.round(metrics.questionSize * 1.32),
      letterSpacing: isRtl ? 0 : -0.3,
    },
    hint: {
      color: theme.mutedInk,
      fontSize: 13,
      lineHeight: 18,
    },
  });
}
