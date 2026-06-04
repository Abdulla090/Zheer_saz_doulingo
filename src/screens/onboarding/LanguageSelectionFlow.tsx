import { PingoMascot } from "@/components/mascot/PingoMascot";
import {
  HomeLiquidButton,
  HomeLiquidCard,
  HomeMeshBackground,
  HomePalette,
  HomeType,
} from "@/components/ui/ios-liquid-home";
import { useI18n } from "@/hooks/useI18n";
import type { I18nKey } from "@/i18n";
import { OnboardingProgressBar } from "@/screens/onboarding/components/OnboardingProgressBar";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { hapticSelection } from "@/utils/haptics";
import * as Haptics from "expo-haptics";
import React, { useCallback, useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const C = HomePalette;

type Step = "native" | "target";

type LangId = "en" | "ku" | "ar";

type LangOption = {
  id: LangId;
  titleKey: I18nKey;
  code: string;
};

const ALL_LANGS: LangOption[] = [
  { id: "ku", titleKey: "onboarding.langKurdish", code: "KU" },
  { id: "en", titleKey: "onboarding.langEnglish", code: "EN" },
  { id: "ar", titleKey: "onboarding.langArabic", code: "AR" },
];

type Props = {
  onFinish: () => void;
};

function LangOptionCard({
  label,
  code,
  selected,
  onPress,
}: {
  label: string;
  code: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      <HomeLiquidCard
        interactive
        style={selected ? styles.optionSelected : undefined}
        contentStyle={styles.optionInner}
      >
        <View style={[styles.codeBadge, selected && styles.codeBadgeSelected]}>
          <Text style={[styles.codeText, selected && styles.codeTextSelected]}>
            {code}
          </Text>
        </View>
        <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
          {label}
        </Text>
        <View
          style={[styles.radioOuter, selected && styles.radioOuterSelected]}
        >
          {selected ? <View style={styles.radioInner} /> : null}
        </View>
      </HomeLiquidCard>
    </Pressable>
  );
}

export function LanguageSelectionFlow({ onFinish }: Props) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const setNativeLang = useSettingsStore((s) => s.setNativeLang);
  const setTargetLang = useSettingsStore((s) => s.setTargetLang);

  const [step, setStep] = useState<Step>("native");
  const [native, setNative] = useState<LangId>("ku");
  const [target, setTarget] = useState<LangId>("en");

  const stepIndex = step === "native" ? 0 : 1;

  const nativeOptions = ALL_LANGS;
  const targetOptions = useMemo(() => {
    const allowed: LangId[] =
      native === "ku" ? ["en"] : native === "en" ? ["ku", "ar"] : ["en", "ku"];
    return ALL_LANGS.filter((l) => allowed.includes(l.id));
  }, [native]);

  const handleSelectNative = useCallback(
    (lang: LangId) => {
      hapticSelection();
      setNative(lang);
      setNativeLang(lang);
      const nextTarget: LangId = lang === "ku" ? "en" : lang === "en" ? "ku" : "en";
      setTarget(nextTarget);
      setStep("target");
    },
    [setNativeLang],
  );

  const handleSelectTarget = useCallback(
    (lang: LangId) => {
      if (Platform.OS !== "web") {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      setTarget(lang);
      setTargetLang(lang);
      onFinish();
    },
    [onFinish, setTargetLang],
  );

  const onBack = useCallback(() => {
    hapticSelection();
    setStep("native");
  }, []);

  const onContinueTarget = useCallback(() => {
    handleSelectTarget(target);
  }, [handleSelectTarget, target]);

  return (
    <View style={styles.root}>
      <HomeMeshBackground />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 28,
          },
        ]}
      >
        <View style={styles.topRow}>
          {step === "target" ? (
            <Pressable
              onPress={onBack}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel={t("onboarding.langBack")}
            >
              <Text style={styles.back}>{t("onboarding.langBack")}</Text>
            </Pressable>
          ) : (
            <View style={styles.backSpacer} />
          )}
          <OnboardingProgressBar total={2} index={stepIndex} />
          <View style={styles.backSpacer} />
        </View>

        <View style={styles.mascotWrap}>
          <PingoMascot size={96} pose="wave" />
        </View>

        {step === "native" ? (
          <Animated.View
            key="native"
            entering={SlideInRight.duration(280)}
            exiting={SlideOutLeft.duration(200)}
            style={styles.stepBlock}
          >
            <Text style={styles.stepLabel}>
              {t("onboarding.langStepNative")}
            </Text>
            <Text style={styles.title}>{t("onboarding.langNativeTitle")}</Text>
            <Text style={styles.subtitle}>
              {t("onboarding.langNativeSubtitle")}
            </Text>

            <View style={styles.options}>
              {nativeOptions.map((l) => (
                <LangOptionCard
                  key={l.id}
                  label={t(l.titleKey)}
                  code={l.code}
                  selected={native === l.id}
                  onPress={() => handleSelectNative(l.id)}
                />
              ))}
            </View>
          </Animated.View>
        ) : (
          <Animated.View
            key="target"
            entering={SlideInRight.duration(280)}
            exiting={SlideOutLeft.duration(200)}
            style={styles.stepBlock}
          >
            <Text style={styles.stepLabel}>
              {t("onboarding.langStepTarget")}
            </Text>
            <Text style={styles.title}>{t("onboarding.langTargetTitle")}</Text>
            <Text style={styles.subtitle}>
              {t("onboarding.langTargetSubtitle")}
            </Text>

            <View style={styles.options}>
              {targetOptions.map((l) => (
                <LangOptionCard
                  key={l.id}
                  label={t(l.titleKey)}
                  code={l.code}
                  selected={target === l.id}
                  onPress={() => {
                    hapticSelection();
                    setTarget(l.id);
                  }}
                />
              ))}
            </View>

            <HomeLiquidButton
              label={t("onboarding.getStarted")}
              onPress={onContinueTarget}
              style={styles.cta}
            />
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.meshBottom,
  },
  scroll: {
    paddingHorizontal: 22,
    flexGrow: 1,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  back: {
    fontSize: 15,
    fontWeight: "700",
    color: C.blue,
    fontFamily: "DINNextRoundedBold",
    minWidth: 72,
  },
  backSpacer: {
    minWidth: 72,
  },
  mascotWrap: {
    alignItems: "center",
    marginTop: 4,
    marginBottom: 20,
  },
  stepBlock: {
    width: "100%",
  },
  stepLabel: {
    ...HomeType.caption,
    color: C.grayLight,
    textAlign: "center",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  title: {
    ...HomeType.heading,
    color: C.navy,
    textAlign: "center",
    fontSize: 28,
    lineHeight: 34,
  },
  subtitle: {
    ...HomeType.body,
    color: C.gray,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 22,
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  options: {
    gap: 12,
  },
  optionSelected: {
    borderWidth: 2,
    borderColor: "rgba(43, 89, 243, 0.35)",
  },
  optionInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 14,
  },
  codeBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  codeBadgeSelected: {
    backgroundColor: C.blue,
  },
  codeText: {
    fontSize: 14,
    fontWeight: "800",
    color: C.blue,
    fontFamily: "DINNextRoundedBold",
    letterSpacing: 0.5,
  },
  codeTextSelected: {
    color: "#FFFFFF",
  },
  optionLabel: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: C.navy,
    fontFamily: "DINNextRoundedBold",
  },
  optionLabelSelected: {
    color: C.blue,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: C.track,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: C.blue,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: C.blue,
  },
  cta: {
    marginTop: 24,
  },
});
