 
 
import { useI18n } from "../../../hooks/useI18n";
import React, { useRef, useState } from "react";
import { StyleSheet, View, Pressable, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { layoutSmooth, tileFlyTiming } from "../../../components/animations/motion";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { AppText } from "../../../components/ui/AppText";

import { FillBlankQuestion } from "../../../data/lesson-content";
import type { LessonPathMode } from "../../../data/lesson-content";
import { ltrText, isRtlText } from "./game-text";
import { GameFooter, GameHeader, GameRoot } from "./GameAnimatedShell";
import { L } from "./lesson-light-design";
import {
  LightCheckButton,
  LightGameHeading,
  LightQuestionPrompt,
  LightSurfaceCard,
  LightWordTile,
  mapOptionState,
} from "./lesson-light-primitives";

type FlySession = {
  id: string;
  word: string;
  fromX: number;
  fromY: number;
  fromW: number;
  fromH: number;
  toX: number;
  toY: number;
  toW: number;
  toH: number;
};

const getWebCoords = (el: any) => {
  if (!el) return null;
  if (Platform.OS !== "web") return null;
  try {
    let node = el;
    if (typeof node.getBoundingClientRect === "function") {
      const r = node.getBoundingClientRect();
      return { x: r.left, y: r.top, w: r.width, h: r.height };
    }
    if (node._component && typeof node._component.getBoundingClientRect === "function") {
      const r = node._component.getBoundingClientRect();
      return { x: r.left, y: r.top, w: r.width, h: r.height };
    }
    if (typeof node.getHostNode === "function") {
      const host = node.getHostNode();
      if (host && typeof host.getBoundingClientRect === "function") {
        const r = host.getBoundingClientRect();
        return { x: r.left, y: r.top, w: r.width, h: r.height };
      }
    }
  } catch (err) {
    console.error("Error measuring web coords:", err);
  }
  return null;
};

function FlyingTile({ session, onFinish, isKids }: { session: FlySession; onFinish: (id: string, word: string) => void; isKids?: boolean }) {
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
      if (finished) runOnJS(onFinish)(session.id, session.word);
    });
  }, [session, onFinish, flyProgress]);

  return (
    <Animated.View style={flyStyle}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <LightWordTile label={session.word} state="pending" isKids={isKids} />
      </View>
    </Animated.View>
  );
}

type Props = {
  question: FillBlankQuestion;
  onAnswer: (correct: boolean | "skip", explanation?: string) => void;
  pathMode?: LessonPathMode;
  questionIndex?: number;
  totalQuestions?: number;
};

export default function FillBlankGame({ question, onAnswer, pathMode, questionIndex, totalQuestions }: Props) {
  const { t, isKu } = useI18n();
  const [selected, setSelected] = useState<string | null>(null);
  const [flySession, setFlySession] = useState<FlySession | null>(null);
  const [revealed, setRevealed] = useState(false);
  const firedRef = useRef(false);
  
  const rootRef = useRef<View>(null);
  const blankRef = useRef<View>(null);
  const bankRefs = useRef<Record<string, View | null>>({});

  const rootCoords = useRef<{ x: number; y: number } | null>(null);
  const bankCoords = useRef<Record<string, { x: number; y: number; w: number; h: number }>>({});
  const blankCoords = useRef<{ x: number; y: number; w: number; h: number } | null>(null);

  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const flyIdCounter = useRef(0);

  React.useEffect(() => {
    setSelected(null);
    setFlySession(null);
    setRevealed(false);
    firedRef.current = false;
    bankCoords.current = {};
    blankCoords.current = null;
  }, [question]);

  const finishFly = (id: string, word: string) => {
    setSelected(word);
    setFlySession(null);
  };

  const pick = (word: string) => {
    if (revealed) return;
    if (selected === word) return;

    let root = rootCoords.current;
    let bank = bankCoords.current[word];
    let target = blankCoords.current;

    if (Platform.OS === 'web') {
      const webRoot = getWebCoords(rootRef.current);
      const webBank = getWebCoords(bankRefs.current[word]);
      const webTarget = getWebCoords(blankRef.current);
      if (webRoot) root = webRoot;
      if (webBank) bank = webBank;
      if (webTarget) target = webTarget;
    }

    if (!root || !bank || !target) {
      setSelected(word);
      return;
    }

    flyIdCounter.current += 1;
    setFlySession({
      id: `fly_${flyIdCounter.current}`,
      word,
      fromX: bank.x - root.x,
      fromY: bank.y - root.y,
      fromW: bank.w,
      fromH: bank.h,
      toX: target.x - root.x + (target.w - bank.w) / 2,
      toY: target.y - root.y + (target.h - bank.h) / 2,
      toW: bank.w,
      toH: bank.h,
    });
  };

  const check = () => {
    if (!selected || revealed) return;
    setRevealed(true);
    const ok = selected === question.correctAnswer;

    if (!ok) {
      shakeX.value = withSequence(
        withTiming(-8, { duration: 36 }),
        withTiming(8, { duration: 36 }),
        withTiming(0, { duration: 40, easing: Easing.out(Easing.quad) }),
      );
    }

    if (!firedRef.current) {
      firedRef.current = true;
      onAnswer(ok);
    }
  };

  const getState = (w: string) => {
    if (!revealed) return w === selected ? "selected" : "idle";
    if (w === selected) {
      return w === question.correctAnswer ? "correct" : "wrong";
    }
    return "idle";
  };

  const shuffledOptions = React.useMemo(() => {
    const opts = [...question.options];
    let seed = 0;
    for (const opt of question.options) {
      for (let i = 0; i < opt.length; i++) {
        seed = opt.charCodeAt(i) + ((seed << 5) - seed);
      }
    }
    const a = [...opts];
    let s = seed;
    for (let i = a.length - 1; i > 0; i--) {
      s = (s * 1664525 + 1013904223) & 0xffffffff;
      const j = Math.abs(s) % (i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }, [question.options]);

  const blankBorder =
    revealed && selected
      ? selected === question.correctAnswer
        ? L.green
        : L.red
      : selected || flySession
        ? L.blue
        : L.slotDash;

  const kidsBadgeText = pathMode === "kids" && questionIndex !== undefined && totalQuestions !== undefined
    ? `EXERCISE ${questionIndex + 1} OF ${totalQuestions}`
    : undefined;

  return (
    <GameRoot style={s.root}>
      <View
        ref={rootRef}
        style={{ flex: 1 }}
        collapsable={false}
        onLayout={() => {
          rootRef.current?.measureInWindow((x, y) => {
            rootCoords.current = { x, y };
          });
        }}
      >
      <GameHeader>
        <LightGameHeading
          title={t("lessons.fillBlank")}
          badge={kidsBadgeText}
        />
      </GameHeader>

      <LightQuestionPrompt
        label={t("lessons.questionLabel")}
        forceKurdishFont
        variant={pathMode === "kids" ? "kids" : "default"}
      >
        {question.kurdishHint}
      </LightQuestionPrompt>

      <Animated.View style={shakeStyle}>
        <LightSurfaceCard>
          <Animated.View layout={layoutSmooth} style={[s.sentenceRow, { flexDirection: isKu ? (isRtlText(question.sentenceParts.join(" ")) ? "row" : "row-reverse") : (isRtlText(question.sentenceParts.join(" ")) ? "row-reverse" : "row") }]}>
            {question.sentenceParts[0] ? (
              <AppText style={s.sentenceText}>{question.sentenceParts[0]} </AppText>
            ) : null}
            <Animated.View
              ref={blankRef}
              layout={layoutSmooth}
              collapsable={false}
              style={s.blankContainer}
              onLayout={() => {
                blankRef.current?.measureInWindow((x, y, w, h) => {
                  blankCoords.current = { x, y, w, h };
                });
              }}
            >
              {selected && !flySession ? (
                <Animated.View layout={layoutSmooth}>
                  <LightWordTile
                    label={selected}
                    state={mapOptionState(getState(selected))}
                    onPress={() => {
                      if (revealed) return;
                      if (Platform.OS !== "web") {
                        void Haptics.selectionAsync();
                      }
                      setSelected(null);
                    }}
                    isKids={pathMode === "kids"}
                  />
                </Animated.View>
              ) : (
                <View style={[s.emptySlot, { borderColor: blankBorder }]}>
                  <AppText style={s.blankPlaceholder}>____</AppText>
                </View>
              )}
            </Animated.View>
            {question.sentenceParts[1] ? (
              <AppText style={s.sentenceText}> {question.sentenceParts[1]}</AppText>
            ) : null}
          </Animated.View>
        </LightSurfaceCard>
      </Animated.View>

      <View style={[s.chipsWrap, { flexDirection: isKu ? "row-reverse" : "row" }]}>
        {shuffledOptions.map((w) => {
          const isFlying = flySession?.word === w;
          const isSelected = selected === w;
          // Hide the chip if it is currently flying, OR if it's selected and not revealed yet
          // Wait, if it's revealed, we want to show it? No, selected chips in FillBlankGame usually stay in the slot, 
          // or we can make them disappear from the bank just like SentenceBuilderGame.
          // Let's make it disappear from the bank to match.
          const isTaken = isFlying || isSelected;

          return (
            <View
              key={w}
              ref={(el) => { bankRefs.current[w] = el; }}
              collapsable={false}
              style={{ opacity: isTaken ? 0 : 1 }}
              pointerEvents={isTaken ? "none" : "auto"}
              onLayout={() => {
                bankRefs.current[w]?.measureInWindow((x, y, w, h) => {
                  bankCoords.current[w] = { x, y, w, h };
                });
              }}
            >
              <LightWordTile
                label={w}
                state={mapOptionState(getState(w))}
                onPress={() => pick(w)}
                disabled={revealed}
                isKids={pathMode === "kids"}
              />
            </View>
          );
        })}
      </View>

      <View style={{ flex: 1 }} />

      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none" }}>
        {flySession ? (
          <Animated.View
            pointerEvents="none"
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 40 }}
            collapsable={false}
          >
            <FlyingTile session={flySession} onFinish={finishFly} isKids={pathMode === "kids"} />
          </Animated.View>
        ) : null}
      </View>

      <GameFooter>
        <LightCheckButton
          label={t("lessons.check")}
          onPress={check}
          disabled={!selected || revealed || !!flySession}
          variant={pathMode === "kids" ? "kids" : "default"}
        />
      </GameFooter>
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
    gap: 24,
  },
  sentenceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  sentenceText: {
    fontSize: 19,
    fontWeight: "700",
    color: L.navy,
    lineHeight: 28,
    fontFamily: "DINNextRoundedBold",
    backgroundColor: "transparent",
    ...ltrText,
  },
  blankContainer: {
    minWidth: 88,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  emptySlot: {
    minWidth: 88,
    height: 48,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: L.slotDash,
    backgroundColor: L.bgSoft,
    justifyContent: "center",
    alignItems: "center",
  },
  blankPlaceholder: {
    fontSize: 17,
    fontWeight: "800",
    color: L.navy,
    fontFamily: "DINNextRoundedBold",
    opacity: 0.35,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
    marginTop: 20,
  },
});
