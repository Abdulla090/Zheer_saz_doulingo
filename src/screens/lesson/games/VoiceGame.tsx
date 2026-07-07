/* eslint-disable */
/**
 * VoiceGame — mic-first speaking practice.
 * Prefers Gemini audio evaluation when AI speech grading is configured;
 * falls back to expo-speech-recognition (Web Speech API on web), then manual self-check.
 */

import { AppText } from "../../../components/ui/AppText";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View, TextInput } from "react-native";
import { Image } from "expo-image";
import { crossShadow } from "../../../utils/shadows";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  FadeInUp,
} from "react-native-reanimated";

import { MicCaptureOrb } from "../../../components/voice/MicCaptureOrb";
import { VoiceQuestion } from "../../../data/lesson-content";
import type { LessonPathMode } from "../../../data/lesson-content";
import { useI18n } from "../../../hooks/useI18n";
import { useSpeechCapture } from "../../../hooks/use-speech-capture";
import { useTTS } from "../../../hooks/use-tts";
import { matchesTarget } from "../../../utils/speech-match";
import { GameFooter, GameHeader, GameRoot } from "./GameAnimatedShell";
import {
  LightCheckButton,
  LightGameHeading,
  LightQuestionPrompt,
  SpeakerIcon,
  SpringPressable,
} from "./lesson-light-primitives";
import { L } from "./lesson-light-design";
import { ltrText, rtlBlock } from "./game-text";

type Props = {
  question: VoiceQuestion;
  onAnswer: (correct: boolean | "skip") => void;
  pathMode?: LessonPathMode;
};
type ListenState = "idle" | "listening" | "processing" | "success" | "fail";
type CaptureBackend = "gemini" | "speech" | "manual";

const LISTEN_TIMEOUT_MS = 12000;
/** Ignore premature engine `end` events on all platforms. */
const MIN_LISTEN_MS = Platform.OS === "android" ? 1800 : 900;
const SPEECH_EVAL_DELAY_MS = 350;

const BENIGN_SPEECH_ERRORS = new Set([
  "no-speech",
  "aborted",
  "audio-capture",
  "network",
]);

export default function VoiceGame({ question, onAnswer, pathMode }: Props) {
  const { t, isKu, isAr } = useI18n();
  const rtl = isKu || isAr;
  const { speak } = useTTS();
  const speech = useSpeechCapture("en-US");

  const [state, setState] = useState<ListenState>("idle");
  const [transcript, setTranscript] = useState("");
  const [hasHintRevealed, setHasHintRevealed] = useState(false);

  const firedRef = useRef(false);
  const stateRef = useRef<ListenState>("idle");
  const transcriptRef = useRef("");
  const listenTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speechEvalTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const listenStartedAtRef = useRef(0);

  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  React.useEffect(() => {
    speech.abort();
    setState("idle");
    setTranscript("");
    setHasHintRevealed(false);
    firedRef.current = false;
    stateRef.current = "idle";
    transcriptRef.current = "";
    
    if (listenTimeoutRef.current) {
      clearTimeout(listenTimeoutRef.current);
      listenTimeoutRef.current = null;
    }
    if (speechEvalTimeoutRef.current) {
      clearTimeout(speechEvalTimeoutRef.current);
      speechEvalTimeoutRef.current = null;
    }
  }, [question.targetWord]);

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

  const clearSpeechEvalTimeout = () => {
    if (speechEvalTimeoutRef.current) {
      clearTimeout(speechEvalTimeoutRef.current);
      speechEvalTimeoutRef.current = null;
    }
  };

  const fireAnswer = useCallback(
    (correct: boolean | "skip") => {
      if (firedRef.current) return;
      firedRef.current = true;
      onAnswer(correct);
    },
    [onAnswer],
  );

  const triggerFailShake = useCallback(() => {
    shakeX.value = withSequence(
      withTiming(-6, { duration: 40 }),
      withTiming(6, { duration: 40 }),
      withTiming(0, { duration: 50, easing: Easing.out(Easing.quad) }),
    );
  }, [shakeX]);

  const stopSession = useCallback(() => {
    clearListenTimeout();
    clearSpeechEvalTimeout();
    try {
      speech.stop();
    } catch (e) {
      console.warn("stopSession: failed to stop speech", e);
    }
  }, [speech]);

  const speechAbortRef = useRef(speech.abort);

  useEffect(() => {
    speechAbortRef.current = speech.abort;
  }, [speech.abort]);

  useEffect(
    () => () => {
      clearListenTimeout();
      clearSpeechEvalTimeout();
      try {
        speechAbortRef.current();
      } catch (e) {
        /* noop */
      }
    },
    [],
  );

  const onSuccess = useCallback(
    (text: string) => {
      stopSession();
      setTranscript(text);
      updateState("success");
      setTimeout(() => fireAnswer(true), 700);
    },
    [fireAnswer, stopSession],
  );

  const onFail = useCallback(
    () => {
      if (stateRef.current === "fail" || stateRef.current === "success") return;
      stopSession();
      updateState("fail");
      triggerFailShake();
    },
    [stopSession, triggerFailShake],
  );

  const evaluateSpeechTranscript = useCallback(
    (text: string) => {
      if (matchesTarget(text, question.targetWord)) {
        onSuccess(text);
        return true;
      }
      onFail();
      return false;
    },
    [onFail, onSuccess, question.targetWord],
  );

  const scheduleSpeechEvaluation = useCallback(() => {
    clearSpeechEvalTimeout();
    speechEvalTimeoutRef.current = setTimeout(() => {
      if (stateRef.current !== "listening" && stateRef.current !== "processing") {
        return;
      }
      updateState("processing");
      const last = transcriptRef.current.trim();
      setTranscript(last);
      evaluateSpeechTranscript(last);
    }, SPEECH_EVAL_DELAY_MS);
  }, [evaluateSpeechTranscript]);

  const buildSpeechHandlers = useCallback(
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
        const last = transcriptRef.current.trim();

        if (last && matchesTarget(last, question.targetWord)) {
          onSuccess(last);
          return;
        }

        // If the engine ended extremely quickly (less than 400ms) and we have no transcript,
        // it was likely a native startup glitch or premature end. Transition back to idle so they can retry.
        if (elapsed < 400 && !last) {
          clearListenTimeout();
          updateState("idle");
          return;
        }

        clearListenTimeout();
        scheduleSpeechEvaluation();
      },
      onError: (code: string, message?: string) => {
        if (stateRef.current !== "listening") return;
        console.warn(`Speech recognition error: ${code} - ${message}`);
        
        clearListenTimeout();
        if (transcriptRef.current.trim()) {
          scheduleSpeechEvaluation();
        } else {
          onFail();
        }
      },
    }),
    [onFail, onSuccess, question.targetWord, scheduleSpeechEvaluation],
  );

  const startSpeechListening = useCallback(async () => {
    firedRef.current = false;
    transcriptRef.current = "";
    setTranscript("");
    listenStartedAtRef.current = Date.now();
    updateState("listening");
    clearListenTimeout();
    listenTimeoutRef.current = setTimeout(() => {
      if (stateRef.current === "listening") {
        scheduleSpeechEvaluation();
      }
    }, LISTEN_TIMEOUT_MS);

    try {
      const started = await speech.start(buildSpeechHandlers(), {
        continuous: false,
        contextualStrings: [question.targetWord],
      });
      if (!started) {
        clearListenTimeout();
        updateState("idle");
        return;
      }
    } catch (err) {
      console.warn("speech.start failed:", err);
      clearListenTimeout();
      updateState("idle");
      return;
    }

    listenStartedAtRef.current = Date.now();
  }, [buildSpeechHandlers, scheduleSpeechEvaluation, speech, question.targetWord]);

  const finishSpeechCapture = useCallback(() => {
    if (stateRef.current !== "listening") return;
    clearListenTimeout();
    updateState("processing");
    try {
      speech.stop();
    } catch (e) {
      console.warn("finishSpeechCapture: speech.stop failed", e);
    }
    scheduleSpeechEvaluation();
  }, [scheduleSpeechEvaluation, speech]);

  const handleMicPress = () => {
    if (state === "processing") return;

    if (state === "listening") {
      finishSpeechCapture();
      return;
    }

    if (state === "fail") {
      updateState("idle");
      void startSpeechListening();
      return;
    }

    if (state === "idle") void startSpeechListening();
  };

  const handleHearPhrase = () => {
    void speak(question.targetWord, "en", question.targetWord);
  };

  const handleRevealHint = () => {
    setHasHintRevealed(true);
    handleHearPhrase();
  };

  const micColor =
    state === "listening" ||
    speech.listening
      ? L.blue
      : state === "processing"
        ? L.blue
        : state === "success"
          ? L.green
          : state === "fail"
            ? L.red
            : L.blue;

  const statusText = state === "processing"
    ? t("lessons.voiceChecking")
    : state === "listening"
      ? t("lessons.voiceListeningSpeak")
      : state === "success"
        ? t("lessons.voiceCorrect")
        : state === "fail"
          ? t("lessons.voiceTryAgainStatus")
          : t("lessons.voiceTapMicSpeak");

  const instruction = isAr && question.promptAr ? question.promptAr : (question.prompt || t("lessons.sayOutLoudSub"));
  const targetText = isAr && question.targetArabic ? question.targetArabic : question.targetKurdish;

  const showTranscript =
    transcript.length > 0 &&
    (state === "listening" || state === "processing" || state === "success" || state === "fail");

  return (
    <GameRoot style={s.root}>
      <GameHeader>
        <LightGameHeading
          title={instruction}
        />
      </GameHeader>

      <LightQuestionPrompt
        label={t("lessons.questionLabel")}
        variant={pathMode === "kids" ? "kids" : "default"}
      >
        {targetText || ""}
      </LightQuestionPrompt>

      {question.imageRequire && (
        <Animated.View entering={FadeInUp.duration(400).springify()} style={s.heroImageCard}>
          <Image
            source={question.imageRequire}
            style={s.heroImage}
            contentFit="cover"
            transition={200}
          />
        </Animated.View>
      )}

      {!hasHintRevealed ? (
        <Animated.View entering={FadeInUp.duration(300)}>
          <SpringPressable
            onPress={handleRevealHint}
            style={[
              s.hintButton,
              pathMode === "kids" && {
                backgroundColor: "#FFF4ED",
                borderColor: "rgba(255, 120, 30, 0.25)",
              }
            ]}
          >
            <SpeakerIcon size={24} color={pathMode === "kids" ? "#C2410C" : L.blue} />
            <AppText style={[s.hintText, pathMode === "kids" && { color: "#C2410C" }]}>{t("lessons.voiceTapForHint")}</AppText>
          </SpringPressable>
        </Animated.View>
      ) : (
        <Animated.View entering={FadeInUp.duration(400).springify()} style={{ gap: 4 }}>
          <AppText style={[s.targetLabel, { textAlign: rtl ? "right" : "center" }]}>{t("lessons.voiceTargetLabel")}</AppText>

          <View style={s.targetRow}>
            <AppText style={[s.targetEn, { textAlign: rtl ? "right" : "center" }]} forceLatinFont latinRole="bold">
              {question.targetWord}
            </AppText>
            <SpringPressable
              onPress={handleHearPhrase}
              style={s.speakerBtn}
            >
              <SpeakerIcon size={20} />
            </SpringPressable>
          </View>
        </Animated.View>
      )}

      <View style={s.micStage}>
        <Animated.View style={shakeStyle}>
          <MicCaptureOrb
            listening={
              state === "listening" ||
              state === "processing" ||
              speech.listening
            }
            disabled={state === "success"}
            color={micColor}
            size={108}
            hint={statusText}
            onPress={handleMicPress}
          />
        </Animated.View>

        {showTranscript ? (
          <AppText style={s.transcript} numberOfLines={2}>
            {transcript}
          </AppText>
        ) : null}
      </View>

      <View style={{ flex: 1 }} />

      {state !== "success" ? (
        <GameFooter delay={120}>
          <AppText style={[s.skipLink, { textAlign: rtl ? "right" : "center" }]} onPress={() => fireAnswer("skip")}>
            {t("lessons.dontKnow")}
          </AppText>
        </GameFooter>
      ) : null}
    </GameRoot>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 14,
  },
  targetLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: L.gray,
    textAlign: "center",
    fontFamily: "DINNextRoundedBold",
    ...rtlBlock,
  },
  targetRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 8,
  },
  targetEn: {
    flex: 1,
    fontSize: 20,
    fontWeight: "800",
    color: L.navy,
    textAlign: "center",
    letterSpacing: -0.3,
    fontFamily: "DINNextRoundedBold",
    ...ltrText,
  },
  speakerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: L.border,
  },
  listenHint: {
    fontSize: 13,
    fontWeight: "600",
    color: L.grayLight,
    textAlign: "center",
    fontFamily: "DINNextRoundedMedium",
    marginTop: -6,
  },
  devHint: {
    fontSize: 12,
    fontWeight: "600",
    color: L.grayLight,
    textAlign: "center",
    fontFamily: "DINNextRoundedMedium",
    ...rtlBlock,
    paddingHorizontal: 8,
  },
  micStage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    minHeight: 180,
  },
  manualWrap: {
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
  },
  unavailable: {
    fontSize: 14,
    fontWeight: "600",
    color: L.gray,
    textAlign: "center",
    fontFamily: "DINNextRoundedMedium",
  },
  manualHint: {
    fontSize: 15,
    fontWeight: "600",
    color: L.navy,
    textAlign: "center",
    fontFamily: "DINNextRoundedMedium",
    ...rtlBlock,
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
  hintButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: "#F2F5FE",
    borderWidth: 1.5,
    borderColor: "rgba(43,89,243,0.15)",
    borderRadius: 20,
    marginTop: 8,
    marginBottom: 8,
    shadowColor: L.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  hintButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  hintText: {
    fontSize: 16,
    fontWeight: "800",
    color: L.blue,
    fontFamily: "DINNextRoundedBold",
    backgroundColor: "transparent",
  },
  fallbackLink: {
    marginTop: 18,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 20,
    backgroundColor: "rgba(43, 89, 243, 0.07)",
    borderWidth: 1.5,
    borderColor: "rgba(43, 89, 243, 0.16)",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  fallbackLinkKids: {
    backgroundColor: "rgba(255, 120, 30, 0.08)",
    borderColor: "rgba(255, 120, 30, 0.18)",
  },
  fallbackLinkText: {
    fontSize: 14,
    fontWeight: "800",
    color: L.blue,
    fontFamily: "DINNextRoundedBold",
    textAlign: "center",
    textDecorationLine: "none",
  },
  fallbackLinkTextKids: {
    color: "#C2410C",
  },
  inputWrapper: {
    width: "100%",
    minWidth: 280,
    marginTop: 8,
  },
  inputField: {
    width: "100%",
    height: 52,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingHorizontal: 18,
    fontSize: 16,
    color: L.navy,
    fontFamily: "DINNextRoundedRegular",
    borderWidth: 1.5,
    borderColor: L.border,
    textAlign: "center",
  },
  heroImageCard: {
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 6px 16px 0px rgba(26, 43, 72, 0.06)" }
      : {
          shadowColor: "#1A2B48",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.06,
          shadowRadius: 16,
          elevation: 4,
        }),
    marginVertical: 12,
  },
  heroImage: {
    width: 200,
    height: 140,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.02)",
  },
});
