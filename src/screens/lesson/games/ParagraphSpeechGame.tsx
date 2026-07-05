import React, { useEffect, useState } from "react";
import { StyleSheet, View, I18nManager } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming, cancelAnimation } from "react-native-reanimated";
import { AppText } from "../../../components/ui/AppText";
import { MicCaptureOrb } from "../../../components/voice/MicCaptureOrb";
import { ParagraphSpeechQuestion } from "../../../data/types";
import { useGeminiVoiceCapture } from "../../../hooks/use-gemini-voice-capture";
import { GameFooter, GameHeader, GameRoot } from "./GameAnimatedShell";
import { LightGameHeading, LightCheckButton } from "./lesson-light-primitives";
import { evaluateParagraphSpeechWithGemini, type ParagraphSpeechEvaluation } from "../../../services/gemini-speech-service";
import { L } from "./lesson-light-design";

type Props = {
  question: ParagraphSpeechQuestion;
  onAnswer: (correct: boolean | "skip") => void;
};

type ListenState = "idle" | "listening" | "processing" | "success" | "fail";

export default function ParagraphSpeechGame({ question, onAnswer }: Props) {
  const speech = useGeminiVoiceCapture();
  const scrollY = useSharedValue(0);

  const [state, setState] = useState<ListenState>("idle");
  const [evaluation, setEvaluation] = useState<ParagraphSpeechEvaluation | null>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [textHeight, setTextHeight] = useState(0);

  const fullText = question.paragraphs.join("\n\n");

  useEffect(() => {
    return () => {
      speech.abort();
    };
  }, []);

  const handleStart = async () => {
    setState("listening");
    scrollY.value = containerHeight;
    
    const distance = containerHeight + textHeight;
    const duration = distance * 28;
    
    const started = await speech.start({
      onResult: () => {},
      onError: () => { if (state === "listening") void handleStop(); }
    });

    if (started) {
      scrollY.value = withTiming(-textHeight, { duration, easing: Easing.linear });
    } else {
        setState("idle");
        scrollY.value = 0;
    }
  };

  const handleStop = async () => {
    setState("processing");
    cancelAnimation(scrollY);
    
    try {
      const result = await speech.stopAndGetAudio();
      if (question.mode === "practice") {
        setState("success");
      } else {
        if (!result?.base64) throw new Error("No audio recorded");
        const evalResult = await evaluateParagraphSpeechWithGemini(
          result.base64,
          result.mimeType || "audio/m4a",
          question.paragraphs
        );
        setEvaluation(evalResult);
        setState(evalResult.accuracyScore >= 60 ? "success" : "fail");
      }
    } catch (err) {
      console.warn("Speech error", err);
      setState("fail");
    }
  };

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
        <AppText style={styles.paragraphText}>
          {fullText}
        </AppText>
      );
    }

    return (
      <View style={{ flexDirection: I18nManager.isRTL ? "row-reverse" : "row", flexWrap: "wrap", justifyContent: "flex-start" }}>
        {evaluation.wordAnalysis.map((item, idx) => (
          <AppText
            key={idx}
            style={[
              styles.wordText,
              { color: item.correct ? "#10B981" : "#EF4444" },
            ]}
          >
            {item.word}{" "}
          </AppText>
        ))}
      </View>
    );
  };

  const micColor = state === "listening" || speech.listening ? L.blue : state === "processing" ? L.blue : state === "success" ? L.green : state === "fail" ? L.red : L.blue;
  const statusText = state === "processing" ? "Analyzing..." : state === "listening" ? "Listening..." : state === "success" ? (question.mode === "practice" ? "Great job!" : `Score: ${evaluation?.accuracyScore}%`) : state === "fail" ? "Try again" : "Tap Mic to Start";

  return (
    <GameRoot style={styles.root}>
      <GameHeader>
        <LightGameHeading title={question.mode === "quiz" ? "Reading Quiz" : "Reading Practice"} />
      </GameHeader>

      <View 
        style={styles.teleprompterContainer}
        onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
      >
        <Animated.View 
          style={[styles.scrollContent, scrollStyle]}
          onLayout={(e) => setTextHeight(e.nativeEvent.layout.height)}
        >
          {renderText()}
        </Animated.View>
        <View style={styles.gradientOverlayTop} pointerEvents="none" />
        <View style={styles.gradientOverlayBottom} pointerEvents="none" />
      </View>

      <View style={styles.micStage}>
        <MicCaptureOrb
          listening={state === "listening" || state === "processing" || speech.listening}
          disabled={state === "success"}
          color={micColor}
          size={108}
          hint={statusText}
          onPress={handleMicPress}
        />
      </View>

      {state === "success" || state === "fail" ? (
        <GameFooter delay={100}>
          <LightCheckButton
            label="Continue"
            onPress={() => onAnswer(state === "success")}
          />
        </GameFooter>
      ) : (
        <GameFooter delay={120}>
          <AppText style={styles.skipLink} onPress={() => onAnswer("skip")}>
            Skip for now
          </AppText>
        </GameFooter>
      )}
    </GameRoot>
  );
}

const styles = StyleSheet.create({
  root: { paddingHorizontal: 24, paddingBottom: 40 },
  teleprompterContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "#F8FAFC",
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    marginVertical: 24,
    paddingHorizontal: 20,
    justifyContent: "flex-start",
  },
  scrollContent: {
    paddingVertical: 40,
  },
  paragraphText: {
    fontSize: 28,
    lineHeight: 40,
    color: "#334155",
    fontFamily: "DINNextRoundedBold",
  },
  wordText: {
    fontSize: 28,
    lineHeight: 40,
    fontFamily: "DINNextRoundedBold",
  },
  micStage: {
    alignItems: "center",
    marginBottom: 20,
  },
  skipLink: {
    color: "#64748B",
    fontSize: 16,
    fontFamily: "DINNextRoundedBold",
    textAlign: "center",
    paddingVertical: 16,
  },
  gradientOverlayTop: {
    position: "absolute",
    top: 0, left: 0, right: 0, height: 60,
    backgroundColor: "rgba(248, 250, 252, 0.8)"
  },
  gradientOverlayBottom: {
    position: "absolute",
    bottom: 0, left: 0, right: 0, height: 60,
    backgroundColor: "rgba(248, 250, 252, 0.8)"
  }
});
