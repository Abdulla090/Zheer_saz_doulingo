/* eslint-disable */
/**
 * PictureMatchGame — Premium column matching game for kids.
 * One column shows the 3D smooth transparent cartoon images,
 * and the other column shows the English names.
 *
 * Fixed bugs:
 * - matched set tracks individual words correctly (not doubled)
 * - completion check compares matched count vs total pairs
 * - disabled state prevents tapping matched tiles
 * - proper state cleanup between questions
 */

import { KidsGameImage } from "../../../components/kids/KidsGameImage";
import { useI18n } from "../../../hooks/useI18n";
import React, { memo, useMemo, useRef, useState, useCallback } from "react";
import { StyleSheet, View, Pressable, Platform } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { AppText } from "../../../components/ui/AppText";
import { ImagePairMatchQuestion } from "../../../data/lesson-content";
import type { LessonPathMode } from "../../../data/lesson-content";
import { L, LightMotion } from "./lesson-light-design";
import {
  LightGameHeading,
  LightWordTile,
} from "./lesson-light-primitives";
import { GameHeader, GameRoot } from "./GameAnimatedShell";
import { crossShadow } from "../../../utils/shadows";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { useWordSpeech } from "./use-word-speech";

type Props = {
  question: ImagePairMatchQuestion;
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

const ImageTile = memo(function ImageTile({
  image,
  state,
  onPress,
  disabled,
}: {
  image: any;
  state: TileState;
  onPress: () => void;
  disabled: boolean;
}) {
  const { colors } = useThemeColors();
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animScale = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  const bgStyle = useMemo(() => {
    switch (state) {
      case "selected":
        return { backgroundColor: "#7DD3FC", borderColor: "#38BDF8", borderBottomColor: "#0284C7" };
      case "correct":
        return { backgroundColor: "#BBF7D0", borderColor: "#16A34A", borderBottomColor: "#15803D" };
      case "wrong":
        return { backgroundColor: "#FEF2F2", borderColor: "#EF4444", borderBottomColor: "#B91C1C" };
      default:
        return { backgroundColor: colors.surfaceRaised, borderColor: colors.border, borderBottomColor: colors.muted };
    }
  }, [colors, state]);

  return (
    <Animated.View style={[animScale, s.chipWrap]}>
      <Pressable
        onPress={() => {
          if (Platform.OS !== "web") void Haptics.selectionAsync();
          onPress();
        }}
        onPressIn={() => {
          scale.value = withSpring(0.97, LightMotion.soft);
          translateY.value = withSpring(4, LightMotion.soft);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, LightMotion.soft);
          translateY.value = withSpring(0, LightMotion.soft);
        }}
        disabled={disabled}
      >
        <View
          style={[
            s.imageTile,
            bgStyle,
            state !== "idle" && { borderBottomWidth: 4 },
            crossShadow({
              color: "#1A2B48",
              offsetY: 8,
              blur: 16,
              opacity: 0.1,
              elevation: 4,
            }),
          ]}
        >
          <KidsGameImage
            source={image}
            style={s.tileImage}
            wellStyle={s.tileImageWell}
          />
        </View>
      </Pressable>
    </Animated.View>
  );
});

export default function PictureMatchGame({ question, onAnswer, pathMode }: Props) {
  const { t, isKu } = useI18n();
  const isKids = pathMode === "kids";
  const { speakWord } = useWordSpeech(question.targetLanguage);
  const seed = useMemo(() => Math.floor(Math.random() * 1000000), [question.pairs]);

  // Build stable unique IDs for left (image) and right (text) items
  // Each pair has a unique index — left items use "L-{word}-{idx}", right items use "R-{word}-{idx}"
  // We match by checking if both sides refer to the same pair index
  const pairsData = useMemo(() => {
    return question.pairs.map((p, i) => ({
      word: p.english,
      image: p.image,
      pairIdx: i,
    }));
  }, [question.pairs]);

  const total = pairsData.length;

  const leftItems = useMemo(() =>
    shuffleSeeded(
      pairsData.map((p) => ({ word: p.word, image: p.image, pairIdx: p.pairIdx })),
      seed
    ),
    [pairsData, seed]
  );

  const rightItems = useMemo(() =>
    shuffleSeeded(
      pairsData.map((p) => ({ word: p.word, pairIdx: p.pairIdx })),
      seed + 1
    ),
    [pairsData, seed]
  );

  // Track selections by pairIdx
  const [selL, setSelL] = useState<number | null>(null); // pairIdx of selected left
  const [selR, setSelR] = useState<number | null>(null); // pairIdx of selected right
  const [matched, setMatched] = useState<Set<number>>(new Set()); // matched pairIdx set
  const [wrongL, setWrongL] = useState<number | null>(null);
  const [wrongR, setWrongR] = useState<number | null>(null);
  const firedRef = useRef(false);
  const lockRef = useRef(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const registerTimeout = useCallback((cb: () => void, ms: number) => {
    const id = setTimeout(() => {
      timeoutsRef.current = timeoutsRef.current.filter((t) => t !== id);
      cb();
    }, ms);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  // Selection refs to avoid stale closures
  const selLRef = useRef<number | null>(null);
  const selRRef = useRef<number | null>(null);

  React.useEffect(() => {
    clearAllTimeouts();
    selLRef.current = null;
    selRRef.current = null;
    setSelL(null);
    setSelR(null);
    setMatched(new Set());
    setWrongL(null);
    setWrongR(null);
    firedRef.current = false;
    lockRef.current = false;
  }, [question, clearAllTimeouts]);

  React.useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  const matchedCount = matched.size;
  const isLocked = wrongL !== null || wrongR !== null || lockRef.current;

  const tryMatch = useCallback((pendL: number | null, pendR: number | null) => {
    if (pendL === null || pendR === null) return;

    const isCorrect = pendL === pendR; // Same pair index = correct match

    if (isCorrect) {
      if (Platform.OS !== "web") void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setMatched((cur) => {
        const next = new Set(cur);
        next.add(pendL);
        if (next.size === total && !firedRef.current) {
          firedRef.current = true;
          registerTimeout(() => onAnswer(true), 600);
        }
        return next;
      });
      setSelL(null);
      setSelR(null);
      selLRef.current = null;
      selRRef.current = null;
    } else {
      lockRef.current = true;
      setWrongL(pendL);
      setWrongR(pendR);
      if (Platform.OS !== "web") void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      registerTimeout(() => {
        setSelL(null);
        setSelR(null);
        setWrongL(null);
        setWrongR(null);
        selLRef.current = null;
        selRRef.current = null;
        lockRef.current = false;
      }, 680);
    }
  }, [total, onAnswer, registerTimeout]);

  const handleL = useCallback((pairIdx: number) => {
    if (isLocked || matched.has(pairIdx)) return;
    if (selLRef.current === pairIdx) {
      selLRef.current = null;
      setSelL(null);
      return;
    }
    selLRef.current = pairIdx;
    setSelL(pairIdx);
    tryMatch(pairIdx, selRRef.current);
  }, [isLocked, matched, tryMatch]);

  const handleR = useCallback((pairIdx: number) => {
    if (isLocked || matched.has(pairIdx)) return;
    if (selRRef.current === pairIdx) {
      selRRef.current = null;
      setSelR(null);
      return;
    }
    selRRef.current = pairIdx;
    setSelR(pairIdx);
    // Word column only — the picture column stays silent, since naming an image
    // out loud would hand over the pairing this game is testing. Deselecting
    // returns above, so this only fires when a word is actually picked.
    speakWord(pairsData[pairIdx]?.word, `picture-match-word-${pairIdx}`);
    tryMatch(selLRef.current, pairIdx);
  }, [isLocked, matched, tryMatch, speakWord, pairsData]);

  const lState = (pairIdx: number): TileState =>
    matched.has(pairIdx)
      ? "correct"
      : wrongL === pairIdx
        ? "wrong"
        : selL === pairIdx
          ? "selected"
          : "idle";

  const rState = (pairIdx: number): TileState =>
    matched.has(pairIdx)
      ? "correct"
      : wrongR === pairIdx
        ? "wrong"
        : selR === pairIdx
          ? "selected"
          : "idle";

  return (
    <GameRoot style={s.root}>
      <GameHeader>
        <LightGameHeading title="Match the Pairs" />
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
          <AppText style={[LightType.label, s.colLabel]} forceLatinFont>
            Picture
          </AppText>
          <AppText style={[LightType.label, s.colLabel]} forceLatinFont>
            Name
          </AppText>
        </View>

        <View style={s.board}>
          <View style={s.column}>
            {leftItems.map((item, i) => (
              <ImageTile
                key={`img-${item.word}-${item.pairIdx}`}
                image={item.image}
                state={lState(item.pairIdx)}
                onPress={() => handleL(item.pairIdx)}
                disabled={matched.has(item.pairIdx)}
              />
            ))}
          </View>

          <View style={s.column}>
            {rightItems.map((item, i) => (
              <View key={`text-${item.word}-${item.pairIdx}`} style={s.chipWrap}>
                <LightWordTile
                  label={item.word}
                  state={rState(item.pairIdx)}
                  onPress={() => handleR(item.pairIdx)}
                  disabled={matched.has(item.pairIdx)}
                  languageCode={question.targetLanguage}
                  wrapLabel
                  centerLabel
                  fitLabel
                  fitLabelLines={3}
                  isKids={isKids}
                  fontSize={isKids ? 19 : 17}
                  style={s.pairTile}
                />
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={s.bottomSpacer} />
    </GameRoot>
  );
}

const LightType = {
  label: {
    fontSize: 11,
    fontWeight: "800" as const,
    letterSpacing: 0.6,
    color: "#94A3B8",
    fontFamily: "DINNextRoundedBold",
    textTransform: "uppercase" as const,
  },
};

const s = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
    gap: 10,
  },
  chipWrap: {
    width: 140,
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
    gap: 36,
  },
  colLabel: {
    width: 140,
    textAlign: "center",
  },
  board: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    alignItems: "flex-start",
    flex: 1,
  },
  column: {
    width: 140,
    gap: 8,
    alignItems: "center",
  },
  imageTile: {
    width: 140,
    height: 72,
    borderRadius: 20,
    borderWidth: 2,
    borderBottomWidth: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    padding: 6,
  },
  tileImageWell: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
  },
  tileImage: {
    width: "100%",
    height: "100%",
  },
  pairTile: {
    width: 140,
    minHeight: 72,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  bottomSpacer: {
    flexGrow: 0,
    minHeight: 8,
  },
});
