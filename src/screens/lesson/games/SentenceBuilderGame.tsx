/**
 * SentenceBuilderGame — Premium light UI ("Order the words").
 * Word tiles morph from the bank into answer slots via a Reanimated fly transition.
 */
/* eslint-disable react-hooks/immutability */

import { layoutMorph, tileFlyTiming } from "@/components/animations/motion";
import { useI18n } from "@/hooks/useI18n";
import * as Haptics from "expo-haptics";
import React, { useCallback, useRef, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type View as RNView,
} from "react-native";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { SentenceBuilderQuestion } from "@/data/lesson-content";
import type { LessonPathMode } from "@/data/lesson-content";
import { L } from "./lesson-light-design";
import {
  LightCheckButton,
  LightGameHeading,
  LightHintButton,
  LightQuestionPrompt,
  LightWordTile,
  type LightTileState,
} from "./lesson-light-primitives";
import {
  GameFooter,
  GameHeader,
  GameRoot,
} from "./GameAnimatedShell";

type Props = {
  question: SentenceBuilderQuestion;
  onAnswer: (correct: boolean, explanation?: string) => void;
  pathMode?: LessonPathMode;
};

type Placed = { word: string; id: string; bankIndex: number };
type FBState = "idle" | "correct" | "wrong";

type FlySession = {
  bankIndex: number;
  word: string;
  slotIndex: number;
};

function measureInRoot(
  view: RNView,
  root: RNView,
  onResult: (x: number, y: number, w: number, h: number) => void,
) {
  view.measureInWindow((vx, vy, vw, vh) => {
    root.measureInWindow((rx, ry) => {
      onResult(vx - rx, vy - ry, vw, vh);
    });
  });
}

export default function SentenceBuilderGame({ question, onAnswer, pathMode }: Props) {
  const { t } = useI18n();
  const [sentence, setSentence] = useState<Placed[]>([]);
  const [usedBank, setUsedBank] = useState(() =>
    question.wordBank.map(() => false),
  );
  const [fb, setFb] = useState<FBState>("idle");
  const [flySession, setFlySession] = useState<FlySession | null>(null);

  const slotN = useRef(0);
  const completedRef = useRef(false);
  const wrongSentRef = useRef(false);
  const rootRef = useRef<RNView>(null);
  const bankRefs = useRef<(RNView | null)[]>([]);
  const slotRefs = useRef<(RNView | null)[]>([]);

  const shakeX = useSharedValue(0);
  const flyProgress = useSharedValue(0);
  const flyFromX = useSharedValue(0);
  const flyFromY = useSharedValue(0);
  const flyFromW = useSharedValue(0);
  const flyFromH = useSharedValue(0);
  const flyToX = useSharedValue(0);
  const flyToY = useSharedValue(0);
  const flyToW = useSharedValue(0);
  const flyToH = useSharedValue(0);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const flyStyle = useAnimatedStyle(() => {
    const p = flyProgress.value;
    return {
      position: "absolute",
      left: interpolate(p, [0, 1], [flyFromX.value, flyToX.value]),
      top: interpolate(p, [0, 1], [flyFromY.value, flyToY.value]),
      width: interpolate(p, [0, 1], [flyFromW.value, flyToW.value]),
      height: interpolate(p, [0, 1], [flyFromH.value, flyToH.value]),
      transform: [
        {
          scale: interpolate(p, [0, 0.55, 1], [1, 1.05, 1]),
        },
      ],
      opacity: 1,
    };
  });

  const slotCount = question.correctWords.length;

  const commitAddWord = useCallback(
    (bankIndex: number) => {
      const w = question.wordBank[bankIndex];
      const id = `s${slotN.current++}`;
      setUsedBank((prev) => {
        const next = [...prev];
        next[bankIndex] = true;
        return next;
      });
      setSentence((p) => [...p, { word: w, id, bankIndex }]);
    },
    [question.wordBank],
  );

  const finishFly = useCallback(
    (bankIndex: number) => {
      commitAddWord(bankIndex);
      // Clear the fly overlay on the next frame so the slot tile is painted first.
      requestAnimationFrame(() => {
        setFlySession(null);
      });
    },
    [commitAddWord],
  );

  const startFlyToSlot = useCallback(
    (bankIndex: number) => {
      if (flySession) return;
      if (fb === "correct") return;
      if (usedBank[bankIndex]) return;
      if (sentence.length >= slotCount) return;

      const word = question.wordBank[bankIndex];
      const slotIndex = sentence.length;
      const bankView = bankRefs.current[bankIndex];
      const slotView = slotRefs.current[slotIndex];
      const root = rootRef.current;

      const runFly = (
        fromX: number,
        fromY: number,
        fromW: number,
        fromH: number,
        toX: number,
        toY: number,
        toW: number,
        toH: number,
      ) => {
        setFlySession({ bankIndex, word, slotIndex: slotIndex });
        flyFromX.value = fromX;
        flyFromY.value = fromY;
        flyFromW.value = fromW;
        flyFromH.value = fromH;
        flyToX.value = toX;
        flyToY.value = toY;
        flyToW.value = toW;
        flyToH.value = toH;
        flyProgress.value = 0;
        flyProgress.value = withTiming(
          1,
          tileFlyTiming,
          (finished) => {
            if (finished) {
              runOnJS(finishFly)(bankIndex);
            }
          },
        );
      };

      if (!bankView || !slotView || !root) {
        commitAddWord(bankIndex);
        return;
      }

      measureInRoot(bankView, root, (fromX, fromY, fromW, fromH) => {
        measureInRoot(slotView, root, (toX, toY, toW, toH) => {
          runFly(fromX, fromY, fromW, fromH, toX, toY, toW, toH);
        });
      });
    },
    [
      commitAddWord,
      fb,
      finishFly,
      flyFromH,
      flyFromW,
      flyFromX,
      flyFromY,
      flyProgress,
      flySession,
      flyToH,
      flyToW,
      flyToX,
      flyToY,
      question.wordBank,
      sentence.length,
      slotCount,
      usedBank,
    ],
  );

  const addWord = (bankIndex: number) => {
    if (fb === "wrong") setFb("idle");
    if (Platform.OS !== "web") {
      void Haptics.selectionAsync();
    }
    startFlyToSlot(bankIndex);
  };

  const removeFromSlot = (index: number) => {
    if (fb === "correct") return;
    if (fb === "wrong") setFb("idle");
    const placed = sentence[index];
    if (!placed) return;
    setUsedBank((prev) => {
      const next = [...prev];
      next[placed.bankIndex] = false;
      return next;
    });
    setSentence((p) => p.filter((_, i) => i !== index));
  };

  const check = () => {
    if (!sentence.length || fb !== "idle") return;
    const placed = sentence.map((p) => p.word);
    const ok =
      placed.join(" ").toLowerCase() ===
      question.correctWords.join(" ").toLowerCase();
    setFb(ok ? "correct" : "wrong");

    if (!ok) {
      shakeX.value = withSequence(
        withTiming(-8, { duration: 36 }),
        withTiming(8, { duration: 36 }),
        withTiming(-4, { duration: 30 }),
        withTiming(4, { duration: 30 }),
        withTiming(0, { duration: 40, easing: Easing.out(Easing.quad) }),
      );
      if (!wrongSentRef.current) {
        wrongSentRef.current = true;
        onAnswer(false);
      }
    } else if (!completedRef.current) {
      completedRef.current = true;
      onAnswer(true);
    }
  };

  const slotTileState = (index: number): LightTileState => {
    if (index >= sentence.length) return "ghost";
    if (fb === "correct") return "correct";
    if (fb === "wrong") return "wrong";
    return "pending";
  };

  const canCheck = sentence.length > 0 && fb !== "correct";
  const flyingBankIndex = flySession?.bankIndex ?? null;

  return (
    <GameRoot style={{ flex: 1 }}>
      <View ref={rootRef} style={s.root} collapsable={false}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <GameHeader>
            <LightGameHeading
              title={t("lessons.orderWords")}
              subtitle={t("lessons.orderWordsSub")}
            />
          </GameHeader>

          <LightQuestionPrompt
            label={t("lessons.questionLabel")}
            forceKurdishFont
            variant={pathMode === "kids" ? "kids" : "default"}
          >
            {question.kurdishSentence}
          </LightQuestionPrompt>

          <Animated.View style={[s.slotsWrap, shakeStyle]} layout={layoutMorph}>
            <Animated.View style={s.slotsRow} layout={layoutMorph}>
              {Array.from({ length: slotCount }).map((_, i) => {
                const placed = sentence[i];
                const isFlyTarget =
                  flySession !== null && i === flySession.slotIndex;
                const hideWhileFlying =
                  flySession !== null &&
                  placed !== undefined &&
                  i === flySession.slotIndex &&
                  placed.bankIndex === flySession.bankIndex;

                return (
                  <View
                    key={`slot-${i}`}
                    ref={(r) => {
                      slotRefs.current[i] = r;
                    }}
                    collapsable={false}
                    style={s.slotCell}
                  >
                    {placed && !hideWhileFlying ? (
                      <Animated.View
                        layout={layoutMorph}
                        collapsable={false}
                      >
                        <LightWordTile
                          label={placed.word}
                          state={slotTileState(i)}
                          onPress={() => removeFromSlot(i)}
                        />
                      </Animated.View>
                    ) : (
                      <View
                        style={[
                          s.emptySlot,
                          isFlyTarget && s.emptySlotTarget,
                        ]}
                      />
                    )}
                  </View>
                );
              })}
            </Animated.View>
          </Animated.View>

          <Animated.View style={s.bank} layout={layoutMorph}>
            {question.wordBank.map((w, i) => {
              const taken = usedBank[i] || flyingBankIndex === i;
              return (
                <View
                  key={`bank-${i}`}
                  ref={(r) => {
                    bankRefs.current[i] = r;
                  }}
                  collapsable={false}
                  style={s.bankCell}
                >
                  {taken ? (
                    <View style={s.bankPlaceholder} pointerEvents="none" />
                  ) : null}
                  <View
                    style={taken ? s.bankTileHidden : undefined}
                    pointerEvents={taken ? "none" : "auto"}
                  >
                    <LightWordTile
                      label={w}
                      state="idle"
                      onPress={() => addWord(i)}
                      disabled={taken || fb !== "idle" || flySession !== null}
                    />
                  </View>
                </View>
              );
            })}
          </Animated.View>
        </ScrollView>

        {flySession ? (
          <Animated.View
            pointerEvents="none"
            style={s.flyLayer}
            collapsable={false}
          >
            <Animated.View style={flyStyle}>
              <View style={s.flyTileFill}>
                <LightWordTile label={flySession.word} state="pending" />
              </View>
            </Animated.View>
          </Animated.View>
        ) : null}
      </View>

      <GameFooter delay={200}>
        <View style={s.footerWrap}>
          <LightHintButton />
          <View style={{ height: 12 }} />
          <LightCheckButton
            label={t("lessons.check")}
            onPress={check}
            disabled={!canCheck || flySession !== null}
          />
        </View>
      </GameFooter>
    </GameRoot>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    position: "relative",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 18,
  },
  footerWrap: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 8,
    backgroundColor: L.bg,
    borderTopWidth: 1,
    borderTopColor: L.border,
  },
  bank: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    paddingTop: 4,
  },
  bankCell: {
    position: "relative",
  },
  bankTileHidden: {
    opacity: 0,
  },
  bankPlaceholder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: L.slotDash,
    backgroundColor: L.bgSoft,
  },
  slotsWrap: {
    paddingVertical: 6,
  },
  slotsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  slotCell: {
    minWidth: 72,
    minHeight: 48,
  },
  emptySlot: {
    minWidth: 72,
    height: 48,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: L.slotDash,
    backgroundColor: L.bgSoft,
  },
  emptySlotTarget: {
    borderColor: L.blue,
    backgroundColor: "#EEF4FF",
  },
  flyLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 40,
  },
  flyTileFill: {
    flex: 1,
    justifyContent: "center",
  },
});
