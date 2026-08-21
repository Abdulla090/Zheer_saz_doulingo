/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowRight02Icon,
  Award01Icon,
  Book02Icon,
  Certificate01Icon,
  ChartBarLineIcon,
  CheckmarkCircle02Icon,
  FireIcon,
  HelpCircleIcon,
  InformationCircleIcon,
  Mortarboard02Icon,
  SparklesIcon,
  Target02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";

import { AppText } from "../../components/ui/AppText";
import { PremiumPressable } from "../../components/PremiumPressable";
import { Colors } from "../../constants/theme";
import { useI18n } from "../../hooks/useI18n";
import { useThemeColors } from "../../hooks/useThemeColors";
import { DirectionBoundary } from "../../i18n/layout-direction";
import { useExamStore } from "../../stores/useExamStore";
import { crossShadow } from "../../utils/shadows";
import type { ExamId } from "../../types/exam-center";

export default function ExamCenterHomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { t, locale, isKu } = useI18n();
  const { colors, isDark } = useThemeColors();
  const isRtl = isKu || locale === "ar";
  const compact = width < 380;
  const isDesktopWeb = Platform.OS === "web" && width > 768;

  const { readiness, setSelectedExam, targetScores } = useExamStore();

  const forwardIcon = isRtl ? ArrowLeft01Icon : ArrowRight01Icon;

  const handleSelectExam = (exam: ExamId) => {
    setSelectedExam(exam);
    router.push(`/exam-center/${exam}` as never);
  };

  const styles = useMemo(
    () => createStyles(colors, isDark, compact, isDesktopWeb),
    [colors, isDark, compact, isDesktopWeb],
  );

  return (
    <DirectionBoundary direction="ltr" style={styles.root}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + (isDesktopWeb ? 24 : 12),
            paddingBottom: insets.bottom + 100,
          },
        ]}
      >
        <View style={styles.content}>
          {/* Top Header */}
          <View style={[styles.header, isRtl && styles.rowReverse]}>
            <View style={styles.headerLeft}>
              <View style={[styles.badge, isRtl && styles.rowReverse]}>
                <HugeiconsIcon
                  icon={Certificate01Icon}
                  size={14}
                  color={colors.primary}
                  strokeWidth={2.2}
                />
                <AppText
                  style={styles.badgeText}
                  languageCode={locale}
                  forceKurdishFont={isRtl}
                >
                  {t("examCenter.badge", "English Exam Center")}
                </AppText>
              </View>
              <AppText
                style={styles.mainTitle}
                languageCode={locale}
                forceKurdishFont={isRtl}
                align="start"
              >
                {t("examCenter.title", "IELTS & DET Exam Center")}
              </AppText>
              <AppText
                style={styles.subtitle}
                languageCode={locale}
                forceKurdishFont={isRtl}
                align="start"
              >
                {t(
                  "examCenter.subtitle",
                  "Exclusively designed for high-band IELTS and Duolingo English Test preparation & realistic mock testing.",
                )}
              </AppText>
            </View>
          </View>

          {/* Legal Disclaimer Box */}
          <View
            style={[
              styles.disclaimerBox,
              isRtl && styles.rowReverse,
              { backgroundColor: isDark ? "rgba(255, 107, 74, 0.08)" : "#FFF7ED" },
            ]}
          >
            <HugeiconsIcon
              icon={InformationCircleIcon}
              size={18}
              color={colors.primary}
              strokeWidth={2.2}
            />
            <AppText
              style={styles.disclaimerText}
              languageCode={locale}
              forceKurdishFont={isRtl}
              align="start"
            >
              {t(
                "examCenter.disclaimer",
                "Results are reported as 'AI Estimated IELTS Band' or 'AI Estimated DET Score'. Twino is an independent training platform not officially affiliated with IELTS, Cambridge, or Duolingo.",
              )}
            </AppText>
          </View>

          {/* Primary Exam Cards: IELTS vs DET */}
          <View style={styles.examCardsGrid}>
            {/* IELTS Card */}
            <PremiumPressable
              onPress={() => handleSelectExam("ielts")}
              style={[
                styles.examCard,
                {
                  backgroundColor: colors.surfaceRaised,
                  borderColor: colors.border,
                  ...crossShadow({
                    color: isDark ? "#000" : "#D97706",
                    offsetY: 8,
                    blur: 20,
                    opacity: isDark ? 0.25 : 0.08,
                  }),
                },
              ]}
              pressScale={0.98}
            >
              <View style={[styles.examCardHeader, isRtl && styles.rowReverse]}>
                <View
                  style={[
                    styles.examIconWrap,
                    { backgroundColor: isDark ? "rgba(59, 130, 246, 0.15)" : "#EFF6FF" },
                  ]}
                >
                  <HugeiconsIcon
                    icon={Mortarboard02Icon}
                    size={28}
                    color="#3B82F6"
                    strokeWidth={2.2}
                  />
                </View>
                <View style={[styles.targetChip, isRtl && styles.rowReverse]}>
                  <HugeiconsIcon icon={Target02Icon} size={12} color="#3B82F6" strokeWidth={2.2} />
                  <AppText style={styles.targetChipText} forceLatinFont latinRole="bold">
                    Target: Band {targetScores.ielts}
                  </AppText>
                </View>
              </View>

              <AppText style={styles.examCardTitle} forceLatinFont latinRole="bold">
                IELTS Academic & General
              </AppText>
              <AppText
                style={styles.examCardDesc}
                languageCode={locale}
                forceKurdishFont={isRtl}
                align="start"
              >
                Comprehensive 4-module mastery (Reading, Listening, Writing, Speaking), Task 1 & 2 essay engines, and realistic mock exams.
              </AppText>

              <View style={[styles.readinessRow, isRtl && styles.rowReverse]}>
                <View style={styles.readinessInfo}>
                  <AppText style={styles.readinessLabel} languageCode={locale} forceKurdishFont={isRtl}>
                    Current Readiness
                  </AppText>
                  <AppText style={styles.readinessValue} forceLatinFont latinRole="bold">
                    {readiness.ielts.overallScorePercent}% (Est. Band {readiness.ielts.estimatedIeltsBand})
                  </AppText>
                </View>
                <View style={[styles.enterBtn, { backgroundColor: "#3B82F6" }]}>
                  <AppText style={styles.enterBtnText} forceLatinFont latinRole="bold">
                    Open Hub
                  </AppText>
                  <HugeiconsIcon icon={forwardIcon} size={15} color="#FFFFFF" strokeWidth={2.5} />
                </View>
              </View>
            </PremiumPressable>

            {/* DET Card */}
            <PremiumPressable
              onPress={() => handleSelectExam("det")}
              style={[
                styles.examCard,
                {
                  backgroundColor: colors.surfaceRaised,
                  borderColor: colors.border,
                  ...crossShadow({
                    color: isDark ? "#000" : "#10B981",
                    offsetY: 8,
                    blur: 20,
                    opacity: isDark ? 0.25 : 0.08,
                  }),
                },
              ]}
              pressScale={0.98}
            >
              <View style={[styles.examCardHeader, isRtl && styles.rowReverse]}>
                <View
                  style={[
                    styles.examIconWrap,
                    { backgroundColor: isDark ? "rgba(16, 185, 129, 0.15)" : "#ECFDF5" },
                  ]}
                >
                  <HugeiconsIcon
                    icon={Award01Icon}
                    size={28}
                    color="#10B981"
                    strokeWidth={2.2}
                  />
                </View>
                <View style={[styles.targetChip, isRtl && styles.rowReverse]}>
                  <HugeiconsIcon icon={Target02Icon} size={12} color="#10B981" strokeWidth={2.2} />
                  <AppText style={styles.targetChipText} forceLatinFont latinRole="bold">
                    Target: {targetScores.det} / 160
                  </AppText>
                </View>
              </View>

              <AppText style={styles.examCardTitle} forceLatinFont latinRole="bold">
                Duolingo English Test (DET)
              </AppText>
              <AppText
                style={styles.examCardDesc}
                languageCode={locale}
                forceKurdishFont={isRtl}
                align="start"
              >
                Adaptive task mastery (Read & Select, C-Tests, Dictation, Photo Description, Timed Speaking/Writing) with full timed simulation.
              </AppText>

              <View style={[styles.readinessRow, isRtl && styles.rowReverse]}>
                <View style={styles.readinessInfo}>
                  <AppText style={styles.readinessLabel} languageCode={locale} forceKurdishFont={isRtl}>
                    Current Readiness
                  </AppText>
                  <AppText style={styles.readinessValue} forceLatinFont latinRole="bold">
                    {readiness.det.overallScorePercent}% (Est. {readiness.det.estimatedDetScore}/160)
                  </AppText>
                </View>
                <View style={[styles.enterBtn, { backgroundColor: "#10B981" }]}>
                  <AppText style={styles.enterBtnText} forceLatinFont latinRole="bold">
                    Open Hub
                  </AppText>
                  <HugeiconsIcon icon={forwardIcon} size={15} color="#FFFFFF" strokeWidth={2.5} />
                </View>
              </View>
            </PremiumPressable>
          </View>

          {/* Quick Strategy Library Shortcut */}
          <PremiumPressable
            onPress={() => router.push(`/exam-center/ielts/strategy-library` as never)}
            style={[
              styles.strategyHeroCard,
              isRtl && styles.rowReverse,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.strategyIconWrap,
                { backgroundColor: isDark ? "rgba(249, 115, 22, 0.15)" : "#FFF7ED" },
              ]}
            >
              <HugeiconsIcon icon={Book02Icon} size={24} color="#F97316" strokeWidth={2.2} />
            </View>
            <View style={styles.strategyCopy}>
              <AppText style={styles.strategyTitle} forceLatinFont latinRole="bold">
                Exam Strategy & High-Band Library
              </AppText>
              <AppText
                style={styles.strategySubtitle}
                languageCode={locale}
                forceKurdishFont={isRtl}
                align="start"
              >
                Browse examiner rubrics, essay templates, 1-min speaking blueprints, collocations, and time-management formulas.
              </AppText>
            </View>
            <HugeiconsIcon icon={forwardIcon} size={20} color={colors.mutedForeground} strokeWidth={2.2} />
          </PremiumPressable>
        </View>
      </ScrollView>
    </DirectionBoundary>
  );
}

function createStyles(
  colors: (typeof Colors)["light"] | (typeof Colors)["dark"],
  isDark: boolean,
  compact: boolean,
  isDesktopWeb: boolean,
) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      alignItems: "center",
    },
    content: {
      width: "100%",
      maxWidth: isDesktopWeb ? 960 : 680,
      paddingHorizontal: isDesktopWeb ? 24 : 16,
    },
    rowReverse: {
      flexDirection: "row-reverse",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 16,
    },
    headerLeft: {
      flex: 1,
    },
    badge: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      gap: 6,
      backgroundColor: isDark ? "rgba(255, 107, 74, 0.15)" : "#FFF1EE",
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
      marginBottom: 8,
    },
    badgeText: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.primary,
    },
    mainTitle: {
      fontSize: isDesktopWeb ? 32 : compact ? 24 : 28,
      fontWeight: "900",
      color: colors.foreground,
      fontFamily: "Rabar_044",
      letterSpacing: -0.5,
      marginBottom: 6,
    },
    subtitle: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.mutedForeground,
    },
    disclaimerBox: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
      padding: 12,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: isDark ? "rgba(255, 107, 74, 0.25)" : "#FED7AA",
      marginBottom: 20,
    },
    disclaimerText: {
      flex: 1,
      fontSize: 12,
      lineHeight: 17,
      color: isDark ? "#FDBA74" : "#9A3412",
      fontWeight: "500",
    },
    examCardsGrid: {
      gap: 16,
      marginBottom: 20,
    },
    examCard: {
      padding: 20,
      borderRadius: 20,
      borderWidth: 1,
    },
    examCardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14,
    },
    examIconWrap: {
      width: 52,
      height: 52,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    targetChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 10,
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "#F1F5F9",
    },
    targetChipText: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.foreground,
    },
    examCardTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: colors.foreground,
      marginBottom: 6,
    },
    examCardDesc: {
      fontSize: 13.5,
      lineHeight: 19,
      color: colors.mutedForeground,
      marginBottom: 18,
    },
    readinessRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0",
    },
    readinessInfo: {
      flex: 1,
    },
    readinessLabel: {
      fontSize: 11,
      fontWeight: "600",
      color: colors.mutedForeground,
      textTransform: "uppercase",
      marginBottom: 2,
    },
    readinessValue: {
      fontSize: 15,
      fontWeight: "800",
      color: colors.foreground,
    },
    enterBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 12,
    },
    enterBtnText: {
      fontSize: 13,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    strategyHeroCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      padding: 16,
      borderRadius: 18,
      borderWidth: 1,
    },
    strategyIconWrap: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
    },
    strategyCopy: {
      flex: 1,
    },
    strategyTitle: {
      fontSize: 15,
      fontWeight: "800",
      color: colors.foreground,
      marginBottom: 3,
    },
    strategySubtitle: {
      fontSize: 12,
      lineHeight: 16,
      color: colors.mutedForeground,
    },
  });
}
