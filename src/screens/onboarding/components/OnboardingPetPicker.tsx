import { HugeiconsIcon } from "@hugeicons/react-native";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import React, { useMemo } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSharedValue } from "react-native-reanimated";

import { IOSPressable } from "../../../components/ui/ios-pressable";
import { AppText } from "../../../components/ui/AppText";
import { getMascotExpressionSource } from "../../../constants/mascot-expressions";
import {
  getMascotDisplayName,
  MASCOTS,
  type MascotId,
} from "../../../constants/mascots";
import { useLocaleStore } from "../../../stores/useLocaleStore";
import { useSettingsStore } from "../../../stores/useSettingsStore";
import { hapticSelection } from "../../../utils/haptics";
import { OnboardingFooter, OnboardingTopBar } from "./OnboardingChrome";
import { OnboardingQuestion } from "./OnboardingQuestion";
import { OnboardingSkiaBg } from "./OnboardingSkiaBg";
import {
  useOnboardingMetrics,
  useOnboardingTheme,
  type OnboardingMetrics,
  type OnboardingTheme,
} from "./onboarding-theme";
import {
  ONBOARDING_TOTAL_STEPS,
  onboardingStepNumber,
} from "../onboarding-steps";

type Props = {
  onFinish: () => void;
  onBack: () => void;
};

const PET_COPY = {
  en: {
    title: "Choose your learning buddy",
    subtitle: "Your pet will cheer you on throughout the app.",
    featured: "Twino originals",
    more: "More friendly faces",
    selected: "Selected",
    back: "Back",
    continueWith: (name: string) => `Continue with ${name}`,
  },
  ku: {
    title: "هاوڕێی فێربوونت هەڵبژێرە",
    subtitle: "ئاژەڵەکەت لە سەرانسەری ئەپەکە هانت دەدات.",
    featured: "هاوڕێ سەرەکییەکانی Twino",
    more: "هاوڕێ نوێکان",
    selected: "هەڵبژێردرا",
    back: "گەڕانەوە",
    continueWith: (name: string) => `لەگەڵ ${name} بەردەوام بە`,
  },
  ar: {
    title: "اختر رفيق التعلّم",
    subtitle: "سيشجعك حيوانك الأليف في جميع أنحاء التطبيق.",
    featured: "رفيقا Twino الأصليان",
    more: "وجوه ودودة أخرى",
    selected: "تم الاختيار",
    back: "رجوع",
    continueWith: (name: string) => `تابع مع ${name}`,
  },
  es: {
    title: "Elige a tu compañero",
    subtitle: "Tu mascota te animará en toda la aplicación.",
    featured: "Los originales de Twino",
    more: "Más caras amigables",
    selected: "Seleccionado",
    back: "Atrás",
    continueWith: (name: string) => `Continuar con ${name}`,
  },
  ru: {
    title: "Выбери помощника",
    subtitle: "Твой питомец будет поддерживать тебя во всём приложении.",
    featured: "Оригинальные герои Twino",
    more: "Другие друзья",
    selected: "Выбрано",
    back: "Назад",
    continueWith: (name: string) => `Продолжить с ${name}`,
  },
} as const;

/**
 * The bridge between the three intro slides and the personal setup questions.
 *
 * The header mascot is the currently selected learner companion, so it acts as
 * a live preview rather than decoration. Picking another pet immediately swaps
 * who appears here and in every question that follows.
 */
export function OnboardingPetPicker({ onFinish, onBack }: Props) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const locale = useLocaleStore((state) => state.selectedUiLanguage);
  const selectedMascotId = useSettingsStore((state) => state.selectedMascotId);
  const setSelectedMascotId = useSettingsStore((state) => state.setSelectedMascotId);

  const theme = useOnboardingTheme();
  const copy = PET_COPY[locale as keyof typeof PET_COPY] ?? PET_COPY.en;
  const isRtl = locale === "ku" || locale === "ar";
  const isCompact = width < 390 || height < 760;
  const metrics = useOnboardingMetrics(isCompact);
  const backgroundX = useSharedValue(onboardingStepNumber("pet") * width);

  const contentWidth = Math.min(width - metrics.gutter * 2, metrics.maxWidth);
  const gridColumns = width >= 600 ? 4 : width < 350 ? 2 : 3;
  const gap = 10;
  const gridItemWidth = (contentWidth - gap * (gridColumns - 1)) / gridColumns;
  const featuredItemWidth = (contentWidth - gap) / 2;

  const styles = useMemo(
    () => createStyles(theme, metrics, isCompact),
    [isCompact, metrics, theme],
  );

  const selectedMascot =
    MASCOTS.find((mascot) => mascot.id === selectedMascotId) ?? MASCOTS[0];
  const selectedMascotName = getMascotDisplayName(selectedMascot, locale);
  const featuredMascots = MASCOTS.filter((mascot) => mascot.featured);
  const otherMascots = MASCOTS.filter((mascot) => !mascot.featured);

  const chooseMascot = (mascotId: MascotId) => {
    if (mascotId === selectedMascotId) return;
    setSelectedMascotId(mascotId);
    hapticSelection();
  };

  const renderMascot = (
    mascot: (typeof MASCOTS)[number],
    itemWidth: number,
  ) => {
    const selected = mascot.id === selectedMascotId;
    const mascotName = getMascotDisplayName(mascot, locale);

    return (
      <IOSPressable
        key={mascot.id}
        testID={`onboarding-mascot-${mascot.id}`}
        accessibilityRole="radio"
        accessibilityLabel={`${mascotName}. ${selected ? copy.selected : ""}`}
        accessibilityState={{ checked: selected }}
        onPress={() => chooseMascot(mascot.id)}
        pressScale={0.97}
        style={[
          styles.petOption,
          { width: itemWidth },
          selected && styles.petOptionSelected,
        ]}
      >
        <View style={styles.petImageFrame}>
          <Image
            source={getMascotExpressionSource(mascot.id, "happy")}
            style={styles.petImage}
            resizeMode="contain"
          />
        </View>
        <AppText
          style={[styles.petName, selected && styles.petNameSelected]}
          languageCode={locale}
          latinRole="bold"
          numberOfLines={2}
          align="center"
        >
          {mascotName}
        </AppText>
        {selected ? (
          <View style={styles.checkmark}>
            <HugeiconsIcon
              icon={Tick02Icon}
              size={15}
              color={theme.onAccent}
              strokeWidth={3}
            />
          </View>
        ) : null}
      </IOSPressable>
    );
  };

  return (
    <View style={styles.root}>
      <OnboardingSkiaBg scrollX={backgroundX} />
      <OnboardingTopBar
        current={onboardingStepNumber("pet")}
        total={ONBOARDING_TOTAL_STEPS}
        locale={locale}
        topInset={insets.top}
        onBack={onBack}
        backLabel={copy.back}
      />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={{ width: contentWidth }}>
          <OnboardingQuestion
            question={copy.title}
            hint={copy.subtitle}
            locale={locale}
            isRtl={isRtl}
            theme={theme}
            metrics={metrics}
            mascotId={selectedMascotId}
            expression="winning"
          />
        </View>

        <View style={[styles.section, { width: contentWidth }]}>
          <AppText style={styles.sectionTitle} languageCode={locale} align="start" fullWidth>
            {copy.featured}
          </AppText>
          <View style={styles.grid}>
            {featuredMascots.map((mascot) => renderMascot(mascot, featuredItemWidth))}
          </View>
        </View>

        <View style={[styles.section, { width: contentWidth }]}>
          <AppText style={styles.sectionTitle} languageCode={locale} align="start" fullWidth>
            {copy.more}
          </AppText>
          <View style={styles.grid}>
            {otherMascots.map((mascot) => renderMascot(mascot, gridItemWidth))}
          </View>
        </View>
      </ScrollView>

      <OnboardingFooter
        label={copy.continueWith(selectedMascotName)}
        locale={locale}
        bottomInset={insets.bottom}
        onPress={onFinish}
        testID="onboarding-finish"
      />
    </View>
  );
}

function createStyles(
  theme: OnboardingTheme,
  metrics: OnboardingMetrics,
  isCompact: boolean,
) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.canvas,
    },
    scrollContent: {
      alignItems: "center",
      paddingHorizontal: metrics.gutter,
      paddingTop: isCompact ? 4 : 10,
      paddingBottom: 26,
      gap: isCompact ? 18 : 24,
    },
    section: {
      gap: 10,
    },
    sectionTitle: {
      color: theme.mutedInk,
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.9,
      textTransform: "uppercase",
    },
    grid: {
      // RTL row order is mirrored by the layout engine (forceRTL / document.dir).
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    petOption: {
      position: "relative",
      alignItems: "center",
      gap: 6,
      padding: 6,
      paddingBottom: 10,
      // Constant border width; only the colour changes on selection, so the
      // tile's artwork does not resize as the selection moves around the grid.
      borderWidth: metrics.rowBorderWidth,
      borderBottomWidth: 4,
      borderColor: theme.border,
      borderBottomColor: theme.isDark ? "#0A1016" : "#CDD4DD",
      borderRadius: 14,
      borderCurve: "continuous",
      backgroundColor: theme.surface,
      minHeight: isCompact ? 112 : 132,
    },
    petOptionSelected: {
      borderColor: theme.accentBorder,
      borderBottomColor: theme.accentPressed,
      backgroundColor: theme.accentWash,
    },
    petImageFrame: {
      width: "100%",
      aspectRatio: 1,
      overflow: "hidden",
      borderRadius: 15,
      borderCurve: "continuous",
      backgroundColor: theme.surfaceRaised,
    },
    petImage: {
      width: "100%",
      height: "100%",
    },
    petName: {
      color: theme.mutedInk,
      fontSize: 12.5,
      lineHeight: 16,
      minHeight: 32,
      paddingHorizontal: 2,
    },
    petNameSelected: {
      color: theme.ink,
    },
    checkmark: {
      position: "absolute",
      top: 9,
      right: 9,
      width: 26,
      height: 26,
      borderRadius: 13,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.accent,
      borderWidth: 2,
      borderColor: theme.canvas,
    },
  });
}
