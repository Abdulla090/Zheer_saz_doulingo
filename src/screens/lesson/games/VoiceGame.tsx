/**
 * VoiceGame — mic-first speaking practice.
 * Uses expo-speech-recognition on native and web.
 */

import { AppText } from "@/components/ui/AppText";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { MicCaptureOrb } from "@/components/voice/MicCaptureOrb";
import { VoiceQuestion } from "@/data/lesson-content";
import { useI18n } from "@/hooks/useI18n";
import { useSpeechCapture } from "@/hooks/use-speech-capture";
import { GameFooter, GameHeader } from "./GameAnimatedShell";
import { LightGameHeading } from "./lesson-light-primitives";
import { L } from "./lesson-light-design";
import { ltrText, rtlBlock } from "./game-text";

type Props = { question: VoiceQuestion; onAnswer: (correct: boolean) => void };
type ListenState = "idle" | "listening" | "success" | "fail";

const LISTEN_TIMEOUT_MS = 12000;
/** Android often fires `end` immediately unless continuous mode + grace period. */
const MIN_LISTEN_MS = Platform.OS === "android" ? 1800 : 900;

function normalizeSpeech(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\w\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchesTarget(result: string, target: string) {
  const r = normalizeSpeech(result);
  const t = normalizeSpeech(target);
  if (!t || !r) return false;
  if (r.includes(t) || t.includes(r)) return true;

  const rWords = r.split(" ");
  const tWords = t.split(" ");
  const keyWords = tWords.filter((w) => w.length > 1);
  if (keyWords.length === 0) {
    return rWords.some((w) => w === t);
  }

  const hits = keyWords.filter((w) =>
    rWords.some((rw) => rw === w || rw.includes(w) || w.includes(rw)),
  );
  return hits.length >= Math.ceil(keyWords.length * 0.5);
}

const BENIGN_SPEECH_ERRORS = new Set([
  "no-speech",
  "aborted",
  "audio-capture",
  "network",
]);

export default function VoiceGame({ question, onAnswer }: Props) {
  const { t } = useI18n();
  const [state, setState] = useState<ListenState>("idle");
  const [transcript, setTranscript] = useState("");
  const firedRef = useRef(false);
  const stateRef = useRef<ListenState>("idle");
  const transcriptRef = useRef("");
  const listenTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listenStartedAtRef = useRef(0);

  const speech = useSpeechCapture("en-US");
  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const updateState = (s: ListenState) => {
    stateRef.current = s;
    setState(s);
  };

  const clearListenTimeout = () => {
    if (listenTimeoutRef.current) {
      clearTimeout(listenTimeoutRef.current);
      listenTimeoutRef.current = null;
    }
  };

  const fireAnswer = (correct: boolean) => {
    if (firedRef.current) return;
    firedRef.current = true;
    onAnswer(correct);
  };

  const stopSession = useCallback(() => {
    clearListenTimeout();
    speech.stop();
  }, [speech]);

  useEffect(() => () => {
    clearListenTimeout();
    speech.abort();
  }, [speech]);

  const onSuccess = useCallback(
    (text: string) => {
      stopSession();
      setTranscript(text);
      updateState("success");
      setTimeout(() => fireAnswer(true), 700);
    },
    [stopSession],
  );

  const onFail = useCallback(() => {
    if (stateRef.current === "fail" || stateRef.current === "success") return;
    stopSession();
    updateState("fail");
    shakeX.value = withSequence(
      withTiming(-6, { duration: 40 }),
      withTiming(6, { duration: 40 }),
      withTiming(0, { duration: 50, easing: Easing.out(Easing.quad) }),
    );
  }, [shakeX, stopSession]);

  const buildHandlers = useCallback(
    () => ({
      onResult: (text: string, _isFinal: boolean) => {
        transcriptRef.current = text;
        setTranscript(text);
        if (matchesTarget(text, question.targetWord)) {
          onSuccess(text);
        }
      },
      onEnd: () => {
        if (stateRef.current !== "listening") return;

        const elapsed = Date.now() - listenStartedAtRef.current;
        const last = transcriptRef.current;

        if (last && matchesTarget(last, question.targetWord)) {
          onSuccess(last);
          return;
        }

        // Native: ignore premature engine stop; timeout handles real failure.
        if (Platform.OS !== "web" && elapsed < MIN_LISTEN_MS) {
          return;
        }

        if (Platform.OS === "web") {
          onFail();
        }
      },
      onError: (code: string) => {
        if (stateRef.current !== "listening") return;
        if (BENIGN_SPEECH_ERRORS.has(code)) return;
        onFail();
      },
    }),
    [onFail, onSuccess, question.targetWord],
  );

  const startListening = useCallback(async () => {
    if (stateRef.current !== "idle" && stateRef.current !== "fail") return;
    if (!speech.available) {
      onFail();
      return;
    }

    firedRef.current = false;
    transcriptRef.current = "";
    setTranscript("");
    listenStartedAtRef.current = Date.now();
    updateState("listening");
    clearListenTimeout();
    listenTimeoutRef.current = setTimeout(() => {
      if (stateRef.current === "listening") onFail();
    }, LISTEN_TIMEOUT_MS);

    const started = await speech.start(buildHandlers(), { continuous: true });
    if (!started) {
      onFail();
      return;
    }

    listenStartedAtRef.current = Date.now();
  }, [buildHandlers, onFail, speech]);

  const handleMicPress = () => {
    if (state === "listening") {
      stopSession();
      onFail();
      return;
    }
    if (state === "fail") {
      updateState("idle");
      void startListening();
      return;
    }
    if (state === "idle") void startListening();
  };

  const micColor =
    state === "listening"
      ? L.blue
      : state === "success"
        ? L.green
        : state === "fail"
          ? L.red
          : L.blue;

  const statusText =
    state === "idle"
      ? t("lessons.tapMicSpeak")
      : state === "listening"
        ? t("lessons.listening")
        : state === "success"
          ? t("lessons.nice")
          : speech.error || t("lessons.micRetry");

  const micOnly = Platform.OS !== "web";

  return (
    <View style={s.root}>
      {!micOnly ? (
        <GameHeader>
          <LightGameHeading
            title={t("lessons.sayOutLoud")}
            subtitle={question.targetWord}
          />
        </GameHeader>
      ) : null}

      <View style={s.micStage}>
        {micOnly ? (
          <AppText style={s.targetHint} forceLatinFont>
            {question.targetWord}
          </AppText>
        ) : null}
        <Animated.View style={shakeStyle}>
          <MicCaptureOrb
            listening={state === "listening" || speech.listening}
            disabled={state === "success"}
            color={micColor}
            size={micOnly ? 120 : 108}
            hint={statusText}
            onPress={handleMicPress}
          />
        </Animated.View>

        {!micOnly && question.prompt ? (
          <Text style={s.prompt}>{question.prompt}</Text>
        ) : null}

        {transcript.length > 0 ? (
          <Text style={s.transcript} numberOfLines={2}>
            {transcript}
          </Text>
        ) : null}
      </View>

      {state === "fail" ? (
        <GameFooter delay={120}>
          <Text style={s.skipLink} onPress={() => fireAnswer(false)}>
            Skip
          </Text>
        </GameFooter>
      ) : null}
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
  micStage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingBottom: 48,
  },
  targetHint: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
    letterSpacing: -0.3,
    fontFamily: "DINNextRoundedBold",
    paddingHorizontal: 24,
    ...ltrText,
  },
  prompt: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
    color: L.gray,
    textAlign: "center",
    fontFamily: "DINNextRoundedMedium",
    ...rtlBlock,
    paddingHorizontal: 12,
  },
  transcript: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
    ...ltrText,
    paddingHorizontal: 20,
  },
  skipLink: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: L.gray,
    fontFamily: "DINNextRoundedBold",
    paddingVertical: 12,
  },
});
