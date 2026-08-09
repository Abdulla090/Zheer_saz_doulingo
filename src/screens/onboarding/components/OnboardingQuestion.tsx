import React from "react";
import { Image, StyleSheet, View } from "react-native";

import { AppText } from "../../../components/ui/AppText";
import { getMascotExpressionSource } from "../../../constants/mascot-expressions";
import type { MascotExpression } from "../../../constants/mascot-expressions";
import type { OnboardingMetrics, OnboardingTheme } from "./onboarding-theme";

/**
 * Reference-matched conversational header: the selected mascot asks one short
 * question in a low-contrast outlined speech bubble. The bubble deliberately
 * uses the canvas family rather than white, so it reads as dialogue without
 * recreating the intrusive white label boxes that existed across the old UI.
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
        resizeMode="contain"
      />

      <View style={styles.bubble}>
        <View
          pointerEvents="none"
          style={[
            styles.tail,
            isRtl ? styles.tailRtl : styles.tailLtr,
          ]}
        />
        <View style={styles.copy}>
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

function createStyles(
  theme: OnboardingTheme,
  metrics: OnboardingMetrics,
  isRtl: boolean,
) {
  return StyleSheet.create({
    row: {
      width: "100%",
      // RTL row order is mirrored by the layout engine (forceRTL / document.dir).
      flexDirection: "row",
      alignItems: "center",
      gap: 13,
      minHeight: metrics.mascotSize + 8,
    },
    mascot: {
      width: metrics.mascotSize,
      height: metrics.mascotSize,
      flexShrink: 0,
    },
    bubble: {
      position: "relative",
      flex: 1,
      minWidth: 0,
      minHeight: 76,
      justifyContent: "center",
      paddingHorizontal: 17,
      paddingVertical: 13,
      borderRadius: 15,
      borderCurve: "continuous",
      borderWidth: 1,
      borderBottomWidth: 3,
      borderColor: theme.bubbleBorder,
      backgroundColor: theme.bubble,
    },
    tail: {
      position: "absolute",
      top: 27,
      width: 14,
      height: 14,
      backgroundColor: theme.bubble,
      transform: [{ rotate: "45deg" }],
    },
    tailLtr: {
      left: -8,
      borderLeftWidth: 1,
      borderBottomWidth: 1,
      borderColor: theme.bubbleBorder,
    },
    tailRtl: {
      right: -8,
      borderRightWidth: 1,
      borderTopWidth: 1,
      borderColor: theme.bubbleBorder,
    },
    copy: {
      width: "100%",
      gap: 4,
    },
    question: {
      color: theme.ink,
      fontSize: metrics.questionSize,
      lineHeight: Math.round(metrics.questionSize * 1.28),
      letterSpacing: isRtl ? 0 : -0.3,
    },
    hint: {
      color: theme.mutedInk,
      fontSize: 13.5,
      lineHeight: 19,
    },
  });
}
