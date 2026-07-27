import { HugeiconsIcon } from "@hugeicons/react-native";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { Image } from "expo-image";
import React, { useMemo } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IOSPressable } from "../../../components/ui/ios-pressable";
import { AppText } from "../../../components/ui/AppText";
import { getMascotExpressionSource } from "../../../constants/mascot-expressions";
import { PRIMARY_ACTION } from "../../../constants/primary-action";
import {
  getMascotDisplayName,
  MASCOTS,
  type MascotId,
} from "../../../constants/mascots";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { useLocaleStore } from "../../../stores/useLocaleStore";
import { useSettingsStore } from "../../../stores/useSettingsStore";
import { hapticSelection } from "../../../utils/haptics";

type Props = {
  onFinish: () => void;
};

const PET_COPY = {
  en: {
    eyebrow: "FINAL STEP",
    title: "Choose your learning buddy",
    subtitle: "Your pet will cheer you on throughout the app.",
    featured: "Twino originals",
    more: "More friendly faces",
    selected: "Selected",
    continueWith: (name: string) => `Continue with ${name}`,
  },
  ku: {
    eyebrow: "هەنگاوی کۆتایی",
    title: "هاوڕێی فێربوونت هەڵبژێرە",
    subtitle: "ئاژەڵەکەت لە سەرانسەری ئەپەکە هانت دەدات.",
    featured: "هاوڕێ سەرەکییەکانی Twino",
    more: "هاوڕێ نوێکان",
    selected: "هەڵبژێردرا",
    continueWith: (name: string) => `لەگەڵ ${name} بەردەوام بە`,
  },
  ar: {
    eyebrow: "الخطوة الأخيرة",
    title: "اختر رفيق التعلّم",
    subtitle: "سيشجعك حيوانك الأليف في جميع أنحاء التطبيق.",
    featured: "رفيقا Twino الأصليان",
    more: "وجوه ودودة أخرى",
    selected: "تم الاختيار",
    continueWith: (name: string) => `تابع مع ${name}`,
  },
  es: {
    eyebrow: "ÚLTIMO PASO",
    title: "Elige a tu compañero",
    subtitle: "Tu mascota te animará en toda la aplicación.",
    featured: "Los originales de Twino",
    more: "Más caras amigables",
    selected: "Seleccionado",
    continueWith: (name: string) => `Continuar con ${name}`,
  },
  ru: {
    eyebrow: "ПОСЛЕДНИЙ ШАГ",
    title: "Выбери помощника",
    subtitle: "Твой питомец будет поддерживать тебя во всём приложении.",
    featured: "Оригинальные герои Twino",
    more: "Другие друзья",
    selected: "Выбрано",
    continueWith: (name: string) => `Продолжить с ${name}`,
  },
} as const;

export function OnboardingPetPicker({ onFinish }: Props) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const locale = useLocaleStore((state) => state.selectedUiLanguage);
  const selectedMascotId = useSettingsStore((state) => state.selectedMascotId);
  const setSelectedMascotId = useSettingsStore((state) => state.setSelectedMascotId);
  const { colors, isDark } = useThemeColors();

  const copy = PET_COPY[locale as keyof typeof PET_COPY] ?? PET_COPY.en;
  const isRtl = locale === "ku" || locale === "ar";
  const contentWidth = Math.min(width - 32, 640);
  const gridColumns = width >= 600 ? 4 : 3;
  const gap = 10;
  const gridItemWidth = (contentWidth - gap * (gridColumns - 1)) / gridColumns;
  const featuredItemWidth = (contentWidth - gap) / 2;

  const styles = useMemo(
    () => createStyles(colors, isDark, isRtl),
    [colors, isDark, isRtl],
  );
  const selectedMascot = MASCOTS.find((mascot) => mascot.id === selectedMascotId) ?? MASCOTS[0];
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
        accessibilityRole="radio"
        accessibilityLabel={`${mascotName}. ${selected ? copy.selected : ""}`}
        accessibilityState={{ selected }}
        onPress={() => chooseMascot(mascot.id)}
        pressScale={0.97}
        style={[
          styles.petOption,
          { width: itemWidth },
          selected && styles.petOptionSelected,
        ]}
      >
        <View style={[styles.petImageFrame, selected && styles.petImageFrameSelected]}>
          <Image
            source={getMascotExpressionSource(mascot.id, "happy")}
            style={styles.petImage}
            contentFit="contain"
            transition={120}
          />
        </View>
        <AppText
          style={[styles.petName, selected && styles.petNameSelected]}
          forceLatinFont
          latinRole="bold"
          numberOfLines={2}
          align="center"
        >
          {mascotName}
        </AppText>
        {selected ? (
          <View style={styles.checkmark}>
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              size={22}
              color={colors.onPrimary}
              strokeWidth={2.4}
            />
          </View>
        ) : null}
      </IOSPressable>
    );
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 20, paddingBottom: 28 },
        ]}
      >
        <View style={[styles.header, { width: contentWidth }]}>
          <AppText style={styles.eyebrow} languageCode={locale} align="center">
            {copy.eyebrow}
          </AppText>
          <AppText
            style={styles.title}
            languageCode={locale}
            align="center"
            latinRole="bold"
          >
            {copy.title}
          </AppText>
          <AppText
            style={styles.subtitle}
            languageCode={locale}
            align="center"
          >
            {copy.subtitle}
          </AppText>
        </View>

        <View style={[styles.section, { width: contentWidth }]}>
          <AppText style={styles.sectionTitle} languageCode={locale} align="start">
            {copy.featured}
          </AppText>
          <View style={styles.grid}>
            {featuredMascots.map((mascot) => renderMascot(mascot, featuredItemWidth))}
          </View>
        </View>

        <View style={[styles.section, { width: contentWidth }]}>
          <AppText style={styles.sectionTitle} languageCode={locale} align="start">
            {copy.more}
          </AppText>
          <View style={styles.grid}>
            {otherMascots.map((mascot) => renderMascot(mascot, gridItemWidth))}
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, Platform.OS === "ios" ? 18 : 14) },
        ]}
      >
        <IOSPressable
          accessibilityRole="button"
          accessibilityLabel={copy.continueWith(selectedMascotName)}
          onPress={onFinish}
          style={[styles.continueButton, { width: contentWidth }]}
        >
          <AppText
            style={styles.continueButtonText}
            languageCode={locale}
            align="center"
            latinRole="bold"
          >
            {copy.continueWith(selectedMascotName)}
          </AppText>
        </IOSPressable>
      </View>
    </View>
  );
}

const createStyles = (colors: any, isDark: boolean, isRtl: boolean) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      alignItems: "center",
      paddingHorizontal: 16,
      gap: 28,
    },
    header: {
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 10,
    },
    eyebrow: {
      color: colors.primary,
      fontSize: 13,
      lineHeight: 18,
      fontWeight: "800",
      letterSpacing: isRtl ? 0 : 1.1,
    },
    title: {
      color: colors.foreground,
      fontSize: 34,
      lineHeight: 40,
      fontWeight: "900",
    },
    subtitle: {
      color: colors.mutedForeground,
      fontSize: 16,
      lineHeight: 23,
      maxWidth: 440,
    },
    section: {
      gap: 12,
    },
    sectionTitle: {
      color: colors.foreground,
      fontSize: 17,
      lineHeight: 22,
      fontWeight: "800",
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    petOption: {
      position: "relative",
      alignItems: "center",
      gap: 8,
      padding: 6,
      paddingBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 22,
      backgroundColor: isDark ? colors.surface : colors.background,
      minHeight: 132,
    },
    petOptionSelected: {
      borderWidth: 3,
      borderColor: colors.primary,
      padding: 4,
      paddingBottom: 8,
      backgroundColor: isDark ? colors.surfaceRaised : "#FFF6F2",
    },
    petImageFrame: {
      width: "100%",
      aspectRatio: 1,
      overflow: "hidden",
      borderRadius: 17,
      backgroundColor: colors.muted,
    },
    petImageFrameSelected: {
      backgroundColor: isDark ? colors.surface : "#FFFFFF",
    },
    petImage: {
      width: "100%",
      height: "100%",
    },
    petName: {
      color: colors.mutedForeground,
      fontSize: 13,
      lineHeight: 16,
      fontWeight: "700",
      minHeight: 32,
      paddingHorizontal: 2,
    },
    petNameSelected: {
      color: colors.foreground,
    },
    checkmark: {
      position: "absolute",
      top: 10,
      right: 10,
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
      borderWidth: 2,
      borderColor: colors.background,
    },
    footer: {
      alignItems: "center",
      paddingHorizontal: 16,
      paddingTop: 12,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
    },
    continueButton: {
      height: PRIMARY_ACTION.height,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: PRIMARY_ACTION.radius,
      backgroundColor: PRIMARY_ACTION.face,
      borderBottomWidth: PRIMARY_ACTION.rimWidth,
      borderBottomColor: PRIMARY_ACTION.rim,
      paddingHorizontal: 22,
    },
    continueButtonText: {
      color: "#FFFFFF",
      fontSize: 17,
      lineHeight: 22,
      fontWeight: "800",
    },
  });
