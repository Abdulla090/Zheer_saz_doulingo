/* eslint-disable */
/**
 * VoiceGame — mic-first speaking practice.
 * Prefers Gemini audio evaluation when EXPO_PUBLIC_GEMINI_API_KEY is set;
 * falls back to expo-speech-recognition (Web Speech API on web), then manual self-check.
 */

import { AppText } from "@/components/ui/AppText";
import { isGeminiConfigured } from "@/constants/gemini";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View, TextInput } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  FadeInUp,
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

function pickInitialBackend(
  geminiAvailable: boolean,
  speechAvailable: boolean,
): CaptureBackend {
  if (geminiAvailable) return "gemini";
  if (speechAvailable) return "speech";
  return "manual";
}

export default function VoiceGame({ question, onAnswer, pathMode }: Props) {
  const { t, isKu } = useI18n();
  const { speak } = useTTS();
  const gemini = useGeminiVoiceCapture();
  const speech = useSpeechCapture("en-US");

  const [backend, setBackend] = useState<CaptureBackend>(() =>
    pickInitialBackend(gemini.available, speech.available),
  );
  const [state, setState] = useState<ListenState>("idle");
  const [transcript, setTranscript] = useState("");
  const [statusDetail, setStatusDetail] = useState<string | null>(null);
  const [hasHintRevealed, setHasHintRevealed] = useState(false);
  const [inputText, setInputText] = useState("");

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
    // Abort active session
    if (backend === "gemini") {
      void gemini.abort();
    } else if (backend === "speech") {
      speech.abort();
    }

    setBackend(pickInitialBackend(gemini.available, speech.available));
    setState("idle");
    setTranscript("");
    setStatusDetail(null);
    setHasHintRevealed(false);
    setInputText("");
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
  }, [question]);

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
    try {
      if (useGemini) {
        void gemini.abort();
      } else if (useSpeech) {
        speech.stop();
      }
    } catch (e) {
      console.warn("stopSession: failed to stop speech", e);
    }
  }, [gemini, speech, useGemini, useSpeech]);

  useEffect(
    () => () => {
      clearListenTimeout();
      clearSpeechEvalTimeout();
      try {
        void gemini.abort();
      } catch (e) {
        /* noop */
      }
      try {
        speech.abort();
      } catch (e) {
        /* noop */
      }
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

    try {
      const started = await speech.start(buildSpeechHandlers(), {
        continuous: false,
      });
      if (!started) {
        clearListenTimeout();
        updateState("idle");
        setBackend("manual");
        return;
      }
    } catch (err) {
      console.warn("speech.start failed:", err);
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
    try {
      speech.stop();
    } catch (e) {
      console.warn("finishSpeechCapture: speech.stop failed", e);
    }
    scheduleSpeechEvaluation();
  }, [scheduleSpeechEvaluation, speech]);

  const finishGeminiCapture = useCallback(async () => {
    if (stateRef.current !== "listening") return;
    clearListenTimeout();
    updateState("processing");
    try {
      await gemini.stopAndEvaluate(question.targetWord);
    } catch (e) {
      console.warn("finishGeminiCapture: stopAndEvaluate failed", e);
      onFail("AI evaluation failed.");
    }
  }, [gemini, question.targetWord, onFail]);

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

    const cleanStr = (s: string) =>
      s.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();

    if (cleanStr(inputText) === cleanStr(question.targetWord)) {
      updateState("success");
      setTimeout(() => fireAnswer(true), 400);
    } else {
      triggerFailShake();
    }
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
        />
      </GameHeader>

      <LightQuestionPrompt
        label={t("lessons.questionLabel")}
        forceKurdishFont
        variant={pathMode === "kids" ? "kids" : "default"}
      >
        {heroPrompt}
      </LightQuestionPrompt>

      {!hasHintRevealed ? (
        <Animated.View entering={FadeInUp.duration(300)}>
          <Pressable
            onPress={handleRevealHint}
            style={({ pressed }) => [s.hintButton, pressed && s.hintButtonPressed]}
          >
            <SpeakerIcon size={24} />
            <AppText style={s.hintText}>Tap for hint</AppText>
          </Pressable>
        </Animated.View>
      ) : (
        <Animated.View entering={FadeInUp.duration(400).springify()} style={{ gap: 4 }}>
          <AppText style={s.targetLabel}>{t("lessons.voiceTargetLabel")}</AppText>

          <View style={[s.targetRow, { flexDirection: isKu ? "row-reverse" : "row" }]}>
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
        </Animated.View>
      )}

      <View style={s.micStage}>
        {!manualMode ? (
          <>
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
            {(state === "idle" || state === "listening" || state === "processing" || state === "fail") && (
              <Pressable
                onPress={() => {
                  stopSession();
                  setBackend("manual");
                  updateState("idle");
                }}
                style={({ pressed }) => [s.fallbackLink, pressed && { opacity: 0.75 }]}
              >
                <AppText style={s.fallbackLinkText}>{t("lessons.voiceManualFallback")}</AppText>
              </Pressable>
            )}
          </>
        ) : (
          <View style={s.manualWrap}>
            {speech.error || gemini.error ? (
              <AppText style={s.unavailable}>{speech.error || gemini.error}</AppText>
            ) : (
              <AppText style={s.unavailable}>{t("lessons.voiceUnavailable")}</AppText>
            )}
            <AppText style={s.manualHint}>Type the English sentence below to verify:</AppText>
            <Animated.View style={[s.inputWrapper, shakeStyle]}>
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type target phrase..."
                placeholderTextColor="#A0AEC0"
                autoCapitalize="none"
                autoCorrect={false}
                style={[
                  s.inputField,
                  state === "fail" && { borderColor: "#EF4444", backgroundColor: "#FEF2F2" }
                ]}
              />
            </Animated.View>
          </View>
        )}

        {showTranscript ? (
          <AppText style={s.transcript} numberOfLines={2}>
            {transcript}
          </AppText>
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
          <AppText style={s.skipLink} onPress={() => fireAnswer("skip")}>
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
    backgroundColor: "rgba(43,89,243,0.06)",
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
  },
  fallbackLink: {
    marginTop: 14,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  fallbackLinkText: {
    fontSize: 14,
    fontWeight: "700",
    color: L.blue,
    fontFamily: "DINNextRoundedBold",
    textAlign: "center",
    textDecorationLine: "underline",
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
});
