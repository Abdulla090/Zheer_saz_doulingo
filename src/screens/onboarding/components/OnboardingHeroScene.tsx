import { HugeiconsIcon } from "@hugeicons/react-native";
import { Mic01Icon } from "@hugeicons/core-free-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useReducedMotion,
} from "react-native-reanimated";

import { AppText } from "../../../components/ui/AppText";
import {
  ONBOARDING_DESIGN,
  ONBOARDING_PAPER_SHADOW,
} from "./onboarding-design";

export type OnboardingSceneVariant = "welcome" | "practice" | "progress";

export function OnboardingHeroScene({
  variant,
  height = 330,
}: {
  variant: OnboardingSceneVariant;
  height?: number;
}) {
  const reduceMotion = useReducedMotion();
  const responsiveScale =
    height < 230
      ? 0.78
      : height < 300
        ? 0.92
        : height < 380
          ? 1.04
          : height < 480
            ? 1.14
            : 1.2;
  const scale =
    variant === "progress" ? Math.min(responsiveScale, 1.08) : responsiveScale;

  return (
    <View style={[styles.stage, { height }]}>
      {variant === "welcome" ? (
        <LanguageOrbit reduceMotion={reduceMotion} scale={scale} />
      ) : variant === "practice" ? (
        <SpeakingDisc reduceMotion={reduceMotion} scale={scale} />
      ) : (
        <StreakSteps reduceMotion={reduceMotion} scale={scale} />
      )}
    </View>
  );
}

function LanguageOrbit({ reduceMotion, scale }: { reduceMotion: boolean; scale: number }) {
  const chips = [
    { label: "EN", style: styles.chipTop },
    { label: "KU", style: styles.chipRight },
    { label: "عربي", style: styles.chipBottomRight, languageCode: "ar" },
    { label: "RU", style: styles.chipBottomLeft },
    { label: "ES", style: styles.chipLeft },
  ];

  return (
    <Animated.View
      entering={reduceMotion ? undefined : FadeIn.duration(260)}
      style={[styles.scene, { transform: [{ scale }] }]}
    >
      <View style={[styles.paperWash, styles.paperWashWelcome]} />
      <View style={styles.orbitLarge} />
      <View style={styles.orbitSmall} />
      <View style={[styles.orbitDot, styles.orbitDotPurple]} />
      <View style={[styles.orbitDot, styles.orbitDotOrange]} />

      <View style={[styles.languageStone, ONBOARDING_PAPER_SHADOW]}>
        <LinearGradient
          colors={["#FFFDF8", "#EEE7DC"]}
          style={styles.languageStoneFill}
        >
          <AppText style={styles.stoneMark} forceLatinFont latinRole="regular">
            t
          </AppText>
        </LinearGradient>
      </View>

      {chips.map((chip, index) => (
        <Animated.View
          key={chip.label}
          entering={reduceMotion ? undefined : FadeInDown.delay(70 + index * 35).duration(240)}
          style={[styles.languageChip, chip.style, ONBOARDING_PAPER_SHADOW]}
        >
          <AppText
            style={styles.languageChipText}
            languageCode={chip.languageCode ?? "en"}
            forceLatinFont={!chip.languageCode}
            latinRole="medium"
          >
            {chip.label}
          </AppText>
        </Animated.View>
      ))}
    </Animated.View>
  );
}

function SpeakingDisc({ reduceMotion, scale }: { reduceMotion: boolean; scale: number }) {
  return (
    <Animated.View
      entering={reduceMotion ? undefined : FadeIn.duration(260)}
      style={[styles.scene, { transform: [{ scale }] }]}
    >
      <View style={[styles.paperWash, styles.paperWashPractice]} />
      <View style={styles.waveLeft}>{renderWaveBars()}</View>
      <View style={styles.waveRight}>{renderWaveBars()}</View>
      <View style={styles.practiceOrbit} />
      <View style={[styles.orbitDot, styles.practiceDot]} />

      <Animated.View
        entering={reduceMotion ? undefined : FadeInUp.delay(50).duration(300)}
        style={[styles.speakingOuter, ONBOARDING_PAPER_SHADOW]}
      >
        <View style={styles.speakingMiddle}>
          <LinearGradient
            colors={["#FFFDF8", "#EEE7DC"]}
            style={[styles.speakingButton, ONBOARDING_PAPER_SHADOW]}
          >
            <HugeiconsIcon
              icon={Mic01Icon}
              size={62}
              color={ONBOARDING_DESIGN.orange}
              strokeWidth={1.8}
            />
          </LinearGradient>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

function renderWaveBars() {
  return [8, 18, 30, 46, 28, 17, 9].map((height, index) => (
    <View key={`${height}-${index}`} style={[styles.waveBar, { height }]} />
  ));
}

function StreakSteps({ reduceMotion, scale }: { reduceMotion: boolean; scale: number }) {
  const steps = [0, 1, 2, 3, 4];
  return (
    <Animated.View
      entering={reduceMotion ? undefined : FadeIn.duration(260)}
      style={[styles.scene, { transform: [{ scale }] }]}
    >
      <View style={[styles.paperWash, styles.paperWashProgress]} />
      <View style={styles.progressOrbit} />
      <View style={[styles.orbitDot, styles.progressDot]} />

      <Animated.View
        entering={reduceMotion ? undefined : FadeInUp.delay(40).duration(330)}
        style={styles.stepsRow}
      >
        {steps.map((step) => (
          <View
            key={step}
            style={[
              styles.stepBlock,
              { height: 48 + step * 31 },
              ONBOARDING_PAPER_SHADOW,
            ]}
          >
            <LinearGradient
              colors={["#F9F6FB", "#E0D9E8"]}
              start={{ x: 0.15, y: 0 }}
              end={{ x: 0.9, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.stepHighlight} />
          </View>
        ))}
        <View style={styles.flagPole} />
        <View style={[styles.flag, ONBOARDING_PAPER_SHADOW]}>
          <AppText style={styles.flagText} forceLatinFont latinRole="regular">
            t
          </AppText>
        </View>
      </Animated.View>
    </Animated.View>
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
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  paperWash: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(224,216,234,0.62)",
  },
  paperWashWelcome: {
    width: "76%",
    height: "72%",
    right: "-4%",
    bottom: "3%",
    transform: [{ rotate: "-14deg" }],
  },
  paperWashPractice: {
    width: "72%",
    height: "88%",
    right: "-10%",
    top: "7%",
    transform: [{ rotate: "18deg" }],
  },
  paperWashProgress: {
    width: "96%",
    height: "78%",
    left: "4%",
    bottom: "0%",
    transform: [{ rotate: "-8deg" }],
  },
  orbitLarge: {
    position: "absolute",
    width: "72%",
    aspectRatio: 1.35,
    borderRadius: 999,
    borderWidth: 1.4,
    borderColor: "rgba(181,167,207,0.86)",
    transform: [{ rotate: "-12deg" }],
  },
  orbitSmall: {
    position: "absolute",
    width: "54%",
    aspectRatio: 1.3,
    borderRadius: 999,
    borderWidth: 1.2,
    borderColor: "rgba(234,122,36,0.46)",
    transform: [{ rotate: "22deg" }],
  },
  orbitDot: {
    position: "absolute",
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  orbitDotPurple: {
    left: "19%",
    top: "29%",
    backgroundColor: ONBOARDING_DESIGN.lavenderDeep,
  },
  orbitDotOrange: {
    right: "25%",
    bottom: "14%",
    backgroundColor: ONBOARDING_DESIGN.orange,
  },
  languageStone: {
    width: 146,
    height: 188,
    borderRadius: 72,
    overflow: "hidden",
    transform: [{ rotate: "-7deg" }],
    zIndex: 2,
  },
  languageStoneFill: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  stoneMark: {
    color: "#B2A89A",
    fontSize: 88,
    lineHeight: 96,
  },
  languageChip: {
    position: "absolute",
    minWidth: 62,
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 17,
    backgroundColor: ONBOARDING_DESIGN.paperRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.82)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3,
  },
  languageChipText: {
    color: ONBOARDING_DESIGN.ink,
    fontSize: 17,
    lineHeight: 23,
  },
  chipTop: { top: "5%", left: "44%" },
  chipRight: { right: "7%", top: "31%" },
  chipBottomRight: { right: "17%", bottom: "5%" },
  chipBottomLeft: { left: "27%", bottom: "0%" },
  chipLeft: { left: "4%", bottom: "22%" },
  speakingOuter: {
    width: 246,
    height: 246,
    borderRadius: 123,
    backgroundColor: "rgba(246,241,232,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  speakingMiddle: {
    width: 188,
    height: 188,
    borderRadius: 94,
    backgroundColor: "#F4EEE5",
    alignItems: "center",
    justifyContent: "center",
  },
  speakingButton: {
    width: 138,
    height: 138,
    borderRadius: 69,
    alignItems: "center",
    justifyContent: "center",
  },
  practiceOrbit: {
    position: "absolute",
    width: "70%",
    aspectRatio: 1.4,
    borderRadius: 999,
    borderWidth: 1.4,
    borderColor: "rgba(181,167,207,0.76)",
    transform: [{ rotate: "12deg" }],
  },
  practiceDot: {
    right: "12%",
    top: "25%",
    backgroundColor: ONBOARDING_DESIGN.lavenderDeep,
  },
  waveLeft: {
    position: "absolute",
    left: "0%",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  waveRight: {
    position: "absolute",
    right: "0%",
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
  },
  waveBar: {
    width: 3,
    borderRadius: 3,
    backgroundColor: "rgba(181,167,207,0.76)",
  },
  progressOrbit: {
    position: "absolute",
    width: "88%",
    height: "70%",
    bottom: "3%",
    borderRadius: 999,
    borderWidth: 1.4,
    borderColor: "rgba(181,167,207,0.72)",
    transform: [{ rotate: "-10deg" }],
  },
  progressDot: {
    right: "7%",
    bottom: "22%",
    backgroundColor: ONBOARDING_DESIGN.orange,
  },
  stepsRow: {
    width: "88%",
    height: "86%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingBottom: 18,
    position: "relative",
  },
  stepBlock: {
    width: "19%",
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    marginLeft: -1,
    overflow: "hidden",
  },
  stepHighlight: {
    position: "absolute",
    top: 0,
    left: 2,
    right: 2,
    height: 2,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.86)",
  },
  flagPole: {
    position: "absolute",
    right: "3%",
    top: "0%",
    width: 5,
    height: 94,
    borderRadius: 3,
    backgroundColor: "#B9AC99",
  },
  flag: {
    position: "absolute",
    right: "-4%",
    top: "3%",
    width: 72,
    height: 46,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: ONBOARDING_DESIGN.paperRaised,
    alignItems: "center",
    justifyContent: "center",
  },
  flagText: {
    color: ONBOARDING_DESIGN.ink,
    fontSize: 28,
    lineHeight: 32,
  },
});
