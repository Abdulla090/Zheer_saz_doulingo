import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming, cancelAnimation } from "react-native-reanimated";
import { AppText } from "../../../components/ui/AppText";
import { DirectionalView } from "../../../components/ui/Directional";
import { MicCaptureOrb } from "../../../components/voice/MicCaptureOrb";
import { ParagraphSpeechQuestion } from "../../../data/types";
import { useSpeechCapture } from "../../../hooks/use-speech-capture";
import { GameFooter, GameHeader, GameRoot } from "./GameAnimatedShell";
import { LightGameHeading, LightCheckButton } from "./lesson-light-primitives";
import { L } from "./lesson-light-design";
import { useI18n } from "../../../hooks/useI18n";
import { ltrText } from "./game-text";

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

function evaluateSpeechLocally(transcript: string, paragraphs: string[]): ParagraphSpeechEvaluation {
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "")
      .replace(/\s+/g, " ")
      .trim();

  // Split target paragraphs into clean individual words
  const targetWords = paragraphs.join(" ").split(/\s+/).filter(Boolean);
  
  // Create a normalized set of spoken words for quick lookup
  const spokenWords = new Set(normalize(transcript).split(/\s+/).filter(Boolean));

  let correctCount = 0;
  const wordAnalysis = targetWords.map((originalWord) => {
    const normalizedTarget = normalize(originalWord);
    const correct = spokenWords.has(normalizedTarget);
    if (correct) {
      correctCount++;
    }
    
    return {
      word: originalWord,
      correct,
    };
  });

  const accuracyScore = targetWords.length > 0 ? Math.round((correctCount / targetWords.length) * 100) : 0;

  return {
    accuracyScore,
    wordAnalysis,
    transcript,
  };
}

export default function ParagraphSpeechGame({ question, onAnswer }: Props) {
  const { t } = useI18n();
  const speech = useSpeechCapture("en-US");
  const scrollY = useSharedValue(0);

  const [state, setState] = useState<ListenState>("idle");
  const [evaluation, setEvaluation] = useState<ParagraphSpeechEvaluation | null>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [textHeight, setTextHeight] = useState(0);

  const transcriptRef = useRef("");
  const fullText = question.paragraphs.join("\n\n");

  useEffect(() => {
    return () => {
      speech.abort();
    };
  }, [speech]);

  const handleStart = async () => {
    setState("listening");
    transcriptRef.current = "";
    setEvaluation(null);
    scrollY.value = containerHeight;
    
    const distance = containerHeight + textHeight;
    const duration = distance * 28;
    
    const started = await speech.start({
      onResult: (text: string, _isFinal: boolean) => {
        transcriptRef.current = text;
      },
      onError: (code: string, message: string) => {
        console.warn("Speech recognition error:", code, message);
        setState("fail");
      }
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
      speech.stop();
      
      const lastTranscript = transcriptRef.current;
      const evalResult = evaluateSpeechLocally(lastTranscript, question.paragraphs);
      setEvaluation(evalResult);
      
      if (question.mode === "practice") {
        setState("success");
      } else {
        setState(evalResult.accuracyScore >= 60 ? "success" : "fail");
      }
    } catch (err) {
      console.warn("Speech evaluation error:", err);
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
        <AppText languageCode={question.targetLanguage} align="start" fullWidth style={styles.paragraphText}>
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

  const micColor = state === "listening" || speech.listening ? L.blue : state === "processing" ? L.blue : state === "success" ? L.green : state === "fail" ? L.red : L.blue;
  
  const statusText =
    state === "processing"
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
        style={styles.teleprompterContainer}
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
            label={t("common.continue")}
            onPress={() => onAnswer(state === "success")}
          />
        </GameFooter>
      ) : (
        <GameFooter delay={120}>
          <AppText style={styles.skipLink} onPress={() => onAnswer("skip")}>
            {t("lessons.skipForNow")}
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
    paddingVertical: 64,
  },
  paragraphText: {
    fontSize: 22,
    lineHeight: 30,
    color: "#334155",
    fontFamily: "DINNextRoundedBold",
    ...ltrText,
  },
  wordText: {
    fontSize: 22,
    lineHeight: 30,
    fontFamily: "DINNextRoundedBold",
    ...ltrText,
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
