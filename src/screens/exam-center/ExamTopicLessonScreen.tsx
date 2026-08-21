/* eslint-disable @typescript-eslint/no-unused-vars, react/no-unescaped-entities */
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
  HelpCircleIcon,
  Idea01Icon,
  InformationCircleIcon,
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
import type { ExamId, PreparationTopic } from "../../types/exam-center";
import { IELTS_PREPARATION_TOPICS } from "../../data/exam-center/ielts-topics";
import { DET_PREPARATION_TOPICS } from "../../data/exam-center/det-topics";
import { MicCaptureOrb } from "../../components/voice/MicCaptureOrb";
import { useGeminiVoiceCapture } from "../../hooks/use-gemini-voice-capture";

type LessonPhase = "learn" | "examples" | "practice" | "quiz" | "score";

export default function ExamTopicLessonScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ examId?: string; topicId?: string }>();
  const { width } = useWindowDimensions();
  const { t, locale, isKu } = useI18n();
  const { colors, isDark } = useThemeColors();
  const isRtl = isKu || locale === "ar";
  const compact = width < 380;
  const isDesktopWeb = Platform.OS === "web" && width > 768;

  const exam: ExamId = params.examId === "det" ? "det" : "ielts";
  const isIelts = exam === "ielts";
  const primaryAccent = isIelts ? "#3B82F6" : "#10B981";

  const allTopics = isIelts ? IELTS_PREPARATION_TOPICS : DET_PREPARATION_TOPICS;
  const topic: PreparationTopic =
    allTopics.find((t) => t.id === params.topicId) || allTopics[0];

  const [phase, setPhase] = useState<LessonPhase>("learn");
  const [selectedExampleTier, setSelectedExampleTier] = useState<"weak" | "good" | "excellent">("excellent");

  // Practice state
  const [practiceInput, setPracticeInput] = useState("");
  const [showPracticeAnswer, setShowPracticeAnswer] = useState(false);
  const [practiceSelectedOption, setPracticeSelectedOption] = useState<number | null>(null);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [mistakesList, setMistakesList] = useState<string[]>([]);

  const { recordTopicCompletion } = useExamStore();
  const forwardIcon = isRtl ? ArrowLeft01Icon : ArrowRight01Icon;

  // Voice capture hook for speaking practice
  const voiceCapture = useGeminiVoiceCapture();

  const handleSelectQuizOption = (questionId: string, optionIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleFinishQuiz = () => {
    let correct = 0;
    const mistakes: string[] = [];

    topic.quiz.forEach((q) => {
      const chosen = quizAnswers[q.id];
      if (chosen === q.correctIndex) {
        correct++;
      } else {
        mistakes.push(q.skillTag);
      }
    });

    const percent = topic.quiz.length > 0 ? Math.round((correct / topic.quiz.length) * 100) : 100;
    setQuizScore(percent);
    setMistakesList(mistakes);
    setQuizSubmitted(true);
    setPhase("score");

    // Record in global store
    recordTopicCompletion(topic.id, exam, percent, mistakes);
  };

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
            paddingBottom: insets.bottom + 120,
          },
        ]}
      >
        <View style={styles.content}>
          {/* Top Bar with Step Progress */}
          <View style={[styles.topBar, isRtl && styles.rowReverse]}>
            <PremiumPressable
              onPress={() => router.push(`/exam-center/${exam}/preparation` as never)}
              style={[styles.backBtn, { borderColor: colors.border }]}
            >
              <HugeiconsIcon
                icon={isRtl ? ArrowRight01Icon : ArrowLeft01Icon}
                size={20}
                color={colors.foreground}
                strokeWidth={2.2}
              />
            </PremiumPressable>

            {/* Stepper Navigation */}
            <View style={[styles.stepperWrap, isRtl && styles.rowReverse]}>
              <PremiumPressable
                onPress={() => setPhase("learn")}
                style={[styles.stepItem, phase === "learn" && styles.stepItemActive]}
              >
                <AppText style={[styles.stepItemText, phase === "learn" && styles.stepItemTextActive]} forceLatinFont latinRole="bold">
                  1. Learn
                </AppText>
              </PremiumPressable>
              <PremiumPressable
                onPress={() => setPhase("examples")}
                style={[styles.stepItem, phase === "examples" && styles.stepItemActive]}
              >
                <AppText style={[styles.stepItemText, phase === "examples" && styles.stepItemTextActive]} forceLatinFont latinRole="bold">
                  2. Examples
                </AppText>
              </PremiumPressable>
              <PremiumPressable
                onPress={() => setPhase("practice")}
                style={[styles.stepItem, phase === "practice" && styles.stepItemActive]}
              >
                <AppText style={[styles.stepItemText, phase === "practice" && styles.stepItemTextActive]} forceLatinFont latinRole="bold">
                  3. Practice
                </AppText>
              </PremiumPressable>
              <PremiumPressable
                onPress={() => setPhase("quiz")}
                style={[styles.stepItem, (phase === "quiz" || phase === "score") && styles.stepItemActive]}
              >
                <AppText style={[styles.stepItemText, (phase === "quiz" || phase === "score") && styles.stepItemTextActive]} forceLatinFont latinRole="bold">
                  4. Quiz
                </AppText>
              </PremiumPressable>
            </View>
          </View>

          {/* Topic Title Header */}
          <View style={styles.topicHeaderBlock}>
            <AppText style={styles.topicHeaderTitle} forceLatinFont latinRole="bold">
              {topic.title}
            </AppText>
            <AppText
              style={styles.topicHeaderSubtitle}
              languageCode={locale}
              forceKurdishFont={isRtl}
              align="start"
            >
              {topic.subtitle}
            </AppText>
          </View>

          {/* ======================================================== */}
          {/* PHASE 1: LEARN (Concept, Strategies, Traps, Collocations) */}
          {/* ======================================================== */}
          {phase === "learn" && (
            <View style={styles.phaseContainer}>
              {/* Overview Box */}
              <View style={[styles.sectionCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
                <View style={[styles.cardHead, isRtl && styles.rowReverse]}>
                  <HugeiconsIcon icon={Book02Icon} size={18} color={primaryAccent} strokeWidth={2.2} />
                  <AppText style={styles.cardHeadTitle} forceLatinFont latinRole="bold">
                    Core Concept & Overview
                  </AppText>
                </View>
                <AppText style={styles.bodyCopy} languageCode={locale} forceKurdishFont={isRtl} align="start">
                  {topic.learnContent.overview}
                </AppText>
              </View>

              {/* Strategy Rules */}
              <View style={[styles.sectionCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
                <View style={[styles.cardHead, isRtl && styles.rowReverse]}>
                  <HugeiconsIcon icon={SparklesIcon} size={18} color="#F59E0B" strokeWidth={2.2} />
                  <AppText style={styles.cardHeadTitle} forceLatinFont latinRole="bold">
                    High-Score Strategy Rules
                  </AppText>
                </View>
                {topic.learnContent.strategyRules.map((rule, idx) => (
                  <View key={idx} style={[styles.bulletRow, isRtl && styles.rowReverse]}>
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} color="#10B981" strokeWidth={2.2} />
                    <AppText style={styles.bulletText} forceLatinFont latinRole="medium">
                      {rule}
                    </AppText>
                  </View>
                ))}
              </View>

              {/* Time Management Formula */}
              <View style={[styles.highlightBox, { backgroundColor: isDark ? "rgba(59, 130, 246, 0.1)" : "#EFF6FF", borderColor: primaryAccent }]}>
                <View style={[styles.cardHead, isRtl && styles.rowReverse]}>
                  <HugeiconsIcon icon={Clock01Icon} size={18} color={primaryAccent} strokeWidth={2.2} />
                  <AppText style={[styles.cardHeadTitle, { color: primaryAccent }]} forceLatinFont latinRole="bold">
                    Time-Management Formula
                  </AppText>
                </View>
                <AppText style={styles.bodyCopy} forceLatinFont latinRole="medium">
                  {topic.learnContent.timeManagementRule}
                </AppText>
              </View>

              {/* Common Traps to Avoid */}
              <View style={[styles.sectionCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
                <View style={[styles.cardHead, isRtl && styles.rowReverse]}>
                  <HugeiconsIcon icon={Alert01Icon} size={18} color="#EF4444" strokeWidth={2.2} />
                  <AppText style={styles.cardHeadTitle} forceLatinFont latinRole="bold">
                    Common Traps & Mistakes
                  </AppText>
                </View>
                {topic.learnContent.commonTraps.map((trap, idx) => (
                  <View key={idx} style={[styles.bulletRow, isRtl && styles.rowReverse]}>
                    <HugeiconsIcon icon={Alert01Icon} size={15} color="#EF4444" strokeWidth={2.2} />
                    <AppText style={styles.bulletText} forceLatinFont latinRole="medium">
                      {trap}
                    </AppText>
                  </View>
                ))}
              </View>

              {/* Useful Collocations & Vocabulary */}
              {topic.learnContent.usefulVocabulary.length > 0 && (
                <View style={[styles.sectionCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
                  <View style={[styles.cardHead, isRtl && styles.rowReverse]}>
                    <HugeiconsIcon icon={Idea01Icon} size={18} color="#8B5CF6" strokeWidth={2.2} />
                    <AppText style={styles.cardHeadTitle} forceLatinFont latinRole="bold">
                      High-Band Vocabulary & Collocations
                    </AppText>
                  </View>
                  {topic.learnContent.usefulVocabulary.map((v, idx) => (
                    <View key={idx} style={styles.vocabBlock}>
                      <View style={[styles.vocabHead, isRtl && styles.rowReverse]}>
                        <AppText style={styles.vocabTerm} forceLatinFont latinRole="bold">
                          {v.term}
                        </AppText>
                        {v.phonetic && (
                          <AppText style={styles.vocabPhonetic} forceLatinFont>
                            {v.phonetic}
                          </AppText>
                        )}
                      </View>
                      <AppText style={styles.vocabDef} forceLatinFont latinRole="medium">
                        {v.definition}
                      </AppText>
                      <AppText style={styles.vocabExample} forceLatinFont>
                        Example: "{v.examExample}"
                      </AppText>
                    </View>
                  ))}
                </View>
              )}

              {/* Next Button: Proceed to Examples */}
              <PremiumPressable
                onPress={() => setPhase("examples")}
                style={[styles.primaryActionBtn, { backgroundColor: primaryAccent }]}
                pressScale={0.98}
              >
                <AppText style={styles.primaryActionBtnText} forceLatinFont latinRole="bold">
                  Continue to Step 2: Examples
                </AppText>
                <HugeiconsIcon icon={forwardIcon} size={18} color="#FFFFFF" strokeWidth={2.5} />
              </PremiumPressable>
            </View>
          )}

          {/* ======================================================== */}
          {/* PHASE 2: COMPARATIVE EXAMPLES (Weak vs Good vs Excellent) */}
          {/* ======================================================== */}
          {phase === "examples" && (
            <View style={styles.phaseContainer}>
              <View style={[styles.sectionCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
                <View style={[styles.cardHead, isRtl && styles.rowReverse]}>
                  <HugeiconsIcon icon={SparklesIcon} size={18} color={primaryAccent} strokeWidth={2.2} />
                  <AppText style={styles.cardHeadTitle} forceLatinFont latinRole="bold">
                    Comparative Example Analysis
                  </AppText>
                </View>
                <AppText style={styles.bodyCopy} forceLatinFont latinRole="medium">
                  {topic.learnContent.comparativeExamples.prompt}
                </AppText>
              </View>

              {/* Tier Switcher */}
              <View style={styles.tierSwitcher}>
                <PremiumPressable
                  onPress={() => setSelectedExampleTier("weak")}
                  style={[
                    styles.tierBtn,
                    selectedExampleTier === "weak" && { backgroundColor: isDark ? "rgba(239, 68, 68, 0.2)" : "#FEE2E2", borderColor: "#EF4444" },
                  ]}
                >
                  <AppText
                    style={[styles.tierBtnText, selectedExampleTier === "weak" && { color: "#EF4444" }]}
                    forceLatinFont
                    latinRole="bold"
                  >
                    Weak ({topic.learnContent.comparativeExamples.weak.score})
                  </AppText>
                </PremiumPressable>

                <PremiumPressable
                  onPress={() => setSelectedExampleTier("good")}
                  style={[
                    styles.tierBtn,
                    selectedExampleTier === "good" && { backgroundColor: isDark ? "rgba(59, 130, 246, 0.2)" : "#DBEAFE", borderColor: "#3B82F6" },
                  ]}
                >
                  <AppText
                    style={[styles.tierBtnText, selectedExampleTier === "good" && { color: "#3B82F6" }]}
                    forceLatinFont
                    latinRole="bold"
                  >
                    Good ({topic.learnContent.comparativeExamples.good.score})
                  </AppText>
                </PremiumPressable>

                <PremiumPressable
                  onPress={() => setSelectedExampleTier("excellent")}
                  style={[
                    styles.tierBtn,
                    selectedExampleTier === "excellent" && { backgroundColor: isDark ? "rgba(16, 185, 129, 0.2)" : "#DCFCE7", borderColor: "#10B981" },
                  ]}
                >
                  <AppText
                    style={[styles.tierBtnText, selectedExampleTier === "excellent" && { color: "#10B981" }]}
                    forceLatinFont
                    latinRole="bold"
                  >
                    Excellent ({topic.learnContent.comparativeExamples.excellent.score})
                  </AppText>
                </PremiumPressable>
              </View>

              {/* Selected Tier Body */}
              {selectedExampleTier === "weak" && (
                <View style={[styles.exampleBox, { borderColor: "#EF4444", backgroundColor: isDark ? "rgba(239, 68, 68, 0.06)" : "#FEF2F2" }]}>
                  <AppText style={styles.exampleText} forceLatinFont>
                    "{topic.learnContent.comparativeExamples.weak.text}"
                  </AppText>
                  <View style={styles.divider} />
                  <AppText style={[styles.analysisHeader, { color: "#EF4444" }]} forceLatinFont latinRole="bold">
                    Examiner Diagnosis:
                  </AppText>
                  <AppText style={styles.analysisText} forceLatinFont>
                    {topic.learnContent.comparativeExamples.weak.explanation}
                  </AppText>
                </View>
              )}

              {selectedExampleTier === "good" && (
                <View style={[styles.exampleBox, { borderColor: "#3B82F6", backgroundColor: isDark ? "rgba(59, 130, 246, 0.06)" : "#EFF6FF" }]}>
                  <AppText style={styles.exampleText} forceLatinFont>
                    "{topic.learnContent.comparativeExamples.good.text}"
                  </AppText>
                  <View style={styles.divider} />
                  <AppText style={[styles.analysisHeader, { color: "#3B82F6" }]} forceLatinFont latinRole="bold">
                    Examiner Diagnosis:
                  </AppText>
                  <AppText style={styles.analysisText} forceLatinFont>
                    {topic.learnContent.comparativeExamples.good.explanation}
                  </AppText>
                </View>
              )}

              {selectedExampleTier === "excellent" && (
                <View style={[styles.exampleBox, { borderColor: "#10B981", backgroundColor: isDark ? "rgba(16, 185, 129, 0.06)" : "#ECFDF5" }]}>
                  <AppText style={styles.exampleText} forceLatinFont>
                    "{topic.learnContent.comparativeExamples.excellent.text}"
                  </AppText>
                  <View style={styles.divider} />
                  <AppText style={[styles.analysisHeader, { color: "#10B981" }]} forceLatinFont latinRole="bold">
                    Examiner Diagnosis:
                  </AppText>
                  <AppText style={styles.analysisText} forceLatinFont>
                    {topic.learnContent.comparativeExamples.excellent.explanation}
                  </AppText>
                  {topic.learnContent.comparativeExamples.excellent.examinerNote && (
                    <AppText style={styles.examinerNoteText} forceLatinFont>
                      Note: {topic.learnContent.comparativeExamples.excellent.examinerNote}
                    </AppText>
                  )}
                </View>
              )}

              {/* Continue to Practice Button */}
              <PremiumPressable
                onPress={() => setPhase("practice")}
                style={[styles.primaryActionBtn, { backgroundColor: primaryAccent }]}
                pressScale={0.98}
              >
                <AppText style={styles.primaryActionBtnText} forceLatinFont latinRole="bold">
                  Continue to Step 3: Practice Task
                </AppText>
                <HugeiconsIcon icon={forwardIcon} size={18} color="#FFFFFF" strokeWidth={2.5} />
              </PremiumPressable>
            </View>
          )}

          {/* ======================================================== */}
          {/* PHASE 3: GUIDED PRACTICE TASK                             */}
          {/* ======================================================== */}
          {phase === "practice" && (
            <View style={styles.phaseContainer}>
              <View style={[styles.sectionCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
                <View style={[styles.cardHead, isRtl && styles.rowReverse]}>
                  <HugeiconsIcon icon={Mortarboard02Icon} size={18} color={primaryAccent} strokeWidth={2.2} />
                  <AppText style={styles.cardHeadTitle} forceLatinFont latinRole="bold">
                    {topic.practiceTask.title}
                  </AppText>
                </View>
                <AppText style={styles.instructionText} forceLatinFont latinRole="medium">
                  {topic.practiceTask.instruction}
                </AppText>
                <AppText style={styles.promptBoxText} forceLatinFont>
                  {topic.practiceTask.prompt}
                </AppText>
              </View>

              {/* Task Input Widget (Multiple Choice vs Essay vs Speaking) */}
              {topic.practiceTask.type === "multiple_choice" && topic.practiceTask.options && (
                <View style={styles.optionsWrap}>
                  {topic.practiceTask.options.map((opt, idx) => (
                    <PremiumPressable
                      key={idx}
                      onPress={() => setPracticeSelectedOption(idx)}
                      style={[
                        styles.optionChoiceBtn,
                        practiceSelectedOption === idx && {
                          borderColor: primaryAccent,
                          backgroundColor: isDark ? "rgba(59, 130, 246, 0.15)" : "#EFF6FF",
                        },
                      ]}
                    >
                      <AppText
                        style={[
                          styles.optionChoiceText,
                          practiceSelectedOption === idx && { color: primaryAccent, fontWeight: "800" },
                        ]}
                        forceLatinFont
                      >
                        {opt}
                      </AppText>
                    </PremiumPressable>
                  ))}
                </View>
              )}

              {topic.practiceTask.type === "essay_writing" && (
                <View style={[styles.essayInputCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
                  <TextInput
                    style={[styles.essayInput, { color: colors.foreground }]}
                    placeholder="Type your response here using PEEL structure..."
                    placeholderTextColor={colors.mutedForeground}
                    multiline
                    value={practiceInput}
                    onChangeText={setPracticeInput}
                  />
                  <View style={styles.wordCountRow}>
                    <AppText style={styles.wordCountText} forceLatinFont>
                      Words: {practiceInput.trim().split(/\s+/).filter(Boolean).length}
                    </AppText>
                  </View>
                </View>
              )}

              {topic.practiceTask.type === "speaking_recording" && (
                <View style={[styles.speakingCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
                  <AppText style={styles.speakingGuideText} forceLatinFont latinRole="medium">
                    Tap to record your spoken response (Aim for {topic.practiceTask.targetTimeSeconds || 60}s).
                  </AppText>
                  <View style={styles.orbWrap}>
                    <MicCaptureOrb
                      listening={voiceCapture.listening}
                      disabled={false}
                      onPress={
                        voiceCapture.listening
                          ? () => voiceCapture.stopAndEvaluate(topic.practiceTask.prompt)
                          : () =>
                              voiceCapture.start({
                                onResult: (t: string) => setPracticeInput(t),
                              })
                      }
                    />
                  </View>
                </View>
              )}

              {/* Sample / Model Answer Toggle */}
              <PremiumPressable
                onPress={() => setShowPracticeAnswer(!showPracticeAnswer)}
                style={[styles.answerToggleBtn, { borderColor: colors.border }]}
              >
                <HugeiconsIcon icon={BulbIcon} size={18} color="#F59E0B" strokeWidth={2.2} />
                <AppText style={styles.answerToggleText} forceLatinFont latinRole="bold">
                  {showPracticeAnswer ? "Hide Model Answer & Breakdown" : "View Model Answer & Breakdown"}
                </AppText>
              </PremiumPressable>

              {showPracticeAnswer && (
                <View style={[styles.modelAnswerCard, { backgroundColor: isDark ? "rgba(16, 185, 129, 0.08)" : "#ECFDF5", borderColor: "#10B981" }]}>
                  <AppText style={styles.modelAnswerHeader} forceLatinFont latinRole="bold">
                    Model Answer:
                  </AppText>
                  <AppText style={styles.modelAnswerText} forceLatinFont>
                    {topic.practiceTask.modelAnswer}
                  </AppText>
                  <View style={styles.divider} />
                  <AppText style={styles.modelAnswerHeader} forceLatinFont latinRole="bold">
                    Why this works:
                  </AppText>
                  <AppText style={styles.modelAnswerText} forceLatinFont>
                    {topic.practiceTask.sampleBreakdown}
                  </AppText>
                </View>
              )}

              {/* Continue to Quiz Button */}
              <PremiumPressable
                onPress={() => setPhase("quiz")}
                style={[styles.primaryActionBtn, { backgroundColor: primaryAccent }]}
                pressScale={0.98}
              >
                <AppText style={styles.primaryActionBtnText} forceLatinFont latinRole="bold">
                  Continue to Step 4: Mastery Quiz
                </AppText>
                <HugeiconsIcon icon={forwardIcon} size={18} color="#FFFFFF" strokeWidth={2.5} />
              </PremiumPressable>
            </View>
          )}

          {/* ======================================================== */}
          {/* PHASE 4: QUIZ (Direct Skill Testing & Assessment)        */}
          {/* ======================================================== */}
          {phase === "quiz" && (
            <View style={styles.phaseContainer}>
              <AppText style={styles.quizInstructions} forceLatinFont latinRole="bold">
                Answer the {topic.quiz.length} test questions based on the strategy you just studied.
              </AppText>

              {topic.quiz.map((q, qIndex) => (
                <View
                  key={q.id}
                  style={[styles.quizQuestionCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}
                >
                  <View style={styles.quizQHeader}>
                    <AppText style={styles.quizQNumber} forceLatinFont latinRole="bold">
                      Question {qIndex + 1}
                    </AppText>
                  </View>
                  <AppText style={styles.quizQText} forceLatinFont>
                    {q.question}
                  </AppText>

                  <View style={styles.quizOptionsList}>
                    {q.options.map((opt, optIdx) => {
                      const isSelected = quizAnswers[q.id] === optIdx;
                      return (
                        <PremiumPressable
                          key={optIdx}
                          onPress={() => handleSelectQuizOption(q.id, optIdx)}
                          style={[
                            styles.quizOptionBtn,
                            isSelected && {
                              borderColor: primaryAccent,
                              backgroundColor: isDark ? "rgba(59, 130, 246, 0.15)" : "#EFF6FF",
                            },
                          ]}
                        >
                          <AppText
                            style={[
                              styles.quizOptionText,
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
                </View>
              ))}

              {/* Submit Quiz Button */}
              <PremiumPressable
                onPress={handleFinishQuiz}
                style={[
                  styles.primaryActionBtn,
                  {
                    backgroundColor:
                      Object.keys(quizAnswers).length === topic.quiz.length
                        ? primaryAccent
                        : colors.muted,
                  },
                ]}
                disabled={Object.keys(quizAnswers).length !== topic.quiz.length}
                pressScale={0.98}
              >
                <AppText style={styles.primaryActionBtnText} forceLatinFont latinRole="bold">
                  Submit Quiz & Receive Score
                </AppText>
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} color="#FFFFFF" strokeWidth={2.5} />
              </PremiumPressable>
            </View>
          )}

          {/* ======================================================== */}
          {/* PHASE 5: SCORE & MISTAKE EXPLANATION                     */}
          {/* ======================================================== */}
          {phase === "score" && (
            <View style={styles.phaseContainer}>
              <View
                style={[
                  styles.scoreResultCard,
                  {
                    backgroundColor: colors.surfaceRaised,
                    borderColor: quizScore >= 75 ? "#10B981" : "#F59E0B",
                    ...crossShadow({
                      color: quizScore >= 75 ? "#10B981" : "#F59E0B",
                      offsetY: 8,
                      blur: 24,
                      opacity: isDark ? 0.3 : 0.15,
                    }),
                  },
                ]}
              >
                <HugeiconsIcon
                  icon={quizScore >= 75 ? CheckmarkCircle02Icon : SparklesIcon}
                  size={40}
                  color={quizScore >= 75 ? "#10B981" : "#F59E0B"}
                  strokeWidth={2.2}
                />
                <AppText style={styles.scoreResultNumber} forceLatinFont latinRole="bold">
                  {quizScore}%
                </AppText>
                <AppText style={styles.scoreResultVerdict} forceLatinFont latinRole="bold">
                  {quizScore >= 75 ? "Skill Mastered!" : "Good Attempt - Review Needed"}
                </AppText>
                <AppText
                  style={styles.scoreResultSub}
                  languageCode={locale}
                  forceKurdishFont={isRtl}
                  align="start"
                >
                  Your Exam Readiness Score has been updated. Review the question-by-question explanations below.
                </AppText>
              </View>

              {/* Question Feedback Breakdown */}
              <AppText style={styles.reviewHeader} forceLatinFont latinRole="bold">
                Mistake Analysis & Explanations
              </AppText>

              {topic.quiz.map((q, idx) => {
                const userChoice = quizAnswers[q.id];
                const isCorrect = userChoice === q.correctIndex;

                return (
                  <View
                    key={q.id}
                    style={[
                      styles.explanationCard,
                      {
                        backgroundColor: colors.surfaceRaised,
                        borderColor: isCorrect ? "#10B981" : "#EF4444",
                      },
                    ]}
                  >
                    <View style={[styles.explHead, isRtl && styles.rowReverse]}>
                      <HugeiconsIcon
                        icon={isCorrect ? CheckmarkCircle02Icon : Alert01Icon}
                        size={16}
                        color={isCorrect ? "#10B981" : "#EF4444"}
                        strokeWidth={2.4}
                      />
                      <AppText
                        style={[styles.explStatus, { color: isCorrect ? "#10B981" : "#EF4444" }]}
                        forceLatinFont
                        latinRole="bold"
                      >
                        Question {idx + 1}: {isCorrect ? "Correct" : "Mistake Identified"}
                      </AppText>
                    </View>

                    <AppText style={styles.explQuestion} forceLatinFont>
                      {q.question}
                    </AppText>
                    <AppText style={styles.explAnswerRow} forceLatinFont>
                      Your Answer: <AppText style={{ fontWeight: "800" }}>{q.options[userChoice]}</AppText>
                    </AppText>
                    {!isCorrect && (
                      <AppText style={[styles.explAnswerRow, { color: "#10B981" }]} forceLatinFont>
                        Correct Answer: <AppText style={{ fontWeight: "800" }}>{q.options[q.correctIndex]}</AppText>
                      </AppText>
                    )}

                    <View style={styles.divider} />
                    <AppText style={styles.explExplanation} forceLatinFont>
                      {q.explanation}
                    </AppText>
                  </View>
                );
              })}

              {/* Navigation CTA: Back to Preparation */}
              <PremiumPressable
                onPress={() => router.push(`/exam-center/${exam}/preparation` as never)}
                style={[styles.primaryActionBtn, { backgroundColor: primaryAccent }]}
                pressScale={0.98}
              >
                <AppText style={styles.primaryActionBtnText} forceLatinFont latinRole="bold">
                  Back to Preparation Course Hub
                </AppText>
                <HugeiconsIcon icon={forwardIcon} size={18} color="#FFFFFF" strokeWidth={2.5} />
              </PremiumPressable>
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
    stepperWrap: {
      flexDirection: "row",
      gap: 6,
    },
    stepItem: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "#F1F5F9",
    },
    stepItemActive: {
      backgroundColor: primaryAccent,
    },
    stepItemText: {
      fontSize: 11,
      fontWeight: "700",
      color: colors.mutedForeground,
    },
    stepItemTextActive: {
      color: "#FFFFFF",
    },
    topicHeaderBlock: {
      marginBottom: 18,
    },
    topicHeaderTitle: {
      fontSize: isDesktopWeb ? 26 : compact ? 20 : 22,
      fontWeight: "900",
      color: colors.foreground,
      fontFamily: "Rabar_044",
      letterSpacing: -0.4,
      marginBottom: 4,
    },
    topicHeaderSubtitle: {
      fontSize: 13,
      lineHeight: 18,
      color: colors.mutedForeground,
    },
    phaseContainer: {
      gap: 16,
    },
    sectionCard: {
      padding: 18,
      borderRadius: 18,
      borderWidth: 1,
    },
    cardHead: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 10,
    },
    cardHeadTitle: {
      fontSize: 15,
      fontWeight: "800",
      color: colors.foreground,
    },
    bodyCopy: {
      fontSize: 13.5,
      lineHeight: 20,
      color: colors.foreground,
    },
    bulletRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
      marginBottom: 8,
    },
    bulletText: {
      flex: 1,
      fontSize: 13,
      lineHeight: 19,
      color: colors.foreground,
    },
    highlightBox: {
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
    },
    vocabBlock: {
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "rgba(255, 255, 255, 0.06)" : "#F1F5F9",
    },
    vocabHead: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 2,
    },
    vocabTerm: {
      fontSize: 14,
      fontWeight: "800",
      color: colors.foreground,
    },
    vocabPhonetic: {
      fontSize: 12,
      color: colors.mutedForeground,
    },
    vocabDef: {
      fontSize: 13,
      color: colors.foreground,
      marginBottom: 2,
    },
    vocabExample: {
      fontSize: 12,
      fontStyle: "italic",
      color: colors.mutedForeground,
    },
    primaryActionBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 14,
      borderRadius: 14,
      marginTop: 8,
    },
    primaryActionBtnText: {
      fontSize: 14,
      fontWeight: "800",
      color: "#FFFFFF",
    },
    tierSwitcher: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 10,
    },
    tierBtn: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surfaceRaised,
    },
    tierBtnText: {
      fontSize: 12,
      fontWeight: "800",
      color: colors.mutedForeground,
    },
    exampleBox: {
      padding: 16,
      borderRadius: 16,
      borderWidth: 1.5,
    },
    exampleText: {
      fontSize: 13.5,
      lineHeight: 20,
      fontStyle: "italic",
      color: colors.foreground,
      marginBottom: 10,
    },
    divider: {
      height: 1,
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#E2E8F0",
      marginVertical: 10,
    },
    analysisHeader: {
      fontSize: 13,
      fontWeight: "800",
      marginBottom: 4,
    },
    analysisText: {
      fontSize: 12.5,
      lineHeight: 18,
      color: colors.foreground,
    },
    examinerNoteText: {
      fontSize: 12,
      fontStyle: "italic",
      color: colors.mutedForeground,
      marginTop: 6,
    },
    instructionText: {
      fontSize: 13,
      fontWeight: "700",
      color: primaryAccent,
      marginBottom: 6,
    },
    promptBoxText: {
      fontSize: 13.5,
      lineHeight: 20,
      color: colors.foreground,
    },
    optionsWrap: {
      gap: 8,
    },
    optionChoiceBtn: {
      padding: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceRaised,
    },
    optionChoiceText: {
      fontSize: 13.5,
      color: colors.foreground,
    },
    essayInputCard: {
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
    },
    essayInput: {
      minHeight: 120,
      fontSize: 14,
      lineHeight: 20,
      textAlignVertical: "top",
    },
    wordCountRow: {
      alignItems: "flex-end",
      paddingTop: 8,
    },
    wordCountText: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.mutedForeground,
    },
    speakingCard: {
      padding: 20,
      borderRadius: 18,
      borderWidth: 1,
      alignItems: "center",
    },
    speakingGuideText: {
      fontSize: 13,
      color: colors.mutedForeground,
      marginBottom: 16,
      textAlign: "center",
    },
    orbWrap: {
      alignItems: "center",
      justifyContent: "center",
    },
    answerToggleBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      backgroundColor: colors.surfaceRaised,
    },
    answerToggleText: {
      fontSize: 13,
      color: colors.foreground,
    },
    modelAnswerCard: {
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
    },
    modelAnswerHeader: {
      fontSize: 13,
      fontWeight: "800",
      color: "#10B981",
      marginBottom: 4,
    },
    modelAnswerText: {
      fontSize: 13,
      lineHeight: 19,
      color: colors.foreground,
    },
    quizInstructions: {
      fontSize: 14,
      color: colors.foreground,
      marginBottom: 10,
    },
    quizQuestionCard: {
      padding: 16,
      borderRadius: 18,
      borderWidth: 1,
      marginBottom: 12,
    },
    quizQHeader: {
      marginBottom: 6,
    },
    quizQNumber: {
      fontSize: 12,
      fontWeight: "800",
      color: primaryAccent,
      textTransform: "uppercase",
    },
    quizQText: {
      fontSize: 13.5,
      lineHeight: 20,
      color: colors.foreground,
      marginBottom: 12,
    },
    quizOptionsList: {
      gap: 8,
    },
    quizOptionBtn: {
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    quizOptionText: {
      fontSize: 13,
      color: colors.foreground,
    },
    scoreResultCard: {
      padding: 24,
      borderRadius: 22,
      borderWidth: 1.5,
      alignItems: "center",
      textAlign: "center",
      marginBottom: 16,
    },
    scoreResultNumber: {
      fontSize: 38,
      fontWeight: "900",
      color: colors.foreground,
      marginTop: 8,
      marginBottom: 2,
    },
    scoreResultVerdict: {
      fontSize: 18,
      fontWeight: "800",
      color: colors.foreground,
      marginBottom: 6,
    },
    scoreResultSub: {
      fontSize: 13,
      lineHeight: 18,
      color: colors.mutedForeground,
      textAlign: "center",
    },
    reviewHeader: {
      fontSize: 16,
      fontWeight: "800",
      color: colors.foreground,
      marginBottom: 10,
    },
    explanationCard: {
      padding: 16,
      borderRadius: 16,
      borderWidth: 1.5,
      marginBottom: 12,
    },
    explHead: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: 6,
    },
    explStatus: {
      fontSize: 13,
      fontWeight: "800",
    },
    explQuestion: {
      fontSize: 13,
      color: colors.foreground,
      marginBottom: 6,
    },
    explAnswerRow: {
      fontSize: 12.5,
      color: colors.foreground,
      marginBottom: 2,
    },
    explExplanation: {
      fontSize: 12.5,
      lineHeight: 18,
      color: colors.mutedForeground,
    },
  });
}
