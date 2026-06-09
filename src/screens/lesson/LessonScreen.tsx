/**
 * LessonScreen — Duolingo-faithful engine, iOS 26 Liquid Glass shell.
 *
 *   1. Glass header (close pill, progress bar, hearts pill)
 *   2. Game body (frosted cards, glass options)
 *   3. Bottom feedback sheet — frosted glass with tinted accent
 */
/* eslint-disable react-hooks/immutability, react-hooks/exhaustive-deps */

import {
    Icon3DCheck,
    Icon3DFire,
    Icon3DX,
    Icon3DZap,
} from "../../components/icons/Icon3D";
import { AppText } from "../../components/ui/AppText";
import { PingoMascot } from "../../components/mascot/PingoMascot";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
    BackHandler,
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
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GameQuestion, getLessonQuestions, type LessonPathMode } from "../../data/lesson-content";
import { useI18n } from "../../hooks/useI18n";
import { useProgressStore } from "../../stores/useProgressStore";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { useLocaleStore } from "../../stores/useLocaleStore";
import { useContentAdminStore } from "../../stores/useContentAdminStore";
import type { AnswerTier } from "../../utils/answer-tier";
import { tierFeedbackKey, tierLabelKey } from "../../utils/answer-tier";
import { getCurrentLessonMeta, buildPathReturnRoute } from "../../utils/lesson-navigation";
import { enterGame } from "./games/game-motion";
import ConversationPickGame from "./games/ConversationPickGame";
import FillBlankGame from "./games/FillBlankGame";
import { G } from "./games/game-design";
import { L } from "./games/lesson-light-design";
import {
  LessonLightHeader,
  LessonLiquidFeedback,
  LessonMeshBackdrop,
} from "./games/lesson-light-primitives";
import { HomeLiquidButton, HomeLiquidCard } from "../../components/ui/ios-liquid-home";
import MultipleChoiceGame from "./games/MultipleChoiceGame";
import PairMatchGame from "./games/PairMatchGame";
import SentenceBuilderGame from "./games/SentenceBuilderGame";
import VoiceGame from "./games/VoiceGame";
import KidsPlayGame from "./games/KidsPlayGame";

const MAX_HEARTS = 5;
const SHEET_H = 280;

/* Summary stat card */
function StatCard({
  icon, label, value, color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  delay?: number;
}) {
  return (
    <View style={{ flex: 1 }}>
      <HomeLiquidCard contentStyle={sSum.statCard} radius={18}>
        {icon}
        <Text style={[sSum.statValue, { color }]}>{value}</Text>
        <Text style={sSum.statLabel}>{label}</Text>
      </HomeLiquidCard>
    </View>
  );
}

export default function LessonScreen() {
  const { t } = useI18n();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const lessonId = parseInt(params.id as string) || 0;
  const lessonIndex = parseInt(params.li as string) || 0;
  const startQuestion = parseInt(
    (Array.isArray(params.q) ? params.q[0] : params.q) as string,
  ) || 0;
  const rawMode = (Array.isArray(params.mode) ? params.mode[0] : params.mode);
  const pathMode: LessonPathMode =
    rawMode === "normal" ? "normal" : rawMode === "kids" ? "kids" : "street";
  const pathIndex = parseInt(
    (Array.isArray(params.pi) ? params.pi[0] : params.pi) as string,
  );
  const recordLessonComplete = useProgressStore((s) => s.recordLessonComplete);
  const requestPathScrollAfterLesson = useProgressStore(
    (s) => s.requestPathScrollAfterLesson,
  );
  const setPathMode = useSettingsStore((s) => s.setPathMode);
  const contentOverride = useContentAdminStore((s) => s.overrides[pathMode]);

  const questions = React.useMemo(
    () => getLessonQuestions(lessonId, lessonIndex, pathMode),
    [lessonId, lessonIndex, pathMode, contentOverride],
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

  const exitToPath = useCallback(() => {
    setPathMode(pathMode);
    router.replace(buildPathReturnRoute(pathMode));
  }, [pathMode, router, setPathMode]);

  /* Animations */
  const progressW = useSharedValue(0);
  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressW.value * 100}%` as any,
  }));

  const xpSc = useSharedValue(1);
  const sheetY = useSharedValue(SHEET_H + insets.bottom);
  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: sheetY.value }] }));

  /* Reset on focus */
  useFocusEffect(
    useCallback(() => {
      const safeStart = Math.min(
        Math.max(0, startQuestion),
        Math.max(0, questions.length - 1),
      );
      setCurrent(safeStart);
      setHearts(MAX_HEARTS);
      setXp(0);
      progressW.value = safeStart / Math.max(questions.length, 1);
      setCorrectN(0); setFinished(false); setPassed(false);
      setFeedback(null); nextRef.current = 0;
      xpSc.value = 1;
      sheetY.value = SHEET_H + insets.bottom;
    }, [insets.bottom, startQuestion, questions.length]),
  );

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
      progressW.value = withTiming(next / questions.length, {
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
    },
    [current, hearts, questions],
  );

  const continueToNext = useCallback(() => {
    sheetY.value = withTiming(SHEET_H + insets.bottom, {
      duration: 240, easing: Easing.in(Easing.quad),
    });
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

  const giveUpQuestion = useCallback(() => {
    if (feedback !== null) return;
    handleAnswer("skip", t("lessons.feedbackSkippedSub"));
  }, [feedback, handleAnswer, t]);

  const renderGame = (q: GameQuestion) => {
    const shared = { onAnswer: handleAnswer, pathMode };
    const key = q.type;
    switch (q.type) {
      case "multiple_choice":   return <MultipleChoiceGame   key={key} {...shared} question={q} />;
      case "pair_match":        return <PairMatchGame        key={key} {...shared} question={q} />;
      case "sentence_builder":  return <SentenceBuilderGame  key={key} {...shared} question={q} />;
      case "voice":             return <VoiceGame            key={key} {...shared} question={q} />;
      case "fill_blank":        return <FillBlankGame        key={key} {...shared} question={q} />;
      case "conversation_pick": return <ConversationPickGame key={key} {...shared} question={q} />;
      case "kids_play":         return <KidsPlayGame         key={key} {...shared} question={q} />;
      default:                  return null;
    }
  };
  if (questions.length === 0) {
    return (
      <SafeAreaView style={[sSum.root, { backgroundColor: G.bg, justifyContent: "center", alignItems: "center", padding: 24 }]}>
        <StatusBar hidden />
        <Text style={{ fontSize: 18, fontWeight: "700", color: G.textMid, textAlign: "center", marginBottom: 16 }}>
          No questions available for this lesson yet.
        </Text>
        <HomeLiquidButton label="Go Back" onPress={exitToPath} />
      </SafeAreaView>
    );
  }

  /* ─────── SUMMARY SCREEN ─────── */
  if (finished) {
    const ok = passed;
    return (
      <LessonMeshBackdrop>
        <StatusBar hidden />
        <SafeAreaView style={sSum.root}>
          <Animated.View entering={FadeInUp.duration(340)} style={sSum.wrap}>
            <HomeLiquidCard contentStyle={sSum.heroCard} radius={28}>
              {ok ? (
                <View style={sSum.mascotWrap}>
                  <PingoMascot size={120} pose="party" />
                </View>
              ) : (
                <View style={[sSum.iconWrap, { backgroundColor: L.red }]}>
                  <Icon3DX size={52} />
                </View>
              )}
              <AppText style={[sSum.title, { color: ok ? L.greenDeep : L.redDeep }]}>
                {ok ? "Lesson Complete!" : "Out of Hearts!"}
              </AppText>
              <AppText style={sSum.sub}>
                {ok ? "Impressive! You're on a roll 🔥" : "Don't give up — try again!"}
              </AppText>
            </HomeLiquidCard>

            {ok ? (
              <View style={sSum.statsRow}>
                <StatCard icon={<Icon3DZap size={26} />} label="XP" value={`+${xp}`} color={L.gold} />
                <StatCard icon={<Icon3DCheck size={26} />} label="Correct" value={`${correctN}/${questions.length}`} color={L.green} />
                <StatCard icon={<Icon3DFire size={26} />} label="Hearts" value={`${hearts}/${MAX_HEARTS}`} color={L.red} />
              </View>
            ) : null}

            <HomeLiquidButton
              label={ok ? "Continue" : "Try Again"}
              color={ok ? L.green : L.blue}
              onPress={() => {
                if (ok && !Number.isNaN(pathIndex)) {
                  const snap = useProgressStore.getState();
                  const locale = useLocaleStore.getState().locale;
                  const meta = getCurrentLessonMeta(
                    pathMode,
                    snap.nextLessonPathIndex,
                    snap.normalNextLessonPathIndex,
                    locale,
                    snap.kidsNextLessonPathIndex,
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
          </Animated.View>
        </SafeAreaView>
      </LessonMeshBackdrop>
    );
  }

  /* ─────── ACTIVE GAME SCREEN ─────── */
  const isCorrect = feedback?.correct === true;
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
    <LessonMeshBackdrop>
      <StatusBar hidden />
      <View style={[sL.root, { paddingTop: insets.top }]}>
        <LessonLightHeader
          progressFillStyle={progressStyle}
          hearts={hearts}
          onBack={exitToPath}
          unitNumber={lessonId + 1}
          lessonNumber={lessonIndex + 1}
        />

        <View style={sL.skipRow}>

          <Pressable
            onPress={giveUpQuestion}
            disabled={feedback !== null}
            style={({ pressed }) => [
              sL.skipButton,
              pressed && sL.skipPressed,
              feedback !== null && sL.skipDisabled,
            ]}
          >
            <AppText style={sL.skipText}>{t("lessons.dontKnow")}</AppText>
          </Pressable>
        </View>

        <View style={[sL.gameArea, { paddingBottom: Math.max(insets.bottom, 12) }]}>
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
            />
          </Animated.View>
        )}
      </View>
    </LessonMeshBackdrop>
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

