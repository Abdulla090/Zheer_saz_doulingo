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
  Alert01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Book02Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  LockIcon,
  Mortarboard02Icon,
  PlayIcon,
  SparklesIcon,
  Award01Icon,
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

export default function ExamMockGatewayScreen() {
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
  const primaryAccent = isIelts ? "#3B82F6" : "#10B981";

  const { readiness, mockExamHistory } = useExamStore();
  const currentReadiness = readiness[exam];
  const isQualified = currentReadiness.qualifiedForMock;

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
          {/* Top Bar with Back */}
          <View style={[styles.topBar, isRtl && styles.rowReverse]}>
            <PremiumPressable
              onPress={() => router.push(`/exam-center/${exam}` as never)}
              style={[styles.backBtn, { borderColor: colors.border }]}
            >
              <HugeiconsIcon
                icon={isRtl ? ArrowRight01Icon : ArrowLeft01Icon}
                size={20}
                color={colors.foreground}
                strokeWidth={2.2}
              />
            </PremiumPressable>

            <View style={styles.headerPill}>
              <HugeiconsIcon icon={Award01Icon} size={14} color="#F97316" strokeWidth={2.2} />
              <AppText style={[styles.headerPillText, { color: "#F97316" }]} forceLatinFont latinRole="bold">
                {isIelts ? "IELTS Mock Testing Gateway" : "DET Mock Testing Gateway"}
              </AppText>
            </View>
          </View>

          {/* ======================================================== */}
          {/* QUALIFIED STATE (Score >= 50%)                            */}
          {/* ======================================================== */}
          {isQualified ? (
            <View style={styles.stateContainer}>
              <View
                style={[
                  styles.statusHeroCard,
                  {
                    backgroundColor: isDark ? "rgba(16, 185, 129, 0.1)" : "#ECFDF5",
                    borderColor: "#10B981",
                    ...crossShadow({
                      color: "#10B981",
                      offsetY: 8,
                      blur: 24,
                      opacity: isDark ? 0.3 : 0.15,
                    }),
                  },
                ]}
              >
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={36} color="#10B981" strokeWidth={2.2} />
                <AppText style={styles.unlockedHeadline} forceLatinFont latinRole="bold">
                  You passed the readiness test!
                </AppText>
                <AppText style={styles.unlockedSubline} forceLatinFont>
                  You can now start the full {isIelts ? "IELTS" : "DET"} Mock Exam.
                </AppText>
                <View style={styles.scorePill}>
                  <AppText style={styles.scorePillText} forceLatinFont latinRole="bold">
                    Readiness Score: {currentReadiness.qualificationScorePercent ?? currentReadiness.overallScorePercent}%
                  </AppText>
                </View>
              </View>

              {/* Start Mock Exam Action */}
              <PremiumPressable
                onPress={() => router.push(`/exam-center/${exam}/mock-exam/exam` as never)}
                style={[
                  styles.launchMockBtn,
                  {
                    backgroundColor: "#F97316",
                    ...crossShadow({
                      color: "#F97316",
                      offsetY: 8,
                      blur: 20,
                      opacity: 0.3,
                    }),
                  },
                ]}
                pressScale={0.98}
              >
                <HugeiconsIcon icon={PlayIcon} size={22} color="#FFFFFF" strokeWidth={2.4} />
                <AppText style={styles.launchMockBtnText} forceLatinFont latinRole="bold">
                  Start Full Mock Exam Simulation
                </AppText>
              </PremiumPressable>

              {/* Mock Exam Rules / Format Card */}
              <View style={[styles.infoCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
                <AppText style={styles.infoCardTitle} forceLatinFont latinRole="bold">
                  Simulation Rules & Instructions
                </AppText>
                <View style={[styles.ruleRow, isRtl && styles.rowReverse]}>
                  <HugeiconsIcon icon={Clock01Icon} size={16} color={colors.primary} strokeWidth={2.2} />
                  <AppText style={styles.ruleText} forceLatinFont>
                    {isIelts
                      ? "Total Time: ~2.5 hours (Listening 30m, Reading 60m, Writing 60m, Speaking 14m)"
                      : "Total Time: ~60 minutes across all adaptive tasks."}
                  </AppText>
                </View>
                <View style={[styles.ruleRow, isRtl && styles.rowReverse]}>
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} color="#10B981" strokeWidth={2.2} />
                  <AppText style={styles.ruleText} forceLatinFont>
                    No learning hints during the exam. Answers and full AI breakdown provided upon completion.
                  </AppText>
                </View>
              </View>

              {/* Retake Diagnostic Shortcut */}
              <PremiumPressable
                onPress={() => router.push(`/exam-center/${exam}/mock-exam/qualification` as never)}
                style={[styles.retakeBtn, { borderColor: colors.border }]}
              >
                <AppText style={styles.retakeBtnText} forceLatinFont latinRole="bold">
                  Retake 15-Min Readiness Diagnostic
                </AppText>
              </PremiumPressable>
            </View>
          ) : (
            /* ======================================================== */
            /* LOCKED STATE (Score < 50% or Not Taken)                   */
            /* ======================================================== */
            <View style={styles.stateContainer}>
              <View
                style={[
                  styles.statusHeroCard,
                  {
                    backgroundColor: isDark ? "rgba(239, 68, 68, 0.08)" : "#FEF2F2",
                    borderColor: "#EF4444",
                    ...crossShadow({
                      color: "#EF4444",
                      offsetY: 8,
                      blur: 24,
                      opacity: isDark ? 0.25 : 0.12,
                    }),
                  },
                ]}
              >
                <HugeiconsIcon icon={LockIcon} size={36} color="#EF4444" strokeWidth={2.2} />
                <AppText style={styles.lockedHeadline} forceLatinFont latinRole="bold">
                  Mock Exam Locked
                </AppText>
                <AppText style={styles.lockedSubline} forceLatinFont>
                  {currentReadiness.qualificationScorePercent !== undefined
                    ? `Your readiness score is ${currentReadiness.qualificationScorePercent}%. You need at least 50% to unlock the full mock exam.`
                    : "Complete the 15-minute Exam Readiness Test with a score of 50% or higher to unlock the full Mock Exam."}
                </AppText>
              </View>

              {/* Diagnostic Test CTA */}
              <PremiumPressable
                onPress={() => router.push(`/exam-center/${exam}/mock-exam/qualification` as never)}
                style={[styles.launchDiagnosticBtn, { backgroundColor: primaryAccent }]}
                pressScale={0.98}
              >
                <HugeiconsIcon icon={SparklesIcon} size={20} color="#FFFFFF" strokeWidth={2.4} />
                <AppText style={styles.launchDiagnosticBtnText} forceLatinFont latinRole="bold">
                  Take 15-Min Readiness Qualification Test
                </AppText>
              </PremiumPressable>

              {/* Weak Areas & Recommendations */}
              <View style={[styles.infoCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
                <AppText style={styles.infoCardTitle} forceLatinFont latinRole="bold">
                  Identified Weak Areas & Skills to Improve
                </AppText>

                {currentReadiness.weakSkillTags.map((tag, idx) => (
                  <View key={idx} style={[styles.weakSkillRow, isRtl && styles.rowReverse]}>
                    <HugeiconsIcon icon={Alert01Icon} size={15} color="#EF4444" strokeWidth={2.2} />
                    <AppText style={styles.weakSkillText} forceLatinFont>
                      {tag}
                    </AppText>
                  </View>
                ))}

                <View style={styles.divider} />

                <AppText style={styles.recLessonsHeader} forceLatinFont latinRole="bold">
                  Recommended Preparation Lessons:
                </AppText>

                <PremiumPressable
                  onPress={() => router.push(`/exam-center/${exam}/preparation` as never)}
                  style={[styles.redirectPrepBtn, { backgroundColor: isDark ? "rgba(59, 130, 246, 0.15)" : "#EFF6FF" }]}
                >
                  <HugeiconsIcon icon={Book02Icon} size={18} color={primaryAccent} strokeWidth={2.2} />
                  <AppText style={[styles.redirectPrepBtnText, { color: primaryAccent }]} forceLatinFont latinRole="bold">
                    Go to Recommended Preparation Lessons
                  </AppText>
                  <HugeiconsIcon icon={forwardIcon} size={16} color={primaryAccent} strokeWidth={2.4} />
                </PremiumPressable>
              </View>
            </View>
          )}

          {/* Past Mock Exam History List */}
          {mockExamHistory.filter((m) => m.exam === exam).length > 0 && (
            <View style={styles.historySection}>
              <AppText style={styles.historyHeader} forceLatinFont latinRole="bold">
                Previous Mock Exam History
              </AppText>

              {mockExamHistory
                .filter((m) => m.exam === exam)
                .map((attempt) => (
                  <View
                    key={attempt.id}
                    style={[styles.historyCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}
                  >
                    <View style={[styles.historyCardHead, isRtl && styles.rowReverse]}>
                      <AppText style={styles.historyScore} forceLatinFont latinRole="bold">
                        {attempt.overallScoreFormatted}
                      </AppText>
                      <AppText style={styles.historyDate} forceLatinFont>
                        {new Date(attempt.completedAt).toLocaleDateString()}
                      </AppText>
                    </View>
                    <AppText style={styles.historyAdvice} forceLatinFont>
                      {attempt.aiCoachAdvice}
                    </AppText>
                  </View>
                ))}
            </View>
          )}
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
    headerPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "#F1F5F9",
    },
    headerPillText: {
      fontSize: 12.5,
      fontWeight: "700",
    },
    stateContainer: {
      gap: 16,
      marginBottom: 24,
    },
    statusHeroCard: {
      padding: 24,
      borderRadius: 22,
      borderWidth: 1.5,
      alignItems: "center",
      textAlign: "center",
    },
    unlockedHeadline: {
      fontSize: 20,
      fontWeight: "900",
      color: "#10B981",
      marginTop: 10,
      marginBottom: 4,
    },
    unlockedSubline: {
      fontSize: 13.5,
      color: colors.foreground,
      textAlign: "center",
      marginBottom: 12,
    },
    lockedHeadline: {
      fontSize: 20,
      fontWeight: "900",
      color: "#EF4444",
      marginTop: 10,
      marginBottom: 4,
    },
    lockedSubline: {
      fontSize: 13.5,
      lineHeight: 19,
      color: colors.foreground,
      textAlign: "center",
    },
    scorePill: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 10,
      backgroundColor: isDark ? "rgba(16, 185, 129, 0.2)" : "#DCFCE7",
    },
    scorePillText: {
      fontSize: 12,
      fontWeight: "800",
      color: "#10B981",
    },
    launchMockBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      paddingVertical: 16,
      borderRadius: 16,
    },
    launchMockBtnText: {
      fontSize: 15,
      fontWeight: "900",
      color: "#FFFFFF",
    },
    launchDiagnosticBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      paddingVertical: 15,
      borderRadius: 16,
    },
    launchDiagnosticBtnText: {
      fontSize: 14,
      fontWeight: "800",
      color: "#FFFFFF",
    },
    infoCard: {
      padding: 18,
      borderRadius: 20,
      borderWidth: 1,
    },
    infoCardTitle: {
      fontSize: 15,
      fontWeight: "800",
      color: colors.foreground,
      marginBottom: 12,
    },
    ruleRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
      marginBottom: 10,
    },
    ruleText: {
      flex: 1,
      fontSize: 13,
      lineHeight: 18,
      color: colors.foreground,
    },
    weakSkillRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 8,
    },
    weakSkillText: {
      fontSize: 13,
      color: colors.foreground,
    },
    divider: {
      height: 1,
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0",
      marginVertical: 12,
    },
    recLessonsHeader: {
      fontSize: 13,
      fontWeight: "800",
      color: colors.foreground,
      marginBottom: 8,
    },
    redirectPrepBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 14,
      borderRadius: 14,
    },
    redirectPrepBtnText: {
      fontSize: 13,
      fontWeight: "800",
      flex: 1,
      marginHorizontal: 8,
    },
    retakeBtn: {
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surfaceRaised,
    },
    retakeBtnText: {
      fontSize: 13,
      color: colors.foreground,
    },
    historySection: {
      gap: 10,
    },
    historyHeader: {
      fontSize: 16,
      fontWeight: "800",
      color: colors.foreground,
      marginBottom: 4,
    },
    historyCard: {
      padding: 14,
      borderRadius: 14,
      borderWidth: 1,
    },
    historyCardHead: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
    },
    historyScore: {
      fontSize: 14,
      fontWeight: "800",
      color: colors.foreground,
    },
    historyDate: {
      fontSize: 12,
      color: colors.mutedForeground,
    },
    historyAdvice: {
      fontSize: 12.5,
      color: colors.mutedForeground,
    },
  });
}
