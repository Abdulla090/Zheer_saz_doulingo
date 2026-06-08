/* eslint-disable */
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
import { isRtlText } from "./game-text";
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

type Placed = { word: string; id: string; bankIndex: number };
type FBState = "idle" | "correct" | "wrong";

type FlySession = {
  id: string;
  bankIndex: number;
  word: string;
  slotIndex: number;
  fromX: number;
  fromY: number;
  fromW: number;
  fromH: number;
  toX: number;
  toY: number;
  toW: number;
  toH: number;
};

type Props = {
  question: SentenceBuilderQuestion;
  onAnswer: (correct: boolean | "skip", explanation?: string) => void;
  pathMode?: LessonPathMode;
};

function FlyingTile({ session, onFinish }: { session: FlySession; onFinish: (id: string, bankIndex: number) => void }) {
  const flyProgress = useSharedValue(0);
  const flyStyle = useAnimatedStyle(() => {
    const p = flyProgress.value;
    return {
      position: "absolute",
      left: interpolate(p, [0, 1], [session.fromX, session.toX]),
      top: interpolate(p, [0, 1], [session.fromY, session.toY]),
      width: interpolate(p, [0, 1], [session.fromW, session.toW]),
      height: interpolate(p, [0, 1], [session.fromH, session.toH]),
      transform: [{ scale: interpolate(p, [0, 0.55, 1], [1, 1.05, 1]) }],
      opacity: 1,
    };
  });

  React.useEffect(() => {
    flyProgress.value = withTiming(1, tileFlyTiming, (finished) => {
      if (finished) runOnJS(onFinish)(session.id, session.bankIndex);
    });
  }, [session, onFinish, flyProgress]);

  return (
    <Animated.View style={flyStyle}>
      <View style={s.flyTileFill}>
        <LightWordTile label={session.word} state="pending" />
      </View>
    </Animated.View>
  );
}

export default function SentenceBuilderGame({ question, onAnswer, pathMode }: Props) {
  const { t, isKu } = useI18n();
  const [sentence, setSentence] = useState<Placed[]>([]);
  const [usedBank, setUsedBank] = useState(() =>
    question.wordBank.map(() => false),
  );
  const [fb, setFb] = useState<FBState>("idle");
  const [flySessions, setFlySessions] = useState<FlySession[]>([]);

  const slotN = useRef(0);
  const completedRef = useRef(false);
  const wrongSentRef = useRef(false);
  
  const rootRef = useRef<RNView>(null);
  const bankRefs = useRef<(RNView | null)[]>([]);
  const slotRefs = useRef<(RNView | null)[]>([]);

  // Coordinate caching refs to execute fly animations synchronously on click
  const rootCoords = useRef<{ x: number; y: number } | null>(null);
  const bankCoords = useRef<{ [key: number]: { x: number; y: number; w: number; h: number } }>({});
  const slotCoords = useRef<{ [key: number]: { x: number; y: number; w: number; h: number } }>({});

  const shakeX = useSharedValue(0);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  React.useEffect(() => {
    setSentence([]);
    setUsedBank(question.wordBank.map(() => false));
    setFb("idle");
    setFlySessions([]);
    slotN.current = 0;
    completedRef.current = false;
    wrongSentRef.current = false;
    bankCoords.current = {};
    slotCoords.current = {};
  }, [question]);

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
    (id: string, bankIndex: number) => {
      commitAddWord(bankIndex);
      requestAnimationFrame(() => {
        setFlySessions((prev) => prev.filter((s) => s.id !== id));
      });
    },
    [commitAddWord],
  );

  const startFlyToSlot = useCallback(
    (bankIndex: number) => {
      if (fb === "correct") return;
      if (usedBank[bankIndex]) return;
      
      const slotIndex = sentence.length + flySessions.length;
      if (slotIndex >= slotCount) return;

      const word = question.wordBank[bankIndex];
      const root = rootCoords.current;
      const bank = bankCoords.current[bankIndex];
      const slot = slotCoords.current[slotIndex];

      // If coordinates are not cached yet, fallback to synchronous add
      if (!root || !bank || !slot) {
        commitAddWord(bankIndex);
        return;
      }

      setUsedBank((prev) => {
        const next = [...prev];
        next[bankIndex] = true;
        return next;
      });

      setFlySessions((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          bankIndex,
          word,
          slotIndex,
          fromX: bank.x - root.x,
          fromY: bank.y - root.y,
          fromW: bank.w,
          fromH: bank.h,
          toX: slot.x - root.x,
          toY: slot.y - root.y,
          toW: slot.w,
          toH: slot.h,
        },
      ]);
    },
    [fb, usedBank, sentence.length, flySessions.length, slotCount, question.wordBank, commitAddWord],
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

  return (
    <GameRoot style={{ flex: 1 }}>
      <View
        ref={rootRef}
        style={s.root}
        collapsable={false}
        onLayout={() => {
          rootRef.current?.measureInWindow((x, y) => {
            rootCoords.current = { x, y };
          });
        }}
      >
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

          <View style={{ flex: 1, justifyContent: "center" }}>
            <LightQuestionPrompt
              label={t("lessons.questionLabel")}
              forceKurdishFont
              variant={pathMode === "kids" ? "kids" : "default"}
            >
              {question.kurdishSentence}
            </LightQuestionPrompt>

            <Animated.View style={[s.slotsWrap, shakeStyle]} layout={layoutMorph}>
              <Animated.View style={[s.slotsRow, { flexDirection: isRtlText(question.correctWords.join(" ")) ? "row-reverse" : "row" }]} layout={layoutMorph}>
                {Array.from({ length: slotCount }).map((_, i) => {
                  const placed = sentence[i];
                  const hideWhileFlying = placed !== undefined && flySessions.some(s => s.slotIndex === i && s.bankIndex === placed.bankIndex);

                  return (
                    <View
                      key={`slot-${i}`}
                      ref={(r) => {
                        slotRefs.current[i] = r;
                      }}
                      onLayout={() => {
                        slotRefs.current[i]?.measureInWindow((x, y, w, h) => {
                          slotCoords.current[i] = { x, y, w, h };
                        });
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
                        <View style={s.emptySlot} />
                      )}
                    </View>
                  );
                })}
              </Animated.View>
            </Animated.View>

            <Animated.View style={[s.bank, { flexDirection: isKu ? "row-reverse" : "row" }]} layout={layoutMorph}>
              {question.wordBank.map((w, i) => {
                const taken = usedBank[i];
                return (
                  <View
                    key={`bank-${i}`}
                    ref={(el) => { bankRefs.current[i] = el; }}
                    onLayout={() => {
                      bankRefs.current[i]?.measureInWindow((x, y, w, h) => {
                        bankCoords.current[i] = { x, y, w, h };
                      });
                    }}
                    collapsable={false}
                    style={s.bankCell}
                  >
                    <View style={{ zIndex: 10, opacity: taken ? 0 : 1 }} pointerEvents={taken ? "none" : "auto"}>
                      <LightWordTile
                        label={w}
                        state="idle"
                        onPress={() => addWord(i)}
                        disabled={taken || fb !== "idle"}
                      />
                    </View>
                  </View>
                );
              })}
            </Animated.View>
          </View>
        </ScrollView>
      </View>

      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none" }}>
        {flySessions.length > 0 ? (
          <Animated.View
            pointerEvents="none"
            style={s.flyLayer}
            collapsable={false}
          >
            {flySessions.map(session => (
              <FlyingTile key={session.id} session={session} onFinish={finishFly} />
            ))}
          </Animated.View>
        ) : null}
      </View>

      <GameFooter delay={200}>
        <View style={s.footerWrap}>
          <LightHintButton onPress={() => onAnswer("skip")} />
          <View style={{ height: 12 }} />
          <LightCheckButton
            label={t("lessons.check")}
            onPress={check}
            disabled={!canCheck || flySessions.length > 0}
          />
        </View>
      </GameFooter>
    </GameRoot>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
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
