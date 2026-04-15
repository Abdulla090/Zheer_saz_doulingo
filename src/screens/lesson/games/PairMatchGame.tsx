import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { EaseView } from "react-native-ease";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  interpolateColor,
  Easing,
} from "react-native-reanimated";
import { PairMatchQuestion } from "@/data/lesson-content";
import { CheckCircle2 } from "lucide-react-native";

type ChipState = "idle" | "selected" | "matched" | "wrong";
type Props = { question: PairMatchQuestion; onAnswer: (correct: boolean) => void };

function shuffleArr<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ─── Chip ──────────────────────────────────────────────────────────
function PairChip({ label, chipState, delay, onPress }: {
  label: string; chipState: ChipState; delay: number; onPress: () => void;
}) {
  const colorP   = useSharedValue(0);
  const shakeX   = useSharedValue(0);
  const popScale = useSharedValue(1);
  const ty       = useSharedValue(0);

  const shadowStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(colorP.value, [0,1,2,3], ["#E5E5E5","#1899D6","#58A700","#EA2B2B"]),
  }));

  const frontStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(colorP.value, [0,1,2,3], ["#E5E5E5","#1CB0F6","#58CC02","#FF4B4B"]),
    backgroundColor: interpolateColor(colorP.value, [0,1,2,3], ["#FFF","#EAF6FF","#E5FFDC","#FFEBEB"]),
    transform: [{ translateX: shakeX.value }, { scale: popScale.value }, { translateY: ty.value }],
  }));

  React.useEffect(() => {
    const t = (v: number) => withTiming(v, { duration: 190, easing: Easing.out(Easing.quad) });
    if (chipState === "selected") {
      colorP.value = t(1);
    } else if (chipState === "matched") {
      colorP.value = t(2);
      popScale.value = withSequence(
        withTiming(1.05, { duration: 105, easing: Easing.out(Easing.cubic) }),
        withTiming(1.0,  { duration: 150, easing: Easing.inOut(Easing.quad) })
      );
    } else if (chipState === "wrong") {
      colorP.value = t(3);
      shakeX.value = withSequence(
        withTiming(-7, { duration: 42 }), withTiming(7, { duration: 42 }),
        withTiming(-4, { duration: 36 }), withTiming(4, { duration: 36 }),
        withTiming( 0, { duration: 48, easing: Easing.out(Easing.quad) })
      );
      // Auto-reset to idle color after shake
      setTimeout(() => { colorP.value = t(0); }, 700);
    } else {
      colorP.value = t(0);
    }
  }, [chipState]);

  return (
    <EaseView
      animate={{ opacity: chipState === "matched" ? 0.65 : 1, translateY: 0 }}
      transition={{ type: "timing", duration: 230, delay, easing: "easeOut" }}
      style={{ translateY: 14, opacity: 0 }}
    >
      <Animated.View style={[styles.chipBase, shadowStyle]}>
        <Animated.View style={[styles.chipFront, frontStyle]}>
          <Pressable
            onPress={onPress}
            disabled={chipState === "matched"}
            onPressIn={() => { ty.value = withTiming(4, { duration: 80 }); }}
            onPressOut={() => { ty.value = withTiming(0, { duration: 120 }); }}
            style={styles.chipInner}
          >
            {chipState === "matched" && <CheckCircle2 color="#58CC02" size={16} style={{ marginRight: 6 }} />}
            <Text style={[
              styles.chipText,
              chipState === "matched"  && { color: "#58CC02" },
              chipState === "selected" && { color: "#1CB0F6" },
              chipState === "wrong"    && { color: "#FF4B4B" },
            ]}>
              {label}
            </Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </EaseView>
  );
}

// ─── Screen ────────────────────────────────────────────────────────
export default function PairMatchGame({ question, onAnswer }: Props) {
  const [en] = useState(() => shuffleArr(question.pairs.map((p) => p.english)));
  const [ku] = useState(() => shuffleArr(question.pairs.map((p) => p.kurdish)));

  // Use refs for "pending" selections to avoid stale closure issues
  const selEnRef = useRef<string | null>(null);
  const selKuRef = useRef<string | null>(null);

  const [selEn, setSelEn]   = useState<string | null>(null);
  const [selKu, setSelKu]   = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongEn, setWrongEn] = useState<string | null>(null);
  const [wrongKu, setWrongKu] = useState<string | null>(null);

  // Guard against double-firing onAnswer
  const firedRef = useRef(false);

  const total = question.pairs.length;

  const progressW = useSharedValue(0);
  const progressStyle = useAnimatedStyle(() => ({ width: `${progressW.value}%` as any }));

  // Centralized match-attempt logic using refs (not stale state)
  const attemptMatch = (pendingEn: string | null, pendingKu: string | null, currentMatched: Set<string>) => {
    if (!pendingEn || !pendingKu) return;

    const ok = question.pairs.some((p) => p.english === pendingEn && p.kurdish === pendingKu);
    if (ok) {
      const next = new Set(currentMatched).add(pendingEn).add(pendingKu);
      setMatched(next);
      setSelEn(null); setSelKu(null);
      selEnRef.current = null; selKuRef.current = null;

      progressW.value = withTiming((next.size / 2 / total) * 100, {
        duration: 340, easing: Easing.out(Easing.cubic)
      });

      if (next.size / 2 === total) {
        if (!firedRef.current) {
          firedRef.current = true;
          setTimeout(() => onAnswer(true), 440);
        }
      }
    } else {
      setWrongEn(pendingEn);
      setWrongKu(pendingKu);
      setTimeout(() => {
        setSelEn(null); setSelKu(null);
        setWrongEn(null); setWrongKu(null);
        selEnRef.current = null; selKuRef.current = null;
      }, 700);
    }
  };

  const handleEn = (w: string) => {
    setMatched((currentMatched) => {
      if (currentMatched.has(w)) return currentMatched;
      selEnRef.current = w;
      setSelEn(w);
      // Try match with whatever Kurdish is currently selected
      attemptMatch(w, selKuRef.current, currentMatched);
      return currentMatched;
    });
  };

  const handleKu = (w: string) => {
    setMatched((currentMatched) => {
      if (currentMatched.has(w)) return currentMatched;
      selKuRef.current = w;
      setSelKu(w);
      // Try match with whatever English is currently selected
      attemptMatch(selEnRef.current, w, currentMatched);
      return currentMatched;
    });
  };

  const count = matched.size / 2;

  const enState = (w: string): ChipState =>
    matched.has(w) ? "matched" : wrongEn === w ? "wrong" : selEn === w ? "selected" : "idle";
  const kuState = (w: string): ChipState =>
    matched.has(w) ? "matched" : wrongKu === w ? "wrong" : selKu === w ? "selected" : "idle";

  return (
    <View style={styles.container}>
      <EaseView
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 220, easing: "easeOut" }}
        style={[styles.header, { opacity: 0, translateY: -8 }]}
      >
        <Text style={styles.instruction}>جووت بکەوە</Text>
        <View style={styles.progressBg}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
          <Text style={styles.progressLabel}>{count}/{total}</Text>
        </View>
      </EaseView>

      <View style={styles.columns}>
        {/* Kurdish column (left) */}
        <View style={styles.col}>
          {ku.map((w, i) => (
            <PairChip key={w} label={w} chipState={kuState(w)} delay={i * 55} onPress={() => handleKu(w)} />
          ))}
        </View>
        {/* English column (right) */}
        <View style={styles.col}>
          {en.map((w, i) => (
            <PairChip key={w} label={w} chipState={enState(w)} delay={i * 55 + 28} onPress={() => handleEn(w)} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 24 },
  header:    { marginBottom: 22 },
  instruction: { fontSize: 20, color: "#4B4B4B", textAlign: "center", marginBottom: 16 },
  progressBg: { height: 18, backgroundColor: "#E5E5E5", borderRadius: 10, overflow: "hidden", justifyContent: "center" },
  progressFill: {
    position: "absolute", left: 0, top: 0, bottom: 0,
    backgroundColor: "#1CB0F6", borderRadius: 10,
  },
  progressLabel: { fontSize: 11, color: "#FFF", textAlign: "center", zIndex: 2 },
  columns: { flexDirection: "row", gap: 12 },
  col:     { flex: 1, gap: 10 },

  // 3D Pair Chip
  chipBase:  { borderRadius: 14 },
  chipFront: { borderRadius: 14, borderWidth: 2, marginBottom: 4, backgroundColor: "#FFFFFF" },
  chipInner: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: 18, paddingHorizontal: 12, minHeight: 60,
  },
  chipText: { fontSize: 15, color: "#4B4B4B", textAlign: "center", flexShrink: 1 },
});
