import { useI18n } from "../../hooks/useI18n";
import type { I18nKey } from "../../i18n";
import { OnboardingProgressBar } from "./components/OnboardingProgressBar";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { useLocaleStore } from "../../stores/useLocaleStore";
import { SOURCE_LANGUAGES, TARGET_LANGUAGES } from "../../config/languages";
import { hapticSelection } from "../../utils/haptics";
import * as Haptics from "expo-haptics";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  Easing,
  FadeInDown,
  FadeOut,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { User, Calendar } from "lucide-react-native";
import { useThemeColors } from "../../hooks/useThemeColors";
import { OnboardingSkiaBg } from "./components/OnboardingSkiaBg";

type Step = "profile" | "native" | "target" | "level";

type Props = {
  onFinish: () => void;
};

function SleekInput({
  value,
  onChangeText,
  placeholder,
  icon: Icon,
  keyboardType = "default",
}: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  icon: React.ElementType;
  keyboardType?: "default" | "numeric";
}) {
  const [isFocusedState, setIsFocusedState] = useState(false);
  const isFocused = useSharedValue(0);

  const handleFocus = () => {
    setIsFocusedState(true);
    isFocused.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) });
  };
  const handleBlur = () => {
    setIsFocusedState(false);
    isFocused.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
  };

  const { colors, isDark } = useThemeColors();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  const borderStyle = useAnimatedStyle(() => ({
    borderColor: isFocused.value ? "#2563EB" : "rgba(0, 0, 0, 0.1)",
    borderWidth: 1.5,
    ...Platform.select({
      web: {
        boxShadow: isFocused.value ? "0px 4px 12px rgba(37, 99, 235, 0.15)" : "none",
      },
      ios: {
        shadowColor: "#2563EB",
        shadowOpacity: isFocused.value * 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: isFocused.value ? 2 : 0,
      },
    }),
  }));

  const iconColor = isFocusedState ? "#2563EB" : "rgba(0, 0, 0, 0.3)";

  return (
    <Animated.View style={[styles.inputWrapper, borderStyle]}>
      <Animated.View style={{ paddingLeft: 16, paddingRight: 8 }}>
        <Icon size={20} color={iconColor} />
      </Animated.View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(0, 0, 0, 0.3)"
        keyboardType={keyboardType}
        onFocus={handleFocus}
        onBlur={handleBlur}
        selectionColor="#2563EB"
      />
    </Animated.View>
  );
}

function LangOptionCard({
  label,
  code,
  selected,
  onPress,
}: {
  label: string;
  code: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { colors, isDark } = useThemeColors();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      <View
        style={[styles.langCard, selected && styles.langCardSelected]}
      >
        <View style={[styles.codeBadge, selected && styles.codeBadgeSelected]}>
          <Text style={[styles.codeText, selected && styles.codeTextSelected]}>
            {code}
          </Text>
        </View>
        <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
          {label}
        </Text>
        <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
          {selected ? <View style={styles.radioInner} /> : null}
        </View>
      </View>
    </Pressable>
  );
}

export function LanguageSelectionFlow({ onFinish }: Props) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useThemeColors();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);
  const { width: screenWidth } = useWindowDimensions();

  // Stores
  const setUserName = useSettingsStore((s) => s.setUserName);
  const setUserAge = useSettingsStore((s) => s.setUserAge);
  const userName = useSettingsStore((s) => s.userName);
  const userAge = useSettingsStore((s) => s.userAge);
  const englishLevel = useSettingsStore((s) => s.englishLevel);
  const setEnglishLevel = useSettingsStore((s) => s.setEnglishLevel);
  const setLanguagePair = useLocaleStore((s) => s.setLanguagePair);

  const [step, setStep] = useState<Step>("profile");
  const [native, setNative] = useState<string>("ku");
  const [target, setTarget] = useState<string>("en");
  const [name, setName] = useState(userName || "");
  const [age, setAge] = useState(userAge || "");

  const stepIndex = step === "profile" ? 0 : step === "native" ? 1 : step === "target" ? 2 : 3;

  const nativeOptions = SOURCE_LANGUAGES;
  const targetOptions = TARGET_LANGUAGES.filter((l) => l.id !== native);

  const handleProfileContinue = useCallback(() => {
    if (!name.trim()) {
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    setUserName(name);
    setUserAge(age);
    hapticSelection();
    setStep("native");
  }, [name, age, setUserName, setUserAge]);

  const handleSelectNative = useCallback(
    (lang: string) => {
      hapticSelection();
      setNative(lang);
      const nextTarget = TARGET_LANGUAGES.find(l => l.id !== lang)?.id || "en";
      setTarget(nextTarget);
      setStep("target");
    },
    [],
  );

  const handleSelectTarget = useCallback(
    (lang: string) => {
      hapticSelection();
      setTarget(lang);
      setLanguagePair(native, lang);
      setStep("level");
    },
    [setLanguagePair, native],
  );

  const onBack = useCallback(() => {
    hapticSelection();
    if (step === "level") setStep("target");
    else if (step === "target") setStep("native");
    else if (step === "native") setStep("profile");
  }, [step]);

  const onContinueTarget = useCallback(() => {
    handleSelectTarget(target);
  }, [handleSelectTarget, target]);

  return (
    <View style={styles.root}>
      <OnboardingSkiaBg />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 28,
          },
        ]}
      >
        <View style={styles.topRow}>
          {step !== "profile" ? (
            <Pressable
              onPress={onBack}
              hitSlop={12}
              accessibilityRole="button"
            >
              <Text style={styles.back}>{t("onboarding.langBack")}</Text>
            </Pressable>
          ) : (
            <View style={styles.backSpacer} />
          )}
          <OnboardingProgressBar total={4} index={stepIndex} />
          <View style={styles.backSpacer} />
        </View>

        {step === "profile" && (
          <Animated.View
            key="profile"
            style={styles.stepBlock}
          >
            <Text style={styles.stepLabel}>{t("onboarding.stepLabel", { step: 1 })}</Text>
            <Text style={styles.title}>{t("onboarding.profileTitle")}</Text>
            <Text style={styles.subtitle}>
              {t("onboarding.profileSubtitle")}
            </Text>

            <View style={styles.options}>
              <SleekInput
                icon={User}
                placeholder={t("onboarding.profileName")}
                value={name}
                onChangeText={setName}
              />
              <SleekInput
                icon={Calendar}
                placeholder={t("onboarding.profileAge")}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
              />
            </View>
            
            <TouchableOpacity
              style={[styles.continueButton, !name.trim() && styles.continueButtonDisabled]}
              activeOpacity={0.8}
              onPress={handleProfileContinue}
            >
              <Text style={styles.continueButtonText}>{t("onboarding.continue")}</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {step === "native" && (
          <Animated.View
            key="native"
            style={styles.stepBlock}
          >
            <Text style={styles.stepLabel}>
              {t("onboarding.stepLabel", { step: 2 })}
            </Text>
            <Text style={styles.title}>{t("onboarding.langNativeTitle")}</Text>
            <Text style={styles.subtitle}>
              {t("onboarding.langNativeSubtitle")}
            </Text>

            <View style={styles.options}>
              {nativeOptions.map((l) => (
                <LangOptionCard
                  key={l.id}
                  label={l.nativeName}
                  code={l.code.toUpperCase()}
                  selected={native === l.id}
                  onPress={() => handleSelectNative(l.id)}
                />
              ))}
            </View>
          </Animated.View>
        )}
        
        {step === "target" && (
          <Animated.View
            key="target"
            style={styles.stepBlock}
          >
            <Text style={styles.stepLabel}>
              {t("onboarding.stepLabel", { step: 3 })}
            </Text>
            <Text style={styles.title}>{t("onboarding.langTargetTitle")}</Text>
            <Text style={styles.subtitle}>
              {t("onboarding.langTargetSubtitle")}
            </Text>

            <View style={styles.options}>
              {targetOptions.map((l) => (
                <LangOptionCard
                  key={l.id}
                  label={l.nativeName}
                  code={l.code.toUpperCase()}
                  selected={target === l.id}
                  onPress={() => {
                    hapticSelection();
                    setTarget(l.id);
                  }}
                />
              ))}
            </View>

            <TouchableOpacity
              style={[styles.continueButton, { marginTop: 32 }]}
              activeOpacity={0.8}
              onPress={onContinueTarget}
            >
              <Text style={styles.continueButtonText}>{t("onboarding.continue")}</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {step === "level" && (
          <Animated.View
            key="level"
            style={styles.stepBlock}
          >
            <Text style={styles.stepLabel}>
              {t("onboarding.stepLabel", { step: 4 })}
            </Text>
            <Text style={styles.title}>{t("onboarding.levelTitle")}</Text>
            <Text style={styles.subtitle}>
              {t("onboarding.levelSubtitle")}
            </Text>

            <LevelSelectorValue
              value={englishLevel}
              onChange={setEnglishLevel}
              screenWidth={screenWidth}
              styles={styles}
            />

            <TouchableOpacity
              style={[styles.continueButton, { marginTop: 32 }]}
              activeOpacity={0.8}
              onPress={onFinish}
            >
              <Text style={styles.continueButtonText}>{t("onboarding.completeSetup")}</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const LEVEL_DESCS = [
  {
    title: "Absolute Beginner (CEFR A1)",
    desc: "You can understand basic greetings, simple words, and very slow questions.",
    points: ["Understand greetings", "Simple vocabulary", "Basic pronunciation"],
  },
  {
    title: "Beginner (CEFR A1+)",
    desc: "You can introduce yourself and answer simple questions about your name, age, or home.",
    points: ["Introduce yourself", "Basic sentence structure", "Common everyday words"],
  },
  {
    title: "Elementary (CEFR A2)",
    desc: "You can understand sentences about shopping, family, work, and your local area.",
    points: ["Describe your environment", "Understand basic directions", "Simple conversations"],
  },
  {
    title: "Pre-Intermediate (CEFR A2+)",
    desc: "You can hold basic conversations about your routines, hobbies, and past events.",
    points: ["Express likes/dislikes", "Talk about past activities", "Simple descriptions"],
  },
  {
    title: "Intermediate (CEFR B1)",
    desc: "You can talk about dreams, hopes, give simple reasons for opinions, and travel confidently.",
    points: ["Explain plans & opinions", "Handle daily travel situations", "Connect sentences smoothly"],
  },
  {
    title: "Upper-Intermediate (CEFR B1+)",
    desc: "You can explain plans, discuss slightly complex topics, and understand main ideas.",
    points: ["Express complex thoughts", "Active vocabulary expand", "Improved grammar accuracy"],
  },
  {
    title: "Pre-Advanced (CEFR B2)",
    desc: "You can speak with a degree of fluency and spontaneity, and read complex texts.",
    points: ["Spontaneous conversations", "Fluency in general topics", "Self-correct mistakes"],
  },
  {
    title: "Advanced (CEFR B2+)",
    desc: "You can debate, write clear arguments, and understand idiomatic expressions.",
    points: ["Understand idiomatic English", "Debate & present ideas", "Professional communication"],
  },
  {
    title: "Proficient (CEFR C1)",
    desc: "You can express ideas fluently without searching for words, using English flexibly for all purposes.",
    points: ["Flexible language usage", "Understand implicit meanings", "Write complex structures"],
  },
  {
    title: "Mastery (CEFR C2)",
    desc: "You can understand virtually everything heard or read, expressing yourself precisely and fluently.",
    points: ["Near-native fluency", "Express fine shades of meaning", "Complete command of English"],
  },
];

function LevelSelectorValue({
  value,
  onChange,
  screenWidth,
  styles,
}: {
  value: number;
  onChange: (v: number) => void;
  screenWidth: number;
  styles: any;
}) {
  const cellWidth = (screenWidth - 44) / 10;
  const animatedX = useSharedValue((value - 1) * cellWidth);

  useEffect(() => {
    const targetX = (value - 1) * cellWidth;
    if (Platform.OS === "web") {
      animatedX.value = withTiming(targetX, { duration: 220, easing: Easing.out(Easing.cubic) });
    } else {
      animatedX.value = withSpring(targetX, { damping: 15, stiffness: 180 });
    }
  }, [value, cellWidth]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: animatedX.value }],
  }));

  const activeLevelDetails = LEVEL_DESCS[value - 1] || LEVEL_DESCS[4];

  const handleSelect = (lvl: number) => {
    if (lvl !== value) {
      if (Platform.OS !== "web") {
        void Haptics.selectionAsync();
      }
      onChange(lvl);
    }
  };

  return (
    <View style={styles.levelSelectorContainer}>
      <View style={styles.sliderTrack}>
        <Animated.View style={[styles.activePill, pillStyle, { width: cellWidth }]} />
        {Array.from({ length: 10 }, (_, i) => {
          const lvl = i + 1;
          const isActive = value === lvl;
          return (
            <Pressable
              key={lvl}
              style={[styles.sliderCell, { width: cellWidth }]}
              onPress={() => handleSelect(lvl)}
            >
              <Text style={[styles.sliderCellText, isActive && styles.sliderCellTextActive]}>
                {lvl}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Animated.View key={`details-${value}`} style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>{activeLevelDetails.title}</Text>
        <Text style={styles.detailsDesc}>{activeLevelDetails.desc}</Text>
        <View style={styles.pointsWrap}>
          {activeLevelDetails.points.map((pt, idx) => (
            <View key={idx} style={styles.pointRow}>
              <View style={styles.pointDot} />
              <Text style={styles.pointText}>{pt}</Text>
            </View>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const createStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scroll: {
    paddingHorizontal: 22,
    flexGrow: 1,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  back: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(0, 0, 0, 0.5)",
    minWidth: 72,
  },
  backSpacer: {
    minWidth: 72,
  },
  stepBlock: {
    width: "100%",
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2563EB",
    textAlign: "center",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  title: {
    color: "#0F172A",
    textAlign: "center",
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(15, 23, 42, 0.6)",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  options: {
    gap: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 16,
    height: 64,
  },
  input: {
    flex: 1,
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "500",
    height: "100%",
    paddingRight: 16,
  },
  langCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.02)",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 16,
    borderWidth: 1.5,
    borderColor: "rgba(0, 0, 0, 0.08)",
  },
  langCardSelected: {
    borderColor: "#2563EB",
    backgroundColor: "rgba(37, 99, 235, 0.05)",
  },
  codeBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  codeBadgeSelected: {
    backgroundColor: "#2563EB",
  },
  codeText: {
    fontSize: 16,
    fontWeight: "800",
    color: "rgba(0, 0, 0, 0.5)",
    letterSpacing: 0.5,
  },
  codeTextSelected: {
    color: "#FFFFFF",
  },
  optionLabel: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  optionLabelSelected: {
    color: "#2563EB",
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: "#2563EB",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#2563EB",
  },
  continueButton: {
    width: "100%",
    height: 60,
    backgroundColor: "#2563EB",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    ...Platform.select({
      web: {
        boxShadow: "0px 8px 24px rgba(37, 99, 235, 0.25)",
      },
      default: {
        shadowColor: "#2563EB",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 6,
      },
    }),
  },
  continueButtonDisabled: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    ...Platform.select({
      web: { boxShadow: "none" },
      default: { elevation: 0, shadowOpacity: 0 },
    }),
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  levelSelectorContainer: {
    marginTop: 12,
    alignItems: "center",
    width: "100%",
  },
  sliderTrack: {
    height: 56,
    width: "100%",
    borderRadius: 28,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderWidth: 1.5,
    borderColor: "rgba(0, 0, 0, 0.08)",
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    marginBottom: 24,
  },
  activePill: {
    position: "absolute",
    height: "100%",
    borderRadius: 28,
    backgroundColor: "#2563EB",
  },
  sliderCell: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  sliderCellText: {
    fontSize: 16,
    fontWeight: "700",
    color: "rgba(0, 0, 0, 0.4)",
  },
  sliderCellTextActive: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
  detailsCard: {
    width: "100%",
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "rgba(0, 0, 0, 0.05)",
    ...Platform.select({
      web: {
        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.05)",
      },
      default: {
        shadowColor: "#000000",
        shadowOpacity: 0.05,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 10 },
        elevation: 2,
      },
    }),
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
  },
  detailsDesc: {
    fontSize: 14,
    color: "rgba(15, 23, 42, 0.7)",
    lineHeight: 20,
    marginBottom: 16,
  },
  pointsWrap: {
    gap: 8,
  },
  pointRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  pointDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2563EB",
  },
  pointText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#475569",
  },
});

