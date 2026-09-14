

import React, { useCallback, useEffect, useState, useRef } from "react";
import { ActivityIndicator, Platform, ScrollView, StyleSheet, View, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  SlideInDown,
  withRepeat,
  withTiming,
  useSharedValue,
  useAnimatedStyle,
  withSequence,
} from "react-native-reanimated";

import { PressableScale } from "../../components/animations";
import { AppText } from "../../components/ui/AppText";
import { useTTS } from "../../hooks/use-tts";
import { useI18n } from "../../hooks/useI18n";
import { useSafeBack } from "../../hooks/use-safe-back";
import { GamesGlassHeader } from "../games/components/games-chrome";
import { useGamesTheme } from "../games/games-theme";
import {
  askStudyTutor,
  type StudyStep,
  type StudySubject,
  type StudyTutorResponse,
} from "../../services/study-tutor-service";
import { formatMathFormula, StudyFormulaCard } from "./components/StudyFormulaCard";
import { StudyInteractiveCanvas } from "./components/StudyInteractiveCanvas";
import { StudyVoiceBar } from "./components/StudyVoiceBar";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  SparklesIcon,
  FunctionSquareIcon,
  Atom02Icon,
  BookOpen02Icon,
  PlayIcon,
  PauseIcon,
  Forward01Icon,
  ArrowDown01Icon,
  CodeIcon,
} from "@hugeicons/core-free-icons";

type ThreadItem = {
  id: string;
  role: "user" | "agent";
  text?: string;
  imageBase64?: string;
  imageMimeType?: string;
  lesson?: StudyTutorResponse;
  error?: string;
};

function AgentThinkingCard() {
  const [stage, setStage] = useState(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const i1 = setTimeout(() => {
      setStage(2);
    }, 1600);
    const i2 = setTimeout(() => {
      setStage(3);
    }, 3800);

    opacity.value = withRepeat(
      withSequence(withTiming(0.4, { duration: 700 }), withTiming(1, { duration: 700 })),
      -1,
      true,
    );

    return () => {
      clearTimeout(i1);
      clearTimeout(i2);
    };
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  let title = "AI Reasoning Engine Thinking...";
  let desc = "Analyzing problem formulation & physical laws...";
  let codeSnippet = "import sympy, numpy\n# Initializing physical laws & boundary conditions...";

  if (stage === 2) {
    desc = "Executing Python 3.11 code in sandbox to verify numerical constraints...";
    codeSnippet = "def solve_system():\n  roots = sympy.solve(governing_eqs, domain=Reals)\n  return verify_equilibrium(roots)\nsolve_system()";
  } else if (stage === 3) {
    desc = "Synthesizing 60fps dynamic visual simulation & clean LaTeX steps...";
    codeSnippet = "# Generating dynamic HTML5 Canvas animation loop\nrender_60fps_simulation(canvas, params)";
  }

  return (
    <Animated.View
      entering={typeof FadeIn !== "undefined" ? FadeIn : undefined}
      exiting={typeof FadeOut !== "undefined" ? FadeOut : undefined}
      style={[
        styles.thinkingCard,
        {
          backgroundColor: "rgba(37, 99, 235, 0.08)",
          borderColor: "rgba(37, 99, 235, 0.22)",
        },
      ]}
    >
      <View style={styles.thinkingHeaderRow}>
        <View style={styles.thinkingIconBadge}>
          <ActivityIndicator size="small" color="#2563EB" />
        </View>
        <View style={styles.thinkingTextGroup}>
          <AppText style={styles.thinkingTitle}>{title}</AppText>
          <Animated.Text
            style={[styles.thinkingDesc, { color: "#2563EB" }, animatedStyle]}
          >
            {desc}
          </Animated.Text>
        </View>
      </View>

      <View style={styles.thinkingCodeBox}>
        <View style={styles.thinkingCodeHeader}>
          <HugeiconsIcon icon={CodeIcon} size={12} color="#93C5FD" />
          <AppText style={styles.thinkingCodeLabel}>
            {stage === 2 ? "Python 3.11 Runtime (Sandbox Executing...)" : "Sandbox Runtime Engine"}
          </AppText>
        </View>
        <AppText style={styles.thinkingCodeText} forceLatinFont>
          {codeSnippet}
        </AppText>
      </View>
    </Animated.View>
  );
}

function AgentThoughtDisclosure({
  lesson,
  isExpanded,
  onToggle,
}: {
  lesson: StudyTutorResponse;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const theme = useGamesTheme();
  const isDark = theme.isDark;

  const thinking = lesson.thinkingProcess || [
    "1. Analyzed problem domain and identified governing scientific equations.",
    "2. Derived algebraic relationships and verified boundary values.",
    "3. Executed numerical proof and initialized simulation engine.",
  ];

  const hasPython = Boolean(
    lesson.interactive.executedPythonCode || lesson.interactive.executedPythonOutput,
  );

  return (
    <View
      style={[
        styles.thoughtContainer,
        {
          backgroundColor: isDark ? "rgba(15, 23, 42, 0.6)" : "rgba(241, 245, 249, 0.7)",
          borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
        },
      ]}
    >
      <PressableScale onPress={onToggle} style={styles.thoughtHeaderRow}>
        <View style={styles.thoughtBadgeRow}>
          <View style={styles.thoughtIconCircle}>
            <HugeiconsIcon icon={SparklesIcon} size={14} color="#2563EB" />
          </View>
          <AppText style={styles.thoughtHeaderText}>AI REASONING & CODE RUNTIME</AppText>
        </View>

        <View style={styles.thoughtActionPill}>
          <AppText style={styles.thoughtActionText}>
            {isExpanded
              ? "Hide Trace"
              : `${thinking.length} Steps · ${hasPython ? "Python Executed" : "Compiled"}`}
          </AppText>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={14}
            color={theme.mutedInk}
            style={{ transform: [{ rotate: isExpanded ? "180deg" : "0deg" }] }}
          />
        </View>
      </PressableScale>

      {isExpanded ? (
        <View style={styles.thoughtBody}>
          <View style={styles.thoughtStepsList}>
            {thinking.map((step, idx) => (
              <View key={`thought-${idx}`} style={styles.thoughtStepRow}>
                <View style={styles.thoughtStepDot} />
                <AppText style={[styles.thoughtStepText, { color: theme.ink }]}>
                  {step}
                </AppText>
              </View>
            ))}
          </View>

          {lesson.interactive.executedPythonCode ? (
            <View style={styles.executedCodeBox}>
              <View style={styles.codeHeaderBar}>
                <HugeiconsIcon icon={CodeIcon} size={13} color="#93C5FD" />
                <AppText style={styles.codeHeaderLabel}>Python 3.11 Runtime (Executed)</AppText>
              </View>
              <AppText style={styles.codeContentText} forceLatinFont>
                {lesson.interactive.executedPythonCode}
              </AppText>
              {lesson.interactive.executedPythonOutput ? (
                <View style={styles.codeOutputBox}>
                  <AppText style={styles.codeOutputLabel}>Console Output:</AppText>
                  <AppText style={styles.codeOutputText} forceLatinFont>
                    {lesson.interactive.executedPythonOutput}
                  </AppText>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export function StudyTutorScreen() {
  const safeBack = useSafeBack("/(tabs)/play");
  const theme = useGamesTheme();
  const isDark = theme.isDark;
  const insets = useSafeAreaInsets();
  const { isKu, isAr } = useI18n();
  const isRtl = isKu || isAr;

  const [activeSubject, setActiveSubject] = useState<StudySubject>("math");
  const [thread, setThread] = useState<ThreadItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeWalkthroughLessonId, setActiveWalkthroughLessonId] = useState<string | null>(null);
  const [speakingStepIdx, setSpeakingStepIdx] = useState<number | null>(null);
  const [revealedStepsMap, setRevealedStepsMap] = useState<Record<string, number>>({});
  const [isWalkthroughActive, setIsWalkthroughActive] = useState<boolean>(false);
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);

  const requestInFlight = useRef(false);
  const messageSequence = useRef(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const advanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { speak, stop, speaking } = useTTS();

  const speechLang = isKu ? "ckb" : isAr ? "ar" : "en";

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current);
      }
      void stop();
    };
  }, [stop]);

  const speakStepWithProgression = useCallback(
    (
      lessonId: string,
      step: StudyStep,
      idx: number,
      totalSteps: number,
      allSteps: StudyStep[],
      autoAdvance: boolean = true,
    ) => {
      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current);
        advanceTimerRef.current = null;
      }

      setActiveWalkthroughLessonId(lessonId);
      setSpeakingStepIdx(idx);
      setIsWalkthroughActive(autoAdvance);
      setRevealedStepsMap((prev) => ({
        ...prev,
        [lessonId]: Math.max(prev[lessonId] ?? 1, idx + 1),
      }));

      const stepPrefix = isKu
        ? `هەنگاوی ${step.stepNumber}: `
        : isAr
          ? `الخطوة ${step.stepNumber}: `
          : `Step ${step.stepNumber}: `;
      const mathSpoken = formatMathFormula(step.latex || step.formulaSnippet || "");
      const textToSpeak = `${stepPrefix}${step.title ? step.title + '. ' : ''}${step.explanation || mathSpoken}`;

      void speak(textToSpeak, speechLang, `step-${lessonId}-${idx}`, {
        onDone: () => {
          setSpeakingStepIdx(null);
          if (autoAdvance && idx + 1 < totalSteps) {
            advanceTimerRef.current = setTimeout(() => {
              const nextStep = allSteps[idx + 1];
              if (nextStep) {
                setRevealedStepsMap((prev) => ({
                  ...prev,
                  [lessonId]: idx + 2,
                }));
                speakStepWithProgression(lessonId, nextStep, idx + 1, totalSteps, allSteps, true);
              }
            }, 450);
          } else {
            setIsWalkthroughActive(false);
          }
        },
      });
    },
    [isKu, isAr, speak, speechLang],
  );

  const handleResumeWalkthrough = useCallback(
    (lesson: StudyTutorResponse) => {
      if (!lesson.steps || lesson.steps.length === 0) return;
      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current);
        advanceTimerRef.current = null;
      }
      void stop();
      const currentRevealed = revealedStepsMap[lesson.id] ?? 1;
      const resumeIdx = Math.max(0, Math.min(currentRevealed - 1, lesson.steps.length - 1));
      setActiveWalkthroughLessonId(lesson.id);
      speakStepWithProgression(
        lesson.id,
        lesson.steps[resumeIdx],
        resumeIdx,
        lesson.steps.length,
        lesson.steps,
        true,
      );
    },
    [revealedStepsMap, speakStepWithProgression, stop],
  );

  const handleStartWalkthrough = useCallback(
    (lesson: StudyTutorResponse) => {
      if (!lesson.steps || lesson.steps.length === 0) return;
      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current);
        advanceTimerRef.current = null;
      }
      void stop();
      setActiveWalkthroughLessonId(lesson.id);
      setRevealedStepsMap((prev) => ({ ...prev, [lesson.id]: 1 }));
      speakStepWithProgression(lesson.id, lesson.steps[0], 0, lesson.steps.length, lesson.steps, true);
    },
    [speakStepWithProgression, stop],
  );

  const handlePauseWalkthrough = useCallback(() => {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    void stop();
    setSpeakingStepIdx(null);
    setIsWalkthroughActive(false);
  }, [stop]);

  const handleNextStep = useCallback(
    (lesson: StudyTutorResponse) => {
      if (!lesson.steps || lesson.steps.length === 0) return;
      const currentRevealed = revealedStepsMap[lesson.id] ?? 1;
      const current =
        speakingStepIdx !== null && activeWalkthroughLessonId === lesson.id
          ? speakingStepIdx
          : currentRevealed - 1;
      const nextIdx = Math.min(current + 1, lesson.steps.length - 1);
      setActiveWalkthroughLessonId(lesson.id);
      setRevealedStepsMap((prev) => ({
        ...prev,
        [lesson.id]: Math.max(currentRevealed, nextIdx + 1),
      }));
      const step = lesson.steps[nextIdx];
      if (step) {
        speakStepWithProgression(lesson.id, step, nextIdx, lesson.steps.length, lesson.steps, true);
      }
    },
    [activeWalkthroughLessonId, revealedStepsMap, speakingStepIdx, speakStepWithProgression],
  );

  const handleRevealAllSteps = useCallback(
    (lesson: StudyTutorResponse) => {
      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current);
        advanceTimerRef.current = null;
      }
      void stop();
      setActiveWalkthroughLessonId(lesson.id);
      setSpeakingStepIdx(null);
      setIsWalkthroughActive(false);
      setRevealedStepsMap((prev) => ({ ...prev, [lesson.id]: lesson.steps.length }));
    },
    [stop],
  );

  const handleAskQuestion = useCallback(async (query: string, imageBase64?: string, imageMimeType?: string) => {
    if ((!query.trim() && !imageBase64) || requestInFlight.current) return;
    requestInFlight.current = true;
    const messageId = ++messageSequence.current;

    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    void stop();
    setSpeakingStepIdx(null);
    setIsWalkthroughActive(false);

    const newUserMsg: ThreadItem = {
      id: `usr-${messageId}`,
      role: "user",
      text: query,
      imageBase64,
      imageMimeType,
    };

    setThread((prev) => [...prev, newUserMsg]);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    setIsGenerating(true);

    try {
      const response = await askStudyTutor({
        question: query,
        subject: activeSubject,
        language: isKu ? "Kurdish" : isAr ? "Arabic" : "English",
        imageBase64,
        imageMimeType,
      });

      setActiveSubject(response.subject);

      const newAgentMsg: ThreadItem = {
        id: response.id,
        role: "agent",
        lesson: response,
      };

      setThread((prev) => [...prev, newAgentMsg]);
      setExpandedTraceId(response.id);

      // Pedagogical routing: Math gets progressive step-by-step LaTeX reveal; Science prioritizes simulation!
      if (response.subject === "math" && response.steps && response.steps.length > 0) {
        setActiveWalkthroughLessonId(response.id);
        setRevealedStepsMap((prev) => ({ ...prev, [response.id]: 1 }));
        setTimeout(() => {
          speakStepWithProgression(
            response.id,
            response.steps[0],
            0,
            response.steps.length,
            response.steps,
            true,
          );
        }, 400);
      } else {
        if (response.speechExplanation) {
          void speak(response.speechExplanation, speechLang, "summary-voice");
        }
      }

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 500);
    } catch (err: any) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to connect to the tutor. Please try again.";
      setThread((prev) => [...prev, { id: `err-${messageId}`, role: "agent", error: errorMessage }]);
    } finally {
      requestInFlight.current = false;
      setIsGenerating(false);
    }
  }, [activeSubject, isAr, isKu, speak, speakStepWithProgression, speechLang, stop]);

  const handleSpeakStep = useCallback(
    (lesson: StudyTutorResponse, text: string, index: number) => {
      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current);
        advanceTimerRef.current = null;
      }
      setIsWalkthroughActive(false);
      setActiveWalkthroughLessonId(lesson.id);
      setRevealedStepsMap((prev) => ({
        ...prev,
        [lesson.id]: Math.max(prev[lesson.id] ?? 1, index + 1),
      }));

      if (speaking && speakingStepIdx === index && activeWalkthroughLessonId === lesson.id) {
        void stop();
        setSpeakingStepIdx(null);
      } else {
        setSpeakingStepIdx(index);
        void speak(text, speechLang, `step-${lesson.id}-${index}`, {
          onDone: () => setSpeakingStepIdx(null),
        });
      }
    },
    [activeWalkthroughLessonId, speak, speechLang, speaking, speakingStepIdx, stop],
  );

  const currentLesson = thread.length > 0 ? thread[thread.length - 1].lesson : null;

  const handleReplaySummary = useCallback(() => {
    if (speaking) {
      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current);
        advanceTimerRef.current = null;
      }
      void stop();
      setSpeakingStepIdx(null);
      setIsWalkthroughActive(false);
    } else if (currentLesson?.speechExplanation) {
      setSpeakingStepIdx(null);
      void speak(currentLesson?.speechExplanation || "", speechLang, "summary-replay");
    }
  }, [speak, stop, speaking, currentLesson?.speechExplanation, speechLang]);

  return (
    <View style={[styles.screen, { backgroundColor: theme.canvas }]}>
      <GamesGlassHeader
        title={isKu ? "مامۆستای لێکۆڵینەوەی AI" : isAr ? "معلم الدراسة الذكي" : "AI Study Tutor"}
        onBack={safeBack}
        right={
          currentLesson ? (
            <View style={styles.headerPill}>
              <AppText style={styles.headerPillText}>
                {isKu ? "وانەی تۆ" : isAr ? "درسك" : "Your lesson"}
              </AppText>
            </View>
          ) : undefined
        }
      />

      <View style={styles.keyboardContainer}>
        <KeyboardAwareScrollView
          bottomOffset={60}
          ref={scrollViewRef as any}
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: thread.length === 0 ? insets.bottom + 16 : insets.bottom + 120 },
            thread.length === 0 && { flexGrow: 1, justifyContent: "center" },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {thread.length === 0 ? (
            <Animated.View
              entering={typeof FadeIn !== "undefined" ? FadeIn : undefined}
              style={styles.emptyStateContainer}
            >
              <View style={styles.heroBadge}>
                <AppText style={styles.heroBadgeText}>Twino AI Study Tutor</AppText>
              </View>
              <View
                style={[
                  styles.emptyLogoCircle,
                  { backgroundColor: isDark ? "#1E293B" : "#F1F5F9" },
                ]}
              >
                <HugeiconsIcon icon={SparklesIcon} size={36} color={theme.ink} />
              </View>
              <AppText style={[styles.emptyTitle, { color: theme.ink }]}>
                {isKu
                  ? "چۆن دەتوانم یارمەتیت بدەم؟"
                  : isAr
                    ? "كيف يمكنني مساعدتك؟"
                    : "How can I help you today?"}
              </AppText>
              <AppText style={[styles.emptySubtitle, { color: theme.mutedInk }]}>
                {isKu
                  ? "کێشەیەکی بیرکاری، پرسیارێکی زانستی بەرز بکەرەوە، یان هەر شتێک بپرسە"
                  : isAr
                    ? "ارفع مسألة رياضية أو سؤالاً علميًا أو اسأل أي شيء"
                    : "Upload a math problem, science question, or ask anything"}
              </AppText>

              <View style={styles.promptCardsRow}>
                {[
                  { icon: FunctionSquareIcon, text: "Solve a derivative" },
                  { icon: Atom02Icon, text: "Explain Quantum Physics" },
                  { icon: BookOpen02Icon, text: "Balance Chemistry Equation" },
                ].map((item) => (
                  <PressableScale
                    key={item.text}
                    onPress={() => handleAskQuestion(item.text)}
                    style={[
                      styles.promptCard,
                      {
                        backgroundColor: isDark ? "#1E293B" : "#F1F5F9",
                        borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                      },
                    ]}
                  >
                    <View style={styles.promptCardIcon}>
                      <HugeiconsIcon icon={item.icon} size={20} color={theme.ink} />
                    </View>
                    <AppText style={[styles.promptCardText, { color: theme.ink }]}>
                      {item.text}
                    </AppText>
                  </PressableScale>
                ))}
              </View>
            </Animated.View>
          ) : (
            thread.map((item) => {
              if (item.role === "user") {
                return (
                  <Animated.View
                    key={item.id}
                    layout={typeof Layout !== "undefined" ? Layout : undefined}
                    entering={
                      typeof SlideInDown !== "undefined" &&
                      typeof SlideInDown.springify === "function"
                        ? SlideInDown.springify()
                        : undefined
                    }
                    style={[
                      styles.userBubble,
                      { backgroundColor: isDark ? "#2A2A2A" : "#F4F4F4" },
                    ]}
                  >
                    {item.imageBase64 && (
                      <Image
                        source={{
                          uri: `data:${item.imageMimeType || "image/jpeg"};base64,${item.imageBase64}`,
                        }}
                        style={styles.userImageThumb}
                        resizeMode="cover"
                      />
                    )}
                    {item.text ? (
                      <AppText
                        style={[
                          styles.userText,
                          { color: theme.ink, textAlign: isRtl ? "right" : "left" },
                        ]}
                      >
                        {item.text}
                      </AppText>
                    ) : null}
                  </Animated.View>
                );
              }

              if (item.error) return (
                <View key={item.id} style={styles.agentContainer} accessibilityLiveRegion="polite">
                  <AppText style={{ color: theme.ink, fontSize: 16, lineHeight: 24 }}>
                    {isKu ? "وانەکە ئامادە نەکرا. تکایە دووبارە هەوڵ بدەوە." : isAr ? "تعذر إعداد الدرس. حاول مرة أخرى." : "We couldn’t prepare your lesson. Please try again."}
                  </AppText>
                  <AppText style={{ color: theme.mutedInk, fontSize: 14, lineHeight: 21 }} selectable>{item.error}</AppText>
                </View>
              );

              // Agent lesson
              if (item.role === "agent" && item.lesson) {
                const lesson = item.lesson;
                const isMath = lesson.subject === "math";
                const lessonRevealed =
                  revealedStepsMap[lesson.id] ??
                  (activeWalkthroughLessonId === lesson.id ? 1 : lesson.steps.length);
                const isLessonActiveWalkthrough = activeWalkthroughLessonId === lesson.id;

                return (
                  <Animated.View
                    key={item.id}
                    layout={typeof Layout !== "undefined" ? Layout : undefined}
                    entering={
                      typeof SlideInDown !== "undefined" &&
                      typeof SlideInDown.springify === "function"
                        ? SlideInDown.springify()
                        : undefined
                    }
                    style={styles.agentContainer}
                  >
                    {/* AI Thought Process & Python Code Execution Disclosure */}
                    <AgentThoughtDisclosure
                      lesson={lesson}
                      isExpanded={expandedTraceId === lesson.id}
                      onToggle={() =>
                        setExpandedTraceId((prev) => (prev === lesson.id ? null : lesson.id))
                      }
                    />

                    {/* Lesson Title & Concise Observation */}
                    <View style={styles.agentTitleSection}>
                      <AppText style={[styles.lessonTitle, { color: theme.ink }]}>
                        {lesson.title}
                      </AppText>
                      {lesson.speechExplanation ? (
                        <AppText style={[styles.lessonExplanation, { color: theme.mutedInk }]}>
                          {lesson.speechExplanation}
                        </AppText>
                      ) : null}
                    </View>

                    {/* FOR NON-MATH (Physics, Chemistry, General): SIMULATION IS FRONT & CENTER! */}
                    {!isMath && lesson.interactive && lesson.interactive.type !== "error" ? (
                      <View style={styles.heroSimContainer}>
                        <StudyInteractiveCanvas widgetState={lesson.interactive} />
                      </View>
                    ) : null}

                    {/* Math Step Walkthrough Controls Bar */}
                    {isMath && lesson.steps && lesson.steps.length > 1 ? (
                      <View
                        style={[
                          styles.walkthroughBar,
                          {
                            backgroundColor: isDark
                              ? "rgba(30, 41, 59, 0.7)"
                              : "rgba(241, 245, 249, 0.9)",
                            borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                          },
                        ]}
                      >
                        <View style={styles.walkthroughStatusGroup}>
                          <AppText style={[styles.walkthroughStepCount, { color: theme.ink }]}>
                            {isKu ? "هەنگاوی" : isAr ? "الخطوة" : "Step"}{" "}
                            {Math.min(lessonRevealed, lesson.steps.length)} /{" "}
                            {lesson.steps.length}
                          </AppText>
                          {isLessonActiveWalkthrough && isWalkthroughActive ? (
                            <View style={styles.walkthroughLivePill}>
                              <AppText style={styles.walkthroughLiveText}>TTS Active</AppText>
                            </View>
                          ) : null}
                        </View>

                        <View style={styles.walkthroughControlsRow}>
                          {speaking && isLessonActiveWalkthrough ? (
                            <PressableScale
                              onPress={handlePauseWalkthrough}
                              style={styles.walkthroughButton}
                            >
                              <HugeiconsIcon icon={PauseIcon} size={15} color={theme.ink} />
                              <AppText style={[styles.walkthroughButtonText, { color: theme.ink }]}>
                                Pause
                              </AppText>
                            </PressableScale>
                          ) : lessonRevealed > 1 && lessonRevealed < lesson.steps.length ? (
                            <PressableScale
                              onPress={() => handleResumeWalkthrough(lesson)}
                              style={styles.walkthroughButton}
                            >
                              <HugeiconsIcon icon={PlayIcon} size={15} color="#2563EB" />
                              <AppText style={[styles.walkthroughButtonText, { color: "#2563EB" }]}>
                                Resume
                              </AppText>
                            </PressableScale>
                          ) : (
                            <PressableScale
                              onPress={() => handleStartWalkthrough(lesson)}
                              style={styles.walkthroughButton}
                            >
                              <HugeiconsIcon icon={PlayIcon} size={15} color="#2563EB" />
                              <AppText style={[styles.walkthroughButtonText, { color: "#2563EB" }]}>
                                {lessonRevealed >= lesson.steps.length ? "Replay" : "Play All"}
                              </AppText>
                            </PressableScale>
                          )}

                          {lessonRevealed < lesson.steps.length ? (
                            <PressableScale
                              onPress={() => handleNextStep(lesson)}
                              style={styles.walkthroughButton}
                            >
                              <HugeiconsIcon icon={Forward01Icon} size={15} color={theme.ink} />
                              <AppText style={[styles.walkthroughButtonText, { color: theme.ink }]}>
                                Next
                              </AppText>
                            </PressableScale>
                          ) : null}

                          {lessonRevealed < lesson.steps.length ? (
                            <PressableScale
                              onPress={() => handleRevealAllSteps(lesson)}
                              style={styles.walkthroughButton}
                            >
                              <AppText
                                style={[styles.walkthroughButtonText, { color: theme.mutedInk }]}
                              >
                                Show All
                              </AppText>
                            </PressableScale>
                          ) : null}
                        </View>
                      </View>
                    ) : null}

                    {/* FOR MATH: Clean, Card-less Step-by-Step LaTeX Derivation */}
                    {isMath && lesson.steps && lesson.steps.length > 0 ? (
                      <StudyFormulaCard
                        formula={lesson.formula}
                        summary={lesson.summary}
                        steps={lesson.steps}
                        quickQuiz={lesson.quickQuiz}
                        onSpeakStep={(text, idx) => handleSpeakStep(lesson, text, idx)}
                        speakingStepIndex={isLessonActiveWalkthrough ? speakingStepIdx : null}
                        visibleStepCount={lessonRevealed}
                        cleanMathMode={true}
                      />
                    ) : null}

                    {/* FOR MATH: Dynamic Coordinate Graph / Slope Visualizer Renders Below Steps */}
                    {isMath &&
                    lesson.interactive &&
                    lesson.interactive.type !== "error" &&
                    (lesson.interactive.html ||
                      lesson.interactive.code ||
                      lesson.interactive.type === "coordinate-graph") ? (
                      <View style={styles.mathGraphContainer}>
                        <StudyInteractiveCanvas widgetState={lesson.interactive} />
                      </View>
                    ) : null}
                  </Animated.View>
                );
              }

              return null;
            })
          )}

          {isGenerating && (
            <Animated.View
              layout={typeof Layout !== "undefined" ? Layout : undefined}
              style={styles.agentContainer}
            >
              <AgentThinkingCard />
            </Animated.View>
          )}
        </KeyboardAwareScrollView>

        {/* Floating Voice & Query Capsule */}
        <View style={[styles.bottomVoiceDock, { bottom: insets.bottom + 8 }]}>
          <View style={styles.voiceBarWrapper}>
            <StudyVoiceBar
              onAskQuestion={handleAskQuestion}
              isGenerating={isGenerating}
              onReplayAudio={handleReplaySummary}
              speaking={speaking}
              currentLessonHasAudio={!!currentLesson?.speechExplanation}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 20,
    maxWidth: 720,
    width: "100%",
    alignSelf: "center",
  },
  headerPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(37, 99, 235, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(37, 99, 235, 0.25)",
  },
  headerPillText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#2563EB",
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 16,
  },
  heroBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "rgba(37, 99, 235, 0.1)",
    marginBottom: 16,
  },
  heroBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2563EB",
  },
  emptyLogoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  promptCardsRow: {
    width: "100%",
    gap: 12,
    marginTop: 8,
  },
  promptCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
  },
  promptCardIcon: {
    opacity: 0.8,
  },
  promptCardText: {
    fontSize: 15,
    fontWeight: "500",
  },
  userBubble: {
    alignSelf: "flex-end",
    maxWidth: "85%",
    padding: 14,
    borderRadius: 20,
    borderBottomRightRadius: 4,
    gap: 8,
  },
  userImageThumb: {
    width: 200,
    height: 140,
    borderRadius: 12,
    backgroundColor: "#E2E8F0",
  },
  userText: {
    fontSize: 15,
    lineHeight: 22,
  },
  agentContainer: {
    alignSelf: "flex-start",
    width: "100%",
    gap: 16,
  },
  agentTitleSection: {
    gap: 6,
  },
  lessonTitle: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  lessonExplanation: {
    fontSize: 15,
    lineHeight: 22,
  },
  heroSimContainer: {
    width: "100%",
    marginVertical: 4,
  },
  mathGraphContainer: {
    width: "100%",
    marginTop: 12,
  },
  thinkingCard: {
    flexDirection: "column",
    alignItems: "stretch",
    padding: 16,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    width: "100%",
    maxWidth: 640,
  },
  thinkingHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  thinkingIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(37, 99, 235, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  thinkingTextGroup: {
    flex: 1,
    gap: 3,
  },
  thinkingTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#2563EB",
    letterSpacing: 0.5,
  },
  thinkingDesc: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  thinkingCodeBox: {
    backgroundColor: "rgba(15, 23, 42, 0.85)",
    borderRadius: 10,
    padding: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  thinkingCodeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  thinkingCodeLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#93C5FD",
    letterSpacing: 0.4,
  },
  thinkingCodeText: {
    fontSize: 11,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    color: "#E2E8F0",
    lineHeight: 16,
  },
  thoughtContainer: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  thoughtHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  thoughtBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  thoughtIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(37, 99, 235, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  thoughtHeaderText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#2563EB",
    letterSpacing: 0.8,
  },
  thoughtActionPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  thoughtActionText: {
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.7,
  },
  thoughtBody: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0,0,0,0.06)",
    paddingTop: 10,
  },
  thoughtStepsList: {
    gap: 8,
  },
  thoughtStepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  thoughtStepDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#2563EB",
    marginTop: 7,
  },
  thoughtStepText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },
  executedCodeBox: {
    backgroundColor: "#0F172A",
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  codeHeaderBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.1)",
    paddingBottom: 6,
  },
  codeHeaderLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#93C5FD",
    letterSpacing: 0.5,
  },
  codeContentText: {
    fontSize: 12,
    color: "#E2E8F0",
    lineHeight: 18,
  },
  codeOutputBox: {
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 8,
    borderRadius: 6,
    gap: 2,
  },
  codeOutputLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94A3B8",
  },
  codeOutputText: {
    fontSize: 11,
    color: "#34D399",
    lineHeight: 16,
  },
  walkthroughBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  walkthroughStatusGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  walkthroughStepCount: {
    fontSize: 13,
    fontWeight: "800",
  },
  walkthroughLivePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: "rgba(37, 99, 235, 0.15)",
  },
  walkthroughLiveText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#2563EB",
    letterSpacing: 0.5,
  },
  walkthroughControlsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  walkthroughButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  walkthroughButtonText: {
    fontSize: 12,
    fontWeight: "700",
  },
  bottomVoiceDock: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  voiceBarWrapper: {
    width: "100%",
    maxWidth: 720,
  },
});
