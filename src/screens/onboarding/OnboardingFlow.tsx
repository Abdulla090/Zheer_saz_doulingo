import { PressableScale } from "@/components/animations";
import { useFontStore } from "@/stores/useFontStore";
import { useLocaleStore } from "@/stores/useLocaleStore";
import { useOnboardingStore } from "@/stores/useOnboardingStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { isSwipeNext, rtlRoot, rtlText, rtlTextCenter } from "@/utils/rtl";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo } from "react";
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
import { OnboardingPrimaryButton } from "./components/OnboardingPrimaryButton";
import { OnboardingProgressDots } from "./components/OnboardingProgressDots";
import { OnboardingLocaleProvider } from "./OnboardingLocaleContext";
import { ONBOARDING_COPY } from "./onboarding-copy";

const STEP_VARIANTS: OnboardingHeroVariant[] = [
  "welcome",
  "paths",
  "practice",
  "progress",
  "ready",
];

const STEP_COUNT = STEP_VARIANTS.length;
const KURDISH_FONT = "Rabar_011";

export function OnboardingFlow() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { height } = useWindowDimensions();
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const setFont = useFontStore((s) => s.setFont);
  const isRtl = locale === "ku";

  const [index, setIndex] = React.useState(0);
  const [selectedPath, setSelectedPath] = React.useState<"street" | "normal">("street");

  useEffect(() => {
    if (locale === "ku") {
      setFont(KURDISH_FONT);
    }
  }, [locale, setFont]);

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
      useSettingsStore.getState().setPathMode(mode);
      router.replace({
        pathname: "/",
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
          if (isSwipeNext(e.translationX, isRtl)) goNext();
        }),
    [goNext, isRtl],
  );

  const titleSize = compact ? 24 : 28;
  const fontFamily = locale === "ku" ? KURDISH_FONT : undefined;

  return (
    <OnboardingLocaleProvider locale={locale}>
      <View style={[styles.root, rtlRoot(isRtl)]}>
        <LinearGradient
          colors={["#F4F9FF", "#FFFFFF", "#FFFFFF"]}
          locations={[0, 0.35, 1]}
          style={StyleSheet.absoluteFill}
        />

        <View
          style={[
            styles.container,
            directionContainer(isRtl),
            {
              paddingTop: insets.top + 8,
              paddingBottom: insets.bottom + 12,
            },
          ]}
        >
          <View style={styles.topBar}>
            <Text style={[styles.brand, fontFamily && { fontFamily }]}>Phingo</Text>
            <Pressable onPress={() => finish()} hitSlop={12}>
              <Text style={[styles.skip, rtlText(isRtl), fontFamily && { fontFamily }]}>
                {copy.skip}
              </Text>
            </Pressable>
          </View>

          <View style={styles.localeRow}>
            <LocaleChip
              label={copy.languageKu}
              active={locale === "ku"}
              onPress={() => setLocale("ku")}
              isRtl={isRtl}
              fontFamily={fontFamily}
            />
            <LocaleChip
              label={copy.languageEn}
              active={locale === "en"}
              onPress={() => setLocale("en")}
              isRtl={isRtl}
              fontFamily={undefined}
            />
          </View>

          <GestureDetector gesture={swipe}>
            <View style={styles.body}>
              <OnboardingHero variant={variant} />

              <Animated.View
                key={`${locale}-${index}`}
                entering={FadeInDown.duration(360).springify().damping(22)}
                exiting={FadeOutUp.duration(180)}
                style={[styles.copy, alignStretch(isRtl)]}
              >
                <Text
                  style={[
                    styles.title,
                    rtlText(isRtl),
                    { fontSize: titleSize, lineHeight: titleSize + 8 },
                    fontFamily && { fontFamily },
                  ]}
                >
                  {step.title}
                </Text>
                <Text
                  style={[
                    styles.subtitle,
                    rtlText(isRtl),
                    fontFamily && { fontFamily },
                  ]}
                  numberOfLines={compact ? 4 : 5}
                >
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

          <View style={[styles.footer, alignStretch(isRtl)]}>
            <OnboardingProgressDots total={STEP_COUNT} index={index} />

            <OnboardingPrimaryButton
              label={isLast ? copy.getStarted : copy.continue}
              color={isLast ? "#58CC02" : "#208AEF"}
              rimColor={isLast ? "#58A700" : "#1B6FD4"}
              onPress={goNext}
            />

            {!isLast ? (
              <Text
                style={[
                  styles.hint,
                  rtlTextCenter(isRtl),
                  fontFamily && { fontFamily },
                ]}
              >
                {copy.swipeHint}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </OnboardingLocaleProvider>
  );
}

function directionContainer(isRtl: boolean) {
  return { direction: isRtl ? ("rtl" as const) : ("ltr" as const) };
}

function alignStretch(isRtl: boolean) {
  return { alignSelf: "stretch" as const, width: "100%" as const };
}

function LocaleChip({
  label,
  active,
  onPress,
  isRtl,
  fontFamily,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  isRtl: boolean;
  fontFamily?: string;
}) {
  return (
    <PressableScale onPress={onPress} scaleDown={0.96}>
      <View style={[styles.chip, active && styles.chipActive]}>
        <Text
          style={[
            styles.chipLabel,
            rtlTextCenter(isRtl),
            active && styles.chipLabelActive,
            fontFamily && { fontFamily },
          ]}
        >
          {label}
        </Text>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  root: {
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
    width: "100%",
  },
  brand: {
    fontSize: 22,
    fontWeight: "800",
    color: "#208AEF",
    letterSpacing: -0.5,
    writingDirection: "ltr",
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
    width: "100%",
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
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
    width: "100%",
  },
  copy: {
    flexShrink: 1,
    paddingTop: 4,
  },
  title: {
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "500",
    color: "#64748B",
  },
  footer: {
    flexShrink: 0,
    gap: 12,
    paddingTop: 8,
  },
  hint: {
    fontSize: 12,
    fontWeight: "500",
    color: "#94A3B8",
    marginTop: -4,
  },
});
