/**
 * LessonScreen — Duolingo-faithful engine, iOS 26 Liquid Glass shell.
 *
 *   1. Glass header (close pill, progress bar, hearts pill)
 *   2. Game body (frosted cards, glass options)
 *   3. Bottom feedback sheet — frosted glass with tinted accent
 */
/* eslint-disable react-hooks/exhaustive-deps */

// @ts-expect-error No type declarations for hugeicons cjs paths
import { HugeiconsIcon } from "@hugeicons/react-native/dist/cjs/index.js";
// @ts-expect-error No type declarations for hugeicons cjs paths
import { Cancel01Icon, FlashIcon, CheckmarkCircle02Icon, Fire02Icon } from "@hugeicons/core-free-icons/dist/cjs/index.js";
import { AppText } from "../../components/ui/AppText";
import { TwinoMascot } from "../../components/mascot/TwinoMascot";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
    BackHandler,
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Animated, {
    Easing,
    FadeInUp,
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    useAnimatedProps,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import Svg, { Circle } from "react-native-svg";

import { GameQuestion, getLessonQuestions, type LessonPathMode } from "../../data/lesson-content";
import { useI18n } from "../../hooks/useI18n";
import { useProgressStore, getCurrentProgress } from "../../stores/useProgressStore";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { useLocaleStore } from "../../stores/useLocaleStore";
import { useThemeColors } from "../../hooks/useThemeColors";
import type { AnswerTier } from "../../utils/answer-tier";
import { tierFeedbackKey, tierLabelKey } from "../../utils/answer-tier";
import { getCurrentLessonMeta, buildPathReturnRoute, buildLessonRouteForMode } from "../../utils/lesson-navigation";
import { enterGame } from "./games/game-motion";
import ConversationPickGame from "./games/ConversationPickGame";
import FillBlankGame from "./games/FillBlankGame";
import { G } from "./games/game-design";
import { L } from "./games/lesson-light-design";
import {
  LessonLightHeader,
  LessonLiquidFeedback,
  LessonMeshBackdrop,
  KidsLessonBackdrop,
} from "./games/lesson-light-primitives";
import { HomeLiquidButton, HomeLiquidCard } from "../../components/ui/ios-liquid-home";
import MultipleChoiceGame from "./games/MultipleChoiceGame";
import PairMatchGame from "./games/PairMatchGame";
import SentenceBuilderGame from "./games/SentenceBuilderGame";
import VoiceGame from "./games/VoiceGame";
import PictureMatchGame from "./games/PictureMatchGame";
import ImageMultipleChoiceGame from "./games/ImageMultipleChoiceGame";
import MemoryFlipGame from "./games/MemoryFlipGame";
import ParagraphSpeechGame from "./games/ParagraphSpeechGame";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const MAX_HEARTS = 5;
const SHEET_H = 280;

/* Summary stat card */
function StatCard({
  icon, label, value, color, delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  delay?: number;
}) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(600).springify()} style={{ flex: 1 }}>
      <HomeLiquidCard contentStyle={sSum.statCard} radius={18}>
        {icon}
        <Text style={[sSum.statValue, { color }]}>{value}</Text>
        <Text style={sSum.statLabel}>{label}</Text>
      </HomeLiquidCard>
    </Animated.View>
  );
}

export default function LessonScreen() {
  const { t } = useI18n();
  const { colors } = useThemeColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const lessonId = parseInt(params.id as string) || 0;
  const displayUnitNumber =
    parseInt((Array.isArray(params.du) ? params.du[0] : params.du) as string) ||
    lessonId + 1;
  const lessonIndex = parseInt(params.li as string) || 0;
  const startQuestion = parseInt(
    (Array.isArray(params.q) ? params.q[0] : params.q) as string,
  ) || 0;
  const rawMode = (Array.isArray(params.mode) ? params.mode[0] : params.mode);
  const pathMode: LessonPathMode =
    rawMode === "normal" ? "normal" : rawMode === "kids" ? "kids" : "street";
  const isKidsMode = pathMode === "kids";
  const pathIndex = parseInt(
    (Array.isArray(params.pi) ? params.pi[0] : params.pi) as string,
  );
  const fromPath = (Array.isArray(params.fromPath) ? params.fromPath[0] : params.fromPath) === "true";
  const recordLessonComplete = useProgressStore((s) => s.recordLessonComplete);
  const requestPathScrollAfterLesson = useProgressStore(
    (s) => s.requestPathScrollAfterLesson,
  );
  const setPathMode = useSettingsStore((s) => s.setPathMode);

  const questions = React.useMemo(
    () => getLessonQuestions(lessonId, lessonIndex, pathMode),
    [lessonId, lessonIndex, pathMode],
  );

  const [current, setCurrent] = useState(0);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [xp, setXp] = useState(0);
  const [correctN, setCorrectN] = useState(0);
  const [finished, setFinished] = useState(false);
  const [passed, setPassed] = useState(false);
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    tier?: AnswerTier;
    explanation?: string;
  } | null>(null);

  const nextRef = useRef(0);

  const accuracyValue = useSharedValue(0);

  React.useEffect(() => {
    if (finished) {
      if (Platform.OS !== "web") {
        if (passed) {
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        } else {
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
        }
      }

      if (passed) {
        accuracyValue.value = 0;
        accuracyValue.value = withTiming(correctN / Math.max(1, questions.length), {
          duration: 1200,
          easing: Easing.out(Easing.quad),
        });
      }
    }
  }, [finished, passed, correctN, questions.length]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = 226.19 * (1 - accuracyValue.value);
    return {
      strokeDashoffset,
    };
  });

  const exitToPath = useCallback(() => {
    setPathMode(pathMode);
    if (fromPath && router.canGoBack()) {
      router.back();
    } else {
      router.replace(buildPathReturnRoute(pathMode));
    }
  }, [fromPath, pathMode, router, setPathMode]);

  /* Animations */
  const progressW = useSharedValue(0);
  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressW.value * 100}%` as any,
  }));

  const xpSc = useSharedValue(1);
  const sheetY = useSharedValue(SHEET_H + insets.bottom);
  const sheetScale = useSharedValue(0.94);
  const sheetOpacity = useSharedValue(0);

  const sheetStyle = useAnimatedStyle(() => ({
    opacity: sheetOpacity.value,
    transform: [
      { translateY: sheetY.value },
      { scale: sheetScale.value },
    ],
  }));

  /* Reset on focus */
  /* Reset and initialize lesson state whenever parameters or questions change */
  React.useEffect(() => {
    if (questions.length === 0) return;
    const safeStart = Math.min(
      Math.max(0, startQuestion),
      Math.max(0, questions.length - 1),
    );
    setCurrent(safeStart);
    setHearts(MAX_HEARTS);
    setXp(0);
    // Smooth entry animation: start at 0 and animate to initial progress with small visible minimum
    progressW.value = 0;
    const startVal = safeStart === 0 ? 0.05 : safeStart / questions.length;
    progressW.value = withTiming(startVal, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
    setCorrectN(0);
    setFinished(false);
    setPassed(false);
    setFeedback(null);
    nextRef.current = 0;
    xpSc.value = 1;
    sheetY.value = SHEET_H + insets.bottom;
    sheetScale.value = 0.94;
    sheetOpacity.value = 0;
  }, [lessonId, lessonIndex, pathMode, questions.length, startQuestion, insets.bottom]);

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        exitToPath();
        return true;
      });
      return () => sub.remove();
    }, [exitToPath]),
  );

  const handleAnswer = useCallback(
    (correct: boolean | "skip", explanation?: string, tier?: AnswerTier) => {
      const q = questions[current];
      if (!q) return;

      const isConversationPick = q.type === "conversation_pick";

      if (correct === true) {
        xpSc.value = withSequence(
          withTiming(1.4, { duration: 90, easing: Easing.out(Easing.cubic) }),
          withTiming(1.0, { duration: 160, easing: Easing.out(Easing.cubic) }),
        );
        const xpGain =
          isConversationPick && tier === "good" ? Math.round(q.xp * 0.85) : q.xp;
        setXp(v => v + xpGain);
        setCorrectN(v => v + 1);
      } else if (correct === false || correct === "skip") {
        if (correct === false) {
          const newH = Math.max(0, hearts - 1);
          setHearts(newH);
          if (newH === 0) {
            setPassed(false);
            setFinished(true);
            return;
          }
        }
      }

      const next = current + 1;
      nextRef.current = next;
      // Animate smoothly to end (100% / 1.0) on the last question, maintaining a small minimum otherwise
      const nextVal = next >= questions.length ? 1.0 : Math.max(0.05, next / questions.length);
      progressW.value = withTiming(nextVal, {
        duration: 420,
        easing: Easing.out(Easing.cubic),
      });

      setFeedback({
        correct: correct === "skip" ? false : correct,
        tier: isConversationPick ? tier : undefined,
        explanation,
      });
      sheetY.value = withTiming(0, {
        duration: 220,
        easing: Easing.out(Easing.cubic),
      });
      sheetScale.value = withTiming(1, {
        duration: 220,
        easing: Easing.out(Easing.cubic),
      });
      sheetOpacity.value = withTiming(1, { duration: 160 });
    },
    [current, hearts, questions],
  );

  const continueToNext = useCallback(() => {
    sheetY.value = withTiming(SHEET_H + insets.bottom, {
      duration: 220,
      easing: Easing.in(Easing.quad),
    });
    sheetScale.value = withTiming(0.94, { duration: 220 });
    sheetOpacity.value = withTiming(0, { duration: 180 });
    setTimeout(() => {
      setFeedback(null);
      const next = nextRef.current;
      if (next >= questions.length) {
        setPassed(true);
        setFinished(true);
      } else {
        setCurrent(next);
      }
    }, 260);
  }, [questions.length, insets.bottom]);

  const renderGame = (q: GameQuestion) => {
    const shared = { onAnswer: handleAnswer, pathMode, questionIndex: current, totalQuestions: questions.length };
    const key = q.type;
    switch (q.type) {
      case "multiple_choice":     return <MultipleChoiceGame       key={key} {...shared} question={q} />;
      case "pair_match":          return <PairMatchGame            key={key} {...shared} question={q} />;
      case "sentence_builder":    return <SentenceBuilderGame      key={key} {...shared} question={q} />;
      case "voice":               return <VoiceGame                key={key} {...shared} question={q} />;
      case "fill_blank":          return <FillBlankGame            key={key} {...shared} question={q} />;
      case "conversation_pick":   return <ConversationPickGame     key={key} {...shared} question={q} />;
      case "image_pair_match":    return <PictureMatchGame         key={key} {...shared} question={q} />;
      case "image_multiple_choice": return <ImageMultipleChoiceGame key={key} {...shared} question={q} />;
      case "memory_flip":         return <MemoryFlipGame           key={key} {...shared} question={q} />;
      case "paragraph_speech":    return <ParagraphSpeechGame      key={key} {...shared} question={q} />;
      default:                    return null;
    }
  };
  if (questions.length === 0) {
    return (
      <SafeAreaView style={[sSum.root, { backgroundColor: colors.background, justifyContent: "center", alignItems: "center", padding: 24 }]}>
        <StatusBar hidden />
        <Text style={{ fontSize: 18, fontWeight: "700", color: colors.mutedForeground, textAlign: "center", marginBottom: 16 }}>
          No questions available for this lesson yet.
        </Text>
        <HomeLiquidButton label="Go Back" onPress={exitToPath} />
      </SafeAreaView>
    );
  }

  /* ─────── SUMMARY SCREEN ─────── */
  if (finished) {
    const ok = passed;
    const SummaryBackdrop = isKidsMode ? KidsLessonBackdrop : LessonMeshBackdrop;
    return (
      <SummaryBackdrop>
        <StatusBar hidden />
        <SafeAreaView style={sSum.root}>
          <Animated.View entering={FadeInUp.duration(340)} style={sSum.wrap}>
            <HomeLiquidCard contentStyle={sSum.heroCard} radius={28}>
              {ok ? (
                <View style={sSum.mascotWrap}>
                  <TwinoMascot size={120} pose="party" />
                </View>
              ) : (
                <View style={[sSum.iconWrap, { backgroundColor: isKidsMode ? "#FF4B4B" : L.red }]}>
                  <HugeiconsIcon icon={Cancel01Icon} size={52} color="#FFFFFF" />
                </View>
              )}
              <AppText style={[sSum.title, { color: ok ? (isKidsMode ? "#3C8400" : L.greenDeep) : (isKidsMode ? "#CC0000" : L.redDeep) }]}>
                {ok ? "Lesson Complete!" : "Out of Hearts!"}
              </AppText>
              <AppText style={sSum.sub}>
                {ok ? "Impressive! You're on a roll 🔥" : "Don't give up — try again!"}
              </AppText>

              {ok ? (
                <Animated.View entering={FadeInDown.delay(100).duration(600).springify()} style={{ alignItems: "center", marginTop: 12 }}>
                  <View style={{ position: "relative", width: 90, height: 90, justifyContent: "center", alignItems: "center" }}>
                    <Svg width={90} height={90} viewBox="0 0 90 90" style={{ position: "absolute", top: 0, left: 0 }}>
                      <Circle
                        cx="45"
                        cy="45"
                        r={36}
                        stroke="rgba(0, 0, 0, 0.05)"
                        strokeWidth="8"
                        fill="none"
                      />
                      <AnimatedCircle
                        cx="45"
                        cy="45"
                        r={36}
                        stroke={isKidsMode ? "#58CC02" : "#10B981"}
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray="226.19 226.19"
                        animatedProps={animatedProps}
                        transform="rotate(-90 45 45)"
                      />
                    </Svg>
                    <AppText style={{ fontSize: 18, color: isKidsMode ? "#3C8400" : "#0F172A", fontFamily: "DINNextRoundedBold" }} forceLatinFont latinRole="bold">
                      {Math.round((correctN / Math.max(1, questions.length)) * 100)}%
                    </AppText>
                  </View>
                  <AppText style={{ fontSize: 11, color: L.gray, marginTop: 6, textTransform: "uppercase", letterSpacing: 0.8 }} forceLatinFont latinRole="bold">
                    Accuracy Rate
                  </AppText>
                </Animated.View>
              ) : null}
            </HomeLiquidCard>

            {ok ? (
              <View style={sSum.statsRow}>
                <StatCard icon={<HugeiconsIcon icon={FlashIcon} size={26} color={L.gold} />} label="XP" value={`+${xp}`} color={L.gold} delay={200} />
                <StatCard icon={<HugeiconsIcon icon={CheckmarkCircle02Icon} size={26} color={isKidsMode ? "#58CC02" : L.green} />} label="Correct" value={`${correctN}/${questions.length}`} color={isKidsMode ? "#3C8400" : L.green} delay={350} />
                <StatCard icon={<HugeiconsIcon icon={Fire02Icon} size={26} color={isKidsMode ? "#FF4B4B" : L.red} />} label="Hearts" value={`${hearts}/${MAX_HEARTS}`} color={isKidsMode ? "#CC0000" : L.red} delay={500} />
              </View>
            ) : null}

            <HomeLiquidButton
              label={ok ? "Continue" : "Try Again"}
              color={ok ? (isKidsMode ? "#58CC02" : L.green) : (isKidsMode ? "#1CB0F6" : L.blue)}
              onPress={() => {
                if (ok && !Number.isNaN(pathIndex)) {
                  const currentProgress = getCurrentProgress();
                  const locale = useLocaleStore.getState().locale;
                  const meta = getCurrentLessonMeta(
                    pathMode,
                    currentProgress.nextLessonPathIndex,
                    currentProgress.normalNextLessonPathIndex,
                    locale,
                    currentProgress.kidsNextLessonPathIndex,
                  );
                  const label =
                    meta?.pathIndex === pathIndex
                      ? `${meta.sectionTitle} · ${meta.lessonNumber}`
                      : `Lesson ${pathIndex + 1}`;
                  recordLessonComplete(pathIndex, xp, pathMode, label);
                  requestPathScrollAfterLesson(pathMode);
                  exitToPath();
                  return;
                }
                if (!ok) {
                  setFinished(false);
                  setPassed(false);
                  setCurrent(0);
                  setHearts(MAX_HEARTS);
                  setXp(0);
                  setCorrectN(0);
                  setFeedback(null);
                  progressW.value = 0;
                  return;
                }
                exitToPath();
              }}
            />

            {ok && (
              <Animated.View entering={FadeInDown.delay(600).duration(400)} style={{ width: "100%" }}>
                <Pressable
                  onPress={() => {
                    // Record completion first
                    if (!Number.isNaN(pathIndex)) {
                      const currentProgress = getCurrentProgress();
                      const locale = useLocaleStore.getState().locale;
                      const meta = getCurrentLessonMeta(
                        pathMode,
                        currentProgress.nextLessonPathIndex,
                        currentProgress.normalNextLessonPathIndex,
                        locale,
                        currentProgress.kidsNextLessonPathIndex,
                      );
                      const label =
                        meta?.pathIndex === pathIndex
                          ? `${meta.sectionTitle} · ${meta.lessonNumber}`
                          : `Lesson ${pathIndex + 1}`;
                      recordLessonComplete(pathIndex, xp, pathMode, label);
                      requestPathScrollAfterLesson(pathMode);
                    }
                    // Build next lesson route from updated progress
                    const updatedProgress = getCurrentProgress();
                    const nextRoute = buildLessonRouteForMode(
                      pathMode,
                      updatedProgress.nextLessonPathIndex,
                      updatedProgress.normalNextLessonPathIndex,
                      updatedProgress.kidsNextLessonPathIndex,
                    );
                    if (nextRoute) {
                      setPathMode(pathMode);
                      router.replace(nextRoute);
                    } else {
                      // No more lessons — go back to path
                      exitToPath();
                    }
                  }}
                  style={({ pressed }) => ({
                    width: "100%",
                    paddingVertical: 16,
                    borderRadius: 18,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: pressed ? "rgba(0,0,0,0.04)" : "transparent",
                    borderWidth: 2,
                    borderColor: isKidsMode ? "#58CC02" : L.green,
                    marginTop: 8,
                  })}
                >
                  <AppText
                    style={{
                      color: isKidsMode ? "#3C8400" : L.greenDeep,
                      fontSize: 16,
                      fontWeight: "800",
                      fontFamily: "DINNextRoundedBold",
                      letterSpacing: 0.4,
                    }}
                    forceLatinFont
                    latinRole="bold"
                  >
                    Next Lesson →
                  </AppText>
                </Pressable>
              </Animated.View>
            )}
          </Animated.View>
        </SafeAreaView>
      </SummaryBackdrop>
    );
  }

  /* ─────── ACTIVE GAME SCREEN ─────── */
  const isCorrect = feedback?.correct === true;
  const Backdrop = isKidsMode ? KidsLessonBackdrop : LessonMeshBackdrop;
  const isConversationPick = questions[current]?.type === "conversation_pick";
  const feedbackTier = isConversationPick ? feedback?.tier : undefined;
  const feedbackTitle = feedbackTier
    ? t(tierLabelKey(feedbackTier))
    : isCorrect
      ? t("lessons.feedbackCorrect")
      : t("lessons.feedbackIncorrect");
  const feedbackSubtitle = feedback?.explanation
    ? feedback.explanation
    : feedbackTier
      ? t(tierFeedbackKey(feedbackTier))
      : isCorrect
        ? t("lessons.feedbackCorrectSub")
        : t("lessons.feedbackIncorrectSub");
  return (
    <Backdrop>
      <StatusBar hidden />
      <View style={[sL.root, { paddingTop: insets.top }]}>
        <LessonLightHeader
          progressFillStyle={progressStyle}
          hearts={hearts}
          onBack={exitToPath}
          unitNumber={displayUnitNumber}
          lessonNumber={lessonIndex + 1}
          variant={isKidsMode ? "kids" : "default"}
        />

        <View style={[sL.gameArea, { paddingBottom: Math.max(insets.bottom, isKidsMode ? 20 : 12) }]}>
          <Animated.View
            entering={enterGame}
            style={{ flex: 1 }}
          >
            {renderGame(questions[current]!)}
          </Animated.View>
        </View>

        {feedback !== null && (
          <Animated.View
            style={[
              sL.sheet,
              { paddingBottom: Math.max(insets.bottom, 16) + 8 },
              sheetStyle,
            ]}
          >
            <LessonLiquidFeedback
              correct={isCorrect}
              tier={feedbackTier}
              title={feedbackTitle}
              subtitle={feedbackSubtitle}
              buttonLabel={t("common.continue")}
              onContinue={continueToNext}
              variant={isKidsMode ? "kids" : "default"}
            />
          </Animated.View>
        )}
      </View>
    </Backdrop>
  );
}

/* ─── styles ─── */
const sL = StyleSheet.create({
  root: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
    gap: 12,
  },
  progressOuter: {
    flex: 1,
  },
  progressTrack: {
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(8,16,32,0.45)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    overflow: "hidden",
    padding: 2,
  },
  progressFillWrap: {
    height: "100%",
    borderRadius: 5,
    overflow: "hidden",
  },
  heartsText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },

  gameArea: { flex: 1 },

  skipRow: {
    alignItems: "flex-end",
    paddingHorizontal: 18,
    marginTop: -8,
    marginBottom: 4,
  },
  skipButton: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.86)",
    borderWidth: 1,
    borderColor: "rgba(43,89,243,0.14)",
    shadowColor: L.blue,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  skipPressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  skipDisabled: { opacity: 0.45 },
  skipText: {
    color: L.blue,
    fontSize: 13,
    fontWeight: "800",
    fontFamily: "DINNextRoundedBold",
  },

  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
});

const sSum = StyleSheet.create({
  root: { flex: 1 },
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 14,
  },
  mascotWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  iconWrap: {
    width: 100,
    height: 100,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  title: { fontSize: 28, fontWeight: "900", textAlign: "center" },
  sub: {
    fontSize: 16,
    color: L.gray,
    textAlign: "center",
    fontFamily: "DINNextRoundedMedium",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    marginTop: 8,
  },
  heroCard: {
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 20,
    gap: 10,
  },
  statCard: {
    alignItems: "center",
    paddingVertical: 16,
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    fontFamily: "DINNextRoundedBold",
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: L.gray,
    fontFamily: "DINNextRoundedMedium",
  },
});

