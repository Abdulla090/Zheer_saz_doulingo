/**
 * PairMatchGame — Premium light UI ("Pair the words").
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
import { L } from "./lesson-light-design";
import {
  LightGameHeading,
  LightWordTile,
} from "./lesson-light-primitives";
import { GameHeader, GameRoot } from "./GameAnimatedShell";

type Props = {
  question: PairMatchQuestion;
  onAnswer: (correct: boolean, explanation?: string) => void;
};

type TileState = "idle" | "selected" | "correct" | "wrong";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

const MatchChip = memo(function MatchChip({
  label,
  state,
  onPress,
  matched,
  rtl,
}: {
  label: string;
  state: TileState;
  onPress: () => void;
  matched: boolean;
  rtl?: boolean;
}) {
  const shakeX = useSharedValue(0);
  const wrapStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
    opacity: matched ? 0.55 : 1,
  }));

  React.useEffect(() => {
    if (state === "wrong") {
      shakeX.value = withSequence(
        withTiming(-7, { duration: 36 }),
        withTiming(7, { duration: 36 }),
        withTiming(0, { duration: 40, easing: Easing.out(Easing.quad) }),
      );
    }
  }, [state, shakeX]);

  return (
    <Animated.View style={wrapStyle}>
      <LightWordTile
        label={label}
        state={state}
        onPress={onPress}
        disabled={matched}
        rtl={rtl}
      />
    </Animated.View>
  );
});

export default function PairMatchGame({ question, onAnswer }: Props) {
  const [left] = useState(() => shuffle(question.pairs.map((p) => p.kurdish)));
  const [right] = useState(() => shuffle(question.pairs.map((p) => p.english)));

  const selLRef = useRef<string | null>(null);
  const selRRef = useRef<string | null>(null);
  const [selL, setSelL] = useState<string | null>(null);
  const [selR, setSelR] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongL, setWrongL] = useState<string | null>(null);
  const [wrongR, setWrongR] = useState<string | null>(null);
  const firedRef = useRef(false);
  const total = question.pairs.length;
  const rowCount = Math.max(left.length, right.length);

  const isLocked = wrongL !== null || wrongR !== null;

  const tryMatch = (pendL: string | null, pendR: string | null) => {
    if (!pendL || !pendR) return;
    const ok = question.pairs.some(
      (p) => p.kurdish === pendL && p.english === pendR,
    );
    if (ok) {
      setMatched((cur) => {
        const next = new Set(cur).add(pendL).add(pendR);
        if (next.size / 2 === total && !firedRef.current) {
          firedRef.current = true;
          setTimeout(() => onAnswer(true), 480);
        }
        return next;
      });
      setSelL(null);
      setSelR(null);
      selLRef.current = null;
      selRRef.current = null;
    } else {
      setWrongL(pendL);
      setWrongR(pendR);
      setTimeout(() => {
        setSelL(null);
        setSelR(null);
        setWrongL(null);
        setWrongR(null);
        selLRef.current = null;
        selRRef.current = null;
      }, 680);
    }
  };

  const handleL = (w: string) => {
    if (isLocked || matched.has(w)) return;
    if (selL === w) {
      selLRef.current = null;
      setSelL(null);
      return;
    }
    selLRef.current = w;
    setSelL(w);
    tryMatch(w, selRRef.current);
  };

  const handleR = (w: string) => {
    if (isLocked || matched.has(w)) return;
    if (selR === w) {
      selRRef.current = null;
      setSelR(null);
      return;
    }
    selRRef.current = w;
    setSelR(w);
    tryMatch(selLRef.current, w);
  };

  const lState = (w: string): TileState =>
    matched.has(w)
      ? "correct"
      : wrongL === w
        ? "wrong"
        : selL === w
          ? "selected"
          : "idle";

  const rState = (w: string): TileState =>
    matched.has(w)
      ? "correct"
      : wrongR === w
        ? "wrong"
        : selR === w
          ? "selected"
          : "idle";

  return (
    <GameRoot style={s.root}>
      <GameHeader>
        <LightGameHeading
          title="Pair the words"
          subtitle="Match each word with its meaning."
        />
      </GameHeader>

      <View style={s.progressRow}>
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={[
              s.progressPip,
              i < matched.size / 2 && s.progressPipDone,
            ]}
          />
        ))}
      </View>

      <View style={s.colLabels}>
        <Text style={[s.colLabel, { textAlign: "right" }]}>کوردی</Text>
        <View style={s.colLabelSpacer} />
        <Text style={s.colLabel}>English</Text>
      </View>

      <View style={s.grid}>
        {Array.from({ length: rowCount }).map((_, row) => {
          const lw = left[row];
          const rw = right[row];
          return (
            <View key={row} style={s.row}>
              <View style={s.side}>
                {lw ? (
                  <MatchChip
                    label={lw}
                    state={lState(lw)}
                    onPress={() => handleL(lw)}
                    matched={matched.has(lw)}
                    rtl
                  />
                ) : (
                  <View style={s.sidePlaceholder} />
                )}
              </View>
              <View style={s.dotCol}>
                <View
                  style={[
                    s.dot,
                    (selL === lw || selR === rw) && s.dotActive,
                    matched.has(lw ?? "") && s.dotMatched,
                  ]}
                />
              </View>
              <View style={s.side}>
                {rw ? (
                  <MatchChip
                    label={rw}
                    state={rState(rw)}
                    onPress={() => handleR(rw)}
                    matched={matched.has(rw)}
                  />
                ) : (
                  <View style={s.sidePlaceholder} />
                )}
              </View>
            </View>
          );
        })}
      </View>
    </GameRoot>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 8,
    gap: 14,
  },
  progressRow: {
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
  },
  progressPip: {
    flex: 1,
    maxWidth: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: L.track,
  },
  progressPipDone: {
    backgroundColor: L.green,
  },
  colLabels: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  colLabel: {
    flex: 1,
    fontSize: 11,
    fontWeight: "800",
    color: L.grayLight,
    letterSpacing: 0.5,
    fontFamily: "DINNextRoundedBold",
    textTransform: "uppercase",
  },
  colLabelSpacer: { width: 20 },
  grid: { flex: 1, gap: 10 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  side: { flex: 1 },
  sidePlaceholder: { height: 48 },
  dotCol: {
    width: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: L.track,
  },
  dotActive: {
    backgroundColor: L.blue,
    transform: [{ scale: 1.25 }],
  },
  dotMatched: {
    backgroundColor: L.green,
  },
});
