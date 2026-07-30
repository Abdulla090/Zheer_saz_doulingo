import { useSettingsStore } from "../../stores/useSettingsStore";
import { IOSPressable as TouchableOpacity } from "../../components/ui/ios-pressable";
import { useLocaleStore } from "../../stores/useLocaleStore";
import { hapticSelection } from "../../utils/haptics";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  useWindowDimensions,
} from "react-native";
import Animated, {
  Easing,
  FadeInRight,
  FadeOutLeft,
  LinearTransition,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Message01Icon,
  Airplane01Icon,
  BookOpen02Icon,
  SparklesIcon,
  LeafIcon,
  BotMessageSquareIcon,
  RocketIcon,
  CloudLightningIcon
} from "@hugeicons/core-free-icons";
import { OnboardingSkiaBg } from "./components/OnboardingSkiaBg";
import { useProgressStore } from "../../stores/useProgressStore";
import { getSkippedUnitsCount } from "../../data/normal-english";
import { useThemeColors } from "../../hooks/useThemeColors";
import {
  LANGUAGES as LANGUAGE_CATALOG,
  SOURCE_LANGUAGES,
  getTargetLanguagesForSource,
  type LanguageDefinition,
} from "../../config/languages";
import { AppText } from "../../components/ui/AppText";
import { OnboardingFooter, OnboardingTopBar } from "./components/OnboardingChrome";
import {
  ONBOARDING_DESIGN,
} from "./components/onboarding-design";

export type OnboardingSetupStep = "nativeLanguage" | "targetLanguage" | "profile" | "level" | "goal" | "generating";

type Props = {
  onFinish: () => void;
  onBackToIntro: () => void;
  initialStep?: OnboardingSetupStep;
};

const ONBOARDING_COPY = {
  en: {
    step: (current: number) => `STEP ${current} OF 5`,
    profileTitle: "What's your name?",
    profileSubtitle: "We'll personalize your learning journey for you.",
    namePlaceholder: "Your Name",
    agePlaceholder: "Your Age (optional)",
    nativeLanguageTitle: "What is your native language?",
    targetLanguageTitle: "Which language would you like to learn?",
    levelTitle: (language: string) => `What is your current level in ${language}?`,
    goalTitle: "What's your main goal?",
    continue: "Continue",
    start: "Let's Get Started",
    generatingTitle: "Generating your personalized path...",
    generatingSubtitle: "Building content tailored for your goals and level.",
    back: "Back",
    setupError: "We couldn't prepare your path. Check your choices and try again.",
  },
  ku: {
    step: (current: number) => `هەنگاوی ${current} لە 5`,
    profileTitle: "ناوت چییە؟",
    profileSubtitle: "ڕێڕەوی فێربوونت بۆ خۆت تایبەت دەکەین.",
    namePlaceholder: "ناوت",
    agePlaceholder: "تەمەنت (ئارەزوومەندانە)",
    nativeLanguageTitle: "زمانی دایکەت چییە؟",
    targetLanguageTitle: "کام زمان دەتەوێت فێرببیت؟",
    levelTitle: (language: string) => `ئاستت لە ${language} چەندە؟`,
    goalTitle: "ئامانجی سەرەکیت چییە؟",
    continue: "بەردەوام بە",
    start: "دەست پێ بکە",
    generatingTitle: "ڕێڕەوی تایبەت بە تۆ دروست دەکرێت...",
    generatingSubtitle: "ناوەڕۆکێک دروست دەکەین کە گونجاوە لەگەڵ ئامانج و ئاستەکەت.",
    back: "گەڕانەوە",
    setupError: "نەتوانرا ڕێڕەوەکەت ئامادە بکرێت. هەڵبژاردنەکانت بپشکنە و دووبارە هەوڵ بدەرەوە.",
  },
  ar: {
    step: (current: number) => `الخطوة ${current} من 5`,
    profileTitle: "ما اسمك؟",
    profileSubtitle: "سنخصص رحلة التعلم لك.",
    namePlaceholder: "اسمك",
    agePlaceholder: "عمرك (اختياري)",
    nativeLanguageTitle: "ما لغتك الأم؟",
    targetLanguageTitle: "أي لغة تريد أن تتعلم؟",
    levelTitle: (language: string) => `ما مستواك الحالي في ${language}؟`,
    goalTitle: "ما هدفك الرئيسي؟",
    continue: "متابعة",
    start: "ابدأ الآن",
    generatingTitle: "جارٍ إنشاء مسارك المخصص...",
    generatingSubtitle: "نُعِد محتوى يناسب أهدافك ومستواك.",
    back: "رجوع",
    setupError: "تعذر تجهيز مسارك. تحقق من اختياراتك وحاول مرة أخرى.",
  },
  es: {
    step: (current: number) => `PASO ${current} DE 5`,
    profileTitle: "¿Cómo te llamas?",
    profileSubtitle: "Personalizaremos tu aprendizaje.",
    namePlaceholder: "Tu nombre",
    agePlaceholder: "Tu edad (opcional)",
    nativeLanguageTitle: "¿Cuál es tu idioma nativo?",
    targetLanguageTitle: "¿Qué idioma quieres aprender?",
    levelTitle: (language: string) => `¿Cuál es tu nivel actual en ${language}?`,
    goalTitle: "¿Cuál es tu objetivo principal?",
    continue: "Continuar",
    start: "Empezar",
    generatingTitle: "Creando tu ruta personalizada...",
    generatingSubtitle: "Preparando contenido adaptado a tus objetivos y nivel.",
    back: "Atrás",
    setupError: "No pudimos preparar tu ruta. Revisa tus opciones e inténtalo de nuevo.",
  },
  ru: {
    step: (current: number) => `ШАГ ${current} ИЗ 5`,
    profileTitle: "Как тебя зовут?",
    profileSubtitle: "Мы настроим обучение под тебя.",
    namePlaceholder: "Твоё имя",
    agePlaceholder: "Возраст (необязательно)",
    nativeLanguageTitle: "Какой у тебя родной язык?",
    targetLanguageTitle: "Какой язык ты хочешь учить?",
    levelTitle: (language: string) => `Какой у тебя уровень в ${language}?`,
    goalTitle: "Какая твоя главная цель?",
    continue: "Продолжить",
    start: "Начать",
    generatingTitle: "Создаём твой персональный путь...",
    generatingSubtitle: "Подбираем материалы под твои цели и уровень.",
    back: "Назад",
    setupError: "Не удалось подготовить маршрут. Проверь выбор и попробуй ещё раз.",
  },
} as const;

const GOALS = [
  {
    id: "conversations",
    title: "Have Conversations",
    desc: "Speak confidently in real life situations.",
    icon: Message01Icon,
    color: "#8B5CF6",
    bg: "#F5F3FF",
  },
  {
    id: "travel",
    title: "Travel the World",
    desc: "Communicate easily while traveling.",
    icon: Airplane01Icon,
    color: "#F97316",
    bg: "#FFF7ED",
  },
  {
    id: "career",
    title: "Advance My Career",
    desc: "Improve communication for work opportunities.",
    icon: BookOpen02Icon,
    color: "#10B981",
    bg: "#ECFDF5",
  },
  {
    id: "challenge",
    title: "Challenge Myself",
    desc: "Learn a new language and expand my mind.",
    icon: SparklesIcon,
    color: "#EF4444",
    bg: "#FEF2F2",
  },
];

const LEVELS = [
  { id: 2, label: "Beginner (A1)", desc: "Start from the very basics, simple words and greetings.", icon: LeafIcon },
  { id: 4, label: "Elementary (A2)", desc: "Can form basic sentences and talk about daily routines.", icon: BotMessageSquareIcon },
  { id: 6, label: "Intermediate (B1)", desc: "Can handle travel situations and express opinions.", icon: RocketIcon },
  { id: 8, label: "Upper-Intermediate (B2)", desc: "Can converse fluently and understand main ideas.", icon: BookOpen02Icon },
  { id: 10, label: "Advanced / Expert (C1/C2)", desc: "Fluent, natural, and complex sentence structures.", icon: CloudLightningIcon },
];

const LEVEL_LABELS: Record<string, Record<number, string>> = {
  en: {
    2: "Beginner (A1)",
    4: "Elementary (A2)",
    6: "Intermediate (B1)",
    8: "Upper-Intermediate (B2)",
    10: "Advanced / Expert (C1/C2)",
  },
  ku: {
    2: "دەستپێکەر (A1)",
    4: "سەرەتایی (A2)",
    6: "مامناوەند (B1)",
    8: "مامناوەندی باڵا (B2)",
    10: "پێشکەوتوو (C1/C2)",
  },
  ar: {
    2: "مبتدئ (A1)",
    4: "أساسي (A2)",
    6: "متوسط (B1)",
    8: "فوق المتوسط (B2)",
    10: "متقدم (C1/C2)",
  },
  es: {
    2: "Principiante (A1)",
    4: "Elemental (A2)",
    6: "Intermedio (B1)",
    8: "Intermedio alto (B2)",
    10: "Avanzado (C1/C2)",
  },
  ru: {
    2: "Начальный (A1)",
    4: "Базовый (A2)",
    6: "Средний (B1)",
    8: "Выше среднего (B2)",
    10: "Продвинутый (C1/C2)",
  },
};

const GOAL_LABELS: Record<string, Record<string, string>> = {
  en: {
    conversations: "Have Conversations",
    travel: "Travel the World",
    career: "Advance My Career",
    challenge: "Challenge Myself",
  },
  ku: {
    conversations: "گفتوگۆ بکەم",
    travel: "گەشت بکەم",
    career: "کارەکەم پێش بخەم",
    challenge: "خۆم تاقی بکەمەوە",
  },
  ar: {
    conversations: "إجراء محادثات",
    travel: "السفر حول العالم",
    career: "تطوير مسيرتي",
    challenge: "تحدي نفسي",
  },
  es: {
    conversations: "Conversar",
    travel: "Viajar por el mundo",
    career: "Avanzar en mi carrera",
    challenge: "Retarme",
  },
  ru: {
    conversations: "Разговаривать",
    travel: "Путешествовать",
    career: "Развить карьеру",
    challenge: "Бросить себе вызов",
  },
};

export function LanguageSelectionFlow({
  onFinish,
  onBackToIntro,
  initialStep = "nativeLanguage",
}: Props) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === "web" && screenWidth >= 900;
  const isCompact = screenWidth < 390 || screenHeight < 760;
  const { colors, isDark } = useThemeColors();
  const styles = useMemo(
    () => createStyles(colors, isDark, isCompact),
    [colors, isCompact, isDark],
  );
  const reduceMotion = useReducedMotion();
  const contentLayout = Platform.OS === "web"
    ? LinearTransition.duration(220)
    : LinearTransition.springify();

  // Stores
  const setUserName = useSettingsStore((s) => s.setUserName);
  const setUserAge = useSettingsStore((s) => s.setUserAge);
  const userName = useSettingsStore((s) => s.userName);
  const userAge = useSettingsStore((s) => s.userAge);
  const storedNativeLang = useLocaleStore((s) => s.selectedSourceLanguage);
  const storedTargetLang = useLocaleStore((s) => s.selectedTargetLanguage);
  const setLanguagePair = useLocaleStore((s) => s.setLanguagePair);
  const englishLevel = useSettingsStore((s) => s.englishLevel);
  const setEnglishLevel = useSettingsStore((s) => s.setEnglishLevel);
  const learningGoal = useSettingsStore((s) => s.learningGoal);
  const setLearningGoal = useSettingsStore((s) => s.setLearningGoal);

  const [step, setStep] = useState<OnboardingSetupStep>(initialStep);
  const [selectedNativeLang, setSelectedNativeLang] = useState<string>(storedNativeLang || "ku");
  const [selectedTargetLang, setSelectedTargetLang] = useState<string>(storedTargetLang || "en");
  const [selectedLevel, setSelectedLevel] = useState<number>(
    LEVELS.some((level) => level.id === englishLevel) ? englishLevel : LEVELS[0].id,
  );
  const [selectedGoal, setSelectedGoal] = useState<string>(learningGoal || "conversations");
  const [name, setName] = useState(userName || "");
  const [age, setAge] = useState(userAge || "");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);
  const isRtl = selectedNativeLang === "ku" || selectedNativeLang === "ar";
  const copy = ONBOARDING_COPY[selectedNativeLang as keyof typeof ONBOARDING_COPY] ?? ONBOARDING_COPY.en;
  const levelLabels = LEVEL_LABELS[selectedNativeLang] ?? LEVEL_LABELS.en;
  const goalLabels = GOAL_LABELS[selectedNativeLang] ?? GOAL_LABELS.en;
  const textDirectionStyle = isRtl ? styles.rtlText : styles.ltrText;

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const showSub = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleProfileContinue = useCallback(() => {
    if (!name.trim()) {
      if (Platform.OS !== "web") {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      }
      return;
    }
    setUserName(name);
    setUserAge(age);
    hapticSelection();
    setStep("level");
  }, [name, age, setUserName, setUserAge]);

  const handleNativeLanguageContinue = useCallback(() => {
    hapticSelection();
    if (selectedTargetLang === selectedNativeLang) {
      const fallbackTarget = getTargetLanguagesForSource(selectedNativeLang)[0]?.id ?? "en";
      setSelectedTargetLang(fallbackTarget);
    }
    setStep("targetLanguage");
  }, [selectedNativeLang, selectedTargetLang]);

  const handleTargetLanguageContinue = useCallback(() => {
    hapticSelection();
    setLanguagePair(selectedNativeLang, selectedTargetLang);
    setStep("profile");
  }, [selectedNativeLang, selectedTargetLang, setLanguagePair]);

  const handleNativeLanguageSelect = useCallback((langId: string) => {
    hapticSelection();
    setSelectedNativeLang(langId);
  }, []);

  const handleTargetLanguageSelect = useCallback((langId: string) => {
    hapticSelection();
    setSelectedTargetLang(langId);
  }, []);

  const renderLanguageOptions = (
    languages: LanguageDefinition[],
    selectedLanguage: string,
    onSelect: (langId: string) => void,
  ) => (
    <View style={styles.languageList} accessibilityRole="radiogroup">
      {languages.map((language) => {
        const isSelected = selectedLanguage === language.id;

        return (
          <TouchableOpacity
            key={language.id}
            testID={`onboarding-language-${language.id}`}
            accessibilityRole="radio"
            accessibilityLabel={language.name}
            accessibilityState={{ checked: isSelected }}
            style={[
              styles.languageRow,
              isRtl && styles.languageRowRtl,
              isSelected && styles.languageRowSelected,
            ]}
            activeOpacity={0.82}
            onPress={() => onSelect(language.id)}
          >
            <View style={styles.languageCopy}>
              <AppText
                style={styles.languageName}
                languageCode={language.id}
                align="start"
                fullWidth
                numberOfLines={1}
              >
                {language.nativeName}
              </AppText>
            </View>

            <View
              style={[
                styles.radioDot,
                styles.languageRadio,
                isSelected && styles.radioDotSelected,
              ]}
            >
              {isSelected ? <View style={styles.radioInner} /> : null}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const handleLevelContinue = useCallback(() => {
    hapticSelection();
    setEnglishLevel(selectedLevel);
    setStep("goal");
  }, [selectedLevel, setEnglishLevel]);

  const setPathMode = useSettingsStore((s) => s.setPathMode);

  const handleGoalContinue = useCallback(async () => {
    hapticSelection();
    setSetupError(null);
    setStep("generating");

    try {
      // Give the preparation state one real render frame, then commit the
      // selected curriculum and persisted preferences.
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

      const skipCount = getSkippedUnitsCount(selectedLevel);
      const initialIndex = skipCount * 10;
      const langPair = `${selectedNativeLang}-${selectedTargetLang}`;
      
      // Initialize normal progress in the store
      useProgressStore.getState().initializeNormalProgress(langPair, initialIndex);
      
      setEnglishLevel(selectedLevel);
      setLearningGoal(selectedGoal);
      setLanguagePair(selectedNativeLang, selectedTargetLang);
      setPathMode("normal");
      onFinish();
    } catch (err) {
      if (__DEV__) console.warn("Failed to initialize path:", err);
      setSetupError(copy.setupError);
      setStep("goal");
      if (Platform.OS !== "web") {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      }
    }
  }, [
    copy.setupError,
    onFinish,
    selectedGoal,
    selectedNativeLang,
    selectedTargetLang,
    selectedLevel,
    setLanguagePair,
    setLearningGoal,
    setPathMode,
    setEnglishLevel,
  ]);

  const onBack = useCallback(() => {
    hapticSelection();
    if (step === "generating") setStep("goal");
    else if (step === "goal") setStep("level");
    else if (step === "level") setStep("profile");
    else if (step === "profile") setStep("targetLanguage");
    else if (step === "targetLanguage") setStep("nativeLanguage");
    else onBackToIntro();
  }, [onBackToIntro, step]);

  const stepIndex =
    step === "nativeLanguage"
      ? 1
      : step === "targetLanguage"
        ? 2
        : step === "profile"
          ? 3
          : step === "level"
            ? 4
            : 5;

  const continueDisabled = step === "profile" && !name.trim();
  const continueLabel = step === "goal" ? copy.start : copy.continue;
  const handleCurrentContinue = () => {
    if (step === "nativeLanguage") {
      handleNativeLanguageContinue();
    } else if (step === "targetLanguage") {
      handleTargetLanguageContinue();
    } else if (step === "profile") {
      handleProfileContinue();
    } else if (step === "level") {
      handleLevelContinue();
    } else if (step === "goal") {
      void handleGoalContinue();
    }
  };

  // Background animated gradient
  const bgScrollX = useSharedValue(0);
  React.useEffect(() => {
    const targetIndex = stepIndex - 1;
    bgScrollX.value = withTiming(targetIndex * screenWidth, {
      duration: 460,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    });
  }, [stepIndex, screenWidth, bgScrollX]);

  return (
    <View style={styles.root}>
      {!isDark && <OnboardingSkiaBg scrollX={bgScrollX} />}
      <OnboardingTopBar
        current={stepIndex + 3}
        total={9}
        locale={selectedNativeLang}
        topInset={insets.top}
        onBack={onBack}
        backLabel={copy.back}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoider}
      >
      <ScrollView
        style={{ flex: 1 }}
        scrollEnabled={true}
        alwaysBounceVertical={true}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
        contentContainerStyle={[
          styles.scrollContent,
          isDesktopWeb && styles.desktopFrame,
        ]}
      >
        {/* STEP 1: NATIVE LANGUAGE */}
        {step === "nativeLanguage" && (
          <Animated.View
            entering={reduceMotion ? undefined : FadeInRight.duration(240)}
            exiting={FadeOutLeft.duration(200)}
            layout={contentLayout}
            style={[styles.contentWrap, styles.choiceContentWrap]}
          >
            <AppText style={styles.stepNumLabel} languageCode={selectedNativeLang} align="start" fullWidth>
              {copy.step(1)}
            </AppText>
            <AppText style={styles.title} languageCode={selectedNativeLang} align="start" fullWidth latinRole="regular" fontFamilyOverride={isRtl ? undefined : ONBOARDING_DESIGN.serif}>
              {copy.nativeLanguageTitle}
            </AppText>
            {renderLanguageOptions(SOURCE_LANGUAGES, selectedNativeLang, handleNativeLanguageSelect)}

          </Animated.View>
        )}

        {/* STEP 2: TARGET LANGUAGE */}
        {step === "targetLanguage" && (
          <Animated.View 
            entering={reduceMotion ? undefined : FadeInRight.duration(240)}
            exiting={FadeOutLeft.duration(200)}
            layout={contentLayout}
            style={[styles.contentWrap, styles.choiceContentWrap]}
          >
            <AppText style={styles.stepNumLabel} languageCode={selectedNativeLang} align="start" fullWidth>
              {copy.step(2)}
            </AppText>
            <AppText style={styles.title} languageCode={selectedNativeLang} align="start" fullWidth latinRole="regular" fontFamilyOverride={isRtl ? undefined : ONBOARDING_DESIGN.serif}>
              {copy.targetLanguageTitle}
            </AppText>
            {renderLanguageOptions(
              getTargetLanguagesForSource(selectedNativeLang),
              selectedTargetLang,
              handleTargetLanguageSelect,
            )}

          </Animated.View>
        )}

        {/* STEP 3: PROFILE NAME & AGE */}
        {step === "profile" && (
          <Animated.View 
            entering={reduceMotion ? undefined : FadeInRight.duration(240)}
            exiting={FadeOutLeft.duration(200)}
            layout={contentLayout}
            style={[
              styles.contentWrap,
              keyboardVisible && styles.contentWrapKeyboard,
            ]}
          >
            <AppText style={styles.stepNumLabel} languageCode={selectedNativeLang} align="start" fullWidth>
              {copy.step(3)}
            </AppText>
            <AppText style={styles.title} languageCode={selectedNativeLang} align="start" fullWidth latinRole="regular" fontFamilyOverride={isRtl ? undefined : ONBOARDING_DESIGN.serif}>
              {copy.profileTitle}
            </AppText>
            <AppText style={styles.subtitle} languageCode={selectedNativeLang} align="start" fullWidth>
              {copy.profileSubtitle}
            </AppText>



            <View style={styles.inputForm}>
              <View style={styles.inputBoxClean}>
                <TextInput
                  testID="onboarding-name"
                  style={[styles.textInputClean, textDirectionStyle, { outlineStyle: "none" } as any]}
                  value={name}
                  onChangeText={setName}
                  placeholder={copy.namePlaceholder}
                  placeholderTextColor={colors.mutedForeground}
                  selectionColor="#0F172A"
                />
              </View>

              <View style={styles.inputBoxClean}>
                <TextInput
                  testID="onboarding-age"
                  style={[styles.textInputClean, textDirectionStyle, { outlineStyle: "none" } as any]}
                  value={age}
                  onChangeText={setAge}
                  placeholder={copy.agePlaceholder}
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="numeric"
                  selectionColor="#0F172A"
                />
              </View>
            </View>

          </Animated.View>
        )}

        {/* STEP 4: LEVEL SELECTION */}
        {step === "level" && (
          <Animated.View 
            entering={reduceMotion ? undefined : FadeInRight.duration(240)}
            exiting={FadeOutLeft.duration(200)}
            layout={contentLayout}
            style={[styles.contentWrap, styles.choiceContentWrap]}
          >
            <AppText style={styles.stepNumLabel} languageCode={selectedNativeLang} align="start" fullWidth>
              {copy.step(4)}
            </AppText>
            <AppText style={styles.title} languageCode={selectedNativeLang} align="start" fullWidth latinRole="regular" fontFamilyOverride={isRtl ? undefined : ONBOARDING_DESIGN.serif}>
              {copy.levelTitle(LANGUAGE_CATALOG[selectedTargetLang]?.nativeName ?? "")}
            </AppText>



            <View style={styles.gridList}>
              {LEVELS.map((lvl) => {
                const isSelected = selectedLevel === lvl.id;
                return (
                  <TouchableOpacity
                    key={lvl.id}
                    testID={`onboarding-level-${lvl.id}`}
                    accessibilityRole="radio"
                    accessibilityLabel={levelLabels[lvl.id] ?? lvl.label}
                    accessibilityState={{ checked: isSelected }}
                    style={[
                      styles.gridCard,
                      isRtl && styles.selectionRowRtl,
                      isSelected && styles.gridCardSelected,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => setSelectedLevel(lvl.id)}
                  >
                    <View style={[styles.gridIconWrap, { backgroundColor: "#EFF6FF" }]}>
                      <HugeiconsIcon icon={lvl.icon} size={21} color="#2563EB" strokeWidth={2} />
                    </View>
                    <AppText
                      style={[styles.gridCardTitle, isSelected && styles.goalTitleSelected]}
                      languageCode={selectedNativeLang}
                      align="start"
                    >
                      {levelLabels[lvl.id] ?? lvl.label}
                    </AppText>
                    <View style={[styles.radioDot, styles.radioDotGrid, isSelected && styles.radioDotSelected]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

          </Animated.View>
        )}

        {/* STEP 5: MAIN GOAL SELECTION */}
        {step === "goal" && (
          <Animated.View 
            entering={reduceMotion ? undefined : FadeInRight.duration(240)}
            exiting={FadeOutLeft.duration(200)}
            layout={contentLayout}
            style={[styles.contentWrap, styles.choiceContentWrap]}
          >
            <AppText style={styles.stepNumLabel} languageCode={selectedNativeLang} align="start" fullWidth>
              {copy.step(5)}
            </AppText>
            <AppText style={styles.title} languageCode={selectedNativeLang} align="start" fullWidth latinRole="regular" fontFamilyOverride={isRtl ? undefined : ONBOARDING_DESIGN.serif}>
              {copy.goalTitle}
            </AppText>



            <View style={styles.gridList}>
              {GOALS.map((g) => {
                const isSelected = selectedGoal === g.id;
                return (
                  <TouchableOpacity
                    key={g.id}
                    testID={`onboarding-goal-${g.id}`}
                    accessibilityRole="radio"
                    accessibilityLabel={goalLabels[g.id] ?? g.title}
                    accessibilityState={{ checked: isSelected }}
                    style={[
                      styles.gridCard,
                      isRtl && styles.selectionRowRtl,
                      isSelected && styles.gridCardSelected,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => setSelectedGoal(g.id)}
                  >
                    <View style={[styles.gridIconWrap, { backgroundColor: g.bg }]}>
                      <HugeiconsIcon icon={g.icon} size={21} color={g.color} strokeWidth={2.5} />
                    </View>
                    <AppText
                      style={[styles.gridCardTitle, isSelected && styles.goalTitleSelected]}
                      languageCode={selectedNativeLang}
                      align="start"
                    >
                      {goalLabels[g.id] ?? g.title}
                    </AppText>
                    <View style={[styles.radioDot, styles.radioDotGrid, isSelected && styles.radioDotSelected]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

          </Animated.View>
        )}
        {/* STEP 5: GENERATING (LOADING) */}
        {step === "generating" && (
          <Animated.View 
            entering={reduceMotion ? undefined : FadeInRight.duration(240)}
            exiting={FadeOutLeft.duration(200)}
            style={[styles.contentWrap, { alignItems: "center", justifyContent: "center", paddingBottom: 100 }]}
          >
            <HugeiconsIcon icon={SparklesIcon} size={64} color={colors.foreground} />
            <AppText
              style={[styles.title, { marginTop: 24, fontSize: 32 }]}
              languageCode={selectedNativeLang}
              align="center"
              fullWidth
              latinRole="bold"
            >
              {copy.generatingTitle}
            </AppText>
            <AppText
              style={[styles.subtitle, { fontSize: 16 }]}
              languageCode={selectedNativeLang}
              align="center"
              fullWidth
            >
              {copy.generatingSubtitle}
            </AppText>
          </Animated.View>
        )}
      </ScrollView>

      {step !== "generating" ? (
        <OnboardingFooter
          label={continueLabel}
          locale={selectedNativeLang}
          bottomInset={insets.bottom}
          onPress={handleCurrentContinue}
          disabled={continueDisabled}
          hint={setupError ?? undefined}
          current={stepIndex + 3}
          total={9}
        />
      ) : null}
      </KeyboardAvoidingView>
    </View>
  );
}

function createStyles(colors: any, isDark: boolean, isCompact: boolean) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ONBOARDING_DESIGN.canvas,
  },
  keyboardAvoider: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: isCompact ? 18 : 24,
    paddingTop: isCompact ? 8 : 16,
    paddingBottom: isCompact ? 14 : 22,
  },
  contentWrap: {
    width: "100%",
    flexGrow: 1,
    flexShrink: 0,
    justifyContent: "flex-start",
    alignItems: "stretch",
    position: "relative",
    maxWidth: 640,
    alignSelf: "center",
  },
  choiceContentWrap: {
    flexGrow: 0,
    justifyContent: "flex-start",
  },
  ltrText: {
    textAlign: "left",
    writingDirection: "ltr",
  },
  rtlText: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  contentWrapKeyboard: {
    justifyContent: "center",
    paddingBottom: 24,
  },
  stepNumLabel: {
    fontSize: isCompact ? 13 : 15,
    fontWeight: "600",
    color: ONBOARDING_DESIGN.orange,
    letterSpacing: 0.4,
    marginBottom: isCompact ? 5 : 8,
    textAlign: "left",
  },
  title: {
    fontSize: isCompact ? 32 : 39,
    color: ONBOARDING_DESIGN.ink,
    textAlign: "left",
    lineHeight: isCompact ? 39 : 46,
    letterSpacing: isCompact ? -0.6 : -1,
    marginBottom: isCompact ? 10 : 14,
    width: "100%",
  },
  subtitle: {
    fontSize: isCompact ? 14 : 16,
    color: ONBOARDING_DESIGN.mutedInk,
    textAlign: "left",
    lineHeight: isCompact ? 20 : 23,
    marginBottom: isCompact ? 14 : 20,
    width: "100%",
  },

  // -- Mascot Visual --
  mascotVisualRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 20,
    marginBottom: 24,
  },
  mascotCol: {
    alignItems: "center",
    position: "relative",
  },
  speechBubble: {
    position: "absolute",
    top: -34,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  speechBubbleText: {
    fontSize: 11,
    fontFamily: "DINNextRoundedBold",
  },

  // -- Form Fields --
  inputForm: {
    width: "100%",
    gap: isCompact ? 10 : 14,
    marginBottom: 24,
    marginTop: isCompact ? 8 : 14,
  },
  inputBoxClean: {
    width: "100%",
    minHeight: isCompact ? 58 : 66,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: ONBOARDING_DESIGN.hairline,
    backgroundColor: ONBOARDING_DESIGN.paperRaised,
    justifyContent: "center",
  },
  textInputClean: {
    width: "100%",
    fontSize: isCompact ? 18 : 21,
    color: ONBOARDING_DESIGN.ink,
    fontFamily: "DINNextRoundedMedium",
    textAlign: "left",
  },

  // -- Options List --
  gridList: {
    width: "100%",
    gap: isCompact ? 8 : 10,
    marginBottom: 12,
  },
  languageList: {
    width: "100%",
    maxWidth: 640,
    alignSelf: "center",
    gap: isCompact ? 8 : 10,
    backgroundColor: "transparent",
    marginTop: 6,
    marginBottom: 4,
  },
  languageRow: {
    width: "100%",
    minHeight: isCompact ? 52 : 58,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: isCompact ? 14 : 16,
    paddingVertical: 8,
    borderRadius: 15,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: ONBOARDING_DESIGN.hairline,
    backgroundColor: ONBOARDING_DESIGN.paperRaised,
  },
  languageRowRtl: {
    flexDirection: "row-reverse",
  },
  languageRowSelected: {
    borderColor: ONBOARDING_DESIGN.orange,
    backgroundColor: "#FFF7ED",
  },
  languageCopy: {
    flex: 1,
    minWidth: 0,
  },
  languageName: {
    color: ONBOARDING_DESIGN.ink,
    fontSize: isCompact ? 16 : 17,
    lineHeight: isCompact ? 21 : 23,
    fontFamily: "DINNextRoundedBold",
  },
  languageRadio: {
    flexShrink: 0,
    marginRight: 0,
  },
  gridCard: {
    width: "100%",
    minHeight: isCompact ? 58 : 66,
    borderRadius: 16,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: ONBOARDING_DESIGN.hairline,
    backgroundColor: ONBOARDING_DESIGN.paperRaised,
    paddingHorizontal: isCompact ? 12 : 14,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  gridCardSelected: {
    borderColor: ONBOARDING_DESIGN.orange,
    backgroundColor: "#FFF7ED",
  },
  selectionRowRtl: {
    flexDirection: "row-reverse",
  },
  flagWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(15, 23, 42, 0.05)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  gridIconWrap: {
    width: isCompact ? 38 : 42,
    height: isCompact ? 38 : 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  gridCardTitle: {
    flex: 1,
    fontSize: isCompact ? 14 : 15,
    color: ONBOARDING_DESIGN.ink,
    fontFamily: "DINNextRoundedBold",
    lineHeight: 20,
  },
  gridCardSub: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontFamily: "DINNextRoundedMedium",
    marginTop: -6,
  },
  gridCardDesc: {
    fontSize: 11.5,
    color: colors.mutedForeground,
    lineHeight: 15,
  },
  gridCode: {
    alignSelf: "flex-start",
    overflow: "hidden",
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    backgroundColor: colors.muted,
    color: colors.mutedForeground,
    fontSize: 10.5,
    fontFamily: "DINNextRoundedBold",
  },
  kurdistanFlag: {
    width: 34,
    height: 24,
    borderRadius: 5,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.1)",
  },
  kurdistanBand: {
    flex: 1,
    width: "100%",
  },
  kurdistanSun: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 1,
    textAlign: "center",
    color: "#F9D423",
    fontSize: 16,
    lineHeight: 20,
  },
  optionsList: {
    width: "100%",
    gap: 10,
    marginBottom: 28,
  },
  optionRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: isDark ? colors.surface : "rgba(255, 255, 255, 0.4)",
  },
  optionRowSelected: {
    borderColor: isDark ? colors.primary : "rgba(0, 0, 0, 0.2)",
    backgroundColor: colors.surfaceRaised,
  },
  radioDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.mutedForeground,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioDotGrid: {
    marginRight: 0,
  },
  radioDotSelected: {
    borderColor: ONBOARDING_DESIGN.orange,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: ONBOARDING_DESIGN.orange,
  },
  flagEmoji: {
    fontSize: 25,
  },
  optionLabel: {
    flex: 1,
    fontSize: 15,
    color: colors.foreground,
    fontFamily: "DINNextRoundedBold",
  },
  optionLabelSelected: {
    color: colors.foreground,
  },
  codeTag: {
    backgroundColor: colors.muted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  codeTagText: {
    fontSize: 11,
    color: colors.mutedForeground,
    fontFamily: "DINNextRoundedBold",
  },

  // -- Goals List --
  goalRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: isDark ? colors.surface : "rgba(255, 255, 255, 0.4)",
  },
  goalRowSelected: {
    borderColor: isDark ? colors.primary : "rgba(0, 0, 0, 0.2)",
    backgroundColor: colors.surfaceRaised,
  },
  goalIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  goalInfoCol: {
    flex: 1,
    marginRight: 8,
  },
  goalTitle: {
    fontSize: 15,
    color: colors.foreground,
    fontFamily: "DINNextRoundedBold",
  },
  goalTitleSelected: {
    color: colors.foreground,
  },
  goalDesc: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  goalDescSelected: {
    color: colors.foreground,
  },

  desktopFrame: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
  },
  });
}
