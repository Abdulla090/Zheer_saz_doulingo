import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  BookOpen02Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Mic01Icon,
  RefreshIcon,
  Target02Icon,
  VolumeHighIcon,
} from "@hugeicons/core-free-icons";

import { PressableScale } from "../../components/animations";
import { MicCaptureOrb } from "../../components/voice/MicCaptureOrb";
import { AppText } from "../../components/ui/AppText";
import {
  HomeLiquidButton,
  HomeLiquidCard,
  HomeMeshBackground,
  HomePalette as C,
} from "../../components/ui/ios-liquid-home";
import { useSpeechCapture } from "../../hooks/use-speech-capture";
import { useI18n } from "../../hooks/useI18n";
import { generateReadingPracticeParagraphs } from "../../services/gemini-speech-service";
import { hapticImpact } from "../../utils/haptics";

type Difficulty = "Beginner" | "Intermediate" | "Advanced";
type PracticeState = "setup" | "generating" | "preview" | "reading" | "processing" | "results";
type Speed = "Slow" | "Normal" | "Fast";
type SourceMode = "ai" | "template";

type WordResult = {
  word: string;
  normalized: string;
  spoken: boolean;
  orderCorrect: boolean;
};

type ReadingEvaluation = {
  accuracyScore: number;
  coverageScore: number;
  orderScore: number;
  fluencyScore: number;
  wpm: number;
  durationSeconds: number;
  transcript: string;
  wordResults: WordResult[];
  missedWords: string[];
  strengths: string[];
  nextSteps: string[];
};

type TemplateSet = {
  title: string;
  description: string;
  paragraphs: string[];
};

const DIFFICULTIES: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];
const SPEEDS: Speed[] = ["Slow", "Normal", "Fast"];

const TARGET_WPM: Record<Difficulty, number> = {
  Beginner: 90,
  Intermediate: 120,
  Advanced: 145,
};

const SPEED_MULTIPLIER: Record<Speed, number> = {
  Slow: 42,
  Normal: 30,
  Fast: 22,
};

const TEMPLATES: Record<Difficulty, TemplateSet[]> = {
  Beginner: [
    {
      title: "Morning Market",
      description: "Clear daily vocabulary with short sentences.",
      paragraphs: [
        "This morning, I went to the market with my brother. We bought fresh bread, red apples, and cold water. The shopkeeper was kind and smiled at us. After that, we walked home slowly and talked about our plans for the day.",
      ],
    },
    {
      title: "A Good Friend",
      description: "Warm beginner story for confidence.",
      paragraphs: [
        "My best friend is very helpful. She listens when I have a problem and gives me good advice. We study English together after school. Sometimes we make mistakes, but we laugh and try again. Learning is easier with a good friend.",
      ],
    },
  ],
  Intermediate: [
    {
      title: "Learning Languages",
      description: "Balanced vocabulary and connected ideas.",
      paragraphs: [
        "Learning a new language opens many opportunities in life. It helps you connect with people from different countries and understand their culture more deeply. The process takes time, but daily speaking practice builds confidence and makes new vocabulary easier to remember.",
      ],
    },
    {
      title: "Smart Devices",
      description: "Modern topic with natural pronunciation challenges.",
      paragraphs: [
        "Technology is changing the way we learn, communicate, and work. With smartphones, tablets, and artificial intelligence, students can practice English almost anywhere. These tools provide quick feedback, but real progress still depends on focus, repetition, and curiosity.",
      ],
    },
  ],
  Advanced: [
    {
      title: "The Art of Focus",
      description: "Longer rhythm with academic phrasing.",
      paragraphs: [
        "Consistency is the foundation of mastering any complex intellectual skill. By dedicating focused time to active reading and pronunciation practice, learners create measurable progress. Eliminating distractions allows the brain to build stronger patterns and respond more naturally under pressure.",
      ],
    },
    {
      title: "Sustainable Cities",
      description: "Advanced vocabulary with longer clauses.",
      paragraphs: [
        "Urban sustainability requires more than modern buildings and efficient transportation. Cities must protect public spaces, reduce waste, and design neighborhoods where people can live safely without depending on long daily commutes. These choices shape health, opportunity, and the environment.",
      ],
    },
  ],
};

const normalizeWord = (value: string) =>
  value
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'“”‘’]/g, "")
    .trim();

const tokenize = (value: string) =>
  value
    .split(/\s+/)
    .map((word) => normalizeWord(word))
    .filter(Boolean);

const getTargetWords = (paragraphs: string[]) =>
  paragraphs
    .join(" ")
    .split(/\s+/)
    .map((word) => ({
      word,
      normalized: normalizeWord(word),
    }))
    .filter((item) => item.normalized.length > 0);

function evaluateReading(
  transcript: string,
  paragraphs: string[],
  difficulty: Difficulty,
  startedAt: number,
  endedAt: number,
): ReadingEvaluation {
  const targetWords = getTargetWords(paragraphs);
  const spokenWords = tokenize(transcript);
  const spokenCounts = new Map<string, number>();

  spokenWords.forEach((word) => {
    spokenCounts.set(word, (spokenCounts.get(word) ?? 0) + 1);
  });

  let orderedCursor = 0;
  let spokenCount = 0;
  let orderCount = 0;

  const wordResults = targetWords.map((target) => {
    const available = spokenCounts.get(target.normalized) ?? 0;
    const spoken = available > 0;
    if (spoken) {
      spokenCounts.set(target.normalized, available - 1);
      spokenCount++;
    }

    let orderCorrect = false;
    if (spoken) {
      const foundAt = spokenWords.indexOf(target.normalized, orderedCursor);
      if (foundAt >= 0) {
        orderCorrect = true;
        orderCount++;
        orderedCursor = foundAt + 1;
      }
    }

    return {
      ...target,
      spoken,
      orderCorrect,
    };
  });

  const durationSeconds = Math.max(1, Math.round((endedAt - startedAt) / 1000));
  const wpm = Math.round((spokenWords.length / durationSeconds) * 60);
  const coverageScore = targetWords.length > 0 ? Math.round((spokenCount / targetWords.length) * 100) : 0;
  const orderScore = spokenCount > 0 ? Math.round((orderCount / spokenCount) * 100) : 0;
  const fluencyTarget = TARGET_WPM[difficulty];
  const fluencyScore = Math.max(0, Math.min(100, Math.round((wpm / fluencyTarget) * 100)));
  const accuracyScore = Math.round(coverageScore * 0.62 + orderScore * 0.23 + fluencyScore * 0.15);
  const missedWords = wordResults.filter((word) => !word.spoken).slice(0, 12).map((word) => word.word);

  const strengths: string[] = [];
  const nextSteps: string[] = [];

  if (coverageScore >= 85) strengths.push("You covered most of the passage clearly.");
  else nextSteps.push("Read slower and focus on finishing each sentence.");

  if (orderScore >= 82) strengths.push("Your word order stayed close to the passage.");
  else nextSteps.push("Follow the line visually instead of jumping between phrases.");

  if (wpm >= fluencyTarget * 0.75 && wpm <= fluencyTarget * 1.25) {
    strengths.push("Your pace was controlled for this level.");
  } else if (wpm < fluencyTarget * 0.75) {
    nextSteps.push("Practice the same passage once more at a slightly faster pace.");
  } else {
    nextSteps.push("Slow down so pronunciation stays clean.");
  }

  return {
    accuracyScore,
    coverageScore,
    orderScore,
    fluencyScore,
    wpm,
    durationSeconds,
    transcript,
    wordResults,
    missedWords,
    strengths: strengths.slice(0, 3),
    nextSteps: nextSteps.slice(0, 3),
  };
}

function OptionChip({
  label,
  active,
  onPress,
  flex = true,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  flex?: boolean;
}) {
  return (
    <PressableScale
      onPress={onPress}
      scaleDown={0.95}
      style={[
        styles.optionChip,
        flex && styles.optionChipFlex,
        active && styles.optionChipActive,
      ]}
    >
      <AppText
        style={[
          styles.optionChipText,
          active && styles.optionChipTextActive,
        ]}
        numberOfLines={1}
      >
        {label}
      </AppText>
    </PressableScale>
  );
}

function MetricCard({
  label,
  value,
  tone = "blue",
}: {
  label: string;
  value: string;
  tone?: "blue" | "green" | "red";
}) {
  const color = tone === "green" ? "#10B981" : tone === "red" ? "#EF4444" : C.blue;
  return (
    <View style={styles.metricCard}>
      <AppText style={styles.metricValue} forceLatinFont>
        {value}
      </AppText>
      <AppText style={[styles.metricLabel, { color }]}>{label}</AppText>
    </View>
  );
}

export default function ReadingPracticeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { t, isKu, isAr } = useI18n();
  const isRtl = isKu || isAr;
  const speech = useSpeechCapture("en-US");

  const [state, setState] = useState<PracticeState>("setup");
  const [sourceMode, setSourceMode] = useState<SourceMode>("ai");
  const [difficulty, setDifficulty] = useState<Difficulty>("Intermediate");
  const [paragraphCount, setParagraphCount] = useState(1);
  const [wordCount, setWordCount] = useState(90);
  const [speed, setSpeed] = useState<Speed>("Normal");
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [evaluation, setEvaluation] = useState<ReadingEvaluation | null>(null);
  const [containerHeight, setContainerHeight] = useState(420);
  const [textHeight, setTextHeight] = useState(160);

  const transcriptRef = useRef("");
  const startedAtRef = useRef(0);
  const scrollY = useSharedValue(0);

  const compact = width < 380;
  const fullText = paragraphs.join("\n\n");
  const targetWords = useMemo(() => getTargetWords(paragraphs), [paragraphs]);
  const estimatedMinutes = Math.max(1, Math.round(targetWords.length / TARGET_WPM[difficulty]));
  const activeTemplate = TEMPLATES[difficulty][selectedTemplateIndex] ?? TEMPLATES[difficulty][0];

  useEffect(() => {
    return () => {
      speech.abort();
    };
  }, [speech]);

  useEffect(() => {
    setSelectedTemplateIndex(0);
  }, [difficulty]);

  const resetScrollPosition = useCallback(() => {
    const start = Math.max(80, containerHeight - 180);
    scrollY.value = start;
  }, [containerHeight, scrollY]);

  useEffect(() => {
    if (state === "preview" || state === "results") {
      resetScrollPosition();
    }
  }, [resetScrollPosition, state]);

  const handleBack = useCallback(() => {
    if (state !== "setup") {
      speech.abort();
      cancelAnimation(scrollY);
      setState("setup");
      return;
    }
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/play");
  }, [router, scrollY, speech, state]);

  const loadTemplate = useCallback(() => {
    const selected = TEMPLATES[difficulty][selectedTemplateIndex] ?? TEMPLATES[difficulty][0];
    setParagraphs(selected.paragraphs);
    setEvaluation(null);
    setState("preview");
    hapticImpact();
  }, [difficulty, selectedTemplateIndex]);

  const generatePassage = useCallback(async () => {
    setState("generating");
    setEvaluation(null);
    try {
      const generated = await generateReadingPracticeParagraphs(difficulty, paragraphCount, wordCount);
      setParagraphs(generated.filter(Boolean));
      setState("preview");
    } catch (error) {
      console.warn("Reading passage generation failed; using template fallback.", error);
      const fallback = TEMPLATES[difficulty][0]?.paragraphs ?? ["Today I will practice reading clearly and slowly."];
      setParagraphs(fallback);
      setState("preview");
    }
  }, [difficulty, paragraphCount, wordCount]);

  const handleBuildPractice = useCallback(() => {
    if (sourceMode === "ai") void generatePassage();
    else loadTemplate();
  }, [generatePassage, loadTemplate, sourceMode]);

  async function stopReading() {
    if (state === "processing") return;
    setState("processing");
    cancelAnimation(scrollY);
    speech.stop();

    const result = evaluateReading(
      transcriptRef.current,
      paragraphs,
      difficulty,
      startedAtRef.current,
      Date.now(),
    );
    setEvaluation(result);
    setState("results");
  }

  async function startReading() {
    if (paragraphs.length === 0) return;
    transcriptRef.current = "";
    startedAtRef.current = Date.now();
    setEvaluation(null);
    setState("reading");
    resetScrollPosition();

    const start = Math.max(80, containerHeight - 180);
    const distance = start + textHeight + 120;
    const duration = Math.max(12_000, distance * SPEED_MULTIPLIER[speed]);

    const started = await speech.start({
      onResult: (text) => {
        transcriptRef.current = text;
      },
      onError: () => {
        void stopReading();
      },
    });

    if (!started) {
      setState("preview");
      return;
    }

    scrollY.value = start;
    scrollY.value = withTiming(-textHeight - 80, {
      duration,
      easing: Easing.linear,
    });
    hapticImpact();
  }

  function handleMicPress() {
    if (state === "reading") void stopReading();
    else if (state === "preview" || state === "results") void startReading();
  }

  const teleprompterTextStyle = useMemo(
    () => [
      styles.passageText,
      compact && styles.passageTextCompact,
      { textAlign: isRtl ? "right" as const : "left" as const },
    ],
    [compact, isRtl],
  );

  const scrollStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scrollY.value }],
  }));

  const renderPassage = () => {
    if (!evaluation) {
      return (
        <AppText style={teleprompterTextStyle} forceLatinFont>
          {fullText}
        </AppText>
      );
    }

    return (
      <View style={[styles.wordWrap, isRtl && { justifyContent: "flex-end" }]}>
        {evaluation.wordResults.map((item, index) => (
          <AppText
            key={`${item.word}-${index}`}
            style={[
              styles.wordText,
              item.spoken ? styles.wordCorrect : styles.wordMissed,
              item.spoken && !item.orderCorrect && styles.wordOutOfOrder,
            ]}
            forceLatinFont
          >
            {item.word}{" "}
          </AppText>
        ))}
      </View>
    );
  };

  const header = (
    <View style={[styles.header, { paddingTop: insets.top + 12, flexDirection: isRtl ? "row-reverse" : "row" }]}>
      <Pressable style={styles.backButton} onPress={handleBack}>
        <HugeiconsIcon icon={isRtl ? ArrowRight01Icon : ArrowLeft01Icon} size={22} color={C.navy} strokeWidth={2.4} />
      </Pressable>
      <View style={[styles.headerTitleWrap, { alignItems: isRtl ? "flex-end" : "flex-start" }]}>
        <AppText style={[styles.headerKicker, { textAlign: isRtl ? "right" : "left" }]}>
          {isKu ? "ڕاهێنانی خوێندنەوە" : "Reading lab"}
        </AppText>
        <AppText style={[styles.headerTitle, { textAlign: isRtl ? "right" : "left" }]}>
          {isKu ? "خوێندنەوەی دەنگی" : "Read out loud"}
        </AppText>
      </View>
    </View>
  );

  if (state === "setup" || state === "generating") {
    return (
      <View style={styles.root}>
        <HomeMeshBackground />
        {header}

        <ScrollView
          contentContainerStyle={[styles.setupContent, { paddingBottom: insets.bottom + 42 }]}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(360)} style={[styles.heroBlock, { alignItems: isRtl ? "flex-end" : "flex-start" }]}>
            <View style={[styles.modeBadge, isRtl && { flexDirection: "row-reverse" }]}>
              <HugeiconsIcon icon={BookOpen02Icon} size={15} color={C.blue} strokeWidth={2.2} />
              <AppText style={styles.modeBadgeText}>TWINO READING</AppText>
            </View>
            <AppText style={[styles.title, { textAlign: isRtl ? "right" : "left" }]}>
              {t("games.paragraphSpeechTitle") || "Reading Practice"}
            </AppText>
            <AppText style={[styles.subtitle, { textAlign: isRtl ? "right" : "left" }]}>
              {isKu
                ? "دەق بخوێنەوە، دەنگت تۆمار بکە، پاشان وشە بە وشە فیدباک و خێرایی و وردی ببینە."
                : "Read a passage aloud, track your pacing, and get word-level feedback on coverage, order, and fluency."}
            </AppText>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(80).duration(360)}>
            <HomeLiquidCard contentStyle={styles.setupCard}>
              <View style={styles.settingsGroup}>
                <AppText style={[styles.label, { textAlign: isRtl ? "right" : "left" }]}>Source</AppText>
                <View style={[styles.optionRow, isRtl && styles.rowReverse]}>
                  <OptionChip label="AI passage" active={sourceMode === "ai"} onPress={() => setSourceMode("ai")} />
                  <OptionChip label="Built-in" active={sourceMode === "template"} onPress={() => setSourceMode("template")} />
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.settingsGroup}>
                <AppText style={[styles.label, { textAlign: isRtl ? "right" : "left" }]}>Difficulty</AppText>
                <View style={[styles.optionRow, isRtl && styles.rowReverse]}>
                  {DIFFICULTIES.map((item) => (
                    <OptionChip key={item} label={item} active={difficulty === item} onPress={() => setDifficulty(item)} />
                  ))}
                </View>
              </View>

              {sourceMode === "ai" ? (
                <>
                  <View style={styles.divider} />
                  <View style={styles.splitSettings}>
                    <View style={styles.settingsGroupHalf}>
                      <AppText style={[styles.label, { textAlign: isRtl ? "right" : "left" }]}>Paragraphs</AppText>
                      <View style={[styles.optionRow, isRtl && styles.rowReverse]}>
                        {[1, 2, 3].map((item) => (
                          <OptionChip key={item} label={`${item}`} active={paragraphCount === item} onPress={() => setParagraphCount(item)} />
                        ))}
                      </View>
                    </View>
                    <View style={styles.settingsGroupHalf}>
                      <AppText style={[styles.label, { textAlign: isRtl ? "right" : "left" }]}>Words</AppText>
                      <View style={[styles.optionRow, isRtl && styles.rowReverse]}>
                        {[60, 90, 130].map((item) => (
                          <OptionChip key={item} label={`${item}`} active={wordCount === item} onPress={() => setWordCount(item)} />
                        ))}
                      </View>
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.divider} />
                  <View style={styles.settingsGroup}>
                    <AppText style={[styles.label, { textAlign: isRtl ? "right" : "left" }]}>Template</AppText>
                    <View style={[styles.templateGrid, isRtl && styles.rowReverse]}>
                      {TEMPLATES[difficulty].map((template, index) => (
                        <PressableScale
                          key={template.title}
                          onPress={() => setSelectedTemplateIndex(index)}
                          style={[
                            styles.templateCard,
                            selectedTemplateIndex === index && styles.templateCardActive,
                          ]}
                        >
                          <AppText style={styles.templateTitle}>{template.title}</AppText>
                          <AppText style={styles.templateDescription}>{template.description}</AppText>
                        </PressableScale>
                      ))}
                    </View>
                  </View>
                </>
              )}

              <View style={styles.divider} />

              <View style={styles.settingsGroup}>
                <AppText style={[styles.label, { textAlign: isRtl ? "right" : "left" }]}>Teleprompter speed</AppText>
                <View style={[styles.optionRow, isRtl && styles.rowReverse]}>
                  {SPEEDS.map((item) => (
                    <OptionChip key={item} label={item} active={speed === item} onPress={() => setSpeed(item)} />
                  ))}
                </View>
              </View>
            </HomeLiquidCard>
          </Animated.View>

          <View style={styles.setupFooter}>
            <View style={[styles.practiceSummary, isRtl && styles.rowReverse]}>
              <View style={styles.summaryItem}>
                <HugeiconsIcon icon={Clock01Icon} size={16} color={C.gray} strokeWidth={2.2} />
                <AppText style={styles.summaryText}>{estimatedMinutes} min</AppText>
              </View>
              <View style={styles.summaryItem}>
                <HugeiconsIcon icon={Target02Icon} size={16} color={C.gray} strokeWidth={2.2} />
                <AppText style={styles.summaryText}>{sourceMode === "template" ? activeTemplate.title : `${wordCount} words`}</AppText>
              </View>
            </View>

            <HomeLiquidButton
              label={
                state === "generating"
                  ? "Creating passage..."
                  : sourceMode === "ai"
                    ? "Generate passage"
                    : "Preview template"
              }
              onPress={state === "generating" ? () => {} : handleBuildPractice}
            />
          </View>
        </ScrollView>

        {state === "generating" ? (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.generatingOverlay}>
            <ActivityIndicator size="large" color={C.blue} />
            <AppText style={styles.generatingText}>Creating a focused reading passage...</AppText>
          </Animated.View>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <HomeMeshBackground />
      {header}

      <View style={styles.stageHeader}>
        <View style={[styles.stageStats, isRtl && styles.rowReverse]}>
          <View style={styles.stageStat}>
            <HugeiconsIcon icon={BookOpen02Icon} size={16} color={C.blue} strokeWidth={2.2} />
            <AppText style={styles.stageStatText}>{targetWords.length} words</AppText>
          </View>
          <View style={styles.stageStat}>
            <HugeiconsIcon icon={VolumeHighIcon} size={16} color={C.blue} strokeWidth={2.2} />
            <AppText style={styles.stageStatText}>{speed}</AppText>
          </View>
        </View>
        <AppText style={[styles.stageHint, { textAlign: isRtl ? "right" : "left" }]}>
          {state === "reading"
            ? "Read with the moving text. Tap the mic when you finish."
            : state === "results"
              ? "Review your marked words, then retry the same passage or generate a new one."
              : "Preview the passage, then tap the mic to start."}
        </AppText>
      </View>

      <View
        style={styles.teleprompter}
        onLayout={(event) => setContainerHeight(event.nativeEvent.layout.height)}
      >
        {state === "reading" ? (
          <View style={styles.teleprompterMask}>
            <Animated.View
              style={[styles.passageWrap, scrollStyle]}
              onLayout={(event) => setTextHeight(event.nativeEvent.layout.height)}
            >
              {renderPassage()}
            </Animated.View>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.previewScrollContent}
          >
            <View onLayout={(event) => setTextHeight(event.nativeEvent.layout.height)}>
              {renderPassage()}
            </View>
          </ScrollView>
        )}

        <LinearGradient
          colors={["#F8FAFC", "rgba(248,250,252,0)"]}
          style={styles.gradientTop}
          pointerEvents="none"
        />
        <LinearGradient
          colors={["rgba(248,250,252,0)", "#F8FAFC"]}
          style={styles.gradientBottom}
          pointerEvents="none"
        />
      </View>

      {evaluation ? (
        <Animated.View entering={FadeInDown.duration(280)} style={styles.resultsPanel}>
          <View style={[styles.scoreHeader, isRtl && styles.rowReverse]}>
            <View style={styles.scoreCoin}>
              <AppText style={styles.scoreValue} forceLatinFont>
                {evaluation.accuracyScore}
              </AppText>
            </View>
            <View style={[styles.scoreCopy, { alignItems: isRtl ? "flex-end" : "flex-start" }]}>
              <AppText style={[styles.scoreTitle, { textAlign: isRtl ? "right" : "left" }]}>
                {evaluation.accuracyScore >= 80 ? "Strong reading" : evaluation.accuracyScore >= 60 ? "Good base" : "Needs another pass"}
              </AppText>
              <AppText style={[styles.scoreSubtitle, { textAlign: isRtl ? "right" : "left" }]}>
                Transcript: {evaluation.transcript || "No clear speech captured."}
              </AppText>
            </View>
          </View>

          <View style={styles.metricsRow}>
            <MetricCard label="Coverage" value={`${evaluation.coverageScore}%`} tone="green" />
            <MetricCard label="Order" value={`${evaluation.orderScore}%`} />
            <MetricCard label="WPM" value={`${evaluation.wpm}`} tone={evaluation.fluencyScore >= 70 ? "green" : "red"} />
          </View>

          <View style={styles.feedbackGrid}>
            <View style={styles.feedbackBlock}>
              <View style={styles.feedbackTitleRow}>
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} color="#10B981" strokeWidth={2.4} />
                <AppText style={styles.feedbackTitle}>What worked</AppText>
              </View>
              {(evaluation.strengths.length ? evaluation.strengths : ["You completed a full reading attempt."]).map((item) => (
                <AppText key={item} style={styles.feedbackText}>• {item}</AppText>
              ))}
            </View>

            <View style={styles.feedbackBlock}>
              <View style={styles.feedbackTitleRow}>
                <HugeiconsIcon icon={RefreshIcon} size={16} color={C.red} strokeWidth={2.4} />
                <AppText style={styles.feedbackTitle}>Next pass</AppText>
              </View>
              {(evaluation.nextSteps.length ? evaluation.nextSteps : ["Try the same passage again."]).map((item) => (
                <AppText key={item} style={styles.feedbackText}>• {item}</AppText>
              ))}
            </View>
          </View>
        </Animated.View>
      ) : null}

      <View style={[styles.controlDock, { paddingBottom: insets.bottom + 14 }]}>
        {state === "processing" ? (
          <View style={styles.processingPill}>
            <ActivityIndicator size="small" color={C.blue} />
            <AppText style={styles.processingText}>Scoring your reading...</AppText>
          </View>
        ) : (
          <>
            <View style={styles.micWrap}>
              <MicCaptureOrb
                listening={state === "reading"}
                onPress={handleMicPress}
                size={compact ? 78 : 90}
              />
              <View style={[styles.micCaption, state === "reading" && styles.micCaptionLive]}>
                <HugeiconsIcon icon={Mic01Icon} size={14} color={state === "reading" ? "#FFFFFF" : C.blue} strokeWidth={2.3} />
                <AppText style={[styles.micCaptionText, state === "reading" && { color: "#FFFFFF" }]}>
                  {state === "reading" ? "Stop reading" : "Start reading"}
                </AppText>
              </View>
            </View>

            <View style={styles.secondaryActions}>
              <PressableScale
                style={styles.secondaryButton}
                onPress={() => {
                  setEvaluation(null);
                  setState("preview");
                  resetScrollPosition();
                }}
              >
                <AppText style={styles.secondaryButtonText}>Retry</AppText>
              </PressableScale>
              <PressableScale style={styles.secondaryButton} onPress={handleBuildPractice}>
                <AppText style={styles.secondaryButtonText}>New passage</AppText>
              </PressableScale>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.86)",
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.08)",
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerKicker: {
    fontSize: 11,
    fontWeight: "800",
    color: C.gray,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: C.navy,
    fontFamily: "DINNextRoundedBold",
  },
  setupContent: {
    paddingHorizontal: 20,
    gap: 18,
  },
  heroBlock: {
    gap: 10,
  },
  modeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(59,130,246,0.08)",
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.16)",
  },
  modeBadgeText: {
    fontSize: 10,
    fontWeight: "900",
    color: C.blue,
    letterSpacing: 1.1,
  },
  title: {
    fontSize: 36,
    lineHeight: 39,
    fontWeight: "900",
    color: C.navy,
    fontFamily: "DINNextRoundedBold",
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: "rgba(26,43,72,0.66)",
  },
  setupCard: {
    padding: 18,
    gap: 18,
  },
  settingsGroup: {
    gap: 10,
  },
  settingsGroupHalf: {
    flex: 1,
    gap: 10,
  },
  splitSettings: {
    flexDirection: "row",
    gap: 14,
  },
  label: {
    fontSize: 11,
    fontWeight: "900",
    color: C.gray,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  optionRow: {
    flexDirection: "row",
    gap: 10,
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  optionChip: {
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.08)",
  },
  optionChipFlex: {
    flex: 1,
  },
  optionChipActive: {
    backgroundColor: C.navy,
    borderColor: C.navy,
  },
  optionChipText: {
    fontSize: 13,
    fontWeight: "900",
    color: C.navy,
    fontFamily: "DINNextRoundedBold",
  },
  optionChipTextActive: {
    color: "#FFFFFF",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(15,23,42,0.08)",
  },
  templateGrid: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  templateCard: {
    width: "48%",
    minHeight: 98,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.08)",
    justifyContent: "space-between",
  },
  templateCardActive: {
    borderColor: C.blue,
    backgroundColor: "rgba(59,130,246,0.08)",
  },
  templateTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: C.navy,
    fontFamily: "DINNextRoundedBold",
  },
  templateDescription: {
    fontSize: 12,
    lineHeight: 16,
    color: C.gray,
  },
  setupFooter: {
    gap: 14,
  },
  practiceSummary: {
    flexDirection: "row",
    gap: 10,
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.72)",
  },
  summaryText: {
    fontSize: 12,
    fontWeight: "800",
    color: C.gray,
  },
  generatingOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(248,250,252,0.86)",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  generatingText: {
    fontSize: 16,
    fontWeight: "800",
    color: C.navy,
  },
  stageHeader: {
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 10,
  },
  stageStats: {
    flexDirection: "row",
    gap: 10,
  },
  stageStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.78)",
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.06)",
  },
  stageStatText: {
    fontSize: 12,
    fontWeight: "900",
    color: C.navy,
  },
  stageHint: {
    fontSize: 13,
    lineHeight: 19,
    color: C.gray,
  },
  teleprompter: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.72)",
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.06)",
  },
  teleprompterMask: {
    flex: 1,
    overflow: "hidden",
  },
  passageWrap: {
    paddingHorizontal: 22,
    paddingVertical: 150,
  },
  previewScrollContent: {
    paddingHorizontal: 22,
    paddingVertical: 42,
  },
  passageText: {
    fontSize: 23,
    lineHeight: 35,
    color: C.navy,
    fontFamily: "DINNextRoundedBold",
  },
  passageTextCompact: {
    fontSize: 20,
    lineHeight: 31,
  },
  wordWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  wordText: {
    fontSize: 22,
    lineHeight: 34,
    fontFamily: "DINNextRoundedBold",
  },
  wordCorrect: {
    color: "#10B981",
  },
  wordMissed: {
    color: "#EF4444",
    textDecorationLine: "underline",
  },
  wordOutOfOrder: {
    color: "#F59E0B",
  },
  gradientTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 92,
  },
  gradientBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 92,
  },
  resultsPanel: {
    marginHorizontal: 20,
    marginTop: 12,
    padding: 16,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.08)",
    gap: 14,
  },
  scoreHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  scoreCoin: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.navy,
  },
  scoreValue: {
    fontSize: 23,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "DINNextRoundedBold",
  },
  scoreCopy: {
    flex: 1,
    gap: 4,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: C.navy,
    fontFamily: "DINNextRoundedBold",
  },
  scoreSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    color: C.gray,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 10,
  },
  metricCard: {
    flex: 1,
    minHeight: 72,
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "900",
    color: C.navy,
    fontFamily: "DINNextRoundedBold",
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  feedbackGrid: {
    flexDirection: "row",
    gap: 10,
  },
  feedbackBlock: {
    flex: 1,
    gap: 8,
  },
  feedbackTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  feedbackTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: C.navy,
  },
  feedbackText: {
    fontSize: 12,
    lineHeight: 17,
    color: C.gray,
  },
  controlDock: {
    minHeight: 132,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingTop: 12,
  },
  micWrap: {
    alignItems: "center",
    gap: 8,
  },
  micCaption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(59,130,246,0.09)",
  },
  micCaptionLive: {
    backgroundColor: C.red,
  },
  micCaptionText: {
    fontSize: 12,
    fontWeight: "900",
    color: C.blue,
  },
  secondaryActions: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
  },
  secondaryButton: {
    minWidth: 120,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.78)",
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.08)",
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: "900",
    color: C.navy,
  },
  processingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.88)",
  },
  processingText: {
    fontSize: 14,
    fontWeight: "900",
    color: C.navy,
  },
});
