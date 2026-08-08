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
import { getLanguage } from "../../../config/languages";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { useWordSpeech } from "./use-word-speech";

import { PairMatchQuestion } from "../../../data/lesson-content";
import type { LessonPathMode } from "../../../data/lesson-content";
import { Duo, LightType } from "./lesson-light-design";
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
  isNormal,
  languageCode,
}: {
  label: string;
  state: TileState;
  onPress: () => void;
  matched: boolean;
  rtl?: boolean;
  forceLatinFont?: boolean;
  isKids?: boolean;
  isNormal?: boolean;
  languageCode?: string;
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
        languageCode={languageCode}
        wrapLabel
        centerLabel
        // Normal path wraps instead of shrinking — the tile grows to the text.
        fitLabel={!isNormal}
        fitLabelLines={3}
        isKids={isKids}
        fontSize={isNormal ? undefined : isKids ? 19 : 17}
        style={isNormal ? s.pairTileDuo : s.pairTile}
      />
    </Animated.View>
  );
});

export default function PairMatchGame({ question, onAnswer, pathMode }: Props) {
  const { t, isKu } = useI18n();
  const { colors } = useThemeColors();
  const { speakWord, stop } = useWordSpeech(question.targetLanguage);
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

  /*
   * The native column reads in the native voice and the target column in the
   * target one. `useWordSpeech` drops a language with no device voice — no
   * shipping engine carries Sorani, and `useTTS` would map it onto `ar-IQ` and
   * read Kurdish orthography with Arabic phonology, so the learner would hear a
   * word that is not the one on the tile. The tile stays tappable either way.
   */
  const sourceLanguage = question.sourceLanguage ?? "ku";

  const selLRef = useRef<string | null>(null);
  const selRRef = useRef<string | null>(null);
  const [selL, setSelL] = useState<string | null>(null);
  const [selR, setSelR] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongL, setWrongL] = useState<string | null>(null);
  const [wrongR, setWrongR] = useState<string | null>(null);
  const firedRef = useRef(false);

  React.useEffect(() => {
    void stop();
    selLRef.current = null;
    selRRef.current = null;
    setSelL(null);
    setSelR(null);
    setMatched(new Set());
    setWrongL(null);
    setWrongR(null);
    firedRef.current = false;
  }, [question, stop]);

  React.useEffect(() => () => {
    void stop();
  }, [stop]);

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

  /*
   * Speech follows selection, never deselection. Reading the word aloud is the
   * confirmation that a tile is now picked; saying it again while the tile is
   * being *un*-picked contradicts what the user just did, so the deselect
   * branch returns before anything is spoken.
   */
  const handleL = (w: string) => {
    if (isLocked || matched.has(w)) return;
    if (selL === w) {
      selLRef.current = null;
      setSelL(null);
      void stop();
      return;
    }
    speakWord(w, `pair-source-${w}`, { language: sourceLanguage });
    selLRef.current = w;
    setSelL(w);
    tryMatch(w, selRRef.current);
  };

  const handleR = (w: string) => {
    if (isLocked || matched.has(w)) return;
    if (selR === w) {
      selRRef.current = null;
      setSelR(null);
      void stop();
      return;
    }
    speakWord(w, `pair-target-${w}`);
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
                { backgroundColor: colors.muted },
                i < matchedCount && [s.progressPipDone, { backgroundColor: colors.success }],
              ]}
            />
          ))}
        </View>
        <AppText style={[s.progressLabel, { color: colors.mutedForeground, textAlign: isKu ? "left" : "right" }]}>
          {matchedCount}/{total}
        </AppText>
      </View>

      <View style={s.boardArea}>
        <View style={s.colLabels}>
          <AppText languageCode={question.sourceLanguage} align="center" style={[LightType.label, s.colLabel, { color: colors.mutedForeground }]}>
            {getLanguage(question.sourceLanguage ?? "ku")?.nativeName ?? question.sourceLanguage}
          </AppText>
          <AppText languageCode={question.targetLanguage} align="center" style={[LightType.label, s.colLabel, { color: colors.mutedForeground }]}>
            {getLanguage(question.targetLanguage ?? "en")?.nativeName ?? question.targetLanguage}
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
                languageCode={question.sourceLanguage}
                isKids={isKids}
                isNormal={pathMode === "normal"}
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
                languageCode={question.targetLanguage}
                isKids={isKids}
                isNormal={pathMode === "normal"}
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
    width: "100%",
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
    backgroundColor: Duo.border,
  },
  progressPipDone: {
    backgroundColor: Duo.green,
  },
  progressLabel: {
    minWidth: 36,
    fontSize: 13,
    fontWeight: "800",
    color: Duo.hare,
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
    gap: 16,
  },
  colLabel: {
    flex: 1,
    maxWidth: 164,
    textAlign: "center",
  },
  board: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    alignItems: "flex-start",
    flex: 1,
  },
  column: {
    flex: 1,
    maxWidth: 164,
    gap: 8,
    alignItems: "center",
  },
  pairTile: {
    width: "100%",
    minHeight: 104,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 24,
  },
  pairTileDuo: {
    width: "100%",
    minHeight: 78,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  bottomSpacer: {
    flexGrow: 0,
    minHeight: 8,
  },
});
