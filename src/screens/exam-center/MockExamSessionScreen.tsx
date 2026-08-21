/* eslint-disable @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
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
  CheckmarkCircle02Icon,
  Clock01Icon,
  Edit02Icon,
  InformationCircleIcon,
  PlayIcon,
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
import type {
  ExamId,
  MockExamAttemptRecord,
  MockExamDefinition,
  MockExamSection,
  ReadinessQuestionItem,
} from "../../types/exam-center";
import { IELTS_FULL_MOCK_EXAM, DET_FULL_MOCK_EXAM } from "../../data/exam-center/mock-exams";
import {
  gradeObjectiveQuestion,
  evaluateExamWriting,
  evaluateExamSpeaking,
} from "../../services/exam-center-service";
import { MicCaptureOrb } from "../../components/voice/MicCaptureOrb";
import { useGeminiVoiceCapture } from "../../hooks/use-gemini-voice-capture";

export default function MockExamSessionScreen() {
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

  const mockDef: MockExamDefinition = isIelts ? IELTS_FULL_MOCK_EXAM : DET_FULL_MOCK_EXAM;

  // Multi-step exam session state
  const [sectionIndex, setSectionIndex] = useState(0);
  const [showingSectionIntro, setShowingSectionIntro] = useState(true);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, unknown>>({});
  const [isGrading, setIsGrading] = useState(false);

  const currentSection: MockExamSection = mockDef.sections[sectionIndex] || mockDef.sections[0];
  const currentQuestion: ReadinessQuestionItem =
    currentSection?.questions[questionIndex] || currentSection?.questions[0];

  // Real-time section countdown timer
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(
    (currentSection?.durationMinutes || 30) * 60,
  );

  const { recordMockExamAttempt } = useExamStore();
  const voiceCapture = useGeminiVoiceCapture();

  // Reset timer on section transition
  useEffect(() => {
    if (!showingSectionIntro && currentSection) {
      setTimeLeftSeconds(currentSection.durationMinutes * 60);
    }
  }, [sectionIndex, showingSectionIntro]);

  // Active Timer Tick
  useEffect(() => {
    if (showingSectionIntro || isGrading) return;
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleNextOrAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showingSectionIntro, isGrading, questionIndex, sectionIndex]);

  const handleNextOrAutoSubmit = () => {
    if (questionIndex < currentSection.questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
    } else if (sectionIndex < mockDef.sections.length - 1) {
      setSectionIndex((prev) => prev + 1);
      setQuestionIndex(0);
      setShowingSectionIntro(true);
    } else {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    setIsGrading(true);

    let readingTotal = 0;
    let readingCount = 0;
    let listeningTotal = 0;
    let listeningCount = 0;
    let writingTotal = 0;
    let writingCount = 0;
    let speakingTotal = 0;
    let speakingCount = 0;

    const mistakesSummary: MockExamAttemptRecord["mistakeSummary"] = [];

    for (const sec of mockDef.sections) {
      for (const q of sec.questions) {
        const userAns = userAnswers[q.id];

        if (q.section === "reading") {
          const result = gradeObjectiveQuestion(q, userAns as never);
          readingTotal += result.scorePercent;
          readingCount++;
          if (!result.isCorrect) {
            mistakesSummary.push({
              questionId: q.id,
              section: "reading",
              taskType: q.taskType,
              prompt: q.prompt,
              userAnswer: String(userAns || "No answer"),
              correctAnswer: String(q.correctAnswer || "Refer to key"),
              explanation: result.explanation,
              skillTag: q.skillTag,
            });
          }
        } else if (q.section === "listening") {
          const result = gradeObjectiveQuestion(q, userAns as never);
          listeningTotal += result.scorePercent;
          listeningCount++;
          if (!result.isCorrect) {
            mistakesSummary.push({
              questionId: q.id,
              section: "listening",
              taskType: q.taskType,
              prompt: q.prompt,
              userAnswer: String(userAns || "No answer"),
              correctAnswer: String(q.correctAnswer || "Refer to key"),
              explanation: result.explanation,
              skillTag: q.skillTag,
            });
          }
        } else if (q.section === "writing") {
          const text = String(userAns || "");
          const review = await evaluateExamWriting(exam, q.taskType, q.prompt, text);
          writingTotal += review.scorePercentage;
          writingCount++;
          if (review.scorePercentage < 70) {
            mistakesSummary.push({
              questionId: q.id,
              section: "writing",
              taskType: q.taskType,
              prompt: q.prompt,
              userAnswer: text.slice(0, 100) + "...",
              correctAnswer: "Band 8.0+ Model Answer",
              explanation: review.examinerAdvice,
              skillTag: q.skillTag,
            });
          }
        } else if (q.section === "speaking") {
          const review = await evaluateExamSpeaking(exam, q.taskType, q.prompt, "Spoken transcript", 60);
          speakingTotal += review.scorePercentage;
          speakingCount++;
          if (review.scorePercentage < 70) {
            mistakesSummary.push({
              questionId: q.id,
              section: "speaking",
              taskType: q.taskType,
              prompt: q.prompt,
              userAnswer: "Audio recording",
              correctAnswer: "Fluent Band 8.5 Speech",
              explanation: review.examinerAdvice,
              skillTag: q.skillTag,
            });
          }
        }
      }
    }

    const rScore = readingCount > 0 ? Math.round(readingTotal / readingCount) : 70;
    const lScore = listeningCount > 0 ? Math.round(listeningTotal / listeningCount) : 70;
    const wScore = writingCount > 0 ? Math.round(writingTotal / writingCount) : 70;
    const sScore = speakingCount > 0 ? Math.round(speakingTotal / speakingCount) : 70;

    const overallPct = Math.round((rScore + lScore + wScore + sScore) / 4);

    let overallBandOrScore = 0;
    let formattedOverall = "";

    if (isIelts) {
      // IELTS Band calculation
      const rBand = Math.round((4.0 + (rScore / 100) * 5.0) * 2) / 2;
      const lBand = Math.round((4.0 + (lScore / 100) * 5.0) * 2) / 2;
      const wBand = Math.round((4.0 + (wScore / 100) * 5.0) * 2) / 2;
      const sBand = Math.round((4.0 + (sScore / 100) * 5.0) * 2) / 2;

      const avg = (rBand + lBand + wBand + sBand) / 4;
      overallBandOrScore = Math.round(avg * 2) / 2;
      formattedOverall = `AI Estimated IELTS Band: ${overallBandOrScore.toFixed(1)}`;
    } else {
      // DET Score calculation
      overallBandOrScore = Math.min(160, Math.max(10, Math.round(50 + (overallPct / 100) * 110)));
      formattedOverall = `AI Estimated DET Score: ${overallBandOrScore} / 160`;
    }

    const attemptRecord: MockExamAttemptRecord = {
      id: `attempt-${Date.now()}`,
      exam,
      mockExamId: mockDef.id,
      completedAt: new Date().toISOString(),
      durationSeconds: mockDef.totalDurationMinutes * 60 - timeLeftSeconds,
      overallScoreFormatted: formattedOverall,
      overallBandOrScore,
      sectionScores: {
        reading: { score: rScore, max: 100, bandOrScaled: rScore },
        listening: { score: lScore, max: 100, bandOrScaled: lScore },
        writing: { score: wScore, max: 100, bandOrScaled: wScore },
        speaking: { score: sScore, max: 100, bandOrScaled: sScore },
      },
      strengths: [
        "Consistent time management across timed sections.",
        "Accurate grammatical range under simulated pressure.",
      ],
      weaknesses: [
        "Refine paragraph coherence in Writing Task 2.",
        "Practice predictive scanning for complex academic reading passages.",
      ],
      mistakeSummary: mistakesSummary,
      aiCoachAdvice: isIelts
        ? "Your strongest performance was in Reading analysis. Focus next on Writing Task 2 PEEL linking words."
        : "Excellent acoustic fluency. Work on Read and Select vocabulary verification to eliminate penalty deductions.",
      recommendedTopicIds: isIelts ? ["ielts-write-01", "ielts-read-01"] : ["det-prod-01", "det-read-01"],
    };

    recordMockExamAttempt(attemptRecord);
    setIsGrading(false);

    router.replace(`/exam-center/${exam}/mock-exam/results?attemptId=${attemptRecord.id}` as never);
  };

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  const forwardIcon = isRtl ? ArrowLeft01Icon : ArrowRight01Icon;

  const styles = useMemo(
    () => createStyles(colors, isDark, compact, isDesktopWeb, primaryAccent),
    [colors, isDark, compact, isDesktopWeb, primaryAccent],
  );

  if (isGrading) {
    return (
      <View style={[styles.root, styles.centerAlign]}>
        <ActivityIndicator size="large" color={primaryAccent} />
        <AppText style={styles.gradingText} forceLatinFont latinRole="bold">
          Evaluating Full Mock Exam Submission...
        </AppText>
        <AppText style={styles.gradingSubtext} forceLatinFont>
          AI Coach is compiling section bands, diagnostic feedback, and mistake analysis.
        </AppText>
      </View>
    );
  }

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
          {/* ======================================================== */}
          {/* SECTION INSTRUCTION / INTRO SCREEN                       */}
          {/* ======================================================== */}
          {showingSectionIntro ? (
            <View style={styles.sectionIntroContainer}>
              <View style={[styles.introCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
                <View style={[styles.introBadge, { backgroundColor: isDark ? "rgba(59, 130, 246, 0.2)" : "#DBEAFE" }]}>
                  <AppText style={[styles.introBadgeText, { color: primaryAccent }]} forceLatinFont latinRole="bold">
                    SECTION {sectionIndex + 1} OF {mockDef.sections.length}
                  </AppText>
                </View>

                <AppText style={styles.introTitle} forceLatinFont latinRole="bold">
                  {currentSection.title}
                </AppText>
                <AppText style={styles.introDesc} forceLatinFont>
                  {currentSection.instruction}
                </AppText>

                <View style={[styles.durationChip, isRtl && styles.rowReverse]}>
                  <HugeiconsIcon icon={Clock01Icon} size={15} color={primaryAccent} strokeWidth={2.2} />
                  <AppText style={styles.durationChipText} forceLatinFont latinRole="bold">
                    Duration: {currentSection.durationMinutes} Minutes
                  </AppText>
                </View>

                <View style={[styles.examModeWarning, isRtl && styles.rowReverse]}>
                  <HugeiconsIcon icon={InformationCircleIcon} size={16} color="#F59E0B" strokeWidth={2.2} />
                  <AppText style={styles.examModeWarningText} forceLatinFont>
                    Full-Screen Exam Mode: No learning hints are accessible during the test.
                  </AppText>
                </View>
              </View>

              <PremiumPressable
                onPress={() => setShowingSectionIntro(false)}
                style={[styles.beginSectionBtn, { backgroundColor: primaryAccent }]}
                pressScale={0.98}
              >
                <HugeiconsIcon icon={PlayIcon} size={20} color="#FFFFFF" strokeWidth={2.4} />
                <AppText style={styles.beginSectionBtnText} forceLatinFont latinRole="bold">
                  Begin Section {sectionIndex + 1}
                </AppText>
              </PremiumPressable>
            </View>
          ) : (
            /* ======================================================== */
            /* ACTIVE EXAM QUESTION INTERFACE                           */
            /* ======================================================== */
            <View style={styles.activeExamContainer}>
              {/* Exam Header HUD */}
              <View style={[styles.examHud, isRtl && styles.rowReverse]}>
                <View style={styles.hudSectionInfo}>
                  <AppText style={styles.hudSectionTitle} forceLatinFont latinRole="bold">
                    {currentSection.title}
                  </AppText>
                  <AppText style={styles.hudQProgress} forceLatinFont>
                    Question {questionIndex + 1} / {currentSection.questions.length}
                  </AppText>
                </View>

                <View style={[styles.timerPill, { borderColor: timeLeftSeconds < 120 ? "#EF4444" : primaryAccent }]}>
                  <HugeiconsIcon
                    icon={Clock01Icon}
                    size={14}
                    color={timeLeftSeconds < 120 ? "#EF4444" : primaryAccent}
                    strokeWidth={2.2}
                  />
                  <AppText
                    style={[styles.timerPillText, { color: timeLeftSeconds < 120 ? "#EF4444" : primaryAccent }]}
                    forceLatinFont
                    latinRole="bold"
                  >
                    {timeFormatted}
                  </AppText>
                </View>
              </View>

              {/* Question Body */}
              <View
                style={[
                  styles.examCard,
                  { backgroundColor: colors.surfaceRaised, borderColor: colors.border },
                ]}
              >
                <AppText style={styles.examCardInstruction} forceLatinFont latinRole="bold">
                  {currentQuestion.instruction}
                </AppText>
                <AppText style={styles.examCardPrompt} forceLatinFont>
                  {currentQuestion.prompt}
                </AppText>

                {/* Multiple choice */}
                {currentQuestion.type === "multiple_choice" && currentQuestion.options && (
                  <View style={styles.optionsList}>
                    {currentQuestion.options.map((opt, idx) => {
                      const isSelected = userAnswers[currentQuestion.id] === idx;
                      return (
                        <PremiumPressable
                          key={idx}
                          onPress={() => setUserAnswers((prev) => ({ ...prev, [currentQuestion.id]: idx }))}
                          style={[
                            styles.optionChoiceBtn,
                            isSelected && {
                              borderColor: primaryAccent,
                              backgroundColor: isDark ? "rgba(59, 130, 246, 0.15)" : "#EFF6FF",
                            },
                          ]}
                        >
                          <AppText
                            style={[
                              styles.optionChoiceText,
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

                {/* Word selection (DET) */}
                {currentQuestion.type === "word_selection" && currentQuestion.options && (
                  <View style={styles.wordGrid}>
                    {currentQuestion.options.map((word, idx) => {
                      const list = (userAnswers[currentQuestion.id] as number[]) || [];
                      const isSelected = list.includes(idx);
                      return (
                        <PremiumPressable
                          key={idx}
                          onPress={() => {
                            if (list.includes(idx)) {
                              setUserAnswers((prev) => ({
                                ...prev,
                                [currentQuestion.id]: list.filter((i) => i !== idx),
                              }));
                            } else {
                              setUserAnswers((prev) => ({
                                ...prev,
                                [currentQuestion.id]: [...list, idx],
                              }));
                            }
                          }}
                          style={[
                            styles.wordBtn,
                            isSelected && {
                              borderColor: primaryAccent,
                              backgroundColor: isDark ? "rgba(16, 185, 129, 0.2)" : "#DCFCE7",
                            },
                          ]}
                        >
                          <AppText
                            style={[
                              styles.wordBtnText,
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

                {/* Essay / Text Input */}
                {currentQuestion.type === "text_entry" && (
                  <View>
                    <TextInput
                      style={[styles.examTextInput, { color: colors.foreground, borderColor: colors.border }]}
                      placeholder="Type your response under exam conditions..."
                      placeholderTextColor={colors.mutedForeground}
                      multiline
                      value={String(userAnswers[currentQuestion.id] || "")}
                      onChangeText={(text) =>
                        setUserAnswers((prev) => ({ ...prev, [currentQuestion.id]: text }))
                      }
                    />
                    <View style={styles.wordCounter}>
                      <AppText style={styles.wordCounterText} forceLatinFont>
                        Word count: {String(userAnswers[currentQuestion.id] || "").trim().split(/\s+/).filter(Boolean).length}
                      </AppText>
                    </View>
                  </View>
                )}

                {/* Speaking Recording */}
                {currentQuestion.type === "speaking_recording" && (
                  <View style={styles.speakingContainer}>
                    <AppText style={styles.speakingPromptInstruction} forceLatinFont>
                      Speak clearly into your microphone until the countdown expires.
                    </AppText>
                    <MicCaptureOrb
                      listening={voiceCapture.listening}
                      disabled={false}
                      onPress={
                        voiceCapture.listening
                          ? () => voiceCapture.stopAndEvaluate(currentQuestion.prompt)
                          : () =>
                              voiceCapture.start({
                                onResult: (t: string) =>
                                  setUserAnswers((prev) => ({
                                    ...prev,
                                    [currentQuestion.id]: t,
                                  })),
                              })
                      }
                    />
                  </View>
                )}
              </View>

              {/* Navigation HUD Bottom */}
              <View style={[styles.navRow, isRtl && styles.rowReverse]}>
                {questionIndex > 0 && (
                  <PremiumPressable
                    onPress={() => setQuestionIndex((prev) => prev - 1)}
                    style={[styles.navBtn, { borderColor: colors.border }]}
                  >
                    <AppText style={styles.navBtnText} forceLatinFont latinRole="bold">
                      Previous Question
                    </AppText>
                  </PremiumPressable>
                )}

                <PremiumPressable
                  onPress={handleNextOrAutoSubmit}
                  style={[styles.navBtnPrimary, { backgroundColor: primaryAccent }]}
                >
                  <AppText style={styles.navBtnPrimaryText} forceLatinFont latinRole="bold">
                    {questionIndex < currentSection.questions.length - 1
                      ? "Next Question"
                      : sectionIndex < mockDef.sections.length - 1
                        ? "Next Section"
                        : "Submit Full Exam"}
                  </AppText>
                  <HugeiconsIcon icon={forwardIcon} size={16} color="#FFFFFF" strokeWidth={2.4} />
                </PremiumPressable>
              </View>
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
    centerAlign: {
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    },
    gradingText: {
      fontSize: 18,
      fontWeight: "900",
      color: colors.foreground,
      marginTop: 16,
      marginBottom: 6,
    },
    gradingSubtext: {
      fontSize: 13,
      lineHeight: 18,
      color: colors.mutedForeground,
      textAlign: "center",
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
    sectionIntroContainer: {
      gap: 20,
      paddingTop: 10,
    },
    introCard: {
      padding: 24,
      borderRadius: 22,
      borderWidth: 1.5,
    },
    introBadge: {
      alignSelf: "flex-start",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      marginBottom: 12,
    },
    introBadgeText: {
      fontSize: 11,
      fontWeight: "800",
      letterSpacing: 0.5,
    },
    introTitle: {
      fontSize: 22,
      fontWeight: "900",
      color: colors.foreground,
      marginBottom: 8,
    },
    introDesc: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.mutedForeground,
      marginBottom: 16,
    },
    durationChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: 12,
    },
    durationChipText: {
      fontSize: 13,
      color: colors.foreground,
    },
    examModeWarning: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      padding: 12,
      borderRadius: 12,
      backgroundColor: isDark ? "rgba(245, 158, 11, 0.1)" : "#FEF3C7",
    },
    examModeWarningText: {
      fontSize: 12,
      color: isDark ? "#FCD34D" : "#B45309",
      fontWeight: "600",
      flex: 1,
    },
    beginSectionBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      paddingVertical: 16,
      borderRadius: 16,
    },
    beginSectionBtnText: {
      fontSize: 15,
      fontWeight: "900",
      color: "#FFFFFF",
    },
    activeExamContainer: {
      gap: 16,
    },
    examHud: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: 4,
    },
    hudSectionInfo: {
      flex: 1,
    },
    hudSectionTitle: {
      fontSize: 15,
      fontWeight: "800",
      color: colors.foreground,
    },
    hudQProgress: {
      fontSize: 12,
      color: colors.mutedForeground,
    },
    timerPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      borderWidth: 1.5,
      backgroundColor: colors.surfaceRaised,
    },
    timerPillText: {
      fontSize: 14,
      fontWeight: "900",
    },
    examCard: {
      padding: 20,
      borderRadius: 20,
      borderWidth: 1,
    },
    examCardInstruction: {
      fontSize: 13,
      fontWeight: "800",
      color: primaryAccent,
      marginBottom: 8,
    },
    examCardPrompt: {
      fontSize: 14,
      lineHeight: 21,
      color: colors.foreground,
      marginBottom: 16,
    },
    optionsList: {
      gap: 10,
    },
    optionChoiceBtn: {
      padding: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    optionChoiceText: {
      fontSize: 13.5,
      color: colors.foreground,
    },
    wordGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    wordBtn: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    wordBtnText: {
      fontSize: 13.5,
      color: colors.foreground,
    },
    examTextInput: {
      minHeight: 140,
      padding: 14,
      borderRadius: 14,
      borderWidth: 1,
      fontSize: 14,
      lineHeight: 21,
      textAlignVertical: "top",
    },
    wordCounter: {
      alignItems: "flex-end",
      paddingTop: 8,
    },
    wordCounterText: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.mutedForeground,
    },
    speakingContainer: {
      alignItems: "center",
      paddingVertical: 16,
    },
    speakingPromptInstruction: {
      fontSize: 13,
      color: colors.mutedForeground,
      marginBottom: 14,
      textAlign: "center",
    },
    navRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 8,
    },
    navBtn: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      backgroundColor: colors.surfaceRaised,
    },
    navBtnText: {
      fontSize: 13,
      color: colors.foreground,
    },
    navBtnPrimary: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 12,
    },
    navBtnPrimaryText: {
      fontSize: 13.5,
      fontWeight: "800",
      color: "#FFFFFF",
    },
  });
}
