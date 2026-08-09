/**
 * RolePlayScreen — on the shared practice-surface system (`games-theme.ts`).
 *
 * The four scenarios used to carry their own accent colours (`#F59E0B`,
 * `#8B5CF6`, `#10B981`, `#EF4444`). Two of those are the app's success and
 * danger colours, on a screen that also grades spoken answers — so "green"
 * meant both "the interview scenario" and "you got that right". Scenario
 * identity is now carried by the icon and the title; colour is reserved for
 * meaning: coral for what you can act on, red only for stop.
 */

import { PressableScale } from "../../components/animations";
import { MicCaptureOrb } from "../../components/voice/MicCaptureOrb";
import { useSpeechCapture } from "../../hooks/use-speech-capture";
import { useSafeBack } from "../../hooks/use-safe-back";
import { useTTS } from "../../hooks/use-tts";
import { crossShadow } from "../../utils/shadows";
import { hapticImpact, hapticSelection } from "../../utils/haptics";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Coffee01Icon,
  Rocket01Icon,
  Briefcase01Icon,
  Store01Icon,
  RotateLeft01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { AppText } from "../../components/ui/AppText";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import {
  isGeminiConfigured,
  generateRolePlayResponse,
} from "../../services/gemini-speech-service";

import {
  GamesCard,
  GamesGlassHeader,
  GamesIconButton,
  GamesIntroCard,
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

type HugeiconsIconData = {
  name: string;
  paths: string[];
  width: number;
  height: number;
};

type Scenario = {
  id: string;
  title: string;
  titleKu: string;
  subtitleKu: string;
  subtitle: string;
  icon: any;
  initialMessage: string;
  voicePitch: number;
  voiceRate: number;
};

const SCENARIOS: Scenario[] = [
  {
    id: "cafe",
    title: "Coffee Shop",
    titleKu: "قاوەخانەی پاریس",
    subtitleKu: "داواکردنی قاوە و کرۆسان بە ئینگلیزی",
    subtitle: "Order coffee and croissants in English",
    icon: Coffee01Icon,
    initialMessage:
      "Bonjour! Welcome to Le Petit Café. What can I get started for you today?",
    voicePitch: 0.95,
    voiceRate: 1.0,
  },
  {
    id: "space",
    title: "Mars Flight",
    titleKu: "گەشتی مەریخ",
    subtitleKu: "گفتوگۆ لەسەر کێشی جانتاکەت",
    subtitle: "Explain your overweight luggage to the gate agent",
    icon: Rocket01Icon,
    initialMessage:
      "Greetings space traveler. Your bag exceeds the Mars transit weight limit. Please justify.",
    voicePitch: 1.25,
    voiceRate: 1.05,
  },
  {
    id: "job",
    title: "Job Interview",
    titleKu: "چاوپێکەوتنی کار",
    subtitleKu: "چاوپێکەوتن بۆ ئەندازیاری AI",
    subtitle: "Interview for an AI Engineering position",
    icon: Briefcase01Icon,
    initialMessage:
      "Thank you for joining us. Could you describe your experience optimizing small language models?",
    voicePitch: 1.1,
    voiceRate: 0.95,
  },
  {
    id: "market",
    title: "Bazaar Bargain",
    titleKu: "بازاڕی گەورە",
    subtitleKu: "ڕێككەوتن لەسەر نرخی فەرش",
    subtitle: "Negotiate the price of a hand-woven rug",
    icon: Store01Icon,
    initialMessage:
      "Ah, my friend! This rug was woven under a blue moon. For you, only five hundred gold coins!",
    voicePitch: 0.85,
    voiceRate: 1.1,
  },
];

type Status = "idle" | "listening" | "thinking" | "speaking" | "error";

/* ─── Animated Pulse Ring ─── */
const PulseRing = React.memo(function PulseRing({
  size,
  color,
  delay,
  status,
}: {
  size: number;
  color: string;
  delay: number;
  status: Status;
}) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    cancelAnimation(scale);
    cancelAnimation(opacity);

    if (status === "listening") {
      scale.value = 1;
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: 200, easing: Easing.out(Easing.ease) }),
          withTiming(0, { duration: 1200, easing: Easing.out(Easing.ease) }),
        ),
        -1,
        false,
      );
      scale.value = withRepeat(
        withSequence(
          withTiming(1, { duration: delay }),
          withTiming(1.6, { duration: 1400, easing: Easing.out(Easing.cubic) }),
          withTiming(1, { duration: 0 }),
        ),
        -1,
        false,
      );
    } else if (status === "speaking") {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 800, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      );
      opacity.value = withTiming(0.25, { duration: 400 });
    } else if (status === "thinking") {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.98, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      );
      opacity.value = withTiming(0.15, { duration: 300 });
    } else {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.04, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      );
      opacity.value = withTiming(0.12, { duration: 600 });
    }
  }, [status, scale, opacity, delay]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const r = size / 2;
  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: size,
          height: size,
          borderRadius: r,
          borderWidth: 2,
          borderColor: color,
        },
        animStyle,
      ]}
    />
  );
});

/* ─── Chat Bubble ───
 * The AI side carries the mode hue on its avatar chip only — a persona marker,
 * never an affordance. The user side is accent-washed, which is the same
 * "this is yours / this is active" signal used everywhere else in the system.
 */
const ChatBubble = React.memo(function ChatBubble({
  sender,
  text,
  icon,
  isRtl,
}: {
  sender: "user" | "ai";
  text: string;
  icon: HugeiconsIconData;
  isRtl: boolean;
}) {
  const isAi = sender === "ai";
  const theme = useGamesTheme();
  const hue = useGameHue("roleplay");
  const st = useRolePlayStyles();

  return (
    <Animated.View
      entering={FadeInUp.duration(300).springify().damping(18)}
      style={[
        st.bubbleRow,
        isAi
          ? { flexDirection: isRtl ? "row-reverse" : "row" }
          : { flexDirection: isRtl ? "row" : "row-reverse" },
      ]}
    >
      {isAi && (
        <View
          style={[
            st.avatar,
            { backgroundColor: hue.wash, borderColor: hue.border, borderWidth: 1 },
          ]}
        >
          <HugeiconsIcon icon={icon as any} size={16} color={hue.ink} strokeWidth={2} />
        </View>
      )}
      <View
        style={[
          st.bubble,
          isAi
            ? { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }
            : {
                alignSelf: "flex-end",
                backgroundColor: theme.accentWash,
                borderColor: withAlpha(theme.accent, 0.28),
                borderWidth: 1,
              },
        ]}
      >
        <AppText
          style={[GamesType.body, { color: theme.ink, lineHeight: 22 }]}
          languageCode="en"
          align="start"
          latinRole="medium"
        >
          {text}
        </AppText>
      </View>
    </Animated.View>
  );
});

/* ─── Main Screen ─── */
export function RolePlayScreen() {
  const safeBack = useSafeBack("/(tabs)/play");
  const insets = useSafeAreaInsets();
  const { theme, metrics, isWide, isRtl, t, locale, isKu } =
    useGamesChrome("roleplay");
  const st = useRolePlayStyles();
  const scrollRef = useRef<ScrollView>(null);
  const speech = useSpeechCapture("en-US");
  const abortSpeech = speech.abort;
  const { speak: speakTts, stop: stopTts } = useTTS();

  const [activeScenario, setActiveScenario] = useState<Scenario>(SCENARIOS[0]);
  const [status, setStatus] = useState<Status>("idle");
  const [history, setHistory] = useState<{ sender: "user" | "ai"; text: string }[]>([]);
  const [scrolled, setScrolled] = useState(false);

  const statusRef = useRef(status);
  const scenarioRef = useRef(activeScenario);
  const listenTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const responseRequestIdRef = useRef(0);
  const finalTranscriptHandledRef = useRef(false);
  const historyRef = useRef(history);

  const setStatusNow = useCallback((next: Status) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  useEffect(() => { historyRef.current = history; }, [history]);
  useEffect(() => { statusRef.current = status; }, [status]);
  useEffect(() => { scenarioRef.current = activeScenario; }, [activeScenario]);

  const clearListenTimeout = useCallback(() => {
    if (listenTimeoutRef.current) {
      clearTimeout(listenTimeoutRef.current);
      listenTimeoutRef.current = null;
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    void stopTts();
  }, [stopTts]);

  useEffect(() => {
    return () => {
      clearListenTimeout();
      stopSpeaking();
      abortSpeech();
    };
  }, [abortSpeech, clearListenTimeout, stopSpeaking]);

  function stopListening() {
    clearListenTimeout();
    speech.stop();
  }

  function stopAll() {
    responseRequestIdRef.current += 1;
    stopSpeaking();
    stopListening();
  }

  function speak(text: string) {
    const sc = scenarioRef.current;
    setStatusNow("speaking");
    void speakTts(text, "en", "roleplay", {
      rate: sc.voiceRate,
      pitch: sc.voicePitch,
      onDone: () => {
        if (statusRef.current === "speaking") void startListening();
      },
    });
  }

  const handleUserResponse = useCallback(async (userText: string) => {
    const cleanText = userText.trim();
    if (!cleanText) {
      setStatusNow("idle");
      return;
    }

    const requestId = responseRequestIdRef.current + 1;
    responseRequestIdRef.current = requestId;

    setHistory((p) => [...p, { sender: "user", text: cleanText }]);
    setStatusNow("thinking");
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    if (isGeminiConfigured()) {
      try {
        const currentHistory = historyRef.current;
        const r = await generateRolePlayResponse(scenarioRef.current.id, cleanText, currentHistory);
        if (responseRequestIdRef.current !== requestId || statusRef.current !== "thinking") {
          return;
        }
        setHistory((p) => [...p, { sender: "ai", text: r }]);
        speak(r);
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
        return;
      } catch (err) {
        console.warn("Gemini RolePlay failed, falling back to mock:", err);
      }
    }

    // Fallback Mock logic
    setTimeout(() => {
      const sc = scenarioRef.current;
      let r = "";
      if (responseRequestIdRef.current !== requestId || statusRef.current !== "thinking") {
        return;
      }

      const lower = cleanText.toLowerCase();

      if (sc.id === "cafe") {
        r =
          lower.includes("croissant") || lower.includes("pastry")
            ? "Excellent choice! Our croissants are baked fresh. Would you like a café au lait with that?"
            : lower.includes("espresso") || lower.includes("coffee")
              ? "Double espresso, très bien! Coming right up. Shall I add a pain au chocolat?"
              : "Of course! Will you be enjoying that at our sunny patio, or is it to go?";
      } else if (sc.id === "space") {
        r =
          lower.includes("oxygen") || lower.includes("life support")
            ? "Life support systems are critical gear. Fee waived. Enjoy your journey to Mars!"
            : "My scanner detects dense materials. You must justify this weight in English, passenger.";
      } else if (sc.id === "job") {
        r =
          lower.includes("optim") || lower.includes("model") || lower.includes("ai")
            ? "Impressive. How do you handle quantization trade-offs for mobile speech models?"
            : "Interesting. What's your approach to balancing responsiveness with heavy AI processing?";
      } else {
        const nums = cleanText.match(/\d+/g);
        r = nums
          ? parseInt(nums[0], 10) < 300
            ? "You break my heart! Four hundred is my final offer!"
            : "A skilled negotiator! Three fifty, and I add Turkish tea. Deal?"
          : "Feel the quality! Pure silk. Make me a serious offer in English!";
      }

      setHistory((p) => [...p, { sender: "ai", text: r }]);
      speak(r);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
    }, 700);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startListening = async () => {
    stopSpeaking();
    finalTranscriptHandledRef.current = false;
    setStatusNow("listening");

    const started = await speech.start({
      onResult: (text, isFinal) => {
        if (!isFinal) return;
        if (finalTranscriptHandledRef.current) return;
        finalTranscriptHandledRef.current = true;
        clearListenTimeout();
        setStatusNow("thinking");
        handleUserResponse(text);
      },
      onEnd: () => {
        if (statusRef.current === "listening") setStatusNow("idle");
      },
    });

    if (!started) {
      setStatusNow("idle");
      return;
    }

    clearListenTimeout();
    listenTimeoutRef.current = setTimeout(() => {
      if (statusRef.current === "listening") {
        speech.stop();
        setStatusNow("idle");
      }
    }, 12000);
  };

  function startSession() {
    stopAll();
    hapticImpact();
    const msg = scenarioRef.current.initialMessage;
    setHistory([{ sender: "ai", text: msg }]);
    speak(msg);
  }

  function resetSession() {
    stopAll();
    hapticImpact();
    setHistory([]);
    setStatusNow("idle");
  }

  const handleMicTap = () => {
    hapticImpact();
    switch (statusRef.current) {
      case "idle":
      case "error":
        if (history.length === 0) startSession();
        else void startListening();
        break;
      case "speaking":
        stopSpeaking();
        void startListening();
        break;
      case "listening":
        stopListening();
        setStatusNow("idle");
        break;
      case "thinking":
        responseRequestIdRef.current += 1;
        setStatusNow("idle");
        break;
    }
  };

  const sessionStarted = history.length > 0;
  const Icon = activeScenario.icon;
  const scenarioTitle = isKu ? activeScenario.titleKu : activeScenario.title;
  const scenarioSubtitle = isKu ? activeScenario.subtitleKu : activeScenario.subtitle;
  const scenarioLanguage = isKu ? "ku" : "en";

  const micHint = speech.error
    ? speech.error
    : status === "listening"
      ? t("rolePlay.listening")
      : status === "thinking"
        ? t("rolePlay.thinking")
        : status === "speaking"
          ? t("rolePlay.interrupt")
          : t("rolePlay.tapSpeak");

  const handleExit = useCallback(() => {
    stopAll();
    safeBack();
  }, [safeBack]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ─── Scenario Picker (Setup) ─── */
  if (!sessionStarted) {
    return (
      <GamesScreenShell
        onScroll={(e) => setScrolled(e.nativeEvent.contentOffset.y > 4)}
        header={
          <GamesGlassHeader
            title={t("rolePlay.headerTitle")}
            titleLanguageCode={locale}
            onBack={handleExit}
            scrolled={scrolled}
          />
        }
        footer={
          <GamesPrimaryButton
            label={t("rolePlay.start")}
            languageCode={locale}
            onPress={startSession}
          />
        }
      >
        {/* The intro card doubles as a live preview of the picked scene: the
            hue stays constant (that is the mode's identity) while the glyph and
            title track the selection, so the choice is confirmed immediately. */}
        <GamesIntroCard
          mode="roleplay"
          icon={Icon}
          languageCode={scenarioLanguage}
          eyebrow={t("rolePlay.headerSub")}
          title={scenarioTitle}
          blurb={scenarioSubtitle}
        />

        <View style={{ gap: 10 }}>
          <GamesSectionLabel languageCode={locale}>
            {t("rolePlay.chooseScene")}
          </GamesSectionLabel>

          <GamesCard padded={false} entering={FadeInDown.duration(GamesMotion.enterMs)}>
            {SCENARIOS.map((sc, idx) => {
              const sel = activeScenario.id === sc.id;
              const ScIcon = sc.icon;
              const isLast = idx === SCENARIOS.length - 1;
              return (
                <React.Fragment key={sc.id}>
                  <PressableScale
                    onPress={() => {
                      hapticSelection();
                      setActiveScenario(sc);
                    }}
                    scaleDown={0.98}
                    accessibilityRole="button"
                    accessibilityState={{ selected: sel }}
                  >
                    <View
                      style={[
                        st.scenarioRow,
                        { flexDirection: isRtl ? "row-reverse" : "row" },
                        sel && { backgroundColor: theme.accentWash },
                      ]}
                    >
                      <View
                        style={[
                          st.scenarioIconCircle,
                          {
                            backgroundColor: sel ? theme.accent : theme.surfaceSunken,
                            borderColor: sel ? theme.accentBorder : theme.border,
                          },
                        ]}
                      >
                        <HugeiconsIcon
                          icon={ScIcon as any}
                          size={22}
                          color={sel ? theme.onAccent : theme.mutedInk}
                          strokeWidth={2}
                        />
                      </View>
                      <View
                        style={[
                          st.scenarioTextCol,
                          { alignItems: isRtl ? "flex-end" : "flex-start" },
                        ]}
                      >
                        <AppText
                          style={[
                            GamesType.section,
                            { fontSize: 15, color: sel ? theme.accentInk : theme.ink },
                          ]}
                          languageCode={isKu ? "ku" : "en"}
                          align="start"
                        >
                          {isKu ? sc.titleKu : sc.title}
                        </AppText>
                        <AppText
                          style={[GamesType.caption, { fontSize: 12, color: theme.mutedInk }]}
                          languageCode={isKu ? "ku" : "en"}
                          align="start"
                          latinRole="medium"
                        >
                          {isKu ? sc.subtitleKu : sc.subtitle}
                        </AppText>
                      </View>
                      {sel && (
                        <View style={[st.checkCircle, { backgroundColor: theme.accent }]}>
                          <HugeiconsIcon
                            icon={Tick02Icon}
                            size={14}
                            color={theme.onAccent}
                            strokeWidth={3}
                          />
                        </View>
                      )}
                    </View>
                  </PressableScale>
                  {!isLast && <View style={st.rowDivider} />}
                </React.Fragment>
              );
            })}
          </GamesCard>

          <AppText
            style={[GamesType.caption, { color: theme.faintInk, lineHeight: 18 }]}
            languageCode={locale}
            align="start"
          >
            {t("rolePlay.practiceDisclaimer")}
          </AppText>
        </View>
      </GamesScreenShell>
    );
  }

  /* ─── In-Session Conversation UI ─── */
  const statusActive = status !== "idle";

  return (
    <View style={{ flex: 1, backgroundColor: theme.canvas }}>
      <GamesGlassHeader
        title={scenarioTitle}
        titleLanguageCode={scenarioLanguage}
        onBack={handleExit}
        scrolled
        right={
          <GamesIconButton
            icon={RotateLeft01Icon}
            onPress={resetSession}
            accessibilityLabel={t("rolePlay.headerTitle")}
          />
        }
      />

      {/* Voice orb — the one accent-filled thing on screen, because tapping it
          is the only thing you can do here. */}
      <Animated.View entering={FadeIn.duration(500)} style={st.orbSection}>
        <View style={st.orbContainer}>
          <PulseRing size={180} color={theme.accent} delay={0} status={status} />
          <PulseRing size={220} color={theme.accent} delay={400} status={status} />
          <PulseRing size={260} color={theme.accent} delay={800} status={status} />
          <View
            style={[
              st.orbCore,
              {
                backgroundColor: theme.accent,
                ...crossShadow({
                  color: theme.accent,
                  offsetY: 12,
                  blur: 32,
                  opacity: theme.isDark ? 0.36 : 0.28,
                  elevation: 8,
                }),
              },
            ]}
          >
            <HugeiconsIcon icon={Icon as any} size={40} color={theme.onAccent} strokeWidth={1.8} />
          </View>
        </View>

        <AppText
          style={[
            GamesType.eyebrow,
            { color: statusActive ? theme.accentInk : theme.mutedInk, textAlign: "center" },
          ]}
          languageCode={locale}
          align="center"
        >
          {status === "listening"
            ? t("rolePlay.listening")
            : status === "thinking"
              ? t("rolePlay.thinking")
              : status === "speaking"
                ? t("rolePlay.interrupt")
                : t("rolePlay.tapSpeak")}
        </AppText>
      </Animated.View>

      {/* Transcript */}
      <View
        style={[
          st.chatContainer,
          {
            paddingHorizontal: metrics.gutter,
            maxWidth: isWide ? metrics.maxWidth : "100%",
            alignSelf: isWide ? "center" : "stretch",
          },
        ]}
      >
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[st.chatContent, { paddingBottom: 24 }]}
        >
          {history.map((msg, idx) => (
            <ChatBubble key={idx} sender={msg.sender} text={msg.text} icon={Icon} isRtl={isRtl} />
          ))}
          {status === "thinking" && (
            <Animated.View entering={FadeInUp.duration(200)} style={st.thinkingRow}>
              <View style={[st.thinkingDot, { backgroundColor: theme.accent }]} />
              <View style={[st.thinkingDot, { backgroundColor: theme.accent, opacity: 0.6 }]} />
              <View style={[st.thinkingDot, { backgroundColor: theme.accent, opacity: 0.3 }]} />
            </Animated.View>
          )}
        </ScrollView>
      </View>

      {/* Mic bar. Red only while recording — that is a stop affordance, which is
          the one non-error use of `danger` the system allows. */}
      <View style={[st.bottomBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <MicCaptureOrb
          listening={status === "listening" || speech.listening}
          disabled={status === "thinking"}
          color={status === "listening" ? theme.danger : theme.accent}
          size={100}
          hint={micHint}
          onPress={handleMicTap}
        />
      </View>
    </View>
  );
}

/* ─── Styles ─── */
function useRolePlayStyles() {
  const theme = useGamesTheme();
  const metrics = useGamesMetrics(false);
  return useMemo(() => createStyles(theme, metrics.radiusChip), [theme, metrics]);
}

function createStyles(theme: GamesTheme, radiusChip: number) {
  return StyleSheet.create({
    /* Scenario rows */
    scenarioRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 16,
      gap: 14,
    },
    scenarioIconCircle: {
      width: 44,
      height: 44,
      borderRadius: radiusChip,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    scenarioTextCol: {
      flex: 1,
      gap: 2,
    },
    checkCircle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    rowDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.border,
      marginHorizontal: 16,
    },

    /* Orb section */
    orbSection: {
      alignItems: "center",
      paddingTop: 12,
      paddingBottom: 4,
      gap: 14,
    },
    orbContainer: {
      width: 160,
      height: 160,
      alignItems: "center",
      justifyContent: "center",
    },
    orbCore: {
      width: 100,
      height: 100,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1.5,
      borderColor: "rgba(255,255,255,0.35)",
    },

    /* Transcript */
    chatContainer: {
      flex: 1,
      width: "100%",
    },
    chatContent: {
      gap: 10,
      paddingTop: 8,
    },
    bubbleRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 8,
      maxWidth: "92%",
    },
    avatar: {
      width: 30,
      height: 30,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 2,
    },
    bubble: {
      flex: 1,
      borderRadius: 18,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    thinkingRow: {
      flexDirection: "row",
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 12,
      alignSelf: "flex-start",
    },
    thinkingDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },

    /* Bottom bar */
    bottomBar: {
      alignItems: "center",
      paddingTop: 10,
      paddingHorizontal: 20,
      backgroundColor: "transparent",
    },
  });
}
