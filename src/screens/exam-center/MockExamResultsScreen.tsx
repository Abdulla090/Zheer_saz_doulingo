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
  Award01Icon,
  Book02Icon,
  Certificate01Icon,
  CheckmarkCircle02Icon,
  Edit02Icon,
  HeadphonesIcon,
  SparklesIcon,
  StarIcon,
  VoiceIcon,
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
import type { ExamId, MockExamAttemptRecord } from "../../types/exam-center";

export default function MockExamResultsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ examId?: string; attemptId?: string }>();
  const { width } = useWindowDimensions();
  const { t, locale, isKu } = useI18n();
  const { colors, isDark } = useThemeColors();
  const isRtl = isKu || locale === "ar";
  const compact = width < 380;
  const isDesktopWeb = Platform.OS === "web" && width > 768;

  const exam: ExamId = params.examId === "det" ? "det" : "ielts";
  const isIelts = exam === "ielts";
  const primaryAccent = isIelts ? "#3B82F6" : "#10B981";

  const { mockExamHistory } = useExamStore();
  const latestAttempt: MockExamAttemptRecord =
    mockExamHistory.find((a) => a.id === params.attemptId) ||
    mockExamHistory[0] || {
      id: "demo",
      exam,
      mockExamId: "mock-1",
      completedAt: new Date().toISOString(),
      durationSeconds: 3600,
      overallScoreFormatted: isIelts ? "AI Estimated IELTS Band: 7.0" : "AI Estimated DET Score: 120 / 160",
      overallBandOrScore: isIelts ? 7.0 : 120,
      sectionScores: {
        reading: { score: 75, max: 100, bandOrScaled: 7.5 },
        listening: { score: 70, max: 100, bandOrScaled: 7.0 },
        writing: { score: 65, max: 100, bandOrScaled: 6.5 },
        speaking: { score: 70, max: 100, bandOrScaled: 7.0 },
      },
      strengths: ["Strong lexical range in speaking", "Fast reading scanning accuracy"],
      weaknesses: ["Writing Task 2 paragraph linkers", "Listening distractor traps in Section 3"],
      mistakeSummary: [],
      aiCoachAdvice: "Focus on academic transition words to lift your Writing band to 7.5.",
      recommendedTopicIds: isIelts ? ["ielts-write-01", "ielts-read-01"] : ["det-prod-01", "det-read-01"],
    };

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
          {/* Top Bar */}
          <View style={[styles.topBar, isRtl && styles.rowReverse]}>
            <PremiumPressable
              onPress={() => router.push(`/exam-center/${exam}/mock-exam` as never)}
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
              <AppText style={styles.headerPillText} forceLatinFont latinRole="bold">
                Mock Exam Comprehensive Report
              </AppText>
            </View>
          </View>

          {/* Overall Estimated Band / Score Hero */}
          <View
            style={[
              styles.heroResultCard,
              {
                backgroundColor: colors.surfaceRaised,
                borderColor: primaryAccent,
                ...crossShadow({
                  color: primaryAccent,
                  offsetY: 8,
                  blur: 24,
                  opacity: isDark ? 0.35 : 0.15,
                }),
              },
            ]}
          >
            <View style={[styles.heroResultBadge, { backgroundColor: isDark ? "rgba(59, 130, 246, 0.2)" : "#DBEAFE" }]}>
              <HugeiconsIcon icon={Certificate01Icon} size={16} color={primaryAccent} strokeWidth={2.2} />
              <AppText style={[styles.heroResultBadgeText, { color: primaryAccent }]} forceLatinFont latinRole="bold">
                {isIelts ? "AI ESTIMATED IELTS BAND" : "AI ESTIMATED DET SCORE"}
              </AppText>
            </View>

            <AppText style={styles.scoreHeroNumber} forceLatinFont latinRole="bold">
              {isIelts ? latestAttempt.overallBandOrScore.toFixed(1) : latestAttempt.overallBandOrScore}
            </AppText>
            <AppText style={styles.scoreHeroSubtext} forceLatinFont latinRole="bold">
              {isIelts ? "Indicative Band Score (Scale 0-9)" : "Indicative Score (Scale 10-160)"}
            </AppText>

            <AppText style={styles.disclaimerLabel} forceLatinFont>
              *Twino AI indicative assessment. Not an official IELTS or Duolingo certificate.
            </AppText>
          </View>

          {/* Section Scores Grid */}
          <AppText style={styles.sectionTitle} forceLatinFont latinRole="bold">
            Section-by-Section Breakdown
          </AppText>

          <View style={styles.sectionsGrid}>
            <View style={[styles.secScoreCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
              <View style={[styles.secCardHead, isRtl && styles.rowReverse]}>
                <HugeiconsIcon icon={Book02Icon} size={15} color="#3B82F6" strokeWidth={2.2} />
                <AppText style={styles.secCardName} forceLatinFont latinRole="bold">
                  Reading
                </AppText>
              </View>
              <AppText style={styles.secScoreVal} forceLatinFont latinRole="bold">
                {isIelts
                  ? `Band ${latestAttempt.sectionScores.reading.bandOrScaled}`
                  : `${latestAttempt.sectionScores.reading.score}%`}
              </AppText>
            </View>

            <View style={[styles.secScoreCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
              <View style={[styles.secCardHead, isRtl && styles.rowReverse]}>
                <HugeiconsIcon icon={HeadphonesIcon} size={15} color="#10B981" strokeWidth={2.2} />
                <AppText style={styles.secCardName} forceLatinFont latinRole="bold">
                  Listening
                </AppText>
              </View>
              <AppText style={styles.secScoreVal} forceLatinFont latinRole="bold">
                {isIelts
                  ? `Band ${latestAttempt.sectionScores.listening.bandOrScaled}`
                  : `${latestAttempt.sectionScores.listening.score}%`}
              </AppText>
            </View>

            <View style={[styles.secScoreCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
              <View style={[styles.secCardHead, isRtl && styles.rowReverse]}>
                <HugeiconsIcon icon={Edit02Icon} size={15} color="#F59E0B" strokeWidth={2.2} />
                <AppText style={styles.secCardName} forceLatinFont latinRole="bold">
                  Writing
                </AppText>
              </View>
              <AppText style={styles.secScoreVal} forceLatinFont latinRole="bold">
                {isIelts
                  ? `Band ${latestAttempt.sectionScores.writing.bandOrScaled}`
                  : `${latestAttempt.sectionScores.writing.score}%`}
              </AppText>
            </View>

            <View style={[styles.secScoreCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
              <View style={[styles.secCardHead, isRtl && styles.rowReverse]}>
                <HugeiconsIcon icon={VoiceIcon} size={15} color="#EC4899" strokeWidth={2.2} />
                <AppText style={styles.secCardName} forceLatinFont latinRole="bold">
                  Speaking
                </AppText>
              </View>
              <AppText style={styles.secScoreVal} forceLatinFont latinRole="bold">
                {isIelts
                  ? `Band ${latestAttempt.sectionScores.speaking.bandOrScaled}`
                  : `${latestAttempt.sectionScores.speaking.score}%`}
              </AppText>
            </View>
          </View>

          {/* Strongest vs Weakest Skills */}
          <View style={styles.skillsComparisonRow}>
            <View style={[styles.skillBox, { backgroundColor: isDark ? "rgba(16, 185, 129, 0.08)" : "#ECFDF5", borderColor: "#10B981" }]}>
              <View style={[styles.skillBoxHead, isRtl && styles.rowReverse]}>
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} color="#10B981" strokeWidth={2.4} />
                <AppText style={[styles.skillBoxTitle, { color: "#10B981" }]} forceLatinFont latinRole="bold">
                  Strongest Skills
                </AppText>
              </View>
              {latestAttempt.strengths.map((s, idx) => (
                <AppText key={idx} style={styles.skillBulletText} forceLatinFont>
                  • {s}
                </AppText>
              ))}
            </View>

            <View style={[styles.skillBox, { backgroundColor: isDark ? "rgba(239, 68, 68, 0.08)" : "#FEF2F2", borderColor: "#EF4444" }]}>
              <View style={[styles.skillBoxHead, isRtl && styles.rowReverse]}>
                <HugeiconsIcon icon={Alert01Icon} size={16} color="#EF4444" strokeWidth={2.4} />
                <AppText style={[styles.skillBoxTitle, { color: "#EF4444" }]} forceLatinFont latinRole="bold">
                  Skills to Improve
                </AppText>
              </View>
              {latestAttempt.weaknesses.map((w, idx) => (
                <AppText key={idx} style={styles.skillBulletText} forceLatinFont>
                  • {w}
                </AppText>
              ))}
            </View>
          </View>

          {/* AI Coach Personalized Improvement Advice */}
          <View style={[styles.coachAdviceCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
            <View style={[styles.coachHead, isRtl && styles.rowReverse]}>
              <HugeiconsIcon icon={SparklesIcon} size={18} color="#F59E0B" strokeWidth={2.2} />
              <AppText style={styles.coachTitle} forceLatinFont latinRole="bold">
                AI Coach Assessment & Recommendations
              </AppText>
            </View>
            <AppText style={styles.coachBody} forceLatinFont>
              {latestAttempt.aiCoachAdvice}
            </AppText>

            <View style={styles.divider} />

            <AppText style={styles.recLessonsHeader} forceLatinFont latinRole="bold">
              Recommended Next Preparation Lessons:
            </AppText>

            <PremiumPressable
              onPress={() => router.push(`/exam-center/${exam}/preparation` as never)}
              style={[styles.recLessonsBtn, { backgroundColor: isDark ? "rgba(59, 130, 246, 0.15)" : "#EFF6FF" }]}
            >
              <HugeiconsIcon icon={Book02Icon} size={18} color={primaryAccent} strokeWidth={2.2} />
              <AppText style={[styles.recLessonsBtnText, { color: primaryAccent }]} forceLatinFont latinRole="bold">
                Open Targeted Preparation Lessons
              </AppText>
              <HugeiconsIcon icon={forwardIcon} size={16} color={primaryAccent} strokeWidth={2.4} />
            </PremiumPressable>
          </View>

          {/* Question-by-Question Mistake Review */}
          {latestAttempt.mistakeSummary.length > 0 && (
            <View style={styles.mistakesSection}>
              <AppText style={styles.sectionTitle} forceLatinFont latinRole="bold">
                Detailed Question Mistake Analysis
              </AppText>

              {latestAttempt.mistakeSummary.map((m, idx) => (
                <View
                  key={idx}
                  style={[styles.mistakeItemCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}
                >
                  <View style={[styles.mistakeHead, isRtl && styles.rowReverse]}>
                    <AppText style={styles.mistakeSectionTag} forceLatinFont latinRole="bold">
                      {m.section.toUpperCase()} • {m.skillTag}
                    </AppText>
                  </View>

                  <AppText style={styles.mistakePrompt} forceLatinFont>
                    {m.prompt}
                  </AppText>
                  <AppText style={styles.mistakeYourAns} forceLatinFont>
                    Your submission: <AppText style={{ fontWeight: "700" }}>{m.userAnswer}</AppText>
                  </AppText>
                  <AppText style={styles.mistakeCorrectAns} forceLatinFont>
                    Target formulation: <AppText style={{ fontWeight: "700" }}>{m.correctAnswer}</AppText>
                  </AppText>

                  <View style={styles.divider} />
                  <AppText style={styles.mistakeExpl} forceLatinFont>
                    {m.explanation}
                  </AppText>
                </View>
              ))}
            </View>
          )}

          {/* Return CTA */}
          <PremiumPressable
            onPress={() => router.push(`/exam-center/${exam}` as never)}
            style={[styles.backToHubBtn, { backgroundColor: primaryAccent }]}
            pressScale={0.98}
          >
            <AppText style={styles.backToHubBtnText} forceLatinFont latinRole="bold">
              Return to Exam Main Page
            </AppText>
            <HugeiconsIcon icon={forwardIcon} size={18} color="#FFFFFF" strokeWidth={2.5} />
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
      color: colors.foreground,
    },
    heroResultCard: {
      padding: 24,
      borderRadius: 22,
      borderWidth: 1.5,
      alignItems: "center",
      textAlign: "center",
      marginBottom: 20,
    },
    heroResultBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 10,
      marginBottom: 10,
    },
    heroResultBadgeText: {
      fontSize: 11.5,
      fontWeight: "800",
      letterSpacing: 0.5,
    },
    scoreHeroNumber: {
      fontSize: 48,
      fontWeight: "900",
      color: colors.foreground,
      marginBottom: 2,
    },
    scoreHeroSubtext: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.mutedForeground,
      marginBottom: 10,
    },
    disclaimerLabel: {
      fontSize: 11,
      fontStyle: "italic",
      color: colors.mutedForeground,
      textAlign: "center",
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: colors.foreground,
      marginBottom: 10,
    },
    sectionsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginBottom: 18,
    },
    secScoreCard: {
      flex: 1,
      minWidth: "45%",
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
    },
    secCardHead: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: 6,
    },
    secCardName: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.foreground,
    },
    secScoreVal: {
      fontSize: 18,
      fontWeight: "900",
      color: colors.foreground,
    },
    skillsComparisonRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginBottom: 18,
    },
    skillBox: {
      flex: 1,
      minWidth: "45%",
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
    },
    skillBoxHead: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: 8,
    },
    skillBoxTitle: {
      fontSize: 13,
      fontWeight: "800",
    },
    skillBulletText: {
      fontSize: 12.5,
      lineHeight: 18,
      color: colors.foreground,
      marginBottom: 4,
    },
    coachAdviceCard: {
      padding: 18,
      borderRadius: 20,
      borderWidth: 1,
      marginBottom: 18,
    },
    coachHead: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 8,
    },
    coachTitle: {
      fontSize: 14.5,
      fontWeight: "800",
      color: colors.foreground,
    },
    coachBody: {
      fontSize: 13.5,
      lineHeight: 20,
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
    recLessonsBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 14,
      borderRadius: 14,
    },
    recLessonsBtnText: {
      fontSize: 13,
      fontWeight: "800",
      flex: 1,
      marginHorizontal: 8,
    },
    mistakesSection: {
      gap: 12,
      marginBottom: 18,
    },
    mistakeItemCard: {
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
    },
    mistakeHead: {
      marginBottom: 6,
    },
    mistakeSectionTag: {
      fontSize: 11,
      fontWeight: "800",
      color: primaryAccent,
      textTransform: "uppercase",
    },
    mistakePrompt: {
      fontSize: 13,
      color: colors.foreground,
      marginBottom: 6,
    },
    mistakeYourAns: {
      fontSize: 12.5,
      color: "#EF4444",
      marginBottom: 2,
    },
    mistakeCorrectAns: {
      fontSize: 12.5,
      color: "#10B981",
    },
    mistakeExpl: {
      fontSize: 12.5,
      lineHeight: 18,
      color: colors.mutedForeground,
    },
    backToHubBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 15,
      borderRadius: 16,
    },
    backToHubBtnText: {
      fontSize: 14,
      fontWeight: "800",
      color: "#FFFFFF",
    },
  });
}
