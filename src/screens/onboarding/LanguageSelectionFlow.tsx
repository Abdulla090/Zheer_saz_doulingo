import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Airplane01Icon,
  Briefcase01Icon,
  Message01Icon,
  RocketIcon,
} from "@hugeicons/core-free-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Keyboard,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
// KeyboardProvider is mounted at the app root, so use this library's
// KeyboardAvoidingView. RN's own version fights the provider's soft-input
// handling on Android and can leave its offset applied after the keyboard hides.
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import Animated, {
  Easing,
  FadeIn,
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
  FadeOutRight,
  LinearTransition,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
  cancelAnimation,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText } from "../../components/ui/AppText";
import {
  LANGUAGES as LANGUAGE_CATALOG,
  SOURCE_LANGUAGES,
  getTargetLanguagesForSource,
} from "../../config/languages";
import { getMascotExpressionSource } from "../../constants/mascot-expressions";
import type { MascotExpression } from "../../constants/mascot-expressions";
import {
  resolveUserAge,
  type UserSex,
} from "../../constants/user-profile";
import { getSkippedUnitsCount } from "../../data/normal-english";
import { useLocaleStore } from "../../stores/useLocaleStore";
import { useProgressStore } from "../../stores/useProgressStore";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { hapticSelection } from "../../utils/haptics";
import { OnboardingFooter, OnboardingTopBar } from "./components/OnboardingChrome";
import { OnboardingFlag } from "./components/OnboardingFlag";
import {
  OnboardingLevelBars,
  OnboardingOptionRow,
} from "./components/OnboardingOptionRow";
import { OnboardingQuestion } from "./components/OnboardingQuestion";
import {
  OnboardingAgeSlider,
  OnboardingSexSelector,
} from "./components/OnboardingProfileControls";
import { OnboardingSkiaBg } from "./components/OnboardingSkiaBg";
import {
  useOnboardingMetrics,
  useOnboardingTheme,
  type OnboardingMetrics,
  type OnboardingTheme,
} from "./components/onboarding-theme";
import {
  ONBOARDING_TOTAL_STEPS,
  onboardingStepNumber,
} from "./onboarding-steps";

export type OnboardingSetupStep =
  | "nativeLanguage"
  | "targetLanguage"
  | "profile"
  | "level"
  | "goal"
  | "generating";

type Props = {
  onFinish: () => void;
  onBackToIntro: () => void;
  initialStep?: OnboardingSetupStep;
};

const ONBOARDING_COPY = {
  en: {
    profileTitle: "What's your name?",
    profileSubtitle: "We'll personalize your learning journey for you.",
    namePlaceholder: "Your Name",
    ageLabel: "Your age",
    sexLabel: "Sex",
    female: "Female",
    male: "Male",
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
    profileTitle: "ناوت چییە؟",
    profileSubtitle: "ڕێڕەوی فێربوونت بۆ خۆت تایبەت دەکەین.",
    namePlaceholder: "ناوت",
    ageLabel: "تەمەنت",
    sexLabel: "ڕەگەز",
    female: "مێ",
    male: "نێر",
    nativeLanguageTitle: "زمانی دایکت چیە؟",
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
    profileTitle: "ما اسمك؟",
    profileSubtitle: "سنخصص رحلة التعلم لك.",
    namePlaceholder: "اسمك",
    ageLabel: "عمرك",
    sexLabel: "الجنس",
    female: "أنثى",
    male: "ذكر",
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
    profileTitle: "¿Cómo te llamas?",
    profileSubtitle: "Personalizaremos tu aprendizaje.",
    namePlaceholder: "Tu nombre",
    ageLabel: "Tu edad",
    sexLabel: "Sexo",
    female: "Mujer",
    male: "Hombre",
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
    profileTitle: "Как тебя зовут?",
    profileSubtitle: "Мы настроим обучение под тебя.",
    namePlaceholder: "Твоё имя",
    ageLabel: "Твой возраст",
    sexLabel: "Пол",
    female: "Женский",
    male: "Мужской",
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
    icon: Message01Icon,
    color: "#8B5CF6",
    bg: "#F3F0FF",
    bgDark: "rgba(139, 92, 246, 0.20)",
  },
  {
    id: "travel",
    title: "Travel the World",
    icon: Airplane01Icon,
    color: "#0EA5E9",
    bg: "#E3F4FE",
    bgDark: "rgba(14, 165, 233, 0.20)",
  },
  {
    id: "career",
    title: "Advance My Career",
    icon: Briefcase01Icon,
    color: "#10B981",
    bg: "#E4FBF1",
    bgDark: "rgba(16, 185, 129, 0.20)",
  },
  {
    id: "challenge",
    title: "Challenge Myself",
    icon: RocketIcon,
    color: "#EC4899",
    bg: "#FDECF5",
    bgDark: "rgba(236, 72, 153, 0.20)",
  },
] as const;

/**
 * Levels, in curriculum order.
 *
 * Order is load-bearing here: the index drives how many bars the row's chart
 * fills, so this array must stay sorted beginner-first.
 */
const LEVELS = [
  { id: 2, label: "Beginner (A1)" },
  { id: 4, label: "Elementary (A2)" },
  { id: 6, label: "Intermediate (B1)" },
  { id: 8, label: "Upper-Intermediate (B2)" },
  { id: 10, label: "Advanced / Expert (C1/C2)" },
] as const;

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

/** The mascot reacts to what it is asking about. */
const STEP_EXPRESSION: Record<OnboardingSetupStep, MascotExpression> = {
  nativeLanguage: "happy",
  targetLanguage: "happy",
  profile: "encouraging",
  level: "thinking",
  goal: "winning",
  generating: "thinking",
};

const SETUP_SLIDE_EASE = Easing.bezier(0.22, 1, 0.36, 1);

export function LanguageSelectionFlow({
  onFinish,
  onBackToIntro,
  initialStep = "nativeLanguage",
}: Props) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const isCompact = screenWidth < 390 || screenHeight < 760;

  const theme = useOnboardingTheme();
  const metrics = useOnboardingMetrics(isCompact);
  const styles = useMemo(
    () => createStyles(theme, metrics, isCompact),
    [isCompact, metrics, theme],
  );

  const reduceMotion = useReducedMotion();
  const contentLayout =
    Platform.OS === "web"
      ? LinearTransition.duration(220)
      : LinearTransition.springify()
          .damping(28)
          .stiffness(340)
          .mass(0.55)
          .overshootClamping(1);

  // Stores
  const setUserName = useSettingsStore((s) => s.setUserName);
  const setUserAge = useSettingsStore((s) => s.setUserAge);
  const setUserSex = useSettingsStore((s) => s.setUserSex);
  const userName = useSettingsStore((s) => s.userName);
  const userAge = useSettingsStore((s) => s.userAge);
  const userSex = useSettingsStore((s) => s.userSex);
  const selectedMascotId = useSettingsStore((s) => s.selectedMascotId);
  const storedNativeLang = useLocaleStore((s) => s.selectedSourceLanguage);
  const storedTargetLang = useLocaleStore((s) => s.selectedTargetLanguage);
  const setLanguagePair = useLocaleStore((s) => s.setLanguagePair);
  const englishLevel = useSettingsStore((s) => s.englishLevel);
  const setEnglishLevel = useSettingsStore((s) => s.setEnglishLevel);
  const learningGoal = useSettingsStore((s) => s.learningGoal);
  const setLearningGoal = useSettingsStore((s) => s.setLearningGoal);
  const setPathMode = useSettingsStore((s) => s.setPathMode);

  const [step, setStep] = useState<OnboardingSetupStep>(initialStep);
  const [transitionDirection, setTransitionDirection] = useState<1 | -1>(1);
  const [selectedNativeLang, setSelectedNativeLang] = useState<string>(
    storedNativeLang || "ku",
  );
  const [selectedTargetLang, setSelectedTargetLang] = useState<string>(
    storedTargetLang || "en",
  );
  const [selectedLevel, setSelectedLevel] = useState<number>(
    LEVELS.some((level) => level.id === englishLevel) ? englishLevel : LEVELS[0].id,
  );
  const [selectedGoal, setSelectedGoal] = useState<string>(
    learningGoal || "conversations",
  );
  const [name, setName] = useState(userName || "");
  const [age, setAge] = useState(() => resolveUserAge(userAge));
  const [sex, setSex] = useState<UserSex | null>(userSex);
  const [focusedField, setFocusedField] = useState<"name" | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);

  const isRtl = selectedNativeLang === "ku" || selectedNativeLang === "ar";
  const copy =
    ONBOARDING_COPY[selectedNativeLang as keyof typeof ONBOARDING_COPY] ??
    ONBOARDING_COPY.en;
  const levelLabels = LEVEL_LABELS[selectedNativeLang] ?? LEVEL_LABELS.en;
  const goalLabels = GOAL_LABELS[selectedNativeLang] ?? GOAL_LABELS.en;
  const textDirectionStyle = isRtl ? styles.rtlText : styles.ltrText;

  const setupScrollRef = useRef<ScrollView>(null);

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

  // Force reset keyboard visibility when step changes away from profile
  useEffect(() => {
    if (step !== "profile") setKeyboardVisible(false);
  }, [step]);

  /*
   * Every question is a fresh page even though the same ScrollView is reused.
   * A lower option can move the container before it advances; carrying that
   * offset into the next page cropped its mascot/question on small screens.
   */
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setupScrollRef.current?.scrollTo({ x: 0, y: 0, animated: false });
      if (Platform.OS === "web") {
        // RN Web's fixed #root remains programmatically scrollable even though
        // its CSS overflow is hidden. Browser scroll-into-view can otherwise
        // move the whole app while clicking an option in an RTL transition.
        const rootElement = document.getElementById("root");
        if (rootElement) {
          rootElement.scrollLeft = 0;
          rootElement.scrollTop = 0;
        }
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [step]);

  const moveToStep = useCallback(
    (next: OnboardingSetupStep, direction: 1 | -1 = 1) => {
      setTransitionDirection(direction);
      setStep(next);
    },
    [],
  );

  const handleNativeLanguageSelect = useCallback(
    (langId: string) => {
      hapticSelection();
      setSelectedNativeLang(langId);
      const targets = getTargetLanguagesForSource(langId);
      setSelectedTargetLang((current) =>
        targets.some((language) => language.id === current)
          ? current
          : targets[0]?.id ?? "en",
      );
    },
    [],
  );

  const handleTargetLanguageSelect = useCallback(
    (langId: string) => {
      hapticSelection();
      setSelectedTargetLang(langId);
    },
    [],
  );

  const handleLevelSelect = useCallback(
    (levelId: number) => {
      hapticSelection();
      setSelectedLevel(levelId);
    },
    [],
  );

  const handleProfileContinue = useCallback(() => {
    if (!name.trim() || !sex) {
      if (Platform.OS !== "web") {
        void Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Error,
        ).catch(() => {});
      }
      return;
    }
    Keyboard.dismiss();
    setUserName(name.trim());
    setUserAge(String(age));
    setUserSex(sex);
    hapticSelection();
    moveToStep("level");
  }, [age, moveToStep, name, setUserAge, setUserName, setUserSex, sex]);

  const handleGoalContinue = useCallback(async () => {
    hapticSelection();
    setSetupError(null);
    moveToStep("generating");

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
      moveToStep("goal", -1);
      if (Platform.OS !== "web") {
        void Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Error,
        ).catch(() => {});
      }
    }
  }, [
    copy.setupError,
    moveToStep,
    onFinish,
    selectedGoal,
    selectedLevel,
    selectedNativeLang,
    selectedTargetLang,
    setEnglishLevel,
    setLanguagePair,
    setLearningGoal,
    setPathMode,
  ]);

  const onBack = useCallback(() => {
    hapticSelection();
    if (step === "generating") moveToStep("goal", -1);
    else if (step === "goal") moveToStep("level", -1);
    else if (step === "level") moveToStep("profile", -1);
    else if (step === "profile") moveToStep("targetLanguage", -1);
    else if (step === "targetLanguage") moveToStep("nativeLanguage", -1);
    else onBackToIntro();
  }, [moveToStep, onBackToIntro, step]);

  const progressStep = onboardingStepNumber(step);
  const backgroundX = useSharedValue(progressStep * screenWidth);
  useEffect(() => {
    const target = progressStep * screenWidth;
    backgroundX.value = reduceMotion
      ? target
      : withTiming(target, {
          duration: 320,
          easing: SETUP_SLIDE_EASE,
        });
  }, [backgroundX, progressStep, reduceMotion, screenWidth]);

  const enteringTransition =
    transitionDirection > 0
      ? isRtl
        ? FadeInLeft
        : FadeInRight
      : isRtl
        ? FadeInRight
        : FadeInLeft;
  const exitingTransition =
    transitionDirection > 0
      ? isRtl
        ? FadeOutRight
        : FadeOutLeft
      : isRtl
        ? FadeOutLeft
        : FadeOutRight;

  // Every user-controlled setup slide uses the same confirm action. Selection
  // and navigation are separate actions, preventing accidental advancement.
  const showFooter = step !== "generating";
  const continueLabel = step === "goal" ? copy.start : copy.continue;
  const continueDisabled = step === "profile" && (!name.trim() || !sex);
  const handleCurrentContinue = useCallback(() => {
    if (step === "nativeLanguage") {
      moveToStep("targetLanguage");
    } else if (step === "targetLanguage") {
      setLanguagePair(selectedNativeLang, selectedTargetLang);
      moveToStep("profile");
    } else if (step === "profile") {
      handleProfileContinue();
    } else if (step === "level") {
      setEnglishLevel(selectedLevel);
      moveToStep("goal");
    } else if (step === "goal") {
      void handleGoalContinue();
    }
  }, [
    handleGoalContinue,
    handleProfileContinue,
    moveToStep,
    selectedLevel,
    selectedNativeLang,
    selectedTargetLang,
    setEnglishLevel,
    setLanguagePair,
    step,
  ]);

  const question =
    step === "nativeLanguage"
      ? copy.nativeLanguageTitle
      : step === "targetLanguage"
        ? copy.targetLanguageTitle
        : step === "profile"
          ? copy.profileTitle
          : step === "level"
            ? copy.levelTitle(LANGUAGE_CATALOG[selectedTargetLang]?.nativeName ?? "")
            : copy.goalTitle;

  // Both language steps share one row layout; only their catalog and selected
  // value differ. Navigation is handled by the consistent footer action.
  const languageOptions =
    step === "nativeLanguage"
      ? { languages: SOURCE_LANGUAGES, selected: selectedNativeLang }
      : step === "targetLanguage"
        ? {
            languages: getTargetLanguagesForSource(selectedNativeLang),
            selected: selectedTargetLang,
          }
        : null;

  return (
    <View style={styles.root}>
      <OnboardingSkiaBg scrollX={backgroundX} />
      <OnboardingTopBar
        current={progressStep}
        total={ONBOARDING_TOTAL_STEPS}
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
          ref={setupScrollRef}
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View
            key={step}
            entering={
              reduceMotion
                ? undefined
                : enteringTransition.duration(320).easing(SETUP_SLIDE_EASE)
            }
            exiting={
              reduceMotion
                ? undefined
                : exitingTransition.duration(210).easing(Easing.in(Easing.quad))
            }
            layout={contentLayout}
            style={[
              styles.stepBlock,
              step === "generating" && styles.stepBlockCentered,
              keyboardVisible && step === "profile" && styles.stepBlockKeyboard,
            ]}
          >
            {step === "generating" ? (
              <GeneratingState
                mascotId={selectedMascotId}
                title={copy.generatingTitle}
                subtitle={copy.generatingSubtitle}
                locale={selectedNativeLang}
                theme={theme}
                metrics={metrics}
                reduceMotion={reduceMotion}
              />
            ) : (
              <>
                <OnboardingQuestion
                  question={question}
                  hint={step === "profile" ? copy.profileSubtitle : undefined}
                  locale={selectedNativeLang}
                  isRtl={isRtl}
                  theme={theme}
                  metrics={metrics}
                  mascotId={selectedMascotId}
                  expression={STEP_EXPRESSION[step]}
                />

                <View style={styles.options}>
                  {languageOptions
                    ? languageOptions.languages.map((language) => (
                        <OnboardingOptionRow
                          key={language.id}
                          testID={`onboarding-language-${language.id}`}
                          label={language.nativeName}
                          locale={language.id}
                          theme={theme}
                          metrics={metrics}
                          selected={languageOptions.selected === language.id}
                          onPress={() =>
                            step === "nativeLanguage"
                              ? handleNativeLanguageSelect(language.id)
                              : handleTargetLanguageSelect(language.id)
                          }
                          leading={
                            <OnboardingFlag
                              code={language.id}
                              borderColor={theme.border}
                            />
                          }
                        />
                      ))
                    : null}

                  {step === "profile" ? (
                    <>
                      <TextField
                        testID="onboarding-name"
                        value={name}
                        onChangeText={setName}
                        placeholder={copy.namePlaceholder}
                        focused={focusedField === "name"}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        theme={theme}
                        styles={styles}
                        textDirectionStyle={textDirectionStyle}
                        centered
                        returnKeyType="done"
                        onSubmitEditing={() => Keyboard.dismiss()}
                      />
                      <OnboardingAgeSlider
                        value={age}
                        onChange={setAge}
                        label={copy.ageLabel}
                        locale={selectedNativeLang}
                        theme={theme}
                      />
                      <OnboardingSexSelector
                        value={sex}
                        onChange={setSex}
                        label={copy.sexLabel}
                        femaleLabel={copy.female}
                        maleLabel={copy.male}
                        locale={selectedNativeLang}
                        theme={theme}
                      />
                    </>
                  ) : null}

                  {step === "level"
                    ? LEVELS.map((level, index) => {
                        const isSelected = selectedLevel === level.id;
                        return (
                          <OnboardingOptionRow
                            key={level.id}
                            testID={`onboarding-level-${level.id}`}
                            label={levelLabels[level.id] ?? level.label}
                            locale={selectedNativeLang}
                            theme={theme}
                            metrics={metrics}
                            selected={isSelected}
                            onPress={() => handleLevelSelect(level.id)}
                            leading={
                              <OnboardingLevelBars
                                filled={index + 1}
                                total={LEVELS.length}
                                theme={theme}
                                selected={isSelected}
                              />
                            }
                          />
                        );
                      })
                    : null}

                  {step === "goal"
                    ? GOALS.map((goal) => (
                        <OnboardingOptionRow
                          key={goal.id}
                          testID={`onboarding-goal-${goal.id}`}
                          label={goalLabels[goal.id] ?? goal.title}
                          locale={selectedNativeLang}
                          theme={theme}
                          metrics={metrics}
                          control="check"
                          selected={selectedGoal === goal.id}
                          onPress={() => {
                            hapticSelection();
                            setSelectedGoal(goal.id);
                          }}
                          leadingBackground={theme.isDark ? goal.bgDark : goal.bg}
                          leading={
                            <HugeiconsIcon
                              icon={goal.icon}
                              size={21}
                              color={goal.color}
                              strokeWidth={2.2}
                            />
                          }
                        />
                      ))
                    : null}
                </View>
              </>
            )}
          </Animated.View>
        </ScrollView>

        {showFooter ? (
          <OnboardingFooter
            label={continueLabel}
            locale={selectedNativeLang}
            bottomInset={insets.bottom}
            onPress={handleCurrentContinue}
            disabled={continueDisabled}
            hint={setupError ?? undefined}
          />
        ) : null}
      </KeyboardAvoidingView>
    </View>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * Text field
 * ──────────────────────────────────────────────────────────────────── */

function TextField({
  testID,
  value,
  onChangeText,
  placeholder,
  focused,
  onFocus,
  onBlur,
  theme,
  styles,
  textDirectionStyle,
  keyboardType,
  returnKeyType,
  centered = false,
  onSubmitEditing,
}: {
  testID: string;
  value: string;
  onChangeText: (next: string) => void;
  placeholder: string;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  theme: OnboardingTheme;
  styles: ReturnType<typeof createStyles>;
  textDirectionStyle: object;
  keyboardType?: "numeric";
  returnKeyType?: "next" | "done";
  centered?: boolean;
  onSubmitEditing?: () => void;
}) {
  /*
   * `underlineColorAndroid` + a transparent fill are both required, and neither
   * substitutes for the other. Android's `EditText` ships an inset rounded
   * background drawable *and* a bottom underline; styling only the wrapper left
   * both painting inside it, so the field rendered as a second pale box floating
   * within its own border.
   */
  return (
    <View style={[styles.inputBox, focused && styles.inputBoxFocused]}>
      <TextInput
        testID={testID}
        style={[
          styles.textInput,
          textDirectionStyle,
          centered && styles.textInputCentered,
          { outlineStyle: "none" } as any,
        ]}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor={theme.faintInk}
        selectionColor={theme.accent}
        underlineColorAndroid="transparent"
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        textContentType="name"
        autoComplete="name"
        autoCapitalize="words"
      />
    </View>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * Generating
 * ──────────────────────────────────────────────────────────────────── */

/**
 * The wait between "Let's get started" and the first lesson.
 *
 * A determinate bar would be a lie — nothing here reports real progress — so
 * this is an indeterminate shuttle. Under reduced motion it settles as a static
 * partial fill rather than looping, since a repeating animation is exactly what
 * that setting exists to suppress.
 */
function GeneratingState({
  mascotId,
  title,
  subtitle,
  locale,
  theme,
  metrics,
  reduceMotion,
}: {
  mascotId: string;
  title: string;
  subtitle: string;
  locale: string;
  theme: OnboardingTheme;
  metrics: OnboardingMetrics;
  reduceMotion: boolean;
}) {
  const shuttle = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      shuttle.value = 0.5;
      return;
    }
    shuttle.value = withRepeat(
      withTiming(1, { duration: 1150, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [reduceMotion, shuttle]);

  useEffect(() => () => cancelAnimation(shuttle), [shuttle]);

  const shuttleStyle = useAnimatedStyle(() => ({
    left: `${shuttle.value * 62}%`,
  }));

  const styles = useMemo(
    () => createGeneratingStyles(theme, metrics),
    [metrics, theme],
  );

  return (
    <Animated.View entering={FadeIn.duration(240)} style={styles.wrap}>
      <Image
        source={getMascotExpressionSource(mascotId, "thinking")}
        style={styles.mascot}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />

      <AppText
        style={styles.title}
        languageCode={locale}
        latinRole="bold"
        align="center"
        fullWidth
      >
        {title}
      </AppText>

      <AppText style={styles.subtitle} languageCode={locale} align="center" fullWidth>
        {subtitle}
      </AppText>

      <View style={styles.track} accessibilityRole="progressbar">
        <Animated.View style={[styles.shuttle, shuttleStyle]} />
      </View>
    </Animated.View>
  );
}

function createGeneratingStyles(theme: OnboardingTheme, metrics: OnboardingMetrics) {
  return StyleSheet.create({
    wrap: {
      width: "100%",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 8,
    },
    mascot: {
      width: metrics.mascotSize * 1.6,
      height: metrics.mascotSize * 1.6,
      marginBottom: 4,
    },
    title: {
      color: theme.ink,
      fontSize: 24,
      lineHeight: 31,
      letterSpacing: -0.5,
    },
    subtitle: {
      color: theme.mutedInk,
      fontSize: 15,
      lineHeight: 21,
      maxWidth: 360,
    },
    track: {
      width: "68%",
      maxWidth: 260,
      height: 6,
      borderRadius: 999,
      backgroundColor: theme.ringTrack,
      overflow: "hidden",
      marginTop: 8,
    },
    shuttle: {
      position: "absolute",
      top: 0,
      bottom: 0,
      width: "38%",
      borderRadius: 999,
      backgroundColor: theme.accent,
    },
  });
}

/* ────────────────────────────────────────────────────────────────────
 * Styles
 * ──────────────────────────────────────────────────────────────────── */

function createStyles(
  theme: OnboardingTheme,
  metrics: OnboardingMetrics,
  isCompact: boolean,
) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.canvas,
    },
    keyboardAvoider: {
      flex: 1,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: metrics.gutter,
      paddingTop: isCompact ? 4 : 10,
      paddingBottom: isCompact ? 18 : 26,
    },
    stepBlock: {
      width: "100%",
      maxWidth: metrics.maxWidth,
      alignSelf: "center",
      flexGrow: 1,
      gap: isCompact ? 16 : 20,
    },
    stepBlockCentered: {
      justifyContent: "center",
      alignItems: "center",
      paddingBottom: 64,
    },
    stepBlockKeyboard: {
      justifyContent: "flex-start",
    },
    options: {
      width: "100%",
      gap: metrics.rowGap,
    },
    ltrText: {
      textAlign: "left",
      writingDirection: "ltr",
    },
    rtlText: {
      textAlign: "right",
      writingDirection: "rtl",
    },
    inputBox: {
      width: "100%",
      minHeight: metrics.rowMinHeight,
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: metrics.rowRadius,
      borderCurve: "continuous",
      borderWidth: 1,
      borderBottomWidth: 4,
      borderColor: theme.border,
      borderBottomColor: theme.isDark ? "#0A1016" : "#CDD4DD",
      backgroundColor: theme.surface,
      justifyContent: "center",
    },
    inputBoxFocused: {
      borderColor: theme.accentBorder,
      borderBottomColor: theme.accentPressed,
      backgroundColor: theme.accentWash,
    },
    textInput: {
      width: "100%",
      fontSize: isCompact ? 17 : 19,
      color: theme.ink,
      fontFamily: "Rabar_044",
      textAlign: "left",
      backgroundColor: "transparent",
      // Android gives the control its own vertical padding on top of the box's.
      paddingVertical: 0,
      // The box owns the horizontal inset; the control must not add a second one.
      paddingHorizontal: 0,
    },
    textInputCentered: {
      textAlign: "center",
    },
  });
}
