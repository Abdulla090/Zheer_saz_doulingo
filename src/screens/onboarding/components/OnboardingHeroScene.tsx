import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowUp01Icon,
  FireIcon,
  Mic01Icon,
  Trophy,
} from "@hugeicons/core-free-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
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

import { TwinoMascot } from "../../../components/mascot/TwinoMascot";
import { useOnboardingTheme, type OnboardingTheme } from "./onboarding-theme";

/**
 * Intro artwork stays deliberately focused: one recognisable object per slide.
 * The pager owns the motion, so scenes do not stack competing entrance effects.
 */
export type OnboardingSceneVariant = "welcome" | "practice" | "progress";

export function OnboardingHeroScene({
  variant,
  height = 330,
}: {
  variant: OnboardingSceneVariant;
  height?: number;
}) {
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
  const theme = useOnboardingTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const reduceMotion = useReducedMotion();
  const baseReveal = useSharedValue(reduceMotion ? 1 : 0);
  const subjectReveal = useSharedValue(reduceMotion ? 1 : 0);
  const detailReveal = useSharedValue(reduceMotion ? 1 : 0);
  const finishReveal = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    const values = [baseReveal, subjectReveal, detailReveal, finishReveal];
    values.forEach(cancelAnimation);

    if (reduceMotion) {
      values.forEach((value) => {
        value.value = 1;
      });
      return;
    }

    values.forEach((value) => {
      value.value = 0;
    });
    const ease = Easing.bezier(0.22, 1, 0.36, 1);
    baseReveal.value = withTiming(1, { duration: 440, easing: ease });
    subjectReveal.value = withDelay(
      160,
      withTiming(1, { duration: 440, easing: ease }),
    );
    detailReveal.value = withDelay(
      340,
      withTiming(1, { duration: 380, easing: ease }),
    );
    finishReveal.value = withDelay(
      520,
      withTiming(1, { duration: 340, easing: ease }),
    );

    return () => values.forEach(cancelAnimation);
  }, [baseReveal, detailReveal, finishReveal, reduceMotion, subjectReveal, variant]);

  const baseMotion = useAnimatedStyle(() => ({
    opacity: baseReveal.value,
    transform: [
      { translateY: interpolate(baseReveal.value, [0, 1], [16, 0]) },
      { scale: interpolate(baseReveal.value, [0, 1], [0.84, 1]) },
    ],
  }));
  const subjectMotion = useAnimatedStyle(() => ({
    opacity: subjectReveal.value,
    transform: [
      { translateY: interpolate(subjectReveal.value, [0, 1], [24, 0]) },
      { scale: interpolate(subjectReveal.value, [0, 1], [0.9, 1]) },
    ],
  }));
  const detailMotion = useAnimatedStyle(() => ({
    opacity: detailReveal.value,
    transform: [
      { translateY: interpolate(detailReveal.value, [0, 1], [12, 0]) },
      { scale: interpolate(detailReveal.value, [0, 1], [0.62, 1]) },
    ],
  }));
  const finishMotion = useAnimatedStyle(() => ({
    opacity: finishReveal.value,
    transform: [
      { translateX: interpolate(finishReveal.value, [0, 1], [14, 0]) },
      { scale: interpolate(finishReveal.value, [0, 1], [0.76, 1]) },
    ],
  }));
  const motion = { baseMotion, subjectMotion, detailMotion, finishMotion };

  return (
    <View style={[styles.stage, { height }]}>
      <View style={[styles.scene, { transform: [{ scale }] }]}>
        {variant === "welcome" ? (
          <BrandStone styles={styles} motion={motion} />
        ) : variant === "practice" ? (
          <SpeakingDisc styles={styles} motion={motion} />
        ) : (
          <ProgressMomentum styles={styles} theme={theme} motion={motion} />
        )}
      </View>
    </View>
  );
}

type HeroStyles = ReturnType<typeof createStyles>;
type HeroMotion = {
  baseMotion: React.ComponentProps<typeof Animated.View>["style"];
  subjectMotion: React.ComponentProps<typeof Animated.View>["style"];
  detailMotion: React.ComponentProps<typeof Animated.View>["style"];
  finishMotion: React.ComponentProps<typeof Animated.View>["style"];
};

function BrandStone({ styles, motion }: { styles: HeroStyles; motion: HeroMotion }) {
  return (
    <Animated.View style={[styles.heroHalo, motion.baseMotion]}>
      <Animated.View style={motion.subjectMotion}>
        <TwinoMascot size={188} pose="wave" mascotId="pingo" />
      </Animated.View>
      <Animated.View style={[styles.greetingMarks, motion.detailMotion]}>
        <View style={[styles.greetingMark, styles.greetingMarkLong]} />
        <View style={styles.greetingMark} />
        <View style={[styles.greetingMark, styles.greetingMarkShort]} />
      </Animated.View>
    </Animated.View>
  );
}

function SpeakingDisc({ styles, motion }: { styles: HeroStyles; motion: HeroMotion }) {
  return (
    <Animated.View style={[styles.heroHalo, motion.baseMotion]}>
      <Animated.View style={motion.subjectMotion}>
        <TwinoMascot size={184} pose="headset" mascotId="pingo" />
      </Animated.View>
      <Animated.View style={[styles.voiceBars, motion.detailMotion]}>
        <View style={[styles.voiceBar, styles.voiceBarShort]} />
        <View style={[styles.voiceBar, styles.voiceBarTall]} />
        <View style={styles.voiceBar} />
      </Animated.View>
      <Animated.View style={[styles.micBadge, motion.finishMotion]}>
        <HugeiconsIcon
          icon={Mic01Icon}
          size={28}
          color="#FFFFFF"
          strokeWidth={2.2}
        />
      </Animated.View>
    </Animated.View>
  );
}

/**
 * A compact momentum object rather than a generic analytics card. The top rail
 * reads as a seven-day streak; the lower gold podium reads as league progress.
 * It communicates both concepts without fake labels, scores, or decorative UI.
 */
function ProgressMomentum({
  styles,
  theme,
  motion,
}: {
  styles: HeroStyles;
  theme: OnboardingTheme;
  motion: HeroMotion;
}) {
  return (
    <View style={styles.progressScene}>
      <Animated.View style={motion.baseMotion}>
        <LinearGradient
          colors={
            theme.isDark
              ? (["#202933", "#151C23"] as const)
              : (["#FFFFFF", "#EEF1F4"] as const)
          }
          start={{ x: 0.08, y: 0 }}
          end={{ x: 0.92, y: 1 }}
          style={styles.progressPanel}
        >
          <Animated.View style={[styles.streakRow, motion.subjectMotion]}>
            <View style={styles.streakIcon}>
              <HugeiconsIcon
                icon={FireIcon}
                size={24}
                color={theme.accent}
                fill={theme.accent}
                strokeWidth={2}
              />
            </View>

            <View style={styles.weekRail}>
              <View style={styles.weekTrack} />
              <LinearGradient
                colors={[theme.accent, theme.accentPressed]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.weekTrackActive}
              />
              <View style={styles.weekDots}>
                {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                  <View
                    key={day}
                    style={[
                      styles.weekDot,
                      day < 5 && styles.weekDotComplete,
                      day === 5 && styles.weekDotCurrent,
                    ]}
                  />
                ))}
              </View>
            </View>
          </Animated.View>

          <Animated.View style={motion.detailMotion}>
            <View style={styles.divider} />

            <View style={styles.leagueRow}>
              <LinearGradient
                colors={["#FFF1A0", "#D49A20", "#815007"]}
                start={{ x: 0.18, y: 0 }}
                end={{ x: 0.82, y: 1 }}
                style={styles.trophySeal}
              >
                <HugeiconsIcon
                  icon={Trophy}
                  size={24}
                  color="#5C3704"
                  strokeWidth={2.25}
                />
              </LinearGradient>

              <View style={styles.podium}>
                <View style={[styles.podiumStep, styles.podiumThird]} />
                <View style={[styles.podiumStep, styles.podiumFirst]} />
                <View style={[styles.podiumStep, styles.podiumSecond]} />
              </View>

              <View style={styles.riseMark}>
                <HugeiconsIcon
                  icon={ArrowUp01Icon}
                  size={20}
                  color={theme.accent}
                  strokeWidth={2.4}
                />
              </View>
            </View>
          </Animated.View>
        </LinearGradient>
      </Animated.View>

      <Animated.View style={[styles.mascotMedallion, motion.finishMotion]}>
        <TwinoMascot size={108} pose="winning" mascotId="pingo" />
      </Animated.View>
    </View>
  );
}

function createStyles(theme: OnboardingTheme) {
  return StyleSheet.create({
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
    heroHalo: {
      width: 214,
      height: 214,
      borderRadius: 107,
      borderCurve: "continuous",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.accentWash,
      borderWidth: 1,
      borderBottomWidth: 4,
      borderColor: theme.accentBorder,
      borderBottomColor: theme.accentPressed,
    },
    greetingMarks: {
      position: "absolute",
      top: 35,
      right: -18,
      gap: 5,
      transform: [{ rotate: "-18deg" }],
    },
    greetingMark: {
      width: 18,
      height: 5,
      borderRadius: 99,
      backgroundColor: theme.accent,
    },
    greetingMarkLong: {
      width: 27,
    },
    greetingMarkShort: {
      width: 11,
    },
    voiceBars: {
      position: "absolute",
      left: 12,
      bottom: 28,
      height: 44,
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 10,
      borderRadius: 14,
      borderCurve: "continuous",
      backgroundColor: theme.surfaceRaised,
      borderWidth: 3,
      borderColor: theme.canvas,
    },
    voiceBar: {
      width: 4,
      height: 20,
      borderRadius: 99,
      backgroundColor: theme.accent,
    },
    voiceBarShort: {
      height: 10,
    },
    voiceBarTall: {
      height: 28,
    },
    micBadge: {
      position: "absolute",
      right: 10,
      bottom: 18,
      width: 52,
      height: 52,
      borderRadius: 18,
      borderCurve: "continuous",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.accent,
      borderWidth: 4,
      borderColor: theme.canvas,
    },
    progressScene: {
      width: 286,
      height: 226,
      alignItems: "center",
      justifyContent: "flex-start",
      paddingTop: 4,
    },
    progressPanel: {
      width: 270,
      height: 178,
      borderRadius: 24,
      borderCurve: "continuous",
      paddingHorizontal: 18,
      paddingTop: 18,
      paddingBottom: 16,
      borderWidth: 1,
      borderColor: theme.border,
      overflow: "hidden",
      boxShadow: theme.isDark
        ? "0 14px 30px rgba(0,0,0,0.28)"
        : "0 14px 30px rgba(26,32,44,0.11)",
    },
    streakRow: {
      height: 46,
      flexDirection: "row",
      alignItems: "center",
      gap: 13,
    },
    streakIcon: {
      width: 42,
      height: 42,
      borderRadius: 14,
      borderCurve: "continuous",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.accentWash,
      borderWidth: 1,
      borderColor: theme.accentBorder,
    },
    weekRail: {
      flex: 1,
      height: 28,
      justifyContent: "center",
    },
    weekTrack: {
      position: "absolute",
      left: 4,
      right: 4,
      height: 3,
      borderRadius: 99,
      backgroundColor: theme.ringTrack,
    },
    weekTrackActive: {
      position: "absolute",
      left: 4,
      width: "72%",
      height: 3,
      borderRadius: 99,
    },
    weekDots: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    weekDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.ringTrack,
      borderWidth: 2,
      borderColor: theme.surfaceRaised,
    },
    weekDotComplete: {
      backgroundColor: theme.accent,
    },
    weekDotCurrent: {
      width: 13,
      height: 13,
      borderRadius: 7,
      backgroundColor: theme.surfaceRaised,
      borderWidth: 3,
      borderColor: theme.accent,
    },
    divider: {
      height: 1,
      backgroundColor: theme.border,
      marginTop: 14,
      marginBottom: 13,
    },
    leagueRow: {
      height: 54,
      flexDirection: "row",
      alignItems: "center",
      gap: 13,
      paddingRight: 72,
    },
    trophySeal: {
      width: 44,
      height: 44,
      borderRadius: 15,
      borderCurve: "continuous",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "#F4D66E",
    },
    podium: {
      flex: 1,
      height: 42,
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 5,
    },
    podiumStep: {
      flex: 1,
      maxWidth: 22,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      backgroundColor: theme.borderStrong,
    },
    podiumFirst: {
      height: 40,
      backgroundColor: "#C88916",
    },
    podiumSecond: {
      height: 29,
    },
    podiumThird: {
      height: 21,
    },
    riseMark: {
      width: 30,
      height: 30,
      borderRadius: 10,
      borderCurve: "continuous",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.accentWash,
    },
    mascotMedallion: {
      position: "absolute",
      right: 0,
      bottom: 0,
      width: 112,
      height: 112,
      borderRadius: 56,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.canvas,
      borderWidth: 5,
      borderColor: theme.surfaceRaised,
      overflow: "hidden",
      boxShadow: theme.isDark
        ? "0 8px 18px rgba(0,0,0,0.35)"
        : "0 8px 18px rgba(26,32,44,0.13)",
    },
  });
}
