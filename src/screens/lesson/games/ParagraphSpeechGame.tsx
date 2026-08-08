import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming, cancelAnimation } from "react-native-reanimated";
import { AppText } from "../../../components/ui/AppText";
import { DirectionalView } from "../../../components/ui/Directional";
import { MicCaptureOrb } from "../../../components/voice/MicCaptureOrb";
import { ParagraphSpeechQuestion } from "../../../data/types";
import { useSpeechCapture } from "../../../hooks/use-speech-capture";
import { useGeminiVoiceCapture } from "../../../hooks/use-gemini-voice-capture";
import { evaluateParagraphSpeechWithGemini } from "../../../services/gemini-speech-service";
import { GameFooter, GameHeader, GameRoot } from "./GameAnimatedShell";
import { LightGameHeading, LightCheckButton } from "./lesson-light-primitives";
import { L } from "./lesson-light-design";
import { useI18n } from "../../../hooks/useI18n";
import { normalizeSpeech, spokenWordMatches } from "../../../utils/speech-match";
import { ltrText } from "./game-text";
import { useThemeColors } from "../../../hooks/useThemeColors";

type Props = {
  question: ParagraphSpeechQuestion;
  onAnswer: (correct: boolean | "skip") => void;
};

type ListenState = "idle" | "listening" | "processing" | "success" | "fail";

type ParagraphSpeechEvaluation = {
  accuracyScore: number;
  wordAnalysis: {
    word: string;
    correct: boolean;
  }[];
  transcript: string;
};

/** Engine sessions end at every pause; restart this many times per attempt. */
const MAX_LISTEN_RESTARTS = 40;
/** Errors that only mean "stopped hearing speech", not a real failure. */
const RECOVERABLE_SPEECH_ERRORS = new Set([
  "no-speech",
  "speech-timeout",
  "client",
  "network",
  "busy",
  "unknown",
]);
/** Teleprompter pace — higher is slower. */
const SCROLL_MS_PER_PX = 46;
/** Small overscroll so the last line doesn't finish flush against the border. */
const TELEPROMPTER_TAIL = 24;
/** Give final results a moment to land before grading. */
const FINAL_RESULT_GRACE_MS = 700;

function evaluateSpeechLocally(transcript: string, paragraphs: string[]): ParagraphSpeechEvaluation {
  const targetWords = paragraphs.join(" ").split(/\s+/).filter(Boolean);
  const spokenWords = normalizeSpeech(transcript).split(/\s+/).filter(Boolean);

  // Walk the spoken words in order so a repeated word can't mark several
  // different target words correct, and a skipped line stays skipped.
  let cursor = 0;
  let correctCount = 0;
  const wordAnalysis = targetWords.map((originalWord) => {
    const target = normalizeSpeech(originalWord);
    let correct = false;
    if (target) {
      // Allow a small lookahead so one misheard word doesn't desync the rest.
      const limit = Math.min(spokenWords.length, cursor + 6);
      for (let i = cursor; i < limit; i++) {
        if (spokenWordMatches(target, spokenWords[i]!)) {
          correct = true;
          cursor = i + 1;
          break;
        }
      }
    }
    if (correct) correctCount++;
    return { word: originalWord, correct };
  });

  const accuracyScore = targetWords.length > 0 ? Math.round((correctCount / targetWords.length) * 100) : 0;

  return {
    accuracyScore,
    wordAnalysis,
    transcript,
  };
}

export default function ParagraphSpeechGame({ question, onAnswer }: Props) {
  const { colors } = useThemeColors();
  const { t } = useI18n();
  const speech = useSpeechCapture("en-US");
  const geminiCapture = useGeminiVoiceCapture();
  const abortSpeech = speech.abort;
  const abortGeminiCapture = geminiCapture.abort;
  const useGeminiBackend = !speech.available && geminiCapture.available;
  const scrollY = useSharedValue(0);

  const [state, setState] = useState<ListenState>("idle");
  const [evaluation, setEvaluation] = useState<ParagraphSpeechEvaluation | null>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [textHeight, setTextHeight] = useState(0);

  const transcriptRef = useRef("");
  const stateRef = useRef<ListenState>("idle");
  /** Text captured by earlier engine sessions within the same reading turn. */
  const baseTranscriptRef = useRef("");
  const restartCountRef = useRef(0);
  const restartRef = useRef<(() => void) | null>(null);
  const fullText = question.paragraphs.join("\n\n");

  const updateState = (next: ListenState) => {
    stateRef.current = next;
    setState(next);
  };

  useEffect(() => {
    return () => {
      abortSpeech();
      abortGeminiCapture();
    };
  }, [abortGeminiCapture, abortSpeech]);

  const buildSpeechHandlers = () => ({
    onResult: (text: string, _isFinal: boolean) => {
      transcriptRef.current = [baseTranscriptRef.current, text.trim()]
        .filter(Boolean)
        .join(" ")
        .trim();
    },
    onEnd: () => {
      // Reading a paragraph has natural pauses between sentences, and the
      // engine ends the session on each one. Restart so the learner can keep
      // reading until they tap the mic to finish.
      if (stateRef.current !== "listening") return;
      if (restartCountRef.current >= MAX_LISTEN_RESTARTS) return;
      restartCountRef.current += 1;
      baseTranscriptRef.current = transcriptRef.current;
      restartRef.current?.();
    },
    onError: (code: string, message: string) => {
      if (stateRef.current !== "listening") return;
      console.warn("Speech recognition error:", code, message);

      // The engine reports these when it stops hearing speech, which happens
      // constantly while the passage is still scrolling into view. Restart
      // rather than failing the attempt.
      if (RECOVERABLE_SPEECH_ERRORS.has(code)) {
        if (restartCountRef.current >= MAX_LISTEN_RESTARTS) return;
        restartCountRef.current += 1;
        baseTranscriptRef.current = transcriptRef.current;
        restartRef.current?.();
        return;
      }

      updateState("fail");
    },
  });

  const startRecognitionSession = async (isRestart: boolean): Promise<boolean> => {
    if (isRestart && stateRef.current !== "listening") return false;
    const started = await speech.start(buildSpeechHandlers(), {
      // Reading passages span multiple sentences; a non-continuous session
      // ends at the first pause.
      continuous: true,
      interimResults: true,
    });
    return Boolean(started) || isRestart;
  };

  const handleStart = async () => {
    updateState("listening");
    transcriptRef.current = "";
    baseTranscriptRef.current = "";
    restartCountRef.current = 0;
    setEvaluation(null);

    let started = false;
    if (useGeminiBackend) {
      started = await geminiCapture.start({
        onResult: () => {},
        onError: (message) => {
          console.warn("Gemini recording error:", message);
          updateState("fail");
        }
      });
    } else {
      started = await startRecognitionSession(false);
    }

    if (!started) {
      updateState("idle");
      scrollY.value = 0;
      return;
    }

    // Only scroll once the mic is live, and start with the first lines already
    // on screen — the learner should never be asked to read blank space.
    scrollY.value = 0;
    const distance = Math.max(0, textHeight - containerHeight + TELEPROMPTER_TAIL);
    if (distance <= 0) return;
    const duration = distance * SCROLL_MS_PER_PX;
    scrollY.value = withTiming(-distance, {
      duration,
      easing: Easing.linear,
    });
  };

  const handleStop = async () => {
    updateState("processing");
    // Blocks the onEnd/onError handlers from restarting the session.
    restartCountRef.current = MAX_LISTEN_RESTARTS;
    cancelAnimation(scrollY);

    try {
      let evalResult: ParagraphSpeechEvaluation;

      if (useGeminiBackend) {
        const audio = await geminiCapture.stopAndGetAudio();
        if (audio?.base64) {
          const geminiResult = await evaluateParagraphSpeechWithGemini(audio.base64, audio.mimeType, question.paragraphs);
          evalResult = {
            accuracyScore: geminiResult.accuracyScore,
            transcript: geminiResult.transcript,
            wordAnalysis: geminiResult.wordAnalysis.map((w) => ({
              word: w.word,
              correct: w.correct
            }))
          };
        } else {
          throw new Error("No audio captured");
        }
      } else {
        speech.stop();
        // stop() resolves the final result asynchronously; grading immediately
        // would score the passage against a truncated transcript.
        await new Promise((resolve) =>
          setTimeout(resolve, FINAL_RESULT_GRACE_MS),
        );
        const lastTranscript = transcriptRef.current;
        evalResult = evaluateSpeechLocally(lastTranscript, question.paragraphs);
      }

      setEvaluation(evalResult);

      if (question.mode === "practice") {
        updateState("success");
      } else {
        updateState(evalResult.accuracyScore >= 60 ? "success" : "fail");
      }
    } catch (err) {
      console.warn("Speech evaluation error:", err);
      updateState("fail");
    }
  };

  // Refreshed every render so a restart always uses current handlers.
  useEffect(() => {
    restartRef.current = () => {
      void startRecognitionSession(true);
    };
  });

  const handleMicPress = () => {
    if (state === "processing") return;
    if (state === "listening") {
      void handleStop();
    } else {
      void handleStart();
    }
  };

  const scrollStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scrollY.value }],
  }));

  const renderText = () => {
    if (!evaluation) {
      return (
        <AppText
          languageCode={question.targetLanguage}
          align="start"
          fullWidth
          style={[styles.paragraphText, { color: colors.foreground }]}
        >
          {fullText}
        </AppText>
      );
    }

    return (
      <DirectionalView languageCode={question.targetLanguage ?? "en"} style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start" }}>
        {evaluation.wordAnalysis.map((item, idx) => (
          <AppText
            key={idx}
            style={[
              styles.wordText,
              { color: item.correct ? "#10B981" : "#EF4444" },
            ]}
            languageCode={question.targetLanguage}
            align="start"
          >
            {item.word}{" "}
          </AppText>
        ))}
      </DirectionalView>
    );
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
  const statusText =
    captureError
      ? captureError
      : state === "processing"
      ? t("lessons.voiceProcessing")
      : state === "listening"
      ? t("lessons.listening")
      : state === "success"
      ? (question.mode === "practice"
        ? t("lessons.nice")
        : t("lessons.scoreLabel").replace("{score}", String(evaluation?.accuracyScore || 0)))
      : state === "fail"
      ? t("lessons.tryAgain")
      : t("lessons.tapMicSpeak");

  const containerContent = (
    <Animated.View 
      style={[styles.scrollContent, state === "listening" ? scrollStyle : null]}
      onLayout={(e) => setTextHeight(e.nativeEvent.layout.height)}
    >
      {renderText()}
    </Animated.View>
  );

  return (
    <GameRoot style={styles.root}>
      <GameHeader>
        <LightGameHeading title={question.mode === "quiz" ? t("lessons.readingQuiz") : t("lessons.readingPractice")} />
      </GameHeader>

      <View 
        style={[styles.teleprompterContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
      >
        {state === "listening" ? (
          <View style={{ flex: 1, overflow: "hidden" }}>
            {containerContent}
          </View>
        ) : (
          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
            showsVerticalScrollIndicator={true}
          >
            {containerContent}
          </ScrollView>
        )}
      </View>

      <View style={styles.micStage}>
        <MicCaptureOrb
          listening={
            state === "listening" ||
            state === "processing" ||
            (useGeminiBackend ? geminiCapture.listening : speech.listening)
          }
          disabled={state === "success"}
          color={micColor}
          size={94}
          hint={statusText}
          onPress={handleMicPress}
        />
      </View>

      {state === "success" || state === "fail" ? (
        <GameFooter delay={100}>
          <LightCheckButton
            label={t("common.continue")}
            onPress={() => onAnswer(state === "success")}
          />
        </GameFooter>
      ) : (
        <GameFooter delay={120}>
          <AppText style={[styles.skipLink, { color: colors.mutedForeground }]} onPress={() => onAnswer("skip")}>
            {t("lessons.skipForNow")}
          </AppText>
        </GameFooter>
      )}
    </GameRoot>
  );
}

const styles = StyleSheet.create({
  root: { paddingHorizontal: 20, paddingBottom: 16 },
  teleprompterContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "#F8FAFC",
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    marginTop: 12,
    marginBottom: 14,
    paddingHorizontal: 18,
    justifyContent: "flex-start",
  },
  // No fade overlays any more, so the passage only needs breathing room off
  // the border — the first and last lines stay fully legible.
  scrollContent: {
    paddingVertical: 18,
  },
  paragraphText: {
    fontSize: 22,
    lineHeight: 32,
    color: "#334155",
    fontFamily: "DINNextRoundedBold",
    ...ltrText,
  },
  wordText: {
    fontSize: 22,
    lineHeight: 32,
    fontFamily: "DINNextRoundedBold",
    ...ltrText,
  },
  micStage: {
    alignItems: "center",
    marginBottom: 8,
  },
  skipLink: {
    color: "#64748B",
    fontSize: 16,
    fontFamily: "DINNextRoundedBold",
    textAlign: "center",
    paddingVertical: 10,
  },
});
