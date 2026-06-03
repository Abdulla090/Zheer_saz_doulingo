/**
 * VoiceGame — mic-first speaking practice.
 * Prefers Gemini audio evaluation when EXPO_PUBLIC_GEMINI_API_KEY is set;
 * falls back to expo-speech-recognition (Web Speech API on web), then manual self-check.
 */

import { AppText } from "@/components/ui/AppText";
import { isGeminiConfigured } from "@/constants/gemini";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { MicCaptureOrb } from "@/components/voice/MicCaptureOrb";
import { VoiceQuestion } from "@/data/lesson-content";
import type { LessonPathMode } from "@/data/lesson-content";
import { useGeminiVoiceCapture } from "@/hooks/use-gemini-voice-capture";
import { useI18n } from "@/hooks/useI18n";
import { useSpeechCapture } from "@/hooks/use-speech-capture";
import { useTTS } from "@/hooks/use-tts";
import { matchesTarget } from "@/utils/speech-match";
import { GameFooter, GameHeader, GameRoot } from "./GameAnimatedShell";
import {
  LightCheckButton,
  LightGameHeading,
  LightQuestionPrompt,
  SpeakerIcon,
} from "./lesson-light-primitives";
import { L } from "./lesson-light-design";
import { ltrText, rtlBlock } from "./game-text";

type Props = {
  question: VoiceQuestion;
  onAnswer: (correct: boolean) => void;
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

function pickInitialBackend(
  geminiAvailable: boolean,
  speechAvailable: boolean,
): CaptureBackend {
  if (geminiAvailable) return "gemini";
  if (speechAvailable) return "speech";
  return "manual";
}

export default function VoiceGame({ question, onAnswer, pathMode }: Props) {
  const { t } = useI18n();
  const { speak } = useTTS();
  const gemini = useGeminiVoiceCapture();
  const speech = useSpeechCapture("en-US");

  const [backend, setBackend] = useState<CaptureBackend>(() =>
    pickInitialBackend(gemini.available, speech.available),
  );
  const [state, setState] = useState<ListenState>("idle");
  const [transcript, setTranscript] = useState("");
  const [statusDetail, setStatusDetail] = useState<string | null>(null);

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

  const manualMode = backend === "manual";
  const useGemini = backend === "gemini";
  const useSpeech = backend === "speech";
  const showGeminiKeyHint = Platform.OS === "web" && !isGeminiConfigured();

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
    (correct: boolean) => {
      if (firedRef.current) return;
      firedRef.current = true;
      onAnswer(correct);
    },
    [onAnswer],
  );

  const triggerFailShake = useCallback(() => {
    // eslint-disable-next-line react-hooks/immutability -- Reanimated shared value animation
    shakeX.value = withSequence(
      withTiming(-6, { duration: 40 }),
      withTiming(6, { duration: 40 }),
      withTiming(0, { duration: 50, easing: Easing.out(Easing.quad) }),
    );
  }, [shakeX]);

  const fallbackToSpeech = useCallback(() => {
    if (speech.available) {
      setBackend("speech");
      setStatusDetail(null);
      return true;
    }
    setBackend("manual");
    return false;
  }, [speech.available]);

  const stopSession = useCallback(() => {
    clearListenTimeout();
    clearSpeechEvalTimeout();
    if (useGemini) {
      void gemini.abort();
    } else if (useSpeech) {
      speech.stop();
    }
  }, [gemini, speech, useGemini, useSpeech]);

  useEffect(
    () => () => {
      clearListenTimeout();
      clearSpeechEvalTimeout();
      void gemini.abort();
      speech.abort();
    },
    [gemini, speech],
  );

  const onSuccess = useCallback(
    (text: string) => {
      stopSession();
      setTranscript(text);
      setStatusDetail(null);
      updateState("success");
      setTimeout(() => fireAnswer(true), 700);
    },
    [fireAnswer, stopSession],
  );

  const onFail = useCallback(
    (detail?: string | null) => {
      if (stateRef.current === "fail" || stateRef.current === "success") return;
      stopSession();
      if (detail) setStatusDetail(detail);
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
      onFail(text || null);
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

        if (elapsed < MIN_LISTEN_MS) return;

        clearListenTimeout();
        scheduleSpeechEvaluation();
      },
      onError: (code: string) => {
        if (stateRef.current !== "listening") return;
        if (BENIGN_SPEECH_ERRORS.has(code)) return;
        onFail(speech.error);
      },
    }),
    [onFail, onSuccess, question.targetWord, scheduleSpeechEvaluation, speech.error],
  );

  const startSpeechListening = useCallback(async () => {
    if (!speech.available) {
      setBackend("manual");
      return;
    }

    firedRef.current = false;
    transcriptRef.current = "";
    setTranscript("");
    setStatusDetail(null);
    listenStartedAtRef.current = Date.now();
    updateState("listening");
    clearListenTimeout();
    listenTimeoutRef.current = setTimeout(() => {
      if (stateRef.current === "listening") {
        scheduleSpeechEvaluation();
      }
    }, LISTEN_TIMEOUT_MS);

    const started = await speech.start(buildSpeechHandlers(), {
      continuous: Platform.OS !== "web",
    });
    if (!started) {
      clearListenTimeout();
      updateState("idle");
      setBackend("manual");
      return;
    }

    listenStartedAtRef.current = Date.now();
  }, [buildSpeechHandlers, scheduleSpeechEvaluation, speech]);

  const finishSpeechCapture = useCallback(() => {
    if (stateRef.current !== "listening") return;
    clearListenTimeout();
    updateState("processing");
    speech.stop();
    scheduleSpeechEvaluation();
  }, [scheduleSpeechEvaluation, speech]);

  const finishGeminiCapture = useCallback(async () => {
    if (stateRef.current !== "listening") return;
    clearListenTimeout();
    updateState("processing");
    await gemini.stopAndEvaluate(question.targetWord);
  }, [gemini, question.targetWord]);

  const startGeminiListening = useCallback(async () => {
    firedRef.current = false;
    transcriptRef.current = "";
    setTranscript("");
    setStatusDetail(null);
    listenStartedAtRef.current = Date.now();
    updateState("listening");
    clearListenTimeout();
    listenTimeoutRef.current = setTimeout(() => {
      if (stateRef.current === "listening") {
        void finishGeminiCapture();
      }
    }, LISTEN_TIMEOUT_MS);

    const started = await gemini.start({
      onResult: (text, matches) => {
        setTranscript(text);
        setStatusDetail(null);
        if (matches) onSuccess(text);
        else onFail(text || null);
      },
      onError: (message) => {
        if (
          stateRef.current !== "listening" &&
          stateRef.current !== "processing"
        ) {
          return;
        }

        if (fallbackToSpeech()) {
          updateState("idle");
          void startSpeechListening();
          return;
        }

        onFail(message);
      },
    });

    if (!started) {
      clearListenTimeout();
      updateState("idle");
      if (fallbackToSpeech()) {
        await startSpeechListening();
      } else {
        setBackend("manual");
      }
      return;
    }

    listenStartedAtRef.current = Date.now();
  }, [
    fallbackToSpeech,
    finishGeminiCapture,
    gemini,
    onFail,
    onSuccess,
    startSpeechListening,
  ]);

  const startListening = useCallback(async () => {
    if (stateRef.current !== "idle" && stateRef.current !== "fail") return;
    if (useGemini) {
      await startGeminiListening();
    } else if (useSpeech) {
      await startSpeechListening();
    }
  }, [startGeminiListening, startSpeechListening, useGemini, useSpeech]);

  const handleMicPress = () => {
    if (manualMode || state === "processing") return;

    if (state === "listening") {
      if (useGemini) {
        void finishGeminiCapture();
      } else if (useSpeech) {
        finishSpeechCapture();
      }
      return;
    }

    if (state === "fail") {
      updateState("idle");
      setStatusDetail(null);
      void startListening();
      return;
    }

    if (state === "idle") void startListening();
  };

  const handleManualConfirm = () => {
    if (firedRef.current) return;
    updateState("success");
    setTimeout(() => fireAnswer(true), 400);
  };

  const handleHearPhrase = () => {
    void speak(question.targetWord, "en", question.targetWord);
  };

  const micColor =
    state === "listening" ||
    gemini.listening ||
    speech.listening
      ? L.blue
      : state === "processing" || gemini.processing
        ? L.blue
        : state === "success"
          ? L.green
          : state === "fail"
            ? L.red
            : L.blue;

  const statusText = manualMode
    ? t("lessons.voiceManualHint")
    : state === "processing" || gemini.processing
      ? t("lessons.voiceProcessing")
      : state === "idle"
        ? useGemini
          ? t("lessons.tapMicSpeakGemini")
          : t("lessons.tapMicSpeak")
        : state === "listening"
          ? useGemini || useSpeech
            ? t("lessons.tapMicStop")
            : t("lessons.listening")
          : state === "success"
            ? t("lessons.nice")
            : statusDetail || gemini.error || speech.error || t("lessons.micRetry");

  const heroPrompt = question.prompt || t("lessons.sayOutLoudSub");
  const showTranscript =
    !manualMode &&
    transcript.length > 0 &&
    (state === "success" || state === "fail");

  return (
    <GameRoot style={s.root}>
      <GameHeader>
        <LightGameHeading
          title={t("lessons.sayOutLoud")}
          subtitle={t("lessons.sayOutLoudSub")}
        />
      </GameHeader>

      <LightQuestionPrompt
        label={t("lessons.questionLabel")}
        forceKurdishFont
        variant={pathMode === "kids" ? "kids" : "default"}
      >
        {heroPrompt}
      </LightQuestionPrompt>

      <Text style={s.targetLabel}>{t("lessons.voiceTargetLabel")}</Text>

      <View style={s.targetRow}>
        <AppText style={s.targetEn} forceLatinFont latinRole="bold">
          {question.targetWord}
        </AppText>
        <Pressable
          onPress={handleHearPhrase}
          style={({ pressed }) => [s.speakerBtn, pressed && { opacity: 0.85 }]}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={t("lessons.voiceListenHint")}
        >
          <SpeakerIcon size={20} />
        </Pressable>
      </View>
      <Text style={s.listenHint}>{t("lessons.voiceListenHint")}</Text>

      {showGeminiKeyHint ? (
        <Text style={s.devHint}>{t("lessons.voiceGeminiKeyHint")}</Text>
      ) : null}

      <View style={s.micStage}>
        {!manualMode ? (
          <Animated.View style={shakeStyle}>
            <MicCaptureOrb
              listening={
                state === "listening" ||
                state === "processing" ||
                gemini.listening ||
                gemini.processing ||
                speech.listening
              }
              disabled={state === "success"}
              color={micColor}
              size={108}
              hint={statusText}
              onPress={handleMicPress}
            />
          </Animated.View>
        ) : (
          <View style={s.manualWrap}>
            {speech.error || gemini.error ? (
              <Text style={s.unavailable}>{speech.error || gemini.error}</Text>
            ) : (
              <Text style={s.unavailable}>{t("lessons.voiceUnavailable")}</Text>
            )}
            <Text style={s.manualHint}>{t("lessons.voiceManualHint")}</Text>
          </View>
        )}

        {showTranscript ? (
          <Text style={s.transcript} numberOfLines={2}>
            {transcript}
          </Text>
        ) : null}
      </View>

      <View style={{ flex: 1 }} />

      {manualMode ? (
        <GameFooter>
          <LightCheckButton
            label={t("lessons.voiceSaidIt")}
            onPress={handleManualConfirm}
            disabled={state === "success"}
          />
        </GameFooter>
      ) : state === "fail" ? (
        <GameFooter delay={120}>
          <Text style={s.skipLink} onPress={() => fireAnswer(false)}>
            {t("lessons.dontKnow")}
          </Text>
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
});
