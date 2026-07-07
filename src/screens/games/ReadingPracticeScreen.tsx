import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, ActivityIndicator, ScrollView, Pressable } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming, cancelAnimation, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { AppText } from "../../components/ui/AppText";
import { MicCaptureOrb } from "../../components/voice/MicCaptureOrb";
import { useSpeechCapture } from "../../hooks/use-speech-capture";
import { generateReadingPracticeParagraphs } from "../../services/gemini-speech-service";
import { useI18n } from "../../hooks/useI18n";
import { useThemeColors } from "../../hooks/useThemeColors";
import { PressableScale } from "../../components/animations";
import { HomeMeshBackground, HomeLiquidButton, HomeLiquidCard } from "../../components/ui/ios-liquid-home";
// @ts-expect-error no types
import { HugeiconsIcon } from "@hugeicons/react-native/dist/cjs/index.js";
// @ts-expect-error no types
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons/dist/cjs/index.js";

type Difficulty = "Beginner" | "Intermediate" | "Advanced";
type State = "setup" | "generating" | "idle" | "listening" | "processing" | "success" | "fail";
type Speed = "Slow" | "Normal" | "Fast";

type ParagraphSpeechEvaluation = {
  accuracyScore: number;
  wordAnalysis: {
    word: string;
    correct: boolean;
  }[];
  transcript: string;
};

const TEMPLATES: Record<Difficulty, { title: string; paragraphs: string[] }[]> = {
  Beginner: [
    {
      title: "Daily Walk",
      paragraphs: [
        "The weather is beautiful and warm today. The yellow sun is shining and the small birds are singing in the garden. I like to walk in the quiet park with my friends. We see many colorful flowers and tall green trees. It is a wonderful day to be outside, play games, and enjoy nature together."
      ]
    },
    {
      title: "My Family",
      paragraphs: [
        "I love my family very much. We eat a delicious dinner together every evening at home. We talk about our day and tell funny stories. On the weekends, we go to the busy market or play games in the backyard. We are very happy and help each other every day."
      ]
    }
  ],
  Intermediate: [
    {
      title: "Learning Languages",
      paragraphs: [
        "Learning a new language opens up many exciting opportunities in life. It helps you connect with people from different countries and understand their culture deeply. While it takes time and practice to master new vocabulary, the process is rewarding. Speaking every day is the best way to build confidence."
      ]
    },
    {
      title: "Smart Devices",
      paragraphs: [
        "Technology is changing the way we learn, communicate, and work. With modern smartphones, tablets, and artificial intelligence, we can practice speaking English anytime and anywhere. These smart devices provide instant feedback, making education more accessible to everyone around the world."
      ]
    }
  ],
  Advanced: [
    {
      title: "Art of Focus",
      paragraphs: [
        "Consistency is the ultimate key to mastering any complex intellectual or physical skill. By dedicating even fifteen minutes a day to active reading and pronunciation practice, you will make significant and measurable progress. Eliminating distractions and maintaining focus allows the brain to build strong neural pathways."
      ]
    },
    {
      title: "Future of Earth",
      paragraphs: [
        "Environmental sustainability is undoubtedly one of the most critical challenges facing our generation. Preserving global biodiversity and protecting ecosystems requires collective international action, sustainable policies, and innovative technological solutions to reduce carbon emissions and combat climate change."
      ]
    }
  ]
};

function evaluateSpeechLocally(transcript: string, paragraphs: string[]): ParagraphSpeechEvaluation {
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const targetWords = paragraphs.join(" ").split(/\s+/).filter(Boolean);
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

export default function ReadingPracticeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t, isKu } = useI18n();
  const speech = useSpeechCapture("en-US");
  const { colors, isDark } = useThemeColors();

  const [state, setState] = useState<State>("setup");
  const [sourceMode, setSourceMode] = useState<"ai" | "template">("ai");
  const [difficulty, setDifficulty] = useState<Difficulty>("Intermediate");
  const [paraCount, setParaCount] = useState<number>(1);
  const [wordCount, setWordCount] = useState<number>(80);
  const [speed, setSpeed] = useState<Speed>("Normal");
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [evaluation, setEvaluation] = useState<ParagraphSpeechEvaluation | null>(null);

  const [containerHeight, setContainerHeight] = useState(300);
  const [textHeight, setTextHeight] = useState(100);

  const scrollY = useSharedValue(140);
  const transcriptRef = useRef("");

  // Position text at the bottom in idle state (starts at bottom of screen, scrolls up)
  useEffect(() => {
    if (state === "idle" && containerHeight > 0) {
      scrollY.value = containerHeight - 160;
    }
  }, [state, containerHeight]);

  useEffect(() => {
    return () => {
      speech.abort();
    };
  }, []);

  // Reset selected template if difficulty changes
  useEffect(() => {
    setSelectedTemplateIndex(0);
  }, [difficulty]);

  const handleStartGenerate = async () => {
    setState("generating");
    try {
      const generated = await generateReadingPracticeParagraphs(difficulty, paraCount, wordCount);
      setParagraphs(generated);
      setEvaluation(null);
      setState("idle");
    } catch (e) {
      console.warn("Failed to generate", e);
      // Fallback templates based on difficulty
      const defaults = TEMPLATES[difficulty][0]?.paragraphs || ["Hello! I am learning English today."];
      setParagraphs(defaults);
      setEvaluation(null);
      setState("idle");
    }
  };

  const handleStartTemplate = () => {
    const selected = TEMPLATES[difficulty][selectedTemplateIndex];
    if (selected) {
      setParagraphs(selected.paragraphs);
      setEvaluation(null);
      setState("idle");
    }
  };

  const handleStart = () => {
    if (sourceMode === "ai") {
      void handleStartGenerate();
    } else {
      handleStartTemplate();
    }
  };

  const handleStartListen = async () => {
    setState("listening");
    setEvaluation(null);
    transcriptRef.current = "";
    
    const startPos = containerHeight > 0 ? containerHeight - 160 : 140;
    scrollY.value = startPos;
    
    const distance = startPos + textHeight;
    const speedMultiplier = speed === "Slow" ? 40 : speed === "Fast" ? 18 : 28;
    const duration = distance * speedMultiplier;
    
    const started = await speech.start({
      onResult: (text: string, _isFinal: boolean) => {
        transcriptRef.current = text;
      },
      onError: () => { if (state === "listening") void handleStopListen(); }
    });

    if (started) {
      scrollY.value = withTiming(-textHeight, { duration, easing: Easing.linear });
    } else {
        setState("idle");
        scrollY.value = startPos;
    }
  };

  const handleStopListen = async () => {
    setState("processing");
    cancelAnimation(scrollY);
    
    try {
      speech.stop();
      const lastTranscript = transcriptRef.current;
      const evalResult = evaluateSpeechLocally(lastTranscript, paragraphs);
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

  // High contrast Black & White styles for setup settings
  const getPillStyle = (active: boolean): any => {
    return [
      styles.pillCard,
      {
        backgroundColor: "#FFFFFF",
        borderColor: "#E2E8F0"
      },
      active ? {
        backgroundColor: "#000000",
        borderColor: "#000000"
      } : null
    ];
  };

  const getPillTextStyle = (active: boolean): any => {
    return [
      styles.pillText,
      { color: "#0F172A" },
      active ? {
        color: "#FFFFFF",
        fontWeight: "800" as const
      } : null
    ];
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  if (state === "setup") {
    return (
      <View style={styles.root}>
        <HomeMeshBackground />
        <View style={[styles.header, { paddingTop: insets.top + 16, flexDirection: isKu ? "row-reverse" : "row" }]}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <HugeiconsIcon icon={isKu ? ArrowRight01Icon : ArrowLeft01Icon} size={24} color="#090D16" />
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
              
              {/* Source Mode Selection */}
              <View style={styles.settingsGroup}>
                <AppText style={[styles.label, { textAlign: isKu ? "right" : "left" }]}>Source Mode</AppText>
                <View style={[styles.pillRow, { flexDirection: isKu ? "row-reverse" : "row" }]}>
                  <PressableScale
                    onPress={() => setSourceMode("ai")}
                    style={getPillStyle(sourceMode === "ai")}
                  >
                    <AppText style={getPillTextStyle(sourceMode === "ai")}>
                      AI Generated
                    </AppText>
                  </PressableScale>
                  <PressableScale
                    onPress={() => setSourceMode("template")}
                    style={getPillStyle(sourceMode === "template")}
                  >
                    <AppText style={getPillTextStyle(sourceMode === "template")}>
                      Built-in Templates
                    </AppText>
                  </PressableScale>
                </View>
              </View>

              <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border, width: "100%" }} />

              {/* Difficulty Selection */}
              <View style={styles.settingsGroup}>
                <AppText style={[styles.label, { textAlign: isKu ? "right" : "left" }]}>Difficulty</AppText>
                <View style={[styles.pillRow, { flexDirection: isKu ? "row-reverse" : "row" }]}>
                  {(["Beginner", "Intermediate", "Advanced"] as Difficulty[]).map(d => (
                    <PressableScale
                      key={d}
                      onPress={() => setDifficulty(d)}
                      scaleDown={0.95}
                      style={getPillStyle(difficulty === d)}
                    >
                      <AppText style={getPillTextStyle(difficulty === d)}>
                        {d}
                      </AppText>
                    </PressableScale>
                  ))}
                </View>
              </View>

              <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border, width: "100%" }} />

              {/* Dynamic Option depending on Source Mode */}
              {sourceMode === "ai" ? (
                <>
                  <View style={styles.settingsGroup}>
                    <AppText style={[styles.label, { textAlign: isKu ? "right" : "left" }]}>Paragraphs</AppText>
                    <View style={[styles.pillRow, { flexDirection: isKu ? "row-reverse" : "row" }]}>
                      {[1, 2, 3].map(n => (
                        <PressableScale
                          key={n}
                          onPress={() => setParaCount(n)}
                          scaleDown={0.95}
                          style={getPillStyle(paraCount === n)}
                        >
                          <AppText style={getPillTextStyle(paraCount === n)}>
                            {n}
                          </AppText>
                        </PressableScale>
                      ))}
                    </View>
                  </View>

                  <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border, width: "100%", marginVertical: 8 }} />

                  <View style={styles.settingsGroup}>
                    <AppText style={[styles.label, { textAlign: isKu ? "right" : "left" }]}>Words per Paragraph</AppText>
                    <View style={[styles.pillRow, { flexDirection: isKu ? "row-reverse" : "row" }]}>
                      {([50, 100, 150] as const).map(w => (
                        <PressableScale
                          key={w}
                          onPress={() => setWordCount(w)}
                          scaleDown={0.95}
                          style={getPillStyle(wordCount === w)}
                        >
                          <AppText style={getPillTextStyle(wordCount === w)}>
                            {w}
                          </AppText>
                        </PressableScale>
                      ))}
                    </View>
                  </View>
                </>
              ) : (
                <View style={styles.settingsGroup}>
                  <AppText style={[styles.label, { textAlign: isKu ? "right" : "left" }]}>Select Template</AppText>
                  <View style={[styles.pillRow, { flexDirection: isKu ? "row-reverse" : "row", flexWrap: "wrap", gap: 10 }]}>
                    {TEMPLATES[difficulty].map((temp, index) => (
                      <PressableScale
                        key={index}
                        onPress={() => setSelectedTemplateIndex(index)}
                        style={getPillStyle(selectedTemplateIndex === index)}
                      >
                        <AppText style={getPillTextStyle(selectedTemplateIndex === index)}>
                          {temp.title}
                        </AppText>
                      </PressableScale>
                    ))}
                  </View>
                </View>
              )}

              <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border, width: "100%" }} />

              {/* Speed Selection */}
              <View style={styles.settingsGroup}>
                <AppText style={[styles.label, { textAlign: isKu ? "right" : "left" }]}>Scroll Speed</AppText>
                <View style={[styles.pillRow, { flexDirection: isKu ? "row-reverse" : "row" }]}>
                  {(["Slow", "Normal", "Fast"] as Speed[]).map(s => (
                    <PressableScale
                      key={s}
                      onPress={() => setSpeed(s)}
                      scaleDown={0.95}
                      style={getPillStyle(speed === s)}
                    >
                      <AppText style={getPillTextStyle(speed === s)}>
                        {s}
                      </AppText>
                    </PressableScale>
                  ))}
                </View>
              </View>

            </HomeLiquidCard>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400)} style={{ marginTop: 12 }}>
            <HomeLiquidButton
              label={sourceMode === "ai" ? "Generate & Start" : "Start Practice"}
              onPress={handleStart}
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

  const containerContent = (
    <Animated.View 
      style={[styles.scrollContent, state === "listening" ? scrollStyle : null]}
      onLayout={(e) => setTextHeight(e.nativeEvent.layout.height)}
    >
      {renderText()}
    </Animated.View>
  );

  return (
    <View style={styles.root}>
      <HomeMeshBackground />
      <View style={[styles.header, { paddingTop: insets.top + 16, flexDirection: isKu ? "row-reverse" : "row" }]}>
        <Pressable style={styles.backButton} onPress={() => setState("setup")}>
          <HugeiconsIcon icon={isKu ? ArrowRight01Icon : ArrowLeft01Icon} size={24} color="#090D16" />
        </Pressable>
      </View>

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
                scrollY.value = containerHeight > 0 ? containerHeight - 160 : 140;
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
    marginBottom: 20,
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
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "800",
    color: "rgba(9, 13, 22, 0.4)",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 10,
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
    borderWidth: 1.5,
  },
  pillText: {
    fontSize: 15,
    fontFamily: "DINNextRoundedBold",
  },
  teleprompterContainer: {
    flex: 1,
    marginHorizontal: 24,
    marginBottom: 32,
    overflow: "hidden",
    justifyContent: "flex-start",
  },
  scrollContent: {
    paddingVertical: 132,
    alignItems: "center",
  },
  paragraphText: {
    fontSize: 22,
    lineHeight: 30,
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
    fontSize: 22,
    lineHeight: 30,
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
