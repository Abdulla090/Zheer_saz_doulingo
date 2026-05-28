/**
 * VoiceGame — iOS 26 Liquid Glass redesign.
 *
 * Glass card with the target phrase, large mic button beneath.
 * Web: uses SpeechRecognition. Native: tap-to-confirm flow.
 */

import React, { useRef, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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
import { Radius, iOS, Type } from "./game-design";
import { ltrText, rtlBlock } from "./game-text";
import {
  GameCard,
  GameFooter,
  GameHeader,
  GameHint,
  GamePopIn,
  GameRoot,
} from "./GameAnimatedShell";
import {
  LightCheckButton,
  LightGameHeading,
  LightHintButton,
  LightPromptCard,
  LightSurfaceCard,
} from "./lesson-light-primitives";
import { L } from "./lesson-light-design";

type Props = { question: VoiceQuestion; onAnswer: (correct: boolean) => void };
type ListenState = "idle" | "listening" | "success" | "fail";

function getSpeechRec(): any {
  if (typeof window === "undefined") return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
}

const isWebWithSpeech = Platform.OS === "web" && getSpeechRec() !== null;

function TargetPhraseCard({ question }: { question: VoiceQuestion }) {
  return (
    <LightPromptCard
      kurdish={question.targetKurdish}
      english={question.targetWord}
    />
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

  const updateState = (s: ListenState) => {
    stateRef.current = s;
    setState(s);
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
      ? L.blue
      : state === "success"
        ? L.green
        : state === "fail"
          ? L.red
          : L.blue;

  if (!isWebWithSpeech) {
    return (
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <GameHeader>
          <LightGameHeading
            title="Say it out loud"
            subtitle="Read the phrase, then confirm."
          />
        </GameHeader>
        <Text style={s.prompt}>{question.prompt}</Text>
        <TargetPhraseCard question={question} />
        <Text style={s.mobileInstruction}>
          ئەم دەقەیە بە دەنگی بەرز بڵێ، پاشان هەڵبژێرە
        </Text>
        <GameFooter delay={220}>
          <View style={s.actionStack}>
            <LightCheckButton
              label="I SAID IT"
              color={L.green}
              onPress={() => fireAnswer(true)}
            />
            <View style={{ height: 10 }} />
            <LightHintButton label="Skip" showBulb={false} onPress={() => fireAnswer(false)} />
          </View>
        </GameFooter>
      </ScrollView>
    );
  }

  const statusText =
    state === "idle"
      ? "دوگمەی مایکرۆفۆن بپەڕینە"
      : state === "listening"
        ? "گوێم لێیە... قسەبکە"
        : state === "success"
          ? "باشە! دروستت بووە"
          : "هەڵەیە، دووبارە هەوڵبدەوە";

  const statusColor =
    state === "success"
      ? L.green
      : state === "fail"
        ? L.red
        : L.gray;

  return (
    <View style={s.root}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <GameHeader>
          <LightGameHeading
            title="Say it out loud"
            subtitle="Tap the mic and speak clearly."
          />
        </GameHeader>
        <Text style={s.prompt}>{question.prompt}</Text>
        <TargetPhraseCard question={question} />

        <GameFooter delay={200}>
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
                    offsetY: 10,
                    opacity: 0.35,
                    blur: 22,
                    elevation: 10,
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
                <Icon3DMic size={36} />
              </Pressable>
            </Animated.View>
          </View>

          <Text style={[s.status, { color: statusColor }]}>{statusText}</Text>
          </View>
        </GameFooter>

        {transcript.length > 0 && (
          <GamePopIn>
          <LightSurfaceCard style={s.transcriptCard}>
            <Text style={s.transcriptLabel}>YOU SAID</Text>
            <Text style={s.transcriptText}>{transcript}</Text>
          </LightSurfaceCard>
          </GamePopIn>
        )}
      </ScrollView>

      {state === "fail" && (
        <Animated.View style={[s.actionRow, skipStyle]}>
          <View style={{ flex: 1 }}>
            <LightCheckButton
              label="TRY AGAIN"
              onPress={() => {
                firedRef.current = false;
                setState("idle");
                stateRef.current = "idle";
                setTranscript("");
                skipO.value = withTiming(0, { duration: 200 });
              }}
            />
          </View>
          <View style={{ width: 10 }} />
          <View style={{ flex: 1 }}>
            <LightHintButton label="Skip" showBulb={false} onPress={() => fireAnswer(false)} />
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 6,
    paddingBottom: 12,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: 20,
    paddingBottom: 8,
  },
  prompt: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: L.gray,
    fontFamily: "DINNextRoundedMedium",
    ...rtlBlock,
  },
  targetCard: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
    minHeight: 128,
  },
  cardInner: {
    width: "100%",
    gap: 18,
    alignItems: "center",
  },
  kuRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    paddingHorizontal: 4,
  },
  kuText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
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
    letterSpacing: -0.35,
    color: "#0F172A",
    textAlign: "center",
    width: "100%",
    ...ltrText,
  },
  micSection: {
    alignItems: "center",
    gap: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  micOuter: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    width: 108,
    height: 108,
    borderRadius: 54,
  },
  micFront: {
    width: 96,
    height: 96,
    borderRadius: 48,
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
    borderRadius: 48,
  },
  status: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    fontFamily: "DINNextRoundedMedium",
    ...rtlBlock,
  },
  mobileInstruction: {
    fontSize: 15,
    color: L.gray,
    textAlign: "center",
    fontFamily: "DINNextRoundedMedium",
    ...rtlBlock,
  },
  actionStack: {
    width: "100%",
    paddingTop: 4,
  },
  transcriptCard: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    alignItems: "center",
    gap: 6,
  },
  transcriptLabel: {
    ...Type.eyebrow,
    fontSize: 10,
    color: "rgba(15,23,42,0.45)",
    letterSpacing: 1.6,
    ...ltrText,
  },
  transcriptText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.3,
    lineHeight: 28,
    textAlign: "center",
    width: "100%",
    ...ltrText,
  },
  actionRow: {
    flexDirection: "row",
    width: "100%",
    paddingTop: 10,
  },
});
