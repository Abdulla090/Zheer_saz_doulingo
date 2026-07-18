/**
 * RolePlayScreen — iOS 27 hyper-professional redesign.
 * Full-width scenario rows, animated voice orb, live chat transcript.
 */

import { PressableScale } from "../../components/animations";
import { RolePlayGameIcon } from "../../components/icons/GameHubIcons";
import { MicCaptureOrb } from "../../components/voice/MicCaptureOrb";
import {
  HomeLiquidButton,
  HomeLiquidCard,
  HomeLiquidPill,
  HomeMeshBackground,
  HomeType,
} from "../../components/ui/ios-liquid-home";
import { useI18n } from "../../hooks/useI18n";
import { useSpeechCapture } from "../../hooks/use-speech-capture";
import { useTTS } from "../../hooks/use-tts";
import { crossShadow } from "../../utils/shadows";
import { hapticImpact, hapticSelection } from "../../utils/haptics";
import { useRouter } from "expo-router";
// @ts-expect-error No type declarations for hugeicons cjs paths
import { HugeiconsIcon } from "@hugeicons/react-native/dist/cjs/index.js";
// @ts-expect-error No type declarations for hugeicons cjs paths
import { ArrowLeft01Icon, Coffee01Icon, Rocket01Icon, Briefcase01Icon, Store01Icon, RotateLeft01Icon } from "@hugeicons/core-free-icons/dist/cjs/index.js";
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
import { isGeminiConfigured, generateRolePlayResponse } from "../../services/gemini-speech-service";
import { useThemeColors } from "../../hooks/useThemeColors";

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
  icon: HugeiconsIconData;
  initialMessage: string;
  voicePitch: number;
  voiceRate: number;
  accent: string;
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
    accent: "#F59E0B",
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
    accent: "#8B5CF6",
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
    accent: "#10B981",
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
    accent: "#EF4444",
  },
];

type Status = "idle" | "listening" | "thinking" | "speaking" | "error";


/* ─── Animated Pulse Ring ─── */
const PulseRing = React.memo(function PulseRing({ size, color, delay, status }: { size: number; color: string; delay: number; status: Status }) {
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

/* ─── Chat Bubble ─── */
const ChatBubble = React.memo(function ChatBubble({ sender, text, accent, icon, isKu }: { sender: "user" | "ai"; text: string; accent: string; icon: HugeiconsIconData; isKu: boolean }) {
  const isAi = sender === "ai";
  const st = useRolePlayStyles();
  return (
    <Animated.View
      entering={FadeInUp.duration(300).springify().damping(18)}
      style={[
        st.bubbleRow,
        isAi
          ? { flexDirection: isKu ? "row-reverse" : "row" }
          : { flexDirection: isKu ? "row" : "row-reverse" },
      ]}
    >
      {isAi && (
        <View style={[st.avatar, { backgroundColor: accent + "18" }]}>
          <HugeiconsIcon icon={icon} size={16} color={accent} strokeWidth={2} />
        </View>
      )}
      <View
        style={[
          st.bubble,
          isAi
            ? st.aiBubble
            : [st.userBubble, { backgroundColor: accent + "12", borderColor: accent + "20" }],
        ]}
      >
        <AppText style={[st.bubbleText, isKu && { textAlign: "right", writingDirection: "rtl" }]}>
          {text}
        </AppText>
      </View>
    </Animated.View>
  );
});


/* ─── Main Screen ─── */
export function RolePlayScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, locale, isKu } = useI18n();
  const { colors, isDark } = useThemeColors();
  const st = useRolePlayStyles();
  const isRtl = isKu || locale === "ar";
  const scrollRef = useRef<ScrollView>(null);
  const speech = useSpeechCapture("en-US");
  const { speak: speakTts, stop: stopTts } = useTTS();

  const [activeScenario, setActiveScenario] = useState<Scenario>(SCENARIOS[0]);
  const [status, setStatus] = useState<Status>("idle");
  const [history, setHistory] = useState<{ sender: "user" | "ai"; text: string }[]>([]);

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

  function clearListenTimeout() {
    if (listenTimeoutRef.current) {
      clearTimeout(listenTimeoutRef.current);
      listenTimeoutRef.current = null;
    }
  }

  const stopSpeaking = useCallback(() => {
    void stopTts();
  }, [stopTts]);

  useEffect(() => {
    return () => {
      clearListenTimeout();
      stopSpeaking();
      speech.abort();
    };
  }, [speech, stopSpeaking]);

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

  const startListening = useCallback(async () => {
    if (!speech.available) {
      setStatusNow("idle");
      return;
    }

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
  }, [handleUserResponse, setStatusNow, speech, stopSpeaking]);

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
  const accent = activeScenario.accent;
  const Icon = activeScenario.icon;

  const micHint =
    status === "listening"
      ? t("rolePlay.listening")
      : status === "thinking"
        ? t("rolePlay.thinking")
        : status === "speaking"
          ? t("rolePlay.interrupt")
          : t("rolePlay.tapSpeak");

  /* ─── Scenario Picker (Setup) ─── */
  if (!sessionStarted) {
    return (
      <View style={st.root}>
        {!isDark && <HomeMeshBackground />}

        {/* Header */}
        <View style={[st.header, { paddingTop: insets.top + 8, flexDirection: "row" }]}>
          <HomeLiquidPill onPress={() => { stopAll(); router.back(); }} size={44}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} color={colors.foreground} strokeWidth={2.5} style={{ transform: [{ scaleX: isRtl ? -1 : 1 }] }} />
          </HomeLiquidPill>
          <View style={[st.headerCenter, { flexDirection: isRtl ? "row-reverse" : "row" }]}>
            <RolePlayGameIcon size={36} />
            <View style={{ alignItems: isRtl ? "flex-end" : "flex-start" }}>
              <AppText style={st.headerTitle} forceKurdishFont>{t("rolePlay.headerTitle")}</AppText>
              <AppText style={st.headerSub} forceKurdishFont>{t("rolePlay.headerSub")}</AppText>
            </View>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 32 }}
        >
          {/* Hero Card */}
          <Animated.View entering={FadeInDown.delay(100).duration(500)}>
            <HomeLiquidCard
              style={{ marginBottom: 24 }}
              contentStyle={st.heroInner}
            >
              <View style={st.heroOrbWrap}>
                <View style={[st.heroRingOuter, { borderColor: accent + "20" }]} />
                <View style={[st.heroRingInner, { borderColor: accent + "35" }]} />
                <View style={[st.heroIconCircle, { backgroundColor: accent + "14" }]}>
                  <HugeiconsIcon icon={Icon} size={36} color={accent} strokeWidth={1.8} />
                </View>
              </View>
              <AppText style={st.heroTitle} forceKurdishFont>
                {activeScenario.titleKu}
              </AppText>
              <AppText style={st.heroSubtitle} forceLatinFont latinRole="medium">
                {activeScenario.subtitle}
              </AppText>
            </HomeLiquidCard>
          </Animated.View>

          {/* Section label */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <AppText style={[st.sectionLabel, { textAlign: isKu ? "right" : "left" }]} forceKurdishFont>
              {t("rolePlay.chooseScene")}
            </AppText>
          </Animated.View>

          {/* Scenario rows */}
          <Animated.View entering={FadeInDown.delay(250).duration(500)}>
            <HomeLiquidCard contentStyle={{ padding: 0, overflow: "hidden" }}>
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
                    >
                      <View
                        style={[
                          st.scenarioRow,
                          { flexDirection: isKu ? "row-reverse" : "row" },
                          sel && { backgroundColor: sc.accent + "08" },
                        ]}
                      >
                        <View style={[st.scenarioIconCircle, { backgroundColor: sc.accent + "14" }]}>
                          <HugeiconsIcon icon={ScIcon} size={22} color={sc.accent} strokeWidth={2} />
                        </View>
                        <View style={[st.scenarioTextCol, { alignItems: isKu ? "flex-end" : "flex-start" }]}>
                          <AppText style={[st.scenarioTitle, sel && { color: sc.accent }]} forceKurdishFont>
                            {sc.titleKu}
                          </AppText>
                          <AppText style={st.scenarioSubtitle} forceLatinFont latinRole="medium">
                            {sc.title}
                          </AppText>
                        </View>
                        {sel && (
                          <View style={[st.checkCircle, { backgroundColor: sc.accent }]}>
                            <AppText style={{ color: "#FFF", fontSize: 11, fontWeight: "800" }}>✓</AppText>
                          </View>
                        )}
                      </View>
                    </PressableScale>
                    {!isLast && <View style={st.rowDivider} />}
                  </React.Fragment>
                );
              })}
            </HomeLiquidCard>
          </Animated.View>

          {/* Disclaimer */}
          <Animated.View entering={FadeInDown.delay(350).duration(400)}>
            <AppText style={[st.disclaimer, { textAlign: isKu ? "right" : "left" }]} forceKurdishFont>
              {t("rolePlay.practiceDisclaimer")}
            </AppText>
          </Animated.View>

          {/* Start Button */}
          <Animated.View entering={FadeInDown.delay(400).duration(500)} style={{ marginTop: 8 }}>
            <HomeLiquidButton
              label={t("rolePlay.start")}
              onPress={startSession}
            />
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  /* ─── In-Session Conversation UI ─── */
  return (
    <View style={st.root}>
      {!isDark && <HomeMeshBackground />}

      {/* Session Header */}
      <View style={[st.header, { paddingTop: insets.top + 8, flexDirection: "row" }]}>
        <HomeLiquidPill onPress={() => { stopAll(); router.back(); }} size={44}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={20} color={colors.foreground} strokeWidth={2.5} style={{ transform: [{ scaleX: isRtl ? -1 : 1 }] }} />
        </HomeLiquidPill>

        {/* Active scenario chip */}
        <PressableScale onPress={resetSession} scaleDown={0.95}>
          <View style={[st.sessionChip, { borderColor: accent + "30", flexDirection: isKu ? "row-reverse" : "row" }]}>
            <HugeiconsIcon icon={Icon} size={16} color={accent} strokeWidth={2.5} />
            <AppText style={[st.sessionChipText, { color: accent }]} forceLatinFont latinRole="bold">
              {activeScenario.title}
            </AppText>
          </View>
        </PressableScale>

        <HomeLiquidPill onPress={resetSession} size={44}>
          <HugeiconsIcon icon={RotateLeft01Icon} size={20} color={colors.foreground} strokeWidth={2.5} />
        </HomeLiquidPill>
      </View>

      {/* Animated Voice Orb */}
      <Animated.View entering={FadeIn.duration(500)} style={st.orbSection}>
        <View style={st.orbContainer}>
          <PulseRing size={180} color={accent} delay={0} status={status} />
          <PulseRing size={220} color={accent} delay={400} status={status} />
          <PulseRing size={260} color={accent} delay={800} status={status} />
          <View
            style={[
              st.orbCore,
              {
                backgroundColor: accent,
                ...crossShadow({
                  color: accent,
                  offsetY: 12,
                  blur: 32,
                  opacity: 0.3,
                  elevation: 8,
                }),
              },
            ]}
          >
            <HugeiconsIcon icon={Icon} size={40} color="#FFF" strokeWidth={1.8} />
          </View>
        </View>

        {/* Status label */}
        <AppText style={[st.statusLabel, { color: accent }]} forceKurdishFont={isKu}>
          {status === "listening"
            ? t("rolePlay.listening")
            : status === "thinking"
              ? t("rolePlay.thinking")
              : status === "speaking"
                ? (isKu ? "AI قسە دەکات..." : "AI is speaking...")
                : (isKu ? "بۆ قسەکردن مایکەکە دابگرە" : "Tap mic to speak")}
        </AppText>
      </Animated.View>

      {/* Chat Transcript */}
      <View style={st.chatContainer}>
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[st.chatContent, { paddingBottom: 24 }]}
        >
          {history.map((msg, idx) => (
            <ChatBubble
              key={idx}
              sender={msg.sender}
              text={msg.text}
              accent={accent}
              icon={Icon}
              isKu={isKu}
            />
          ))}
          {status === "thinking" && (
            <Animated.View entering={FadeInUp.duration(200)} style={st.thinkingRow}>
              <View style={[st.thinkingDot, { backgroundColor: accent }]} />
              <View style={[st.thinkingDot, { backgroundColor: accent, opacity: 0.6 }]} />
              <View style={[st.thinkingDot, { backgroundColor: accent, opacity: 0.3 }]} />
            </Animated.View>
          )}
        </ScrollView>
      </View>

      {/* Bottom Mic Bar */}
      <View style={[st.bottomBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <MicCaptureOrb
          listening={status === "listening" || speech.listening}
          disabled={status === "thinking"}
          color={status === "listening" ? "#EF4444" : accent}
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
  const { colors, isDark } = useThemeColors();
  return useMemo(() => createStyles(colors, isDark), [colors, isDark]);
}

function createStyles(colors: any, isDark: boolean) {
  return StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.foreground,
    fontFamily: "DINNextRoundedBold",
    letterSpacing: -0.3,
  },
  headerSub: {
    ...HomeType.caption,
    color: colors.mutedForeground,
  },

  /* Hero card */
  heroInner: {
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 20,
    gap: 10,
  },
  heroOrbWrap: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  heroRingOuter: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1.5,
  },
  heroRingInner: {
    position: "absolute",
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
  },
  heroIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.foreground,
    textAlign: "center",
    fontFamily: "DINNextRoundedBold",
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
    textAlign: "center",
    lineHeight: 20,
  },

  /* Section label */
  sectionLabel: {
    ...HomeType.section,
    color: colors.foreground,
    marginBottom: 10,
  },

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
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  scenarioTextCol: {
    flex: 1,
    gap: 2,
  },
  scenarioTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.foreground,
    fontFamily: "DINNextRoundedBold",
  },
  scenarioSubtitle: {
    fontSize: 12,
    color: colors.mutedForeground,
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
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },

  /* Disclaimer */
  disclaimer: {
    ...HomeType.caption,
    color: colors.mutedForeground,
    marginTop: 14,
    marginBottom: 4,
    lineHeight: 18,
    paddingHorizontal: 4,
  },

  /* Session chip */
  sessionChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: isDark ? colors.surfaceRaised : "rgba(255,255,255,0.88)",
  },
  sessionChipText: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "DINNextRoundedBold",
  },

  /* Animated orb section */
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
  statusLabel: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "DINNextRoundedBold",
    letterSpacing: 0.5,
    textAlign: "center",
    textTransform: "uppercase",
  },

  /* Chat transcript */
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
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
  aiBubble: {
    backgroundColor: isDark ? colors.surfaceRaised : "rgba(255,255,255,0.85)",
    borderWidth: 1,
    borderColor: colors.border,
  },
  userBubble: {
    alignSelf: "flex-end",
    borderWidth: 1,
  },
  bubbleText: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.foreground,
    lineHeight: 22,
    fontFamily: "DINNextRoundedRegular",
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
