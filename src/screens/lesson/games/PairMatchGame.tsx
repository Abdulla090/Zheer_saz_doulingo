/**
 * PairMatchGame — Premium light UI ("Pair the words").
 */

import { useI18n } from "@/hooks/useI18n";
import React, { memo, useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { PairMatchQuestion } from "@/data/lesson-content";
import type { LessonPathMode } from "@/data/lesson-content";
import { L, LightType } from "./lesson-light-design";
import {
  LightGameHeading,
  LightSurfaceCard,
  LightWordTile,
} from "./lesson-light-primitives";
import { GameHeader, GameOption, GameRoot } from "./GameAnimatedShell";

type Props = {
  question: PairMatchQuestion;
  onAnswer: (correct: boolean, explanation?: string) => void;
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

function pairSeed(pairs: PairMatchQuestion["pairs"]): number {
  let h = 0;
  const key = pairs.map((p) => `${p.kurdish}|${p.english}`).join(";");
  for (let i = 0; i < key.length; i++) {
    h = (Math.imul(31, h) + key.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
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
    opacity: matched ? 0.5 : 1,
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
        wide
        wrapLabel
      />
    </Animated.View>
  );
});

export default function PairMatchGame({ question, onAnswer }: Props) {
  const { t } = useI18n();
  const seed = useMemo(() => pairSeed(question.pairs), [question.pairs]);
  const [left] = useState(() =>
    shuffleSeeded(
      question.pairs.map((p) => p.kurdish),
      seed,
    ),
  );
  const [right] = useState(() =>
    shuffleSeeded(
      question.pairs.map((p) => p.english),
      seed + 1,
    ),
  );

  const selLRef = useRef<string | null>(null);
  const selRRef = useRef<string | null>(null);
  const [selL, setSelL] = useState<string | null>(null);
  const [selR, setSelR] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongL, setWrongL] = useState<string | null>(null);
  const [wrongR, setWrongR] = useState<string | null>(null);
  const firedRef = useRef(false);
  const total = question.pairs.length;
  const matchedCount = matched.size / 2;

  const isLocked = wrongL !== null || wrongR !== null;
  const awaitingPair = (selL !== null) !== (selR !== null);

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
          title={t("lessons.pairWords")}
          subtitle={t("lessons.pairWordsSub")}
        />
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
        <Text style={s.progressLabel}>
          {matchedCount}/{total}
        </Text>
      </View>

      <LightSurfaceCard style={s.boardCard}>
        <ScrollView
          style={s.boardScroll}
          contentContainerStyle={s.boardScrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={s.colLabels}>
            <Text style={[LightType.label, s.colLabel, { textAlign: "right" }]}>
              کوردی
            </Text>
            <View style={s.colDivider} />
            <Text style={[LightType.label, s.colLabel]}>English</Text>
          </View>

          <View style={s.board}>
            <View style={s.column}>
              {left.map((lw, i) => (
                <GameOption key={`${lw}-${i}`} index={i} baseDelay={80}>
                  <MatchChip
                    label={lw}
                    state={lState(lw)}
                    onPress={() => handleL(lw)}
                    matched={matched.has(lw)}
                    rtl
                  />
                </GameOption>
              ))}
            </View>

            <View style={s.boardDivider} />

            <View style={s.column}>
              {right.map((rw, i) => (
                <GameOption key={`${rw}-${i}`} index={i} baseDelay={80}>
                  <MatchChip
                    label={rw}
                    state={rState(rw)}
                    onPress={() => handleR(rw)}
                    matched={matched.has(rw)}
                  />
                </GameOption>
              ))}
            </View>
          </View>

          {awaitingPair ? (
            <View style={s.hintRow}>
              <View style={s.hintDot} />
              <Text style={s.hintText}>
                {selL ? t("lessons.pairPickEnglish") : t("lessons.pairPickKurdish")}
              </Text>
            </View>
          ) : null}
        </ScrollView>
      </LightSurfaceCard>

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
    width: "100%",
    alignSelf: "stretch",
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
  boardCard: {
    flex: 1,
    minHeight: 0,
    padding: 14,
  },
  boardScroll: {
    flex: 1,
  },
  boardScrollContent: {
    flexGrow: 1,
    paddingBottom: 4,
  },
  colLabels: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  colLabel: {
    flex: 1,
  },
  colDivider: { width: 1 },
  board: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  column: {
    flex: 1,
    gap: 8,
    justifyContent: "flex-start",
  },
  boardDivider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: L.trackInner,
    borderRadius: 1,
    marginVertical: 4,
  },
  hintRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: L.border,
  },
  hintDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: L.blue,
  },
  hintText: {
    fontSize: 14,
    fontWeight: "600",
    color: L.gray,
    fontFamily: "DINNextRoundedMedium",
  },
  bottomSpacer: {
    flexGrow: 0,
    minHeight: 8,
  },
});
