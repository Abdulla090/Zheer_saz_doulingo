/**
 * VoiceGame — iOS 26 Liquid Glass redesign.
 */

import React, { useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { Icon3DCheckCircle, Icon3DMic, Icon3DVolume } from "@/components/icons/Icon3D";
import { VoiceQuestion } from "@/data/lesson-content";
import { crossShadow } from "@/utils/shadows";
import { GameSpace, Radius, iOS, Type } from "./game-design";
import { ltrText, rtlBlock } from "./game-text";
import { GameCard, GameRoot } from "./GameAnimatedShell";
import { GameScreenLayout } from "./GameScreenLayout";
import {
  LiquidCard,
  LiquidEyebrow,
  LiquidGhostButton,
  LiquidPrimaryButton,
} from "./liquid-primitives";

type Props = { question: VoiceQuestion; onAnswer: (correct: boolean) => void };
type ListenState = "idle" | "listening" | "success" | "fail";

function getSpeechRec(): any {
  if (typeof window === "undefined") return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
}

const isWebWithSpeech = Platform.OS === "web" && getSpeechRec() !== null;

function TargetPhraseCard({ question }: { question: VoiceQuestion }) {
  const phraseLength = question.targetWord.length;
  const phraseSize = phraseLength > 48 ? 18 : phraseLength > 32 ? 20 : 22;

  return (
    <LiquidCard style={s.targetCard} radius={Radius.lg} showSheen={false}>
      <View style={s.cardInner}>
        <View style={s.kuRow}>
          <Icon3DVolume size={14} />
          <Text style={s.kuText} numberOfLines={2}>
            {question.targetKurdish}
          </Text>
        </View>
        <View style={s.divider} />
        <Text
          style={[s.targetPhrase, { fontSize: phraseSize, lineHeight: phraseSize + 6 }]}
          numberOfLines={4}
        >
          {question.targetWord}
        </Text>
      </View>
    </LiquidCard>
  );
}

export default function VoiceGame({ question, onAnswer }: Props) {
  const [state, setState] = useState<ListenState>("idle");
  const [transcript, setTranscript] = useState("");
  const recRef = useRef<any>(null);
  const firedRef = useRef(false);
  const stateRef = useRef<ListenState>("idle");

  const fireAnswer = (correct: boolean) => {
    if (firedRef.current) return;
    firedRef.current = true;
    onAnswer(correct);
  };

  const updateState = (next: ListenState) => {
    stateRef.current = next;
    setState(next);
  };

  const micTy = useSharedValue(0);
  const shakeX = useSharedValue(0);
  const micStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: micTy.value }, { translateX: shakeX.value }],
  }));

  const ringS = useSharedValue(1);
  const ringO = useSharedValue(0);
  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringS.value }],
    opacity: ringO.value,
  }));

  const skipO = useSharedValue(0);
  const skipStyle = useAnimatedStyle(() => ({ opacity: skipO.value }));

  const stopPulse = () => {
    cancelAnimation(ringS);
    ringS.value = withTiming(1, { duration: 200 });
    ringO.value = withTiming(0, { duration: 240 });
  };

  const onSuccess = (text: string) => {
    stopPulse();
    setTranscript(text);
    updateState("success");
    micTy.value = withSequence(
      withTiming(4, { duration: 105, easing: Easing.out(Easing.cubic) }),
      withTiming(0, { duration: 155, easing: Easing.inOut(Easing.quad) }),
    );
    setTimeout(() => fireAnswer(true), 900);
  };

  const onFail = () => {
    if (stateRef.current === "fail" || stateRef.current === "success") return;
    stopPulse();
    updateState("fail");
    shakeX.value = withSequence(
      withTiming(-7, { duration: 43 }),
      withTiming(7, { duration: 43 }),
      withTiming(-5, { duration: 37 }),
      withTiming(5, { duration: 37 }),
      withTiming(0, { duration: 50, easing: Easing.out(Easing.quad) }),
    );
    skipO.value = withTiming(1, { duration: 300 });
  };

  const startListening = () => {
    if (stateRef.current !== "idle") return;
    updateState("listening");

    ringO.value = withTiming(0.5, { duration: 180 });
    ringS.value = withRepeat(
      withSequence(
        withTiming(1.55, { duration: 720, easing: Easing.inOut(Easing.quad) }),
        withTiming(1.0, { duration: 620, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );

    const Rec = getSpeechRec();
    const rec = new Rec();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    recRef.current = rec;

    rec.onresult = (e: any) => {
      const result = e.results[0][0].transcript.toLowerCase().trim();
      setTranscript(result);
      const target = question.targetWord.toLowerCase();
      const keyWords = target.split(/\s+/).filter((w) => w.length > 2);
      const matched =
        result.includes(target) ||
        target.includes(result) ||
        keyWords.filter((w) => result.includes(w)).length >= Math.ceil(keyWords.length * 0.55);
      if (matched) onSuccess(result);
      else onFail();
    };
    rec.onerror = () => onFail();
    rec.onend = () => {
      if (stateRef.current === "listening") onFail();
    };

    rec.start();
    setTimeout(() => {
      try {
        rec.stop();
      } catch {}
    }, 7000);
  };

  const micColor =
    state === "listening"
      ? iOS.systemBlue
      : state === "success"
        ? iOS.systemGreen
        : state === "fail"
          ? iOS.systemRed
          : iOS.systemBlue;

  if (!isWebWithSpeech) {
    return (
      <GameRoot style={{ flex: 1 }}>
        <GameScreenLayout
          header={<LiquidEyebrow>Speak</LiquidEyebrow>}
          bodyStyle={s.body}
          footer={
            <View style={s.actionStack}>
              <LiquidPrimaryButton
                label="I said it"
                color={iOS.systemGreen}
                icon={<Icon3DCheckCircle size={18} />}
                onPress={() => fireAnswer(true)}
              />
              <View style={{ height: 8 }} />
              <LiquidGhostButton label="Skip" onPress={() => fireAnswer(false)} />
            </View>
          }
        >
          <GameCard>
            <TargetPhraseCard question={question} />
          </GameCard>
        </GameScreenLayout>
      </GameRoot>
    );
  }

  const statusText =
    state === "idle"
      ? "Tap mic to speak"
      : state === "listening"
        ? "Listening…"
        : state === "success"
          ? "Nice!"
          : "Try again";

  const statusColor =
    state === "success"
      ? iOS.systemGreen
      : state === "fail"
        ? iOS.systemRed
        : "rgba(255,255,255,0.78)";

  return (
    <GameRoot style={{ flex: 1 }}>
      <GameScreenLayout
        header={<LiquidEyebrow>Speak</LiquidEyebrow>}
        bodyStyle={s.body}
        footer={
          state === "fail" ? (
            <Animated.View style={[s.actionRow, skipStyle]}>
              <View style={{ flex: 1 }}>
                <LiquidPrimaryButton
                  label="Retry"
                  color={iOS.systemBlue}
                  onPress={() => {
                    firedRef.current = false;
                    setState("idle");
                    stateRef.current = "idle";
                    setTranscript("");
                    skipO.value = withTiming(0, { duration: 200 });
                  }}
                />
              </View>
              <View style={{ width: 8 }} />
              <View style={{ flex: 1 }}>
                <LiquidGhostButton label="Skip" onPress={() => fireAnswer(false)} />
              </View>
            </Animated.View>
          ) : undefined
        }
      >
        <GameCard>
          <TargetPhraseCard question={question} />
        </GameCard>

        <View style={s.micSection}>
          <View style={s.micOuter}>
            <Animated.View style={[s.ring, { backgroundColor: micColor }, ringStyle]} />
            <Animated.View
              style={[
                micStyle,
                s.micFront,
                {
                  backgroundColor: micColor,
                  ...crossShadow({
                    color: micColor,
                    offsetY: 8,
                    opacity: 0.32,
                    blur: 18,
                    elevation: 8,
                  }),
                },
              ]}
            >
              <Pressable
                onPress={startListening}
                disabled={state !== "idle"}
                onPressIn={() => {
                  micTy.value = withTiming(3, { duration: 90 });
                }}
                onPressOut={() => {
                  micTy.value = withTiming(0, { duration: 120 });
                }}
                style={s.micInner}
              >
                <Icon3DMic size={32} />
              </Pressable>
            </Animated.View>
          </View>
          <Text style={[s.status, { color: statusColor }]}>{statusText}</Text>
          {transcript.length > 0 && (
            <Text style={s.transcriptInline} numberOfLines={2}>
              {transcript}
            </Text>
          )}
        </View>
      </GameScreenLayout>
    </GameRoot>
  );
}

const s = StyleSheet.create({
  body: {
    gap: GameSpace.gap,
    alignItems: "center",
  },
  targetCard: {
    paddingHorizontal: GameSpace.cardPadH,
    paddingVertical: GameSpace.cardPadV,
    width: "100%",
  },
  cardInner: {
    width: "100%",
    gap: 10,
    alignItems: "center",
  },
  kuRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 8,
    width: "100%",
  },
  kuText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    color: iOS.systemBlue,
    textAlign: "center",
    ...rtlBlock,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(15,23,42,0.08)",
  },
  targetPhrase: {
    fontWeight: "700",
    letterSpacing: -0.3,
    color: "#0F172A",
    textAlign: "center",
    width: "100%",
    ...ltrText,
  },
  micSection: {
    alignItems: "center",
    gap: 10,
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  micOuter: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    width: 92,
    height: 92,
    borderRadius: 46,
  },
  micFront: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.35)",
  },
  micInner: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
  },
  status: {
    ...Type.caption,
    fontWeight: "600",
    textAlign: "center",
    ...ltrText,
  },
  transcriptInline: {
    ...Type.caption,
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    paddingHorizontal: 12,
    ...ltrText,
  },
  actionStack: {
    width: "100%",
  },
  actionRow: {
    flexDirection: "row",
    width: "100%",
  },
});
