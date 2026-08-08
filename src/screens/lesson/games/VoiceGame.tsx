/* eslint-disable */
/**
 * VoiceGame — mic-first speaking practice.
 * Prefers Gemini audio evaluation when AI speech grading is configured;
 * falls back to expo-speech-recognition (Web Speech API on web), then manual self-check.
 */

import { AppText } from "../../../components/ui/AppText";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View, TextInput, useWindowDimensions } from "react-native";
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
import { useGeminiVoiceCapture } from "../../../hooks/use-gemini-voice-capture";
import { useWordSpeech } from "./use-word-speech";
import { useThemeColors } from "../../../hooks/useThemeColors";
import { isPartialUtterance, matchesTarget } from "../../../utils/speech-match";
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

const LISTEN_TIMEOUT_MS = 20000;
/** Ignore premature engine `end` events on all platforms. */
const MIN_LISTEN_MS = Platform.OS === "android" ? 1800 : 900;
const SPEECH_EVAL_DELAY_MS = 350;
/**
 * A matching interim transcript is held for this long before it counts.
 * Speech engines emit "I would like a" before "I would like a coffee", so
 * grading the first match that arrives ends the turn mid-sentence.
 */
const SPEECH_SETTLE_MS = 900;
/** Engine sessions end on short silences; restart while the learner is still talking. */
const MAX_LISTEN_RESTARTS = 3;

const BENIGN_SPEECH_ERRORS = new Set([
  "no-speech",
  "aborted",
  "audio-capture",
  "network",
]);

export default function VoiceGame({ question, onAnswer, pathMode }: Props) {
  const { colors } = useThemeColors();
  const { t, isKu, isAr } = useI18n();
  const rtl = isKu || isAr;
  const { width, height } = useWindowDimensions();
  const compactLayout = width < 480 || height < 720;
  const micOrbSize = compactLayout ? 82 : 92;
  const { speakWord } = useWordSpeech(question.targetLanguage);
  const speech = useSpeechCapture("en-US");
  const geminiCapture = useGeminiVoiceCapture();
  const useGeminiBackend = !speech.available && geminiCapture.available;

  const isMultiWordTarget =
    question.targetWord.trim().split(/\s+/).filter(Boolean).length > 1;

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
  const settleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listenStartedAtRef = useRef(0);
  const restartCountRef = useRef(0);
  /** Text kept from earlier engine sessions in this same listening turn. */
  const baseTranscriptRef = useRef("");
  const restartListeningRef = useRef<(() => void) | null>(null);

  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  React.useEffect(() => {
    speech.abort();
    geminiCapture.abort();
    setState("idle");
    setTranscript("");
    setHasHintRevealed(false);
    firedRef.current = false;
    stateRef.current = "idle";
    transcriptRef.current = "";
    restartCountRef.current = 0;

    if (listenTimeoutRef.current) {
      clearTimeout(listenTimeoutRef.current);
      listenTimeoutRef.current = null;
    }
    if (speechEvalTimeoutRef.current) {
      clearTimeout(speechEvalTimeoutRef.current);
      speechEvalTimeoutRef.current = null;
    }
    if (settleTimeoutRef.current) {
      clearTimeout(settleTimeoutRef.current);
      settleTimeoutRef.current = null;
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

  const clearSettleTimeout = () => {
    if (settleTimeoutRef.current) {
      clearTimeout(settleTimeoutRef.current);
      settleTimeoutRef.current = null;
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
    clearSettleTimeout();
    try {
      if (useGeminiBackend) {
        geminiCapture.abort();
      } else {
        speech.stop();
      }
    } catch (e) {
      console.warn("stopSession: failed to stop speech", e);
    }
  }, [speech, useGeminiBackend, geminiCapture]);

  const speechAbortRef = useRef(speech.abort);
  const geminiAbortRef = useRef(geminiCapture.abort);

  useEffect(() => {
    speechAbortRef.current = speech.abort;
  }, [speech.abort]);

  useEffect(() => {
    geminiAbortRef.current = geminiCapture.abort;
  }, [geminiCapture.abort]);

  useEffect(
    () => () => {
      clearListenTimeout();
      clearSpeechEvalTimeout();
      clearSettleTimeout();
      try {
        speechAbortRef.current();
      } catch (e) {
        /* noop */
      }
      try {
        geminiAbortRef.current();
      } catch (e) {
        /* noop */
      }
    },
    [],
  );

  const onSuccess = useCallback(
    (text: string) => {
      if (stateRef.current === "success") return;
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

  /**
   * Interim results arrive word by word, so a match on the first few words is
   * not proof the learner finished. Wait for the transcript to stop growing
   * (and still match) before accepting it.
   */
  const scheduleSettledSuccess = useCallback(
    (text: string) => {
      clearSettleTimeout();
      settleTimeoutRef.current = setTimeout(() => {
        settleTimeoutRef.current = null;
        if (stateRef.current !== "listening") return;
        const latest = transcriptRef.current.trim();
        // Transcript grew while waiting — let the newer result decide.
        if (latest !== text) return;
        if (matchesTarget(latest, question.targetWord)) {
          onSuccess(latest);
        }
      }, SPEECH_SETTLE_MS);
    },
    [onSuccess, question.targetWord],
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
        const combined = [baseTranscriptRef.current, text.trim()]
          .filter(Boolean)
          .join(" ")
          .trim();
        transcriptRef.current = combined;
        setTranscript(combined);
        if (matchesTarget(combined, question.targetWord)) {
          scheduleSettledSuccess(combined);
        } else {
          // Transcript changed and no longer matches — drop any pending accept.
          clearSettleTimeout();
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

        // The engine ends on brief silences. If they are clearly mid-phrase,
        // keep the session alive instead of grading an unfinished sentence.
        if (
          restartCountRef.current < MAX_LISTEN_RESTARTS &&
          (!last || isPartialUtterance(last, question.targetWord))
        ) {
          restartCountRef.current += 1;
          baseTranscriptRef.current = last;
          restartListeningRef.current?.();
          return;
        }

        clearListenTimeout();
        scheduleSpeechEvaluation();
      },
      onError: (code: string, message?: string) => {
        if (stateRef.current !== "listening") return;
        console.warn(`Speech recognition error: ${code} - ${message}`);

        const last = transcriptRef.current.trim();

        // "no-speech" / "speech-timeout" just mean the engine gave up waiting.
        // Restart while the learner still has time on the clock.
        if (
          (code === "no-speech" || code === "speech-timeout") &&
          restartCountRef.current < MAX_LISTEN_RESTARTS &&
          (!last || isPartialUtterance(last, question.targetWord))
        ) {
          restartCountRef.current += 1;
          baseTranscriptRef.current = last;
          restartListeningRef.current?.();
          return;
        }

        clearListenTimeout();
        if (last) {
          scheduleSpeechEvaluation();
        } else {
          onFail();
        }
      },
    }),
    [
      onFail,
      onSuccess,
      question.targetWord,
      scheduleSettledSuccess,
      scheduleSpeechEvaluation,
    ],
  );

  const finishSpeechCapture = useCallback(async () => {
    if (stateRef.current !== "listening") return;
    clearListenTimeout();
    clearSettleTimeout();
    restartCountRef.current = MAX_LISTEN_RESTARTS;
    updateState("processing");
    if (useGeminiBackend) {
      await geminiCapture.stopAndEvaluate(question.targetWord);
    } else {
      try {
        speech.stop();
      } catch (e) {
        console.warn("finishSpeechCapture: speech.stop failed", e);
      }
      scheduleSpeechEvaluation();
    }
  }, [scheduleSpeechEvaluation, speech, useGeminiBackend, geminiCapture, question.targetWord]);

  const startSpeechListening = useCallback(async (isRestart = false) => {
    if (!isRestart) {
      firedRef.current = false;
      transcriptRef.current = "";
      baseTranscriptRef.current = "";
      restartCountRef.current = 0;
      setTranscript("");
      clearListenTimeout();
      // The overall turn budget spans engine restarts, so it is only armed once.
      listenTimeoutRef.current = setTimeout(() => {
        if (stateRef.current === "listening") {
          restartCountRef.current = MAX_LISTEN_RESTARTS;
          if (useGeminiBackend) {
            void finishSpeechCapture();
          } else {
            scheduleSpeechEvaluation();
          }
        }
      }, LISTEN_TIMEOUT_MS);
    }
    clearSettleTimeout();
    listenStartedAtRef.current = Date.now();
    updateState("listening");

    try {
      if (useGeminiBackend) {
        const started = await geminiCapture.start({
          onResult: (text, matches) => {
            transcriptRef.current = text;
            setTranscript(text);
            if (matches) {
              onSuccess(text);
            } else {
              onFail();
            }
          },
          onError: (message) => {
            console.warn("Gemini recording error:", message);
            onFail();
          }
        });
        if (!started) {
          clearListenTimeout();
          updateState("idle");
          return;
        }
      } else {
        const started = await speech.start(buildSpeechHandlers(), {
          // Full sentences need the engine to tolerate mid-phrase pauses;
          // single words still end on their own final result.
          continuous: isMultiWordTarget,
          contextualStrings: [question.targetWord],
        });
        if (!started) {
          clearListenTimeout();
          updateState("idle");
          return;
        }
      }
    } catch (err) {
      console.warn("Speech start failed:", err);
      clearListenTimeout();
      updateState("idle");
      return;
    }

    listenStartedAtRef.current = Date.now();
  }, [buildSpeechHandlers, isMultiWordTarget, scheduleSpeechEvaluation, speech, question.targetWord, useGeminiBackend, geminiCapture, finishSpeechCapture, onSuccess, onFail]);

  // `onEnd`/`onError` need to restart listening, but they are built before
  // `startSpeechListening` exists — the ref breaks that cycle.
  useEffect(() => {
    restartListeningRef.current = () => {
      void startSpeechListening(true);
    };
  }, [startSpeechListening]);

  const finishSpeechCaptureSync = useCallback(() => {
    void finishSpeechCapture();
  }, [finishSpeechCapture]);

  const handleMicPress = () => {
    if (state === "processing") return;

    if (state === "listening") {
      // Manual stop means they are done — no more restarts.
      restartCountRef.current = MAX_LISTEN_RESTARTS;
      finishSpeechCaptureSync();
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
    speakWord(question.targetWord, question.targetWord);
  };

  const handleRevealHint = () => {
    setHasHintRevealed(true);
    handleHearPhrase();
  };

  const micColor =
    state === "listening" ||
    (useGeminiBackend ? geminiCapture.listening : speech.listening)
      ? L.blue
      : state === "processing"
        ? L.blue
        : state === "success"
          ? L.green
          : state === "fail"
            ? L.red
            : L.blue;

  const captureError = useGeminiBackend
    ? geminiCapture.error
    : speech.error;
  const statusText = captureError
    ? captureError
    : state === "processing"
      ? t("lessons.voiceChecking")
      : state === "listening"
        ? t("lessons.voiceListeningSpeak")
        : state === "success"
          ? t("lessons.voiceCorrect")
          : state === "fail"
            ? t("lessons.voiceTryAgainStatus")
            : t("lessons.voiceTapMicSpeak");

  const showTranscript =
    transcript.length > 0 &&
    (state === "listening" || state === "processing" || state === "success" || state === "fail");

  return (
    <GameRoot style={[s.root, compactLayout && s.rootCompact]}>
      <GameHeader>
        <LightGameHeading
          title={t("lessons.sayOutLoud")}
        />
      </GameHeader>

      <LightQuestionPrompt
        label={t("lessons.questionLabel")}
        variant={pathMode === "kids" ? "kids" : "default"}
        layout={compactLayout ? "stacked" : "row"}
        contentLanguageCode={question.targetLanguage}
        speechText={question.targetWord}
        speechLanguageCode={question.targetLanguage ?? "en"}
        expanded
      >
        {question.targetWord}
      </LightQuestionPrompt>

      {question.imageRequire && (
        <Animated.View entering={FadeInUp.duration(400).springify()} style={[s.heroImageCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
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
              compactLayout && s.hintButtonCompact,
              { backgroundColor: colors.muted, borderColor: colors.border },
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
          <AppText style={[s.targetLabel, { color: colors.mutedForeground, textAlign: rtl ? "right" : "center" }]}>{t("lessons.voiceTargetLabel")}</AppText>

          <View style={s.targetRow}>
            <AppText languageCode={question.targetLanguage} align="center" nativeAlign="start" fullWidth style={[s.targetEn, { color: colors.foreground }]} latinRole="bold">
              {question.targetWord}
            </AppText>
            <SpringPressable
              onPress={handleHearPhrase}
              style={[s.speakerBtn, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}
            >
              <SpeakerIcon size={20} />
            </SpringPressable>
          </View>
        </Animated.View>
      )}

      <View style={[s.micStage, compactLayout && s.micStageCompact]}>
        <Animated.View style={shakeStyle}>
          <MicCaptureOrb
            listening={
              state === "listening" ||
              state === "processing" ||
              (useGeminiBackend ? geminiCapture.listening : speech.listening)
            }
            disabled={state === "success"}
            color={micColor}
            size={micOrbSize}
            hint={statusText}
            onPress={handleMicPress}
          />
        </Animated.View>

        {showTranscript ? (
          <AppText style={[s.transcript, { color: colors.foreground }]} numberOfLines={2}>
            {transcript}
          </AppText>
        ) : null}
      </View>

      {state !== "success" ? (
        <GameFooter delay={120}>
          <AppText style={[s.skipLink, { color: colors.mutedForeground, textAlign: rtl ? "right" : "center" }]} onPress={() => fireAnswer("skip")}>
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
  rootCompact: {
    paddingHorizontal: 16,
    paddingTop: 4,
    gap: 10,
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
    flex: 0,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 12,
    minHeight: 150,
    marginTop: "auto",
  },
  micStageCompact: {
    minHeight: 124,
    gap: 10,
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
  hintButtonCompact: {
    marginTop: 2,
    marginBottom: 2,
    paddingVertical: 12,
    paddingHorizontal: 18,
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
