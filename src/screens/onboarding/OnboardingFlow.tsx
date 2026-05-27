import { PressableScale } from "@/components/animations";
import { OnboardingPrimaryButton } from "./components/OnboardingPrimaryButton";
import { useOnboardingStore } from "@/stores/useOnboardingStore";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { OnboardingHero, type OnboardingHeroVariant } from "./components/OnboardingHero";
import { OnboardingPathPicker } from "./components/OnboardingPathPicker";
import { OnboardingProgressDots } from "./components/OnboardingProgressDots";
import { ONBOARDING_COPY, type OnboardingLocale } from "./onboarding-copy";

const STEP_VARIANTS: OnboardingHeroVariant[] = [
  "welcome",
  "paths",
  "practice",
  "progress",
  "ready",
];

const STEP_COUNT = STEP_VARIANTS.length;

export function OnboardingFlow() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { height } = useWindowDimensions();
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);

  const [index, setIndex] = useState(0);
  const [locale, setLocale] = useState<OnboardingLocale>("en");
  const [selectedPath, setSelectedPath] = useState<"street" | "normal">("street");

  const copy = ONBOARDING_COPY[locale];
  const step = copy.steps[index]!;
  const variant = STEP_VARIANTS[index]!;
  const isLast = index === STEP_COUNT - 1;
  const isPathStep = variant === "paths";
  const compact = height < 700;

  const finish = useCallback(
    (path?: "street" | "normal") => {
      const mode = path ?? selectedPath;
      if (Platform.OS !== "web") {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      completeOnboarding(mode);
      router.replace({
        pathname: "/dashboard",
        params: { mode },
      });
    },
    [completeOnboarding, router, selectedPath],
  );

  const goNext = useCallback(() => {
    if (Platform.OS !== "web") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (isLast) {
      finish();
      return;
    }
    setIndex((i) => Math.min(i + 1, STEP_COUNT - 1));
  }, [finish, isLast]);

  const swipe = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-20, 20])
        .onEnd((e) => {
          if (e.translationX < -40) goNext();
        }),
    [goNext],
  );

  const titleSize = compact ? 24 : 28;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#F4F9FF", "#FFFFFF", "#FFFFFF"]}
        locations={[0, 0.35, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top + 8,
            paddingBottom: insets.bottom + 12,
          },
        ]}
      >
        <View style={styles.topBar}>
          <Text style={styles.brand}>Phingo</Text>
          <Pressable onPress={() => finish()} hitSlop={12}>
            <Text style={styles.skip}>{copy.skip}</Text>
          </Pressable>
        </View>

        <View style={styles.localeRow}>
          <LocaleChip
            label={copy.languageEn}
            active={locale === "en"}
            onPress={() => setLocale("en")}
          />
          <LocaleChip
            label={copy.languageKu}
            active={locale === "ku"}
            onPress={() => setLocale("ku")}
          />
        </View>

        <GestureDetector gesture={swipe}>
          <View style={styles.body}>
            <OnboardingHero variant={variant} />

            <Animated.View
              key={`${locale}-${index}`}
              entering={FadeInDown.duration(360).springify().damping(22)}
              exiting={FadeOutUp.duration(180)}
              style={styles.copy}
            >
              <Text
                style={[styles.title, { fontSize: titleSize, lineHeight: titleSize + 6 }]}
              >
                {step.title}
              </Text>
              <Text style={styles.subtitle} numberOfLines={compact ? 3 : 4}>
                {step.subtitle}
              </Text>

              {isPathStep ? (
                <OnboardingPathPicker
                  selected={selectedPath}
                  onSelect={setSelectedPath}
                  streetTitle={copy.pathStreetTitle}
                  streetSub={copy.pathStreetSub}
                  normalTitle={copy.pathNormalTitle}
                  normalSub={copy.pathNormalSub}
                />
              ) : null}
            </Animated.View>
          </View>
        </GestureDetector>

        <View style={styles.footer}>
          <OnboardingProgressDots total={STEP_COUNT} index={index} />

          <OnboardingPrimaryButton
            label={isLast ? copy.getStarted : copy.continue}
            color={isLast ? "#58CC02" : "#208AEF"}
            rimColor={isLast ? "#58A700" : "#1B6FD4"}
            onPress={goNext}
          />

          {!isLast ? (
            <Text style={styles.hint}>{copy.swipeHint}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

function LocaleChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <PressableScale onPress={onPress} scaleDown={0.96}>
      <View style={[styles.chip, active && styles.chipActive]}>
        <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
          {label}
        </Text>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 22,
    maxWidth: 480,
    width: "100%",
    alignSelf: "center",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  brand: {
    fontSize: 22,
    fontWeight: "800",
    color: "#208AEF",
    letterSpacing: -0.5,
  },
  skip: {
    fontSize: 15,
    fontWeight: "600",
    color: "#94A3B8",
  },
  localeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "rgba(255,255,255,0.85)",
  },
  chipActive: {
    borderColor: "#208AEF",
    backgroundColor: "rgba(32,138,239,0.1)",
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  chipLabelActive: {
    color: "#208AEF",
    fontWeight: "700",
  },
  body: {
    flex: 1,
    minHeight: 0,
    justifyContent: "center",
  },
  copy: {
    flexShrink: 1,
    paddingTop: 4,
  },
  title: {
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.6,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
    color: "#64748B",
  },
  footer: {
    flexShrink: 0,
    gap: 12,
    paddingTop: 8,
  },
  hint: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "500",
    color: "#94A3B8",
    marginTop: -4,
  },
});
