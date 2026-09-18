import { PressableScale } from "../../components/animations";
import { AppText } from "../../components/ui/AppText";
import { MicCaptureOrb } from "../../components/voice/MicCaptureOrb";
import { useAuth } from "../../context/AuthContext";
import { useSafeBack } from "../../hooks/use-safe-back";
import { useGeminiVoiceCapture } from "../../hooks/use-gemini-voice-capture";
import { useTTS } from "../../hooks/use-tts";
import {
  generateRolePlayResponse,
  generateRolePlayVoiceResponse,
  isGeminiConfigured,
  type RolePlayTurn,
  type RolePlayTurnFeedback,
} from "../../services/gemini-speech-service";
import { useSettingsStore } from "../../stores/useSettingsStore";
import {
  getLocalizedRolePlayScenario,
  getRolePlayLanguageName,
  getRolePlaySpeechLocale,
  resolveRolePlayTargetCode,
} from "../../constants/roleplay-language";
import { aiPrice } from "../../types/entitlements";
import { hapticImpact, hapticSelection } from "../../utils/haptics";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowRight02Icon,
  Briefcase01Icon,
  BulbIcon,
  Coffee01Icon,
  Rocket01Icon,
  RotateLeft01Icon,
  StarIcon,
  Store01Icon,
  Target02Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  GamesCard,
  GamesGlassHeader,
  GamesIconButton,
  GamesPrimaryButton,
  GamesScreenShell,
  GamesSectionLabel,
  useGamesChrome,
} from "../games/components/games-chrome";
import {
  GamesMotion,
  GamesType,
  useGameHue,
  useGamesMetrics,
  useGamesTheme,
  withAlpha,
  type GamesTheme,
} from "../games/games-theme";

type Scenario = {
  id: "cafe" | "space" | "job" | "market";
  title: string;
  titleKu: string;
  subtitle: string;
  subtitleKu: string;
  mission: string;
  goals: [string, string, string];
  phrases: [string, string];
  difficulty: "Easy" | "Medium" | "Hard";
  icon: unknown;
  initialMessage: string;
  voicePitch: number;
  voiceRate: number;
};

const SCENARIOS: Scenario[] = [
  {
    id: "cafe",
    title: "Coffee Shop",
    titleKu: "قاوەخانەی پاریس",
    subtitle: "Order with confidence in a busy Paris café",
    subtitleKu: "بە متمانەوە لە قاوەخانەیەکی پاریس داوا بکە",
    mission: "Get the exact breakfast you want without switching languages.",
    goals: ["Order a drink", "Add or change an item", "Confirm the final order"],
    phrases: ["Could I have…?", "Can I get that without…?"],
    difficulty: "Easy",
    icon: Coffee01Icon,
    initialMessage: "Bonjour! Welcome to Le Petit Café. What can I get started for you today?",
    voicePitch: 1,
    voiceRate: 0.98,
  },
  {
    id: "space",
    title: "Mars Flight",
    titleKu: "گەشتی مەریخ",
    subtitle: "Defend your overweight luggage at the gate",
    subtitleKu: "لە دەروازەکە بەرگری لە جانتای قورسەکەت بکە",
    mission: "Convince a strict gate agent that your equipment must fly.",
    goals: ["Explain what is in the bag", "Give a convincing reason", "Reach a decision"],
    phrases: ["I need it because…", "Is there any exception for…?"],
    difficulty: "Medium",
    icon: Rocket01Icon,
    initialMessage: "Space traveler, your bag exceeds the Mars transit weight limit. Explain why I should allow it.",
    voicePitch: 1.04,
    voiceRate: 0.98,
  },
  {
    id: "job",
    title: "Job Interview",
    titleKu: "چاوپێکەوتنی کار",
    subtitle: "Win an AI Engineering interview",
    subtitleKu: "لە چاوپێکەوتنی ئەندازیاری AI سەرکەوتوو بە",
    mission: "Show clear thinking, real experience, and confident professional English.",
    goals: ["Describe relevant experience", "Explain a technical choice", "Ask a strong question"],
    phrases: ["A project I’m proud of…", "The trade-off was…"],
    difficulty: "Hard",
    icon: Briefcase01Icon,
    initialMessage: "Thanks for joining us. Tell me about a project where you optimized a language model.",
    voicePitch: 1,
    voiceRate: 0.94,
  },
  {
    id: "market",
    title: "Bazaar Bargain",
    titleKu: "بازاڕی گەورە",
    subtitle: "Negotiate a fair price for a hand-woven rug",
    subtitleKu: "لەسەر نرخێکی گونجاو بۆ فەرشێکی دەستکرد ڕێک بکەوە",
    mission: "Use persuasive English to lower the price and close the deal.",
    goals: ["Make a counteroffer", "Give a reason for your price", "Close or walk away"],
    phrases: ["That’s more than I planned…", "I can offer…"],
    difficulty: "Medium",
    icon: Store01Icon,
    initialMessage: "My friend, this rug is a masterpiece. For you, only five hundred gold coins!",
    voicePitch: 0.96,
    voiceRate: 1,
  },
];

type Status = "idle" | "listening" | "thinking" | "speaking" | "error";
type Phase = "setup" | "playing" | "results";
type Message = { sender: "user" | "ai"; text: string };

function ChatBubble({
  message,
  icon,
  isRtl,
  languageCode,
}: {
  message: Message;
  icon: unknown;
  isRtl: boolean;
  languageCode: string;
}) {
  const theme = useGamesTheme();
  const hue = useGameHue("roleplay");
  const st = useRolePlayStyles();
  const isAi = message.sender === "ai";
  return (
    <Animated.View
      entering={FadeInUp.duration(240)}
      style={[
        st.bubbleRow,
        isAi
          ? { flexDirection: isRtl ? "row-reverse" : "row", alignSelf: "flex-start" }
          : { flexDirection: isRtl ? "row" : "row-reverse", alignSelf: "flex-end" },
      ]}
    >
      {isAi ? (
        <View style={[st.avatar, { backgroundColor: hue.wash, borderColor: hue.border }]}>
          <HugeiconsIcon icon={icon as never} size={16} color={hue.ink} strokeWidth={2} />
        </View>
      ) : null}
      <View
        style={[
          st.bubble,
          isAi
            ? { backgroundColor: theme.surface, borderColor: theme.border }
            : { backgroundColor: theme.accentWash, borderColor: withAlpha(theme.accent, 0.28) },
        ]}
      >
        <AppText style={[GamesType.body, { color: theme.ink, lineHeight: 22 }]} languageCode={languageCode} align="start">
          {message.text}
        </AppText>
      </View>
    </Animated.View>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const theme = useGamesTheme();
  return (
    <View style={{ gap: 7 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <AppText style={[GamesType.caption, { color: theme.ink }]} languageCode="en">{label}</AppText>
        <AppText style={[GamesType.caption, { color: theme.accentInk }]} languageCode="en">{value}</AppText>
      </View>
      <View style={{ height: 7, borderRadius: 4, backgroundColor: theme.surfaceSunken, overflow: "hidden" }}>
        <View style={{ height: "100%", width: `${value}%`, borderRadius: 4, backgroundColor: theme.accent }} />
      </View>
    </View>
  );
}

export function RolePlayScreen() {
  const safeBack = useSafeBack("/(tabs)/play");
  const insets = useSafeAreaInsets();
  const { theme, metrics, isWide, isRtl, t, locale, isKu } = useGamesChrome("roleplay");
  const st = useRolePlayStyles();
  const voiceCapture = useGeminiVoiceCapture();
  const {
    abort: abortVoiceCapture,
    start: startVoiceCapture,
    stopAndGetAudio,
  } = voiceCapture;
  const { speak: speakTts, stop: stopTts } = useTTS();
  const { billingAccount, refreshBillingAccount } = useAuth();
  const scrollRef = useRef<ScrollView>(null);
  const targetLanguageCode = resolveRolePlayTargetCode(
    useSettingsStore((state) => state.targetLang),
  );
  const coachLanguageCode = useSettingsStore((state) => state.nativeLang) || locale;
  const targetLanguageName = getRolePlayLanguageName(targetLanguageCode);
  const targetSpeechLocale = getRolePlaySpeechLocale(targetLanguageCode);

  const [scenario, setScenario] = useState(SCENARIOS[0]);
  const [phase, setPhase] = useState<Phase>("setup");
  const [status, setStatus] = useState<Status>("idle");
  const [history, setHistory] = useState<Message[]>([]);
  const [feedback, setFeedback] = useState<RolePlayTurnFeedback[]>([]);
  const [completedGoals, setCompletedGoals] = useState<number[]>([]);
  const [typedMode, setTypedMode] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const statusRef = useRef(status);
  const scenarioRef = useRef(scenario);
  const historyRef = useRef(history);
  const typedModeRef = useRef(typedMode);
  const responseRequestIdRef = useRef(0);
  const handledTranscriptRef = useRef(false);
  const listenTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishVoiceTurnRef = useRef<() => void>(() => undefined);

  useEffect(() => { statusRef.current = status; }, [status]);
  useEffect(() => { scenarioRef.current = scenario; }, [scenario]);
  useEffect(() => { historyRef.current = history; }, [history]);
  useEffect(() => { typedModeRef.current = typedMode; }, [typedMode]);

  const setStatusNow = useCallback((next: Status) => {
    statusRef.current = next;
    setStatus(next);
  }, []);
  const clearListenTimeout = useCallback(() => {
    if (listenTimeoutRef.current) clearTimeout(listenTimeoutRef.current);
    listenTimeoutRef.current = null;
  }, []);
  const stopAll = useCallback(() => {
    responseRequestIdRef.current += 1;
    clearListenTimeout();
    void abortVoiceCapture();
    void stopTts();
  }, [abortVoiceCapture, clearListenTimeout, stopTts]);
  useEffect(() => () => stopAll(), [stopAll]);

  const startListening = useCallback(async () => {
    void stopTts();
    handledTranscriptRef.current = false;
    setError(null);
    setStatusNow("listening");
    const started = await startVoiceCapture({
      onResult: () => undefined,
      onError: (message) => {
        setError(message);
        setStatusNow("error");
      },
    });
    if (!started) {
      setError(voiceCapture.error || t("rolePlay.micUnavailable"));
      setStatusNow("error");
    }
    else {
      clearListenTimeout();
      listenTimeoutRef.current = setTimeout(() => {
        if (statusRef.current === "listening") {
          finishVoiceTurnRef.current();
        }
      }, 20_000);
    }
  }, [clearListenTimeout, setStatusNow, startVoiceCapture, stopTts, t, voiceCapture.error]);

  const speak = useCallback((text: string) => {
    const active = scenarioRef.current;
    setStatusNow("speaking");
    void speakTts(text, targetSpeechLocale, "roleplay", {
      rate: active.voiceRate,
      pitch: active.voicePitch,
      onDone: () => {
        if (statusRef.current !== "speaking") return;
        if (typedModeRef.current) setStatusNow("idle");
        else void startListening();
      },
    });
  }, [setStatusNow, speakTts, startListening, targetSpeechLocale]);

  const applyCompletedTurn = useCallback((turn: RolePlayTurn, transcript: string) => {
    setFeedback((current) => [...current, turn.feedback]);
    setCompletedGoals((current) =>
      Array.from(new Set([...current, ...turn.feedback.completedGoalIndexes])),
    );
    setHistory((current) => [
      ...current,
      { sender: "user", text: transcript },
      { sender: "ai", text: turn.reply },
    ]);
    speak(turn.reply);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 120);
  }, [speak]);

  const handleUserResponse = useCallback(async (rawText: string) => {
    const text = rawText.trim();
    if (!text || statusRef.current === "thinking") return;
    const requestId = responseRequestIdRef.current + 1;
    responseRequestIdRef.current = requestId;
    const priorHistory = historyRef.current;
    setDraft("");
    setError(null);
    setStatusNow("thinking");
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
    if (!isGeminiConfigured()) {
      setError(t("rolePlay.aiUnavailable"));
      setStatusNow("error");
      return;
    }
    try {
      const turn = await generateRolePlayResponse(
        scenarioRef.current.id,
        text,
        priorHistory,
        getLocalizedRolePlayScenario(scenarioRef.current.id, targetLanguageCode).goals,
        targetLanguageCode,
        coachLanguageCode,
      );
      if (responseRequestIdRef.current !== requestId) return;
      applyCompletedTurn(turn, text);
    } catch (caught) {
      if (responseRequestIdRef.current !== requestId) return;
      setError(caught instanceof Error ? caught.message : t("rolePlay.tryAgain"));
      setStatusNow("error");
    } finally {
      await refreshBillingAccount();
    }
  }, [applyCompletedTurn, coachLanguageCode, refreshBillingAccount, setStatusNow, t, targetLanguageCode]);
  const finishVoiceTurn = useCallback(async () => {
    if (statusRef.current !== "listening" || handledTranscriptRef.current) return;
    handledTranscriptRef.current = true;
    clearListenTimeout();
    setError(null);
    setStatusNow("thinking");
    const requestId = responseRequestIdRef.current + 1;
    responseRequestIdRef.current = requestId;
    const priorHistory = historyRef.current;

    try {
      const audio = await stopAndGetAudio();
      if (!audio?.base64) {
        throw new Error(voiceCapture.error || t("rolePlay.noSpeech"));
      }
      const turn = await generateRolePlayVoiceResponse({
        scenarioId: scenarioRef.current.id,
        audioBase64: audio.base64,
        mimeType: audio.mimeType,
        history: priorHistory,
        goals: getLocalizedRolePlayScenario(
          scenarioRef.current.id,
          targetLanguageCode,
        ).goals,
        targetLanguageCode,
        coachLanguageCode,
      });
      if (responseRequestIdRef.current !== requestId) return;
      applyCompletedTurn(turn, turn.transcript);
    } catch (caught) {
      if (responseRequestIdRef.current !== requestId) return;
      setError(caught instanceof Error ? caught.message : t("rolePlay.tryAgain"));
      setStatusNow("error");
    } finally {
      await refreshBillingAccount();
    }
  }, [applyCompletedTurn, clearListenTimeout, coachLanguageCode, refreshBillingAccount, setStatusNow, stopAndGetAudio, t, targetLanguageCode, voiceCapture.error]);
  useEffect(() => {
    finishVoiceTurnRef.current = () => { void finishVoiceTurn(); };
  }, [finishVoiceTurn]);

  const startSession = () => {
    stopAll();
    hapticImpact();
    setFeedback([]);
    setCompletedGoals([]);
    setError(null);
    setPhase("playing");
    const localized = getLocalizedRolePlayScenario(scenario.id, targetLanguageCode);
    setHistory([{ sender: "ai", text: localized.initialMessage }]);
    setTimeout(() => speak(localized.initialMessage), 180);
  };
  const resetSession = () => {
    stopAll();
    hapticImpact();
    setPhase("setup");
    setHistory([]);
    setFeedback([]);
    setCompletedGoals([]);
    setError(null);
    setStatusNow("idle");
  };
  const toggleInputMode = () => {
    stopAll();
    hapticSelection();
    setTypedMode((current) => !current);
    setStatusNow("idle");
  };
  const handleMicTap = () => {
    hapticImpact();
    if (statusRef.current === "speaking") {
      void stopTts();
      void startListening();
    } else if (statusRef.current === "listening") {
      void finishVoiceTurn();
    } else if (statusRef.current !== "thinking") void startListening();
  };
  const finishSession = () => {
    if (feedback.length < 2) return;
    stopAll();
    hapticImpact();
    setStatusNow("idle");
    setPhase("results");
  };

  const scores = useMemo(() => {
    const average = (key: keyof RolePlayTurnFeedback["scores"]) =>
      feedback.length ? Math.round(feedback.reduce((sum, item) => sum + item.scores[key], 0) / feedback.length) : 0;
    return { fluency: average("fluency"), naturalness: average("naturalness"), mission: average("mission") };
  }, [feedback]);
  const overall = Math.round((scores.fluency + scores.naturalness + scores.mission) / 3);
  const latestFeedback = feedback.at(-1);
  const userTurns = history.filter((item) => item.sender === "user").length;
  const scenarioTitle = isKu ? scenario.titleKu : scenario.title;
  const scenarioSubtitle = isKu ? scenario.subtitleKu : scenario.subtitle;
  const localizedScenario = getLocalizedRolePlayScenario(scenario.id, targetLanguageCode);
  const handleExit = useCallback(() => { stopAll(); safeBack(); }, [safeBack, stopAll]);

  if (phase === "setup") {
    return (
      <GamesScreenShell
        onScroll={(event) => setScrolled(event.nativeEvent.contentOffset.y > 4)}
        header={<GamesGlassHeader title={t("rolePlay.headerTitle")} titleLanguageCode={locale} onBack={handleExit} scrolled={scrolled} />}
        footer={
          <View style={{ gap: 9 }}>
            <AppText style={[GamesType.caption, { color: theme.mutedInk, textAlign: "center" }]} languageCode={locale}>
              {t("rolePlay.oneCallPrice", { price: aiPrice(billingAccount?.entitlements, "roleplay_voice_response") })}
            </AppText>
            <GamesPrimaryButton label={t("rolePlay.startMission")} languageCode={locale} onPress={startSession} />
          </View>
        }
      >
        <Animated.View entering={FadeInDown.duration(GamesMotion.enterMs)}>
          <GamesCard raised style={st.heroCard}>
            <View style={[st.heroIcon, { backgroundColor: theme.accentWash, borderColor: theme.accentBorder }]}>
              <HugeiconsIcon icon={scenario.icon as never} size={28} color={theme.accentInk} strokeWidth={2} />
            </View>
            <View style={{ flex: 1, gap: 5 }}>
              <AppText style={[GamesType.eyebrow, { color: theme.accentInk }]} languageCode="en">{scenario.difficulty} · {targetLanguageName} · 4–6 min</AppText>
              <AppText style={[GamesType.title, { color: theme.ink, fontSize: 24 }]} languageCode={isKu ? "ku" : "en"} align="start">{scenarioTitle}</AppText>
              <AppText style={[GamesType.body, { color: theme.mutedInk }]} languageCode={isKu ? "ku" : "en"} align="start">{scenarioSubtitle}</AppText>
            </View>
          </GamesCard>
        </Animated.View>

        <View style={{ gap: 10 }}>
          <GamesSectionLabel languageCode={locale}>{t("rolePlay.chooseScene")}</GamesSectionLabel>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.scenarioRail}>
            {SCENARIOS.map((item) => {
              const selected = item.id === scenario.id;
              return (
                <PressableScale
                  key={item.id}
                  onPress={() => { hapticSelection(); setScenario(item); }}
                  style={[st.scenarioChip, { backgroundColor: selected ? theme.accentWash : theme.surface, borderColor: selected ? theme.accentBorder : theme.border }]}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                >
                  <HugeiconsIcon icon={item.icon as never} size={19} color={selected ? theme.accentInk : theme.mutedInk} strokeWidth={2} />
                  <AppText numberOfLines={1} style={[GamesType.caption, { color: selected ? theme.accentInk : theme.ink }]} languageCode={isKu ? "ku" : "en"}>{isKu ? item.titleKu : item.title}</AppText>
                </PressableScale>
              );
            })}
          </ScrollView>
        </View>

        <GamesCard style={{ gap: 14 }}>
          <View style={st.cardHeading}>
            <View style={[st.smallIcon, { backgroundColor: theme.accentWash }]}><HugeiconsIcon icon={Target02Icon} size={18} color={theme.accentInk} strokeWidth={2.2} /></View>
            <View style={{ flex: 1, gap: 2 }}>
              <AppText style={[GamesType.section, { color: theme.ink }]} languageCode={locale}>{t("rolePlay.yourMission")}</AppText>
              <AppText style={[GamesType.caption, { color: theme.mutedInk }]} languageCode={targetLanguageCode} align="start">{localizedScenario.mission}</AppText>
            </View>
          </View>
          {localizedScenario.goals.map((goal, index) => (
            <View key={goal} style={st.goalRow}>
              <View style={[st.goalNumber, { backgroundColor: theme.surfaceSunken }]}><AppText style={[GamesType.caption, { color: theme.mutedInk }]} languageCode="en">{index + 1}</AppText></View>
              <AppText style={[GamesType.body, { color: theme.ink, flex: 1 }]} languageCode={targetLanguageCode} align="start">{goal}</AppText>
            </View>
          ))}
        </GamesCard>

        <GamesCard flat style={{ gap: 9 }}>
          <View style={st.cardHeading}>
            <HugeiconsIcon icon={BulbIcon} size={18} color={theme.warningInk} strokeWidth={2.2} />
            <AppText style={[GamesType.section, { color: theme.ink }]} languageCode={locale}>{t("rolePlay.phraseKit")}</AppText>
          </View>
          {localizedScenario.phrases.map((phrase) => <AppText key={phrase} style={[GamesType.body, { color: theme.mutedInk }]} languageCode={targetLanguageCode} align="start">“{phrase}”</AppText>)}
        </GamesCard>
      </GamesScreenShell>
    );
  }

  if (phase === "results") {
    return (
      <GamesScreenShell
        header={<GamesGlassHeader title={t("rolePlay.sessionComplete")} titleLanguageCode={locale} onBack={resetSession} />}
        footer={<GamesPrimaryButton label={t("rolePlay.tryAnother")} languageCode={locale} onPress={resetSession} />}
      >
        <Animated.View entering={FadeIn.duration(350)} style={{ alignItems: "center", gap: 12 }}>
          <View style={[st.scoreRing, { backgroundColor: theme.accentWash, borderColor: theme.accentBorder }]}>
            <AppText style={[GamesType.title, { color: theme.accentInk, fontSize: 36 }]} languageCode="en">{overall}</AppText>
            <AppText style={[GamesType.caption, { color: theme.mutedInk }]} languageCode="en">/ 100</AppText>
          </View>
          <AppText style={[GamesType.title, { color: theme.ink, textAlign: "center" }]} languageCode={locale}>{t("rolePlay.missionReport")}</AppText>
          <AppText style={[GamesType.body, { color: theme.mutedInk, textAlign: "center" }]} languageCode={locale}>
            {t("rolePlay.sessionStats", { goals: completedGoals.length, turns: userTurns, scene: scenarioTitle })}
          </AppText>
        </Animated.View>
        <GamesCard style={{ gap: 16 }}>
          <ScoreBar label={t("rolePlay.fluency")} value={scores.fluency} />
          <ScoreBar label={t("rolePlay.naturalness")} value={scores.naturalness} />
          <ScoreBar label={t("rolePlay.missionSkill")} value={scores.mission} />
        </GamesCard>
        <View style={{ gap: 10 }}>
          <GamesSectionLabel languageCode={locale}>{t("rolePlay.missionGoals")}</GamesSectionLabel>
          {localizedScenario.goals.map((goal, index) => {
            const done = completedGoals.includes(index);
            return (
              <View key={goal} style={[st.resultGoal, { backgroundColor: done ? theme.successWash : theme.surface, borderColor: done ? theme.success : theme.border }]}>
                <HugeiconsIcon icon={done ? Tick02Icon : Target02Icon} size={19} color={done ? theme.successInk : theme.mutedInk} strokeWidth={2.2} />
                <AppText style={[GamesType.body, { color: done ? theme.successInk : theme.ink, flex: 1 }]} languageCode={targetLanguageCode} align="start">{goal}</AppText>
              </View>
            );
          })}
        </View>
        {latestFeedback ? (
          <GamesCard flat style={{ gap: 10 }}>
            <View style={st.cardHeading}><HugeiconsIcon icon={StarIcon} size={18} color={theme.warningInk} strokeWidth={2.2} /><AppText style={[GamesType.section, { color: theme.ink }]} languageCode={locale}>{t("rolePlay.bestNextStep")}</AppText></View>
            <AppText style={[GamesType.body, { color: theme.ink }]} languageCode={coachLanguageCode} align="start">{latestFeedback.correction ?? latestFeedback.praise}</AppText>
            <AppText style={[GamesType.body, { color: theme.accentInk }]} languageCode={targetLanguageCode} align="start">“{latestFeedback.betterReply}”</AppText>
          </GamesCard>
        ) : null}
        <GamesPrimaryButton label={t("rolePlay.replayMission")} languageCode={locale} onPress={startSession} />
      </GamesScreenShell>
    );
  }

  const micHint = status === "listening" ? t("rolePlay.listening") : status === "thinking" ? t("rolePlay.thinking") : status === "speaking" ? t("rolePlay.interrupt") : t("rolePlay.tapSpeak");
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: theme.canvas }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <GamesGlassHeader
        title={scenarioTitle}
        titleLanguageCode={isKu ? "ku" : "en"}
        onBack={handleExit}
        right={<GamesIconButton icon={RotateLeft01Icon} onPress={resetSession} accessibilityLabel={t("rolePlay.newMission")} />}
      />
      <View style={[st.progressCard, { marginHorizontal: metrics.gutter, backgroundColor: theme.surface, borderColor: theme.border, maxWidth: isWide ? metrics.maxWidth : undefined, alignSelf: "center" }]}>
        <View style={[st.smallIcon, { backgroundColor: theme.accentWash }]}><HugeiconsIcon icon={scenario.icon as never} size={18} color={theme.accentInk} strokeWidth={2} /></View>
        <View style={{ flex: 1, gap: 5 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
            <AppText numberOfLines={1} style={[GamesType.caption, { color: theme.ink, flex: 1 }]} languageCode={targetLanguageCode}>{localizedScenario.mission}</AppText>
            <AppText style={[GamesType.caption, { color: theme.accentInk }]} languageCode="en">{completedGoals.length}/3</AppText>
          </View>
          <View style={st.progressDots}>{localizedScenario.goals.map((_, index) => <View key={index} style={[st.progressDot, { backgroundColor: completedGoals.includes(index) ? theme.success : theme.surfaceSunken }]} />)}</View>
        </View>
      </View>
      <View style={[st.chatContainer, { paddingHorizontal: metrics.gutter, maxWidth: isWide ? metrics.maxWidth : "100%", alignSelf: "center" }]}>
        <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={st.chatContent}>
          {history.map((message, index) => <ChatBubble key={`${message.sender}-${index}`} message={message} icon={scenario.icon} isRtl={isRtl} languageCode={targetLanguageCode} />)}
          {status === "thinking" ? <Animated.View entering={FadeIn.duration(180)} style={[st.thinkingPill, { backgroundColor: theme.surfaceSunken }]}><AppText style={[GamesType.caption, { color: theme.mutedInk }]} languageCode={locale}>{t("rolePlay.coachThinking")}</AppText></Animated.View> : null}
          {latestFeedback ? (
            <Animated.View entering={FadeInDown.duration(260)} style={[st.coachCard, { backgroundColor: theme.surfaceSunken, borderColor: theme.border }]}>
              <View style={st.cardHeading}><HugeiconsIcon icon={BulbIcon} size={17} color={theme.warningInk} strokeWidth={2.2} /><AppText style={[GamesType.section, { color: theme.ink, fontSize: 14 }]} languageCode={locale}>{t("rolePlay.liveCoach")}</AppText></View>
              <AppText style={[GamesType.caption, { color: theme.successInk }]} languageCode={coachLanguageCode} align="start">{latestFeedback.praise}</AppText>
              {latestFeedback.correction ? <AppText style={[GamesType.caption, { color: theme.ink }]} languageCode={coachLanguageCode} align="start">{latestFeedback.correction}</AppText> : null}
              <AppText style={[GamesType.caption, { color: theme.accentInk }]} languageCode={targetLanguageCode} align="start">{t("rolePlay.tryThis")} “{latestFeedback.betterReply}”</AppText>
            </Animated.View>
          ) : null}
          {error ? (
            <View style={[st.errorCard, { backgroundColor: theme.dangerWash, borderColor: theme.danger }]}>
              <AppText style={[GamesType.caption, { color: theme.dangerInk, flex: 1 }]} languageCode={locale} align="start">{error}</AppText>
              {/credit|کرێدیت|رصيد/i.test(error) ? <PressableScale onPress={() => router.push("/credits")}><AppText style={[GamesType.caption, { color: theme.accentInk }]} languageCode={locale}>{t("rolePlay.getCredits")}</AppText></PressableScale> : null}
            </View>
          ) : null}
        </ScrollView>
      </View>
      <View style={[st.bottomBar, { paddingBottom: Math.max(insets.bottom, 12), borderTopColor: theme.border, backgroundColor: theme.canvas }]}>
        {typedMode ? (
          <View style={{ width: "100%", gap: 8 }}>
            <View style={st.inputRow}>
              <TextInput value={draft} onChangeText={setDraft} onSubmitEditing={() => void handleUserResponse(draft)} editable={status !== "thinking"} placeholder={t("rolePlay.typeReply")} placeholderTextColor={theme.faintInk} returnKeyType="send" style={[st.input, { color: theme.ink, backgroundColor: theme.surface, borderColor: theme.border }]} />
              <PressableScale onPress={() => void handleUserResponse(draft)} disabled={!draft.trim() || status === "thinking"} style={[st.sendButton, { backgroundColor: theme.accent, opacity: !draft.trim() || status === "thinking" ? 0.45 : 1 }]} accessibilityRole="button" accessibilityLabel={t("rolePlay.send")}>
                <HugeiconsIcon icon={ArrowRight02Icon} size={22} color={theme.onAccent} strokeWidth={2.4} />
              </PressableScale>
            </View>
            <PressableScale onPress={toggleInputMode} style={st.modeLink}><AppText style={[GamesType.caption, { color: theme.accentInk }]} languageCode={locale}>{t("rolePlay.useVoice")}</AppText></PressableScale>
          </View>
        ) : (
          <View style={{ alignItems: "center", gap: 6 }}>
            <MicCaptureOrb listening={status === "listening" || voiceCapture.listening} disabled={status === "thinking" || voiceCapture.processing} color={status === "listening" ? theme.danger : theme.accent} size={82} hint={micHint} onPress={handleMicTap} />
            <PressableScale onPress={toggleInputMode} style={st.modeLink}><AppText style={[GamesType.caption, { color: theme.accentInk }]} languageCode={locale}>{t("rolePlay.typeInstead")}</AppText></PressableScale>
          </View>
        )}
        {feedback.length >= 2 ? (
          <PressableScale onPress={finishSession} style={[st.finishButton, { borderColor: theme.accentBorder, backgroundColor: theme.accentWash }]}>
            <HugeiconsIcon icon={StarIcon} size={17} color={theme.accentInk} strokeWidth={2.2} />
            <AppText style={[GamesType.caption, { color: theme.accentInk }]} languageCode={locale}>{t("rolePlay.finishSession")}</AppText>
          </PressableScale>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}

function useRolePlayStyles() {
  const theme = useGamesTheme();
  const metrics = useGamesMetrics(false);
  return useMemo(() => createStyles(theme, metrics.radiusCard), [theme, metrics.radiusCard]);
}

function createStyles(theme: GamesTheme, radiusCard: number) {
  return StyleSheet.create({
    heroCard: { flexDirection: "row", alignItems: "center", gap: 14 },
    heroIcon: { width: 58, height: 58, borderRadius: 20, alignItems: "center", justifyContent: "center", borderWidth: 1 },
    scenarioRail: { gap: 8, paddingRight: 4 },
    scenarioChip: { height: 44, paddingHorizontal: 13, borderRadius: 22, borderWidth: 1, flexDirection: "row", alignItems: "center", gap: 7 },
    cardHeading: { flexDirection: "row", alignItems: "center", gap: 9 },
    smallIcon: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
    goalRow: { flexDirection: "row", alignItems: "center", gap: 10 },
    goalNumber: { width: 26, height: 26, borderRadius: 13, alignItems: "center", justifyContent: "center" },
    progressCard: { width: "90%", marginTop: 8, padding: 10, borderRadius: 16, borderWidth: 1, flexDirection: "row", alignItems: "center", gap: 10 },
    progressDots: { flexDirection: "row", gap: 5 },
    progressDot: { height: 5, flex: 1, borderRadius: 3 },
    chatContainer: { flex: 1, width: "100%" },
    chatContent: { paddingTop: 12, paddingBottom: 16, gap: 10 },
    bubbleRow: { maxWidth: "92%", alignItems: "flex-end", gap: 7 },
    avatar: { width: 30, height: 30, borderRadius: 10, borderWidth: 1, alignItems: "center", justifyContent: "center", marginBottom: 2 },
    bubble: { maxWidth: "88%", borderRadius: 18, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10 },
    thinkingPill: { alignSelf: "flex-start", borderRadius: 14, paddingHorizontal: 12, paddingVertical: 8 },
    coachCard: { borderRadius: 16, borderWidth: 1, padding: 12, gap: 7 },
    errorCard: { borderRadius: 14, borderWidth: 1, padding: 11, flexDirection: "row", alignItems: "center", gap: 8 },
    bottomBar: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 9, paddingHorizontal: 16, alignItems: "center", gap: 8 },
    modeLink: { minHeight: 32, paddingHorizontal: 12, alignItems: "center", justifyContent: "center" },
    inputRow: { flexDirection: "row", gap: 9, alignItems: "center" },
    input: { flex: 1, height: 48, borderRadius: 16, borderWidth: 1, paddingHorizontal: 14, fontSize: 16, writingDirection: "ltr", textAlign: "left" },
    sendButton: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
    finishButton: { minHeight: 38, borderRadius: 19, borderWidth: 1, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 },
    scoreRing: { width: 118, height: 118, borderRadius: 59, borderWidth: 2, alignItems: "center", justifyContent: "center" },
    resultGoal: { minHeight: 52, borderRadius: 16, borderWidth: 1, paddingHorizontal: 13, paddingVertical: 10, flexDirection: "row", alignItems: "center", gap: 10 },
  });
}
