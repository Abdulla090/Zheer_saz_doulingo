/* eslint-disable */
/**
 * PairMatchGame — Premium light UI ("Pair the words").
 */

import { useI18n } from "../../../hooks/useI18n";
import React, { memo, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { AppText } from "../../../components/ui/AppText";

import { PairMatchQuestion } from "../../../data/lesson-content";
import type { LessonPathMode } from "../../../data/lesson-content";
import { L, LightType } from "./lesson-light-design";
import {
  LightGameHeading,
  LightWordTile,
} from "./lesson-light-primitives";
import { GameHeader, GameRoot } from "./GameAnimatedShell";

type Props = {
  question: PairMatchQuestion;
  onAnswer: (correct: boolean | "skip", explanation?: string) => void;
  pathMode?: LessonPathMode;
};

type TileState = "idle" | "selected" | "correct" | "wrong";

function shuffleSeeded<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const MatchChip = memo(function MatchChip({
  label,
  state,
  onPress,
  matched,
  rtl,
  forceLatinFont,
  isKids,
}: {
  label: string;
  state: TileState;
  onPress: () => void;
  matched: boolean;
  rtl?: boolean;
  forceLatinFont?: boolean;
  isKids?: boolean;
}) {
  const shakeX = useSharedValue(0);
  const wrapStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
    opacity: matched ? 0.85 : 1,
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
    <Animated.View style={[wrapStyle, s.chipWrap]}>
      <LightWordTile
        label={label}
        state={state}
        onPress={onPress}
        disabled={matched}
        rtl={rtl}
        forceLatinFont={forceLatinFont}
        wrapLabel
        centerLabel
        isKids={isKids}
        fontSize={isKids ? 19 : 17}
        style={s.pairTile}
      />
    </Animated.View>
  );
});

export default function PairMatchGame({ question, onAnswer, pathMode }: Props) {
  const { t, isKu } = useI18n();
  const isKids = pathMode === "kids";
  const seed = useMemo(() => Math.floor(Math.random() * 1000000), [question.pairs]);
  const left = useMemo(() =>
    shuffleSeeded(
      question.pairs.map((p) => p.kurdish),
      seed,
    ),
    [question.pairs, seed]
  );
  const right = useMemo(() =>
    shuffleSeeded(
      question.pairs.map((p) => p.english),
      seed + 1,
    ),
    [question.pairs, seed]
  );

  const selLRef = useRef<string | null>(null);
  const selRRef = useRef<string | null>(null);
  const [selL, setSelL] = useState<string | null>(null);
  const [selR, setSelR] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongL, setWrongL] = useState<string | null>(null);
  const [wrongR, setWrongR] = useState<string | null>(null);
  const firedRef = useRef(false);

  React.useEffect(() => {
    selLRef.current = null;
    selRRef.current = null;
    setSelL(null);
    setSelR(null);
    setMatched(new Set());
    setWrongL(null);
    setWrongR(null);
    firedRef.current = false;
  }, [question]);

  const total = question.pairs.length;
  const matchedCount = matched.size / 2;

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
          setTimeout(() => onAnswer(true), 600);
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
        <LightGameHeading title={t("lessons.pairWords")} />
      </GameHeader>

      <View style={s.progressRow}>
        <View style={s.progressTrack}>
          {Array.from({ length: total }).map((_, i) => (
            <View
              key={i}
              style={[
                s.progressPip,
                i < matchedCount && s.progressPipDone,
              ]}
            />
          ))}
        </View>
        <AppText style={[s.progressLabel, { textAlign: isKu ? "left" : "right" }]}>
          {matchedCount}/{total}
        </AppText>
      </View>

      <View style={s.boardArea}>
        <View style={s.colLabels}>
          <AppText style={[LightType.label, s.colLabel]} forceKurdishFont>
            کوردی
          </AppText>
          <AppText style={[LightType.label, s.colLabel]} forceLatinFont>
            English
          </AppText>
        </View>

        <View style={s.board}>
          <View style={s.column}>
            {left.map((lw, i) => (
              <MatchChip
                key={`${lw}-${i}`}
                label={lw}
                state={lState(lw)}
                onPress={() => handleL(lw)}
                matched={matched.has(lw)}
                rtl
                isKids={isKids}
              />
            ))}
          </View>

          <View style={s.column}>
            {right.map((rw, i) => (
              <MatchChip
                key={`${rw}-${i}`}
                label={rw}
                state={rState(rw)}
                onPress={() => handleR(rw)}
                matched={matched.has(rw)}
                forceLatinFont
                isKids={isKids}
              />
            ))}
          </View>
        </View>
      </View>

      <View style={s.bottomSpacer} />
    </GameRoot>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
    gap: 10,
  },
  chipWrap: {
    width: 132,
    alignSelf: "center",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 4,
  },
  progressTrack: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
  },
  progressPip: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: L.track,
  },
  progressPipDone: {
    backgroundColor: L.green,
  },
  progressLabel: {
    minWidth: 36,
    fontSize: 13,
    fontWeight: "800",
    color: L.gray,
    fontFamily: "DINNextRoundedBold",
    textAlign: "right",
  },
  boardArea: {
    flex: 1,
    minHeight: 0,
    backgroundColor: "transparent",
    paddingHorizontal: 2,
    paddingTop: 4,
  },
  colLabels: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    gap: 40,
  },
  colLabel: {
    width: 132,
    textAlign: "center",
  },
  board: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 36,
    alignItems: "flex-start",
    flex: 1,
  },
  column: {
    width: 132,
    gap: 8,
    alignItems: "center",
  },
  pairTile: {
    width: 132,
    minHeight: 72,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 24,
  },
  bottomSpacer: {
    flexGrow: 0,
    minHeight: 8,
  },
});
