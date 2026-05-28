import {
  HomeLiquidButton,
  HomeMeshBackground,
  HomePalette,
  HomeType,
} from "@/components/ui/ios-liquid-home";
import { useI18n } from "@/hooks/useI18n";
import { Motion } from "@/screens/lesson/games/game-design";
import { useLocaleStore } from "@/stores/useLocaleStore";
import { useOnboardingStore } from "@/stores/useOnboardingStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { crossShadow } from "@/utils/shadows";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { OnboardingHeroScene, type OnboardingSceneVariant } from "./components/OnboardingHeroScene";
import { OnboardingPathPicker } from "./components/OnboardingPathPicker";
import { OnboardingProgressDots } from "./components/OnboardingProgressDots";

const C = HomePalette;

type StepId = "welcome" | "paths" | "practice" | "progress" | "ready";

const STEP_ORDER: StepId[] = ["welcome", "paths", "practice", "progress", "ready"];

export function OnboardingFlow() {
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const compact = screenHeight < 720;
  const heroHeight = compact
    ? Math.min(200, Math.round(screenHeight * 0.26))
    : Math.min(260, Math.round(screenHeight * 0.32));
  const { t, locale, setEnglish, setKurdish } = useI18n();
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);
  const pathMode = useSettingsStore((s) => s.pathMode);
  const setPathMode = useSettingsStore((s) => s.setPathMode);
  const localeReady = useLocaleStore((s) => s.ready);

  const [index, setIndex] = useState(0);
  const [selectedPath, setSelectedPath] = useState<"street" | "normal">(pathMode);

  const stepId = STEP_ORDER[index] ?? "welcome";
  const isLast = index === STEP_ORDER.length - 1;
  const showPathPicker = stepId === "paths";

  const copy = useMemo(() => {
    const map: Record<
      StepId,
      { title: string; subtitle: string; variant: OnboardingSceneVariant }
    > = {
      welcome: {
        title: t("onboarding.welcomeTitle"),
        subtitle: t("onboarding.welcomeSubtitle"),
        variant: "welcome",
      },
      paths: {
        title: t("onboarding.pathsTitle"),
        subtitle: t("onboarding.pathsSubtitle"),
        variant: "paths",
      },
      practice: {
        title: t("onboarding.practiceTitle"),
        subtitle: t("onboarding.practiceSubtitle"),
        variant: "practice",
      },
      progress: {
        title: t("onboarding.progressTitle"),
        subtitle: t("onboarding.progressSubtitle"),
        variant: "progress",
      },
      ready: {
        title: t("onboarding.readyTitle"),
        subtitle: t("onboarding.readySubtitle"),
        variant: "ready",
      },
    };
    return map[stepId];
  }, [stepId, t]);

  const finish = useCallback(() => {
    setPathMode(selectedPath);
    if (Platform.OS !== "web") {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    completeOnboarding();
  }, [completeOnboarding, selectedPath, setPathMode]);

  const goNext = useCallback(() => {
    if (Platform.OS !== "web") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (isLast) {
      finish();
      return;
    }
    setIndex((i) => Math.min(i + 1, STEP_ORDER.length - 1));
  }, [finish, isLast]);

  const skip = useCallback(() => {
    finish();
  }, [finish]);

  const swipeAdvance = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-24, 24])
        .onEnd((e) => {
          if (e.translationX < -48 && e.velocityX < 0) {
            goNext();
          }
        }),
    [goNext],
  );

  if (!localeReady) {
    return <View style={styles.root} />;
  }

  return (
    <View style={styles.root}>
      <HomeMeshBackground />

      <LinearGradient
        colors={["rgba(43,89,243,0.08)", "transparent", "rgba(255,200,0,0.06)"]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <View
        style={[
          styles.container,
          { paddingTop: insets.top + (compact ? 6 : 10) },
        ]}
      >
        <View style={styles.topBar}>
          <Text style={[styles.brand, compact && styles.brandCompact]}>
            Phingo
          </Text>
          <Pressable
            onPress={skip}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={t("onboarding.skip")}
          >
            <Text style={styles.skip}>{t("onboarding.skip")}</Text>
          </Pressable>
        </View>

        <View style={styles.localeRow}>
          <LocaleChip
            label={t("settings.languageEn")}
            active={locale === "en"}
            onPress={setEnglish}
          />
          <LocaleChip
            label={t("settings.languageKu")}
            active={locale === "ku"}
            onPress={setKurdish}
          />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <GestureDetector gesture={swipeAdvance}>
            <View>
              <OnboardingHeroScene variant={copy.variant} height={heroHeight} />

              <Animated.View
                key={stepId}
                entering={FadeInDown.duration(480)
                  .springify()
                  .damping(22)
                  .stiffness(280)}
                exiting={FadeOutUp.duration(220)}
                style={styles.copyBlock}
              >
                <Text style={[styles.title, compact && styles.titleCompact]}>
                  {copy.title}
                </Text>
                <Text style={[styles.subtitle, compact && styles.subtitleCompact]}>
                  {copy.subtitle}
                </Text>

                {showPathPicker ? (
                  <OnboardingPathPicker
                    selected={selectedPath}
                    onSelect={setSelectedPath}
                    streetTitle={t("onboarding.pathStreetTitle")}
                    streetSub={t("onboarding.pathStreetSub")}
                    normalTitle={t("onboarding.pathNormalTitle")}
                    normalSub={t("onboarding.pathNormalSub")}
                  />
                ) : null}
              </Animated.View>
            </View>
          </GestureDetector>
        </ScrollView>

        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, 12) + 4 },
          ]}
        >
          <OnboardingProgressDots total={STEP_ORDER.length} index={index} />

          <Animated.View
            entering={FadeIn.delay(200).duration(400)}
            style={styles.ctaWrap}
          >
            <HomeLiquidButton
              label={
                isLast ? t("onboarding.getStarted") : t("onboarding.continue")
              }
              onPress={goNext}
              color={isLast ? "#58CC02" : C.blue}
              style={styles.cta}
            />
          </Animated.View>

          {!isLast ? (
            <Animated.View exiting={FadeOut.duration(150)}>
              <Text style={styles.hint}>{t("onboarding.swipeHint")}</Text>
            </Animated.View>
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
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={anim}>
      <Pressable
        onPress={() => {
          if (Platform.OS !== "web") {
            void Haptics.selectionAsync();
          }
          onPress();
        }}
        onPressIn={() => {
          scale.value = withSpring(0.94, Motion.soft);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, Motion.soft);
        }}
        style={[styles.localeChip, active && styles.localeChipActive]}
        accessibilityRole="button"
        accessibilityState={{ selected: active }}
      >
        <Text style={[styles.localeLabel, active && styles.localeLabelActive]}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.meshBottom,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  brand: {
    ...HomeType.logo,
    fontSize: 26,
    color: C.blue,
  },
  skip: {
    fontSize: 15,
    fontWeight: "600",
    color: C.grayLight,
    fontFamily: "DINNextRoundedMedium",
  },
  localeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 4,
  },
  localeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: C.divider,
    backgroundColor: "rgba(255,255,255,0.72)",
  },
  localeChipActive: {
    borderColor: C.blue,
    backgroundColor: "rgba(43,89,243,0.12)",
  },
  localeLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: C.gray,
    fontFamily: "DINNextRoundedMedium",
  },
  localeLabelActive: {
    color: C.blue,
    fontWeight: "700",
    fontFamily: "DINNextRoundedBold",
  },
  swipeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 8,
  },
  copyBlock: {
    justifyContent: "flex-start",
    paddingTop: 4,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    color: C.navy,
    fontFamily: "DINNextRoundedBold",
    letterSpacing: -0.8,
  },
  titleCompact: {
    fontSize: 24,
    lineHeight: 30,
  },
  subtitle: {
    ...HomeType.body,
    color: C.gray,
    marginTop: 10,
    lineHeight: 22,
    maxWidth: 340,
  },
  subtitleCompact: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  brandCompact: {
    fontSize: 22,
  },
  footer: {
    gap: 14,
    paddingTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0,0,0,0.06)",
    backgroundColor: "rgba(255,255,255,0.72)",
  },
  ctaWrap: {
    width: "100%",
  },
  cta: {
    marginTop: 4,
  },
  hint: {
    textAlign: "center",
    ...HomeType.caption,
    color: C.grayLight,
    marginTop: -4,
  },
});
