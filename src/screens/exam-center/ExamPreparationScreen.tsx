/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState } from "react";
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
  Book02Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Edit02Icon,
  HeadphonesIcon,
  Mortarboard02Icon,
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
import type { ExamId, ExamSection, TopicDifficulty } from "../../types/exam-center";
import { IELTS_PREPARATION_TOPICS } from "../../data/exam-center/ielts-topics";
import { DET_PREPARATION_TOPICS } from "../../data/exam-center/det-topics";

export default function ExamPreparationScreen() {
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

  const [activeSection, setActiveSection] = useState<ExamSection>("reading");
  const [selectedDifficulty, setSelectedDifficulty] = useState<TopicDifficulty | "all">("all");

  const { isTopicCompleted, getTopicScore, readiness } = useExamStore();
  const currentReadiness = readiness[exam];

  const allTopics = isIelts ? IELTS_PREPARATION_TOPICS : DET_PREPARATION_TOPICS;

  const filteredTopics = useMemo(() => {
    return allTopics.filter((topic) => {
      const matchesSection = topic.section === activeSection;
      const matchesDifficulty =
        selectedDifficulty === "all" || topic.difficulty === selectedDifficulty;
      return matchesSection && matchesDifficulty;
    });
  }, [allTopics, activeSection, selectedDifficulty]);

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
          {/* Header with Back */}
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
              <HugeiconsIcon icon={Book02Icon} size={14} color={primaryAccent} strokeWidth={2.2} />
              <AppText style={[styles.headerPillText, { color: primaryAccent }]} forceLatinFont latinRole="bold">
                {isIelts ? "IELTS Preparation Course" : "DET Preparation Course"}
              </AppText>
            </View>
          </View>

          {/* Title and Flow Explainer */}
          <View style={styles.titleBlock}>
            <AppText
              style={styles.mainTitle}
              languageCode={locale}
              forceKurdishFont={isRtl}
              align="start"
            >
              Structured Learning Paths
            </AppText>
            <AppText
              style={styles.subtitle}
              languageCode={locale}
              forceKurdishFont={isRtl}
              align="start"
            >
              Every unit follows: Learn concept → Analyze weak vs excellent examples → Practice task → Score quiz.
            </AppText>
          </View>

          {/* AI Recommended Next Topic Banner */}
          {currentReadiness.recommendedTopicIds.length > 0 && (
            <View
              style={[
                styles.aiRecCard,
                isRtl && styles.rowReverse,
                {
                  backgroundColor: isDark ? "rgba(255, 107, 74, 0.1)" : "#FFF7ED",
                  borderColor: isDark ? "rgba(255, 107, 74, 0.3)" : "#FED7AA",
                },
              ]}
            >
              <HugeiconsIcon icon={SparklesIcon} size={20} color={colors.primary} strokeWidth={2.2} />
              <View style={styles.aiRecCopy}>
                <AppText style={styles.aiRecTitle} forceLatinFont latinRole="bold">
                  AI Study Plan Recommendation
                </AppText>
                <AppText
                  style={styles.aiRecText}
                  languageCode={locale}
                  forceKurdishFont={isRtl}
                  align="start"
                >
                  Based on your readiness profile, we recommend focusing on{" "}
                  {currentReadiness.weakSkillTags.slice(0, 2).join(" and ") || "Core Skills"}.
                </AppText>
              </View>
            </View>
          )}

          {/* 4 Section Tabs */}
          <View style={styles.sectionTabs}>
            <PremiumPressable
              onPress={() => setActiveSection("reading")}
              style={[
                styles.sectionTabBtn,
                activeSection === "reading" && styles.sectionTabBtnActive,
                { borderColor: activeSection === "reading" ? primaryAccent : colors.border },
              ]}
            >
              <HugeiconsIcon
                icon={Book02Icon}
                size={16}
                color={activeSection === "reading" ? "#FFFFFF" : colors.mutedForeground}
                strokeWidth={2.2}
              />
              <AppText
                style={[
                  styles.sectionTabBtnText,
                  activeSection === "reading" && styles.sectionTabBtnTextActive,
                ]}
                forceLatinFont
                latinRole="bold"
              >
                Reading
              </AppText>
            </PremiumPressable>

            <PremiumPressable
              onPress={() => setActiveSection("listening")}
              style={[
                styles.sectionTabBtn,
                activeSection === "listening" && styles.sectionTabBtnActive,
                { borderColor: activeSection === "listening" ? primaryAccent : colors.border },
              ]}
            >
              <HugeiconsIcon
                icon={HeadphonesIcon}
                size={16}
                color={activeSection === "listening" ? "#FFFFFF" : colors.mutedForeground}
                strokeWidth={2.2}
              />
              <AppText
                style={[
                  styles.sectionTabBtnText,
                  activeSection === "listening" && styles.sectionTabBtnTextActive,
                ]}
                forceLatinFont
                latinRole="bold"
              >
                Listening
              </AppText>
            </PremiumPressable>

            <PremiumPressable
              onPress={() => setActiveSection("writing")}
              style={[
                styles.sectionTabBtn,
                activeSection === "writing" && styles.sectionTabBtnActive,
                { borderColor: activeSection === "writing" ? primaryAccent : colors.border },
              ]}
            >
              <HugeiconsIcon
                icon={Edit02Icon}
                size={16}
                color={activeSection === "writing" ? "#FFFFFF" : colors.mutedForeground}
                strokeWidth={2.2}
              />
              <AppText
                style={[
                  styles.sectionTabBtnText,
                  activeSection === "writing" && styles.sectionTabBtnTextActive,
                ]}
                forceLatinFont
                latinRole="bold"
              >
                Writing
              </AppText>
            </PremiumPressable>

            <PremiumPressable
              onPress={() => setActiveSection("speaking")}
              style={[
                styles.sectionTabBtn,
                activeSection === "speaking" && styles.sectionTabBtnActive,
                { borderColor: activeSection === "speaking" ? primaryAccent : colors.border },
              ]}
            >
              <HugeiconsIcon
                icon={VoiceIcon}
                size={16}
                color={activeSection === "speaking" ? "#FFFFFF" : colors.mutedForeground}
                strokeWidth={2.2}
              />
              <AppText
                style={[
                  styles.sectionTabBtnText,
                  activeSection === "speaking" && styles.sectionTabBtnTextActive,
                ]}
                forceLatinFont
                latinRole="bold"
              >
                Speaking
              </AppText>
            </PremiumPressable>
          </View>

          {/* Topic Cards List */}
          <View style={styles.topicList}>
            {filteredTopics.map((topic, index) => {
              const completed = isTopicCompleted(topic.id);
              const score = getTopicScore(topic.id);

              return (
                <PremiumPressable
                  key={topic.id}
                  onPress={() => router.push(`/exam-center/${exam}/preparation/${topic.id}` as never)}
                  style={[
                    styles.topicCard,
                    {
                      backgroundColor: colors.surfaceRaised,
                      borderColor: completed ? "#10B981" : colors.border,
                      ...crossShadow({
                        color: isDark ? "#000" : "#000",
                        offsetY: 6,
                        blur: 16,
                        opacity: isDark ? 0.2 : 0.06,
                      }),
                    },
                  ]}
                  pressScale={0.98}
                >
                  <View style={[styles.topicCardTop, isRtl && styles.rowReverse]}>
                    <View style={styles.topicBadgeGroup}>
                      <View style={[styles.difficultyChip, isRtl && styles.rowReverse]}>
                        <AppText style={styles.difficultyChipText} forceLatinFont latinRole="bold">
                          {topic.difficulty.toUpperCase()}
                        </AppText>
                      </View>
                      <View style={[styles.timeChip, isRtl && styles.rowReverse]}>
                        <HugeiconsIcon icon={Clock01Icon} size={12} color={colors.mutedForeground} strokeWidth={2.2} />
                        <AppText style={styles.timeChipText} forceLatinFont latinRole="bold">
                          {topic.estimatedMinutes} min
                        </AppText>
                      </View>
                    </View>

                    {completed ? (
                      <View style={[styles.completedChip, isRtl && styles.rowReverse]}>
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} color="#10B981" strokeWidth={2.4} />
                        <AppText style={styles.completedChipText} forceLatinFont latinRole="bold">
                          Mastered ({score}%)
                        </AppText>
                      </View>
                    ) : (
                      <View style={[styles.startChip, isRtl && styles.rowReverse]}>
                        <AppText style={styles.startChipText} forceLatinFont latinRole="bold">
                          Start Lesson
                        </AppText>
                      </View>
                    )}
                  </View>

                  <AppText style={styles.topicTitle} forceLatinFont latinRole="bold">
                    {topic.title}
                  </AppText>
                  <AppText
                    style={styles.topicSubtitle}
                    languageCode={locale}
                    forceKurdishFont={isRtl}
                    align="start"
                  >
                    {topic.subtitle}
                  </AppText>

                  {/* Flow Pills */}
                  <View style={[styles.flowPillsRow, isRtl && styles.rowReverse]}>
                    <View style={styles.flowPill}>
                      <AppText style={styles.flowPillText} forceLatinFont latinRole="bold">
                        1. Strategy
                      </AppText>
                    </View>
                    <View style={styles.flowPill}>
                      <AppText style={styles.flowPillText} forceLatinFont latinRole="bold">
                        2. Weak vs Good
                      </AppText>
                    </View>
                    <View style={styles.flowPill}>
                      <AppText style={styles.flowPillText} forceLatinFont latinRole="bold">
                        3. Practice
                      </AppText>
                    </View>
                    <View style={styles.flowPill}>
                      <AppText style={styles.flowPillText} forceLatinFont latinRole="bold">
                        4. Quiz Test
                      </AppText>
                    </View>
                  </View>
                </PremiumPressable>
              );
            })}
          </View>
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
    titleBlock: {
      marginBottom: 16,
    },
    mainTitle: {
      fontSize: isDesktopWeb ? 28 : compact ? 22 : 25,
      fontWeight: "900",
      color: colors.foreground,
      fontFamily: "Rabar_044",
      letterSpacing: -0.5,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 13.5,
      lineHeight: 19,
      color: colors.mutedForeground,
    },
    aiRecCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
      marginBottom: 18,
    },
    aiRecCopy: {
      flex: 1,
    },
    aiRecTitle: {
      fontSize: 13,
      fontWeight: "800",
      color: colors.primary,
      marginBottom: 2,
    },
    aiRecText: {
      fontSize: 12,
      lineHeight: 16,
      color: colors.foreground,
    },
    sectionTabs: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 18,
    },
    sectionTabBtn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1,
      backgroundColor: colors.surfaceRaised,
    },
    sectionTabBtnActive: {
      backgroundColor: primaryAccent,
      borderColor: primaryAccent,
    },
    sectionTabBtnText: {
      fontSize: 12.5,
      fontWeight: "700",
      color: colors.mutedForeground,
    },
    sectionTabBtnTextActive: {
      color: "#FFFFFF",
    },
    topicList: {
      gap: 14,
    },
    topicCard: {
      padding: 18,
      borderRadius: 20,
      borderWidth: 1,
    },
    topicCardTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    topicBadgeGroup: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    difficultyChip: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0",
    },
    difficultyChipText: {
      fontSize: 10,
      fontWeight: "800",
      color: colors.foreground,
    },
    timeChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "#F1F5F9",
    },
    timeChipText: {
      fontSize: 10,
      fontWeight: "700",
      color: colors.mutedForeground,
    },
    completedChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 8,
      backgroundColor: isDark ? "rgba(16, 185, 129, 0.15)" : "#DCFCE7",
    },
    completedChipText: {
      fontSize: 11,
      fontWeight: "800",
      color: "#10B981",
    },
    startChip: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#F1F5F9",
    },
    startChipText: {
      fontSize: 11,
      fontWeight: "800",
      color: primaryAccent,
    },
    topicTitle: {
      fontSize: 17,
      fontWeight: "900",
      color: colors.foreground,
      marginBottom: 4,
    },
    topicSubtitle: {
      fontSize: 13,
      lineHeight: 18,
      color: colors.mutedForeground,
      marginBottom: 14,
    },
    flowPillsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: isDark ? "rgba(255, 255, 255, 0.06)" : "#F1F5F9",
    },
    flowPill: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.04)" : "#F8FAFC",
    },
    flowPillText: {
      fontSize: 10.5,
      fontWeight: "700",
      color: colors.mutedForeground,
    },
  });
}
