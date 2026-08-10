/**
 * AI Teacher — migrated onto the shared practice-screen system.
 *
 * What changed and why:
 *  · The screen used to build its own palette (`createAiColors`) on top of the
 *    app theme, which meant it drifted from the other four practice screens on
 *    every token that mattered: card radius, border colour, track colour and
 *    button height. It now reads `games-theme.ts` like the rest.
 *  · The selected prompt chip was outlined in `rgba(37,99,235,0.32)` — a blue
 *    left over from an older palette — while its fill was warm coral. Selection
 *    is now expressed the same way it is on every other screen: coral wash,
 *    coral border, coral ink.
 *  · Colour is reserved for meaning. Teal appears only on the identity chip and
 *    eyebrow; coral marks the one thing you can commit; red is only ever an
 *    error or a stop.
 *
 * The live AI tutor (`/voice-tutor`) is deliberately untouched by all of this.
 */

import { AppText } from "../../components/ui/AppText";
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
import { useAuth } from "../../context/AuthContext";
import { aiPrice } from "../../types/entitlements";
import { hapticImpact, hapticNotification } from "../../utils/haptics";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { PressableScale } from "../../components/animations";
import { TeacherIcon } from "@hugeicons/core-free-icons";
import {
  ActivityIndicator,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  GamesCard,
  GamesGlassHeader,
  GamesIntroCard,
  GamesPrimaryButton,
  GamesProgressBar,
  GamesSectionLabel,
  GamesSecondaryButton,
  GamesSegmented,
  GamesStateBlock,
  useGamesChrome,
} from "../games/components/games-chrome";
import {
  GamesMotion,
  GamesType,
  useGamesMetrics,
  useGamesTheme,
  type GamesMetrics,
  type GamesTheme,
} from "../games/games-theme";

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

function useAiTeacherStyles() {
  const theme = useGamesTheme();
  const metrics = useGamesMetrics(false);
  return useMemo(() => createStyles(theme, metrics), [theme, metrics]);
}

function SpeakingCountdown({ seconds, isKu }: { seconds: number; isKu: boolean }) {
  const theme = useGamesTheme();
  const styles = useAiTeacherStyles();
  const progress = `${Math.max(0, Math.min(100, (seconds / 60) * 100))}%` as `${number}%`;

  return (
    <View style={styles.countdown}>
      <View style={styles.countdownTop}>
        <AppText
          style={[GamesType.caption, { flex: 1, fontSize: 13, color: theme.mutedInk }]}
          forceKurdishFont={isKu}
          latinRole="bold"
        >
          {isKu ? "کاتی تۆمارکردن" : "Recording time"}
        </AppText>
        <Animated.View key={seconds} entering={FadeInDown.duration(160)}>
          <AppText style={[styles.countdownNumber, { color: theme.ink }]} forceLatinFont latinRole="bold">
            {seconds}
          </AppText>
        </Animated.View>
        <AppText
          style={[GamesType.caption, { width: 34, fontSize: 13, color: theme.mutedInk }]}
          forceKurdishFont={isKu}
          latinRole="medium"
        >
          {isKu ? "چرکە" : "sec"}
        </AppText>
      </View>
      {/* The bar drains rather than fills: a shrinking track reads as
          "time is running out" without needing a colour change. */}
      <View style={[styles.countdownTrack, { backgroundColor: theme.track }]}>
        <Animated.View
          style={[styles.countdownFill, { width: progress, backgroundColor: theme.accent }]}
        />
      </View>
    </View>
  );
}

export function AiTeacherScreen() {
  const safeBack = useSafeBack("/(tabs)/play");
  const insets = useSafeAreaInsets();
  const { theme, metrics, isWide, isRtl, t, locale, isKu } = useGamesChrome("ai-teacher");
  const styles = useAiTeacherStyles();
  const { billingAccount, refreshBillingAccount } = useAuth();
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
  const [result, setResult] = useState<AiTeacherResult | null>(isDemo ? DEMO_RESULT : null);
  const [lastSaved, setLastSaved] = useState<AiTeacherAttempt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
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
    if (promptsForMode.length && !promptsForMode.find((p) => p.id === prompt.id)) {
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
        caught instanceof Error ? caught.message : "Could not check your speech right now.",
      );
      setPhase("input");
    } finally {
      finishingRef.current = false;
      await refreshBillingAccount();
    }
  }, [prompt.id, refreshBillingAccount, stopAndGetAudio]);

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
        caught instanceof Error ? caught.message : "Could not check your English right now.",
      );
      setPhase("input");
    } finally {
      await refreshBillingAccount();
    }
  }, [answer, mode, prompt.id, refreshBillingAccount, t]);

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
    const started = await startVoiceCapture({
      onResult: () => {},
      onError: (message) => setError(message),
    });
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

  const modeOptions = useMemo(
    () =>
      (["speaking", "writing"] as AiTeacherMode[]).map((m) => ({
        value: m,
        label: m === "speaking" ? t("aiTeacher.speaking") : t("aiTeacher.writing"),
      })),
    [t],
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.canvas }}>
      <GamesGlassHeader
        title={t("aiTeacher.title")}
        titleLanguageCode={locale}
        onBack={handleBack}
        scrolled={scrolled}
      />

      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        bottomOffset={insets.bottom + 20}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={PATH_LIST_REMOVE_CLIPPED}
        onScroll={(e) => setScrolled(e.nativeEvent.contentOffset.y > 4)}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: metrics.sectionGap,
          paddingBottom: insets.bottom + 32,
          paddingHorizontal: metrics.gutter,
          gap: metrics.sectionGap,
          width: "100%",
          maxWidth: isWide ? metrics.maxWidth : undefined,
          alignSelf: "center",
        }}
        keyboardShouldPersistTaps="handled"
      >
        {phase === "results" && result ? (
          <ResultsView result={result} onTryAgain={onTryAgain} onSave={onSave} isRtl={isRtl} />
        ) : (
          <>
            <GamesIntroCard
              mode="ai-teacher"
              icon={TeacherIcon}
              languageCode={locale}
              eyebrow={isKu ? "مامۆستای AI" : "AI teacher"}
              title={t("aiTeacher.title")}
              blurb={t("aiTeacher.subtitle")}
            >
              {/* Two visible choices rather than a hidden toggle — Hick's law
                  works in your favour when the option set is this small. */}
              <View style={{ marginTop: 16 }}>
                <GamesSegmented
                  options={modeOptions}
                  value={mode}
                  languageCode={locale}
                  onChange={setMode}
                />
              </View>
            </GamesIntroCard>

            <View style={{ gap: 10 }}>
              <GamesSectionLabel languageCode={locale}>
                {t("aiTeacher.choosePrompt")}
              </GamesSectionLabel>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                  styles.promptScroll,
                  { flexDirection: isRtl ? "row-reverse" : "row" },
                ]}
              >
                {(isRtl ? [...promptsForMode].reverse() : promptsForMode).map((p) => {
                  const on = prompt.id === p.id;
                  return (
                    <PressableScale
                      key={p.id}
                      onPress={() => setPrompt(p)}
                      scaleDown={0.96}
                      accessibilityRole="button"
                      accessibilityState={{ selected: on }}
                      style={[
                        styles.promptChip,
                        {
                          backgroundColor: on ? theme.accentWash : theme.surface,
                          borderColor: on ? theme.accentBorder : theme.border,
                          borderWidth: on ? metrics.selectBorderWidth : 1,
                          paddingHorizontal: on ? 13 : 14,
                        },
                      ]}
                    >
                      <AppText
                        style={[
                          GamesType.caption,
                          {
                            fontSize: 14,
                            color: on ? theme.accentInk : theme.ink,
                            textAlign: isRtl ? "right" : "left",
                          },
                        ]}
                        forceKurdishFont={isKu}
                        forceLatinFont={!isKu}
                        latinRole="bold"
                      >
                        {isKu && p.titleKu ? p.titleKu : p.title}
                      </AppText>
                    </PressableScale>
                  );
                })}
              </ScrollView>
            </View>

            <GamesCard style={{ gap: 6 }}>
              <GamesSectionLabel languageCode={locale}>
                {t("aiTeacher.yourTask")}
              </GamesSectionLabel>
              <AppText
                style={[GamesType.body, { fontSize: 16, lineHeight: 24, color: theme.ink }, directionStyle]}
                forceKurdishFont={isKu}
                forceLatinFont={!isKu}
                latinRole="medium"
              >
                {isKu && prompt.scenarioKu ? prompt.scenarioKu : prompt.scenario}
              </AppText>
            </GamesCard>

            <GamesCard style={{ gap: 4 }}>
              <AppText
                style={[GamesType.caption, { color: theme.accentInk }, directionStyle]}
                forceKurdishFont={isKu}
                latinRole="bold"
              >
                {isKu
                  ? `پشکنینی AI · ${aiPrice(billingAccount?.entitlements, mode === "writing" ? "ai_teacher_writing" : "ai_teacher_speaking")} کرێدیت`
                  : isRtl
                    ? `تقييم AI · ${aiPrice(billingAccount?.entitlements, mode === "writing" ? "ai_teacher_writing" : "ai_teacher_speaking")} رصيد`
                    : `AI evaluation · ${aiPrice(billingAccount?.entitlements, mode === "writing" ? "ai_teacher_writing" : "ai_teacher_speaking")} credits`}
              </AppText>
              <AppText style={[GamesType.caption, { color: theme.mutedInk }, directionStyle]}>
                {isKu ? "باڵانس" : isRtl ? "الرصيد" : "Balance"}: {billingAccount?.entitlements.creditBalance ?? 0}
              </AppText>
            </GamesCard>

            <View style={{ gap: 10 }}>
              <GamesSectionLabel languageCode={locale}>
                {t("aiTeacher.yourAnswer")}
              </GamesSectionLabel>

              {mode === "speaking" ? (
                <GamesCard style={styles.speakingBlock}>
                  {isTimerActive ? <SpeakingCountdown seconds={timeLeft} isKu={isKu} /> : null}
                  {/* Red only while recording: the orb is a stop button at that
                      moment, and stop is the one non-error use of danger. */}
                  <MicCaptureOrb
                    listening={isListening}
                    disabled={phase === "loading"}
                    color={isListening ? theme.danger : theme.accent}
                    size={104}
                    onPress={toggleMic}
                  />
                  <AppText
                    style={[
                      GamesType.body,
                      {
                        maxWidth: 420,
                        fontSize: 13,
                        lineHeight: 19,
                        color: theme.mutedInk,
                        textAlign: "center",
                      },
                    ]}
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
                </GamesCard>
              ) : (
                <View
                  style={[
                    styles.inputShell,
                    {
                      backgroundColor: theme.surfaceSunken,
                      borderColor: inputFocused ? theme.accentBorder : theme.border,
                      borderWidth: inputFocused ? metrics.selectBorderWidth : 1,
                      padding: inputFocused ? 15 : 16,
                    },
                  ]}
                >
                  <TextInput
                    underlineColorAndroid="transparent"
                    value={answer}
                    onChangeText={setAnswer}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    placeholder={t("aiTeacher.typeWriting")}
                    placeholderTextColor={theme.faintInk}
                    multiline
                    style={[styles.textInput, { color: theme.ink }, directionStyle]}
                    editable={phase !== "loading"}
                  />
                </View>
              )}
            </View>

            {error || voiceError ? (
              <GamesCard>
                <GamesStateBlock
                  tone="danger"
                  languageCode={locale}
                  title={isKu ? "کێشەیەک ڕوویدا" : "Something went wrong"}
                  body={
                    isKu && permissionDenied
                      ? "دەستگەیشتن بە مایکرۆفۆن ڕێگەپێنەدراوە. لە ڕێکخستنەکان ڕێگەی پێ بدە و دووبارە هەوڵ بدەرەوە."
                      : error || voiceError || undefined
                  }
                  action={
                    permissionDenied ? (
                      <GamesSecondaryButton
                        languageCode={locale}
                        onPress={recoverMicrophonePermission}
                        label={
                          Platform.OS === "web"
                            ? isKu
                              ? "دووبارە داوای ڕێگە بکە"
                              : "Request microphone again"
                            : isKu
                              ? "کردنەوەی ڕێکخستنەکان"
                              : "Open device settings"
                        }
                      />
                    ) : /credit|کرێدیت|رصيد/i.test(error || voiceError || "") ? (
                      <GamesSecondaryButton
                        languageCode={locale}
                        onPress={() => router.push("/credits")}
                        label={isKu ? "بینینی پلانەکان" : isRtl ? "عرض الخطط" : "View plans or top up"}
                      />
                    ) : undefined
                  }
                />
              </GamesCard>
            ) : null}

            {phase === "loading" ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator color={theme.accent} size="large" />
                <AppText
                  style={[GamesType.body, { fontSize: 15, color: theme.mutedInk }, directionStyle]}
                  forceKurdishFont={isKu}
                  latinRole="medium"
                >
                  {t("aiTeacher.checking")}
                </AppText>
              </View>
            ) : mode === "writing" ? (
              <GamesPrimaryButton
                label={t("aiTeacher.checkEnglish")}
                languageCode={locale}
                onPress={onSubmit}
              />
            ) : null}

            {lastSaved ? (
              <GamesCard style={{ gap: 6 }}>
                <GamesSectionLabel languageCode={locale}>
                  {isKu ? "دواین ھەوڵی پاشەکەوتکراو" : "Last saved attempt"}
                </GamesSectionLabel>
                <AppText
                  style={[GamesType.section, { fontSize: 18, color: theme.ink }, directionStyle]}
                  forceKurdishFont={isKu}
                  latinRole="bold"
                >
                  {isKu
                    ? `نمرە ${lastSaved.overallBand}/١٠ · ${lastSaved.mode === "speaking" ? "قسەکردن" : "نووسین"}`
                    : `Score ${lastSaved.overallBand}/10 · ${lastSaved.mode}`}
                </AppText>
                <AppText
                  style={[
                    GamesType.body,
                    { fontSize: 15, lineHeight: 22, color: theme.mutedInk },
                    directionStyle,
                  ]}
                  numberOfLines={2}
                  forceLatinFont
                >
                  {lastSaved.excerpt}
                </AppText>
              </GamesCard>
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
  const { t, isKu, locale } = useI18n();
  const theme = useGamesTheme();
  const styles = useAiTeacherStyles();
  const directionStyle = {
    textAlign: isRtl ? "right" : "left",
    writingDirection: isRtl ? "rtl" : "ltr",
  } as const;

  return (
    <Animated.View
      entering={FadeInDown.duration(GamesMotion.enterMs)}
      style={{ gap: 16 }}
    >
      {/* Score card. The number is the hero, so nothing else on this card
          competes for attention — no fill, no border colour, no icon. */}
      <GamesCard raised style={styles.overallCard}>
        <View
          style={[
            styles.overallBadge,
            { backgroundColor: theme.surfaceSunken, borderColor: theme.border },
          ]}
        >
          <AppText
            style={[GamesType.eyebrow, { color: theme.mutedInk }]}
            forceKurdishFont={isKu}
            latinRole="bold"
          >
            {isKu ? "هەڵسەنگاندنی قسەکردن" : "Speaking feedback"}
          </AppText>
        </View>
        <AppText
          style={[GamesType.eyebrow, { color: theme.mutedInk, textAlign: "center" }]}
          forceKurdishFont={isKu}
          latinRole="bold"
        >
          {isKu ? "نمرەی گشتی" : "Overall score"}
        </AppText>
        <View style={styles.scoreLine}>
          <AppText style={[styles.overallBand, { color: theme.ink }]} forceLatinFont latinRole="bold">
            {result.overallBand}
          </AppText>
          <AppText style={[styles.scoreMaximum, { color: theme.mutedInk }]} forceLatinFont latinRole="bold">
            /10
          </AppText>
        </View>
        <GamesProgressBar value={result.overallBand / 10} style={{ marginTop: 6 }} />
        <AppText
          style={[GamesType.caption, { fontSize: 13, color: theme.mutedInk, textAlign: "center" }]}
          forceKurdishFont={isKu}
          latinRole="medium"
        >
          {isKu
            ? "لەسەر بنەمای ئەو شتەی بەڕاستی گوتووتە"
            : "Based on the words and delivery in your recording"}
        </AppText>
      </GamesCard>

      {result.transcript ? (
        <View style={{ gap: 10 }}>
          <GamesSectionLabel languageCode={locale}>
            {isKu ? "ئەوەی AI بیستی" : "What the teacher heard"}
          </GamesSectionLabel>
          <GamesCard>
            <AppText
              style={[
                GamesType.body,
                {
                  fontSize: 16,
                  lineHeight: 24,
                  color: theme.ink,
                  textAlign: "left",
                  writingDirection: "ltr",
                },
              ]}
              forceLatinFont
              latinRole="medium"
              selectable
            >
              “{result.transcript}”
            </AppText>
          </GamesCard>
        </View>
      ) : null}

      <View style={{ gap: 10 }}>
        <GamesSectionLabel languageCode={locale}>
          {isKu ? "پێوەرەکان" : "Criteria"}
        </GamesSectionLabel>
        <GamesCard padded={false} style={{ paddingHorizontal: 16 }}>
          {result.criteria.map((c, index) => (
            <View
              key={c.key}
              style={[
                styles.criterionRow,
                index > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.border },
              ]}
            >
              <View
                style={[styles.criterionTop, { flexDirection: isRtl ? "row-reverse" : "row" }]}
              >
                <AppText
                  style={[
                    GamesType.section,
                    { fontSize: 15, flex: 1, paddingRight: 8, color: theme.ink },
                    directionStyle,
                  ]}
                  forceKurdishFont={isKu}
                  forceLatinFont={!isKu}
                  latinRole="bold"
                >
                  {t(`aiTeacher.criteria.${c.key}`) || c.label}
                </AppText>
                <AppText
                  style={[GamesType.title, { fontSize: 20, color: theme.accentInk }]}
                  forceLatinFont
                  latinRole="bold"
                >
                  {c.band}/10
                </AppText>
              </View>
              <GamesProgressBar value={c.band / 10} style={{ marginTop: 12 }} />
              <AppText
                style={[
                  GamesType.body,
                  { fontSize: 14, lineHeight: 20, marginTop: 10, color: theme.mutedInk },
                  directionStyle,
                ]}
                forceLatinFont
                latinRole="medium"
              >
                {c.note}
              </AppText>
            </View>
          ))}
        </GamesCard>
      </View>

      <View style={{ gap: 10 }}>
        <GamesSectionLabel languageCode={locale}>
          {isKu ? "خاڵە بەهێزەکان" : "Strengths"}
        </GamesSectionLabel>
        <GamesCard style={{ gap: 8 }}>
          {result.strengths.map((s) => (
            <AppText
              key={s}
              style={[
                GamesType.body,
                { fontSize: 15, lineHeight: 22, color: theme.ink },
                directionStyle,
              ]}
              forceLatinFont
              latinRole="medium"
            >
              • {s}
            </AppText>
          ))}
        </GamesCard>
      </View>

      <View style={{ gap: 10 }}>
        <GamesSectionLabel languageCode={locale}>
          {isKu ? "خاڵەکان بۆ باشترکردن" : "To improve"}
        </GamesSectionLabel>
        <GamesCard style={{ gap: 8 }}>
          {result.improvements.map((s) => (
            <AppText
              key={s}
              style={[
                GamesType.body,
                { fontSize: 15, lineHeight: 22, color: theme.ink },
                directionStyle,
              ]}
              forceLatinFont
              latinRole="medium"
            >
              • {s}
            </AppText>
          ))}
        </GamesCard>
      </View>

      {result.sampleRewrite ? (
        <View style={{ gap: 10 }}>
          <GamesSectionLabel languageCode={locale}>
            {isKu ? "نموونەی نووسینی باشترکراو" : "Sample upgrade"}
          </GamesSectionLabel>
          <GamesCard>
            <AppText
              style={[
                GamesType.body,
                { fontSize: 15, lineHeight: 22, fontStyle: "italic", color: theme.ink },
                directionStyle,
              ]}
              forceLatinFont
              latinRole="medium"
            >
              {result.sampleRewrite}
            </AppText>
          </GamesCard>
        </View>
      ) : null}

      <View style={{ gap: 10 }}>
        <GamesPrimaryButton
          label={isKu ? "پاشەکەوتکردنی هەوڵدانەکە" : "Save attempt"}
          languageCode={locale}
          onPress={onSave}
        />
        <GamesSecondaryButton
          label={isKu ? "دووبارە هەوڵبدەرەوە" : "Try again"}
          languageCode={locale}
          onPress={onTryAgain}
        />
      </View>
    </Animated.View>
  );
}

function createStyles(theme: GamesTheme, metrics: GamesMetrics) {
  return StyleSheet.create({
    promptScroll: {
      gap: 8,
      paddingBottom: 2,
      paddingRight: 2,
    },
    promptChip: {
      minHeight: metrics.tapMin,
      paddingVertical: 10,
      borderRadius: metrics.radiusChip,
      borderCurve: "continuous",
      maxWidth: 220,
      justifyContent: "center",
    },
    inputShell: {
      minHeight: 124,
      borderRadius: metrics.radiusCard,
      borderCurve: "continuous",
    },
    textInput: {
      minHeight: 100,
      backgroundColor: "transparent",
      paddingVertical: 0,
      paddingHorizontal: 0,
      fontSize: 16,
      fontFamily: "Rabar_044",
      textAlignVertical: "top",
    },
    speakingBlock: {
      alignItems: "center",
      paddingVertical: 22,
      gap: 16,
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
    countdownNumber: {
      minWidth: 44,
      fontSize: 34,
      lineHeight: 38,
      textAlign: "right",
      fontFamily: "Rabar_044",
      fontVariant: ["tabular-nums"],
    },
    countdownTrack: {
      height: 7,
      borderRadius: 4,
      overflow: "hidden",
    },
    countdownFill: {
      height: "100%",
      borderRadius: 4,
      transitionProperty: "width",
      transitionDuration: GamesMotion.colorMs,
    },
    loadingBox: {
      alignItems: "center",
      paddingVertical: 24,
      gap: 12,
    },
    overallCard: {
      alignItems: "center",
      paddingVertical: 26,
      gap: 6,
    },
    overallBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: metrics.radiusPill,
      borderWidth: 1,
      marginBottom: 8,
    },
    scoreLine: {
      flexDirection: "row",
      alignItems: "baseline",
    },
    overallBand: {
      fontSize: 56,
      lineHeight: 60,
      fontFamily: "Rabar_044",
      fontVariant: ["tabular-nums"],
    },
    scoreMaximum: {
      fontSize: 20,
      fontFamily: "Rabar_044",
      fontVariant: ["tabular-nums"],
    },
    criterionRow: {
      paddingVertical: 16,
    },
    criterionTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  });
}
