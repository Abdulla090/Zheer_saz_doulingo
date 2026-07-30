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
} from "@hugeicons/core-free-icons";

import { PressableScale } from "../../components/animations";
import { MicCaptureOrb } from "../../components/voice/MicCaptureOrb";
import { AppText } from "../../components/ui/AppText";
import {
  HomeMeshBackground,
  HomePalette as C,
} from "../../components/ui/ios-liquid-home";
import { useSpeechCapture } from "../../hooks/use-speech-capture";
import { useGeminiVoiceCapture } from "../../hooks/use-gemini-voice-capture";
import { useSafeBack } from "../../hooks/use-safe-back";
import { useI18n } from "../../hooks/useI18n";
import { useThemeColors } from "../../hooks/useThemeColors";
import { PRIMARY_ACTION } from "../../constants/primary-action";
import {
  generateReadingPracticeParagraphs,
  evaluateParagraphSpeechWithGemini,
} from "../../services/gemini-speech-service";
import { hapticImpact } from "../../utils/haptics";
import {
  TARGET_WPM,
  analyzeReadingPassage,
  evaluateGeminiReading,
  evaluateReadingTranscript,
  getReadingTargetWords,
  mergeReadingTranscript,
  type ReadingDifficulty as Difficulty,
  type ReadingEvaluation,
} from "./reading-practice-logic";

type PracticeState = "setup" | "generating" | "preview" | "reading" | "processing" | "results";
type Speed = "Slow" | "Normal" | "Fast";
type SourceMode = "ai" | "template";

type TemplateSet = {
  title: string;
  description: string;
  paragraphs: string[];
};

const DIFFICULTIES: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];
const SPEEDS: Speed[] = ["Slow", "Normal", "Fast"];

const KURDISH_DIGITS = "٠١٢٣٤٥٦٧٨٩";

const SETUP_COPY = {
  en: {
    header: "Reading practice",
    title: "Choose your practice",
    subtitle: "Pick a level, length, and pace that feel comfortable.",
    passage: "Passage",
    generateNew: "Generate new",
    builtIn: "Built-in",
    difficulty: "Difficulty",
    difficulties: { Beginner: "Beginner", Intermediate: "Intermediate", Advanced: "Advanced" },
    paragraphs: "Paragraphs",
    words: "Words",
    template: "Template",
    speed: "Reading speed",
    speeds: { Slow: "Slow", Normal: "Normal", Fast: "Fast" },
    generate: "Generate passage",
    preview: "Preview template",
    creating: "Creating passage...",
    creatingDetail: "Creating a focused reading passage...",
  },
  ku: {
    header: "ڕاهێنانی خوێندنەوە",
    title: "ڕاهێنانەکەت هەڵبژێرە",
    subtitle: "ئاست، درێژی و خێراییەک هەڵبژێرە کە بۆ تۆ گونجاوە.",
    passage: "دەق",
    generateNew: "دەقێکی نوێ",
    builtIn: "ئامادەکراو",
    difficulty: "ئاست",
    difficulties: { Beginner: "سەرەتایی", Intermediate: "مامناوەند", Advanced: "پێشکەوتوو" },
    paragraphs: "پەرەگراف",
    words: "وشە",
    template: "دەق",
    speed: "خێرایی خوێندنەوە",
    speeds: { Slow: "هێواش", Normal: "ئاسایی", Fast: "خێرا" },
    generate: "دەق دروست بکە",
    preview: "پێشبینینی دەق",
    creating: "دەق دروست دەکرێت...",
    creatingDetail: "دەقێکی گونجاو بۆ ڕاهێنان دروست دەکرێت...",
  },
  ar: {
    header: "تدريب القراءة",
    title: "اختر تدريبك",
    subtitle: "اختر المستوى والطول والسرعة المناسبة لك.",
    passage: "النص",
    generateNew: "إنشاء جديد",
    builtIn: "نص جاهز",
    difficulty: "المستوى",
    difficulties: { Beginner: "مبتدئ", Intermediate: "متوسط", Advanced: "متقدم" },
    paragraphs: "الفقرات",
    words: "الكلمات",
    template: "النص",
    speed: "سرعة القراءة",
    speeds: { Slow: "بطيئة", Normal: "متوسطة", Fast: "سريعة" },
    generate: "إنشاء النص",
    preview: "معاينة النص",
    creating: "جارٍ إنشاء النص...",
    creatingDetail: "جارٍ إنشاء نص مناسب للتدريب...",
  },
} as const;

const KURDISH_TEMPLATE_COPY: Record<string, { title: string; description: string }> = {
  "Morning Market": { title: "بازاڕی بەیانی", description: "وشەی ڕۆژانە و ڕستەی کورت و ڕوون." },
  "A Good Friend": { title: "هاوڕێیەکی باش", description: "چیرۆکێکی سادە بۆ زیادکردنی متمانە." },
  "Learning Languages": { title: "فێربوونی زمانەکان", description: "وشەی مامناوەند و بیرۆکەی پەیوەست." },
  "Smart Devices": { title: "ئامێرە زیرەکەکان", description: "بابەتێکی نوێ لەگەڵ وشەی جۆراوجۆر." },
  "The Art of Focus": { title: "هونەری سەرنجدان", description: "ڕستەی درێژتر و دەربڕینی ئەکادیمی." },
  "Sustainable Cities": { title: "شارە بەردەوامەکان", description: "وشەی پێشکەوتوو و ڕستەی ئاڵۆزتر." },
};

function formatUiNumber(value: number, useKurdishDigits: boolean) {
  const text = String(value);
  if (!useKurdishDigits) return text;
  return text.replace(/\d/g, (digit) => KURDISH_DIGITS[Number(digit)]);
}

const MAX_READING_SECONDS = 120;
const SPEED_RATE: Record<Speed, number> = {
  Slow: 0.8,
  Normal: 1,
  Fast: 1.2,
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

function OptionChip({
  label,
  active,
  onPress,
  flex = true,
  languageCode = "en",
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  flex?: boolean;
  languageCode?: string;
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
        languageCode={languageCode}
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
  const safeBack = useSafeBack("/(tabs)/play");
  const { width, height } = useWindowDimensions();
  const { locale, isKu, isAr } = useI18n();
  const { colors, isDark } = useThemeColors();
  const styles = useReadingStyles();
  const isRtl = isKu || isAr;
  const setupCopy = isKu ? SETUP_COPY.ku : isAr ? SETUP_COPY.ar : SETUP_COPY.en;
  const formatNumber = (value: number) => formatUiNumber(value, isKu);
  const speech = useSpeechCapture("en-US");
  const geminiCapture = useGeminiVoiceCapture();
  const abortSpeech = speech.abort;
  const abortGeminiCapture = geminiCapture.abort;
  const [state, setState] = useState<PracticeState>("setup");
  const [sourceMode, setSourceMode] = useState<SourceMode>("ai");
  const [difficulty, setDifficulty] = useState<Difficulty>("Intermediate");
  const [paragraphCount, setParagraphCount] = useState(1);
  const [wordCount, setWordCount] = useState(130);
  const [speed, setSpeed] = useState<Speed>("Normal");
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<ReadingEvaluation | null>(null);
  const [textHeight, setTextHeight] = useState(160);
  const [secondsRemaining, setSecondsRemaining] = useState(MAX_READING_SECONDS);

  const transcriptRef = useRef("");
  const finalTranscriptRef = useRef("");
  const startedAtRef = useRef(0);
  const captureBackendRef = useRef<"speech" | "gemini" | null>(null);
  const stoppingRef = useRef(false);
  const autoStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clockTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollY = useSharedValue(0);

  const compact = width < 430;
  const readingViewportHeight = Math.max(
    compact ? 420 : 460,
    Math.min(640, height - insets.top - insets.bottom - (compact ? 205 : 240)),
  );
  const targetWords = useMemo(() => getReadingTargetWords(paragraphs), [paragraphs]);
  const passageStats = useMemo(() => analyzeReadingPassage(paragraphs), [paragraphs]);
  const requestedWords = sourceMode === "ai" ? wordCount : targetWords.length;
  const estimatedMinutes = Math.min(
    2,
    Math.max(1, Math.ceil(Math.max(targetWords.length, requestedWords) / TARGET_WPM[difficulty])),
  );
  const activeTemplate = TEMPLATES[difficulty][selectedTemplateIndex] ?? TEMPLATES[difficulty][0];
  const activeTemplateCopy = isKu
    ? KURDISH_TEMPLATE_COPY[activeTemplate.title] ?? activeTemplate
    : activeTemplate;

  const clearReadingTimers = useCallback(() => {
    if (autoStopTimerRef.current) {
      clearTimeout(autoStopTimerRef.current);
      autoStopTimerRef.current = null;
    }
    if (clockTimerRef.current) {
      clearInterval(clockTimerRef.current);
      clockTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearReadingTimers();
      abortSpeech();
      void abortGeminiCapture();
    };
  }, [abortGeminiCapture, abortSpeech, clearReadingTimers]);

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
      clearReadingTimers();
      speech.abort();
      void geminiCapture.abort();
      cancelAnimation(scrollY);
      captureBackendRef.current = null;
      setState("setup");
      return;
    }
    safeBack();
  }, [clearReadingTimers, geminiCapture, safeBack, scrollY, speech, state]);

  const loadTemplate = useCallback(() => {
    const selected = TEMPLATES[difficulty][selectedTemplateIndex] ?? TEMPLATES[difficulty][0];
    setParagraphs(selected.paragraphs);
    setEvaluation(null);
    setGenerationError(null);
    setState("preview");
    hapticImpact();
  }, [difficulty, selectedTemplateIndex]);

  const generatePassage = useCallback(async () => {
    setState("generating");
    setEvaluation(null);
    setGenerationError(null);
    try {
      const wordsPerParagraph = Math.max(30, Math.ceil(wordCount / paragraphCount));
      const generated = await generateReadingPracticeParagraphs(
        difficulty,
        paragraphCount,
        wordsPerParagraph,
      );
      setParagraphs(generated.filter(Boolean));
      setState("preview");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not generate a passage. Please try again.";
      setParagraphs([]);
      setGenerationError(message);
      setState("setup");
    }
  }, [difficulty, paragraphCount, wordCount]);

  const handleBuildPractice = useCallback(() => {
    if (sourceMode === "ai") void generatePassage();
    else loadTemplate();
  }, [generatePassage, loadTemplate, sourceMode]);

  const stopReading = useCallback(async () => {
    const backend = captureBackendRef.current;
    if (!backend || stoppingRef.current) return;
    stoppingRef.current = true;
    clearReadingTimers();
    setState("processing");
    cancelAnimation(scrollY);
    const durationSeconds = Math.max(
      1,
      Math.min(MAX_READING_SECONDS, Math.round((Date.now() - startedAtRef.current) / 1000)),
    );

    try {
      if (backend === "gemini") {
        try {
          const audio = await geminiCapture.stopAndGetAudio();
          if (audio?.base64) {
            const geminiResult = await evaluateParagraphSpeechWithGemini(
              audio.base64,
              audio.mimeType,
              paragraphs,
            );
            setEvaluation(evaluateGeminiReading({
              transcript: geminiResult.transcript,
              pronunciationScore: geminiResult.accuracyScore,
              wordAnalysis: geminiResult.wordAnalysis,
              paragraphs,
              difficulty,
              durationSeconds,
            }));
          } else {
            throw new Error("No audio was captured.");
          }
        } catch (err) {
          console.warn("Reading audio evaluation failed; showing captured transcript result.", err);
          setEvaluation(evaluateReadingTranscript(
            transcriptRef.current,
            paragraphs,
            difficulty,
            durationSeconds,
          ));
        }
      } else {
        speech.stop();
        setEvaluation(evaluateReadingTranscript(
          transcriptRef.current,
          paragraphs,
          difficulty,
          durationSeconds,
        ));
      }
    } finally {
      captureBackendRef.current = null;
      stoppingRef.current = false;
      setState("results");
    }
  }, [clearReadingTimers, difficulty, geminiCapture, paragraphs, scrollY, speech]);

  const startReading = useCallback(async () => {
    if (paragraphs.length === 0) return;
    clearReadingTimers();
    stoppingRef.current = false;
    transcriptRef.current = "";
    finalTranscriptRef.current = "";
    captureBackendRef.current = null;
    setSecondsRemaining(MAX_READING_SECONDS);
    setEvaluation(null);
    resetScrollPosition();

    const start = Math.max(80, readingViewportHeight - 180);
    const expectedDurationMs =
      (Math.max(1, targetWords.length) / (TARGET_WPM[difficulty] * SPEED_RATE[speed])) * 60_000;
    const duration = Math.min(
      MAX_READING_SECONDS * 1000,
      Math.max(20_000, Math.round(expectedDurationMs)),
    );

    let started = false;

    if (speech.available) {
      started = await speech.start({
        onResult: (text, isFinal) => {
          if (isFinal) {
            finalTranscriptRef.current = mergeReadingTranscript(
              finalTranscriptRef.current,
              text,
            );
            transcriptRef.current = finalTranscriptRef.current;
          } else {
            transcriptRef.current = mergeReadingTranscript(finalTranscriptRef.current, text);
          }
        },
        onEnd: () => {
          if (!stoppingRef.current && captureBackendRef.current === "speech") {
            void stopReading();
          }
        },
        onError: () => {
          if (!stoppingRef.current) void stopReading();
        },
      }, {
        continuous: true,
        contextualStrings: [...new Set(targetWords.map((word) => word.normalized))].slice(0, 100),
      });
      if (started) captureBackendRef.current = "speech";
    }

    if (!started && geminiCapture.available) {
      started = await geminiCapture.start({
        onResult: () => {
          // Gemini evaluates on stop, not during recording
        },
        onError: (message) => {
          console.warn("Gemini recording error:", message);
        },
      });
      if (started) captureBackendRef.current = "gemini";
    }

    if (!started) {
      captureBackendRef.current = null;
      setState("preview");
      return;
    }

    startedAtRef.current = Date.now();
    setState("reading");
    clockTimerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAtRef.current) / 1000);
      setSecondsRemaining(Math.max(0, MAX_READING_SECONDS - elapsed));
    }, 1000);
    autoStopTimerRef.current = setTimeout(() => {
      void stopReading();
    }, MAX_READING_SECONDS * 1000);

    scrollY.value = start;
    scrollY.value = withTiming(-textHeight - 80, {
      duration,
      easing: Easing.linear,
    });
    hapticImpact();
  }, [
    clearReadingTimers,
    difficulty,
    geminiCapture,
    paragraphs.length,
    readingViewportHeight,
    resetScrollPosition,
    scrollY,
    speed,
    speech,
    stopReading,
    targetWords,
    textHeight,
  ]);

  function handleMicPress() {
    if (state === "reading") void stopReading();
    else if (state === "preview" || state === "results") void startReading();
  }

  const teleprompterTextStyle = useMemo(
    () => [
      styles.passageText,
      compact && styles.passageTextCompact,
    ],
    [compact, styles.passageText, styles.passageTextCompact],
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
              languageCode="en"
              align="start"
              fullWidth
            >
              {item.text}
            </AppText>
          ))}
        </View>
      );
    }

    return (
      <View style={[styles.wordWrap, { direction: "ltr" }]}>
        {evaluation.wordResults.map((item, index) => (
          <AppText
            key={`${item.word}-${index}`}
            style={[
              styles.wordText,
              item.spoken ? styles.wordCorrect : styles.wordMissed,
              item.spoken && !item.orderCorrect && styles.wordOutOfOrder,
            ]}
            forceLatinFont
            languageCode="en"
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
      <View style={styles.headerTitleWrap}>
        <AppText
          style={[
            styles.headerTitle,
            { direction: isRtl ? "rtl" : "ltr", textAlign: isRtl ? "right" : "left" },
          ]}
          languageCode={locale}
          align="start"
          fullWidth
          latinRole="bold"
        >
          {setupCopy.header}
        </AppText>
      </View>
    </View>
  );

  if (state === "setup" || state === "generating") {
    return (
      <View style={[styles.root, styles.setupRoot]}>
        {header}

        <ScrollView
          contentContainerStyle={[styles.setupContent, { paddingBottom: insets.bottom + 42 }]}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(280)} style={[styles.heroBlock, { alignItems: isRtl ? "flex-end" : "flex-start" }]}>
            <AppText
              style={[
                styles.title,
                { direction: isRtl ? "rtl" : "ltr", textAlign: isRtl ? "right" : "left" },
              ]}
              languageCode={locale}
              align="start"
              fullWidth
              latinRole="bold"
            >
              {setupCopy.title}
            </AppText>
            <AppText
              style={[
                styles.subtitle,
                { direction: isRtl ? "rtl" : "ltr", textAlign: isRtl ? "right" : "left" },
              ]}
              languageCode={locale}
              align="start"
              fullWidth
            >
              {setupCopy.subtitle}
            </AppText>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(60).duration(280)} style={styles.setupCard}>
              <View style={styles.settingsGroup}>
                <AppText style={[styles.label, { textAlign: isRtl ? "right" : "left" }]} languageCode={locale}>{setupCopy.passage}</AppText>
                <View style={[styles.optionRow, isRtl && styles.rowReverse]}>
                  <OptionChip label={setupCopy.generateNew} languageCode={locale} active={sourceMode === "ai"} onPress={() => setSourceMode("ai")} />
                  <OptionChip label={setupCopy.builtIn} languageCode={locale} active={sourceMode === "template"} onPress={() => setSourceMode("template")} />
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.settingsGroup}>
                <AppText style={[styles.label, { textAlign: isRtl ? "right" : "left" }]} languageCode={locale}>{setupCopy.difficulty}</AppText>
                <View style={[styles.optionRow, isRtl && styles.rowReverse]}>
                  {DIFFICULTIES.map((item) => (
                    <OptionChip key={item} label={setupCopy.difficulties[item]} languageCode={locale} active={difficulty === item} onPress={() => setDifficulty(item)} />
                  ))}
                </View>
              </View>

              {sourceMode === "ai" ? (
                <>
                  <View style={styles.divider} />
                  <View style={styles.splitSettings}>
                    <View style={styles.settingsGroupHalf}>
                      <AppText style={[styles.label, { textAlign: isRtl ? "right" : "left" }]} languageCode={locale}>{setupCopy.paragraphs}</AppText>
                      <View style={[styles.optionRow, isRtl && styles.rowReverse]}>
                        {[1, 2, 3].map((item) => (
                          <OptionChip key={item} label={formatNumber(item)} languageCode={locale} active={paragraphCount === item} onPress={() => setParagraphCount(item)} />
                        ))}
                      </View>
                    </View>
                    <View style={styles.settingsGroupHalf}>
                      <AppText style={[styles.label, { textAlign: isRtl ? "right" : "left" }]} languageCode={locale}>{setupCopy.words}</AppText>
                      <View style={[styles.optionRow, isRtl && styles.rowReverse]}>
                        {[90, 130, 180].map((item) => (
                          <OptionChip key={item} label={formatNumber(item)} languageCode={locale} active={wordCount === item} onPress={() => setWordCount(item)} />
                        ))}
                      </View>
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.divider} />
                  <View style={styles.settingsGroup}>
                    <AppText style={[styles.label, { textAlign: isRtl ? "right" : "left" }]} languageCode={locale}>{setupCopy.template}</AppText>
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
                          <AppText style={styles.templateTitle} languageCode={isKu ? "ku" : "en"}>
                            {isKu ? KURDISH_TEMPLATE_COPY[template.title]?.title ?? template.title : template.title}
                          </AppText>
                          <AppText style={styles.templateDescription} languageCode={isKu ? "ku" : "en"}>
                            {isKu ? KURDISH_TEMPLATE_COPY[template.title]?.description ?? template.description : template.description}
                          </AppText>
                        </PressableScale>
                      ))}
                    </View>
                  </View>
                </>
              )}

              <View style={styles.divider} />

              <View style={styles.settingsGroup}>
                <AppText style={[styles.label, { textAlign: isRtl ? "right" : "left" }]} languageCode={locale}>{setupCopy.speed}</AppText>
                <View style={[styles.optionRow, isRtl && styles.rowReverse]}>
                  {SPEEDS.map((item) => (
                    <OptionChip key={item} label={setupCopy.speeds[item]} languageCode={locale} active={speed === item} onPress={() => setSpeed(item)} />
                  ))}
                </View>
              </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(100).duration(280)} style={styles.setupFooter}>
            <AppText style={styles.summaryText} languageCode={locale}>
              {isKu
                ? `نزیکەی ${formatNumber(estimatedMinutes)} خولەک  ·  ${sourceMode === "template" ? activeTemplateCopy.title : `${formatNumber(wordCount)} وشە`}`
                : isAr
                  ? `حوالي ${estimatedMinutes} د  ·  ${sourceMode === "template" ? activeTemplate.title : `${wordCount} كلمة`}`
                  : `About ${estimatedMinutes} min  ·  ${sourceMode === "template" ? activeTemplate.title : `${wordCount} words`}`}
            </AppText>
          </Animated.View>

          <View style={styles.actionArea}>
            {sourceMode === "ai" && generationError ? (
              <AppText
                style={[styles.generationErrorText, { textAlign: isRtl ? "right" : "left" }]}
                languageCode={locale}
                fullWidth
              >
                {generationError}
              </AppText>
            ) : null}

            <PressableScale
              style={styles.primaryButton}
              onPress={state === "generating" ? () => {} : handleBuildPractice}
              scaleDown={0.98}
            >
              <AppText style={styles.primaryButtonText} languageCode={locale}>
                {state === "generating"
                  ? setupCopy.creating
                  : sourceMode === "ai"
                    ? setupCopy.generate
                    : setupCopy.preview}
              </AppText>
              <HugeiconsIcon
                icon={isRtl ? ArrowLeft01Icon : ArrowRight01Icon}
                size={20}
                color="#FFFFFF"
                strokeWidth={2.5}
              />
            </PressableScale>
          </View>
        </ScrollView>

        {state === "generating" ? (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.generatingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
            <AppText style={styles.generatingText} languageCode={locale}>{setupCopy.creatingDetail}</AppText>
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
              <AppText style={styles.stageStatText}>{passageStats.wordCount} words</AppText>
            </View>
            <View style={styles.stageStat}>
              <HugeiconsIcon icon={Target02Icon} size={16} color={C.blue} strokeWidth={2.2} />
              <AppText style={styles.stageStatText}>{passageStats.sentenceCount} sentences</AppText>
            </View>
            <View style={styles.stageStat}>
              <HugeiconsIcon icon={Clock01Icon} size={16} color={C.blue} strokeWidth={2.2} />
              <AppText style={styles.stageStatText} forceLatinFont>
                {state === "reading"
                  ? `${Math.floor(secondsRemaining / 60)}:${String(secondsRemaining % 60).padStart(2, "0")}`
                  : "2:00 max"}
              </AppText>
            </View>
          </View>
          <AppText style={[styles.stageHint, { textAlign: isRtl ? "right" : "left" }]}>
            {state === "reading"
              ? "Read continuously. Tap the mic when finished, or scoring starts automatically at 2:00."
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
                <AppText
                  style={styles.scoreSubtitle}
                  languageCode="en"
                  align="start"
                  fullWidth
                  forceLatinFont
                >
                  Transcript: {evaluation.transcript || "No clear speech captured."}
                </AppText>
              </View>
            </View>

            <View style={styles.metricsRow}>
              <MetricCard label="Coverage" value={`${evaluation.coverageScore}%`} tone="green" />
              <MetricCard label="Correct" value={`${evaluation.correctWords}/${evaluation.totalWords}`} tone="green" />
              <MetricCard label="Sentences" value={`${evaluation.correctSentences}/${evaluation.totalSentences}`} />
              <MetricCard label="WPM" value={`${evaluation.wpm}`} tone={evaluation.fluencyScore >= 70 ? "green" : "red"} />
              <MetricCard label="Time" value={`${evaluation.durationSeconds}s`} />
            </View>

            <View style={styles.sentenceBreakdown}>
              <AppText
                style={styles.sentenceBreakdownTitle}
                languageCode={locale}
                align="start"
                fullWidth
              >
                {isKu ? "هەڵسەنگاندنی ڕستەکان" : "Sentence check"}
              </AppText>
              {evaluation.sentenceResults.map((sentence, index) => (
                <View
                  key={`${sentence.sentence}-${index}`}
                  style={[styles.sentenceResult, { direction: "ltr" }]}
                >
                  <View
                    style={[
                      styles.sentenceNumber,
                      sentence.correct
                        ? styles.sentenceNumberCorrect
                        : styles.sentenceNumberNeedsWork,
                    ]}
                  >
                    <AppText style={styles.sentenceNumberText} forceLatinFont>
                      {index + 1}
                    </AppText>
                  </View>
                  <AppText
                    style={styles.sentenceResultText}
                    languageCode="en"
                    align="start"
                    forceLatinFont
                  >
                    {sentence.sentence}
                  </AppText>
                  <AppText
                    style={[
                      styles.sentenceResultScore,
                      { color: sentence.correct ? "#10B981" : C.red },
                    ]}
                    forceLatinFont
                  >
                    {sentence.score}%
                  </AppText>
                </View>
              ))}
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
        <LinearGradient
          colors={[
            "rgba(248,250,252,0)",
            "rgba(248,250,252,0.82)",
            "#F8FAFC",
          ]}
          locations={[0, 0.38, 1]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
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
              {state !== "reading" && (speech.error || geminiCapture.error) ? (
                <AppText style={styles.captureErrorText}>
                  {speech.error || geminiCapture.error}
                </AppText>
              ) : null}
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
  setupRoot: {
    backgroundColor: colors.background,
  },
  header: {
    width: "100%",
    maxWidth: 800,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingBottom: 4,
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.foreground,
    fontFamily: "DINNextRoundedBold",
  },
  setupContent: {
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
    paddingHorizontal: 20,
    gap: 16,
  },
  heroBlock: {
    gap: 4,
    paddingTop: 4,
  },
  title: {
    fontSize: 26,
    lineHeight: 31,
    fontWeight: "900",
    color: colors.foreground,
    fontFamily: "DINNextRoundedBold",
  },
  subtitle: {
    maxWidth: 560,
    fontSize: 13,
    lineHeight: 19,
    color: colors.mutedForeground,
  },
  setupCard: {
    padding: 16,
    gap: 16,
    borderRadius: 20,
    borderCurve: "continuous",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingsGroup: {
    gap: 8,
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
    fontSize: 13,
    fontWeight: "900",
    color: colors.foreground,
  },
  optionRow: {
    flexDirection: "row",
    gap: 4,
    padding: 4,
    borderRadius: 14,
    borderCurve: "continuous",
    backgroundColor: colors.muted,
  },
  rowReverse: {
    flexDirection: "row-reverse",
  },
  optionChip: {
    minHeight: 44,
    minWidth: 0,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 11,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  optionChipFlex: {
    flex: 1,
    flexBasis: 0,
  },
  optionChipActive: {
    backgroundColor: colors.surfaceRaised,
    boxShadow: isDark
      ? "0 1px 3px rgba(0, 0, 0, 0.28)"
      : "0 1px 3px rgba(15, 23, 42, 0.12)",
  },
  optionChipText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
    color: colors.mutedForeground,
    fontFamily: "DINNextRoundedBold",
    textAlign: "center",
  },
  optionChipTextActive: {
    color: colors.primary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
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
    borderColor: colors.border,
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
    alignItems: "center",
  },
  summaryText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.mutedForeground,
    textAlign: "center",
  },
  actionArea: {
    gap: 12,
  },
  primaryButton: {
    height: PRIMARY_ACTION.height,
    paddingHorizontal: 20,
    borderRadius: PRIMARY_ACTION.radius,
    borderCurve: "continuous",
    backgroundColor: PRIMARY_ACTION.face,
    borderBottomWidth: PRIMARY_ACTION.rimWidth,
    borderBottomColor: PRIMARY_ACTION.rim,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: "DINNextRoundedBold",
  },
  generatingOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: isDark ? "rgba(15,23,42,0.9)" : "rgba(248,250,252,0.86)",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  generatingText: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.foreground,
  },
  generationErrorText: {
    fontSize: 13,
    lineHeight: 19,
    color: C.red,
    fontWeight: "700",
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
    borderColor: colors.border,
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
    borderColor: colors.border,
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
    borderColor: colors.border,
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
    fontSize: 11,
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
  sentenceBreakdown: {
    gap: 8,
  },
  sentenceBreakdownTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.foreground,
  },
  sentenceResult: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: colors.background,
  },
  sentenceNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  sentenceNumberCorrect: {
    backgroundColor: "rgba(16,185,129,0.14)",
  },
  sentenceNumberNeedsWork: {
    backgroundColor: "rgba(239,68,68,0.12)",
  },
  sentenceNumberText: {
    fontSize: 12,
    fontWeight: "900",
    color: colors.foreground,
  },
  sentenceResultText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: colors.foreground,
  },
  sentenceResultScore: {
    minWidth: 38,
    fontSize: 12,
    fontWeight: "900",
    textAlign: "right",
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
    backgroundColor: "transparent",
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
  captureErrorText: {
    maxWidth: 260,
    color: C.red,
    fontSize: 11,
    lineHeight: 15,
    textAlign: "center",
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
    borderColor: colors.border,
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
