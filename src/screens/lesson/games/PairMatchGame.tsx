/**
 * PairMatchGame — iOS 26 Liquid Glass redesign.
 */

import React, { memo, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming,
} from "react-native-reanimated";

import { PairMatchQuestion } from "@/data/lesson-content";
import { iOS, Radius, Type } from "./game-design";
import { ltrText, rtlText } from "./game-text";
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

const MatchChip = memo(function MatchChip({
  label,
  state,
  onPress,
  matched,
  rtl = false,
}: {
  label: string;
  state: OptionState;
  onPress: () => void;
  matched: boolean;
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
  }, [state, shakeX]);

  React.useEffect(() => {
    if (matched) {
      chipScale.value = withTiming(0.94, { duration: 180, easing: Easing.out(Easing.quad) });
      opac.value = withTiming(0.75, { duration: 200, easing: Easing.out(Easing.quad) });
    } else {
      chipScale.value = withTiming(1, { duration: 140 });
      opac.value = withTiming(1, { duration: 140 });
    }
  }, [matched, chipScale, opac]);

  const wrapStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }, { scale: chipScale.value }],
    opacity: opac.value,
  }));

  return (
    <Animated.View style={wrapStyle}>
      <LiquidWordChip
        label={label}
        state={state}
        onPress={onPress}
        disabled={matched}
        rtl={rtl}
      />
    </Animated.View>
  );
});

function MatchProgress({ done, total }: { done: number; total: number }) {
  return (
    <View style={s.dotsRow}>
      {Array.from({ length: total }).map((_, i) => (
        <View
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
      <LiquidEyebrow>Match the pairs</LiquidEyebrow>

      <MatchProgress done={matched.size / 2} total={total} />

      <View style={s.colLabels}>
        <Text style={[s.colLabel, s.colLabelKu]}>کوردی</Text>
        <Text style={[s.colLabel, s.colLabelEn]}>English</Text>
      </View>

      <View style={s.columns}>
        <View style={s.col}>
          {left.map((w) => (
            <MatchChip
              key={w}
              label={w}
              state={lState(w)}
              onPress={() => handleL(w)}
              matched={matched.has(w)}
              rtl
            />
          ))}
        </View>
        <View style={s.col}>
          {right.map((w) => (
            <MatchChip
              key={w}
              label={w}
              state={rState(w)}
              onPress={() => handleR(w)}
              matched={matched.has(w)}
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
    gap: 12,
  },
  colLabel: {
    flex: 1,
    ...Type.eyebrow,
    color: "rgba(255,255,255,0.85)",
  },
  colLabelKu: {
    ...rtlText,
  },
  colLabelEn: {
    ...ltrText,
    textAlign: "center",
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
