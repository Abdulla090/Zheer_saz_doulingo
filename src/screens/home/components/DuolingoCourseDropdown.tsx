import { AppCheckIcon, AppPlusIcon } from "../../../components/icons/AppHugeIcons";
import { AppText } from "../../../components/ui/AppText";
import {
  LANGUAGES,
  TARGET_LANGUAGE_CATALOG,
  getTargetLanguagesForSource,
} from "../../../config/languages";
import { useI18n } from "../../../hooks/useI18n";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { LanguageFlag } from "../../onboarding/components/OnboardingFlag";
import { useLocaleStore } from "../../../stores/useLocaleStore";
import { hapticImpact, hapticNotification, hapticSelection } from "../../../utils/haptics";
import { crossShadow } from "../../../utils/shadows";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export type DuolingoCourseDropdownProps = {
  visible: boolean;
  onClose: () => void;
  topOffset?: number;
};

const CARET_WIDTH = 18;
const CARET_HEIGHT = 10;
const CARD_WIDTH = 90;
const CARD_HEIGHT = 102;
const SHELF_HEIGHT = 160;

export function DuolingoCourseDropdown({
  visible,
  onClose,
  topOffset = 54,
}: DuolingoCourseDropdownProps) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const { colors, isDark } = useThemeColors();
  const { t, isKu, isAr } = useI18n();

  const currentTarget = useLocaleStore((s) => s.selectedTargetLanguage);
  const currentSource = useLocaleStore((s) => s.selectedSourceLanguage);
  const setLanguagePair = useLocaleStore((s) => s.setLanguagePair);

  const [isRendered, setIsRendered] = useState(visible);

  // Single progress shared value: 0 = fully closed, 1 = fully open
  const progress = useSharedValue(0);

  const onAnimationComplete = useCallback((isOpening: boolean) => {
    if (!isOpening) {
      setIsRendered(false);
      onClose();
    }
  }, [onClose]);

  const startClose = useCallback(() => {
    hapticSelection();
    progress.value = withTiming(
      0,
      {
        duration: 200,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      },
      (finished) => {
        if (finished) {
          runOnJS(onAnimationComplete)(false);
        }
      },
    );
  }, [onAnimationComplete, progress]);

  useEffect(() => {
    if (visible) {
      setIsRendered(true);
      hapticSelection();
      // Fluid Apple / Duolingo deceleration ease
      progress.value = withTiming(1, {
        duration: 260,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      });
    } else if (isRendered) {
      progress.value = withTiming(
        0,
        {
          duration: 200,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        },
        (finished) => {
          if (finished) {
            runOnJS(onAnimationComplete)(false);
          }
        },
      );
    }
  }, [isRendered, onAnimationComplete, progress, visible]);

  // Buttery smooth sliding shelf animation (no scale, no wobble)
  const animatedShelfStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.2, 1], [0, 0.85, 1]),
    transform: [
      {
        translateY: interpolate(progress.value, [0, 1], [-SHELF_HEIGHT, 0]),
      },
    ],
  }));

  // Smooth backdrop dim fade
  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const availableTargets = useMemo(() => {
    return getTargetLanguagesForSource(currentSource);
  }, [currentSource]);

  const courses = useMemo(() => {
    const list = [...availableTargets];
    if (!list.some((l) => l.id === "es") && LANGUAGES.es) {
      list.push(LANGUAGES.es);
    }
    for (const catLang of TARGET_LANGUAGE_CATALOG) {
      if (!list.some((l) => l.id === catLang.id)) {
        list.push(catLang);
      }
    }
    return list;
  }, [availableTargets]);

  const handleSelectLanguage = useCallback(
    (langId: string) => {
      if (langId === currentTarget) {
        startClose();
        return;
      }

      const langDef = LANGUAGES[langId];
      if (!langDef || !langDef.supportedAsTarget || !langDef.curriculumReady) {
        hapticNotification(Haptics.NotificationFeedbackType.Warning);
        Alert.alert(
          t("home.courseComingSoon"),
          isKu
            ? `کۆرسی فێربوونی ${langDef?.name ?? langId} بەزوویی بەردەست دەبێت!`
            : isAr
              ? `دورة تعلم ${langDef?.name ?? langId} ستتوفر قريباً!`
              : `${langDef?.name ?? langId} course is coming soon!`,
        );
        return;
      }

      hapticImpact(Haptics.ImpactFeedbackStyle.Medium);
      setLanguagePair(currentSource, langId);
      startClose();
    },
    [currentSource, currentTarget, isAr, isKu, setLanguagePair, startClose, t],
  );

  const handleAddCoursePress = useCallback(() => {
    hapticImpact(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      t("home.addCourse"),
      isKu
        ? "دەتوانیت هەر زمانێکی فێربوون هەڵبژێریت لە کاردەکانی سەرەوە."
        : isAr
          ? "يمكنك اختيار أي لغة تعلم من البطاقات أعلاه."
          : "You can choose any language to learn from the cards above.",
    );
  }, [isAr, isKu, t]);

  if (!isRendered) return null;

  const isRtl = isKu || isAr;
  const containerWidth = Math.min(windowWidth, 640);
  const sideOffset = Math.max(0, (windowWidth - 640) / 2);

  const styles = createStyles(
    colors,
    isDark,
    topOffset,
    sideOffset,
    windowWidth,
    windowHeight,
    isRtl,
  );

  return (
    <>
      {/* Dim Backdrop covering screen below the top bar */}
      <Animated.View
        style={[styles.backdrop, animatedBackdropStyle]}
        pointerEvents={visible ? "auto" : "none"}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={startClose}
          accessibilityLabel={t("common.close") ?? "Close"}
          accessibilityRole="button"
        />
      </Animated.View>

      {/* Dropdown Shelf sliding down from behind the top bar */}
      <View style={styles.shelfClippingWrapper} pointerEvents={visible ? "box-none" : "none"}>
        <Animated.View style={[styles.shelfCard, animatedShelfStyle]}>
          {/* Speech-bubble Caret pointing directly to the flag */}
          <View style={styles.caret} />

          {/* Section Header */}
          <View style={styles.headerRow}>
            <AppText
              style={styles.headerLabel}
              forceKurdishFont={isKu}
              forceLatinFont={!isKu && !isAr}
              latinRole="bold"
            >
              {t("home.myCourses")}
            </AppText>
          </View>

          {/* Horizontal Courses Carousel Slider */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
            keyboardShouldPersistTaps="handled"
          >
            {courses.map((lang) => {
              const isActive = lang.id === currentTarget;
              const isComingSoon = !lang.curriculumReady || !lang.supportedAsTarget;

              return (
                <Pressable
                  key={lang.id}
                  onPress={() => handleSelectLanguage(lang.id)}
                  style={({ pressed }) => [
                    styles.courseCard,
                    isActive ? styles.activeCourseCard : styles.inactiveCourseCard,
                    pressed && { transform: [{ scale: 0.95 }] },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`${lang.name} course ${isActive ? "(Current)" : ""}`}
                >
                  {/* Active Checkmark Badge */}
                  {isActive && (
                    <View style={styles.activeCheckBadge}>
                      <AppCheckIcon size={12} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  )}

                  {/* Coming Soon Badge */}
                  {isComingSoon && !isActive && (
                    <View style={styles.soonBadge}>
                      <AppText
                        style={styles.soonBadgeText}
                        forceKurdishFont={isKu}
                        latinRole="bold"
                      >
                        {isKu ? "زوو" : isAr ? "قريباً" : "Soon"}
                      </AppText>
                    </View>
                  )}

                  {/* Flag Art */}
                  <View style={styles.flagWrapper}>
                    <LanguageFlag
                      code={lang.id}
                      borderColor={
                        isActive
                          ? "rgba(28, 176, 246, 0.40)"
                          : isDark
                            ? "rgba(255,255,255,0.18)"
                            : colors.border
                      }
                      width={46}
                    />
                  </View>

                  {/* Course Label */}
                  <AppText
                    style={[
                      styles.courseLabel,
                      isActive ? styles.activeCourseLabel : styles.inactiveCourseLabel,
                    ]}
                    forceKurdishFont={lang.id === "ku" || isKu}
                    forceLatinFont={lang.id !== "ku" && lang.id !== "ar"}
                    latinRole="bold"
                    numberOfLines={1}
                  >
                    {lang.nativeName || lang.name}
                  </AppText>
                </Pressable>
              );
            })}

            {/* "+ Course" Add Card */}
            <Pressable
              onPress={handleAddCoursePress}
              style={({ pressed }) => [
                styles.addCourseCard,
                pressed && { transform: [{ scale: 0.95 }] },
              ]}
              accessibilityRole="button"
              accessibilityLabel={t("home.addCourse")}
            >
              <View style={styles.addIconCircle}>
                <AppPlusIcon size={20} color={colors.mutedForeground} strokeWidth={2.4} />
              </View>
              <AppText
                style={styles.addCourseLabel}
                forceKurdishFont={isKu}
                forceLatinFont={!isKu && !isAr}
                latinRole="bold"
                numberOfLines={1}
              >
                {t("home.addCourse")}
              </AppText>
            </Pressable>
          </ScrollView>
        </Animated.View>
      </View>
    </>
  );
}

function createStyles(
  colors: any,
  isDark: boolean,
  topOffset: number,
  sideOffset: number,
  windowWidth: number,
  windowHeight: number,
  isRtl: boolean,
) {
  const cardBg = isDark ? "#1C1E23" : "#FFFFFF";
  const cardBorderBottom = isDark ? "#121417" : "#E2E8F0";

  return StyleSheet.create({
    backdrop: {
      position: "absolute",
      top: topOffset,
      left: -sideOffset,
      width: windowWidth,
      height: windowHeight * 1.5,
      backgroundColor: isDark ? "rgba(0, 0, 0, 0.65)" : "rgba(15, 23, 42, 0.40)",
      zIndex: 90,
      elevation: 20,
    },
    shelfClippingWrapper: {
      position: "absolute",
      top: topOffset,
      left: 0,
      right: 0,
      alignSelf: "center",
      width: "100%",
      maxWidth: 640,
      zIndex: 100,
      elevation: 25,
    },
    shelfCard: {
      width: "100%",
      backgroundColor: cardBg,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
      borderLeftWidth: StyleSheet.hairlineWidth,
      borderRightWidth: StyleSheet.hairlineWidth,
      borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
      borderBottomWidth: 4,
      borderBottomColor: cardBorderBottom,
      borderCurve: "continuous",
      paddingTop: 12,
      paddingBottom: 16,
      ...crossShadow({
        color: "#000000",
        offsetY: 12,
        blur: 24,
        opacity: isDark ? 0.45 : 0.14,
        elevation: 12,
      }),
    },
    caret: {
      position: "absolute",
      top: -CARET_HEIGHT + 1,
      ...(isRtl
        ? { right: 26 }
        : { left: 26 }),
      width: 0,
      height: 0,
      borderLeftWidth: CARET_WIDTH / 2,
      borderRightWidth: CARET_WIDTH / 2,
      borderBottomWidth: CARET_HEIGHT,
      borderLeftColor: "transparent",
      borderRightColor: "transparent",
      borderBottomColor: cardBg,
      zIndex: 102,
    },
    headerRow: {
      paddingHorizontal: 20,
      marginBottom: 8,
      flexDirection: isRtl ? "row-reverse" : "row",
      alignItems: "center",
    },
    headerLabel: {
      fontSize: 11,
      fontWeight: "800",
      letterSpacing: 1.1,
      textTransform: "uppercase",
      color: colors.mutedForeground,
    },
    carouselContent: {
      paddingHorizontal: 16,
      gap: 12,
      alignItems: "center",
      flexDirection: isRtl ? "row-reverse" : "row",
    },
    courseCard: {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      borderRadius: 18,
      borderCurve: "continuous",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 8,
      paddingBottom: 8,
      paddingHorizontal: 4,
      position: "relative",
    },
    activeCourseCard: {
      backgroundColor: isDark ? "rgba(28, 176, 246, 0.16)" : "#EBF8FE",
      borderWidth: 2.5,
      borderColor: "#1CB0F6",
      borderBottomWidth: 4.5,
      borderBottomColor: "#1899D6",
    },
    inactiveCourseCard: {
      backgroundColor: isDark ? "#24272E" : "#FFFFFF",
      borderWidth: 1.5,
      borderColor: isDark ? "rgba(255, 255, 255, 0.14)" : "#E2E8F0",
      borderBottomWidth: 4,
      borderBottomColor: isDark ? "#1A1C22" : "#CBD5E1",
    },
    activeCheckBadge: {
      position: "absolute",
      top: 6,
      right: 6,
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: "#1CB0F6",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1.5,
      borderColor: "#FFFFFF",
      zIndex: 2,
    },
    soonBadge: {
      position: "absolute",
      top: 5,
      right: 5,
      paddingHorizontal: 5,
      paddingVertical: 1.5,
      borderRadius: 6,
      backgroundColor: isDark ? "#3A3E48" : "#E2E8F0",
      zIndex: 2,
    },
    soonBadgeText: {
      fontSize: 9,
      fontWeight: "800",
      color: colors.mutedForeground,
      textTransform: "uppercase",
    },
    flagWrapper: {
      marginTop: 4,
      marginBottom: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    courseLabel: {
      fontSize: 13,
      lineHeight: 16,
      textAlign: "center",
      paddingHorizontal: 2,
    },
    activeCourseLabel: {
      color: "#1CB0F6",
      fontWeight: "800",
    },
    inactiveCourseLabel: {
      color: colors.foreground,
      fontWeight: "700",
    },
    addCourseCard: {
      width: CARD_WIDTH - 6,
      height: CARD_HEIGHT,
      borderRadius: 18,
      borderCurve: "continuous",
      borderWidth: 1.8,
      borderStyle: "dashed",
      borderColor: isDark ? "rgba(255,255,255,0.22)" : "#CBD5E1",
      backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingHorizontal: 6,
    },
    addIconCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0",
      alignItems: "center",
      justifyContent: "center",
    },
    addCourseLabel: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.mutedForeground,
      textAlign: "center",
    },
  });
}
