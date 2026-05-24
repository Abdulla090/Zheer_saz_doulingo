/**
 * VoiceGame — iOS 26 Liquid Glass redesign.
 *
 * Glass card with the target word, large mic button beneath.
 * Web: uses SpeechRecognition. Native: tap-to-confirm flow.
 */

import React, { useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
    cancelAnimation,
    Easing,
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming,
} from "react-native-reanimated";

import { Icon3DCheckCircle, Icon3DMic, Icon3DVolume } from "@/components/icons/Icon3D";
import { VoiceQuestion } from "@/data/lesson-content";
import { crossShadow, crossTextShadow } from "@/utils/shadows";
import { iOS, Motion, Type } from "./game-design";
import {
    LiquidCard,
    LiquidEyebrow,
    LiquidGhostButton,
    LiquidPill,
    LiquidPrimaryButton,
} from "./liquid-primitives";

type Props = { question: VoiceQuestion; onAnswer: (correct: boolean) => void };
type ListenState = "idle" | "listening" | "success" | "fail";

function getSpeechRec(): any {
  if (typeof window === "undefined") return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
}

const isWebWithSpeech = Platform.OS === "web" && getSpeechRec() !== null;

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

  /* Mic press translateY */
  const micTy = useSharedValue(0);
  const shakeX = useSharedValue(0);
  const micStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: micTy.value }, { translateX: shakeX.value }],
  }));

  /* Pulse rings */
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
      withTiming(-7, { duration: 43 }), withTiming(7, { duration: 43 }),
      withTiming(-5, { duration: 37 }), withTiming(5, { duration: 37 }),
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
        withTiming(1.0,  { duration: 620, easing: Easing.inOut(Easing.quad) }),
      ), -1, false,
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
      if (result.includes(target) || target.includes(result)) onSuccess(result);
      else onFail();
    };
    rec.onerror = () => onFail();
    rec.onend = () => {
      if (stateRef.current === "listening") onFail();
    };

    rec.start();
    setTimeout(() => { try { rec.stop(); } catch {} }, 7000);
  };

  /* Mic background color + status text */
  const micColor =
    state === "listening" ? iOS.systemBlue
    : state === "success" ? iOS.systemGreen
    : state === "fail" ? iOS.systemRed
    : iOS.systemBlue;

  /* ───────────────────────── Native (no speech API) ───────────────────────── */
  if (!isWebWithSpeech) {
    return (
      <View style={s.root}>
        <Animated.View entering={FadeInDown.duration(260)}>
          <LiquidEyebrow>Pronunciation</LiquidEyebrow>
        </Animated.View>

        <Animated.Text
          entering={FadeInDown.delay(60).duration(260)}
          style={[s.prompt, crossTextShadow({ color: "rgba(0,0,0,0.25)", offsetY: 1, blur: 3 })]}
        >
          {question.prompt}
        </Animated.Text>

        <Animated.View entering={FadeInUp.delay(120).springify().damping(20).stiffness(160)}>
          <LiquidCard style={s.targetCard}>
            <View style={s.kuPillRow}>
              <LiquidPill tint="light" height={32} paddingHorizontal={12}>
                <Icon3DVolume size={14} />
                <Text style={s.kuHint}>{question.targetKurdish}</Text>
              </LiquidPill>
            </View>
            <Text style={s.targetWord}>{question.targetWord}</Text>
          </LiquidCard>
        </Animated.View>

        <Text style={s.mobileInstruction}>ئەم دەقەیە بە دەنگی بەرز بڵێ، پاشان هەڵبژێرە</Text>

        <Animated.View
          entering={FadeInDown.delay(220).springify().damping(20).stiffness(180)}
          style={s.actionStack}
        >
          <LiquidPrimaryButton
            label="بڵێم کرد (I said it)"
            color={iOS.systemGreen}
            icon={<Icon3DCheckCircle size={20} />}
            onPress={() => fireAnswer(true)}
          />
          <View style={{ height: 12 }} />
          <LiquidGhostButton
            label="نەمتوانی بڵێم (Skip)"
            onPress={() => fireAnswer(false)}
          />
        </Animated.View>
      </View>
    );
  }

  /* ───────────────────────── Web (speech API) ───────────────────────── */
  const statusText =
    state === "idle" ? "دوگمەی مایکرۆفۆن بپەڕینە"
    : state === "listening" ? "گوێم لێیە... قسەبکە"
    : state === "success" ? "باشە! دروستت بووە"
    : "هەڵەیە، دووبارە هەوڵبدەوە";

  const statusColor =
    state === "success" ? iOS.systemGreen
    : state === "fail" ? iOS.systemRed
    : "rgba(255,255,255,0.85)";

  return (
    <View style={s.root}>
      <Animated.View entering={FadeInDown.duration(260)}>
        <LiquidEyebrow>Pronunciation</LiquidEyebrow>
      </Animated.View>

      <Animated.Text
        entering={FadeInDown.delay(60).duration(260)}
        style={[s.prompt, crossTextShadow({ color: "rgba(0,0,0,0.25)", offsetY: 1, blur: 3 })]}
      >
        {question.prompt}
      </Animated.Text>

      <Animated.View entering={FadeInUp.delay(120).springify().damping(20).stiffness(160)}>
        <LiquidCard style={s.targetCard}>
          <View style={s.kuPillRow}>
            <LiquidPill tint="light" height={32} paddingHorizontal={12}>
              <Icon3DVolume size={14} />
              <Text style={s.kuHint}>{question.targetKurdish}</Text>
            </LiquidPill>
          </View>
          <Text style={s.targetWord}>{question.targetWord}</Text>
        </LiquidCard>
      </Animated.View>

      {/* Mic */}
      <Animated.View
        entering={FadeInUp.delay(200).springify().damping(20).stiffness(160)}
        style={s.micOuter}
      >
        <Animated.View style={[s.ring, { backgroundColor: micColor }, ringStyle]} />
        <Animated.View
          style={[
            micStyle,
            s.micFront,
            {
              backgroundColor: micColor,
              ...crossShadow({ color: micColor, offsetY: 12, opacity: 0.45, blur: 24, elevation: 12 }),
            },
          ]}
        >
          <Pressable
            onPress={startListening}
            disabled={state !== "idle"}
            onPressIn={() => { micTy.value = withSpring(6, Motion.press); }}
            onPressOut={() => { micTy.value = withSpring(0, Motion.press); }}
            style={s.micInner}
          >
            <Icon3DMic size={40} />
          </Pressable>
        </Animated.View>
      </Animated.View>

      <Text style={[s.status, { color: statusColor }]}>{statusText}</Text>

      {/* Transcript */}
      {transcript.length > 0 && (
        <Animated.View entering={FadeInUp.duration(220)} style={s.transcriptWrap}>
          <LiquidCard style={s.transcriptCard} showSheen={false}>
            <Text style={s.transcriptLabel}>YOU SAID</Text>
            <Text style={s.transcriptText}>{transcript}</Text>
          </LiquidCard>
        </Animated.View>
      )}

      {/* Retry / Skip on fail */}
      {state === "fail" && (
        <Animated.View style={[s.actionRow, skipStyle]}>
          <View style={{ flex: 1 }}>
            <LiquidPrimaryButton
              label="دووبارە هەوڵبدە"
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
          <View style={{ width: 12 }} />
          <View style={{ flex: 1 }}>
            <LiquidGhostButton
              label="بگوزەرێ"
              onPress={() => fireAnswer(false)}
            />
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 4,
    gap: 18,
  },
  prompt: {
    ...Type.title,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 4,
    writingDirection: "rtl",
  },
  targetCard: {
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 28,
    alignItems: "center",
  },
  kuPillRow: {
    flexDirection: "row",
    marginBottom: 14,
  },
  kuHint: {
    fontSize: 14,
    fontWeight: "700",
    color: iOS.blueDeep,
    letterSpacing: -0.2,
    writingDirection: "rtl",
    textAlign: "right",
  },
  targetWord: {
    fontSize: 38,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.7,
    textAlign: "center",
    lineHeight: 46,
  },

  /* Mic */
  micOuter: {
    width: 140,
    height: 140,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  ring: {
    position: "absolute",
    width: 116,
    height: 116,
    borderRadius: 58,
  },
  micFront: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
  },
  micInner: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 52,
  },

  status: {
    ...Type.body,
    textAlign: "center",
    marginTop: 4,
  },

  /* Mobile */
  mobileInstruction: {
    ...Type.body,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    marginTop: 8,
    writingDirection: "rtl",
  },
  actionStack: {
    width: "100%",
    marginTop: 8,
  },

  /* Transcript */
  transcriptWrap: {
    width: "100%",
  },
  transcriptCard: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    alignItems: "center",
  },
  transcriptLabel: {
    ...Type.eyebrow,
    color: "rgba(15,23,42,0.55)",
    marginBottom: 4,
  },
  transcriptText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.4,
  },

  actionRow: {
    flexDirection: "row",
    width: "100%",
    marginTop: "auto",
    paddingTop: 16,
  },
});
