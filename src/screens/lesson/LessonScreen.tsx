/**
 * LessonScreen — Duolingo-faithful lesson engine.
 *
 * Key UX pattern:
 *   1. Game rendered in scrollable area
 *   2. Games call onAnswer(correct, explanation?) when user picks
 *   3. Bottom feedback sheet slides up (green / red)
 *   4. User taps CONTINUE → advances to next question
 */

import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ImageBackground,
  Platform,
} from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  ReduceMotion,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useFocusEffect, useLocalSearchParams } from "expo-router";
import {
  Icon3DX,
  Icon3DFire,
  Icon3DZap,
  Icon3DAward,
  Icon3DCheck,
  Icon3DCheckCircle,
} from "@/components/icons/Icon3D";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { crossShadow } from "@/utils/shadows";

import { getLessonQuestions, GameQuestion } from "@/data/lesson-content";
import MultipleChoiceGame   from "./games/MultipleChoiceGame";
import PairMatchGame        from "./games/PairMatchGame";
import SentenceBuilderGame  from "./games/SentenceBuilderGame";
import VoiceGame            from "./games/VoiceGame";
import FillBlankGame        from "./games/FillBlankGame";
import ConversationPickGame from "./games/ConversationPickGame";
import { G } from "./games/game-design";

const MAX_HEARTS = 5;
const SHEET_H    = 230;

// ─────────────────────────────────────────────────────────────────────────────
// Ultra Premium Feedback Button
// ─────────────────────────────────────────────────────────────────────────────
function SheetContinueBtn({
  label,
  faceColor,
  textColor,
  onPress,
}: {
  label: string;
  rimColor?: string; // keeping for prop compatibility if needed
  faceColor: string;
  textColor: string;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const faceStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={[{ width: "100%", marginTop: 8 }, faceStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.96, { damping: 15, stiffness: 300 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 300 }); }}
        style={{
          backgroundColor: faceColor,
          paddingVertical: 18,
          borderRadius: 20,
          alignItems: "center",
          ...crossShadow({
            color: faceColor,
            offsetY: 6,
            opacity: 0.3,
            blur: 12,
            elevation: 6
          }),
        }}
      >
        <Text style={{ fontSize: 17, fontWeight: "700", color: textColor, letterSpacing: 0.5 }}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Summary stat card
// ─────────────────────────────────────────────────────────────────────────────
function StatCard({
  icon, label, value, color, delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  delay: number;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(220)}
      style={{ flex: 1 }}
    >
      <View style={[sSum.statCard, { borderColor: color }]}>
        {icon}
        <Text style={[sSum.statValue, { color }]}>{value}</Text>
        <Text style={sSum.statLabel}>{label}</Text>
      </View>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main screen
// ─────────────────────────────────────────────────────────────────────────────
export default function LessonScreen() {
  const router      = useRouter();
  const insets      = useSafeAreaInsets();
  const params      = useLocalSearchParams();
  const lessonId    = parseInt(params.id   as string) || 0;
  const lessonIndex = parseInt(params.li   as string) || 0;

  const questions = React.useMemo(
    () => getLessonQuestions(lessonId, lessonIndex),
    [lessonId, lessonIndex],
  );

  const [current,  setCurrent]  = useState(0);
  const [hearts,   setHearts]   = useState(MAX_HEARTS);
  const [xp,       setXp]       = useState(0);
  const [correctN, setCorrectN] = useState(0);
  const [finished, setFinished] = useState(false);
  const [passed,   setPassed]   = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; explanation?: string } | null>(null);

  const nextRef = useRef(0);

  // ── Animations ────────────────────────────────────────────────────
  const progressW = useSharedValue(0);
  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressW.value * 100}%` as any,
  }));

  const xpSc = useSharedValue(1);
  const xpStyle = useAnimatedStyle(() => ({ transform: [{ scale: xpSc.value }] }));

  const closeSc = useSharedValue(1);
  const closeStyle = useAnimatedStyle(() => ({ transform: [{ scale: closeSc.value }] }));

  const sheetY = useSharedValue(SHEET_H + insets.bottom);
  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: sheetY.value }] }));

  // ── Reset on focus ────────────────────────────────────────────────
  useFocusEffect(
    useCallback(() => {
      setCurrent(0); setHearts(MAX_HEARTS); setXp(0);
      setCorrectN(0); setFinished(false); setPassed(false);
      setFeedback(null); nextRef.current = 0;
      progressW.value = 0; xpSc.value = 1; closeSc.value = 1;
      sheetY.value = SHEET_H + insets.bottom;
    }, [insets.bottom]),
  );

  // ── Handle answer from game ────────────────────────────────────────
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
          // No sheet — just go straight to fail screen
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
      sheetY.value = withSpring(0, {
        damping: 20,
        stiffness: 220,
        mass: 0.9,
        reduceMotion: ReduceMotion.System,
      });
    },
    [current, hearts, questions],
  );

  // ── Continue to next question ──────────────────────────────────────
  const continueToNext = useCallback(() => {
    sheetY.value = withTiming(SHEET_H + insets.bottom, {
      duration: 240,
      easing: Easing.in(Easing.quad),
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

  // ── Game renderer ─────────────────────────────────────────────────
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
        <SheetContinueBtn
          label="Go Back"
          faceColor={G.blue}
          textColor="#FFF"
          onPress={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  // ─── SUMMARY SCREEN ────────────────────────────────────────────────────────
  if (finished) {
    const ok = passed;
    return (
      <SafeAreaView style={[sSum.root, { backgroundColor: ok ? G.greenBg : G.redBg }]}>
        <Animated.View
          entering={FadeInUp.duration(340)}
          style={sSum.wrap}
        >
          {/* Hero icon */}
          <View style={[sSum.iconWrap, { backgroundColor: ok ? G.green : G.red }]}>
            {ok
              ? <Icon3DAward size={60} />
              : <Icon3DX size={52} />}
          </View>

          <Text style={[sSum.title, { color: ok ? G.greenText : G.redText }]}>
            {ok ? "Lesson Complete!" : "Out of Hearts!"}
          </Text>
          <Text style={sSum.sub}>
            {ok ? "Impressive! You're on a roll 🔥" : "Don't give up — try again!"}
          </Text>

          {/* Stats row */}
          {ok && (
            <View style={sSum.statsRow}>
              <StatCard
                icon={<Icon3DZap size={26} />}
                label="XP"
                value={`+${xp}`}
                color={G.yellow}
                delay={80}
              />
              <StatCard
                icon={<Icon3DCheck size={26} />}
                label="Correct"
                value={`${correctN}/${questions.length}`}
                color={G.green}
                delay={160}
              />
              <StatCard
                icon={<Icon3DFire size={26} />}
                label="Hearts"
                value={`${hearts}/${MAX_HEARTS}`}
                color={G.red}
                delay={240}
              />
            </View>
          )}

          {/* Continue button */}
          <Animated.View
            entering={FadeInDown.delay(ok ? 360 : 200).duration(280)}
            style={{ width: "100%", marginTop: 12 }}
          >
            <SheetContinueBtn
              label={ok ? "Continue" : "Try Again"}
              rimColor={ok ? G.greenRim : G.blueRim}
              faceColor={ok ? G.green : G.blue}
              textColor="#FFF"
              onPress={() => router.back()}
            />
          </Animated.View>
        </Animated.View>
      </SafeAreaView>
    );
  }

  // ─── ACTIVE GAME SCREEN ────────────────────────────────────────────────────
  const isCorrect = feedback?.correct === true;

  return (
    <ImageBackground 
      source={require("@/assets/images/oceanbg.png")}
      style={[sL.root, { paddingTop: insets.top }]}
      resizeMode="cover"
    >
      {/* ── Premium Glass Header ───────────────────────────────────────────── */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 24,
      }}>
        {/* Close button (Glass pill) */}
        <Animated.View style={closeStyle}>
          <Pressable
            onPressIn={() => { closeSc.value = withTiming(0.85, { duration: 100 }); }}
            onPressOut={() => { closeSc.value = withTiming(1, { duration: 150 }); }}
            onPress={() => router.back()}
            style={{
              width: 44, height: 44, borderRadius: 22,
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Icon3DX size={20} />
          </Pressable>
        </Animated.View>

        {/* Center Progress Glass Pill */}
        <View style={{
          flex: 1, marginHorizontal: 16, height: 16,
          backgroundColor: 'rgba(0,0,0,0.15)',
          borderRadius: 12,
          borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
          overflow: 'hidden',
          padding: 2,
        }}>
          <Animated.View style={[{ height: '100%', borderRadius: 10, overflow: 'hidden' }, progressStyle]}>
             <LinearGradient colors={['#34D399', '#10B981']} style={{flex: 1}} />
          </Animated.View>
        </View>

        {/* Energy badge (Glass pill) */}
        <Animated.View style={[xpStyle, {
          height: 44, paddingHorizontal: 16, borderRadius: 22,
          backgroundColor: 'rgba(255,255,255,0.15)',
          borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
          flexDirection: 'row', alignItems: 'center', gap: 6,
        }]}>
          <Icon3DZap size={20} />
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#FFFFFF' }}>{hearts}</Text>
        </Animated.View>
      </View>

      {/* ── Game content ─────────────────────────────────────────────────────── */}
      <Animated.View
        key={current}
        entering={FadeInDown.duration(260)}
        style={sL.gameArea}
      >
        {renderGame(questions[current]!)}
      </Animated.View>

      {/* ── Feedback bottom sheet ─────────────────────────────────────────────── */}
      {feedback !== null && (
        <Animated.View
          style={[
            sL.sheet,
            isCorrect ? sL.sheetCorrect : sL.sheetWrong,
            { paddingBottom: insets.bottom + 20 },
            sheetStyle,
          ]}
        >
          {/* Icon + heading */}
          <View style={sL.sheetHeader}>
            <View style={[sL.sheetIconWrap, { backgroundColor: isCorrect ? G.green : G.red }]}>
              {isCorrect
                ? <Icon3DCheckCircle size={20} />
                : <Icon3DX size={20} />}
            </View>
            <View>
              <Text style={[sL.sheetTitle, { color: isCorrect ? G.greenText : G.redText }]}>
                {isCorrect ? "Correct!" : "Incorrect!"}
              </Text>
              {feedback.explanation ? (
                <Text style={[sL.sheetSub, { color: isCorrect ? G.greenText : G.redText }]}>
                  {feedback.explanation}
                </Text>
              ) : (
                <Text style={[sL.sheetSub, { color: isCorrect ? G.greenText : G.redText }]}>
                  {isCorrect ? "Perfect! Keep up the momentum." : "Not quite. Let's try to focus on the structure."}
                </Text>
              )}
            </View>
          </View>

          {/* Continue button */}
          <SheetContinueBtn
            label="NEXT QUESTION"
            rimColor={isCorrect ? G.blueRim : G.redRim}
            faceColor={isCorrect ? G.blue   : G.red}
            textColor="#FFF"
            onPress={continueToNext}
          />
        </Animated.View>
      )}
    </ImageBackground>
  );
}

// ─── Lesson screen styles ──────────────────────────────────────────────────────
const sL = StyleSheet.create({
  root:  { flex: 1 },

  // Top bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: G.px,
    paddingTop: 10,
    paddingBottom: 8,
    gap: 12,
  },
  closeBtn: {
    width: 36, height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: G.border,
    alignItems: "center",
    justifyContent: "center",
  },
  progressTrack: {
    flex: 1,
    height: 14,
    backgroundColor: G.border,
    borderRadius: 7,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: G.blue,
    borderRadius: 7,
  },
  xpBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: G.blue,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  xpText: { fontSize: 13, fontWeight: "800", color: "#FFF" },

  // Hearts
  heartsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: G.px,
    paddingBottom: 8,
    gap: 5,
  },
  qNum: {
    marginLeft: "auto" as any,
    fontSize: 13,
    fontWeight: "600",
    color: G.textLight,
  },

  // Game area
  gameArea: { flex: 1 },

  // Feedback sheet
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 28,
    paddingHorizontal: 24,
    gap: 20,
    // Soft glass shadow - cross platform
    ...crossShadow({
      color: "#000",
      offsetY: -10,
      opacity: 0.08,
      blur: 20,
      elevation: 24
    }),
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
  },
  sheetCorrect: { backgroundColor: "rgba(240, 253, 244, 0.95)" }, // Ultra soft emerald glass
  sheetWrong:   { backgroundColor: "rgba(254, 242, 242, 0.95)" }, // Ultra soft rose glass

  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
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
    opacity: 0.8,
  },
});

// ─── Summary styles ────────────────────────────────────────────────────────────
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
