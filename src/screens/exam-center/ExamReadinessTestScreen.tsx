/* eslint-disable @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
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
  Award01Icon,
  Book02Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  LockIcon,
  SparklesIcon,
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
import type { ExamId, ReadinessTestDefinition } from "../../types/exam-center";
import { IELTS_READINESS_TEST, DET_READINESS_TEST } from "../../data/exam-center/readiness-tests";
import {
  gradeObjectiveQuestion,
  evaluateExamWriting,
  evaluateExamSpeaking,
} from "../../services/exam-center-service";
import { MicCaptureOrb } from "../../components/voice/MicCaptureOrb";
import { useGeminiVoiceCapture } from "../../hooks/use-gemini-voice-capture";

export default function ExamReadinessTestScreen() {
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

  const testDef: ReadinessTestDefinition = isIelts ? IELTS_READINESS_TEST : DET_READINESS_TEST;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResult, setTestResult] = useState<{
    scorePercent: number;
    passed: boolean;
    weakSkills: string[];
    breakdown: { questionId: string; isCorrect: boolean; skillTag: string; explanation: string }[];
  } | null>(null);

  const [timeLeftSeconds, setTimeLeftSeconds] = useState(testDef.durationMinutes * 60);

  const { recordQualificationResult } = useExamStore();
  const voiceCapture = useGeminiVoiceCapture();
  const currentQ = testDef.questions[currentIndex];

  // Timer countdown
  useEffect(() => {
    if (testResult) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [testResult]);

  const handleSelectOption = (idx: number) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: idx }));
  };

  const handleToggleWordSelection = (idx: number) => {
    const currentList = (answers[currentQ.id] as number[]) || [];
    if (currentList.includes(idx)) {
      setAnswers((prev) => ({ ...prev, [currentQ.id]: currentList.filter((i) => i !== idx) }));
    } else {
      setAnswers((prev) => ({ ...prev, [currentQ.id]: [...currentList, idx] }));
    }
  };

  const handleTextChange = (text: string) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: text }));
  };

  const handleSubmitTest = async () => {
    setIsSubmitting(true);
    let totalScore = 0;
    const weakSkills: string[] = [];
    const breakdown: { questionId: string; isCorrect: boolean; skillTag: string; explanation: string }[] = [];

    for (const q of testDef.questions) {
      const userAns = answers[q.id];

      if (q.type === "multiple_choice" || q.type === "word_selection" || q.type === "fill_blanks") {
        const result = gradeObjectiveQuestion(q, userAns as never);
        totalScore += result.scorePercent;
        if (!result.isCorrect) weakSkills.push(q.skillTag);
        breakdown.push({
          questionId: q.id,
          isCorrect: result.isCorrect,
          skillTag: q.skillTag,
          explanation: result.explanation,
        });
      } else if (q.type === "text_entry") {
        // Writing evaluation
        const text = String(userAns || "");
        const review = await evaluateExamWriting(exam, q.taskType, q.prompt, text);
        totalScore += review.scorePercentage;
        const isOk = review.scorePercentage >= 60;
        if (!isOk) weakSkills.push(q.skillTag);
        breakdown.push({
          questionId: q.id,
          isCorrect: isOk,
          skillTag: q.skillTag,
          explanation: review.examinerAdvice,
        });
      } else if (q.type === "speaking_recording") {
        // Speaking evaluation
        const review = await evaluateExamSpeaking(exam, q.taskType, q.prompt, "Spoken submission transcript", 50);
        totalScore += review.scorePercentage;
        const isOk = review.scorePercentage >= 60;
        if (!isOk) weakSkills.push(q.skillTag);
        breakdown.push({
          questionId: q.id,
          isCorrect: isOk,
          skillTag: q.skillTag,
          explanation: review.examinerAdvice,
        });
      }
    }

    const finalPercent = Math.round(totalScore / testDef.questions.length);
    const passed = finalPercent >= testDef.passingScorePercent;

    setTestResult({
      scorePercent: finalPercent,
      passed,
      weakSkills,
      breakdown,
    });

    recordQualificationResult(exam, finalPercent, weakSkills);
    setIsSubmitting(false);
  };

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

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
          {/* Top Bar with Timer */}
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

            {!testResult && (
              <View style={[styles.timerBadge, isRtl && styles.rowReverse]}>
                <HugeiconsIcon icon={Clock01Icon} size={15} color={primaryAccent} strokeWidth={2.2} />
                <AppText style={[styles.timerText, { color: primaryAccent }]} forceLatinFont latinRole="bold">
                  {timeFormatted}
                </AppText>
              </View>
            )}
          </View>

          {/* ======================================================== */}
          {/* ACTIVE TEST QUESTION VIEW                                */}
          {/* ======================================================== */}
          {!testResult && currentQ && (
            <View style={styles.activeTestContainer}>
              <View style={styles.qProgressRow}>
                <AppText style={styles.qProgressText} forceLatinFont latinRole="bold">
                  Task {currentIndex + 1} of {testDef.questions.length} • {currentQ.section.toUpperCase()}
                </AppText>
              </View>

              <View
                style={[
                  styles.questionCard,
                  { backgroundColor: colors.surfaceRaised, borderColor: colors.border },
                ]}
              >
                <AppText style={styles.instructionText} forceLatinFont latinRole="bold">
                  {currentQ.instruction}
                </AppText>
                <AppText style={styles.promptText} forceLatinFont>
                  {currentQ.prompt}
                </AppText>

                {/* Multiple choice widgets */}
                {currentQ.type === "multiple_choice" && currentQ.options && (
                  <View style={styles.optionsWrap}>
                    {currentQ.options.map((opt, idx) => {
                      const isSelected = answers[currentQ.id] === idx;
                      return (
                        <PremiumPressable
                          key={idx}
                          onPress={() => handleSelectOption(idx)}
                          style={[
                            styles.optionBtn,
                            isSelected && {
                              borderColor: primaryAccent,
                              backgroundColor: isDark ? "rgba(59, 130, 246, 0.15)" : "#EFF6FF",
                            },
                          ]}
                        >
                          <AppText
                            style={[
                              styles.optionText,
                              isSelected && { color: primaryAccent, fontWeight: "800" },
                            ]}
                            forceLatinFont
                          >
                            {opt}
                          </AppText>
                        </PremiumPressable>
                      );
                    })}
                  </View>
                )}

                {/* Word selection (Read & Select) */}
                {currentQ.type === "word_selection" && currentQ.options && (
                  <View style={styles.wordsGrid}>
                    {currentQ.options.map((word, idx) => {
                      const selectedList = (answers[currentQ.id] as number[]) || [];
                      const isSelected = selectedList.includes(idx);
                      return (
                        <PremiumPressable
                          key={idx}
                          onPress={() => handleToggleWordSelection(idx)}
                          style={[
                            styles.wordGridBtn,
                            isSelected && {
                              borderColor: primaryAccent,
                              backgroundColor: isDark ? "rgba(16, 185, 129, 0.2)" : "#DCFCE7",
                            },
                          ]}
                        >
                          <AppText
                            style={[
                              styles.wordGridText,
                              isSelected && { color: isDark ? "#34D399" : "#059669", fontWeight: "800" },
                            ]}
                            forceLatinFont
                          >
                            {word}
                          </AppText>
                        </PremiumPressable>
                      );
                    })}
                  </View>
                )}

                {/* Text entry / Essay / Dictation */}
                {currentQ.type === "text_entry" && (
                  <TextInput
                    style={[styles.textInput, { color: colors.foreground, borderColor: colors.border }]}
                    placeholder="Type your response here..."
                    placeholderTextColor={colors.mutedForeground}
                    multiline
                    value={String(answers[currentQ.id] || "")}
                    onChangeText={handleTextChange}
                  />
                )}

                {/* Speaking Recording */}
                {currentQ.type === "speaking_recording" && (
                  <View style={styles.speakingBox}>
                    <AppText style={styles.speakingTip} forceLatinFont>
                      Tap microphone to record your answer.
                    </AppText>
                    <MicCaptureOrb
                      listening={voiceCapture.listening}
                      disabled={false}
                      onPress={
                        voiceCapture.listening
                          ? () => voiceCapture.stopAndEvaluate(currentQ.prompt)
                          : () =>
                              voiceCapture.start({
                                onResult: (t: string) =>
                                  setAnswers((prev) => ({ ...prev, [currentQ.id]: t })),
                              })
                      }
                    />
                  </View>
                )}
              </View>

              {/* Navigation buttons */}
              <View style={[styles.navButtonsRow, isRtl && styles.rowReverse]}>
                {currentIndex > 0 ? (
                  <PremiumPressable
                    onPress={() => setCurrentIndex((prev) => prev - 1)}
                    style={[styles.prevBtn, { borderColor: colors.border }]}
                  >
                    <AppText style={styles.prevBtnText} forceLatinFont latinRole="bold">
                      Previous Task
                    </AppText>
                  </PremiumPressable>
                ) : <View />}

                {currentIndex < testDef.questions.length - 1 ? (
                  <PremiumPressable
                    onPress={() => setCurrentIndex((prev) => prev + 1)}
                    style={[styles.nextBtn, { backgroundColor: primaryAccent }]}
                  >
                    <AppText style={styles.nextBtnText} forceLatinFont latinRole="bold">
                      Next Task
                    </AppText>
                    <HugeiconsIcon icon={forwardIcon} size={16} color="#FFFFFF" strokeWidth={2.4} />
                  </PremiumPressable>
                ) : (
                  <PremiumPressable
                    onPress={handleSubmitTest}
                    style={[styles.nextBtn, { backgroundColor: "#10B981" }]}
                    disabled={isSubmitting}
                  >
                    <AppText style={styles.nextBtnText} forceLatinFont latinRole="bold">
                      {isSubmitting ? "Scoring Test..." : "Finish & Submit"}
                    </AppText>
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} color="#FFFFFF" strokeWidth={2.4} />
                  </PremiumPressable>
                )}
              </View>
            </View>
          )}

          {/* ======================================================== */}
          {/* TEST RESULTS (Passed vs Failed with Diagnosis)           */}
          {/* ======================================================== */}
          {testResult && (
            <View style={styles.resultsContainer}>
              {testResult.passed ? (
                /* PASSED (Score >= 50%) */
                <View
                  style={[
                    styles.resultHeroCard,
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
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={40} color="#10B981" strokeWidth={2.2} />
                  <AppText style={styles.resultScoreNum} forceLatinFont latinRole="bold">
                    {testResult.scorePercent}%
                  </AppText>
                  <AppText style={[styles.resultHeadline, { color: "#10B981" }]} forceLatinFont latinRole="bold">
                    You passed the readiness test!
                  </AppText>
                  <AppText style={styles.resultDesc} forceLatinFont>
                    You can now start the full {isIelts ? "IELTS" : "DET"} Mock Exam.
                  </AppText>

                  <PremiumPressable
                    onPress={() => router.push(`/exam-center/${exam}/mock-exam/exam` as never)}
                    style={[styles.actionBtn, { backgroundColor: "#F97316" }]}
                    pressScale={0.98}
                  >
                    <AppText style={styles.actionBtnText} forceLatinFont latinRole="bold">
                      Launch Full Mock Exam Now
                    </AppText>
                  </PremiumPressable>
                </View>
              ) : (
                /* FAILED (Score < 50%) */
                <View
                  style={[
                    styles.resultHeroCard,
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
                  <HugeiconsIcon icon={LockIcon} size={40} color="#EF4444" strokeWidth={2.2} />
                  <AppText style={styles.resultScoreNum} forceLatinFont latinRole="bold">
                    {testResult.scorePercent}%
                  </AppText>
                  <AppText style={[styles.resultHeadline, { color: "#EF4444" }]} forceLatinFont latinRole="bold">
                    Readiness Score Below 50% Threshold
                  </AppText>
                  <AppText style={styles.resultDesc} forceLatinFont>
                    Your readiness score is {testResult.scorePercent}%. You need at least 50% to unlock the full mock exam. Complete the recommended preparation lessons below and try again.
                  </AppText>

                  <PremiumPressable
                    onPress={() => router.push(`/exam-center/${exam}/preparation` as never)}
                    style={[styles.actionBtn, { backgroundColor: primaryAccent }]}
                    pressScale={0.98}
                  >
                    <HugeiconsIcon icon={Book02Icon} size={18} color="#FFFFFF" strokeWidth={2.2} />
                    <AppText style={styles.actionBtnText} forceLatinFont latinRole="bold">
                      Go to Preparation Lessons
                    </AppText>
                  </PremiumPressable>
                </View>
              )}

              {/* Task-by-Task Diagnostic Feedback */}
              <AppText style={styles.breakdownHeader} forceLatinFont latinRole="bold">
                Task Breakdown & Skill Diagnosis
              </AppText>

              {testResult.breakdown.map((item, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.feedbackCard,
                    {
                      backgroundColor: colors.surfaceRaised,
                      borderColor: item.isCorrect ? "#10B981" : "#EF4444",
                    },
                  ]}
                >
                  <View style={[styles.feedbackHead, isRtl && styles.rowReverse]}>
                    <HugeiconsIcon
                      icon={item.isCorrect ? CheckmarkCircle02Icon : Alert01Icon}
                      size={16}
                      color={item.isCorrect ? "#10B981" : "#EF4444"}
                      strokeWidth={2.4}
                    />
                    <AppText
                      style={[styles.feedbackStatus, { color: item.isCorrect ? "#10B981" : "#EF4444" }]}
                      forceLatinFont
                      latinRole="bold"
                    >
                      Task {idx + 1}: {item.skillTag}
                    </AppText>
                  </View>
                  <AppText style={styles.feedbackExp} forceLatinFont>
                    {item.explanation}
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
    timerBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "#F1F5F9",
    },
    timerText: {
      fontSize: 14,
      fontWeight: "800",
    },
    activeTestContainer: {
      gap: 16,
    },
    qProgressRow: {
      marginBottom: 2,
    },
    qProgressText: {
      fontSize: 12.5,
      fontWeight: "800",
      color: primaryAccent,
      textTransform: "uppercase",
    },
    questionCard: {
      padding: 20,
      borderRadius: 20,
      borderWidth: 1,
    },
    instructionText: {
      fontSize: 13,
      fontWeight: "800",
      color: primaryAccent,
      marginBottom: 8,
    },
    promptText: {
      fontSize: 14,
      lineHeight: 21,
      color: colors.foreground,
      marginBottom: 16,
    },
    optionsWrap: {
      gap: 10,
    },
    optionBtn: {
      padding: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    optionText: {
      fontSize: 13.5,
      color: colors.foreground,
    },
    wordsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    wordGridBtn: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    wordGridText: {
      fontSize: 13.5,
      color: colors.foreground,
    },
    textInput: {
      minHeight: 100,
      padding: 12,
      borderRadius: 14,
      borderWidth: 1,
      fontSize: 14,
      lineHeight: 20,
      textAlignVertical: "top",
    },
    speakingBox: {
      alignItems: "center",
      paddingVertical: 12,
    },
    speakingTip: {
      fontSize: 12.5,
      color: colors.mutedForeground,
      marginBottom: 12,
    },
    navButtonsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 8,
    },
    prevBtn: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      backgroundColor: colors.surfaceRaised,
    },
    prevBtnText: {
      fontSize: 13,
      color: colors.foreground,
    },
    nextBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 12,
    },
    nextBtnText: {
      fontSize: 13,
      fontWeight: "800",
      color: "#FFFFFF",
    },
    resultsContainer: {
      gap: 16,
    },
    resultHeroCard: {
      padding: 24,
      borderRadius: 22,
      borderWidth: 1.5,
      alignItems: "center",
      textAlign: "center",
    },
    resultScoreNum: {
      fontSize: 42,
      fontWeight: "900",
      color: colors.foreground,
      marginTop: 8,
      marginBottom: 4,
    },
    resultHeadline: {
      fontSize: 18,
      fontWeight: "900",
      marginBottom: 6,
    },
    resultDesc: {
      fontSize: 13,
      lineHeight: 18,
      color: colors.foreground,
      textAlign: "center",
      marginBottom: 16,
    },
    actionBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderRadius: 14,
      width: "100%",
    },
    actionBtnText: {
      fontSize: 14,
      fontWeight: "800",
      color: "#FFFFFF",
    },
    breakdownHeader: {
      fontSize: 16,
      fontWeight: "800",
      color: colors.foreground,
      marginTop: 8,
      marginBottom: 2,
    },
    feedbackCard: {
      padding: 14,
      borderRadius: 14,
      borderWidth: 1.5,
    },
    feedbackHead: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: 4,
    },
    feedbackStatus: {
      fontSize: 13,
      fontWeight: "800",
    },
    feedbackExp: {
      fontSize: 12.5,
      lineHeight: 17,
      color: colors.foreground,
    },
  });
}
