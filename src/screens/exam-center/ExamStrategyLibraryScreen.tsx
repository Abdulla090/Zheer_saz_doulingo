/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
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
  BulbIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Edit02Icon,
  FilterIcon,
  HeadphonesIcon,
  Idea01Icon,
  Search01Icon,
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
import { crossShadow } from "../../utils/shadows";
import type { ExamId, ExamSection, TopicDifficulty } from "../../types/exam-center";
import { EXAM_STRATEGY_LIBRARY } from "../../data/exam-center/exam-strategies";

export default function ExamStrategyLibraryScreen() {
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

  const [selectedSection, setSelectedSection] = useState<ExamSection | "all">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<TopicDifficulty | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedStrategyId, setExpandedStrategyId] = useState<string | null>(null);

  const filteredStrategies = useMemo(() => {
    return EXAM_STRATEGY_LIBRARY.filter((item) => {
      const matchExam = item.exam === exam;
      const matchSection = selectedSection === "all" || item.section === selectedSection;
      const matchDiff = selectedDifficulty === "all" || item.difficulty === selectedDifficulty;
      const matchQuery =
        searchQuery.trim() === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.highValueRules.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchExam && matchSection && matchDiff && matchQuery;
    });
  }, [exam, selectedSection, selectedDifficulty, searchQuery]);

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
              <HugeiconsIcon icon={Book02Icon} size={14} color="#F97316" strokeWidth={2.2} />
              <AppText style={[styles.headerPillText, { color: "#F97316" }]} forceLatinFont latinRole="bold">
                {isIelts ? "IELTS Strategy Library" : "DET Strategy Library"}
              </AppText>
            </View>
          </View>

          {/* Title Header */}
          <View style={styles.titleBlock}>
            <AppText style={styles.mainTitle} forceLatinFont latinRole="bold">
              High-Band Strategy Library
            </AppText>
            <AppText
              style={styles.subtitle}
              languageCode={locale}
              forceKurdishFont={isRtl}
              align="start"
            >
              Organized by Section → Task Type → Difficulty. Master examiner rubrics, templates, and collocations.
            </AppText>
          </View>

          {/* Search Bar */}
          <View style={[styles.searchBar, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
            <HugeiconsIcon icon={Search01Icon} size={18} color={colors.mutedForeground} strokeWidth={2.2} />
            <TextInput
              style={[styles.searchInput, { color: colors.foreground }]}
              placeholder="Search strategies, templates, traps..."
              placeholderTextColor={colors.mutedForeground}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Section Filter Pills */}
          <View style={styles.filterScroll}>
            {(["all", "reading", "listening", "writing", "speaking"] as const).map((sec) => (
              <PremiumPressable
                key={sec}
                onPress={() => setSelectedSection(sec)}
                style={[
                  styles.filterPill,
                  selectedSection === sec && { backgroundColor: primaryAccent, borderColor: primaryAccent },
                ]}
              >
                <AppText
                  style={[styles.filterPillText, selectedSection === sec && { color: "#FFFFFF", fontWeight: "800" }]}
                  forceLatinFont
                  latinRole="bold"
                >
                  {sec === "all" ? "All Sections" : sec.charAt(0).toUpperCase() + sec.slice(1)}
                </AppText>
              </PremiumPressable>
            ))}
          </View>

          {/* Difficulty Filter Pills */}
          <View style={styles.difficultyFilterRow}>
            {(["all", "beginner", "intermediate", "advanced"] as const).map((diff) => (
              <PremiumPressable
                key={diff}
                onPress={() => setSelectedDifficulty(diff)}
                style={[
                  styles.diffPill,
                  selectedDifficulty === diff && {
                    backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : "#E2E8F0",
                    borderColor: colors.foreground,
                  },
                ]}
              >
                <AppText
                  style={[styles.diffPillText, selectedDifficulty === diff && { color: colors.foreground, fontWeight: "800" }]}
                  forceLatinFont
                >
                  {diff.toUpperCase()}
                </AppText>
              </PremiumPressable>
            ))}
          </View>

          {/* Strategy Cards List */}
          <View style={styles.strategyList}>
            {filteredStrategies.map((item) => {
              const isExpanded = expandedStrategyId === item.id;

              return (
                <PremiumPressable
                  key={item.id}
                  onPress={() => setExpandedStrategyId(isExpanded ? null : item.id)}
                  style={[
                    styles.stratCard,
                    {
                      backgroundColor: colors.surfaceRaised,
                      borderColor: isExpanded ? primaryAccent : colors.border,
                      ...crossShadow({
                        color: isDark ? "#000" : "#000",
                        offsetY: 6,
                        blur: 16,
                        opacity: isDark ? 0.2 : 0.06,
                      }),
                    },
                  ]}
                  pressScale={0.99}
                >
                  <View style={[styles.stratCardTop, isRtl && styles.rowReverse]}>
                    <View style={[styles.sectionTag, { backgroundColor: isDark ? "rgba(59, 130, 246, 0.15)" : "#EFF6FF" }]}>
                      <AppText style={[styles.sectionTagText, { color: primaryAccent }]} forceLatinFont latinRole="bold">
                        {item.section.toUpperCase()} • {item.difficulty.toUpperCase()}
                      </AppText>
                    </View>
                    <View style={styles.expandIcon}>
                      <HugeiconsIcon
                        icon={isExpanded ? CheckmarkCircle02Icon : BulbIcon}
                        size={16}
                        color={isExpanded ? primaryAccent : colors.mutedForeground}
                        strokeWidth={2.2}
                      />
                    </View>
                  </View>

                  <AppText style={styles.stratTitle} forceLatinFont latinRole="bold">
                    {item.title}
                  </AppText>
                  <AppText style={styles.stratSummary} forceLatinFont>
                    {item.summary}
                  </AppText>

                  {/* Expanded Content Details */}
                  {isExpanded && (
                    <View style={styles.expandedBlock}>
                      <View style={styles.divider} />

                      {/* High Value Rules */}
                      <AppText style={styles.detailHeading} forceLatinFont latinRole="bold">
                        High-Value Rules:
                      </AppText>
                      {item.highValueRules.map((r, rIdx) => (
                        <View key={rIdx} style={[styles.ruleBullet, isRtl && styles.rowReverse]}>
                          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} color="#10B981" strokeWidth={2.2} />
                          <AppText style={styles.ruleBulletText} forceLatinFont>
                            {r}
                          </AppText>
                        </View>
                      ))}

                      {/* Time Management Formula */}
                      <View style={[styles.timeBox, { backgroundColor: isDark ? "rgba(59, 130, 246, 0.08)" : "#EFF6FF" }]}>
                        <HugeiconsIcon icon={Clock01Icon} size={15} color={primaryAccent} strokeWidth={2.2} />
                        <AppText style={styles.timeBoxText} forceLatinFont>
                          Timing Formula: {item.timeManagementFormula}
                        </AppText>
                      </View>

                      {/* Common Traps */}
                      <AppText style={[styles.detailHeading, { color: "#EF4444" }]} forceLatinFont latinRole="bold">
                        Common Traps & Mistakes:
                      </AppText>
                      {item.commonMistakesAndTraps.map((m, mIdx) => (
                        <View key={mIdx} style={[styles.ruleBullet, isRtl && styles.rowReverse]}>
                          <HugeiconsIcon icon={Alert01Icon} size={14} color="#EF4444" strokeWidth={2.2} />
                          <AppText style={styles.ruleBulletText} forceLatinFont>
                            {m}
                          </AppText>
                        </View>
                      ))}

                      {/* Useful Collocations */}
                      {item.usefulCollocationsAndIdioms.length > 0 && (
                        <View style={styles.collocationsWrap}>
                          <AppText style={[styles.detailHeading, { color: "#8B5CF6" }]} forceLatinFont latinRole="bold">
                            High-Band Collocations & Idioms:
                          </AppText>
                          <View style={styles.pillsRow}>
                            {item.usefulCollocationsAndIdioms.map((c, cIdx) => (
                              <View key={cIdx} style={[styles.collocPill, { backgroundColor: isDark ? "rgba(139, 92, 246, 0.15)" : "#F3E8FF" }]}>
                                <AppText style={[styles.collocPillText, { color: "#8B5CF6" }]} forceLatinFont latinRole="bold">
                                  {c}
                                </AppText>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}

                      {/* Template Snippet if available */}
                      {item.templateSnippet && (
                        <View style={[styles.templateCard, { backgroundColor: isDark ? "rgba(0,0,0,0.3)" : "#F8FAFC", borderColor: colors.border }]}>
                          <AppText style={styles.templateHeader} forceLatinFont latinRole="bold">
                            Essay / Response Blueprint:
                          </AppText>
                          <AppText style={styles.templateCode} forceLatinFont>
                            {item.templateSnippet}
                          </AppText>
                        </View>
                      )}

                      {/* Last Minute Exam Day Tip */}
                      <View style={[styles.lastMinuteBox, { backgroundColor: isDark ? "rgba(245, 158, 11, 0.1)" : "#FEF3C7" }]}>
                        <HugeiconsIcon icon={Idea01Icon} size={16} color="#F59E0B" strokeWidth={2.2} />
                        <AppText style={styles.lastMinuteText} forceLatinFont>
                          Exam-Day Tip: {item.lastMinuteTip}
                        </AppText>
                      </View>
                    </View>
                  )}
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
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 14,
      borderWidth: 1,
      marginBottom: 14,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      padding: 0,
    },
    filterScroll: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 10,
    },
    filterPill: {
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceRaised,
    },
    filterPillText: {
      fontSize: 12,
      color: colors.mutedForeground,
    },
    difficultyFilterRow: {
      flexDirection: "row",
      gap: 6,
      marginBottom: 16,
    },
    diffPill: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },
    diffPillText: {
      fontSize: 10,
      fontWeight: "700",
      color: colors.mutedForeground,
    },
    strategyList: {
      gap: 14,
    },
    stratCard: {
      padding: 18,
      borderRadius: 18,
      borderWidth: 1,
    },
    stratCardTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    sectionTag: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
    },
    sectionTagText: {
      fontSize: 10.5,
      fontWeight: "800",
    },
    expandIcon: {
      padding: 2,
    },
    stratTitle: {
      fontSize: 16.5,
      fontWeight: "800",
      color: colors.foreground,
      marginBottom: 4,
    },
    stratSummary: {
      fontSize: 13,
      lineHeight: 18,
      color: colors.mutedForeground,
    },
    expandedBlock: {
      marginTop: 8,
    },
    divider: {
      height: 1,
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0",
      marginVertical: 12,
    },
    detailHeading: {
      fontSize: 13,
      fontWeight: "800",
      color: colors.foreground,
      marginTop: 8,
      marginBottom: 6,
    },
    ruleBullet: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
      marginBottom: 6,
    },
    ruleBulletText: {
      flex: 1,
      fontSize: 12.5,
      lineHeight: 18,
      color: colors.foreground,
    },
    timeBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      padding: 10,
      borderRadius: 10,
      marginVertical: 8,
    },
    timeBoxText: {
      flex: 1,
      fontSize: 12,
      color: colors.foreground,
      fontWeight: "600",
    },
    collocationsWrap: {
      marginTop: 6,
    },
    pillsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
    },
    collocPill: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    collocPillText: {
      fontSize: 11,
    },
    templateCard: {
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      marginVertical: 10,
    },
    templateHeader: {
      fontSize: 12,
      fontWeight: "800",
      color: colors.foreground,
      marginBottom: 6,
    },
    templateCode: {
      fontSize: 11.5,
      lineHeight: 17,
      color: colors.foreground,
      fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    },
    lastMinuteBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      padding: 10,
      borderRadius: 10,
      marginTop: 8,
    },
    lastMinuteText: {
      flex: 1,
      fontSize: 12,
      color: isDark ? "#FCD34D" : "#B45309",
      fontWeight: "600",
    },
  });
}
