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
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Award01Icon,
  Book02Icon,
  Certificate01Icon,
  CheckmarkCircle02Icon,
  FireIcon,
  HeadphonesIcon,
  LockIcon,
  Mortarboard02Icon,
  PlayIcon,
  SparklesIcon,
  Target02Icon,
  VoiceIcon,
  Edit02Icon,
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

export default function ExamHubScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ examId?: string }>();
  const { width } = useWindowDimensions();
  const { t, locale, isKu } = useI18n();
  const { colors, isDark } = useThemeColors();
  const isRtl = isKu || locale === "ar";
  const compact = width < 380;
  const isDesktopWeb = Platform.OS === "web" && width > 768;

  const exam: ExamId = params.examId === "det" ? "det" : "ielts";
  const isIelts = exam === "ielts";

  const { readiness, targetScores } = useExamStore();
  const currentReadiness = readiness[exam];

  const primaryAccent = isIelts ? "#3B82F6" : "#10B981";
  const forwardIcon = isRtl ? ArrowLeft01Icon : ArrowRight01Icon;

  const styles = useMemo(
    () => createStyles(colors, isDark, compact, isDesktopWeb, primaryAccent),
    [colors, isDark, compact, isDesktopWeb, primaryAccent],
  );

  return (
    <DirectionBoundary direction="ltr" style={styles.root}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + (isDesktopWeb ? 20 : 10),
            paddingBottom: insets.bottom + 100,
          },
        ]}
      >
        <View style={styles.content}>
          {/* Top Bar with Back & Switcher */}
          <View style={[styles.topBar, isRtl && styles.rowReverse]}>
            <PremiumPressable
              onPress={() => router.push("/exam-center" as never)}
              style={[styles.backBtn, { borderColor: colors.border }]}
            >
              <HugeiconsIcon
                icon={isRtl ? ArrowRight01Icon : ArrowLeft01Icon}
                size={20}
                color={colors.foreground}
                strokeWidth={2.2}
              />
            </PremiumPressable>

            <View style={styles.examPill}>
              <HugeiconsIcon
                icon={isIelts ? Mortarboard02Icon : Certificate01Icon}
                size={14}
                color={primaryAccent}
                strokeWidth={2.2}
              />
              <AppText style={[styles.examPillText, { color: primaryAccent }]} forceLatinFont latinRole="bold">
                {isIelts ? "IELTS Exam Track" : "Duolingo English Test Track"}
              </AppText>
            </View>
          </View>

          {/* Title & Estimated Score Hero */}
          <View style={styles.heroBlock}>
            <AppText
              style={styles.heroTitle}
              languageCode={locale}
              forceKurdishFont={isRtl}
              align="start"
            >
              {isIelts ? "IELTS Academic & General Hub" : "Duolingo English Test (DET) Hub"}
            </AppText>
            <AppText
              style={styles.heroSubtitle}
              languageCode={locale}
              forceKurdishFont={isRtl}
              align="start"
            >
              {isIelts
                ? "Select Preparation for structured skill lessons or Mock Exam for realistic timed testing."
                : "Select Preparation for adaptive task training or Mock Exam for realistic full simulation."}
            </AppText>
          </View>

          {/* 2 MAIN OPTIONS (IMMEDIATELY DISPLAYED) */}
          <View style={styles.mainOptionsGrid}>
            {/* OPTION 1: PREPARATION */}
            <PremiumPressable
              onPress={() => router.push(`/exam-center/${exam}/preparation` as never)}
              style={[
                styles.mainOptionCard,
                {
                  backgroundColor: colors.surfaceRaised,
                  borderColor: isDark ? "rgba(59, 130, 246, 0.4)" : "#BFDBFE",
                  ...crossShadow({
                    color: isDark ? "#000" : primaryAccent,
                    offsetY: 8,
                    blur: 24,
                    opacity: isDark ? 0.3 : 0.12,
                  }),
                },
              ]}
              pressScale={0.98}
            >
              <View style={[styles.optionHeaderRow, isRtl && styles.rowReverse]}>
                <View style={[styles.optionBadge, { backgroundColor: isDark ? "rgba(59, 130, 246, 0.2)" : "#DBEAFE" }]}>
                  <HugeiconsIcon icon={Book02Icon} size={16} color={primaryAccent} strokeWidth={2.2} />
                  <AppText style={[styles.optionBadgeText, { color: primaryAccent }]} forceLatinFont latinRole="bold">
                    OPTION 1
                  </AppText>
                </View>
                <View style={[styles.stepCountChip, isRtl && styles.rowReverse]}>
                  <AppText style={styles.stepCountText} forceLatinFont latinRole="bold">
                    Learn → Practice → Score
                  </AppText>
                </View>
              </View>

              <AppText style={styles.optionTitle} forceLatinFont latinRole="bold">
                1. Preparation Course
              </AppText>
              <AppText
                style={styles.optionDesc}
                languageCode={locale}
                forceKurdishFont={isRtl}
                align="start"
              >
                Structured skill modules across Reading, Listening, Writing, and Speaking. Learn high-band frameworks (PEEL, PREP, AREA), study weak vs excellent examples, and take instant quizzes.
              </AppText>

              <View style={[styles.optionActionRow, isRtl && styles.rowReverse]}>
                <View style={styles.optionHighlights}>
                  <View style={[styles.highlightPill, isRtl && styles.rowReverse]}>
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} color="#10B981" strokeWidth={2.2} />
                    <AppText style={styles.highlightPillText} forceLatinFont latinRole="bold">
                      Personalized AI Study Plan
                    </AppText>
                  </View>
                </View>
                <View style={[styles.startPill, { backgroundColor: primaryAccent }]}>
                  <AppText style={styles.startPillText} forceLatinFont latinRole="bold">
                    Start Prep
                  </AppText>
                  <HugeiconsIcon icon={forwardIcon} size={14} color="#FFFFFF" strokeWidth={2.5} />
                </View>
              </View>
            </PremiumPressable>

            {/* OPTION 2: MOCK EXAM */}
            <PremiumPressable
              onPress={() => router.push(`/exam-center/${exam}/mock-exam` as never)}
              style={[
                styles.mainOptionCard,
                {
                  backgroundColor: colors.surfaceRaised,
                  borderColor: isDark ? "rgba(249, 115, 22, 0.4)" : "#FED7AA",
                  ...crossShadow({
                    color: isDark ? "#000" : "#F97316",
                    offsetY: 8,
                    blur: 24,
                    opacity: isDark ? 0.3 : 0.12,
                  }),
                },
              ]}
              pressScale={0.98}
            >
              <View style={[styles.optionHeaderRow, isRtl && styles.rowReverse]}>
                <View style={[styles.optionBadge, { backgroundColor: isDark ? "rgba(249, 115, 22, 0.2)" : "#FFEDD5" }]}>
                  <HugeiconsIcon icon={Award01Icon} size={16} color="#F97316" strokeWidth={2.2} />
                  <AppText style={[styles.optionBadgeText, { color: "#F97316" }]} forceLatinFont latinRole="bold">
                    OPTION 2
                  </AppText>
                </View>
                <View
                  style={[
                    styles.qualificationChip,
                    isRtl && styles.rowReverse,
                    {
                      backgroundColor: currentReadiness.qualifiedForMock
                        ? isDark
                          ? "rgba(16, 185, 129, 0.15)"
                          : "#DCFCE7"
                        : isDark
                          ? "rgba(239, 68, 68, 0.15)"
                          : "#FEE2E2",
                    },
                  ]}
                >
                  <HugeiconsIcon
                    icon={currentReadiness.qualifiedForMock ? CheckmarkCircle02Icon : LockIcon}
                    size={12}
                    color={currentReadiness.qualifiedForMock ? "#10B981" : "#EF4444"}
                    strokeWidth={2.2}
                  />
                  <AppText
                    style={[
                      styles.qualificationChipText,
                      { color: currentReadiness.qualifiedForMock ? "#10B981" : "#EF4444" },
                    ]}
                    forceLatinFont
                    latinRole="bold"
                  >
                    {currentReadiness.qualifiedForMock ? "Unlocked" : "50% Test Required"}
                  </AppText>
                </View>
              </View>

              <AppText style={styles.optionTitle} forceLatinFont latinRole="bold">
                2. Mock Exam Simulation
              </AppText>
              <AppText
                style={styles.optionDesc}
                languageCode={locale}
                forceKurdishFont={isRtl}
                align="start"
              >
                Realistic full simulation with strict section timers, distraction-free interface, automatic audio recording, and comprehensive post-exam AI mistake analysis.
              </AppText>

              <View style={[styles.optionActionRow, isRtl && styles.rowReverse]}>
                <View style={styles.optionHighlights}>
                  <View style={[styles.highlightPill, isRtl && styles.rowReverse]}>
                    <HugeiconsIcon icon={SparklesIcon} size={12} color="#F97316" strokeWidth={2.2} />
                    <AppText style={styles.highlightPillText} forceLatinFont latinRole="bold">
                      {isIelts ? "AI Estimated IELTS Band" : "AI Estimated DET Score"}
                    </AppText>
                  </View>
                </View>
                <View style={[styles.startPill, { backgroundColor: "#F97316" }]}>
                  <AppText style={styles.startPillText} forceLatinFont latinRole="bold">
                    Enter Mock Test
                  </AppText>
                  <HugeiconsIcon icon={forwardIcon} size={14} color="#FFFFFF" strokeWidth={2.5} />
                </View>
              </View>
            </PremiumPressable>
          </View>

          {/* EXAM READINESS OVERVIEW DASHBOARD */}
          <View
            style={[
              styles.readinessCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={[styles.readinessCardHeader, isRtl && styles.rowReverse]}>
              <View style={styles.readinessTitleGroup}>
                <AppText style={styles.readinessTitle} forceLatinFont latinRole="bold">
                  Exam Readiness Score
                </AppText>
                <AppText style={styles.readinessBandEstimate} forceLatinFont latinRole="bold">
                  {isIelts
                    ? `AI Estimated IELTS Band: ${currentReadiness.estimatedIeltsBand.toFixed(1)}`
                    : `AI Estimated DET Score: ${currentReadiness.estimatedDetScore} / 160`}
                </AppText>
              </View>
              <View style={[styles.scoreDial, { borderColor: primaryAccent }]}>
                <AppText style={[styles.scoreDialNumber, { color: primaryAccent }]} forceLatinFont latinRole="bold">
                  {currentReadiness.overallScorePercent}%
                </AppText>
              </View>
            </View>

            {/* 4 Skill Gauges */}
            <View style={styles.skillsGrid}>
              <View style={[styles.skillItem, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
                <View style={[styles.skillItemHead, isRtl && styles.rowReverse]}>
                  <HugeiconsIcon icon={Book02Icon} size={14} color="#3B82F6" strokeWidth={2.2} />
                  <AppText style={styles.skillItemLabel} forceLatinFont latinRole="bold">
                    Reading
                  </AppText>
                </View>
                <AppText style={styles.skillItemPercent} forceLatinFont latinRole="bold">
                  {currentReadiness.readingPercent}%
                </AppText>
                <View style={[styles.skillBarTrack, { backgroundColor: colors.muted }]}>
                  <View style={[styles.skillBarFill, { width: `${currentReadiness.readingPercent}%`, backgroundColor: "#3B82F6" }]} />
                </View>
              </View>

              <View style={[styles.skillItem, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
                <View style={[styles.skillItemHead, isRtl && styles.rowReverse]}>
                  <HugeiconsIcon icon={HeadphonesIcon} size={14} color="#10B981" strokeWidth={2.2} />
                  <AppText style={styles.skillItemLabel} forceLatinFont latinRole="bold">
                    Listening
                  </AppText>
                </View>
                <AppText style={styles.skillItemPercent} forceLatinFont latinRole="bold">
                  {currentReadiness.listeningPercent}%
                </AppText>
                <View style={[styles.skillBarTrack, { backgroundColor: colors.muted }]}>
                  <View style={[styles.skillBarFill, { width: `${currentReadiness.listeningPercent}%`, backgroundColor: "#10B981" }]} />
                </View>
              </View>

              <View style={[styles.skillItem, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
                <View style={[styles.skillItemHead, isRtl && styles.rowReverse]}>
                  <HugeiconsIcon icon={Edit02Icon} size={14} color="#F59E0B" strokeWidth={2.2} />
                  <AppText style={styles.skillItemLabel} forceLatinFont latinRole="bold">
                    Writing
                  </AppText>
                </View>
                <AppText style={styles.skillItemPercent} forceLatinFont latinRole="bold">
                  {currentReadiness.writingPercent}%
                </AppText>
                <View style={[styles.skillBarTrack, { backgroundColor: colors.muted }]}>
                  <View style={[styles.skillBarFill, { width: `${currentReadiness.writingPercent}%`, backgroundColor: "#F59E0B" }]} />
                </View>
              </View>

              <View style={[styles.skillItem, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
                <View style={[styles.skillItemHead, isRtl && styles.rowReverse]}>
                  <HugeiconsIcon icon={VoiceIcon} size={14} color="#EC4899" strokeWidth={2.2} />
                  <AppText style={styles.skillItemLabel} forceLatinFont latinRole="bold">
                    Speaking
                  </AppText>
                </View>
                <AppText style={styles.skillItemPercent} forceLatinFont latinRole="bold">
                  {currentReadiness.speakingPercent}%
                </AppText>
                <View style={[styles.skillBarTrack, { backgroundColor: colors.muted }]}>
                  <View style={[styles.skillBarFill, { width: `${currentReadiness.speakingPercent}%`, backgroundColor: "#EC4899" }]} />
                </View>
              </View>
            </View>
          </View>

          {/* Strategy Library Banner */}
          <PremiumPressable
            onPress={() => router.push(`/exam-center/${exam}/strategy-library` as never)}
            style={[
              styles.strategyBanner,
              isRtl && styles.rowReverse,
              {
                backgroundColor: colors.surfaceRaised,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={[styles.strategyBannerIcon, { backgroundColor: isDark ? "rgba(249, 115, 22, 0.15)" : "#FFEDD5" }]}>
              <HugeiconsIcon icon={Book02Icon} size={22} color="#F97316" strokeWidth={2.2} />
            </View>
            <View style={styles.strategyBannerCopy}>
              <AppText style={styles.strategyBannerTitle} forceLatinFont latinRole="bold">
                {isIelts ? "IELTS Strategy & Collocation Library" : "DET Strategy & Scoring Rubric Library"}
              </AppText>
              <AppText
                style={styles.strategyBannerDesc}
                languageCode={locale}
                forceKurdishFont={isRtl}
                align="start"
              >
                Explore task-specific strategies, examiner expectations, and high-scoring sample models.
              </AppText>
            </View>
            <HugeiconsIcon icon={forwardIcon} size={18} color={colors.mutedForeground} strokeWidth={2.2} />
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
  primaryAccent: string,
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
    topBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    backBtn: {
      width: 40,
      height: 40,
      borderRadius: 12,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surfaceRaised,
    },
    examPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "#F1F5F9",
    },
    examPillText: {
      fontSize: 12.5,
      fontWeight: "700",
    },
    heroBlock: {
      marginBottom: 20,
    },
    heroTitle: {
      fontSize: isDesktopWeb ? 30 : compact ? 22 : 26,
      fontWeight: "900",
      color: colors.foreground,
      fontFamily: "Rabar_044",
      letterSpacing: -0.5,
      marginBottom: 6,
    },
    heroSubtitle: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.mutedForeground,
    },
    mainOptionsGrid: {
      gap: 16,
      marginBottom: 24,
    },
    mainOptionCard: {
      padding: 20,
      borderRadius: 22,
      borderWidth: 1.5,
    },
    optionHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    optionBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 10,
    },
    optionBadgeText: {
      fontSize: 12,
      fontWeight: "800",
      letterSpacing: 0.5,
    },
    stepCountChip: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "#F1F5F9",
    },
    stepCountText: {
      fontSize: 11,
      fontWeight: "700",
      color: colors.mutedForeground,
    },
    qualificationChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 10,
    },
    qualificationChipText: {
      fontSize: 11,
      fontWeight: "700",
    },
    optionTitle: {
      fontSize: 21,
      fontWeight: "900",
      color: colors.foreground,
      marginBottom: 6,
    },
    optionDesc: {
      fontSize: 13.5,
      lineHeight: 20,
      color: colors.mutedForeground,
      marginBottom: 16,
    },
    optionActionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0",
    },
    optionHighlights: {
      flex: 1,
    },
    highlightPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    highlightPillText: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.foreground,
    },
    startPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 12,
    },
    startPillText: {
      fontSize: 13,
      fontWeight: "800",
      color: "#FFFFFF",
    },
    readinessCard: {
      padding: 18,
      borderRadius: 20,
      borderWidth: 1,
      marginBottom: 16,
    },
    readinessCardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    readinessTitleGroup: {
      flex: 1,
    },
    readinessTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: colors.foreground,
      marginBottom: 4,
    },
    readinessBandEstimate: {
      fontSize: 13,
      fontWeight: "700",
      color: primaryAccent,
    },
    scoreDial: {
      width: 48,
      height: 48,
      borderRadius: 24,
      borderWidth: 3,
      alignItems: "center",
      justifyContent: "center",
    },
    scoreDialNumber: {
      fontSize: 14,
      fontWeight: "900",
    },
    skillsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    skillItem: {
      flex: 1,
      minWidth: "45%",
      padding: 12,
      borderRadius: 14,
      borderWidth: 1,
    },
    skillItemHead: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: 6,
    },
    skillItemLabel: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.foreground,
    },
    skillItemPercent: {
      fontSize: 14,
      fontWeight: "800",
      color: colors.foreground,
      marginBottom: 6,
    },
    skillBarTrack: {
      height: 6,
      borderRadius: 3,
      overflow: "hidden",
    },
    skillBarFill: {
      height: "100%",
      borderRadius: 3,
    },
    strategyBanner: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      padding: 16,
      borderRadius: 18,
      borderWidth: 1,
    },
    strategyBannerIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
    },
    strategyBannerCopy: {
      flex: 1,
    },
    strategyBannerTitle: {
      fontSize: 14.5,
      fontWeight: "800",
      color: colors.foreground,
      marginBottom: 2,
    },
    strategyBannerDesc: {
      fontSize: 12,
      lineHeight: 16,
      color: colors.mutedForeground,
    },
  });
}
