import { AppText } from "../../components/ui/AppText";
import { HomeMeshBackground } from "../../components/ui/ios-liquid-home";
import { AI_TEACHER_PROMPTS } from "../../data/ai-teacher-prompts";
import type {
  AiTeacherAttempt,
  AiTeacherMode,
  AiTeacherPrompt,
  AiTeacherResult,
} from "../../data/ai-teacher-types";
import { MicCaptureOrb } from "../../components/voice/MicCaptureOrb";
import { useGeminiVoiceCapture } from "../../hooks/use-gemini-voice-capture";
import { useSafeBack } from "../../hooks/use-safe-back";
import { useI18n } from "../../hooks/useI18n";
import {
  evaluateEnglish,
  evaluateSpokenEnglish,
} from "../../services/ai-teacher-service";
import { PATH_LIST_REMOVE_CLIPPED } from "../../utils/native-perf";
import { appStorage } from "../../lib/app-storage";
import { hapticImpact, hapticNotification } from "../../utils/haptics";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { PressableScale } from "../../components/animations";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import {
  ActivityIndicator,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "../../hooks/useThemeColors";
import { PRIMARY_ACTION } from "../../constants/primary-action";

const TEACHER_ACCENT = PRIMARY_ACTION.face;

function createAiColors(theme: any, isDark: boolean) {
  return {
    background: theme.background,
    foreground: theme.foreground,
    primary: TEACHER_ACCENT,
    accent: TEACHER_ACCENT,
    secondary: theme.surface,
    mutedForeground: theme.mutedForeground,
    border: theme.border,
    borderStrong: theme.cardBorder,
    card: theme.surface,
    cardSurface: theme.surface,
    warmBg: isDark ? "rgba(255,107,74,0.18)" : "rgba(255,107,74,0.08)",
    chart1: TEACHER_ACCENT,
    destructive: theme.error,
    track: isDark ? "rgba(255,255,255,0.12)" : "rgba(26,43,72,0.1)",
  };
}

function useAiTeacherTheme() {
  const { colors: theme, isDark } = useThemeColors();
  const Colors = useMemo(() => createAiColors(theme, isDark), [theme, isDark]);
  const styles = useMemo(() => createStyles(Colors), [Colors]);
  return { Colors, styles, isDark };
}

const HISTORY_KEY = "twino.ai-teacher.last-attempt";

const DEMO_RESULT: AiTeacherResult = {
  overallBand: 7.4,
  criteria: [
    {
      key: "fluency",
      label: "Fluency & coherence",
      band: 7.2,
      note: "Ideas flow logically with only occasional hesitation.",
    },
    {
      key: "lexical",
      label: "Lexical resource",
      band: 7.6,
      note: "Good topic vocabulary; a few word-choice upgrades possible.",
    },
    {
      key: "grammar",
      label: "Grammatical range",
      band: 7.1,
      note: "Mix of simple and complex structures with minor slips.",
    },
    {
      key: "pronunciation",
      label: "Pronunciation",
      band: 7.5,
      note: "Generally clear; stress patterns could be more natural.",
    },
  ],
  strengths: [
    "Clear main idea with relevant supporting points.",
    "Uses linking phrases to connect sentences.",
  ],
  improvements: [
    "Add a concrete example to strengthen your argument.",
    "Vary intonation on key words in speaking mode.",
  ],
  sampleRewrite:
    "My hometown is a medium-sized city in the mountains. I enjoy the fresh air and friendly community, though I would improve public transport for students.",
  transcript:
    "My hometown is a medium-sized city in the mountains. I enjoy the fresh air and friendly community.",
  source: "demo",
};

type Phase = "input" | "loading" | "results";

function BrandCard({
  children,
  style,
  contentStyle,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const { styles } = useAiTeacherTheme();
  return (
    <View style={[styles.surfaceCard, style]}>
      <View style={contentStyle}>{children}</View>
    </View>
  );
}

function BrandPrimaryButton({
  label,
  onPress,
  style,
  disabled,
}: {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}) {
  const { styles } = useAiTeacherTheme();
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      style={[styles.primaryBtn, style, disabled && styles.primaryBtnDisabled]}
      scaleDown={0.96}
    >
      <AppText style={styles.primaryBtnText} forceLatinFont latinRole="bold">
        {label}
      </AppText>
    </PressableScale>
  );
}

function SpeakingCountdown({
  seconds,
  isKu,
}: {
  seconds: number;
  isKu: boolean;
}) {
  const { styles } = useAiTeacherTheme();
  const progress = `${Math.max(0, Math.min(100, (seconds / 60) * 100))}%` as `${number}%`;

  return (
    <View style={styles.countdown}>
      <View style={styles.countdownTop}>
        <AppText
          style={styles.countdownLabel}
          forceKurdishFont={isKu}
          latinRole="bold"
        >
          {isKu ? "کاتی تۆمارکردن" : "Recording time"}
        </AppText>
        <Animated.View key={seconds} entering={FadeInDown.duration(160)}>
          <AppText style={styles.countdownNumber} forceLatinFont latinRole="bold">
            {seconds}
          </AppText>
        </Animated.View>
        <AppText
          style={styles.countdownUnit}
          forceKurdishFont={isKu}
          latinRole="medium"
        >
          {isKu ? "چرکە" : "sec"}
        </AppText>
      </View>
      <View style={styles.countdownTrack}>
        <Animated.View style={[styles.countdownFill, { width: progress }]} />
      </View>
    </View>
  );
}

export function AiTeacherScreen() {
  const safeBack = useSafeBack("/(tabs)/play");
  const insets = useSafeAreaInsets();
  const { t, locale, isKu } = useI18n();
  const { Colors, styles, isDark } = useAiTeacherTheme();
  const isRtl = isKu || locale === "ar";
  const params = useLocalSearchParams<{ demo?: string }>();
  const isDemo = params.demo === "results";
  const directionStyle = useMemo(
    () => ({
      textAlign: isRtl ? "right" : "left",
      writingDirection: isRtl ? "rtl" : "ltr",
    }) as const,
    [isRtl],
  );

  const [mode, setMode] = useState<AiTeacherMode>("speaking");
  const [prompt, setPrompt] = useState<AiTeacherPrompt>(AI_TEACHER_PROMPTS[0]);
  const [answer, setAnswer] = useState("");
  const [phase, setPhase] = useState<Phase>(isDemo ? "results" : "input");
  const [result, setResult] = useState<AiTeacherResult | null>(
    isDemo ? DEMO_RESULT : null,
  );
  const [lastSaved, setLastSaved] = useState<AiTeacherAttempt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const voiceCapture = useGeminiVoiceCapture();
  const {
    abort: abortVoiceCapture,
    error: voiceError,
    listening: isListening,
    permissionDenied,
    start: startVoiceCapture,
    stopAndGetAudio,
  } = voiceCapture;

  const promptsForMode = useMemo(
    () => AI_TEACHER_PROMPTS.filter((p) => p.mode === mode),
    [mode],
  );

  useEffect(() => {
    appStorage
      .getItem(HISTORY_KEY)
      .then((raw) => {
        if (raw) setLastSaved(JSON.parse(raw) as AiTeacherAttempt);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (
      promptsForMode.length &&
      !promptsForMode.find((p) => p.id === prompt.id)
    ) {
      setPrompt(promptsForMode[0]);
    }
  }, [mode, promptsForMode, prompt.id]);

  useEffect(() => {
    if (mode !== "speaking") {
      void abortVoiceCapture();
    }
  }, [abortVoiceCapture, mode]);

  // Countdown timer states & refs
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const finishingRef = React.useRef(false);

  const finishSpeaking = useCallback(async () => {
    if (finishingRef.current) return;
    finishingRef.current = true;
    setIsTimerActive(false);
    setError(null);
    setPhase("loading");
    hapticImpact(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const audio = await stopAndGetAudio();
      if (!audio?.base64) {
        throw new Error("No speech was captured. Tap the microphone and try again.");
      }
      const evaluation = await evaluateSpokenEnglish({
        audioBase64: audio.base64,
        mimeType: audio.mimeType,
        promptId: prompt.id,
      });
      setAnswer(evaluation.transcript ?? "");
      setResult(evaluation);
      setPhase("results");
      hapticNotification(Haptics.NotificationFeedbackType.Success);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not check your speech right now.",
      );
      setPhase("input");
    } finally {
      finishingRef.current = false;
    }
  }, [prompt.id, stopAndGetAudio]);

  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null;
    if (isTimerActive && timeLeft > 0) {
      timerInterval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      setIsTimerActive(false);
      void finishSpeaking();
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [finishSpeaking, isTimerActive, timeLeft]);

  useEffect(() => {
    if (phase !== "input" || mode !== "speaking") {
      setIsTimerActive(false);
    }
  }, [phase, mode]);

  const onSubmit = useCallback(async () => {
    const text = answer.trim();
    if (text.length < 12) {
      setError(t("aiTeacher.minAnswer"));
      return;
    }
    setError(null);
    setPhase("loading");
    hapticImpact(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const evaluation = await evaluateEnglish({
        text,
        mode,
        promptId: prompt.id,
      });
      setResult(evaluation);
      setPhase("results");
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not check your English right now.",
      );
      setPhase("input");
    }
  }, [answer, mode, prompt.id, t]);

  const onSave = useCallback(async () => {
    if (!result) return;
    const attempt: AiTeacherAttempt = {
      ...result,
      id: String(Date.now()),
      savedAt: new Date().toISOString(),
      mode,
      promptId: prompt.id,
      excerpt: answer.trim().slice(0, 120),
    };
    await appStorage.setItem(HISTORY_KEY, JSON.stringify(attempt));
    setLastSaved(attempt);
    hapticNotification(Haptics.NotificationFeedbackType.Success);
  }, [answer, mode, prompt.id, result]);

  const onTryAgain = useCallback(() => {
    setPhase("input");
    setResult(null);
    setAnswer("");
    setError(null);
    void abortVoiceCapture();
    setTimeLeft(60);
    setIsTimerActive(false);
    finishingRef.current = false;
  }, [abortVoiceCapture]);

  const toggleMic = useCallback(async () => {
    if (isListening) {
      await finishSpeaking();
      return;
    }
    setError(null);
    setAnswer("");
    setTimeLeft(60);
    const started = await startVoiceCapture(
      {
        onResult: () => {},
        onError: (message) => setError(message),
      },
    );
    setIsTimerActive(started);
  }, [finishSpeaking, isListening, startVoiceCapture]);

  const recoverMicrophonePermission = useCallback(async () => {
    if (Platform.OS === "web") {
      await toggleMic();
      return;
    }
    await Linking.openSettings();
  }, [toggleMic]);

  const handleBack = safeBack;

  return (
    <View style={styles.root}>
      {!isDark && <HomeMeshBackground />}
      <KeyboardAwareScrollView
        style={styles.flex}
        bottomOffset={insets.bottom + 20}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={PATH_LIST_REMOVE_CLIPPED}
        contentContainerStyle={{
          paddingTop: Math.max(insets.top, 20),
          paddingBottom: insets.bottom + 32,
          paddingHorizontal: 24,
          width: "100%",
          maxWidth: 760,
          alignSelf: "center",
          direction: isRtl ? "rtl" : "ltr",
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.topBar,
            { flexDirection: "row" },
          ]}
        >
          <PressableScale
            onPress={handleBack}
            style={styles.backBtn}
            scaleDown={0.9}
          >
            <View style={{ transform: [{ scaleX: isRtl ? -1 : 1 }] }}>
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                size={22}
                color={Colors.foreground}
                strokeWidth={2.5}
              />
            </View>
          </PressableScale>
          <View
            style={[
              styles.topTitles,
              { alignItems: isRtl ? "flex-end" : "flex-start" },
            ]}
          >
            <AppText
              style={[styles.pageTitle, directionStyle]}
              forceKurdishFont={isKu}
              latinRole="bold"
            >
              {t("aiTeacher.title")}
            </AppText>
            <AppText
              style={[styles.pageSub, directionStyle]}
              forceKurdishFont={isKu}
              latinRole="medium"
            >
              {t("aiTeacher.subtitle")}
            </AppText>
          </View>
        </View>

        {phase === "results" && result ? (
          <ResultsView
            result={result}
            onTryAgain={onTryAgain}
            onSave={onSave}
            isRtl={isRtl}
          />
        ) : (
          <>
            <View
              style={[
                styles.modeRow,
                { flexDirection: isRtl ? "row-reverse" : "row" },
              ]}
            >
              {(
                (isRtl
                  ? ["writing", "speaking"]
                  : ["speaking", "writing"]) as AiTeacherMode[]
              ).map((m) => (
                <PressableScale
                  key={m}
                  onPress={() => setMode(m)}
                  style={[styles.modeChip, mode === m && styles.modeChipOn]}
                  scaleDown={0.96}
                >
                  <AppText
                    style={[
                      styles.modeChipText,
                      mode === m && styles.modeChipTextOn,
                    ]}
                    forceLatinFont
                    latinRole="bold"
                  >
                    {m === "speaking"
                      ? t("aiTeacher.speaking")
                      : t("aiTeacher.writing")}
                  </AppText>
                </PressableScale>
              ))}
            </View>

            <AppText
              style={[styles.sectionTitle, directionStyle]}
              forceKurdishFont={isKu}
              latinRole="bold"
            >
              {t("aiTeacher.choosePrompt")}
            </AppText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[
                styles.promptScroll,
                { flexDirection: isRtl ? "row-reverse" : "row" },
              ]}
            >
              {(isRtl ? [...promptsForMode].reverse() : promptsForMode).map(
                (p) => (
                  <PressableScale
                    key={p.id}
                    onPress={() => setPrompt(p)}
                    style={[
                      styles.promptCard,
                      prompt.id === p.id && styles.promptCardOn,
                    ]}
                    scaleDown={0.96}
                  >
                    <AppText
                      style={[
                        styles.promptTitle,
                        { textAlign: isRtl ? "right" : "left" },
                      ]}
                      forceKurdishFont={isKu}
                      forceLatinFont={!isKu}
                      latinRole="bold"
                    >
                      {isKu && p.titleKu ? p.titleKu : p.title}
                    </AppText>
                  </PressableScale>
                ),
              )}
            </ScrollView>

            <BrandCard
              style={styles.taskCard}
              contentStyle={styles.taskCardInner}
            >
              <AppText
                style={[styles.promptScenarioLabel, directionStyle]}
                forceKurdishFont={isKu}
                latinRole="bold"
              >
                {t("aiTeacher.yourTask")}
              </AppText>
              <AppText
                style={[styles.promptScenario, directionStyle]}
                forceKurdishFont={isKu}
                forceLatinFont={!isKu}
                latinRole="medium"
              >
                {isKu && prompt.scenarioKu ? prompt.scenarioKu : prompt.scenario}
              </AppText>
            </BrandCard>

            <AppText
              style={[styles.sectionTitle, directionStyle]}
              forceKurdishFont={isKu}
              latinRole="bold"
            >
              {t("aiTeacher.yourAnswer")}
            </AppText>
            {mode === "speaking" ? (
              <BrandCard contentStyle={styles.speakingMicBlock}>
                {isTimerActive ? (
                  <SpeakingCountdown seconds={timeLeft} isKu={isKu} />
                ) : null}
                <MicCaptureOrb
                  listening={isListening}
                  disabled={phase === "loading"}
                  color={Colors.primary}
                  size={104}
                  hint={
                    isListening
                      ? isKu
                        ? "بۆ وەستاندن و ناردن دووبارە دایبگرە"
                        : "Tap to stop and check your speech"
                      : isKu
                        ? "دایبگرە و بە ئینگلیزی قسە بکە"
                        : "Tap once and speak in English"
                  }
                  onPress={toggleMic}
                />
                <AppText
                  style={styles.recordingStatus}
                  forceKurdishFont={isKu}
                  latinRole="medium"
                >
                  {isListening
                    ? isKu
                      ? "گوێ دەگرێت… دوگمەکە ئێستا نیشانی وەستاندنە."
                      : "Listening… the microphone is now a stop button."
                    : isKu
                      ? "دەنگەکەت تۆمار دەکرێت و AI خۆی گوێی لێ دەگرێت."
                      : "Your audio is recorded so the teacher can assess what you actually say."}
                </AppText>
              </BrandCard>
            ) : (
              <BrandCard contentStyle={styles.inputShell}>
                <TextInput
                  value={answer}
                  onChangeText={setAnswer}
                  placeholder={t("aiTeacher.typeWriting")}
                  placeholderTextColor={Colors.mutedForeground}
                  multiline
                  style={[
                    styles.textInput,
                    directionStyle,
                  ]}
                  editable={phase !== "loading"}
                />
              </BrandCard>
            )}

            {error || voiceError ? (
              <View style={styles.errorBox}>
                <AppText
                  style={[styles.errorText, directionStyle]}
                  forceKurdishFont={isKu}
                  latinRole="medium"
                  selectable
                >
                  {isKu && permissionDenied
                    ? "دەستگەیشتن بە مایکرۆفۆن ڕێگەپێنەدراوە. لە ڕێکخستنەکان ڕێگەی پێ بدە و دووبارە هەوڵ بدەرەوە."
                    : error || voiceError}
                </AppText>
                {permissionDenied ? (
                  <PressableScale
                    onPress={recoverMicrophonePermission}
                    style={styles.permissionButton}
                    scaleDown={0.96}
                  >
                    <AppText
                      style={styles.permissionButtonText}
                      forceKurdishFont={isKu}
                      latinRole="bold"
                    >
                      {Platform.OS === "web"
                        ? isKu
                          ? "دووبارە داوای ڕێگە بکە"
                          : "Request microphone again"
                        : isKu
                          ? "کردنەوەی ڕێکخستنەکان"
                          : "Open device settings"}
                    </AppText>
                  </PressableScale>
                ) : null}
              </View>
            ) : null}

            {phase === "loading" ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator color={Colors.accent} size="large" />
                <AppText
                style={[styles.loadingText, directionStyle]}
                forceKurdishFont={isKu}
                latinRole="medium"
              >
                  {t("aiTeacher.checking")}
                </AppText>
              </View>
            ) : mode === "writing" ? (
              <BrandPrimaryButton
                label={t("aiTeacher.checkEnglish")}
                onPress={onSubmit}
                style={styles.submitBtn}
              />
            ) : null}

            {lastSaved ? (
              <BrandCard
                style={styles.historyCard}
                contentStyle={styles.historyInner}
              >
                <AppText
                style={[styles.historyLabel, directionStyle]}
                forceKurdishFont={isKu}
                latinRole="bold"
              >
                  {isKu ? "دواین ھەوڵی پاشەکەوتکراو" : "Last saved attempt"}
                </AppText>
                <AppText
                style={[styles.historyBand, directionStyle]}
                forceKurdishFont={isKu}
                latinRole="bold"
              >
                  {isKu
                    ? `نمرە ${lastSaved.overallBand}/١٠ · ${lastSaved.mode === "speaking" ? "قسەکردن" : "نووسین"}`
                    : `Score ${lastSaved.overallBand}/10 · ${lastSaved.mode}`}
                </AppText>
                <AppText
                  style={[styles.historyExcerpt, directionStyle]}
                  numberOfLines={2}
                  forceLatinFont
                >
                  {lastSaved.excerpt}
                </AppText>
              </BrandCard>
            ) : null}
          </>
        )}
      </KeyboardAwareScrollView>
    </View>
  );
}

function ResultsView({
  result,
  onTryAgain,
  onSave,
  isRtl,
}: {
  result: AiTeacherResult;
  onTryAgain: () => void;
  onSave: () => void;
  isRtl: boolean;
}) {
  const { t, isKu } = useI18n();
  const { styles } = useAiTeacherTheme();
  const directionStyle = {
    textAlign: isRtl ? "right" : "left",
    writingDirection: isRtl ? "rtl" : "ltr",
  } as const;
  return (
    <Animated.View entering={FadeInDown.duration(320)}>
      <BrandCard contentStyle={styles.overallCard}>
        <View style={styles.overallBadge}>
          <AppText
            style={styles.overallBadgeText}
            forceKurdishFont={isKu}
            latinRole="bold"
          >
            {isKu ? "هەڵسەنگاندنی قسەکردن" : "Speaking feedback"}
          </AppText>
        </View>
        <AppText style={[styles.overallLabel, { textAlign: "center" }]} forceKurdishFont={isKu} latinRole="bold">
          {isKu ? "نمرەی گشتی" : "Overall score"}
        </AppText>
        <View style={styles.scoreLine}>
          <AppText style={styles.overallBand} forceLatinFont latinRole="bold">
            {result.overallBand}
          </AppText>
          <AppText style={styles.scoreMaximum} forceLatinFont latinRole="bold">
            /10
          </AppText>
        </View>
        <AppText style={[styles.overallHint, { textAlign: "center" }]} forceKurdishFont={isKu} latinRole="medium">
          {isKu
            ? "لەسەر بنەمای ئەو شتەی بەڕاستی گوتووتە"
            : "Based on the words and delivery in your recording"}
        </AppText>
      </BrandCard>

      {result.transcript ? (
        <>
          <AppText
            style={[styles.sectionTitle, directionStyle]}
            forceKurdishFont={isKu}
            latinRole="bold"
          >
            {isKu ? "ئەوەی AI بیستی" : "What the teacher heard"}
          </AppText>
          <View style={styles.transcriptPanel}>
            <AppText
              style={[styles.transcriptText, { textAlign: "left", writingDirection: "ltr" }]}
              forceLatinFont
              latinRole="medium"
              selectable
            >
              “{result.transcript}”
            </AppText>
          </View>
        </>
      ) : null}

      <AppText
        style={[styles.sectionTitle, directionStyle]}
        forceKurdishFont={isKu}
        latinRole="bold"
      >
        {isKu ? "پێوەرەکان" : "Criteria"}
      </AppText>
      <View style={styles.criteriaPanel}>
        {result.criteria.map((c, index) => (
          <View
            key={c.key}
            style={[
              styles.criterionRow,
              index > 0 && styles.criterionDivider,
            ]}
          >
            <View
              style={[
                styles.criterionTop,
                { flexDirection: isRtl ? "row-reverse" : "row" },
              ]}
            >
              <AppText
                style={[
                  styles.criterionLabel,
                  {
                    textAlign: isRtl ? "right" : "left",
                    writingDirection: isRtl ? "rtl" : "ltr",
                  },
                ]}
                forceKurdishFont={isKu}
                forceLatinFont={!isKu}
                latinRole="bold"
              >
                {t(`aiTeacher.criteria.${c.key}`) || c.label}
              </AppText>
              <AppText
                style={styles.criterionBand}
                forceLatinFont
                latinRole="bold"
              >
                {c.band}/10
              </AppText>
            </View>
            <View style={styles.bandTrack}>
              <View
                style={[styles.bandFill, { width: `${c.band * 10}%` }]}
              />
            </View>
            <AppText
              style={[styles.criterionNote, directionStyle]}
              forceLatinFont
              latinRole="medium"
            >
              {c.note}
            </AppText>
          </View>
        ))}
      </View>

      <AppText
        style={[styles.sectionTitle, directionStyle]}
        forceKurdishFont={isKu}
        latinRole="bold"
      >
        {isKu ? "خاڵە بەهێزەکان" : "Strengths"}
      </AppText>
      <BrandCard contentStyle={styles.bulletCard}>
        {result.strengths.map((s) => (
          <AppText
            key={s}
            style={[styles.bullet, directionStyle]}
            forceLatinFont
            latinRole="medium"
          >
            • {s}
          </AppText>
        ))}
      </BrandCard>

      <AppText
        style={[styles.sectionTitle, directionStyle]}
        forceKurdishFont={isKu}
        latinRole="bold"
      >
        {isKu ? "خاڵەکان بۆ باشترکردن" : "To improve"}
      </AppText>
      <BrandCard contentStyle={styles.bulletCard}>
        {result.improvements.map((s) => (
          <AppText
            key={s}
            style={[styles.bullet, directionStyle]}
            forceLatinFont
            latinRole="medium"
          >
            • {s}
          </AppText>
        ))}
      </BrandCard>

      {result.sampleRewrite ? (
        <>
          <AppText
            style={[
              styles.sectionTitle,
              directionStyle,
            ]}
            forceKurdishFont={isKu}
            latinRole="bold"
          >
            {isKu ? "نموونەی نووسینی باشترکراو" : "Sample upgrade"}
          </AppText>
          <BrandCard contentStyle={styles.rewriteCard}>
            <AppText
              style={[
                styles.rewriteText,
                directionStyle,
              ]}
              forceLatinFont
              latinRole="medium"
            >
              {result.sampleRewrite}
            </AppText>
          </BrandCard>
        </>
      ) : null}

      <BrandPrimaryButton
        label={isKu ? "پاشەکەوتکردنی هەوڵدانەکە" : "Save attempt"}
        onPress={onSave}
        style={styles.actionBtn}
      />
      <PressableScale
        onPress={onTryAgain}
        style={styles.secondaryBtn}
        scaleDown={0.96}
      >
        <AppText
          style={styles.secondaryBtnText}
          forceLatinFont
          latinRole="bold"
        >
          {isKu ? "دووبارە هەوڵبدەرەوە" : "Try again"}
        </AppText>
      </PressableScale>
    </Animated.View>
  );
}

function createStyles(Colors: ReturnType<typeof createAiColors>) {
  return StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 18,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.warmBg,
    alignItems: "center",
    justifyContent: "center",
  },
  topTitles: {
    flex: 1,
    gap: 4,
  },
  pageTitle: {
    fontSize: 26,
    color: Colors.foreground,
    letterSpacing: -0.5,
  },
  pageSub: {
    fontSize: 13,
    color: Colors.mutedForeground,
  },
  modeRow: {
    flexDirection: "row",
    gap: 4,
    padding: 4,
    borderRadius: 14,
    backgroundColor: Colors.track,
    marginBottom: 18,
  },
  modeChip: {
    flex: 1,
    minHeight: 42,
    paddingVertical: 10,
    borderRadius: 11,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  modeChipOn: {
    backgroundColor: Colors.cardSurface,
    boxShadow: "0 1px 3px rgba(15, 23, 42, 0.12)",
  },
  modeChipText: {
    fontSize: 15,
    color: Colors.mutedForeground,
  },
  modeChipTextOn: {
    color: Colors.primary,
  },
  sectionTitle: {
    fontSize: 15,
    color: Colors.foreground,
    marginBottom: 8,
    marginTop: 4,
  },
  promptScroll: {
    gap: 8,
    paddingBottom: 12,
  },
  promptCard: {
    minHeight: 40,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.cardSurface,
    borderWidth: 1,
    borderColor: Colors.border,
    maxWidth: 200,
    justifyContent: "center",
  },
  promptCardOn: {
    borderColor: "rgba(37, 99, 235, 0.32)",
    backgroundColor: Colors.warmBg,
  },
  promptTitle: {
    fontSize: 14,
    color: Colors.foreground,
  },
  taskCard: {
    marginBottom: 14,
  },
  taskCardInner: {
    padding: 16,
    gap: 6,
  },
  promptScenarioLabel: {
    fontSize: 12,
    color: Colors.accent,
  },
  promptScenario: {
    fontSize: 16,
    color: Colors.foreground,
    lineHeight: 24,
  },
  surfaceCard: {
    backgroundColor: Colors.cardSurface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    borderCurve: "continuous",
  },
  inputShell: {
    minHeight: 124,
    padding: 16,
  },
  textInput: {
    minHeight: 100,
    fontSize: 16,
    color: Colors.foreground,
    fontFamily: "DINNextRoundedRegular",
    textAlignVertical: "top",
  },
  speakingMicBlock: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 18,
    gap: 16,
    marginBottom: 4,
  },
  countdown: {
    width: "100%",
    gap: 10,
  },
  countdownTop: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    gap: 6,
  },
  countdownLabel: {
    flex: 1,
    fontSize: 13,
    color: Colors.mutedForeground,
  },
  countdownNumber: {
    minWidth: 44,
    fontSize: 34,
    lineHeight: 38,
    color: Colors.foreground,
    textAlign: "right",
    fontVariant: ["tabular-nums"],
  },
  countdownUnit: {
    width: 34,
    fontSize: 13,
    color: Colors.mutedForeground,
  },
  countdownTrack: {
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.track,
    overflow: "hidden",
  },
  countdownFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: Colors.primary,
    transitionProperty: "width",
    transitionDuration: 260,
  },
  recordingStatus: {
    maxWidth: 420,
    fontSize: 13,
    lineHeight: 19,
    color: Colors.mutedForeground,
    textAlign: "center",
  },
  speakingTranscript: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.foreground,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  typeInsteadBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  typeInsteadBtnInline: {
    alignSelf: "flex-start",
    paddingTop: 8,
  },
  typeInsteadText: {
    fontSize: 14,
    color: Colors.accent,
  },
  errorText: {
    color: Colors.destructive,
    fontSize: 14,
    lineHeight: 20,
  },
  errorBox: {
    marginTop: 10,
    padding: 14,
    gap: 10,
    borderRadius: 14,
    borderCurve: "continuous",
    backgroundColor: Colors.warmBg,
  },
  permissionButton: {
    alignSelf: "flex-start",
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  permissionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  loadingBox: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    color: Colors.mutedForeground,
  },
  primaryBtn: {
    width: "100%",
    height: PRIMARY_ACTION.height,
    backgroundColor: PRIMARY_ACTION.face,
    paddingHorizontal: 18,
    borderRadius: PRIMARY_ACTION.radius,
    borderBottomWidth: PRIMARY_ACTION.rimWidth,
    borderBottomColor: PRIMARY_ACTION.rim,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnDisabled: {
    opacity: 0.6,
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  submitBtn: {
    marginTop: 12,
  },
  historyCard: {
    marginTop: 16,
  },
  historyInner: {
    padding: 16,
    gap: 6,
  },
  historyLabel: {
    fontSize: 11,
    color: Colors.mutedForeground,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  historyBand: {
    fontSize: 18,
    color: Colors.chart1,
  },
  historyExcerpt: {
    fontSize: 15,
    color: Colors.mutedForeground,
    lineHeight: 22,
  },
  tipCard: {
    marginTop: 20,
  },
  tipStrip: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 16,
  },
  tipIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: Colors.mutedForeground,
    lineHeight: 21,
  },
  overallCard: {
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 20,
    marginBottom: 8,
    gap: 6,
  },
  overallBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    marginBottom: 8,
  },
  overallBadgeText: {
    fontSize: 11,
    color: Colors.foreground,
    letterSpacing: 1.2,
  },
  overallLabel: {
    fontSize: 11,
    color: Colors.mutedForeground,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  overallBand: {
    fontSize: 56,
    color: Colors.foreground,
    lineHeight: 60,
    fontVariant: ["tabular-nums"],
  },
  scoreLine: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  scoreMaximum: {
    fontSize: 20,
    color: Colors.mutedForeground,
    fontVariant: ["tabular-nums"],
  },
  overallHint: {
    fontSize: 14,
    color: Colors.mutedForeground,
  },
  transcriptPanel: {
    backgroundColor: Colors.cardSurface,
    borderRadius: 16,
    borderCurve: "continuous",
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
  },
  transcriptText: {
    color: Colors.foreground,
    fontSize: 16,
    lineHeight: 24,
  },
  criteriaPanel: {
    backgroundColor: Colors.cardSurface,
    borderRadius: 16,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  criterionRow: {
    paddingVertical: 16,
  },
  criterionDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  criterionTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  criterionLabel: {
    fontSize: 15,
    color: Colors.foreground,
    flex: 1,
    paddingRight: 8,
  },
  criterionBand: {
    fontSize: 20,
    color: Colors.chart1,
  },
  bandTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.track,
    marginTop: 12,
    overflow: "hidden",
  },
  bandFill: {
    height: "100%",
    backgroundColor: Colors.accent,
    borderRadius: 3,
  },
  criterionNote: {
    fontSize: 14,
    color: Colors.mutedForeground,
    marginTop: 10,
    lineHeight: 20,
  },
  bulletCard: {
    padding: 16,
    gap: 8,
    marginBottom: 8,
  },
  bullet: {
    fontSize: 15,
    color: Colors.foreground,
    lineHeight: 22,
  },
  rewriteCard: {
    padding: 16,
    marginBottom: 8,
  },
  rewriteText: {
    fontSize: 15,
    color: Colors.foreground,
    fontStyle: "italic",
    lineHeight: 22,
  },
  actionBtn: {
    marginTop: 12,
  },
  secondaryBtn: {
    alignItems: "center",
    paddingVertical: 16,
  },
  secondaryBtnText: {
    fontSize: 16,
    color: Colors.accent,
  },
  });
}
