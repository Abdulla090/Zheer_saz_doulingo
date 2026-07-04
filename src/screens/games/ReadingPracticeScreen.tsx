import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator, ScrollView, Pressable } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming, cancelAnimation, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { AppText } from "../../components/ui/AppText";
import { MicCaptureOrb } from "../../components/voice/MicCaptureOrb";
import { useGeminiVoiceCapture } from "../../hooks/use-gemini-voice-capture";
import { evaluateParagraphSpeechWithGemini, generateReadingPracticeParagraphs, type ParagraphSpeechEvaluation } from "../../services/gemini-speech-service";
import { useI18n } from "../../hooks/useI18n";
import { useThemeColors } from "../../hooks/useThemeColors";
import { PressableScale } from "../../components/animations";
import { HomeMeshBackground, HomeLiquidButton, HomePalette, HomeLiquidCard } from "../../components/ui/ios-liquid-home";
// @ts-expect-error no types
import { HugeiconsIcon } from "@hugeicons/react-native/dist/cjs/index.js";
// @ts-expect-error no types
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons/dist/cjs/index.js";

type Difficulty = "Beginner" | "Intermediate" | "Advanced";
type State = "setup" | "generating" | "idle" | "listening" | "processing" | "success" | "fail";

export default function ReadingPracticeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t, isKu } = useI18n();
  const speech = useGeminiVoiceCapture();
  const { colors } = useThemeColors();

  const [state, setState] = useState<State>("setup");
  const [difficulty, setDifficulty] = useState<Difficulty>("Intermediate");
  const [paraCount, setParaCount] = useState<number>(1);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [evaluation, setEvaluation] = useState<ParagraphSpeechEvaluation | null>(null);

  const [containerHeight, setContainerHeight] = useState(300);
  const [textHeight, setTextHeight] = useState(100);

  const scrollY = useSharedValue(300);

  useEffect(() => {
    if (state === "idle") {
      scrollY.value = 0;
    }
  }, [state]);

  useEffect(() => {
    return () => {
      speech.abort();
    };
  }, []);

  const handleStartGenerate = async () => {
    setState("generating");
    try {
      const generated = await generateReadingPracticeParagraphs(difficulty, paraCount);
      setParagraphs(generated);
      setState("idle");
      scrollY.value = 0;
    } catch (e) {
      console.warn("Failed to generate", e);
      setParagraphs(["Hello! I am learning English today. It is a beautiful day.", "I like to read books and drink coffee."].slice(0, paraCount));
      setState("idle");
      scrollY.value = 0;
    }
  };

  const handleStartListen = async () => {
    setState("listening");
    scrollY.value = containerHeight;
    
    const distance = containerHeight + textHeight;
    const duration = distance * 28; // Slightly slower, more readable crawl speed
    
    const started = await speech.start({
      onResult: () => {},
      onError: () => { if (state === "listening") void handleStopListen(); }
    });

    if (started) {
      // Linear scrolling looks much better for standard teleprompters
      scrollY.value = withTiming(-textHeight, { duration, easing: Easing.linear });
    } else {
        setState("idle");
    }
  };

  const handleStopListen = async () => {
    setState("processing");
    cancelAnimation(scrollY);
    
    try {
      const result = await speech.stopAndGetAudio();
      if (!result?.base64) throw new Error("No audio recorded");
      const evalResult = await evaluateParagraphSpeechWithGemini(
        result.base64,
        result.mimeType || "audio/m4a",
        paragraphs
      );
      setEvaluation(evalResult);
      setState(evalResult.accuracyScore >= 60 ? "success" : "fail");
    } catch (err) {
      console.warn("Speech error", err);
      setState("fail");
    }
  };

  const handleMicPress = () => {
    if (state === "processing" || state === "generating") return;
    if (state === "listening") {
      void handleStopListen();
    } else {
      void handleStartListen();
    }
  };

  const scrollStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scrollY.value }],
  }));

  const fullText = paragraphs.join("\n\n");

  const renderText = () => {
    if (!evaluation) {
      return (
        <AppText style={styles.paragraphText}>
          {fullText}
        </AppText>
      );
    }
    return (
      <View style={styles.wordWrapRow}>
        {evaluation.wordAnalysis.map((item, i) => {
          return (
            <AppText
              key={i}
              style={[
                styles.wordText,
                { color: item.correct ? "#10B981" : "#EF4444" },
              ]}
            >
              {item.word}{" "}
            </AppText>
          );
        })}
      </View>
    );
  };

  if (state === "setup") {
    return (
      <View style={styles.root}>
        <HomeMeshBackground />
        <View style={[styles.header, { paddingTop: insets.top + 16, flexDirection: isKu ? "row-reverse" : "row" }]}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={24} color="#090D16" />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.setupContent} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.delay(100)} style={styles.welcomeSection}>
            <View style={styles.aiBadge}>
              <AppText style={styles.aiBadgeText}>AI POWERED</AppText>
            </View>
            <AppText style={[styles.title, { textAlign: isKu ? "right" : "left" }]}>
              {t("games.paragraphSpeechTitle") || "Reading Practice"}
            </AppText>
            <AppText style={[styles.subtitle, { textAlign: isKu ? "right" : "left" }]}>
              {t("games.paragraphSpeechSub") || "Improve your reading fluency and pronunciation with AI-generated passages."}
            </AppText>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200)} style={{ marginBottom: 28 }}>
            <HomeLiquidCard contentStyle={{ padding: 18, gap: 20 }}>
              <View style={styles.settingsGroup}>
                <AppText style={[styles.label, { textAlign: isKu ? "right" : "left" }]}>Difficulty</AppText>
                <View style={[styles.pillRow, { flexDirection: isKu ? "row-reverse" : "row" }]}>
                  {(["Beginner", "Intermediate", "Advanced"] as Difficulty[]).map(d => (
                    <PressableScale
                      key={d}
                      onPress={() => setDifficulty(d)}
                      scaleDown={0.95}
                      style={[
                        styles.pillCard,
                        { backgroundColor: colors.muted, borderColor: colors.border },
                        difficulty === d && { backgroundColor: colors.primary, borderColor: colors.primary }
                      ]}
                    >
                      <AppText
                        style={[
                          styles.pillText,
                          { color: colors.foreground },
                          difficulty === d && { color: "#FFFFFF", fontWeight: "800" }
                        ]}
                      >
                        {d}
                      </AppText>
                    </PressableScale>
                  ))}
                </View>
              </View>

              <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border, width: "100%" }} />

              <View style={styles.settingsGroup}>
                <AppText style={[styles.label, { textAlign: isKu ? "right" : "left" }]}>Paragraphs</AppText>
                <View style={[styles.pillRow, { flexDirection: isKu ? "row-reverse" : "row" }]}>
                  {[1, 2, 3].map(n => (
                    <PressableScale
                      key={n}
                      onPress={() => setParaCount(n)}
                      scaleDown={0.95}
                      style={[
                        styles.pillCard,
                        { backgroundColor: colors.muted, borderColor: colors.border },
                        paraCount === n && { backgroundColor: colors.primary, borderColor: colors.primary }
                      ]}
                    >
                      <AppText
                        style={[
                          styles.pillText,
                          { color: colors.foreground },
                          paraCount === n && { color: "#FFFFFF", fontWeight: "800" }
                        ]}
                      >
                        {n}
                      </AppText>
                    </PressableScale>
                  ))}
                </View>
              </View>
            </HomeLiquidCard>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400)} style={{ marginTop: 40 }}>
            <HomeLiquidButton
              label="Generate & Start"
              onPress={handleStartGenerate}
            />
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  if (state === "generating") {
    return (
      <View style={[styles.root, { justifyContent: 'center', alignItems: 'center' }]}>
        <HomeMeshBackground />
        <ActivityIndicator size="large" color="#4F46E5" />
        <AppText style={{ marginTop: 16, fontSize: 18, color: "#090D16", fontFamily: "DINNextRoundedBold" }}>
          Generating your reading material...
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <HomeMeshBackground />
      <View style={[styles.header, { paddingTop: insets.top + 16, flexDirection: isKu ? "row-reverse" : "row" }]}>
        <Pressable style={styles.backButton} onPress={() => setState("setup")}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={24} color="#090D16" />
        </Pressable>
      </View>

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
        <LinearGradient 
          colors={["#F8FAFC", "rgba(248, 250, 252, 0)"]} 
          style={styles.gradientOverlayTop} 
          pointerEvents="none" 
        />
        <LinearGradient 
          colors={["rgba(248, 250, 252, 0)", "#F8FAFC"]} 
          style={styles.gradientOverlayBottom} 
          pointerEvents="none" 
        />
      </View>

      <View style={[styles.micStage, { paddingBottom: insets.bottom + 24 }]}>
        {state === "processing" ? (
          <View style={styles.processingWrap}>
             <ActivityIndicator size="large" color="#4F46E5" />
             <AppText style={styles.processingText}>Grading pronunciation...</AppText>
          </View>
        ) : state === "success" || state === "fail" ? (
          <View style={{ width: '100%', paddingHorizontal: 24 }}>
            <HomeLiquidButton 
              label={state === "success" ? "Great job! Try again" : "Keep practicing! Try again"} 
              onPress={() => {
                setEvaluation(null);
                setState("idle");
                scrollY.value = 0;
              }} 
            />
          </View>
        ) : (
          <MicCaptureOrb
            listening={state === "listening"}
            onPress={handleMicPress}
            size={90}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    paddingHorizontal: 24,
    marginBottom: 8,
    alignItems: "center",
    height: 48,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    borderRadius: 99,
    backgroundColor: "rgba(9, 13, 22, 0.03)",
    borderWidth: 1.5,
    borderColor: "rgba(9, 13, 22, 0.08)",
  },
  setupContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  welcomeSection: {
    marginBottom: 40,
  },
  aiBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.2)",
    marginBottom: 16,
  },
  aiBadgeText: {
    color: "#6366F1",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#090D16",
    marginBottom: 10,
    fontFamily: "DINNextRoundedBold",
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(9, 13, 22, 0.6)",
    lineHeight: 22,
  },
  settingsGroup: {
    marginBottom: 32,
  },
  label: {
    fontSize: 13,
    fontWeight: "800",
    color: "rgba(9, 13, 22, 0.4)",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 14,
  },
  pillRow: {
    flexDirection: "row",
    gap: 12,
  },
  pillCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: "rgba(9, 13, 22, 0.03)",
    borderWidth: 1.5,
    borderColor: "rgba(9, 13, 22, 0.08)",
  },
  pillCardActive: {
    backgroundColor: "#6366F1",
    borderColor: "#6366F1",
  },
  pillText: {
    color: "rgba(9, 13, 22, 0.6)",
    fontWeight: "700",
    fontSize: 15,
    fontFamily: "DINNextRoundedBold",
  },
  pillTextActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  teleprompterContainer: {
    flex: 1,
    marginHorizontal: 24,
    marginBottom: 32,
    overflow: "hidden",
    justifyContent: "flex-start",
  },
  scrollContent: {
    paddingVertical: 80,
    alignItems: "center",
  },
  paragraphText: {
    fontSize: 32,
    lineHeight: 48,
    color: "#090D16",
    fontFamily: "DINNextRoundedBold",
    textAlign: "center",
  },
  wordWrapRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  wordText: {
    fontSize: 32,
    lineHeight: 48,
    fontFamily: "DINNextRoundedBold",
  },
  micStage: {
    alignItems: "center",
    justifyContent: "center",
    height: 140,
  },
  processingWrap: {
    alignItems: 'center',
    gap: 12,
  },
  processingText: {
    fontSize: 16,
    color: "rgba(9, 13, 22, 0.6)",
    fontWeight: '700',
    fontFamily: "DINNextRoundedBold",
  },
  gradientOverlayTop: {
    position: "absolute",
    top: 0, left: 0, right: 0, height: 120,
  },
  gradientOverlayBottom: {
    position: "absolute",
    bottom: 0, left: 0, right: 0, height: 120,
  }
});
