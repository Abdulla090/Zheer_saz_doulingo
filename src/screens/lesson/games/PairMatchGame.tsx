/**
 * PairMatchGame — iOS 26 Liquid Glass redesign.
 *
 * Two columns of frosted glass chips. Tap left → tap right → match.
 * Correct: green + scale-down fade. Wrong: red shake.
 * Animated layout transitions when chips match.
 */

import React, { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
    Easing,
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from "react-native-reanimated";

import { PairMatchQuestion } from "@/data/lesson-content";
import { iOS, Radius, Type } from "./game-design";
import {
    LiquidEyebrow,
    LiquidWordChip,
    OptionState,
} from "./liquid-primitives";

type Props = {
  question: PairMatchQuestion;
  onAnswer: (correct: boolean, explanation?: string) => void;
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

/* ───── Wrapped chip with shake + scale-down on match ───── */
function MatchChip({
  label,
  state,
  onPress,
  matched,
  delay,
  rtl = false,
}: {
  label: string;
  state: OptionState;
  onPress: () => void;
  matched: boolean;
  delay: number;
  rtl?: boolean;
}) {
  const shakeX = useSharedValue(0);
  const chipScale = useSharedValue(1);
  const opac = useSharedValue(1);

  React.useEffect(() => {
    if (state === "wrong") {
      shakeX.value = withSequence(
        withTiming(-8, { duration: 38 }),
        withTiming(8, { duration: 38 }),
        withTiming(-5, { duration: 32 }),
        withTiming(5, { duration: 32 }),
        withTiming(0, { duration: 44, easing: Easing.out(Easing.quad) }),
      );
    }
  }, [state]);

  React.useEffect(() => {
    if (matched) {
      chipScale.value = withSpring(0.92, { damping: 14, stiffness: 200 });
      opac.value = withTiming(0.75, { duration: 400, easing: Easing.out(Easing.quad) });
    } else {
      chipScale.value = withSpring(1, { damping: 14, stiffness: 200 });
      opac.value = withTiming(1, { duration: 200 });
    }
  }, [matched]);

  const wrapStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }, { scale: chipScale.value }],
    opacity: opac.value,
  }));

  return (
    <Animated.View
      entering={FadeInUp.delay(delay).springify().damping(18).stiffness(180)}
      style={wrapStyle}
    >
      <LiquidWordChip
        label={label}
        state={state}
        onPress={onPress}
        disabled={matched}
        rtl={rtl}
      />
    </Animated.View>
  );
}

/* ───── Progress dots ───── */
function MatchProgress({ done, total }: { done: number; total: number }) {
  return (
    <View style={s.dotsRow}>
      {Array.from({ length: total }).map((_, i) => (
        <Animated.View
          key={i}
          style={[
            s.dot,
            {
              backgroundColor: i < done ? iOS.systemGreen : "rgba(255,255,255,0.3)",
              transform: [{ scale: i < done ? 1.15 : 1 }],
            },
          ]}
        />
      ))}
    </View>
  );
}

/* ───── Main ───── */
export default function PairMatchGame({ question, onAnswer }: Props) {
  const [left] = useState(() => shuffle(question.pairs.map(p => p.kurdish)));
  const [right] = useState(() => shuffle(question.pairs.map(p => p.english)));

  const selLRef = useRef<string | null>(null);
  const selRRef = useRef<string | null>(null);
  const [selL, setSelL] = useState<string | null>(null);
  const [selR, setSelR] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongL, setWrongL] = useState<string | null>(null);
  const [wrongR, setWrongR] = useState<string | null>(null);
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
    if (selL === w) { selLRef.current = null; setSelL(null); return; }
    selLRef.current = w; setSelL(w);
    tryMatch(w, selRRef.current);
  };

  const handleR = (w: string) => {
    if (isLocked || matched.has(w)) return;
    if (selR === w) { selRRef.current = null; setSelR(null); return; }
    selRRef.current = w; setSelR(w);
    tryMatch(selLRef.current, w);
  };

  const lState = (w: string): OptionState =>
    matched.has(w) ? "correct" : wrongL === w ? "wrong" : selL === w ? "selected" : "idle";
  const rState = (w: string): OptionState =>
    matched.has(w) ? "correct" : wrongR === w ? "wrong" : selR === w ? "selected" : "idle";

  return (
    <View style={s.root}>
      {/* Eyebrow */}
      <Animated.View entering={FadeInDown.duration(260)}>
        <LiquidEyebrow>Match the pairs</LiquidEyebrow>
      </Animated.View>

      {/* Progress dots */}
      <MatchProgress done={matched.size / 2} total={total} />

      {/* Column labels */}
      <View style={s.colLabels}>
        <Text style={[s.colLabel, { writingDirection: "rtl" }]}>کوردی</Text>
        <Text style={s.colLabel}>English</Text>
      </View>

      {/* Two columns */}
      <View style={s.columns}>
        <View style={s.col}>
          {left.map((w, i) => (
            <MatchChip
              key={w}
              label={w}
              state={lState(w)}
              onPress={() => handleL(w)}
              matched={matched.has(w)}
              delay={i * 55}
              rtl
            />
          ))}
        </View>
        <View style={s.col}>
          {right.map((w, i) => (
            <MatchChip
              key={w}
              label={w}
              state={rState(w)}
              onPress={() => handleR(w)}
              matched={matched.has(w)}
              delay={i * 55 + 30}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 28,
    gap: 14,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginVertical: 4,
  },
  dot: {
    width: 28,
    height: 8,
    borderRadius: Radius.pill,
  },
  colLabels: {
    flexDirection: "row",
  },
  colLabel: {
    flex: 1,
    textAlign: "center",
    ...Type.eyebrow,
    color: "rgba(255,255,255,0.85)",
  },
  columns: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
  },
  col: {
    flex: 1,
    gap: 10,
  },
});
