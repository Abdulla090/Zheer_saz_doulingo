import { useSettingsStore } from "../../stores/useSettingsStore";
import { useLocaleStore } from "../../stores/useLocaleStore";
import { hapticSelection } from "../../utils/haptics";
import * as Haptics from "expo-haptics";
import React, { useCallback, useState } from "react";
import {
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Message01Icon,
  Airplane01Icon,
  BookOpen02Icon,
  SparklesIcon,
  EarthIcon,
  Sun01Icon,
  LeafIcon,
  BotMessageSquareIcon,
  RocketIcon,
  CloudLightningIcon
} from "@hugeicons/core-free-icons";
import { OnboardingSkiaBg } from "./components/OnboardingSkiaBg";
import { useProgressStore } from "../../stores/useProgressStore";
import { getSkippedUnitsCount } from "../../data/normal-english";

type Step = "profile" | "language" | "level" | "goal" | "generating";

type Props = {
  onFinish: () => void;
};

const LANGUAGES = [
  { id: "ku", label: "Kurdish (Soranî)", code: "KU", icon: Sun01Icon },
  { id: "es", label: "Español", code: "ES", icon: EarthIcon },
  { id: "ru", label: "Русский", code: "RU", icon: EarthIcon },
  { id: "ar", label: "العربية", code: "AR", icon: EarthIcon },
  { id: "en", label: "English", code: "EN", icon: EarthIcon },
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

export function LanguageSelectionFlow({ onFinish }: Props) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();

  // Stores
  const setUserName = useSettingsStore((s) => s.setUserName);
  const setUserAge = useSettingsStore((s) => s.setUserAge);
  const userName = useSettingsStore((s) => s.userName);
  const userAge = useSettingsStore((s) => s.userAge);
  const setLanguagePair = useLocaleStore((s) => s.setLanguagePair);
  const englishLevel = useSettingsStore((s) => s.englishLevel);
  const setEnglishLevel = useSettingsStore((s) => s.setEnglishLevel);

  const [step, setStep] = useState<Step>("profile");
  const [selectedLang, setSelectedLang] = useState<string>("en");
  const [selectedLevel, setSelectedLevel] = useState<number>(englishLevel || 5);
  const [selectedGoal, setSelectedGoal] = useState<string>("conversations");
  const [name, setName] = useState(userName || "");
  const [age, setAge] = useState(userAge || "");
  const isRtl = selectedLang === "ku" || selectedLang === "ar";

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
    setStep("language");
  }, [name, age, setUserName, setUserAge]);

  const handleLanguageContinue = useCallback(() => {
    hapticSelection();
    const nativeLang = selectedLang === "ku" ? "en" : "ku";
    setLanguagePair(nativeLang, selectedLang);
    setStep("level");
  }, [selectedLang, setLanguagePair]);

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
      const nativeLang = selectedLang === "ku" ? "en" : "ku";
      const langPair = `${nativeLang}-${selectedLang}`;
      
      // Initialize normal progress in the store
      useProgressStore.getState().initializeNormalProgress(langPair, initialIndex);
      
      setEnglishLevel(selectedLevel);
      setPathMode("normal");
    } catch (err) {
      console.warn("Failed to initialize path:", err);
    }
    
    onFinish();
  }, [selectedLang, selectedLevel, setPathMode, setEnglishLevel, onFinish]);

  const onBack = useCallback(() => {
    hapticSelection();
    if (step === "goal") setStep("level");
    else if (step === "level") setStep("language");
    else if (step === "language") setStep("profile");
  }, [step]);

  const stepIndex = step === "profile" ? 1 : step === "language" ? 2 : step === "level" ? 3 : 4;

  // Background animated gradient
  const bgScrollX = useSharedValue(0);
  React.useEffect(() => {
    let targetIndex = stepIndex - 1;
    bgScrollX.value = withTiming(targetIndex * screenWidth, { duration: 600 });
  }, [stepIndex, screenWidth, bgScrollX]);

  return (
    <View style={styles.root}>
      <OnboardingSkiaBg scrollX={bgScrollX} />
      {/* HEADER: Back Button & Step Indicators */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20), flexDirection: isRtl ? "row-reverse" : "row" }]}>
        <View style={[styles.headerLeft, { alignItems: isRtl ? "flex-end" : "flex-start" }]}>
          {step !== "profile" ? (
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
            <View style={[styles.stepLine, stepIndex >= 1 && styles.stepLineActive]} />
            <View style={[styles.stepLine, stepIndex >= 2 && styles.stepLineActive]} />
            <View style={[styles.stepLine, stepIndex >= 3 && styles.stepLineActive]} />
            <View style={[styles.stepLine, stepIndex >= 4 && styles.stepLineActive]} />
          </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 20 },
        ]}
      >
        {/* STEP 1: PROFILE NAME & AGE */}
        {step === "profile" && (
          <Animated.View 
            entering={FadeInRight.springify().damping(20).stiffness(90)} 
            exiting={FadeOutLeft.duration(200)}
            layout={LinearTransition.springify()}
            style={styles.contentWrap}
          >
            <Text style={styles.stepNumLabel}>STEP 1 OF 4</Text>
            <Text style={styles.title}>{"What's your name?"}</Text>
            <Text style={styles.subtitle}>{"We'll personalize your learning journey for you."}</Text>



            <View style={styles.inputForm}>
              <View style={styles.inputBoxClean}>
                <TextInput
                  style={[styles.textInputClean, { outlineStyle: "none" } as any]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Your Name"
                  placeholderTextColor="rgba(0, 0, 0, 0.3)"
                  selectionColor="#0F172A"
                />
              </View>

              <View style={styles.inputBoxClean}>
                <TextInput
                  style={[styles.textInputClean, { outlineStyle: "none" } as any]}
                  value={age}
                  onChangeText={setAge}
                  placeholder="Your Age (optional)"
                  placeholderTextColor="rgba(0, 0, 0, 0.3)"
                  keyboardType="numeric"
                  selectionColor="#0F172A"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, !name.trim() && styles.primaryButtonDisabled]}
              activeOpacity={0.85}
              onPress={handleProfileContinue}
              disabled={!name.trim()}
            >
              <Text style={styles.primaryButtonText}>Continue</Text>
              <HugeiconsIcon icon={ArrowRight01Icon} size={20} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* STEP 2: LANGUAGE SELECTION */}
        {step === "language" && (
          <Animated.View 
            entering={FadeInRight.springify().damping(20).stiffness(90)} 
            exiting={FadeOutLeft.duration(200)}
            layout={LinearTransition.springify()}
            style={styles.contentWrap}
          >
            <Text style={styles.stepNumLabel}>STEP 2 OF 4</Text>
            <Text style={styles.title}>Which language would you like to learn?</Text>
            <Text style={styles.subtitle}>You can always add more languages later.</Text>



            <View style={styles.optionsList}>
              {LANGUAGES.map((l) => {
                const isSelected = selectedLang === l.id;
                return (
                  <TouchableOpacity
                    key={l.id}
                    style={[styles.optionRow, isSelected && styles.optionRowSelected]}
                    activeOpacity={0.8}
                    onPress={() => setSelectedLang(l.id)}
                  >
                    <View style={[styles.radioDot, isSelected && styles.radioDotSelected]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <View style={styles.goalIconWrap}>
                      <HugeiconsIcon icon={l.icon} size={24} color="#64748B" strokeWidth={2} />
                    </View>
                    <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                      {l.label}
                    </Text>
                    <View style={styles.codeTag}>
                      <Text style={styles.codeTagText}>{l.code}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.85}
              onPress={handleLanguageContinue}
            >
              <Text style={styles.primaryButtonText}>Continue</Text>
              <HugeiconsIcon icon={ArrowRight01Icon} size={20} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* STEP 3: LEVEL SELECTION */}
        {step === "level" && (
          <Animated.View 
            entering={FadeInRight.springify().damping(20).stiffness(90)} 
            exiting={FadeOutLeft.duration(200)}
            layout={LinearTransition.springify()}
            style={styles.contentWrap}
          >
            <Text style={styles.stepNumLabel}>STEP 3 OF 4</Text>
            <Text style={styles.title}>
              What is your current level in {LANGUAGES.find((l) => l.id === selectedLang)?.label.split(" ")[0]}?
            </Text>
            <Text style={styles.subtitle}>Select your current speaking & listening level.</Text>



            <View style={styles.optionsList}>
              {LEVELS.map((lvl) => {
                const isSelected = selectedLevel === lvl.id;
                return (
                  <TouchableOpacity
                    key={lvl.id}
                    style={[styles.goalRow, isSelected && styles.goalRowSelected]}
                    activeOpacity={0.8}
                    onPress={() => setSelectedLevel(lvl.id)}
                  >
                    <View style={[styles.goalIconWrap, { backgroundColor: "#EFF6FF" }]}>
                      <HugeiconsIcon icon={lvl.icon} size={20} color="#2563EB" strokeWidth={2} />
                    </View>
                    <View style={styles.goalInfoCol}>
                      <Text style={[styles.goalTitle, isSelected && styles.goalTitleSelected]}>
                        {lvl.label}
                      </Text>
                      <Text style={styles.goalDesc}>{lvl.desc}</Text>
                    </View>
                    <View style={[styles.radioDot, isSelected && styles.radioDotSelected]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.85}
              onPress={handleLevelContinue}
            >
              <Text style={styles.primaryButtonText}>Continue</Text>
              <HugeiconsIcon icon={ArrowRight01Icon} size={20} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* STEP 4: MAIN GOAL SELECTION */}
        {step === "goal" && (
          <Animated.View 
            entering={FadeInRight.springify().damping(20).stiffness(90)} 
            exiting={FadeOutLeft.duration(200)}
            layout={LinearTransition.springify()}
            style={styles.contentWrap}
          >
            <Text style={styles.stepNumLabel}>STEP 4 OF 4</Text>
            <Text style={styles.title}>{"What's your main goal?"}</Text>
            <Text style={styles.subtitle}>{"We'll personalize your journey based on your goal."}</Text>



            <View style={styles.optionsList}>
              {GOALS.map((g) => {
                const isSelected = selectedGoal === g.id;
                return (
                  <TouchableOpacity
                    key={g.id}
                    style={[styles.goalRow, isSelected && styles.goalRowSelected]}
                    activeOpacity={0.8}
                    onPress={() => setSelectedGoal(g.id)}
                  >
                    <View style={[styles.goalIconWrap, { backgroundColor: g.bg }]}>
                      <HugeiconsIcon icon={g.icon} size={20} color={g.color} strokeWidth={2.5} />
                    </View>
                    <View style={styles.goalInfoCol}>
                      <Text style={[styles.goalTitle, isSelected && styles.goalTitleSelected]}>
                        {g.title}
                      </Text>
                      <Text style={styles.goalDesc}>{g.desc}</Text>
                    </View>
                    <View style={[styles.radioDot, isSelected && styles.radioDotSelected]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.85}
              onPress={handleGoalContinue}
            >
              <Text style={styles.primaryButtonText}>{"Let's Get Started"}</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "transparent",
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
    paddingTop: 24,
  },
  contentWrap: {
    width: "100%",
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "stretch",
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
    fontSize: 26,
    color: "#0F172A",
    textAlign: "left",
    fontFamily: "DINNextRoundedBold",
    lineHeight: 32,
    marginBottom: 8,
    width: "100%",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.5)",
    textAlign: "left",
    lineHeight: 20,
    marginBottom: 24,
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
    borderBottomWidth: 2,
    borderBottomColor: "rgba(0, 0, 0, 0.2)",
    paddingVertical: 8,
  },
  textInputClean: {
    width: "100%",
    fontSize: 32,
    color: "#0F172A",
    fontFamily: "DINNextRoundedBold",
    textAlign: "left",
  },

  // -- Options List --
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
    fontSize: 22,
    marginRight: 12,
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
