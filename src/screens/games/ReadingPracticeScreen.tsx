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
import { useThemeColors } from "../../hooks/useThemeColors";
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
        "This morning, I went to the market with my brother. We bought fresh bread, red apples, and cold water.\nThe shopkeeper was kind and smiled at us. He asked if we needed anything else.\nAfter that, we walked home slowly and talked about our plans for the day.",
      ],
    },
    {
      title: "A Good Friend",
      description: "Warm beginner story for confidence.",
      paragraphs: [
        "My best friend is very helpful. She listens when I have a problem and gives me good advice.\nWe study English together after school. Sometimes we make mistakes, but we laugh and try again.\nLearning is easier with a good friend. I am lucky to have her in my life.",
      ],
    },
  ],
  Intermediate: [
    {
      title: "Learning Languages",
      description: "Balanced vocabulary and connected ideas.",
      paragraphs: [
        "Learning a new language opens many opportunities in life. It helps you connect with people from different countries and understand their culture more deeply.\nThe process takes time, but daily speaking practice builds confidence. Listening to native speakers also helps improve your accent and rhythm.\nWith patience and consistency, new vocabulary becomes easier to remember and use in real conversations.",
      ],
    },
    {
      title: "Smart Devices",
      description: "Modern topic with natural pronunciation challenges.",
      paragraphs: [
        "Technology is changing the way we learn, communicate, and work. With smartphones, tablets, and artificial intelligence, students can practice English almost anywhere.\nThese tools provide quick feedback and personalized exercises. Many apps use speech recognition to help learners improve pronunciation.\nHowever, real progress still depends on focus, repetition, and genuine curiosity about the language.",
      ],
    },
  ],
  Advanced: [
    {
      title: "The Art of Focus",
      description: "Longer rhythm with academic phrasing.",
      paragraphs: [
        "Consistency is the foundation of mastering any complex intellectual skill. Without a structured approach, even talented individuals struggle to reach their full potential.\nBy dedicating focused time to active reading and pronunciation practice, learners create measurable progress. Eliminating distractions allows the brain to build stronger neural patterns.\nOver time, these habits compound into fluency, enabling speakers to respond more naturally and confidently under pressure.",
      ],
    },
    {
      title: "Sustainable Cities",
      description: "Advanced vocabulary with longer clauses.",
      paragraphs: [
        "Urban sustainability requires more than modern buildings and efficient transportation. It demands a holistic rethinking of how communities interact with their environment.\nCities must protect public spaces, reduce waste, and design neighborhoods where people can live safely without depending on long daily commutes.\nThese choices shape health, opportunity, and the environment for generations to come, making urban planning one of the most consequential fields of the twenty-first century.",
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
  const styles = useReadingStyles();
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
  const styles = useReadingStyles();
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
  const { width, height } = useWindowDimensions();
  const { t, isKu, isAr } = useI18n();
  const { colors, isDark } = useThemeColors();
  const styles = useReadingStyles();
  const isRtl = isKu || isAr;
  const speech = useSpeechCapture("en-US");

  const [state, setState] = useState<PracticeState>("setup");
  const [sourceMode, setSourceMode] = useState<SourceMode>("ai");
  const [difficulty, setDifficulty] = useState<Difficulty>("Intermediate");
  const [paragraphCount, setParagraphCount] = useState(1);
  const [wordCount, setWordCount] = useState(130);
  const [speed, setSpeed] = useState<Speed>("Normal");
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [evaluation, setEvaluation] = useState<ReadingEvaluation | null>(null);
  const [textHeight, setTextHeight] = useState(160);

  const transcriptRef = useRef("");
  const startedAtRef = useRef(0);
  const scrollY = useSharedValue(0);

  const compact = width < 430;
  const readingViewportHeight = Math.max(
    compact ? 420 : 460,
    Math.min(640, height - insets.top - insets.bottom - (compact ? 205 : 240)),
  );
  const targetWords = useMemo(() => getTargetWords(paragraphs), [paragraphs]);
  const requestedWords = sourceMode === "ai" ? paragraphCount * wordCount : targetWords.length;
  const estimatedMinutes = Math.max(1, Math.ceil(Math.max(targetWords.length, requestedWords) / TARGET_WPM[difficulty]));
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
    const start = Math.max(80, readingViewportHeight - 180);
    scrollY.value = start;
  }, [readingViewportHeight, scrollY]);

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

    const start = Math.max(80, readingViewportHeight - 180);
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
      const subParagraphs = paragraphs.flatMap((p, pIdx) => {
        const subs = p.split(/\n+/).filter(Boolean);
        return subs.map((sub, sIdx) => ({
          key: `${pIdx}-${sIdx}`,
          text: sub.trim(),
          isLastInParagraph: sIdx === subs.length - 1 && pIdx < paragraphs.length - 1,
        }));
      });

      return (
        <View>
          {subParagraphs.map((item) => (
            <AppText
              key={item.key}
              style={[
                teleprompterTextStyle,
                { marginBottom: item.isLastInParagraph ? 22 : 14 },
              ]}
              forceLatinFont
            >
              {item.text}
            </AppText>
          ))}
        </View>
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
    <View style={[styles.header, { paddingTop: insets.top + 12, flexDirection: "row" }]}>
      <Pressable style={styles.backButton} onPress={handleBack}>
        <HugeiconsIcon icon={isRtl ? ArrowRight01Icon : ArrowLeft01Icon} size={22} color={colors.foreground} strokeWidth={2.4} />
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
        {!isDark && <HomeMeshBackground />}
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
                        {[90, 130, 180].map((item) => (
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
                <HugeiconsIcon icon={Clock01Icon} size={16} color={colors.mutedForeground} strokeWidth={2.2} />
                <AppText style={styles.summaryText}>{estimatedMinutes} min</AppText>
              </View>
              <View style={styles.summaryItem}>
                <HugeiconsIcon icon={Target02Icon} size={16} color={colors.mutedForeground} strokeWidth={2.2} />
                <AppText style={styles.summaryText}>{sourceMode === "template" ? activeTemplate.title : `${paragraphCount * wordCount} words`}</AppText>
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
      {!isDark && <HomeMeshBackground />}
      {header}

      <ScrollView
        style={styles.practiceScroll}
        contentContainerStyle={[
          styles.practiceScrollContent,
          { paddingBottom: insets.bottom + (compact ? 158 : 184) },
        ]}
        showsVerticalScrollIndicator={false}
      >
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
                : "Preview the full passage, then tap the mic to start."}
          </AppText>
        </View>

        <View
          style={[
            styles.teleprompter,
            compact && styles.teleprompterCompact,
            state === "reading" && { height: readingViewportHeight },
            state !== "reading" && styles.teleprompterPreview,
          ]}
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
            <View
              style={styles.previewScrollContent}
              onLayout={(event) => setTextHeight(event.nativeEvent.layout.height)}
            >
              {renderPassage()}
            </View>
          )}

          {state === "reading" ? (
            <>
              <LinearGradient
                colors={isDark ? [colors.background, "rgba(15,23,42,0)"] : ["#F8FAFC", "rgba(248,250,252,0)"]}
                style={styles.gradientTop}
                pointerEvents="none"
              />
              <LinearGradient
                colors={isDark ? ["rgba(15,23,42,0)", colors.background] : ["rgba(248,250,252,0)", "#F8FAFC"]}
                style={styles.gradientBottom}
                pointerEvents="none"
              />
            </>
          ) : null}
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
      </ScrollView>

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
                size={compact ? 66 : 78}
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

function useReadingStyles() {
  const { colors, isDark } = useThemeColors();
  return useMemo(() => createStyles(colors, isDark), [colors, isDark]);
}

function createStyles(colors: any, isDark: boolean) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
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
    backgroundColor: isDark ? colors.surfaceRaised : "rgba(255,255,255,0.86)",
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerKicker: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.mutedForeground,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: colors.foreground,
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
    color: colors.foreground,
    fontFamily: "DINNextRoundedBold",
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: "rgba(26,43,72,0.66)",
  },
  setupCard: {
    padding: 16,
    gap: 18,
  },
  settingsGroup: {
    gap: 10,
  },
  settingsGroupHalf: {
    flexGrow: 1,
    flexBasis: 148,
    gap: 10,
  },
  splitSettings: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  label: {
    fontSize: 11,
    fontWeight: "900",
    color: colors.mutedForeground,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  optionChip: {
    minHeight: 48,
    minWidth: 74,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.08)",
  },
  optionChipFlex: {
    flexGrow: 1,
    flexBasis: 96,
  },
  optionChipActive: {
    backgroundColor: isDark ? colors.primary : C.navy,
    borderColor: isDark ? colors.primary : C.navy,
  },
  optionChipText: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "900",
    color: colors.foreground,
    fontFamily: "DINNextRoundedBold",
    textAlign: "center",
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
    flexGrow: 1,
    flexBasis: 150,
    minHeight: 98,
    padding: 14,
    borderRadius: 18,
    backgroundColor: colors.surface,
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
    color: colors.foreground,
    fontFamily: "DINNextRoundedBold",
  },
  templateDescription: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.mutedForeground,
  },
  setupFooter: {
    gap: 14,
  },
  practiceSummary: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: isDark ? colors.surface : "rgba(255,255,255,0.72)",
  },
  summaryText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.mutedForeground,
    flexShrink: 1,
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
    color: colors.foreground,
  },
  practiceScroll: {
    flex: 1,
  },
  practiceScrollContent: {
    gap: 12,
  },
  stageHeader: {
    paddingHorizontal: 20,
    gap: 10,
  },
  stageStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  stageStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: isDark ? colors.surface : "rgba(255,255,255,0.78)",
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.06)",
  },
  stageStatText: {
    fontSize: 12,
    fontWeight: "900",
    color: colors.foreground,
  },
  stageHint: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.mutedForeground,
  },
  teleprompter: {
    marginHorizontal: 20,
    minHeight: 430,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: isDark ? colors.surface : "rgba(255,255,255,0.72)",
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.06)",
  },
  teleprompterPreview: {
    minHeight: 0,
    overflow: "visible",
  },
  teleprompterCompact: {
    minHeight: 470,
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
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  passageText: {
    fontSize: 22,
    lineHeight: 34,
    color: colors.foreground,
    fontFamily: "DINNextRoundedBold",
  },
  passageTextCompact: {
    fontSize: 20,
    lineHeight: 29,
  },
  wordWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 2,
  },
  wordText: {
    fontSize: 20,
    lineHeight: 32,
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
    padding: 16,
    borderRadius: 26,
    backgroundColor: isDark ? colors.surfaceRaised : "rgba(255,255,255,0.9)",
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
    backgroundColor: isDark ? colors.primary : C.navy,
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
    color: colors.foreground,
    fontFamily: "DINNextRoundedBold",
  },
  scoreSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.mutedForeground,
  },
  metricsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metricCard: {
    flexGrow: 1,
    flexBasis: 96,
    minHeight: 72,
    borderRadius: 18,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.foreground,
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
    flexWrap: "wrap",
    gap: 10,
  },
  feedbackBlock: {
    flexGrow: 1,
    flexBasis: 150,
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
    color: colors.foreground,
  },
  feedbackText: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.mutedForeground,
  },
  controlDock: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 118,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingTop: 8,
    backgroundColor: "rgba(248,250,252,0.94)",
    borderTopWidth: 1,
    borderTopColor: "rgba(15,23,42,0.06)",
  },
  micWrap: {
    alignItems: "center",
    gap: 5,
  },
  micCaption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "rgba(59,130,246,0.09)",
  },
  micCaptionLive: {
    backgroundColor: C.red,
  },
  micCaptionText: {
    fontSize: 11,
    fontWeight: "900",
    color: C.blue,
  },
  secondaryActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
  },
  secondaryButton: {
    minWidth: 106,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: isDark ? colors.surface : "rgba(255,255,255,0.78)",
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.08)",
  },
  secondaryButtonText: {
    fontSize: 12,
    fontWeight: "900",
    color: colors.foreground,
  },
  processingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: isDark ? colors.surfaceRaised : "rgba(255,255,255,0.88)",
  },
  processingText: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.foreground,
  },
  });
}
