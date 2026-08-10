/* eslint-disable */
/**
 * MemoryFlipGame — Card flipping memory matching game.
 * Tap cards to flip them. Match each 3D image to its English name.
 *
 * Fixed bugs:
 * - Uses refs instead of stale closure state for match checking
 * - Requires image ↔ text match (not same-type)
 * - Matched cards stay face-up (isFlipped stays true)
 * - Properly detects completion
 * - Prevents tapping already-flipped cards
 */

import { KidsGameImage } from "../../../components/kids/KidsGameImage";
import { useI18n } from "../../../hooks/useI18n";
import React, { memo, useMemo, useRef, useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Pressable, Platform, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  withSequence,
  Easing,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import Svg, { Path } from "react-native-svg";

import { MemoryFlipQuestion } from "../../../data/lesson-content";
import type { LessonPathMode } from "../../../data/lesson-content";
import { GameHeader, GameRoot } from "./GameAnimatedShell";
import { LightGameHeading } from "./lesson-light-primitives";
import { L, LightMotion } from "./lesson-light-design";
import { crossShadow } from "../../../utils/shadows";
import { AppText } from "../../../components/ui/AppText";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { getLanguageDirection } from "../../../i18n/direction";
import { LayoutDirectionProvider, useLayoutDirection } from "../../../i18n/layout-direction";
import { useWordSpeech } from "./use-word-speech";

type Props = {
  question: MemoryFlipQuestion;
  onAnswer: (correct: boolean | "skip", explanation?: string) => void;
  pathMode?: LessonPathMode;
};

type CardItem = {
  id: string;
  pairKey: string; // shared key between image and text of the same word
  type: "image" | "text";
  value: string;
  image?: any;
  isFlipped: boolean;
  isMatched: boolean;
};

const CARD_SIZE = Math.min(130, (Dimensions.get("window").width - 64) / 2);

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

const MemoryCard = memo(function MemoryCard({
  card,
  onPress,
  isWrong,
  languageCode,
}: {
  card: CardItem;
  onPress: () => void;
  isWrong: boolean;
  languageCode?: string;
}) {
  const { colors, isDark } = useThemeColors();
  const ambientDirection = useLayoutDirection();
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const shakeX = useSharedValue(0);

  const shown = card.isFlipped || card.isMatched;

  useEffect(() => {
    rotation.value = withTiming(shown ? 180 : 0, { duration: 300 });
  }, [shown]);

  useEffect(() => {
    if (isWrong) {
      shakeX.value = withSequence(
        withTiming(-8, { duration: 40 }),
        withTiming(8, { duration: 40 }),
        withTiming(-4, { duration: 40 }),
        withTiming(4, { duration: 40 }),
        withTiming(0, { duration: 50, easing: Easing.out(Easing.quad) })
      );
    }
  }, [isWrong]);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotateY: `${rotation.value}deg` },
        { scale: scale.value },
        { translateX: shakeX.value },
      ],
      backfaceVisibility: "hidden",
      opacity: rotation.value >= 90 ? 0 : 1,
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotateY: `${rotation.value - 180}deg` },
        { scale: scale.value },
        { translateX: shakeX.value },
      ],
      backfaceVisibility: "hidden",
      opacity: rotation.value < 90 ? 0 : 1,
    };
  });

  const cardDirection = getLanguageDirection(languageCode);
  const ltrBoundary =
    Platform.OS !== "web" && cardDirection === "ltr"
      ? ({ direction: "ltr" } as const)
      : undefined;

  return (
    <LayoutDirectionProvider value={ltrBoundary ? "ltr" : ambientDirection}>
    <Pressable
      onPress={() => {
        if (!shown) {
          if (Platform.OS !== "web") void Haptics.selectionAsync();
          onPress();
        }
      }}
      onPressIn={() => {
        if (!shown) scale.value = withSpring(0.95, LightMotion.soft);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, LightMotion.soft);
      }}
      style={[s.cardWrapper, ltrBoundary]}
    >
      {/* Front Side (Face Down — Question Mark) */}
      <Animated.View
        style={[
          s.cardBase,
          s.cardFront,
          frontAnimatedStyle,
          crossShadow({
            color: "#1E1B4B",
            offsetY: 6,
            blur: 12,
            opacity: 0.12,
            elevation: 3,
          }),
        ]}
      >
        <View style={s.logoCircle}>
          <AppText style={s.questionMark} forceLatinFont latinRole="bold">
            ?
          </AppText>
        </View>
      </Animated.View>

      {/* Back Side (Face Up — Image or Text) */}
      <Animated.View
        style={[
          s.cardBase,
          s.cardBack,
          { backgroundColor: colors.surfaceRaised, borderColor: colors.border, borderBottomColor: colors.muted },
          card.isMatched && {
            backgroundColor: colors.successBg,
            borderColor: colors.success,
            borderBottomColor: colors.success,
            borderBottomWidth: 4,
          },
          isWrong && {
            backgroundColor: "rgba(239, 68, 68, 0.22)",
            borderColor: colors.error,
            borderBottomColor: colors.error,
            borderBottomWidth: 4,
          },
          backAnimatedStyle,
          crossShadow({
            color: card.isMatched ? "#15803D" : "#1A2B48",
            offsetY: 6,
            blur: 14,
            opacity: card.isMatched ? 0.15 : 0.08,
            elevation: 4,
          }),
        ]}
      >
        {card.type === "image" ? (
          <KidsGameImage
            source={card.image}
            style={s.cardImage}
            recyclingKey={card.id}
          />
        ) : (
          <AppText
            languageCode={languageCode}
            align="center"
            nativeAlign="start"
            fullWidth
            style={[
              s.cardText,
              {
                color: card.isMatched
                  ? isDark ? "#A7F3D0" : "#14532D"
                  : isWrong
                    ? isDark ? "#FECACA" : "#B91C1C"
                    : colors.foreground,
              },
            ]}
            latinRole="bold"
            numberOfLines={3}
            adjustsFontSizeToFit
            minimumFontScale={0.65}
          >
            {card.value}
          </AppText>
        )}

        {card.isMatched && (
          <View style={s.checkBadge}>
            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
              <Path
                d="M20 6L9 17L4 12"
                stroke="#FFFFFF"
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
        )}
      </Animated.View>
    </Pressable>
    </LayoutDirectionProvider>
  );
});

export default function MemoryFlipGame({ question, onAnswer, pathMode }: Props) {
  const seed = useMemo(() => Math.floor(Math.random() * 1000000), [question.pairs]);

  const [cards, setCards] = useState<CardItem[]>([]);
  const { speakWord } = useWordSpeech(question.targetLanguage);
  const firedRef = useRef(false);
  /**
   * Mirrors `cards` so a tap can inspect the card it hit without doing it
   * inside the `setCards` updater — that callback has to stay pure.
   */
  const cardsRef = useRef<CardItem[]>([]);
  cardsRef.current = cards;
  // Use ref to track currently flipped (but unmatched) card index
  const firstFlippedRef = useRef<number | null>(null);
  const lockRef = useRef(false); // prevents rapid taps during animations
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

  useEffect(() => {
    clearAllTimeouts();

    const rawCards: CardItem[] = [];
    question.pairs.forEach((p, i) => {
      const pairKey = `pair-${p.english}-${i}`;
      // Image Card
      rawCards.push({
        id: `img-${p.english}-${i}`,
        pairKey,
        type: "image",
        value: p.english,
        image: p.image,
        isFlipped: false,
        isMatched: false,
      });
      // Text Card
      rawCards.push({
        id: `txt-${p.english}-${i}`,
        pairKey,
        type: "text",
        value: p.english,
        isFlipped: false,
        isMatched: false,
      });
    });

    setCards(shuffleSeeded(rawCards, seed));
    firstFlippedRef.current = null;
    lockRef.current = false;
    firedRef.current = false;
  }, [question, seed, clearAllTimeouts]);

  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  const handleCardPress = useCallback((index: number) => {
    if (lockRef.current) return;

    // Text cards only. Reading a picture card aloud would name the image, which
    // is the whole thing the learner is here to recall.
    const tapped = cardsRef.current[index];
    if (tapped?.type === "text" && !tapped.isFlipped && !tapped.isMatched) {
      speakWord(tapped.value, `memory-flip-${tapped.id}`);
    }

    setCards((prev) => {
      const card = prev[index];
      // Don't allow tapping already flipped or matched cards
      if (card.isFlipped || card.isMatched) return prev;

      const next = [...prev];
      next[index] = { ...next[index], isFlipped: true };

      if (firstFlippedRef.current === null) {
        // First card — just flip it
        firstFlippedRef.current = index;
        return next;
      }

      // Second card — check for match
      const firstIdx = firstFlippedRef.current;
      const firstCard = next[firstIdx];
      const secondCard = next[index];
      lockRef.current = true;

      // Match requires: same pairKey AND different types (image ↔ text)
      const isMatch =
        firstCard.pairKey === secondCard.pairKey &&
        firstCard.type !== secondCard.type;

      if (isMatch) {
        // Mark both as matched (stay face-up)
        registerTimeout(() => {
          setCards((prev2) => {
            const n = [...prev2];
            n[firstIdx] = { ...n[firstIdx], isMatched: true };
            n[index] = { ...n[index], isMatched: true };

            // Check if ALL cards are matched
            const allMatched = n.every((c) => c.isMatched);
            if (allMatched && !firedRef.current) {
              firedRef.current = true;
              registerTimeout(() => onAnswer(true), 600);
            }

            return n;
          });
          firstFlippedRef.current = null;
          lockRef.current = false;
        }, 500);
      } else {
        // Mismatch — flip both back after a delay
        registerTimeout(() => {
          if (Platform.OS !== "web")
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

          registerTimeout(() => {
            setCards((prev2) => {
              const n = [...prev2];
              n[firstIdx] = { ...n[firstIdx], isFlipped: false };
              n[index] = { ...n[index], isFlipped: false };
              return n;
            });
            firstFlippedRef.current = null;
            lockRef.current = false;
          }, 800);
        }, 600);
      }

      return next;
    });
  }, [onAnswer, registerTimeout, speakWord]);

  const matchedCount = cards.filter((c) => c.isMatched).length / 2;
  const totalPairs = question.pairs.length;

  return (
    <GameRoot style={s.root}>
      <GameHeader>
        <LightGameHeading
          title="Memory Flip"
          subtitle="Match the pictures with their names"
        />
      </GameHeader>

      {/* Progress pips */}
      <View style={s.progressRow}>
        <View style={s.progressTrack}>
          {Array.from({ length: totalPairs }).map((_, i) => (
            <View
              key={i}
              style={[
                s.progressPip,
                i < matchedCount && s.progressPipDone,
              ]}
            />
          ))}
        </View>
        <AppText style={s.progressLabel} forceLatinFont>
          {matchedCount}/{totalPairs}
        </AppText>
      </View>

      <View style={s.gridContainer}>
        <View style={s.grid}>
          {cards.map((card, idx) => (
            <MemoryCard
              key={card.id}
              card={card}
              onPress={() => handleCardPress(idx)}
              isWrong={false}
              languageCode={question.targetLanguage}
            />
          ))}
        </View>
      </View>
    </GameRoot>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 4,
    marginTop: 8,
    marginBottom: 16,
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
    backgroundColor: "#E2E8F0",
  },
  progressPipDone: {
    backgroundColor: L.green,
  },
  progressLabel: {
    minWidth: 36,
    fontSize: 13,
    fontWeight: "800",
    color: "#94A3B8",
    fontFamily: "Rabar_044",
    textAlign: "right",
  },
  gridContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 14,
    width: "100%",
    maxWidth: 320,
  },
  cardWrapper: {
    width: CARD_SIZE,
    height: CARD_SIZE,
  },
  cardBase: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
    borderWidth: 2.5,
    alignItems: "center",
    justifyContent: "center",
    backfaceVisibility: "hidden",
  },
  cardFront: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#6366F1",
    borderColor: "#4F46E5",
    borderBottomWidth: 7,
    borderBottomColor: "#3730A3",
  },
  cardBack: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderBottomWidth: 6,
    borderBottomColor: "#D1D5DB",
    padding: 10,
  },
  cardMatched: {
    backgroundColor: "#BBF7D0",
    borderColor: "#16A34A",
    borderBottomWidth: 4,
    borderBottomColor: "#15803D",
  },
  cardWrong: {
    backgroundColor: "#FEF2F2",
    borderColor: "#EF4444",
    borderBottomWidth: 4,
    borderBottomColor: "#B91C1C",
  },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  questionMark: {
    fontSize: 24,
    color: "#FFFFFF",
    marginTop: -2,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardText: {
    fontSize: 16,
    color: "#1E293B",
    textAlign: "center",
    fontFamily: "Rabar_044",
  },
  checkBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#16A34A",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
});
