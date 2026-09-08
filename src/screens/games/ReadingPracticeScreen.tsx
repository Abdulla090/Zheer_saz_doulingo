import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
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
import { router } from "expo-router";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
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
import { DirectionBoundary } from "../../i18n/layout-direction";
import { useSpeechCapture } from "../../hooks/use-speech-capture";
import { useGeminiVoiceCapture } from "../../hooks/use-gemini-voice-capture";
import { useAuth } from "../../context/AuthContext";
import { aiPrice } from "../../types/entitlements";
import { useSafeBack } from "../../hooks/use-safe-back";
import { useI18n } from "../../hooks/useI18n";
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

import {
  GamesCard,
  GamesGlassHeader,
  GamesIntroCard,
  GamesPrimaryButton,
  GamesScreenShell,
  GamesSecondaryButton,
  GamesScrollFade,
  GamesSectionLabel,
  GamesSegmented,
  GamesStatTile,
  useGamesChrome,
} from "./components/games-chrome";
import {
  GamesMotion,
  GamesType,
  useGamesMetrics,
  useGamesTheme,
  withAlpha,
  type GamesMetrics,
  type GamesTheme,
} from "./games-theme";

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

const TEMPLATE_COPY: Record<
  string,
  {
    en: { title: string; description: string };
    ku: { title: string; description: string };
    ar: { title: string; description: string };
  }
> = {
  "Morning Market": {
    en: { title: "Morning Market", description: "Clear daily vocabulary with short sentences." },
    ku: { title: "بازاڕی بەیانی", description: "وشەی ڕۆژانە و ڕستەی کورت و ڕوون." },
    ar: { title: "سوق الصباح", description: "مفردات يومية وجمل قصيرة وواضحة." },
  },
  "A Good Friend": {
    en: { title: "A Good Friend", description: "Warm beginner story for confidence." },
    ku: { title: "هاوڕێیەکی باش", description: "چیرۆکێکی سادە بۆ زیادکردنی متمانە." },
    ar: { title: "صديق مخلص", description: "قصة دافئة للمبتدئين لبناء الثقة." },
  },
  "Learning Languages": {
    en: { title: "Learning Languages", description: "Balanced vocabulary and connected ideas." },
    ku: { title: "فێربوونی زمانەکان", description: "وشەی مامناوەند و بیرۆکەی پەیوەست." },
    ar: { title: "تعلم اللغات", description: "مفردات متوازنة وأفكار مترابطة." },
  },
  "Smart Devices": {
    en: { title: "Smart Devices", description: "Modern topic with natural pronunciation challenges." },
    ku: { title: "ئامێرە زیرەکەکان", description: "بابەتێکی نوێ لەگەڵ وشەی جۆراوجۆر." },
    ar: { title: "الأجهزة الذكية", description: "موضوع حديث مع تحديات نطق طبيعية." },
  },
  "The Art of Focus": {
    en: { title: "The Art of Focus", description: "Longer rhythm with academic phrasing." },
    ku: { title: "هونەری سەرنجدان", description: "ڕستەی درێژتر و دەربڕینی ئەکادیمی." },
    ar: { title: "فن التركيز", description: "إيقاع أطول مع صياغة أكاديمية رصينة." },
  },
  "Sustainable Cities": {
    en: { title: "Sustainable Cities", description: "Advanced vocabulary with longer clauses." },
    ku: { title: "شارە بەردەوامەکان", description: "وشەی پێشکەوتوو و ڕستەی ئاڵۆزتر." },
    ar: { title: "مدن مستدامة", description: "مفردات متقدمة وجمل أكثر تركيباً." },
  },
};

const PRACTICE_COPY = {
  en: {
    words: "words",
    sentences: "sentences",
    maxTime: "2:00 max",
    previewGuide: "Preview the full passage, then tap the mic to start.",
    readingGuide: "Read continuously. Tap the mic when finished, or scoring starts automatically at 2:00.",
    resultsGuide: "Review your marked words, then retry the same passage or generate a new one.",
    strongReading: "Strong reading",
    goodBase: "Good base",
    needsPractice: "Needs another pass",
    transcriptLabel: "Transcript:",
    noSpeechCaptured: "No clear speech captured.",
    coverage: "Coverage",
    correct: "Correct",
    sentencesLabel: "Sentences",
    wpm: "WPM",
    time: "Time",
    secondUnit: "s",
    sentenceCheck: "Sentence check",
    whatWorked: "What worked",
    nextPass: "Next pass",
    scoringReading: "Scoring your reading...",
    startReading: "Start reading",
    stopReading: "Stop reading",
    retry: "Retry",
    newPassage: "New passage",
    fullAttemptFallback: "You completed a full reading attempt.",
    retryFallback: "Try the same passage again.",
  },
  ku: {
    words: "وشە",
    sentences: "ڕستە",
    maxTime: "٢:٠٠ زۆرینە",
    previewGuide: "پێشبینینی هەموو دەقەکە بکە، پاشان پەنجە بنێ بە مایکەکەدا بۆ دەستپێکردن.",
    readingGuide: "بە بەردەوامی بخوێنەوە. کاتێک تەواو بوویت پەنجە بنێ بە مایکەکەدا، یان لە ٢:٠٠ خۆکارانە تەواو دەبێت.",
    resultsGuide: "پێداچوونەوە بە وشەکانتدا بکە، پاشان هەمان دەق دووبارە بکەرەوە یان دەقێکی نوێ دروست بکە.",
    strongReading: "خوێندنەوەیەکی بەهێز",
    goodBase: "ئاستێکی باش",
    needsPractice: "پێویستی بە دووبارەکردنەوەیە",
    transcriptLabel: "دەقی تۆمارکراو:",
    noSpeechCaptured: "هیچ دەنگێکی ڕوون تۆمار نەکرا.",
    coverage: "داپۆشین",
    correct: "ڕاست",
    sentencesLabel: "ڕستەکان",
    wpm: "خێرایی (WPM)",
    time: "کات",
    secondUnit: "چ",
    sentenceCheck: "پشکنینی ڕستەکان",
    whatWorked: "خاڵە بەهێزەکان",
    nextPass: "هەنگاوی داهاتوو",
    scoringReading: "هەڵسەنگاندنی خوێندنەوەکەت دەکرێت...",
    startReading: "دەستپێکردنی خوێندنەوە",
    stopReading: "وەستاندنی خوێندنەوە",
    retry: "دووبارەکردنەوە",
    newPassage: "دەقێکی نوێ",
    fullAttemptFallback: "هەوڵێکی تەواوی خوێندنەوەت ئەنجامدا.",
    retryFallback: "هەمان دەق دووبارە بکەرەوە.",
  },
  ar: {
    words: "كلمات",
    sentences: "جمل",
    maxTime: "2:00 كحد أقصى",
    previewGuide: "عاين النص بالكامل، ثم اضغط على الميكروفون للبدء.",
    readingGuide: "اقرأ بشكل متواصل. اضغط على الميكروفون عند الانتهاء، أو يبدأ التقييم تلقائياً عند 2:00.",
    resultsGuide: "راجع الكلمات المحددة، ثم أعد المحاولة لنفس النص أو أنشئ نصاً جديداً.",
    strongReading: "قراءة ممتازة",
    goodBase: "مستوى جيد",
    needsPractice: "تحتاج إلى تدريب إضافي",
    transcriptLabel: "النص المسجل:",
    noSpeechCaptured: "لم يتم التقاط صوت واضح.",
    coverage: "التغطية",
    correct: "صحيح",
    sentencesLabel: "الجمل",
    wpm: "السرعة (WPM)",
    time: "الوقت",
    secondUnit: "ث",
    sentenceCheck: "تدقيق الجمل",
    whatWorked: "ما تم إتقانه",
    nextPass: "الخطوة التالية",
    scoringReading: "جارٍ تقييم قراءتك...",
    startReading: "ابدأ القراءة",
    stopReading: "إيقاف القراءة",
    retry: "إعادة المحاولة",
    newPassage: "نص جديد",
    fullAttemptFallback: "أكملت محاولة قراءة كاملة.",
    retryFallback: "حاول قراءة نفس النص مرة أخرى.",
  },
} as const;

function translateFeedback(item: string, lang: "en" | "ku" | "ar"): string {
  if (lang === "en") return item;

  if (item === "You pronounced most target words clearly.") {
    return lang === "ku"
      ? "زۆربەی وشە دیاریکراوەکانت بە ڕوونی گۆ کرد."
      : "نطقت معظم الكلمات المستهدفة بوضوح.";
  }
  if (item === "Repeat the highlighted red words before your next attempt.") {
    return lang === "ku"
      ? "پێش هەوڵی داهاتوو، ئەو وشانەی بە سوور دیاریکراون دووبارە بکەرەوە."
      : "تدرّب على الكلمات المظللة بالأحمر قبل محاولتك القادمة.";
  }
  if (item === "Your word order stayed close to the passage.") {
    return lang === "ku"
      ? "ڕیزبەندی وشەکانت لەگەڵ دەقەکەدا زۆر گونجاو بوو."
      : "ترتيب كلماتك كان دقيقاً ومطابقاً للنص.";
  }
  if (item === "Follow each line in order instead of jumping between phrases.") {
    return lang === "ku"
      ? "دێڕ بە دێڕ بە ڕیزبەندی بخوێنەوە لەجیاتی بازدان لە نێوان دەستەواژەکاندا."
      : "اتبع الأسطر بالترتيب بدلاً من القفز بين العبارات.";
  }
  if (item === "You completed every sentence accurately.") {
    return lang === "ku"
      ? "هەموو ڕستەکانت بە تەواوی و بە دروستی خوێندەوە."
      : "أكملت كل الجمل بدقة متناهية.";
  }
  const sentenceMatch = item.match(/Focus on the (\d+) sentence(?:s)? below 80%\./);
  if (sentenceMatch) {
    const count = sentenceMatch[1];
    return lang === "ku"
      ? `سەرنج بخەرە سەر ئەو ${count} ڕستەیەی لە خوار ٨٠٪ بوون.`
      : `ركز على ${count} جمل حققت تقييماً أقل من 80%.`;
  }
  if (item === "Your pace was controlled for this level.") {
    return lang === "ku"
      ? "خێرایی خوێندنەوەکەت بۆ ئەم ئاستە زۆر گونجاو بوو."
      : "كانت وتيرة وسرعة قراءتك ممتازة لهذا المستوى.";
  }
  if (item === "Try the same passage again at a slightly faster pace.") {
    return lang === "ku"
      ? "هەمان دەق بە خێراییەکی کەمێک زیاتر بخوێنەرەوە."
      : "أعد قراءة نفس النص بوتيرة أسرع قليلاً.";
  }
  if (item === "Slow down so pronunciation stays clear.") {
    return lang === "ku"
      ? "کەمێک هێواشتر بخوێنەوە بۆ ئەوەی گۆکردنت ڕوون بمێنێتەوە."
      : "تمهل قليلاً ليظل نطقك واضحاً وسليماً.";
  }
  if (item === "You completed a full reading attempt.") {
    return lang === "ku"
      ? "هەوڵێکی تەواوی خوێندنەوەت تەواو کرد."
      : "أكملت محاولة قراءة كاملة.";
  }
  if (item === "Try the same passage again.") {
    return lang === "ku"
      ? "هەمان دەق دووبارە بخوێنەرەوە."
      : "حاول قراءة نفس النص مرة أخرى.";
  }

  return item;
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

export default function ReadingPracticeScreen() {
  const insets = useSafeAreaInsets();
  const safeBack = useSafeBack("/(tabs)/play");
  const { width, height } = useWindowDimensions();
  const { locale, isKu, isAr } = useI18n();
  const { theme, metrics, isWide, isRtl } = useGamesChrome("reading-practice");
  const styles = useReadingStyles();
  const langKey = isKu ? "ku" : isAr ? "ar" : "en";
  const setupCopy = isKu ? SETUP_COPY.ku : isAr ? SETUP_COPY.ar : SETUP_COPY.en;
  const practiceCopy = isKu ? PRACTICE_COPY.ku : isAr ? PRACTICE_COPY.ar : PRACTICE_COPY.en;
  // Western digits everywhere: the Sorani/Arabic UI face has no Arabic-Indic
  // digit glyphs, so converted numbers rendered as blank dots.
  const formatNumber = (value: number) => String(value);
  const speech = useSpeechCapture("en-US");
  const geminiCapture = useGeminiVoiceCapture();
  const { billingAccount, refreshBillingAccount } = useAuth();
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
  const [scrolled, setScrolled] = useState(false);

  const transcriptRef = useRef("");
  const finalTranscriptRef = useRef("");
  const startedAtRef = useRef(0);
  const captureBackendRef = useRef<"speech" | "gemini" | null>(null);
  const stoppingRef = useRef(false);
  const autoStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clockTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoScrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollY = useSharedValue(0);
  const isReadingAnim = useSharedValue(0);

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
  const activeTemplateCopy =
    TEMPLATE_COPY[activeTemplate.title]?.[langKey] ?? activeTemplate;

  const clearReadingTimers = useCallback(() => {
    if (autoStopTimerRef.current) {
      clearTimeout(autoStopTimerRef.current);
      autoStopTimerRef.current = null;
    }
    if (clockTimerRef.current) {
      clearInterval(clockTimerRef.current);
      clockTimerRef.current = null;
    }
    if (autoScrollTimerRef.current) {
      clearTimeout(autoScrollTimerRef.current);
      autoScrollTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    isReadingAnim.value = withTiming(state === "reading" ? 1 : 0, {
      duration: 380,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [isReadingAnim, state]);

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
    cancelAnimation(scrollY);
    const startBottom = Math.round(readingViewportHeight * 0.80);
    scrollY.value = startBottom;
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
      const message =
        error instanceof Error
          ? error.message
          : isKu
            ? "نەتوانرا دەق دروست بکرێت. تکایە دووبارە هەوڵ بدەرەوە."
            : isAr
              ? "تعذر إنشاء النص. يرجى المحاولة مرة أخرى."
              : "Could not generate a passage. Please try again.";
      setParagraphs([]);
      setGenerationError(message);
      setState("setup");
    } finally {
      await refreshBillingAccount();
    }
  }, [difficulty, isAr, isKu, paragraphCount, refreshBillingAccount, wordCount]);

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
      await refreshBillingAccount();
    }
  }, [clearReadingTimers, difficulty, geminiCapture, paragraphs, refreshBillingAccount, scrollY, speech]);

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

    const expectedDurationMs =
      (Math.max(1, targetWords.length) / (TARGET_WPM[difficulty] * SPEED_RATE[speed])) * 60_000;
    const duration = Math.min(
      MAX_READING_SECONDS * 1000,
      Math.max(20_000, Math.round(expectedDurationMs)),
    );

    let started = false;

    speech.setError?.(null);

    const speechOptions = {
      continuous: true,
      contextualStrings: [...new Set(targetWords.map((word) => word.normalized))].slice(0, 100),
    };

    const buildSpeechHandlers = () => ({
      onResult: (text: string, isFinal: boolean) => {
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
        // Natural speech pauses between sentences trigger onEnd.
        // If the learner is still reading, restart to keep listening.
        if (stoppingRef.current || captureBackendRef.current !== "speech") return;
        finalTranscriptRef.current = transcriptRef.current;
        void speech.start(buildSpeechHandlers(), speechOptions);
      },
      onError: (code: string) => {
        if (code === "no-speech" || code === "speech-timeout" || code === "aborted") {
          // Natural pause; restart to continue listening
          if (!stoppingRef.current && captureBackendRef.current === "speech") {
            finalTranscriptRef.current = transcriptRef.current;
            void speech.start(buildSpeechHandlers(), speechOptions);
          }
          return;
        }

        // If local speech recognition fails (e.g. network error connecting to browser speech service)
        // and no words have been captured yet, seamlessly fall back to Gemini voice capture!
        if (!stoppingRef.current && transcriptRef.current === "" && geminiCapture.available) {
          console.warn("Speech recognition failed, falling back to Gemini capture:", code);
          captureBackendRef.current = null;
          void geminiCapture.start({
            onResult: () => {},
            onError: (err) => console.warn("Gemini fallback recording error:", err),
          }).then((ok) => {
            if (ok) {
              captureBackendRef.current = "gemini";
              speech.setError?.(null);
            } else {
              void stopReading();
            }
          });
          return;
        }

        if (!stoppingRef.current) void stopReading();
      },
    });

    if (speech.available) {
      started = await speech.start(buildSpeechHandlers(), speechOptions);
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

    cancelAnimation(scrollY);
    const startBottom = Math.round(readingViewportHeight * 0.80);
    const endTop = -Math.max(textHeight, 180) - 50;
    scrollY.value = startBottom;
    scrollY.value = withTiming(endTop, {
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
    () => [styles.passageText, compact && styles.passageTextCompact],
    [compact, styles.passageText, styles.passageTextCompact],
  );

  const scrollStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scrollY.value }],
  }));

  const recordButtonAnimStyle = useAnimatedStyle(() => {
    const translateY = isReadingAnim.value * (compact ? 16 : 20);
    const scale = 1 - isReadingAnim.value * 0.26;
    return {
      transform: [{ translateY }, { scale }],
    };
  });

  const secondaryActionsAnimStyle = useAnimatedStyle(() => {
    const opacity = 1 - isReadingAnim.value;
    const translateY = isReadingAnim.value * 24;
    const maxHeight = (1 - isReadingAnim.value) * 54;
    return {
      opacity,
      maxHeight,
      transform: [{ translateY }],
      overflow: "hidden" as const,
    };
  });

  const hintTextAnimStyle = useAnimatedStyle(() => {
    const opacity = 1 - isReadingAnim.value;
    const maxHeight = (1 - isReadingAnim.value) * 36;
    return {
      opacity,
      maxHeight,
      overflow: "hidden" as const,
    };
  });

  const topGradientStyle = useAnimatedStyle(() => {
    const opacity = scrollY.value < 20 ? 1 : 0;
    return { opacity };
  });

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
                { marginBottom: item.isLastInParagraph ? 32 : 18 },
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
      <DirectionBoundary direction="ltr" style={styles.wordWrap}>
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
      </DirectionBoundary>
    );
  };

  const glassHeader = (
    <GamesGlassHeader
      title={setupCopy.header}
      titleLanguageCode={locale}
      onBack={handleBack}
      scrolled={state === "setup" || state === "generating" ? scrolled : true}
    />
  );

  /* ─── Setup ───────────────────────────────────────────────────────── */
  if (state === "setup" || state === "generating") {
    const generating = state === "generating";

    return (
      <View style={{ flex: 1 }}>
        <GamesScreenShell
          onScroll={(e) => setScrolled(e.nativeEvent.contentOffset.y > 4)}
          header={glassHeader}
          footer={
            <View style={{ gap: 10 }}>
              <AppText
                style={[GamesType.caption, { color: theme.mutedInk, textAlign: "center" }]}
                languageCode={locale}
              >
                {sourceMode === "ai"
                  ? `${isKu ? "دروستکردنی دەقی AI" : isAr ? "إنشاء نص AI" : "AI passage generation"}: ${aiPrice(billingAccount?.entitlements, "reading_passage_generation")} ${isKu ? "کرێدیت" : isAr ? "رصيد" : "credits"} · ${isKu ? "باڵانس" : isAr ? "الرصيد" : "Balance"} ${billingAccount?.entitlements.creditBalance ?? 0}`
                  : isKu
                    ? "دەقە ئامادەکراوەکان بەخۆڕایین"
                    : isAr
                      ? "النصوص المدمجة مجانية"
                      : "Built-in passages are free"}
              </AppText>
              {sourceMode === "ai" && generationError ? (
                <View style={{ gap: 8 }}>
                  <AppText
                    style={[GamesType.caption, { color: theme.dangerInk, lineHeight: 18 }]}
                    languageCode={locale}
                    fullWidth
                  >
                    {generationError}
                  </AppText>
                  {/credit|کرێدیت|رصيد/i.test(generationError) ? (
                    <GamesSecondaryButton
                      languageCode={locale}
                      label={isKu ? "بینینی پلانەکان" : isAr ? "عرض الخطط" : "View plans or top up"}
                      onPress={() => router.push("/credits")}
                    />
                  ) : null}
                </View>
              ) : null}
              <GamesPrimaryButton
                label={
                  generating
                    ? setupCopy.creating
                    : sourceMode === "ai"
                      ? setupCopy.generate
                      : setupCopy.preview
                }
                languageCode={locale}
                loading={generating}
                onPress={handleBuildPractice}
              />
            </View>
          }
        >
          <GamesIntroCard
            mode="reading-practice"
            icon={BookOpen02Icon}
            languageCode={locale}
            eyebrow={setupCopy.header}
            title={setupCopy.title}
            blurb={setupCopy.subtitle}
          />

          <GamesCard entering={FadeInDown.delay(60).duration(GamesMotion.enterMs)}>
            <View style={styles.settingsGroup}>
              <GamesSectionLabel languageCode={locale}>{setupCopy.passage}</GamesSectionLabel>
              <GamesSegmented
                languageCode={locale}
                value={sourceMode}
                onChange={setSourceMode}
                options={[
                  { value: "ai" as SourceMode, label: setupCopy.generateNew },
                  { value: "template" as SourceMode, label: setupCopy.builtIn },
                ]}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingsGroup}>
              <GamesSectionLabel languageCode={locale}>{setupCopy.difficulty}</GamesSectionLabel>
              <GamesSegmented
                languageCode={locale}
                value={difficulty}
                onChange={setDifficulty}
                options={DIFFICULTIES.map((item) => ({
                  value: item,
                  label: setupCopy.difficulties[item],
                }))}
              />
            </View>

            {sourceMode === "ai" ? (
              <>
                <View style={styles.divider} />
                <View style={styles.settingsGroup}>
                  <GamesSectionLabel languageCode={locale}>
                    {setupCopy.paragraphs}
                  </GamesSectionLabel>
                  <GamesSegmented
                    languageCode={locale}
                    value={String(paragraphCount)}
                    onChange={(v) => setParagraphCount(Number(v))}
                    options={[1, 2, 3].map((item) => ({
                      value: String(item),
                      label: formatNumber(item),
                    }))}
                  />
                </View>
                <View style={styles.settingsGroup}>
                  <GamesSectionLabel languageCode={locale}>{setupCopy.words}</GamesSectionLabel>
                  <GamesSegmented
                    languageCode={locale}
                    value={String(wordCount)}
                    onChange={(v) => setWordCount(Number(v))}
                    options={[90, 130, 180].map((item) => ({
                      value: String(item),
                      label: formatNumber(item),
                    }))}
                  />
                </View>
              </>
            ) : (
              <>
                <View style={styles.divider} />
                <View style={styles.settingsGroup}>
                  <GamesSectionLabel languageCode={locale}>
                    {setupCopy.template}
                  </GamesSectionLabel>
                  <View style={styles.templateGrid}>
                    {TEMPLATES[difficulty].map((template, index) => {
                      const on = selectedTemplateIndex === index;
                      const itemCopy =
                        TEMPLATE_COPY[template.title]?.[langKey] ?? template;
                      return (
                        <GamesCard
                          key={template.title}
                          selected={on}
                          onPress={() => setSelectedTemplateIndex(index)}
                          style={styles.templateCard}
                        >
                          <AppText
                            style={[
                              GamesType.section,
                              { fontSize: 15, color: on ? theme.accentInk : theme.ink },
                            ]}
                            languageCode={locale}
                          >
                            {itemCopy.title}
                          </AppText>
                          <AppText
                            style={[
                              GamesType.caption,
                              { fontSize: 12, color: theme.mutedInk, lineHeight: 16 },
                            ]}
                            languageCode={locale}
                          >
                            {itemCopy.description}
                          </AppText>
                        </GamesCard>
                      );
                    })}
                  </View>
                </View>
              </>
            )}

            <View style={styles.divider} />

            <View style={styles.settingsGroup}>
              <GamesSectionLabel languageCode={locale}>{setupCopy.speed}</GamesSectionLabel>
              <GamesSegmented
                languageCode={locale}
                value={speed}
                onChange={setSpeed}
                options={SPEEDS.map((item) => ({ value: item, label: setupCopy.speeds[item] }))}
              />
            </View>
          </GamesCard>

          <AppText
            style={[GamesType.caption, { color: theme.mutedInk, textAlign: "center" }]}
            languageCode={locale}
          >
            {isKu
              ? `نزیکەی ${formatNumber(estimatedMinutes)} خولەک  ·  ${sourceMode === "template" ? activeTemplateCopy.title : `${formatNumber(wordCount)} وشە`}`
              : isAr
                ? `حوالي ${formatNumber(estimatedMinutes)} دقيقة  ·  ${sourceMode === "template" ? activeTemplateCopy.title : `${formatNumber(wordCount)} كلمة`}`
                : `About ${estimatedMinutes} min  ·  ${sourceMode === "template" ? activeTemplateCopy.title : `${wordCount} words`}`}
          </AppText>
        </GamesScreenShell>

        {generating ? (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.generatingOverlay}>
            <ActivityIndicator size="large" color={theme.accent} />
            <AppText
              style={[GamesType.section, { color: theme.ink, textAlign: "center" }]}
              languageCode={locale}
            >
              {setupCopy.creatingDetail}
            </AppText>
          </Animated.View>
        ) : null}
      </View>
    );
  }

  /* ─── Preview / reading / results ─────────────────────────────────── */
  const gutter = metrics.gutter;

  return (
    <View style={{ flex: 1, backgroundColor: theme.canvas }}>
      {glassHeader}

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.practiceScrollContent,
          {
            paddingTop: metrics.sectionGap + 4,
            paddingBottom: insets.bottom + (state === "reading" ? 72 : compact ? 158 : 184),
            maxWidth: isWide ? metrics.maxWidth : "100%",
            alignSelf: isWide ? "center" : "stretch",
            width: "100%",
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: gutter, gap: 10 }}>
          <View style={[styles.stageStats, isRtl && styles.rowReverse]}>
            <View style={styles.stageStat}>
              <HugeiconsIcon icon={BookOpen02Icon} size={16} color={theme.mutedInk} strokeWidth={2.2} />
              <AppText style={[GamesType.caption, { fontSize: 12, color: theme.ink }]} languageCode={locale}>
                {formatNumber(passageStats.wordCount)} {practiceCopy.words}
              </AppText>
            </View>
            <View style={styles.stageStat}>
              <HugeiconsIcon icon={Target02Icon} size={16} color={theme.mutedInk} strokeWidth={2.2} />
              <AppText style={[GamesType.caption, { fontSize: 12, color: theme.ink }]} languageCode={locale}>
                {formatNumber(passageStats.sentenceCount)} {practiceCopy.sentences}
              </AppText>
            </View>
            {/* The clock turns coral only while it is actually counting down —
                a live value that never changes colour is easy to stop noticing. */}
            <View
              style={[
                styles.stageStat,
                state === "reading" && {
                  backgroundColor: theme.accentWash,
                  borderColor: withAlpha(theme.accent, 0.28),
                },
              ]}
            >
              <HugeiconsIcon
                icon={Clock01Icon}
                size={16}
                color={state === "reading" ? theme.accentInk : theme.mutedInk}
                strokeWidth={2.2}
              />
              <AppText
                style={[
                  GamesType.caption,
                  { fontSize: 12, color: state === "reading" ? theme.accentInk : theme.ink },
                ]}
                forceLatinFont={state === "reading"}
                languageCode={locale}
              >
                {state === "reading"
                  ? `${Math.floor(secondsRemaining / 60)}:${String(secondsRemaining % 60).padStart(2, "0")}`
                  : practiceCopy.maxTime}
              </AppText>
            </View>
          </View>
          <AppText
            style={[
              GamesType.body,
              { fontSize: 13, color: theme.mutedInk, textAlign: isRtl ? "right" : "left" },
            ]}
            languageCode={locale}
          >
            {state === "reading"
              ? practiceCopy.readingGuide
              : state === "results"
                ? practiceCopy.resultsGuide
                : practiceCopy.previewGuide}
          </AppText>
        </View>

        <View
          style={[
            styles.teleprompter,
            { marginHorizontal: gutter },
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
              <Animated.View style={[styles.gradientTop, topGradientStyle]} pointerEvents="none">
                <LinearGradient
                  colors={[theme.surface, withAlpha(theme.surface, 0)]}
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>
              <LinearGradient
                colors={[withAlpha(theme.surface, 0), theme.surface]}
                style={styles.gradientBottom}
                pointerEvents="none"
              />
            </>
          ) : null}
        </View>

        {evaluation ? (
          <View style={{ paddingHorizontal: gutter }}>
            <GamesCard raised entering={FadeInDown.duration(GamesMotion.enterMs)} style={{ gap: 14 }}>
              <View style={[styles.scoreHeader, isRtl && styles.rowReverse]}>
                <View style={[styles.scoreCoin, { backgroundColor: theme.accent }]}>
                  <AppText
                    style={[GamesType.display, { fontSize: 23, color: theme.onAccent }]}
                    forceLatinFont
                  >
                    {evaluation.accuracyScore}
                  </AppText>
                </View>
                <View style={[styles.scoreCopy, { alignItems: isRtl ? "flex-end" : "flex-start" }]}>
                  <AppText
                    style={[
                      GamesType.section,
                      { fontSize: 18, color: theme.ink, textAlign: isRtl ? "right" : "left" },
                    ]}
                    languageCode={locale}
                  >
                    {evaluation.accuracyScore >= 80
                      ? practiceCopy.strongReading
                      : evaluation.accuracyScore >= 60
                        ? practiceCopy.goodBase
                        : practiceCopy.needsPractice}
                  </AppText>
                  <AppText
                    style={[
                      GamesType.caption,
                      {
                        fontSize: 12,
                        color: theme.mutedInk,
                        lineHeight: 17,
                        textAlign: isRtl ? "right" : "left",
                      },
                    ]}
                    languageCode={locale}
                    align="start"
                    fullWidth
                  >
                    {practiceCopy.transcriptLabel}{" "}
                    <AppText
                      style={[GamesType.caption, { fontSize: 12, color: theme.ink, lineHeight: 17 }]}
                      forceLatinFont={Boolean(evaluation.transcript)}
                      languageCode={evaluation.transcript ? "en" : locale}
                    >
                      {evaluation.transcript || practiceCopy.noSpeechCaptured}
                    </AppText>
                  </AppText>
                </View>
              </View>

              <View style={[styles.metricsRow, isRtl && styles.rowReverse]}>
                <GamesStatTile
                  label={practiceCopy.coverage}
                  value={`${evaluation.coverageScore}%`}
                  tone="success"
                  languageCode={locale}
                />
                <GamesStatTile
                  label={practiceCopy.correct}
                  value={`${evaluation.correctWords}/${evaluation.totalWords}`}
                  tone="success"
                  languageCode={locale}
                />
                <GamesStatTile
                  label={practiceCopy.sentencesLabel}
                  value={`${evaluation.correctSentences}/${evaluation.totalSentences}`}
                  languageCode={locale}
                />
                <GamesStatTile
                  label={practiceCopy.wpm}
                  value={`${evaluation.wpm}`}
                  tone={evaluation.fluencyScore >= 70 ? "success" : "danger"}
                  languageCode={locale}
                />
                <GamesStatTile
                  label={practiceCopy.time}
                  value={`${evaluation.durationSeconds}${practiceCopy.secondUnit}`}
                  languageCode={locale}
                />
              </View>

              <View style={{ gap: 8 }}>
                <GamesSectionLabel languageCode={locale}>
                  {practiceCopy.sentenceCheck}
                </GamesSectionLabel>
                {evaluation.sentenceResults.map((sentence, index) => (
                  <DirectionBoundary
                    key={`${sentence.sentence}-${index}`}
                    direction="ltr"
                    style={styles.sentenceResult}
                  >
                    <View
                      style={[
                        styles.sentenceNumber,
                        {
                          backgroundColor: sentence.correct
                            ? theme.successWash
                            : theme.dangerWash,
                        },
                      ]}
                    >
                      <AppText
                        style={[
                          GamesType.caption,
                          {
                            fontSize: 12,
                            color: sentence.correct ? theme.successInk : theme.dangerInk,
                          },
                        ]}
                        forceLatinFont
                      >
                        {index + 1}
                      </AppText>
                    </View>
                    <AppText
                      style={[GamesType.body, { fontSize: 13, color: theme.ink, lineHeight: 18, flex: 1 }]}
                      languageCode="en"
                      align="start"
                      forceLatinFont
                    >
                      {sentence.sentence}
                    </AppText>
                    <AppText
                      style={[
                        GamesType.caption,
                        {
                          fontSize: 12,
                          minWidth: 38,
                          textAlign: "right",
                          color: sentence.correct ? theme.successInk : theme.dangerInk,
                        },
                      ]}
                      forceLatinFont
                    >
                      {sentence.score}%
                    </AppText>
                  </DirectionBoundary>
                ))}
              </View>

              <View style={styles.feedbackGrid}>
                <View style={styles.feedbackBlock}>
                  <View style={[styles.feedbackTitleRow, isRtl && styles.rowReverse]}>
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={16}
                      color={theme.successInk}
                      strokeWidth={2.4}
                    />
                    <AppText style={[GamesType.caption, { fontSize: 12, color: theme.ink }]} languageCode={locale}>
                      {practiceCopy.whatWorked}
                    </AppText>
                  </View>
                  {(evaluation.strengths.length
                    ? evaluation.strengths
                    : [practiceCopy.fullAttemptFallback]
                  ).map((item) => (
                    <AppText
                      key={item}
                      style={[
                        GamesType.body,
                        { fontSize: 12, color: theme.mutedInk, lineHeight: 17, textAlign: isRtl ? "right" : "left" },
                      ]}
                      languageCode={locale}
                    >
                      • {translateFeedback(item, langKey)}
                    </AppText>
                  ))}
                </View>

                <View style={styles.feedbackBlock}>
                  <View style={[styles.feedbackTitleRow, isRtl && styles.rowReverse]}>
                    <HugeiconsIcon
                      icon={RefreshIcon}
                      size={16}
                      color={theme.accentInk}
                      strokeWidth={2.4}
                    />
                    <AppText style={[GamesType.caption, { fontSize: 12, color: theme.ink }]} languageCode={locale}>
                      {practiceCopy.nextPass}
                    </AppText>
                  </View>
                  {(evaluation.nextSteps.length
                    ? evaluation.nextSteps
                    : [practiceCopy.retryFallback]
                  ).map((item) => (
                    <AppText
                      key={item}
                      style={[
                        GamesType.body,
                        { fontSize: 12, color: theme.mutedInk, lineHeight: 17, textAlign: isRtl ? "right" : "left" },
                      ]}
                      languageCode={locale}
                    >
                      • {translateFeedback(item, langKey)}
                    </AppText>
                  ))}
                </View>
              </View>
            </GamesCard>
          </View>
        ) : null}
      </ScrollView>

      <View
        style={[
          styles.controlDock,
          {
            paddingBottom: insets.bottom + (state === "reading" ? 8 : 14),
          },
        ]}
      >
        {/* Theme-aware fade. The old version hardcoded #F8FAFC, which painted a
            pale smear across the dark canvas. */}
        <GamesScrollFade position="bottom" height={state === "reading" ? 70 : 140} />
        {state === "processing" ? (
          <View
            style={[
              styles.processingPill,
              { backgroundColor: theme.surfaceRaised, borderColor: theme.border },
              isRtl && styles.rowReverse,
            ]}
          >
            <ActivityIndicator size="small" color={theme.accent} />
            <AppText style={[GamesType.section, { fontSize: 14, color: theme.ink }]} languageCode={locale}>
              {practiceCopy.scoringReading}
            </AppText>
          </View>
        ) : (
          <>
            <Animated.View style={[styles.micWrap, recordButtonAnimStyle]}>
              <Animated.View style={hintTextAnimStyle}>
                {state !== "reading" ? (
                  <AppText
                    style={[GamesType.caption, { fontSize: 11, color: theme.mutedInk, textAlign: "center", maxWidth: 300 }]}
                    languageCode={locale}
                  >
                    {speech.available
                      ? isKu
                        ? "پشکنینی ناوخۆیی بەخۆڕاییە"
                        : isAr
                          ? "التقييم المحلي مجاني"
                          : "Local scoring is free"
                      : `${isKu ? "پشکنینی دەنگی Gemini" : isAr ? "تقييم نطق Gemini" : "Gemini pronunciation evaluation"}: ${aiPrice(billingAccount?.entitlements, "reading_pronunciation_evaluation")} ${isKu ? "کرێدیت" : isAr ? "رصيد" : "credits"}`}
                  </AppText>
                ) : null}
              </Animated.View>
              <MicCaptureOrb
                listening={state === "reading"}
                onPress={handleMicPress}
                color={state === "reading" ? theme.danger : theme.accent}
                size={compact ? 66 : 78}
              />
              <View
                style={[
                  styles.micCaption,
                  {
                    backgroundColor: state === "reading" ? theme.danger : theme.accentWash,
                    borderColor:
                      state === "reading" ? theme.danger : withAlpha(theme.accent, 0.24),
                  },
                  isRtl && styles.rowReverse,
                ]}
              >
                <HugeiconsIcon
                  icon={Mic01Icon}
                  size={14}
                  color={state === "reading" ? "#FFFFFF" : theme.accentInk}
                  strokeWidth={2.3}
                />
                <AppText
                  style={[
                    GamesType.eyebrow,
                    { fontSize: 11, letterSpacing: 0.6, color: state === "reading" ? "#FFFFFF" : theme.accentInk },
                  ]}
                  languageCode={locale}
                >
                  {state === "reading" ? practiceCopy.stopReading : practiceCopy.startReading}
                </AppText>
              </View>
              {state !== "reading" && (speech.error || geminiCapture.error) ? (
                <AppText
                  style={[
                    GamesType.caption,
                    { fontSize: 11, lineHeight: 15, maxWidth: 260, textAlign: "center", color: theme.dangerInk },
                  ]}
                  languageCode={locale}
                >
                  {speech.error || geminiCapture.error}
                </AppText>
              ) : null}
            </Animated.View>

            <Animated.View
              style={[styles.secondaryActions, secondaryActionsAnimStyle, isRtl && styles.rowReverse]}
              pointerEvents={state === "reading" ? "none" : "auto"}
            >
              <PressableScale
                style={[
                  styles.secondaryButton,
                  { backgroundColor: theme.surfaceSunken, borderColor: theme.border },
                ]}
                onPress={() => {
                  setEvaluation(null);
                  setState("preview");
                  resetScrollPosition();
                }}
              >
                <AppText
                  numberOfLines={1}
                  style={[GamesType.caption, { fontSize: 12, color: theme.ink }]}
                  languageCode={locale}
                >
                  {practiceCopy.retry}
                </AppText>
              </PressableScale>
              <PressableScale
                style={[
                  styles.secondaryButton,
                  { backgroundColor: theme.surfaceSunken, borderColor: theme.border },
                ]}
                onPress={handleBuildPractice}
              >
                <AppText
                  numberOfLines={1}
                  style={[GamesType.caption, { fontSize: 12, color: theme.ink }]}
                  languageCode={locale}
                >
                  {practiceCopy.newPassage}
                </AppText>
              </PressableScale>
            </Animated.View>
          </>
        )}
      </View>
    </View>
  );
}

function useReadingStyles() {
  const theme = useGamesTheme();
  const metrics = useGamesMetrics(false);
  return useMemo(() => createStyles(theme, metrics), [theme, metrics]);
}

function createStyles(theme: GamesTheme, metrics: GamesMetrics) {
  return StyleSheet.create({
    settingsGroup: {
      gap: 8,
      marginTop: 12,
    },
    rowReverse: {
      flexDirection: "row-reverse",
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.border,
      marginTop: 16,
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
      justifyContent: "space-between",
      gap: 6,
    },
    generatingOverlay: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: withAlpha(theme.canvas, theme.isDark ? 0.9 : 0.9),
      alignItems: "center",
      justifyContent: "center",
      gap: 14,
      paddingHorizontal: 32,
    },

    practiceScrollContent: {
      gap: 12,
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
      borderRadius: metrics.radiusPill,
      backgroundColor: theme.surfaceSunken,
      borderWidth: 1,
      borderColor: theme.border,
    },

    teleprompter: {
      minHeight: 460,
      borderRadius: metrics.radiusCard,
      overflow: "hidden",
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
    },
    teleprompterPreview: {
      minHeight: 0,
      overflow: "visible",
    },
    teleprompterCompact: {
      minHeight: 490,
    },
    teleprompterMask: {
      flex: 1,
      overflow: "hidden",
    },
    passageWrap: {
      paddingHorizontal: 26,
      paddingTop: 32,
      paddingBottom: 70,
    },
    previewScrollContent: {
      paddingHorizontal: 24,
      paddingVertical: 32,
    },
    passageText: {
      fontSize: 22,
      lineHeight: 38,
      letterSpacing: 0.3,
      color: theme.ink,
      fontFamily: "Rabar_044",
    },
    passageTextCompact: {
      fontSize: 20,
      lineHeight: 34,
      letterSpacing: 0.2,
    },
    wordWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      paddingHorizontal: 2,
    },
    wordText: {
      fontSize: 21,
      lineHeight: 36,
      letterSpacing: 0.2,
      fontFamily: "Rabar_044",
    },
    /* Semantic, and only here: this is the one place in the practice set where
       colour genuinely encodes correctness. */
    wordCorrect: {
      color: theme.successInk,
    },
    wordMissed: {
      color: theme.dangerInk,
      textDecorationLine: "underline",
    },
    wordOutOfOrder: {
      color: theme.warningInk,
    },
    gradientTop: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 48,
    },
    gradientBottom: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 64,
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
    },
    scoreCopy: {
      flex: 1,
      gap: 4,
    },
    metricsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
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
    sentenceResult: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: metrics.radiusControl,
      backgroundColor: theme.surfaceSunken,
    },
    sentenceNumber: {
      width: 26,
      height: 26,
      borderRadius: 13,
      alignItems: "center",
      justifyContent: "center",
    },

    controlDock: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      minHeight: 80,
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 6,
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
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: metrics.radiusPill,
      borderWidth: 1,
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
      paddingVertical: 10,
      borderRadius: metrics.radiusControl,
      alignItems: "center",
      borderWidth: 1,
    },
    processingPill: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: metrics.radiusPill,
      borderWidth: 1,
    },
  });
}
