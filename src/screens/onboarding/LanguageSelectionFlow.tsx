import { useI18n } from "../../hooks/useI18n";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { useLocaleStore } from "../../stores/useLocaleStore";
import { hapticSelection } from "../../utils/haptics";
import * as Haptics from "expo-haptics";
import React, { useCallback, useMemo, useState } from "react";
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
  FadeInDown,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  UserIcon,
  Calendar01Icon,
  Message01Icon,
  Airplane01Icon,
  BookOpen02Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import MascotOrange from "../../../../assets/images/svg/newmascotorange.svg";
import MascotPurple from "../../../../assets/images/svg/newmascotpurple.svg";

type Step = "profile" | "language" | "goal";

type Props = {
  onFinish: () => void;
};

const LANGUAGES = [
  { id: "ku", label: "Kurdish (Soranî)", code: "KU", flag: "☀️" },
  { id: "es", label: "Español", code: "ES", flag: "🇪🇸" },
  { id: "ru", label: "Русский", code: "RU", flag: "🇷🇺" },
  { id: "ar", label: "العربية", code: "AR", flag: "🇸🇦" },
  { id: "en", label: "English", code: "EN", flag: "🇬🇧" },
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

export function LanguageSelectionFlow({ onFinish }: Props) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();

  // Stores
  const setUserName = useSettingsStore((s) => s.setUserName);
  const setUserAge = useSettingsStore((s) => s.setUserAge);
  const userName = useSettingsStore((s) => s.userName);
  const userAge = useSettingsStore((s) => s.userAge);
  const setLanguagePair = useLocaleStore((s) => s.setLanguagePair);

  const [step, setStep] = useState<Step>("profile");
  const [selectedLang, setSelectedLang] = useState<string>("en");
  const [selectedGoal, setSelectedGoal] = useState<string>("conversations");
  const [name, setName] = useState(userName || "");
  const [age, setAge] = useState(userAge || "");

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
    // Default native to English if learning Kurdish, otherwise Kurdish
    const nativeLang = selectedLang === "ku" ? "en" : "ku";
    setLanguagePair(nativeLang, selectedLang);
    setStep("goal");
  }, [selectedLang, setLanguagePair]);

  const handleFinish = useCallback(() => {
    hapticSelection();
    onFinish();
  }, [onFinish]);

  const onBack = useCallback(() => {
    hapticSelection();
    if (step === "goal") setStep("language");
    else if (step === "language") setStep("profile");
  }, [step]);

  const stepIndex = step === "profile" ? 1 : step === "language" ? 2 : 3;

  return (
    <View style={styles.root}>
      {/* HEADER: Back Button & Step Indicators */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <View style={styles.headerLeft}>
          {step !== "profile" ? (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <HugeiconsIcon icon={ArrowLeft01Icon} size={22} color="#0F172A" strokeWidth={2.5} />
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
          </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 20 },
        ]}
      >
        {/* STEP 1: PROFILE NAME & AGE */}
        {step === "profile" && (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.contentWrap}>
            <Text style={styles.stepNumLabel}>STEP 1 OF 3</Text>
            <Text style={styles.title}>What's your name?</Text>
            <Text style={styles.subtitle}>We'll personalize your learning journey for you.</Text>

            {/* Cute Mascots Visual */}
            <View style={styles.mascotVisualRow}>
              <View style={styles.mascotCol}>
                <View style={[styles.speechBubble, { backgroundColor: "#FFF8E1", borderColor: "#FFE082" }]}>
                  <Text style={[styles.speechBubbleText, { color: "#D97706" }]}>Hey!</Text>
                </View>
                <MascotOrange width={90} height={100} />
              </View>
            </View>

            <View style={styles.inputForm}>
              <View style={styles.inputBox}>
                <HugeiconsIcon icon={UserIcon} size={20} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor="#94A3B8"
                  selectionColor="#2563EB"
                />
              </View>

              <View style={styles.inputBox}>
                <HugeiconsIcon icon={Calendar01Icon} size={20} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={age}
                  onChangeText={setAge}
                  placeholder="Enter your age (optional)"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  selectionColor="#2563EB"
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
          <Animated.View entering={FadeInDown.duration(400)} style={styles.contentWrap}>
            <Text style={styles.stepNumLabel}>STEP 2 OF 3</Text>
            <Text style={styles.title}>Which language would you like to learn?</Text>
            <Text style={styles.subtitle}>You can always add more languages later.</Text>

            {/* Flipped Mascots Talking */}
            <View style={styles.mascotVisualRow}>
              <View style={styles.mascotCol}>
                <View style={[styles.speechBubble, { backgroundColor: "#FFF5F5", borderColor: "#FED7D7" }]}>
                  <Text style={[styles.speechBubbleText, { color: "#E53E3E" }]}>¡Hola!</Text>
                </View>
                <View style={{ transform: [{ scaleX: -1 }] }}>
                  <MascotOrange width={80} height={90} />
                </View>
              </View>
              <View style={[styles.mascotCol, { marginTop: 12 }]}>
                <View style={[styles.speechBubble, { backgroundColor: "#EBF8FF", borderColor: "#BEE3F8" }]}>
                  <Text style={[styles.speechBubbleText, { color: "#2B6CB0" }]}>Hello!</Text>
                </View>
                <MascotPurple width={80} height={90} />
              </View>
            </View>

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
                    <Text style={styles.flagEmoji}>{l.flag}</Text>
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

        {/* STEP 3: MAIN GOAL SELECTION */}
        {step === "goal" && (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.contentWrap}>
            <Text style={styles.stepNumLabel}>STEP 3 OF 3</Text>
            <Text style={styles.title}>What's your main goal?</Text>
            <Text style={styles.subtitle}>We'll personalize your journey based on your goal.</Text>

            {/* Checklist Mascots visual */}
            <View style={styles.mascotVisualRow}>
              <View style={styles.mascotCol}>
                <MascotOrange width={80} height={90} />
              </View>
              <View style={[styles.mascotCol, { marginTop: 12 }]}>
                <MascotPurple width={80} height={90} />
              </View>
            </View>

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
              onPress={handleFinish}
            >
              <Text style={styles.primaryButtonText}>Let's Get Started</Text>
              <HugeiconsIcon icon={ArrowRight01Icon} size={20} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerLeft: {
    width: 40,
    alignItems: "flex-start",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
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
    backgroundColor: "#E2E8F0",
  },
  stepLineActive: {
    backgroundColor: "#2563EB",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  contentWrap: {
    width: "100%",
    alignItems: "center",
  },
  stepNumLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#2563EB",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    color: "#0F172A",
    textAlign: "center",
    fontFamily: "DINNextRoundedBold",
    lineHeight: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 12,
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
    gap: 12,
    marginBottom: 24,
  },
  inputBox: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 54,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: "#0F172A",
    fontFamily: "DINNextRoundedMedium",
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
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  optionRowSelected: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  radioDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioDotSelected: {
    borderColor: "#2563EB",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2563EB",
  },
  flagEmoji: {
    fontSize: 22,
    marginRight: 12,
  },
  optionLabel: {
    flex: 1,
    fontSize: 15,
    color: "#334155",
    fontFamily: "DINNextRoundedBold",
  },
  optionLabelSelected: {
    color: "#1E3A8A",
  },
  codeTag: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  codeTagText: {
    fontSize: 11,
    color: "#64748B",
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
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  goalRowSelected: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
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
    color: "#334155",
    fontFamily: "DINNextRoundedBold",
  },
  goalTitleSelected: {
    color: "#1E3A8A",
  },
  goalDesc: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
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
