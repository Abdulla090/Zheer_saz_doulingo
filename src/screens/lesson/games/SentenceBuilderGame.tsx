/* eslint-disable */
/**
 * SentenceBuilderGame — Premium light UI ("Order the words").
 * Word tiles morph from the bank into answer slots via a Reanimated fly transition.
 */
 

import { tileFlyTiming } from "../../../components/animations/motion";
import { AppText } from "../../../components/ui/AppText";
import { getLanguageDirection } from "../../../i18n/direction";
import { useI18n } from "../../../hooks/useI18n";
import * as Haptics from "expo-haptics";
import React, { useCallback, useRef, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
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

import { SentenceBuilderQuestion } from "../../../data/lesson-content";
import type { LessonPathMode } from "../../../data/lesson-content";
import { L } from "./lesson-light-design";
import {
  LightCheckButton,
  LightGameHeading,
  LightQuestionPrompt,
  LightWordTile,
  type LightTileState,
} from "./lesson-light-primitives";
import {
  GameFooter,
  GameHeader,
  GameRoot,
} from "./GameAnimatedShell";
import { measureGameElement } from "./game-layout-measure";

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

function FlyingTile({ session, onFinish, isKids, languageCode }: { session: FlySession; onFinish: (id: string, bankIndex: number) => void; isKids?: boolean; languageCode?: string }) {
  const flyProgress = useSharedValue(0);
  const flyStyle = useAnimatedStyle(() => {
    const p = flyProgress.value;
    return {
      width: interpolate(p, [0, 1], [session.fromW, session.toW]),
      height: interpolate(p, [0, 1], [session.fromH, session.toH]),
      transform: [
        { translateX: interpolate(p, [0, 1], [session.fromX, session.toX]) },
        { translateY: interpolate(p, [0, 1], [session.fromY, session.toY]) },
      ],
      opacity: 1,
    };
  });

  React.useEffect(() => {
    flyProgress.value = withTiming(1, tileFlyTiming, (finished) => {
      if (finished) runOnJS(onFinish)(session.id, session.bankIndex);
    });
  }, [session, onFinish, flyProgress]);

  return (
    <View
      {...(Platform.OS === "web" ? ({ dir: getLanguageDirection(languageCode) } as any) : {})}
      style={[s.flySessionLayer, Platform.OS !== "web" ? { direction: getLanguageDirection(languageCode) } : undefined]}
    >
      <Animated.View style={flyStyle}>
        <View style={s.flyTileFill}>
          <LightWordTile
            label={session.word}
            state="pending"
            isKids={isKids}
            languageCode={languageCode}
            fitLabel
            fitLabelLines={2}
            fontSize={session.word.length > 12 ? 10 : session.word.length > 9 ? 11 : 14}
            style={s.flyWordTile}
          />
        </View>
      </Animated.View>
    </View>
  );
}

export default function SentenceBuilderGame({ question, onAnswer, pathMode }: Props) {
  const { t } = useI18n();
  const { width } = useWindowDimensions();
  const compact = width < 390;
  const targetDirection = getLanguageDirection(question.targetLanguage);
  
  const shuffledWordBank = React.useMemo(() => {
    const bank = [...question.wordBank];
    for (let i = bank.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bank[i], bank[j]] = [bank[j], bank[i]];
    }
    return bank;
  }, [question.wordBank]);

  const [sentence, setSentence] = useState<Placed[]>([]);
  const [usedBank, setUsedBank] = useState(() =>
    shuffledWordBank.map(() => false),
  );
  const [fb, setFb] = useState<FBState>("idle");
  const [flySessions, setFlySessions] = useState<FlySession[]>([]);

  const slotN = useRef(0);
  const completedRef = useRef(false);
  const wrongSentRef = useRef(false);
  const measuringBankRef = useRef<number | null>(null);
  
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
    setUsedBank(shuffledWordBank.map(() => false));
    setFb("idle");
    setFlySessions([]);
    slotN.current = 0;
    completedRef.current = false;
    wrongSentRef.current = false;
    measuringBankRef.current = null;
    bankCoords.current = {};
    slotCoords.current = {};
  }, [shuffledWordBank]);

  const slotCount = question.correctWords.length;

  const commitAddWord = useCallback(
    (bankIndex: number) => {
      const w = shuffledWordBank[bankIndex];
      const id = `s${slotN.current++}`;
      setUsedBank((prev) => {
        const next = [...prev];
        next[bankIndex] = true;
        return next;
      });
      setSentence((p) => [...p, { word: w, id, bankIndex }]);
    },
    [shuffledWordBank],
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
    async (bankIndex: number) => {
      if (fb === "correct") return;
      if (usedBank[bankIndex]) return;
      if (flySessions.length > 0 || measuringBankRef.current !== null) return;
      
      const slotIndex = sentence.length;
      if (slotIndex >= slotCount) return;

      const word = shuffledWordBank[bankIndex];
      measuringBankRef.current = bankIndex;
      const [measuredRoot, measuredBank, measuredSlot] = await Promise.all([
        measureGameElement(rootRef.current),
        measureGameElement(bankRefs.current[bankIndex]),
        measureGameElement(slotRefs.current[slotIndex]),
      ]);

      if (measuringBankRef.current !== bankIndex) return;

      const root = measuredRoot ?? rootCoords.current;
      const bank = measuredBank ?? bankCoords.current[bankIndex];
      const slot = measuredSlot ?? slotCoords.current[slotIndex];
      measuringBankRef.current = null;

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
    [fb, usedBank, sentence.length, flySessions.length, slotCount, shuffledWordBank, commitAddWord],
  );

  const addWord = (bankIndex: number) => {
    if (fb === "wrong") setFb("idle");
    if (Platform.OS !== "web") {
      void Haptics.selectionAsync();
    }
    void startFlyToSlot(bankIndex);
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
    if (!sentence.length || flySessions.length > 0 || fb !== "idle") return;
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

  const canCheck = sentence.length + flySessions.length > 0 && fb !== "correct";

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
            />
          </GameHeader>

          <View style={s.exerciseArea}>
            <LightQuestionPrompt
              label={t("lessons.questionLabel")}
              forceKurdishFont
              contentLanguageCode={question.sourceLanguage}
              variant={pathMode === "kids" ? "kids" : "default"}
            >
              {question.kurdishSentence}
            </LightQuestionPrompt>

            <Animated.View style={[s.slotsWrap, shakeStyle]}>
              <Animated.View
                {...(Platform.OS === "web" ? ({ dir: targetDirection } as any) : {})}
                style={[
                  s.slotsRow,
                  { flexDirection: "row" },
                  Platform.OS !== "web" ? { direction: targetDirection } : undefined,
                ]}
              >
                {(() => {
                  const slotsArray = Array.from({ length: slotCount }).map((_, i) => i);
                  return slotsArray.map((i) => {
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
                            collapsable={false}
                          >
                            <LightWordTile
                              label={placed.word}
                              state={slotTileState(i)}
                              onPress={() => removeFromSlot(i)}
                              isKids={pathMode === "kids"}
                              languageCode={question.targetLanguage}
                              fitLabel
                              fitLabelLines={2}
                              fontSize={placed.word.length > 12 ? 10 : placed.word.length > 9 ? 11 : 14}
                              style={s.slotWordTile}
                            />
                          </Animated.View>
                        ) : (
                          <View style={s.emptySlot}>
                            <AppText style={s.slotNumber} forceLatinFont latinRole="bold">
                              {i + 1}
                            </AppText>
                          </View>
                        )}
                      </View>
                    );
                  });
                })()}
              </Animated.View>
            </Animated.View>

            <View style={s.wordBankSpacer} />

            <Animated.View
              {...(Platform.OS === "web" ? ({ dir: targetDirection } as any) : {})}
              style={[
                s.bank,
                { flexDirection: "row" },
                Platform.OS !== "web" ? { direction: targetDirection } : undefined,
              ]}
            >
              {(() => {
                const bankItemsArray = shuffledWordBank.map((w, i) => ({ w, i }));
                return bankItemsArray.map(({ w, i }) => {
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
                      <View style={s.bankPlaceholder} />
                      <View style={{ zIndex: 10, opacity: taken ? 0 : 1 }} pointerEvents={taken ? "none" : "auto"}>
                        <LightWordTile
                          label={w}
                          state="idle"
                          onPress={() => addWord(i)}
                          disabled={taken || fb !== "idle"}
                          isKids={pathMode === "kids"}
                          languageCode={question.targetLanguage}
                          fitLabel
                          fontSize={w.length > 10 ? 13 : 15}
                          style={[s.wordTile, compact && s.wordTileCompact]}
                        />
                      </View>
                    </View>
                  );
                });
              })()}
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
              <FlyingTile key={session.id} session={session} onFinish={finishFly} isKids={pathMode === "kids"} languageCode={question.targetLanguage} />
            ))}
          </Animated.View>
        ) : null}
      </View>

      <GameFooter delay={200}>
        <View style={[s.footerWrap, pathMode === "kids" && { backgroundColor: "transparent", borderTopWidth: 0 }]}>
          <LightCheckButton
            label={t("lessons.check")}
            onPress={check}
            disabled={!canCheck}
            variant={pathMode === "kids" ? "kids" : "default"}
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
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 18,
  },
  exerciseArea: {
    flex: 1,
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
    flexWrap: "wrap",
    justifyContent: "center",
    paddingTop: 6,
    paddingBottom: 4,
  },
  wordBankSpacer: {
    flex: 1,
    minHeight: 56,
  },
  bankCell: {
    position: "relative",
    marginHorizontal: 4,
    marginVertical: 5,
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
  bankTileHidden: {
    opacity: 0,
  },
  slotsWrap: {
    minHeight: 118,
    paddingTop: 16,
    paddingBottom: 6,
  },
  slotsRow: {
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  slotCell: {
    width: 74,
    height: 48,
    marginHorizontal: 2,
    marginVertical: 5,
  },
  wordTile: {
    minHeight: 42,
    maxWidth: 156,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 14,
  },
  wordTileCompact: {
    maxWidth: 128,
  },
  slotWordTile: {
    width: 74,
    height: 48,
    minHeight: 48,
    paddingHorizontal: 2,
    paddingVertical: 4,
    borderRadius: 14,
  },
  emptySlot: {
    width: 74,
    height: 48,
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: L.slotDash,
    backgroundColor: L.bgSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  slotNumber: {
    color: L.grayLight,
    fontSize: 13,
    lineHeight: 16,
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
  flySessionLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "flex-start",
  },
  flyTileFill: {
    flex: 1,
    justifyContent: "center",
  },
  flyWordTile: {
    width: "100%",
    height: "100%",
    minHeight: 0,
    paddingHorizontal: 2,
    paddingVertical: 4,
    borderRadius: 14,
  },
});
