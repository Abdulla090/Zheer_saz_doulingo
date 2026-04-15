import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, Pressable, SafeAreaView } from "react-native";
import { EaseView } from "react-native-ease";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { useRouter, useFocusEffect, useLocalSearchParams } from "expo-router";
import { X } from "lucide-react-native";

import { getLessonQuestions, GameQuestion } from "@/data/lesson-content";
import MultipleChoiceGame   from "./games/MultipleChoiceGame";
import PairMatchGame        from "./games/PairMatchGame";
import SentenceBuilderGame  from "./games/SentenceBuilderGame";
import VoiceGame            from "./games/VoiceGame";
import FillBlankGame        from "./games/FillBlankGame";
import ConversationPickGame from "./games/ConversationPickGame";
import { useKurdishFont } from "@/hooks/useKurdishFont";

const MAX_HEARTS = 5;
const snap = (v: number, d = 200) => withTiming(v, { duration: d, easing: Easing.out(Easing.cubic) });

// ─── Summary Continue Button ───────────────────────────────────────────
function SummaryContinueBtn({ passed, onPress }: { passed: boolean; onPress: () => void }) {
  const ty = useSharedValue(0);
  const frontStyle = useAnimatedStyle(() => ({ transform: [{ translateY: ty.value }] }));

  return (
    <EaseView
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 260, delay: passed ? 300 : 150, easing: "easeOut" }}
      style={[{ opacity: 0, translateY: 14, width: "100%" }]}
    >
      <View style={[styles.continueBtnBase, { backgroundColor: passed ? "#58A700" : "#1899D6" }]}>
        <Animated.View style={[styles.continueBtnFront, { backgroundColor: passed ? "#58CC02" : "#1CB0F6" }, frontStyle]}>
          <Pressable
            style={styles.continueBtnInner}
            onPress={onPress}
            onPressIn={() => { ty.value = withTiming(4, { duration: 80 }); }}
            onPressOut={() => { ty.value = withTiming(0, { duration: 120 }); }}
          >
            <Text style={styles.continueBtnText}>{passed ? "بەردەوام بە →" : "دووبارە هەوڵبدەوە"}</Text>
          </Pressable>
        </Animated.View>
      </View>
    </EaseView>
  );
}

export default function LessonScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const lessonId = parseInt(params.id as string) || 0;
  const globalIndex = parseInt(params.q as string) || 0;
  const lessonIndex = parseInt(params.li as string) || 0;
  const font = useKurdishFont();

  // Each unique (unitIndex, lessonIndex) pair maps to a unique content bank.
  const questions = React.useMemo(
    () => getLessonQuestions(lessonId, lessonIndex),
    [lessonId, lessonIndex]
  );

  const [current,  setCurrent]  = useState(0);
  const [hearts,   setHearts]   = useState(MAX_HEARTS);
  const [xp,       setXp]       = useState(0);
  const [correctN, setCorrectN] = useState(0);
  const [finished, setFinished] = useState(false);
  const [passed,   setPassed]   = useState(false);

  // Reanimated: progress bar width (animated %)
  const progressW = useSharedValue(0);
  const progressStyle = useAnimatedStyle(() => ({ width: `${progressW.value * 100}%` as any }));

  // Reanimated: XP badge pop
  const xpS = useSharedValue(1);
  const xpStyle = useAnimatedStyle(() => ({ transform: [{ scale: xpS.value }] }));

  // Reanimated: close button press
  const closeS = useSharedValue(1);
  const closeStyle = useAnimatedStyle(() => ({ transform: [{ scale: closeS.value }] }));

  useFocusEffect(
    useCallback(() => {
      // Reset state every time the screen is focused (since it's inside a Tab layout and doesn't unmount)
      setCurrent(0);
      setHearts(MAX_HEARTS);
      setXp(0);
      setCorrectN(0);
      setFinished(false);
      setPassed(false);
      progressW.value = 0;
      xpS.value = 1;
      closeS.value = 1;
    }, [])
  );

  const handleAnswer = (isCorrect: boolean) => {
    const q = questions[current];
    if (isCorrect) {
      xpS.value = withSequence(snap(1.35, 95), snap(1.0, 150));
      setXp((v) => v + q.xp);
      setCorrectN((v) => v + 1);
    } else {
      const newH = Math.max(0, hearts - 1);
      setHearts(newH);
      if (newH === 0) { setPassed(false); setFinished(true); return; }
    }
    const next = current + 1;
    progressW.value = withTiming(next / questions.length, { duration: 380, easing: Easing.out(Easing.cubic) });
    if (next >= questions.length) { setPassed(true); setFinished(true); }
    else { setTimeout(() => setCurrent(next), 0); }
  };

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

  // ── Summary screen ─────────────────────────────────────────────────────
  if (finished) {
    return (
      <SafeAreaView style={[styles.root, { backgroundColor: passed ? "#F3FFF3" : "#FFF5F5" }]}>
        {/* EaseView: summary card scale-in */}
        <EaseView
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "timing", duration: 320, easing: "easeOut" }}
          style={[styles.summaryWrap, { opacity: 0, transform: [{ scale: 0.87 }] }]}
        >
          <Text style={styles.emoji}>{passed ? "🎉" : "💔"}</Text>
          <Text style={[styles.summaryTitle, { color: passed ? "#58CC02" : "#FF4B4B" }]}>
            {passed ? "یەکەی یەکەم تەواو بوو!" : "ماندوو بوویت!"}
          </Text>

          {passed && (
            <View style={styles.statsCard}>
              <StatRow label="XP کسبکراو"   value={`${xp} XP`}                    color="#FFC800" delay={80}  />
              <StatRow label="وەڵامی دروست" value={`${correctN}/${questions.length}`} color="#58CC02" delay={150} />
              <StatRow label="دڵی ماوەتەوە" value={`${hearts} ❤️`}               color="#FF4B4B" delay={220} />
            </View>
          )}

          <SummaryContinueBtn passed={passed} onPress={() => router.back()} />
        </EaseView>
      </SafeAreaView>
    );
  }

  // ── Active game ─────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.root}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Animated.View style={closeStyle}>
          <Pressable
            onPressIn={() => { closeS.value = snap(0.84, 80); }}
            onPressOut={() => { closeS.value = snap(1.0, 120); }}
            onPress={() => router.back()}
            style={styles.closeBtn}
          >
            <X color="#AFAFAF" size={25} />
          </Pressable>
        </Animated.View>

        {/* Reanimated: smooth animated progress bar */}
        <View style={styles.progressBg}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>

        {/* Reanimated: XP badge pop */}
        <Animated.View style={[styles.xpBadge, xpStyle]}>
          <Text style={styles.xpText}>{xp} XP</Text>
        </Animated.View>
      </View>

      {/* Hearts row — EaseView per heart opacity/scale */}
      <View style={styles.heartsRow}>
        {Array.from({ length: MAX_HEARTS }).map((_, i) => (
          <EaseView
            key={i}
            animate={{
              opacity: i < hearts ? 1 : 0.28,
              scale:   i < hearts ? 1 : 0.68,
              backgroundColor: i < hearts ? "#FF4B4B" : "#E5E5E5",
            }}
            transition={{ type: "timing", duration: 200, easing: "easeOut" }}
            style={styles.heart}
          />
        ))}
        <Text style={styles.qNum}>{current + 1}/{questions.length}</Text>
      </View>

      {/* EaseView: game slide-in on key change (re-mounts fresh each question) */}
      <EaseView
        key={current}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ type: "timing", duration: 240, easing: "easeOut" }}
        style={[styles.gameArea, { opacity: 0, translateX: 24 }]}
      >
        {renderGame(questions[current])}
      </EaseView>
    </SafeAreaView>
  );
}

// Stat row: EaseView slide-in from left with delay
function StatRow({ label, value, color, delay }: { label: string; value: string; color: string; delay: number }) {
  return (
    <EaseView
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: "timing", duration: 210, delay, easing: "easeOut" }}
      style={[styles.statRow, { opacity: 0, translateX: -12 }]}
    >
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </EaseView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFF" },
  topBar: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, gap: 12 },
  closeBtn: { padding: 6 },
  progressBg: { flex: 1, height: 16, backgroundColor: "#E5E5E5", borderRadius: 8, overflow: "hidden" },
  progressFill: {
    height: "100%", backgroundColor: "#58CC02", borderRadius: 8,
    boxShadow: "0px 0px 5px rgba(88, 204, 2, 0.38)" as any, elevation: 2,
  },
  xpBadge: { backgroundColor: "#FFC800", borderRadius: 10, paddingHorizontal: 9, paddingVertical: 5 },
  xpText:  { fontSize: 13, color: "#FFF" },
  heartsRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingBottom: 8, gap: 5 },
  heart: { width: 16, height: 16, borderRadius: 8 },
  qNum:  { fontSize: 12, color: "#ABABAB", marginLeft: "auto" as any },
  gameArea: { flex: 1 },

  // Summary
  summaryWrap: {
    flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32,
  },
  emoji: { fontSize: 68, marginBottom: 14 },
  summaryTitle: { fontSize: 26, textAlign: "center", marginBottom: 26 },
  statsCard: {
    width: "100%", backgroundColor: "#FFF", borderRadius: 18, overflow: "hidden", marginBottom: 24,
    boxShadow: "0px 3px 12px rgba(0, 0, 0, 0.07)" as any, elevation: 4,
  },
  statRow: {
    flexDirection: "row", justifyContent: "space-between",
    paddingVertical: 15, paddingHorizontal: 18,
    borderBottomWidth: 1, borderBottomColor: "#F0F0F0",
  },
  statLabel: { fontSize: 15, color: "#777" },
  statValue: { fontSize: 17 },
  
  // 3D Continue Button
  continueBtnBase: {
    width: "100%",
    borderRadius: 18,
  },
  continueBtnFront: {
    width: "100%",
    borderRadius: 18,
    marginBottom: 4, // 3D depth
  },
  continueBtnInner: {
    paddingVertical: 18, alignItems: "center"
  },
  continueBtnText: { fontSize: 17, color: "#FFF" },
});

