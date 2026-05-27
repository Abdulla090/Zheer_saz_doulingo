/**
 * LessonScreen — Duolingo-faithful engine, iOS 26 Liquid Glass shell.
 *
 *   1. Glass header (close pill, progress bar, hearts pill)
 *   2. Game body (frosted cards, glass options)
 *   3. Bottom feedback sheet — frosted glass with tinted accent
 */

import {
    Icon3DAward,
    Icon3DCheck,
    Icon3DCheckCircle,
    Icon3DFire,
    Icon3DX,
    Icon3DZap,
} from "@/components/icons/Icon3D";
import { SoftCircleButton } from "@/components/ui/soft-2.5d";
import { crossShadow } from "@/utils/shadows";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Animated, {
    Easing,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GameQuestion, getLessonQuestions, type LessonPathMode } from "@/data/lesson-content";
import { enterGame } from "./games/game-motion";
import ConversationPickGame from "./games/ConversationPickGame";
import FillBlankGame from "./games/FillBlankGame";
import { G, GameBg, Glass, iOS, Radius } from "./games/game-design";
import { dirForText } from "./games/game-text";
import { LiquidPrimaryButton } from "./games/liquid-primitives";
import MultipleChoiceGame from "./games/MultipleChoiceGame";
import PairMatchGame from "./games/PairMatchGame";
import SentenceBuilderGame from "./games/SentenceBuilderGame";
import VoiceGame from "./games/VoiceGame";

const MAX_HEARTS = 5;
const SHEET_H = 280;

/* ─────────────────────────────────────────────────────────────────────
 * Glass header pill (close button, hearts badge)
 * ───────────────────────────────────────────────────────────────────── */
function HeaderPill({
  children,
  onPress,
  width,
  height = 44,
  paddingH = 14,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  width?: number;
  height?: number;
  paddingH?: number;
}) {
  if (width && width <= 48 && onPress) {
    return (
      <SoftCircleButton
        size={height}
        onPress={onPress}
        faceColor="rgba(255,255,255,0.22)"
        rimColor="rgba(15,23,42,0.35)"
      >
        {children}
      </SoftCircleButton>
    );
  }

  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { if (onPress) scale.value = withTiming(0.96, { duration: 100 }); }}
        onPressOut={() => { if (onPress) scale.value = withTiming(1, { duration: 140 }); }}
        style={[
          {
            height,
            width,
            paddingHorizontal: paddingH,
            borderRadius: height / 2,
            borderWidth: 1,
            borderColor: Glass.borderDark,
            backgroundColor: Glass.surfaceDark,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            ...crossShadow({ color: "#000", offsetY: 8, opacity: 0.14, blur: 18, elevation: 4 }),
          },
          Platform.OS === "web" && {
            // @ts-ignore web
            backdropFilter: "blur(24px) saturate(150%)",
            // @ts-ignore web
            WebkitBackdropFilter: "blur(24px) saturate(150%)",
          },
        ]}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, zIndex: 1 }}>
          {children}
        </View>
      </Pressable>
    </Animated.View>
  );
}

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
      <View style={[sSum.statCard, { borderColor: color }]}>
        {icon}
        <Text style={[sSum.statValue, { color }]}>{value}</Text>
        <Text style={sSum.statLabel}>{label}</Text>
      </View>
    </View>
  );
}

export default function LessonScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const lessonId = parseInt(params.id as string) || 0;
  const lessonIndex = parseInt(params.li as string) || 0;
  const pathMode: LessonPathMode =
    (Array.isArray(params.mode) ? params.mode[0] : params.mode) === "normal"
      ? "normal"
      : "street";

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
  const [feedback, setFeedback] = useState<{ correct: boolean; explanation?: string } | null>(null);

  const nextRef = useRef(0);

  /* Animations */
  const progressW = useSharedValue(0);
  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressW.value * 100}%` as any,
  }));

  const xpSc = useSharedValue(1);
  const xpStyle = useAnimatedStyle(() => ({ transform: [{ scale: xpSc.value }] }));

  const sheetY = useSharedValue(SHEET_H + insets.bottom);
  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: sheetY.value }] }));

  /* Reset on focus */
  useFocusEffect(
    useCallback(() => {
      setCurrent(0); setHearts(MAX_HEARTS); setXp(0);
      setCorrectN(0); setFinished(false); setPassed(false);
      setFeedback(null); nextRef.current = 0;
      progressW.value = 0; xpSc.value = 1;
      sheetY.value = SHEET_H + insets.bottom;
    }, [insets.bottom]),
  );

  const handleAnswer = useCallback(
    (correct: boolean, explanation?: string) => {
      const q = questions[current];
      if (!q) return;

      if (correct) {
        xpSc.value = withSequence(
          withTiming(1.4, { duration: 90, easing: Easing.out(Easing.cubic) }),
          withTiming(1.0, { duration: 160, easing: Easing.out(Easing.cubic) }),
        );
        setXp(v => v + q.xp);
        setCorrectN(v => v + 1);
      } else {
        const newH = Math.max(0, hearts - 1);
        setHearts(newH);
        if (newH === 0) {
          setPassed(false);
          setFinished(true);
          return;
        }
      }

      const next = current + 1;
      nextRef.current = next;
      progressW.value = withTiming(next / questions.length, {
        duration: 420,
        easing: Easing.out(Easing.cubic),
      });

      setFeedback({ correct, explanation });
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

  const renderGame = (q: GameQuestion) => {
    switch (q.type) {
      case "multiple_choice":   return <MultipleChoiceGame   key={current} question={q} onAnswer={handleAnswer} />;
      case "pair_match":        return <PairMatchGame        key={current} question={q} onAnswer={handleAnswer} />;
      case "sentence_builder":  return <SentenceBuilderGame  key={current} question={q} onAnswer={handleAnswer} />;
      case "voice":             return <VoiceGame            key={current} question={q} onAnswer={handleAnswer} />;
      case "fill_blank":        return <FillBlankGame        key={current} question={q} onAnswer={handleAnswer} />;
      case "conversation_pick": return <ConversationPickGame key={current} question={q} onAnswer={handleAnswer} />;
      default:                  return null;
    }
  };

  if (questions.length === 0) {
    return (
      <SafeAreaView style={[sSum.root, { backgroundColor: G.bg, justifyContent: "center", alignItems: "center", padding: 24 }]}>
        <Text style={{ fontSize: 18, fontWeight: "700", color: G.textMid, textAlign: "center", marginBottom: 16 }}>
          No questions available for this lesson yet.
        </Text>
        <LiquidPrimaryButton label="Go Back" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  /* ─────── SUMMARY SCREEN ─────── */
  if (finished) {
    const ok = passed;
    return (
      <SafeAreaView style={[sSum.root, { backgroundColor: ok ? G.greenBg : G.redBg }]}>
        <Animated.View entering={FadeInUp.duration(340)} style={sSum.wrap}>
          <View style={[sSum.iconWrap, { backgroundColor: ok ? G.green : G.red }]}>
            {ok ? <Icon3DAward size={60} /> : <Icon3DX size={52} />}
          </View>

          <Text style={[sSum.title, { color: ok ? G.greenText : G.redText }]}>
            {ok ? "Lesson Complete!" : "Out of Hearts!"}
          </Text>
          <Text style={sSum.sub}>
            {ok ? "Impressive! You're on a roll 🔥" : "Don't give up — try again!"}
          </Text>

          {ok && (
            <View style={sSum.statsRow}>
              <StatCard icon={<Icon3DZap size={26} />} label="XP" value={`+${xp}`} color={G.yellow} />
              <StatCard icon={<Icon3DCheck size={26} />} label="Correct" value={`${correctN}/${questions.length}`} color={G.green} />
              <StatCard icon={<Icon3DFire size={26} />} label="Hearts" value={`${hearts}/${MAX_HEARTS}`} color={G.red} />
            </View>
          )}

          <View style={{ width: "100%", marginTop: 12 }}>
            <LiquidPrimaryButton
              label={ok ? "Continue" : "Try Again"}
              color={ok ? iOS.systemGreen : iOS.systemBlue}
              onPress={() => router.back()}
            />
          </View>
        </Animated.View>
      </SafeAreaView>
    );
  }

  /* ─────── ACTIVE GAME SCREEN ─────── */
  const isCorrect = feedback?.correct === true;

  return (
    <View style={[sL.root, { paddingTop: insets.top }]}>
      <Image
        source={require("@/assets/images/oceanbg.png")}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        cachePolicy="memory-disk"
        priority="low"
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: GameBg.scrim }]} />

      {/* Header */}
      <View style={sL.header}>
        <HeaderPill onPress={() => router.back()} width={44} paddingH={0}>
          <Icon3DX size={20} />
        </HeaderPill>

        {/* Progress glass track */}
        <View style={sL.progressOuter}>
          <View style={sL.progressTrack}>
            <Animated.View style={[sL.progressFillWrap, progressStyle]}>
              <LinearGradient
                colors={["#5EEAD4", iOS.systemGreen]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </View>
        </View>

        <Animated.View style={xpStyle}>
          <HeaderPill height={44} paddingH={14}>
            <Icon3DFire size={18} />
            <Text style={sL.heartsText}>{hearts}</Text>
          </HeaderPill>
        </Animated.View>
      </View>

      {/* Game */}
      <View style={[sL.gameArea, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Animated.View
          key={`${pathMode}-${current}`}
          entering={enterGame}
          style={{ flex: 1 }}
        >
          {renderGame(questions[current]!)}
        </Animated.View>
      </View>

      {/* Feedback sheet */}
      {feedback !== null && (
        <Animated.View
          style={[
            sL.sheet,
            { paddingBottom: Math.max(insets.bottom, 16) + 8 },
            sheetStyle,
          ]}
        >
          {/* Sheet inner with frosted blur */}
          <View
            style={[
              sL.sheetInner,
              {
                backgroundColor: "rgba(255,255,255,0.96)",
                borderColor: isCorrect ? iOS.systemGreen : iOS.systemRed,
              },
              Platform.OS === "web" && {
                // @ts-ignore web
                backdropFilter: "blur(40px) saturate(180%)",
                // @ts-ignore web
                WebkitBackdropFilter: "blur(40px) saturate(180%)",
              },
            ]}
          >
            {/* Top accent stripe */}
            <View
              style={[
                sL.sheetAccent,
                { backgroundColor: isCorrect ? iOS.systemGreen : iOS.systemRed },
              ]}
            />
            <View style={{ position: "relative", zIndex: 1, gap: 18 }}>
              <View style={sL.sheetHeader}>
                <View
                  style={[
                    sL.sheetIconWrap,
                    { backgroundColor: isCorrect ? iOS.systemGreen : iOS.systemRed },
                  ]}
                >
                  {isCorrect ? <Icon3DCheckCircle size={22} /> : <Icon3DX size={22} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      sL.sheetTitle,
                      { color: isCorrect ? iOS.greenDeep : iOS.redDeep },
                    ]}
                  >
                    {isCorrect ? "Correct!" : "Incorrect"}
                  </Text>
                  {feedback.explanation ? (
                    <Text style={[sL.sheetSub, dirForText(feedback.explanation)]}>
                      {feedback.explanation}
                    </Text>
                  ) : (
                    <Text style={sL.sheetSub}>
                      {isCorrect ? "Keep going." : "Review and try the next one."}
                    </Text>
                  )}
                </View>
              </View>

              <LiquidPrimaryButton
                label="CONTINUE"
                color={isCorrect ? iOS.systemGreen : iOS.systemRed}
                onPress={continueToNext}
              />
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

/* ─── styles ─── */
const sL = StyleSheet.create({
  root: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    gap: 10,
  },
  progressOuter: {
    flex: 1,
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
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

  /* Feedback sheet */
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  sheetInner: {
    borderRadius: Radius.xl,
    borderWidth: 1.4,
    paddingTop: 24,
    paddingHorizontal: 22,
    paddingBottom: 22,
    overflow: "hidden",
    ...crossShadow({ color: "#000", offsetY: -4, opacity: 0.18, blur: 30, elevation: 24 }),
  },
  sheetAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  sheetIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 28,
    letterSpacing: -0.5,
  },
  sheetSub: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
    letterSpacing: -0.2,
    color: "#475569",
    marginTop: 2,
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
  iconWrap: {
    width: 100,
    height: 100,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  title: { fontSize: 28, fontWeight: "900", textAlign: "center" },
  sub:   { fontSize: 16, color: G.textMid, textAlign: "center" },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    marginTop: 8,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: G.bg,
    borderRadius: G.rMd,
    borderWidth: 2.5,
    paddingVertical: 18,
    gap: 4,
  },
  statValue: { fontSize: 20, fontWeight: "800" },
  statLabel: { fontSize: 12, fontWeight: "600", color: G.textMid },
});
