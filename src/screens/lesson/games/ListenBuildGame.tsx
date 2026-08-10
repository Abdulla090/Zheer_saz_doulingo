/* eslint-disable */
/**
 * ListenBuildGame — "Tap what you hear".
 *
 * A sentence builder whose prompt is audio only: the sentence is never rendered
 * as text (that would give the answer away), so the bubble holds two playback
 * controls instead — normal speed and a slow replay. Everything below the prompt
 * is the same rail-based answer area as `SentenceBuilderGame`, and the geometry
 * comes from the shared `duo-answer-rails` module so both games wrap identically.
 */

import { tileFlyTiming } from "../../../components/animations/motion";
import { getLanguageDirection } from "../../../i18n/direction";
import { useI18n } from "../../../hooks/useI18n";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { useWordSpeech } from "./use-word-speech";
import * as Haptics from "expo-haptics";
import React, { useCallback, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type View as RNView,
} from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { AppText } from "../../../components/ui/AppText";
import { TwinoMascot } from "../../../components/mascot/TwinoMascot";
import type { ListenBuildQuestion, LessonPathMode } from "../../../data/types";
import { Duo, DuoMotion } from "./lesson-light-design";
import {
  LightCheckButton,
  LightGameHeading,
  LightWordTile,
  type LightTileState,
} from "./lesson-light-primitives";
import { GameFooter, GameHeader, GameRoot } from "./GameAnimatedShell";
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
  question: ListenBuildQuestion;
  onAnswer: (correct: boolean | "skip", explanation?: string) => void;
  pathMode?: LessonPathMode;
};

/** Slow replay rate — slow enough to separate words, not so slow it distorts. */
const SLOW_RATE = 0.45;

function SpeakerGlyph({ color, size = 34 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 9v6h4l5 4V5L8 9H4z" fill={color} />
      <Path
        d="M16.5 8.5a4.5 4.5 0 010 7M19 6a8 8 0 010 12"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Turtle — Duolingo's universal "play it slowly" affordance. */
function TurtleGlyph({ color, size = 34 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3.5 15.5h13a5.5 5.5 0 00-5.5-5.5H9a5.5 5.5 0 00-5.5 5.5z"
        fill={color}
      />
      <Path d="M17 12.6c.9-.5 2-.3 2.6.5.5.8.3 1.9-.6 2.4" fill={color} />
      <Path d="M6 16.4l-.7 1.8M13.6 16.4l.7 1.8" stroke={color} strokeWidth={1.9} strokeLinecap="round" />
      <Path
        d="M17.6 13.2h1.9M17.6 15h1.4"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** One audio control inside the prompt bubble. */
function AudioButton({
  onPress,
  slow,
  disabled,
  label,
}: {
  onPress: () => void;
  slow?: boolean;
  disabled?: boolean;
  label: string;
}) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  React.useEffect(() => () => cancelAnimation(scale), [scale]);

  return (
    <Pressable
      onPress={() => {
        if (disabled) return;
        if (Platform.OS !== "web") void Haptics.selectionAsync();
        scale.value = withSequence(
          withTiming(1.18, { duration: 110, easing: Easing.out(Easing.quad) }),
          withSpring(1, DuoMotion.pop),
        );
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      style={[s.audioBtn, slow && s.audioBtnSlow]}
    >
      <Animated.View style={anim}>
        {slow ? (
          <TurtleGlyph color={Duo.accent} />
        ) : (
          <SpeakerGlyph color={Duo.accent} />
        )}
      </Animated.View>
    </Pressable>
  );
}

function FlyingTile({
  session,
  onFinish,
  languageCode,
}: {
  session: FlySession;
  onFinish: (id: string, bankIndex: number) => void;
  languageCode?: string;
}) {
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
      style={[
        s.flySessionLayer,
        Platform.OS !== "web"
          ? { direction: getLanguageDirection(languageCode) }
          : undefined,
      ]}
    >
      <Animated.View style={flyStyle}>
        <View style={s.flyTileFill}>
          <LightWordTile
            label={session.word}
            state="pending"
            languageCode={languageCode}
            style={s.flyWordTile}
          />
        </View>
      </Animated.View>
    </View>
  );
}

export default function ListenBuildGame({ question, onAnswer, pathMode }: Props) {
  const { t } = useI18n();
  const { colors, isDark } = useThemeColors();
  const targetDirection = getLanguageDirection(question.targetLanguage);
  const speechLanguage = question.targetLanguage ?? "en";
  const { speak, speakWord } = useWordSpeech(speechLanguage);

  const shuffledWordBank = React.useMemo(() => {
    const bank = [...question.wordBank];
    for (let i = bank.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bank[i], bank[j]] = [bank[j], bank[i]];
    }
    return bank;
  }, [question.wordBank]);

  const [sentence, setSentence] = useState<Placed[]>([]);
  const [usedBank, setUsedBank] = useState(() => shuffledWordBank.map(() => false));
  const [fb, setFb] = useState<FBState>("idle");
  const [flySessions, setFlySessions] = useState<FlySession[]>([]);
  const [placedLines, setPlacedLines] = useState(1);
  const [answerWidth, setAnswerWidth] = useState(0);
  /** Set once the learner opts out of audio, which reveals the sentence as text. */
  const [audioGivenUp, setAudioGivenUp] = useState(false);

  const slotN = useRef(0);
  const completedRef = useRef(false);
  const wrongSentRef = useRef(false);
  const measuringBankRef = useRef<number | null>(null);
  const autoPlayedRef = useRef(false);

  const rootRef = useRef<RNView>(null);
  const bankRefs = useRef<(RNView | null)[]>([]);
  const slotRefs = useRef<(RNView | null)[]>([]);

  const rootCoords = useRef<{ x: number; y: number } | null>(null);
  const bankCoords = useRef<{ [k: number]: { x: number; y: number; w: number; h: number } }>({});
  const slotCoords = useRef<{ [k: number]: { x: number; y: number; w: number; h: number } }>({});

  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const playAudio = useCallback(
    (slow?: boolean) => {
      speak(question.sentence, speechLanguage, undefined, {
        provider: "device",
        ...(slow ? { rate: SLOW_RATE } : {}),
      });
    },
    [question.sentence, speak, speechLanguage],
  );

  React.useEffect(() => {
    setSentence([]);
    setUsedBank(shuffledWordBank.map(() => false));
    setFb("idle");
    setFlySessions([]);
    setPlacedLines(1);
    setAudioGivenUp(false);
    slotN.current = 0;
    completedRef.current = false;
    wrongSentRef.current = false;
    measuringBankRef.current = null;
    autoPlayedRef.current = false;
    bankCoords.current = {};
    slotCoords.current = {};
  }, [shuffledWordBank]);

  /* The exercise is unanswerable until the sentence has been heard once. */
  React.useEffect(() => {
    if (autoPlayedRef.current) return;
    autoPlayedRef.current = true;
    const timer = setTimeout(() => playAudio(false), 350);
    return () => clearTimeout(timer);
  }, [playAudio]);

  React.useEffect(() => () => cancelAnimation(shakeX), [shakeX]);

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
        setFlySessions((prev) => prev.filter((x) => x.id !== id));
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
      // The guards above already reject taps on a used tile, taps during a
      // flight and taps past the last slot, so this fires once per placed word.
      // The word is printed on the tile face, so reading it aloud gives nothing
      // away that the learner cannot already see.
      speakWord(word, `listen-build-word-${bankIndex}`);
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
          // The landing anchor is a zero-width marker, so the tile keeps its own
          // width end to end rather than collapsing into it mid-flight.
          toW: bank.w,
          toH: bank.h,
        },
      ]);
    },
    [
      fb,
      usedBank,
      sentence.length,
      flySessions.length,
      slotCount,
      shuffledWordBank,
      commitAddWord,
      speakWord,
    ],
  );

  const addWord = (bankIndex: number) => {
    if (fb === "wrong") setFb("idle");
    if (Platform.OS !== "web") void Haptics.selectionAsync();
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

  const answerRails = Math.max(
    MIN_RAILS,
    placedLines,
    estimateRailCount(question.correctWords, answerWidth),
  );
  const railColor = isDark ? colors.border : Duo.rail;
  const bubbleFace = isDark ? colors.surfaceRaised : Duo.surface;
  const bubbleBorder = isDark ? colors.border : Duo.border;

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
            <LightGameHeading title={t("lessons.listenBuild")} />
          </GameHeader>

          <View style={s.exerciseArea}>
            {/*
              Audio-only prompt. The mascot sits after the bubble in source
              order so an RTL UI mirrors it to the physical right, matching the
              reference design; the audio controls stay on the physical left.
            */}
            <View style={s.promptRow}>
              <View style={s.bubbleWrap}>
                <View
                  style={[
                    s.bubble,
                    { backgroundColor: bubbleFace, borderColor: bubbleBorder },
                  ]}
                >
                  <AudioButton
                    onPress={() => playAudio(false)}
                    label={t("lessons.listenLabel")}
                  />
                  <View style={[s.audioSplit, { backgroundColor: bubbleBorder }]} />
                  <AudioButton
                    onPress={() => playAudio(true)}
                    slow
                    label={t("lessons.listenSlow")}
                  />
                </View>
              </View>

              <View style={s.mascotCol}>
                <TwinoMascot size={112} pose="headset" />
                <View style={s.mascotShadow} />
              </View>
            </View>

            <Animated.View style={[s.slotsWrap, shakeStyle]}>
              <View
                style={[s.answerArea, { height: answerRails * ROW_STRIDE }]}
                onLayout={(e) => setAnswerWidth(e.nativeEvent.layout.width)}
              >
                {Array.from({ length: answerRails }).map((_, i) => (
                  <View
                    key={`rail-${i}`}
                    pointerEvents="none"
                    style={[
                      s.rail,
                      {
                        top: i * ROW_STRIDE + ROW_H + RAIL_DROP,
                        backgroundColor: railColor,
                      },
                    ]}
                  />
                ))}
                <Animated.View
                  {...(Platform.OS === "web" ? ({ dir: targetDirection } as any) : {})}
                  style={[
                    s.placedRow,
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
                        style={s.placedCell}
                      >
                        <LightWordTile
                          label={placed.word}
                          state={slotTileState(i)}
                          onPress={() => removeFromSlot(i)}
                          languageCode={question.targetLanguage}
                          style={s.wordTile}
                        />
                      </View>
                    );
                  })}
                  {/* Measurement anchor for the next incoming word. */}
                  <View
                    ref={(r) => {
                      slotRefs.current[sentence.length] = r;
                    }}
                    onLayout={() => {
                      slotRefs.current[sentence.length]?.measureInWindow((x, y, w, h) => {
                        slotCoords.current[sentence.length] = { x, y, w, h };
                      });
                    }}
                    collapsable={false}
                    style={s.landingAnchor}
                  />
                </Animated.View>
              </View>
            </Animated.View>

            <View style={s.bankSpacer} />

            <Animated.View
              {...(Platform.OS === "web" ? ({ dir: targetDirection } as any) : {})}
              style={[
                s.bank,
                { flexDirection: "row" },
                Platform.OS !== "web" ? { direction: targetDirection } : undefined,
              ]}
            >
              {shuffledWordBank.map((w, i) => {
                const taken = usedBank[i];
                return (
                  <View
                    key={`bank-${i}`}
                    ref={(el) => {
                      bankRefs.current[i] = el;
                    }}
                    onLayout={() => {
                      bankRefs.current[i]?.measureInWindow((x, y, bw, bh) => {
                        bankCoords.current[i] = { x, y, w: bw, h: bh };
                      });
                    }}
                    collapsable={false}
                    style={s.bankCell}
                  >
                    <LightWordTile
                      label={w}
                      state={taken ? "ghost" : "idle"}
                      onPress={taken ? undefined : () => addWord(i)}
                      disabled={taken || fb === "correct"}
                      languageCode={question.targetLanguage}
                      style={s.wordTile}
                    />
                  </View>
                );
              })}
            </Animated.View>

            {/*
              Escape hatch for a muted phone or a noisy room: it reveals the
              sentence as text so the exercise stays completable, and is hidden
              once the answer is in — at that point the text is no longer a hint.
            */}
            {fb === "idle" ? (
              <Pressable
                onPress={() => setAudioGivenUp(true)}
                accessibilityRole="button"
                style={s.cantListenWrap}
              >
                <AppText style={[s.cantListen, { color: colors.mutedForeground }]}>
                  {audioGivenUp ? question.sentence : t("lessons.cantListenNow")}
                </AppText>
              </Pressable>
            ) : null}
          </View>
        </ScrollView>
      </View>

      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
        }}
      >
        {flySessions.length > 0 ? (
          <Animated.View pointerEvents="none" style={s.flyLayer} collapsable={false}>
            {flySessions.map((session) => (
              <FlyingTile
                key={session.id}
                session={session}
                onFinish={finishFly}
                languageCode={question.targetLanguage}
              />
            ))}
          </Animated.View>
        ) : null}
      </View>

      <GameFooter delay={200}>
        <View style={s.footerWrap}>
          <LightCheckButton
            label={t("lessons.check")}
            onPress={check}
            disabled={!canCheck}
          />
        </View>
      </GameFooter>
    </GameRoot>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 24,
  },
  exerciseArea: { flex: 1 },
  footerWrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
  },

  promptRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  mascotCol: {
    width: 112,
    alignItems: "center",
  },
  mascotShadow: {
    width: 56,
    height: 9,
    borderRadius: 5,
    backgroundColor: "rgba(0,0,0,0.07)",
    marginTop: -4,
  },
  bubbleWrap: { flex: 1, minWidth: 0 },
  bubble: {
    borderWidth: 2,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "stretch",
    alignSelf: "flex-start",
    minHeight: 92,
  },
  audioBtn: {
    width: 78,
    alignItems: "center",
    justifyContent: "center",
  },
  audioBtnSlow: {
    width: 70,
  },
  audioSplit: {
    width: 2,
    marginVertical: 0,
  },

  slotsWrap: {
    paddingTop: 26,
  },
  answerArea: {
    width: "100%",
    position: "relative",
  },
  placedRow: {
    flexWrap: "wrap",
    alignItems: "flex-start",
    alignContent: "flex-start",
    justifyContent: "flex-start",
  },
  placedCell: {
    height: ROW_H,
    marginEnd: TILE_GAP,
    marginBottom: ROW_GAP,
  },
  landingAnchor: {
    width: 1,
    height: ROW_H,
    marginBottom: ROW_GAP,
  },
  rail: {
    position: "absolute",
    left: 0,
    right: 0,
    height: RAIL_H,
    borderRadius: RAIL_RADIUS,
  },

  bankSpacer: {
    flex: 1,
    minHeight: 40,
  },
  bank: {
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignContent: "flex-start",
    paddingTop: 4,
    paddingBottom: 4,
  },
  bankCell: {
    height: ROW_H,
    marginEnd: TILE_GAP,
    marginBottom: 8,
  },
  wordTile: {
    height: ROW_H,
    minHeight: ROW_H,
    paddingHorizontal: 15,
    paddingVertical: 0,
  },

  cantListenWrap: {
    paddingTop: 14,
    paddingBottom: 2,
    alignItems: "center",
  },
  cantListen: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "Rabar_044",
    textAlign: "center",
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
    paddingHorizontal: 15,
    paddingVertical: 0,
  },
});
