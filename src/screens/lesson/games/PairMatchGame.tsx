/**
 * PairMatchGame — Duolingo style two-column matching.
 *
 * Flow: tap Kurdish → tap English → if match: green + fade → if wrong: red shake
 * When all matched: onAnswer(true) after 500ms
 */

import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
// EaseView replaced with Animated.View from reanimated
import { PairMatchQuestion } from "@/data/lesson-content";
import { G } from "./game-design";
import { crossShadow } from "@/utils/shadows";

type Props = {
  question: PairMatchQuestion;
  onAnswer: (correct: boolean, explanation?: string) => void;
};

type ChipState = "idle" | "selected" | "matched" | "wrong";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ── Pair chip (3D Duolingo style) ─────────────────────────────────────────────
function PairChip({
  label, state, onPress, delay,
}: {
  label: string; state: ChipState; onPress: () => void; delay: number;
}) {
  const ty  = useSharedValue(0);
  const p   = useSharedValue(0); // 0=idle 1=selected 2=matched 3=wrong
  const shX = useSharedValue(0);
  const opac = useSharedValue(1);

  React.useEffect(() => {
    const t = (v: number) => withTiming(v, { duration: 200, easing: Easing.out(Easing.quad) });
    if (state === "idle")     { p.value = t(0); opac.value = withTiming(1, { duration: 200 }); }
    if (state === "selected") { p.value = t(1); ty.value = withSpring(0, { damping: 14, stiffness: 180 }); }
    if (state === "matched")  {
      p.value = t(2);
      opac.value = withSequence(
        withTiming(1, { duration: 80 }),
        withTiming(0.3, { duration: 320, easing: Easing.out(Easing.quad) }),
      );
    }
    if (state === "wrong") {
      p.value = t(3);
      shX.value = withSequence(
        withTiming(-9, { duration: 38 }), withTiming(9, { duration: 38 }),
        withTiming(-5, { duration: 32 }), withTiming(5, { duration: 32 }),
        withTiming( 0, { duration: 44, easing: Easing.out(Easing.quad) }),
      );
      setTimeout(() => { p.value = t(0); }, 700);
    }
  }, [state]);

  const rimStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(p.value, [0, 1, 2, 3],
      [G.optRim, G.blueRim, G.greenRim, G.redRim]),
    opacity: opac.value,
  }));
  const faceStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(p.value, [0, 1, 2, 3],
      [G.optBg, G.blueBg, G.greenBg, G.redBg]),
    borderColor: interpolateColor(p.value, [0, 1, 2, 3],
      [G.optBorder, G.blue, G.green, G.red]),
    transform: [{ translateY: ty.value }, { translateX: shX.value }],
  }));

  const textColorMap: Record<ChipState, string> = {
    idle:     G.textDark,
    selected: G.blueText,
    matched:  G.greenText,
    wrong:    G.redText,
  };

  return (
    <Animated.View
      style={{ opacity: 0, transform: [{ scale: 0.88 }] }}
    >
      <Animated.View style={[s.rim, rimStyle]}>
        <Animated.View style={[s.face, faceStyle]}>
          <Pressable
            onPress={onPress}
            disabled={state === "matched"}
            onPressIn={() => { ty.value = withTiming(G.depth, { duration: 75 }); }}
            onPressOut={() => { ty.value = withTiming(0, { duration: 110 }); }}
            style={s.pressable}
          >
            <Text style={[s.chipText, { color: textColorMap[state] }]} numberOfLines={2}>
              {label}
            </Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

// ── Progress dots ─────────────────────────────────────────────────────────────
function MatchProgress({ matched, total }: { matched: number; total: number }) {
  return (
    <View style={s.dotsRow}>
      {Array.from({ length: total }).map((_, i) => (
        <Animated.View
          key={i}
          style={[s.dot, { backgroundColor: G.border }]}
        />
      ))}
    </View>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function PairMatchGame({ question, onAnswer }: Props) {
  const [left]  = useState(() => shuffle(question.pairs.map(p => p.kurdish)));
  const [right] = useState(() => shuffle(question.pairs.map(p => p.english)));

  const selLRef = useRef<string | null>(null);
  const selRRef = useRef<string | null>(null);
  const [selL, setSelL] = useState<string | null>(null);
  const [selR, setSelR] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongL, setWrongL]   = useState<string | null>(null);
  const [wrongR, setWrongR]   = useState<string | null>(null);
  const firedRef = useRef(false);
  const total = question.pairs.length;

  const isLocked = wrongL !== null || wrongR !== null;

  const tryMatch = (pendL: string | null, pendR: string | null) => {
    if (!pendL || !pendR) return;
    const ok = question.pairs.some(p => p.kurdish === pendL && p.english === pendR);
    if (ok) {
      setMatched(cur => {
        const next = new Set(cur).add(pendL).add(pendR);
        if (next.size / 2 === total && !firedRef.current) {
          firedRef.current = true;
          setTimeout(() => onAnswer(true), 500);
        }
        return next;
      });
      setSelL(null); setSelR(null);
      selLRef.current = null; selRRef.current = null;
    } else {
      setWrongL(pendL); setWrongR(pendR);
      setTimeout(() => {
        setSelL(null); setSelR(null); setWrongL(null); setWrongR(null);
        selLRef.current = null; selRRef.current = null;
      }, 700);
    }
  };

  const handleL = (w: string) => {
    if (isLocked || matched.has(w)) return;
    if (selL === w) {
      selLRef.current = null; setSelL(null);
      return;
    }
    selLRef.current = w; setSelL(w);
    tryMatch(w, selRRef.current);
  };

  const handleR = (w: string) => {
    if (isLocked || matched.has(w)) return;
    if (selR === w) {
      selRRef.current = null; setSelR(null);
      return;
    }
    selRRef.current = w; setSelR(w);
    tryMatch(selLRef.current, w);
  };

  const lState = (w: string): ChipState =>
    matched.has(w) ? "matched" : wrongL === w ? "wrong" : selL === w ? "selected" : "idle";
  const rState = (w: string): ChipState =>
    matched.has(w) ? "matched" : wrongR === w ? "wrong" : selR === w ? "selected" : "idle";

  return (
    <View style={s.root}>
      {/* Instruction */}
      <Animated.View
        entering={FadeInDown.duration(300)}

        style={{}}
      >
        <Text style={[s.instruction, { color: 'rgba(255,255,255,0.9)' }]}>Match the pairs</Text>
      </Animated.View>

      {/* Progress dots */}
      <MatchProgress matched={matched.size / 2} total={total} />

      {/* Column labels */}
      <View style={s.colLabels}>
        <Text style={[s.colLabel, { color: 'rgba(255,255,255,0.8)' }]}>Kurdish</Text>
        <Text style={[s.colLabel, { color: 'rgba(255,255,255,0.8)' }]}>English</Text>
      </View>

      {/* Two columns */}
      <View style={s.columns}>
        <View style={s.col}>
          {left.map((w, i) => (
            <PairChip key={w} label={w} state={lState(w)} onPress={() => handleL(w)} delay={i * 55} />
          ))}
        </View>
        <View style={s.col}>
          {right.map((w, i) => (
            <PairChip key={w} label={w} state={rState(w)} onPress={() => handleR(w)} delay={i * 55 + 28} />
          ))}
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: G.px,
    paddingTop: 8,
    paddingBottom: 28,
    gap: 12,
  },
  instruction: {
    fontSize: 13,
    fontWeight: "700",
    color: G.textLight,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 2,
    justifyContent: "center",
  },
  dot: {
    width: 32,
    height: 10,
    borderRadius: 5,
  },
  colLabels: {
    flexDirection: "row",
  },
  colLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
    color: G.textLight,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  columns: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
  },
  col: { flex: 1, gap: 10 },

  rim: { borderRadius: G.rMd, overflow: "hidden", ...crossShadow({ color: "#000", offsetY: 4, opacity: 0.1, blur: 8 }) },
  face: {
    borderRadius: G.rMd,
    borderWidth: 1.5,
    marginBottom: G.depth,
    borderColor: 'rgba(0,0,0,0.05)'
  },
  pressable: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 10,
    minHeight: 56,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 20,
  },
});
