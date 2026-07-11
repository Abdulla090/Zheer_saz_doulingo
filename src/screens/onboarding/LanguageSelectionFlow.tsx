import { useSettingsStore } from "../../stores/useSettingsStore";
import { useLocaleStore } from "../../stores/useLocaleStore";
import { hapticSelection } from "../../utils/haptics";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import Animated, {
  FadeInRight,
  FadeOutLeft,
  LinearTransition,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
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

type Step = "nativeLanguage" | "targetLanguage" | "profile" | "level" | "goal" | "generating";

type Props = {
  onFinish: () => void;
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
  },
} as const;

const LANGUAGES = [
  {
    id: "ku",
    label: "Kurdish",
    country: "Kurdistan",
    code: "KU",
    flag: require("../../../assets/images/flags/kurdistan.png"),
  },
  {
    id: "es",
    label: "Español",
    country: "Spain",
    code: "ES",
    flag: require("../../../assets/images/flags/es.png"),
  },
  {
    id: "ru",
    label: "Русский",
    country: "Russia",
    code: "RU",
    flag: require("../../../assets/images/flags/ru.png"),
  },
  {
    id: "ar",
    label: "العربية",
    country: "Saudi Arabia",
    code: "AR",
    flag: require("../../../assets/images/flags/sa.png"),
  },
  {
    id: "en",
    label: "English",
    country: "United States",
    code: "EN",
    flag: require("../../../assets/images/flags/us.png"),
  },
];

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

export function LanguageSelectionFlow({ onFinish }: Props) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();

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

  const [step, setStep] = useState<Step>("nativeLanguage");
  const [selectedNativeLang, setSelectedNativeLang] = useState<string>(storedNativeLang || "ku");
  const [selectedTargetLang, setSelectedTargetLang] = useState<string>(storedTargetLang || "en");
  const [selectedLevel, setSelectedLevel] = useState<number>(englishLevel || 5);
  const [selectedGoal, setSelectedGoal] = useState<string>("conversations");
  const [name, setName] = useState(userName || "");
  const [age, setAge] = useState(userAge || "");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
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
      const fallbackTarget = selectedNativeLang === "en" ? "ku" : "en";
      setSelectedTargetLang(fallbackTarget);
    }
    setStep("targetLanguage");
  }, [selectedNativeLang, selectedTargetLang]);

  const handleTargetLanguageContinue = useCallback(() => {
    hapticSelection();
    setStep("profile");
  }, []);

  const handleNativeLanguageSelect = useCallback((langId: string) => {
    hapticSelection();
    setSelectedNativeLang(langId);
  }, []);

  const handleTargetLanguageSelect = useCallback((langId: string) => {
    hapticSelection();
    setSelectedTargetLang(langId);
  }, []);

  const handleLevelContinue = useCallback(() => {
    hapticSelection();
    setEnglishLevel(selectedLevel);
    setStep("goal");
  }, [selectedLevel, setEnglishLevel]);

  const setPathMode = useSettingsStore((s) => s.setPathMode);

  const handleGoalContinue = useCallback(async () => {
    hapticSelection();
    setStep("generating");
    
    try {
      // Simulate AI path organization delay (1.5 seconds)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const skipCount = getSkippedUnitsCount(selectedLevel);
      const initialIndex = skipCount * 10;
      const langPair = `${selectedNativeLang}-${selectedTargetLang}`;
      
      // Initialize normal progress in the store
      useProgressStore.getState().initializeNormalProgress(langPair, initialIndex);
      
      setEnglishLevel(selectedLevel);
      setLanguagePair(selectedNativeLang, selectedTargetLang);
      setPathMode("normal");
    } catch (err) {
      console.warn("Failed to initialize path:", err);
    }
    
    onFinish();
  }, [
    selectedNativeLang,
    selectedTargetLang,
    selectedLevel,
    setLanguagePair,
    setPathMode,
    setEnglishLevel,
    onFinish,
  ]);

  const onBack = useCallback(() => {
    hapticSelection();
    if (step === "goal") setStep("level");
    else if (step === "level") setStep("profile");
    else if (step === "profile") setStep("targetLanguage");
    else if (step === "targetLanguage") setStep("nativeLanguage");
  }, [step]);

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

  // Background animated gradient
  const bgScrollX = useSharedValue(0);
  React.useEffect(() => {
    let targetIndex = stepIndex - 1;
    bgScrollX.value = withTiming(targetIndex * screenWidth, { duration: 600 });
  }, [stepIndex, screenWidth, bgScrollX]);

  return (
    <View style={styles.root}>
      <OnboardingSkiaBg scrollX={bgScrollX} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoider}
      >
      {/* HEADER: Back Button & Step Indicators */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20), flexDirection: "row" }]}>
        <View style={[styles.headerLeft, { alignItems: isRtl ? "flex-end" : "flex-start" }]}>
          {step !== "nativeLanguage" ? (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <HugeiconsIcon
                icon={isRtl ? ArrowRight01Icon : ArrowLeft01Icon}
                size={22}
                color="#0F172A"
                strokeWidth={2.5}
              />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 40 }} />
          )}
        </View>
        <View style={styles.headerCenter}>
          <View style={styles.stepIndicatorRow}>
            {Array.from({ length: 5 }, (_, index) => (
              <View
                key={index}
                style={[
                  styles.stepLine,
                  stepIndex >= index + 1 && styles.stepLineActive,
                ]}
              />
            ))}
          </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        scrollEnabled={true}
        alwaysBounceVertical={true}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom:
              Math.max(insets.bottom, 24) + (keyboardVisible ? 120 : 20),
          },
        ]}
      >
        {/* STEP 1: NATIVE LANGUAGE */}
        {step === "nativeLanguage" && (
          <Animated.View
            entering={FadeInRight.springify().damping(20).stiffness(90)}
            exiting={FadeOutLeft.duration(200)}
            layout={LinearTransition.springify()}
            style={[styles.contentWrap, styles.choiceContentWrap]}
          >
            <Text style={[styles.stepNumLabel, textDirectionStyle]}>{copy.step(1)}</Text>
            <Text style={[styles.title, textDirectionStyle]}>{copy.nativeLanguageTitle}</Text>
            <View style={styles.gridList}>
              {LANGUAGES.map((l) => {
                const isSelected = selectedNativeLang === l.id;
                return (
                  <TouchableOpacity
                    key={l.id}
                    style={[
                      styles.gridCard,
                      styles.flagGridCard,
                      isSelected && styles.gridCardSelected,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => handleNativeLanguageSelect(l.id)}
                  >
                    <Image
                      source={l.flag}
                      style={styles.flagImage}
                      contentFit="cover"
                    />
                    <View style={styles.flagShade} />
                    <View style={[styles.radioDot, styles.radioDotGrid, styles.flagRadio, isSelected && styles.radioDotSelected]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <View style={styles.flagLabelPanel}>
                      <Text style={styles.flagLanguageLabel}>{l.label}</Text>
                      <Text style={styles.flagCountryLabel}>{l.country}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[
                styles.primaryButton,
                styles.bottomButton,
                isRtl && styles.primaryButtonRtl,
              ]}
              activeOpacity={0.85}
              onPress={handleNativeLanguageContinue}
            >
              <Text style={styles.primaryButtonText}>{copy.continue}</Text>
              <HugeiconsIcon icon={ArrowRight01Icon} size={20} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* STEP 2: TARGET LANGUAGE */}
        {step === "targetLanguage" && (
          <Animated.View 
            entering={FadeInRight.springify().damping(20).stiffness(90)} 
            exiting={FadeOutLeft.duration(200)}
            layout={LinearTransition.springify()}
            style={[styles.contentWrap, styles.choiceContentWrap]}
          >
            <Text style={[styles.stepNumLabel, textDirectionStyle]}>{copy.step(2)}</Text>
            <Text style={[styles.title, textDirectionStyle]}>{copy.targetLanguageTitle}</Text>
            <View style={styles.gridList}>
              {LANGUAGES.map((l) => {
                const isSelected = selectedTargetLang === l.id;
                return (
                  <TouchableOpacity
                    key={l.id}
                    style={[
                      styles.gridCard,
                      styles.flagGridCard,
                      isSelected && styles.gridCardSelected,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => handleTargetLanguageSelect(l.id)}
                  >
                    <Image
                      source={l.flag}
                      style={styles.flagImage}
                      contentFit="cover"
                    />
                    <View style={styles.flagShade} />
                    <View style={[styles.radioDot, styles.radioDotGrid, styles.flagRadio, isSelected && styles.radioDotSelected]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <View style={styles.flagLabelPanel}>
                      <Text style={styles.flagLanguageLabel}>{l.label}</Text>
                      <Text style={styles.flagCountryLabel}>{l.country}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[
                styles.primaryButton,
                styles.bottomButton,
                isRtl && styles.primaryButtonRtl,
              ]}
              activeOpacity={0.85}
              onPress={handleTargetLanguageContinue}
            >
              <Text style={styles.primaryButtonText}>{copy.continue}</Text>
              <HugeiconsIcon icon={ArrowRight01Icon} size={20} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* STEP 3: PROFILE NAME & AGE */}
        {step === "profile" && (
          <Animated.View 
            entering={FadeInRight.springify().damping(20).stiffness(90)} 
            exiting={FadeOutLeft.duration(200)}
            layout={LinearTransition.springify()}
            style={[
              styles.contentWrap,
              keyboardVisible && styles.contentWrapKeyboard,
            ]}
          >
            <Text style={[styles.stepNumLabel, textDirectionStyle]}>{copy.step(3)}</Text>
            <Text style={[styles.title, textDirectionStyle]}>{copy.profileTitle}</Text>
            <Text style={[styles.subtitle, textDirectionStyle]}>{copy.profileSubtitle}</Text>



            <View style={styles.inputForm}>
              <View style={styles.inputBoxClean}>
                <TextInput
                  style={[styles.textInputClean, textDirectionStyle, { outlineStyle: "none" } as any]}
                  value={name}
                  onChangeText={setName}
                  placeholder={copy.namePlaceholder}
                  placeholderTextColor="rgba(0, 0, 0, 0.3)"
                  selectionColor="#0F172A"
                />
              </View>

              <View style={styles.inputBoxClean}>
                <TextInput
                  style={[styles.textInputClean, textDirectionStyle, { outlineStyle: "none" } as any]}
                  value={age}
                  onChangeText={setAge}
                  placeholder={copy.agePlaceholder}
                  placeholderTextColor="rgba(0, 0, 0, 0.3)"
                  keyboardType="numeric"
                  selectionColor="#0F172A"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.primaryButton,
                isRtl && styles.primaryButtonRtl,
                !name.trim() && styles.primaryButtonDisabled,
              ]}
              activeOpacity={0.85}
              onPress={handleProfileContinue}
              disabled={!name.trim()}
            >
              <Text style={styles.primaryButtonText}>{copy.continue}</Text>
              <HugeiconsIcon icon={ArrowRight01Icon} size={20} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* STEP 4: LEVEL SELECTION */}
        {step === "level" && (
          <Animated.View 
            entering={FadeInRight.springify().damping(20).stiffness(90)} 
            exiting={FadeOutLeft.duration(200)}
            layout={LinearTransition.springify()}
            style={[styles.contentWrap, styles.choiceContentWrap]}
          >
            <Text style={[styles.stepNumLabel, textDirectionStyle]}>{copy.step(5)}</Text>
            <Text style={[styles.title, textDirectionStyle]}>
              {copy.levelTitle(LANGUAGES.find((l) => l.id === selectedTargetLang)?.label ?? "")}
            </Text>



            <View style={styles.gridList}>
              {LEVELS.map((lvl) => {
                const isSelected = selectedLevel === lvl.id;
                return (
                  <TouchableOpacity
                    key={lvl.id}
                    style={[styles.gridCard, isSelected && styles.gridCardSelected]}
                    activeOpacity={0.8}
                    onPress={() => setSelectedLevel(lvl.id)}
                  >
                    <View style={styles.gridCardTop}>
                      <View style={[styles.gridIconWrap, { backgroundColor: "#EFF6FF" }]}>
                        <HugeiconsIcon icon={lvl.icon} size={22} color="#2563EB" strokeWidth={2} />
                      </View>
                      <View style={[styles.radioDot, styles.radioDotGrid, isSelected && styles.radioDotSelected]}>
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                    </View>
                    <Text style={[styles.gridCardTitle, textDirectionStyle, isSelected && styles.goalTitleSelected]}>
                      {levelLabels[lvl.id] ?? lvl.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[
                styles.primaryButton,
                styles.bottomButton,
                isRtl && styles.primaryButtonRtl,
              ]}
              activeOpacity={0.85}
              onPress={handleLevelContinue}
            >
              <Text style={styles.primaryButtonText}>{copy.continue}</Text>
              <HugeiconsIcon icon={ArrowRight01Icon} size={20} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* STEP 5: MAIN GOAL SELECTION */}
        {step === "goal" && (
          <Animated.View 
            entering={FadeInRight.springify().damping(20).stiffness(90)} 
            exiting={FadeOutLeft.duration(200)}
            layout={LinearTransition.springify()}
            style={[styles.contentWrap, styles.choiceContentWrap]}
          >
            <Text style={[styles.stepNumLabel, textDirectionStyle]}>{copy.step(4)}</Text>
            <Text style={[styles.title, textDirectionStyle]}>{copy.goalTitle}</Text>



            <View style={styles.gridList}>
              {GOALS.map((g) => {
                const isSelected = selectedGoal === g.id;
                return (
                  <TouchableOpacity
                    key={g.id}
                    style={[styles.gridCard, isSelected && styles.gridCardSelected]}
                    activeOpacity={0.8}
                    onPress={() => setSelectedGoal(g.id)}
                  >
                    <View style={styles.gridCardTop}>
                      <View style={[styles.gridIconWrap, { backgroundColor: g.bg }]}>
                        <HugeiconsIcon icon={g.icon} size={22} color={g.color} strokeWidth={2.5} />
                      </View>
                      <View style={[styles.radioDot, styles.radioDotGrid, isSelected && styles.radioDotSelected]}>
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                    </View>
                    <Text style={[styles.gridCardTitle, textDirectionStyle, isSelected && styles.goalTitleSelected]}>
                      {goalLabels[g.id] ?? g.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[
                styles.primaryButton,
                styles.bottomButton,
                isRtl && styles.primaryButtonRtl,
              ]}
              activeOpacity={0.85}
              onPress={handleGoalContinue}
            >
              <Text style={styles.primaryButtonText}>{copy.start}</Text>
              <HugeiconsIcon icon={ArrowRight01Icon} size={20} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
          </Animated.View>
        )}
        {/* STEP 5: GENERATING (LOADING) */}
        {step === "generating" && (
          <Animated.View 
            entering={FadeInRight.springify().damping(20).stiffness(90)} 
            exiting={FadeOutLeft.duration(200)}
            style={[styles.contentWrap, { alignItems: "center", justifyContent: "center", paddingBottom: 100 }]}
          >
            <HugeiconsIcon icon={SparklesIcon} size={64} color="#0F172A" />
            <Text style={[styles.title, { textAlign: "center", marginTop: 24, fontSize: 32 }]}>
              Generating your personalized path...
            </Text>
            <Text style={[styles.subtitle, { textAlign: "center", fontSize: 16 }]}>
              Building content tailored for your goals and level.
            </Text>
          </Animated.View>
        )}
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "transparent",
  },
  keyboardAvoider: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    width: 40,
    alignItems: "flex-start",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  stepIndicatorRow: {
    flexDirection: "row",
    gap: 8,
    width: 100,
    justifyContent: "center",
  },
  stepLine: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  stepLineActive: {
    backgroundColor: "#0F172A",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 14,
  },
  contentWrap: {
    width: "100%",
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "stretch",
    position: "relative",
  },
  choiceContentWrap: {
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
    fontSize: 12,
    fontWeight: "800",
    color: "rgba(0, 0, 0, 0.6)",
    letterSpacing: 1.2,
    marginBottom: 8,
    textAlign: "left",
  },
  title: {
    fontSize: 24,
    color: "#0F172A",
    textAlign: "left",
    fontFamily: "DINNextRoundedBold",
    lineHeight: 29,
    marginBottom: 8,
    width: "100%",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.5)",
    textAlign: "left",
    lineHeight: 20,
    marginBottom: 16,
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
    backgroundColor: "#FFFFFF",
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
    gap: 16,
    marginBottom: 32,
    marginTop: 16,
  },
  inputBoxClean: {
    width: "100%",
    paddingVertical: 4,
  },
  textInputClean: {
    width: "100%",
    fontSize: 32,
    color: "#0F172A",
    fontFamily: "DINNextRoundedBold",
    textAlign: "left",
  },

  // -- Options List --
  gridList: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  gridCard: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
    backgroundColor: "rgba(255, 255, 255, 0.48)",
    padding: 12,
    justifyContent: "space-between",
    marginBottom: 12,
  },
  flagGridCard: {
    padding: 0,
    overflow: "hidden",
    backgroundColor: "rgba(15, 23, 42, 0.08)",
  },
  gridCardSelected: {
    borderColor: "rgba(15, 23, 42, 0.35)",
    borderWidth: 2,
    backgroundColor: "#FFFFFF",
  },
  flagImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  flagShade: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 23, 42, 0.05)",
  },
  flagRadio: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.86)",
    borderColor: "rgba(15, 23, 42, 0.55)",
    zIndex: 3,
  },
  flagLabelPanel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 10,
    paddingTop: 18,
    paddingBottom: 10,
    backgroundColor: "rgba(15, 23, 42, 0.32)",
  },
  flagLanguageLabel: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "DINNextRoundedBold",
    lineHeight: 18,
  },
  flagCountryLabel: {
    color: "rgba(255, 255, 255, 0.78)",
    fontSize: 11,
    fontFamily: "DINNextRoundedMedium",
    marginTop: 1,
  },
  gridCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  gridCardTitle: {
    fontSize: 15,
    color: "#0F172A",
    fontFamily: "DINNextRoundedBold",
    lineHeight: 18,
  },
  gridCardSub: {
    fontSize: 12,
    color: "rgba(15, 23, 42, 0.55)",
    fontFamily: "DINNextRoundedMedium",
    marginTop: -6,
  },
  gridCardDesc: {
    fontSize: 11.5,
    color: "rgba(15, 23, 42, 0.55)",
    lineHeight: 15,
  },
  gridCode: {
    alignSelf: "flex-start",
    overflow: "hidden",
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    backgroundColor: "rgba(15, 23, 42, 0.06)",
    color: "rgba(15, 23, 42, 0.58)",
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
    borderColor: "rgba(0, 0, 0, 0.05)",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  optionRowSelected: {
    borderColor: "rgba(0, 0, 0, 0.2)",
    backgroundColor: "#FFFFFF",
  },
  radioDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioDotGrid: {
    marginRight: 0,
  },
  radioDotSelected: {
    borderColor: "#0F172A",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0F172A",
  },
  flagEmoji: {
    fontSize: 25,
  },
  optionLabel: {
    flex: 1,
    fontSize: 15,
    color: "#0F172A",
    fontFamily: "DINNextRoundedBold",
  },
  optionLabelSelected: {
    color: "#000000",
  },
  codeTag: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  codeTagText: {
    fontSize: 11,
    color: "rgba(0, 0, 0, 0.6)",
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
    borderColor: "rgba(0, 0, 0, 0.05)",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  goalRowSelected: {
    borderColor: "rgba(0, 0, 0, 0.2)",
    backgroundColor: "#FFFFFF",
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
    color: "#0F172A",
    fontFamily: "DINNextRoundedBold",
  },
  goalTitleSelected: {
    color: "#000000",
  },
  goalDesc: {
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.5)",
    marginTop: 2,
  },
  goalDescSelected: {
    color: "rgba(0, 0, 0, 0.8)",
  },

  // -- Primary Action Button --
  primaryButton: {
    width: "100%",
    backgroundColor: "#2563EB",
    height: 54,
    borderRadius: 27,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderBottomWidth: 4,
    borderBottomColor: "#1D4ED8",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonRtl: {
    flexDirection: "row-reverse",
  },
  bottomButton: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 22,
  },
  primaryButtonDisabled: {
    backgroundColor: "#94A3B8",
    borderBottomColor: "#64748B",
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "DINNextRoundedBold",
  },
});
