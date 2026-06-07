/**
 * FillBlankGame — Premium light lesson UI.
 */

import { useI18n } from "@/hooks/useI18n";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { layoutMorph, tileFlyTiming } from "@/components/animations/motion";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { FillBlankQuestion } from "@/data/lesson-content";
import type { LessonPathMode } from "@/data/lesson-content";
import { ltrText } from "./game-text";
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

function FlyingTile({ session, onFinish }: { session: FlySession; onFinish: (id: string, word: string) => void }) {
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
        <LightWordTile label={session.word} state="pending" />
      </View>
    </Animated.View>
  );
}

type Props = {
  question: FillBlankQuestion;
  onAnswer: (correct: boolean | "skip", explanation?: string) => void;
  pathMode?: LessonPathMode;
};

export default function FillBlankGame({ question, onAnswer, pathMode }: Props) {
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

    const root = rootCoords.current;
    const bank = bankCoords.current[word];
    const target = blankCoords.current;

    if (!root || !bank || !target) {
      setSelected(word);
      return;
    }

    setFlySession({
      id: Math.random().toString(),
      word,
      fromX: bank.x - root.x,
      fromY: bank.y - root.y,
      fromW: bank.w,
      fromH: bank.h,
      toX: target.x - root.x,
      toY: target.y - root.y,
      toW: target.w,
      toH: target.h,
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

  const blankBorder =
    revealed && selected
      ? selected === question.correctAnswer
        ? L.green
        : L.red
      : selected || flySession
        ? L.blue
        : L.slotDash;

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
          subtitle={t("lessons.fillBlankSub")}
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
          <View style={[s.sentenceRow, { flexDirection: isKu ? "row-reverse" : "row" }]}>
            {question.sentenceParts[0] ? (
              <Text style={s.sentenceText}>{question.sentenceParts[0]} </Text>
            ) : null}
            <View
              ref={blankRef}
              collapsable={false}
              style={[s.blank, { borderColor: blankBorder }]}
              onLayout={() => {
                blankRef.current?.measureInWindow((x, y, w, h) => {
                  blankCoords.current = { x, y, w, h };
                });
              }}
            >
              <Text style={s.blankText}>{flySession ? "" : (selected || "____")}</Text>
            </View>
            {question.sentenceParts[1] ? (
              <Text style={s.sentenceText}> {question.sentenceParts[1]}</Text>
            ) : null}
          </View>
        </LightSurfaceCard>
      </Animated.View>

      <View style={[s.chipsWrap, { flexDirection: isKu ? "row-reverse" : "row" }]}>
        {question.options.map((w) => {
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
            <FlyingTile session={flySession} onFinish={finishFly} />
          </Animated.View>
        ) : null}
      </View>

      <GameFooter>
        <LightCheckButton
          label={t("lessons.check")}
          onPress={check}
          disabled={!selected || revealed || !!flySession}
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
    gap: 16,
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
    ...ltrText,
  },
  blank: {
    minWidth: 88,
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: "dashed",
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: L.bgSoft,
  },
  blankText: {
    fontSize: 17,
    fontWeight: "800",
    color: L.navy,
    fontFamily: "DINNextRoundedBold",
    ...ltrText,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
});
