import { HugeiconsIcon } from "@hugeicons/react-native";
import { Mic01Icon } from "@hugeicons/core-free-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  useReducedMotion,
} from "react-native-reanimated";

import { AppText } from "../../../components/ui/AppText";
import {
  ONBOARDING_DESIGN,
  ONBOARDING_PAPER_SHADOW,
} from "./onboarding-design";

/**
 * Intro slide artwork — one object per slide, nothing behind it.
 *
 * Each scene used to stack a rotated paper wash, one or two orbit ellipses,
 * loose accent dots and a staggered cast of chips/wave bars/flags on top of its
 * subject. Five separate entering animations fired per slide. The subject was
 * the smallest-contrast thing on screen and the eye had nowhere to land.
 *
 * Now a scene is its subject: the brand stone, the mic, the climbing bars. The
 * canvas gradient behind them is the only background — see `OnboardingSkiaBg`.
 * One `FadeIn` per scene, so paging reads as the content arriving rather than a
 * sequence assembling itself.
 */

export type OnboardingSceneVariant = "welcome" | "practice" | "progress";

export function OnboardingHeroScene({
  variant,
  height = 330,
}: {
  variant: OnboardingSceneVariant;
  height?: number;
}) {
  const reduceMotion = useReducedMotion();
  const scale =
    height < 230
      ? 0.78
      : height < 300
        ? 0.92
        : height < 380
          ? 1.04
          : height < 480
            ? 1.14
            : 1.2;

  return (
    <View style={[styles.stage, { height }]}>
      <Animated.View
        entering={reduceMotion ? undefined : FadeIn.duration(260)}
        style={[styles.scene, { transform: [{ scale }] }]}
      >
        {variant === "welcome" ? (
          <BrandStone />
        ) : variant === "practice" ? (
          <SpeakingDisc />
        ) : (
          <ProgressBars />
        )}
      </Animated.View>
    </View>
  );
}

function BrandStone() {
  return (
    <View style={[styles.stone, ONBOARDING_PAPER_SHADOW]}>
      <LinearGradient colors={["#FFFDF8", "#EEE7DC"]} style={styles.fill}>
        <AppText style={styles.stoneMark} forceLatinFont latinRole="regular">
          t
        </AppText>
      </LinearGradient>
    </View>
  );
}

function SpeakingDisc() {
  return (
    <View style={[styles.disc, ONBOARDING_PAPER_SHADOW]}>
      <LinearGradient colors={["#FFFDF8", "#EEE7DC"]} style={styles.fill}>
        <HugeiconsIcon
          icon={Mic01Icon}
          size={64}
          color={ONBOARDING_DESIGN.orange}
          strokeWidth={1.8}
        />
      </LinearGradient>
    </View>
  );
}

function ProgressBars() {
  const bars = [0, 1, 2, 3];
  const last = bars.length - 1;

  return (
    <View style={styles.barsRow}>
      {bars.map((bar) => (
        <View
          key={bar}
          style={[
            styles.bar,
            { height: 64 + bar * 44 },
            // The tallest bar carries the accent: one point of arrival, so the
            // row reads as progress rather than as four neutral rectangles.
            bar === last && styles.barAccent,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
  },
  scene: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  fill: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  stone: {
    width: 152,
    height: 196,
    borderRadius: 76,
    overflow: "hidden",
  },
  stoneMark: {
    color: "#B2A89A",
    fontSize: 92,
    lineHeight: 100,
  },
  disc: {
    width: 168,
    height: 168,
    borderRadius: 84,
    overflow: "hidden",
  },
  barsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 14,
  },
  bar: {
    width: 46,
    borderRadius: 14,
    backgroundColor: ONBOARDING_DESIGN.lavender,
  },
  barAccent: {
    backgroundColor: ONBOARDING_DESIGN.accent,
  },
});
