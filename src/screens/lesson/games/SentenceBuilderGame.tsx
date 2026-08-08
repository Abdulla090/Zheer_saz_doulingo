/* eslint-disable */
/**
 * SentenceBuilderGame — Premium light UI ("Order the words").
 * Word tiles morph from the bank into answer slots via a Reanimated fly transition.
 */
 

import { tileFlyTiming } from "../../../components/animations/motion";
import { AppText } from "../../../components/ui/AppText";
import { getLanguageDirection } from "../../../i18n/direction";
import { useI18n } from "../../../hooks/useI18n";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { useWordSpeech } from "./use-word-speech";
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
import { L, Duo } from "./lesson-light-design";
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
import {
  MIN_RAILS,
  RAIL_DROP,
  RAIL_H,
  RAIL_RADIUS,
  ROW_GAP,
  ROW_H,
  ROW_STRIDE,
  TILE_GAP,
  estimateRailCount,
  linesFromHeight,
} from "./duo-answer-rails";

type Placed = { word: string; id: string; bankIndex: number };
type FBState = "idle" | "correct" | "wrong";

/** Resting width of the landing anchor — just enough to be measurable. */
const LANDING_ANCHOR_REST_W = 1;
/** Fallback if reserving the anchor produces no layout event. */
const ANCHOR_LAYOUT_TIMEOUT_MS = 80;

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

/*
 * Duolingo answer-area geometry lives in `duo-answer-rails` — see the note there
 * about why line boxes are pinned rather than content-sized.
 */

function FlyingTile({ session, onFinish, isKids, isNormal, languageCode }: { session: FlySession; onFinish: (id: string, bankIndex: number) => void; isKids?: boolean; isNormal?: boolean; languageCode?: string }) {
  const flyProgress = useSharedValue(0);
  /*
   * Resize by transform, never by layout.
   *
   * Animating `width`/`height` re-ran the tile's text layout on every frame of
   * the flight. With `fitLabelLines={2}` the label is allowed to wrap, so a
   * word that fit on one line in the bank broke onto two — or clipped — partway
   * through and snapped back only once it landed at its final size.
   *
   * Holding the box at its source size lays the text out exactly once, looking
   * identical to the bank tile it left, and scale carries it to the destination
   * size. Glyphs scale like an image instead of reflowing.
   */
  const scaleToX = session.fromW > 0 ? session.toW / session.fromW : 1;
  const scaleToY = session.fromH > 0 ? session.toH / session.fromH : 1;

  const flyStyle = useAnimatedStyle(() => {
    const p = flyProgress.value;
    return {
      transform: [
        { translateX: interpolate(p, [0, 1], [session.fromX, session.toX]) },
        { translateY: interpolate(p, [0, 1], [session.fromY, session.toY]) },
        { scaleX: interpolate(p, [0, 1], [1, scaleToX]) },
        { scaleY: interpolate(p, [0, 1], [1, scaleToY]) },
      ],
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
      <Animated.View
        style={[
          {
            width: session.fromW,
            height: session.fromH,
            /*
             * The measured coordinates are top-left based, so the scale has to
             * pivot there too. Left at the default centre, the tile would drift
             * by half the size difference and miss its slot.
             */
            transformOrigin: "top left",
          },
          flyStyle,
        ]}
      >
        <View style={s.flyTileFill}>
          <LightWordTile
            label={session.word}
            state="pending"
            isKids={isKids}
            languageCode={languageCode}
            fitLabel={!isNormal}
            fitLabelLines={2}
            fontSize={
              isNormal
                ? undefined
                : session.word.length > 12 ? 10 : session.word.length > 9 ? 11 : 14
            }
            style={isNormal ? s.flyWordTileDuo : s.flyWordTile}
          />
        </View>
      </Animated.View>
    </View>
  );
}

export default function SentenceBuilderGame({ question, onAnswer, pathMode }: Props) {
  const { t } = useI18n();
  const { colors, isDark } = useThemeColors();
  const { width } = useWindowDimensions();
  const compact = width < 390;
  const isNormal = pathMode === "normal";
  const targetDirection = getLanguageDirection(question.targetLanguage);
  const { speakWord, stop, language: targetLanguage } = useWordSpeech(question.targetLanguage);
  const fullSentence = React.useMemo(
    () => question.correctWords.join(" "),
    [question.correctWords],
  );
  
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
  /** Lines the placed words actually occupy — drives how many rails are drawn. */
  const [placedLines, setPlacedLines] = useState(1);
  /** Usable width of the answer area, used to pre-compute the rail count. */
  const [answerWidth, setAnswerWidth] = useState(0);

  /*
   * Width the landing anchor reserves for the word currently in flight.
   *
   * The anchor marks where the next word will sit. At its 1px resting width it
   * always fits on the current line — so with a nearly-full line it measured at
   * the end of line 1, while the real word, being wider, wrapped to line 2. The
   * tile flew to the end of line 1 and then jumped down on landing.
   *
   * Widening the anchor to the incoming word's width before measuring hands the
   * decision back to the flex engine, so wrapping, gaps, padding and RTL are all
   * resolved by the same layout pass that will place the real tile.
   */
  const [anchorWidth, setAnchorWidth] = useState(LANDING_ANCHOR_REST_W);
  const anchorWidthRef = useRef(LANDING_ANCHOR_REST_W);
  const anchorLayoutWaiterRef = useRef<(() => void) | null>(null);

  const resolveAnchorLayout = useCallback(() => {
    const waiter = anchorLayoutWaiterRef.current;
    if (waiter) {
      anchorLayoutWaiterRef.current = null;
      waiter();
    }
  }, []);

  /** Reserve `width` on the anchor and resolve once that layout has landed. */
  const reserveLandingAnchor = useCallback(
    (width: number) =>
      new Promise<void>((resolve) => {
        // Already the right width: no layout event would fire, so don't wait.
        if (Math.abs(anchorWidthRef.current - width) < 0.5) {
          resolve();
          return;
        }
        anchorWidthRef.current = width;
        anchorLayoutWaiterRef.current = resolve;
        setAnchorWidth(width);
        // A layout pass that produces no change still has to unblock the tap.
        setTimeout(() => {
          if (anchorLayoutWaiterRef.current === resolve) {
            anchorLayoutWaiterRef.current = null;
            resolve();
          }
        }, ANCHOR_LAYOUT_TIMEOUT_MS);
      }),
    [],
  );

  const releaseLandingAnchor = useCallback(() => {
    anchorWidthRef.current = LANDING_ANCHOR_REST_W;
    setAnchorWidth(LANDING_ANCHOR_REST_W);
  }, []);

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
    void stop();
    setSentence([]);
    setUsedBank(shuffledWordBank.map(() => false));
    setFb("idle");
    setFlySessions([]);
    setPlacedLines(1);
    slotN.current = 0;
    completedRef.current = false;
    wrongSentRef.current = false;
    measuringBankRef.current = null;
    bankCoords.current = {};
    slotCoords.current = {};
    // A tap abandoned mid-measure would otherwise leave the anchor widened.
    anchorLayoutWaiterRef.current = null;
    releaseLandingAnchor();
  }, [shuffledWordBank, stop, releaseLandingAnchor]);

  React.useEffect(() => () => {
    void stop();
  }, [stop]);

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
      // The placed tile now occupies the space the anchor was holding open.
      releaseLandingAnchor();
      requestAnimationFrame(() => {
        setFlySessions((prev) => prev.filter((s) => s.id !== id));
      });
    },
    [commitAddWord, releaseLandingAnchor],
  );

  const startFlyToSlot = useCallback(
    async (bankIndex: number) => {
      if (fb === "correct") return;
      if (usedBank[bankIndex]) return;
      if (flySessions.length > 0 || measuringBankRef.current !== null) return;
      
      const slotIndex = sentence.length;
      if (slotIndex >= slotCount) return;

      const word = shuffledWordBank[bankIndex];
      /*
       * Speak here rather than in `addWord`: the guards above have already
       * rejected taps on used tiles, taps during a flight and taps past the
       * last slot, so this fires once per word that actually gets placed.
       * Speaking on every raw tap would stutter under fast tapping.
       */
      speakWord(word, `builder-word-${bankIndex}`);
      measuringBankRef.current = bankIndex;

      /*
       * Reserve the incoming word's width on the anchor *before* measuring it,
       * so the anchor has already wrapped to line 2 if that is where the word
       * belongs. Only the normal path wraps — street and kids fly into fixed
       * slots laid out in a non-wrapping row.
       */
      if (isNormal) {
        const bankWidth =
          bankCoords.current[bankIndex]?.w ??
          (await measureGameElement(bankRefs.current[bankIndex]))?.w;
        if (measuringBankRef.current !== bankIndex) return;
        if (bankWidth) await reserveLandingAnchor(bankWidth);
        if (measuringBankRef.current !== bankIndex) return;
      }

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
        releaseLandingAnchor();
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
          // Normal path words keep their own width end to end — the landing
          // anchor is a zero-width marker, so resizing to it would collapse the
          // tile mid-flight. Street/kids fly into fixed-size slots.
          toW: isNormal ? bank.w : slot.w,
          toH: isNormal ? bank.h : slot.h,
        },
      ]);
    },
    [fb, usedBank, sentence.length, flySessions.length, slotCount, shuffledWordBank, commitAddWord, isNormal, speakWord, reserveLandingAnchor, releaseLandingAnchor],
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
      /*
       * The `fb !== "idle"` guard above means a correct check runs once, so the
       * sentence is never queued twice. It is also the newest device request,
       * which makes `useTTS` cancel any word audio still playing from the last
       * tap instead of letting the two overlap.
       */
      speakWord(fullSentence, "builder-sentence");
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

  /*
   * Rails are sized for the *whole* answer up front so the area never grows a
   * rail mid-solve, then `placedLines` (measured) can only push it higher — an
   * under-estimate corrects itself the moment the words actually wrap.
   */
  const answerRails = Math.max(
    MIN_RAILS,
    placedLines,
    estimateRailCount(question.correctWords, answerWidth),
  );
  const railColor = isDark ? colors.border : Duo.rail;

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
              speechText={fullSentence}
              speechLanguageCode={targetLanguage}
              variant={pathMode === "kids" ? "kids" : "default"}
            >
              {question.kurdishSentence}
            </LightQuestionPrompt>

            <Animated.View style={[s.slotsWrap, isNormal && s.slotsWrapDuo, shakeStyle]}>
              {isNormal ? (
                /*
                 * Duolingo answer area: two full-width rails with the chosen
                 * words resting on the top one. Words keep their natural width
                 * and wrap, so long words are never squeezed — the rails are
                 * decoration behind a normal wrapping row, not a grid.
                 */
                <View
                  style={[s.duoAnswerArea, { height: answerRails * ROW_STRIDE }]}
                  onLayout={(e) => setAnswerWidth(e.nativeEvent.layout.width)}
                >
                  {Array.from({ length: answerRails }).map((_, i) => (
                    <View
                      key={`rail-${i}`}
                      pointerEvents="none"
                      style={[
                        s.duoRail,
                        { top: i * ROW_STRIDE + ROW_H + RAIL_DROP, backgroundColor: railColor },
                      ]}
                    />
                  ))}
                  <Animated.View
                    {...(Platform.OS === "web" ? ({ dir: targetDirection } as any) : {})}
                    style={[
                      s.duoPlacedRow,
                      { flexDirection: "row" },
                      Platform.OS !== "web" ? { direction: targetDirection } : undefined,
                    ]}
                    onLayout={(e) =>
                      setPlacedLines(linesFromHeight(e.nativeEvent.layout.height))
                    }
                  >
                    {sentence.map((placed, i) => {
                      const hideWhileFlying = flySessions.some(
                        (f) => f.slotIndex === i && f.bankIndex === placed.bankIndex,
                      );
                      if (hideWhileFlying) return null;
                      return (
                        <View
                          key={placed.id}
                          ref={(r) => {
                            slotRefs.current[i] = r;
                          }}
                          onLayout={() => {
                            slotRefs.current[i]?.measureInWindow((x, y, w, h) => {
                              slotCoords.current[i] = { x, y, w, h };
                            });
                          }}
                          collapsable={false}
                          style={s.duoPlacedCell}
                        >
                          <LightWordTile
                            label={placed.word}
                            state={slotTileState(i)}
                            onPress={() => removeFromSlot(i)}
                            languageCode={question.targetLanguage}
                            style={s.duoWordTile}
                          />
                        </View>
                      );
                    })}
                    {/* Measurement anchor for the next incoming word. Widened
                        to that word's width while it flies, so flexWrap decides
                        the landing line before the flight is aimed. */}
                    <View
                      ref={(r) => {
                        slotRefs.current[sentence.length] = r;
                      }}
                      onLayout={() => {
                        slotRefs.current[sentence.length]?.measureInWindow((x, y, w, h) => {
                          slotCoords.current[sentence.length] = { x, y, w, h };
                          resolveAnchorLayout();
                        });
                      }}
                      collapsable={false}
                      style={[s.duoLandingAnchor, { width: anchorWidth }]}
                    />
                  </Animated.View>
                </View>
              ) : (
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
                            <View
                              style={[
                                pathMode === "kids" ? s.emptySlot : s.emptySlotDuo,
                                isDark && {
                                  backgroundColor: colors.muted,
                                  borderColor: colors.border,
                                },
                              ]}
                            />
                          )}
                        </View>
                      );
                    });
                  })()}
                </Animated.View>
              )}
            </Animated.View>

            <View style={s.wordBankSpacer} />
            {!isNormal ? <View style={s.bankDivider} /> : null}

            <Animated.View
              {...(Platform.OS === "web" ? ({ dir: targetDirection } as any) : {})}
              style={[
                s.bank,
                isNormal && s.bankDuo,
                { flexDirection: "row" },
                Platform.OS !== "web" ? { direction: targetDirection } : undefined,
              ]}
            >
              {(() => {
                const bankItemsArray = shuffledWordBank.map((w, i) => ({ w, i }));
                return bankItemsArray.map(({ w, i }) => {
                  const taken = usedBank[i];

                  if (isNormal) {
                    /*
                     * The lifted word leaves a grey slug of the *same* size
                     * behind, so the bank never reflows while a word is in the
                     * answer area — the remaining tiles stay exactly where the
                     * user last saw them.
                     */
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
                        style={s.bankCellDuo}
                      >
                        <LightWordTile
                          label={w}
                          state={taken ? "ghost" : "idle"}
                          onPress={taken ? undefined : () => addWord(i)}
                          disabled={taken || fb === "correct"}
                          languageCode={question.targetLanguage}
                          style={s.duoWordTile}
                        />
                      </View>
                    );
                  }

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
                      <View
                        style={[
                          s.bankPlaceholder,
                          isDark && {
                            backgroundColor: colors.muted,
                            borderColor: colors.border,
                          },
                        ]}
                      />
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
              <FlyingTile key={session.id} session={session} onFinish={finishFly} isKids={pathMode === "kids"} isNormal={isNormal} languageCode={question.targetLanguage} />
            ))}
          </Animated.View>
        ) : null}
      </View>

      <GameFooter delay={200}>
        <View
          style={[
            s.footerWrap,
            { backgroundColor: colors.background, borderTopColor: colors.border },
            pathMode === "kids" && { backgroundColor: "transparent", borderTopWidth: 0 },
            isNormal && s.footerWrapDuo,
          ]}
        >
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
    paddingTop: 12,
    paddingBottom: 24,
    gap: 24,
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
  footerWrapDuo: {
    borderTopWidth: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
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
    borderRadius: 12,
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
  slotsWrapDuo: {
    minHeight: 0,
    paddingTop: 26,
    paddingBottom: 0,
  },
  duoAnswerArea: {
    width: "100%",
    position: "relative",
  },
  duoPlacedRow: {
    flexWrap: "wrap",
    alignItems: "flex-start",
    alignContent: "flex-start",
    justifyContent: "flex-start",
  },
  /*
   * Fixed height + bottom margin is what guarantees a wrapped flex line is
   * exactly ROW_STRIDE tall, which is what keeps every line on its rail.
   */
  duoPlacedCell: {
    height: ROW_H,
    marginEnd: TILE_GAP,
    marginBottom: ROW_GAP,
  },
  duoLandingAnchor: {
    height: ROW_H,
    marginBottom: ROW_GAP,
  },
  duoRail: {
    position: "absolute",
    left: 0,
    right: 0,
    height: RAIL_H,
    borderRadius: RAIL_RADIUS,
  },
  duoWordTile: {
    height: ROW_H,
    minHeight: ROW_H,
    paddingHorizontal: 15,
    paddingVertical: 0,
  },
  bankDuo: {
    paddingTop: 4,
    paddingBottom: 4,
    // Duolingo left-aligns the bank: a half-full last row starts at the edge
    // rather than floating in the middle.
    justifyContent: "flex-start",
    alignContent: "flex-start",
  },
  bankCellDuo: {
    height: ROW_H,
    marginEnd: TILE_GAP,
    marginBottom: 8,
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
    borderRadius: 12,
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
    borderRadius: 12,
  },
  emptySlot: {
    width: 74,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: L.slotDash,
    backgroundColor: L.bgSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  emptySlotDuo: {
    width: 74,
    height: 48,
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: Duo.border,
    backgroundColor: "transparent",
  },
  bankDivider: {
    height: 2,
    backgroundColor: Duo.border,
    marginHorizontal: 8,
    borderRadius: 1,
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
    borderRadius: 12,
  },
  flyWordTileDuo: {
    width: "100%",
    height: "100%",
    minHeight: 0,
    paddingHorizontal: 15,
    paddingVertical: 0,
  },
});
