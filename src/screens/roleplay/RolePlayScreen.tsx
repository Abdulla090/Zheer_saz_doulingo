/**
 * RolePlayScreen — liquid glass + soft 3D hub, native/web speech via expo-speech-recognition.
 */

import { PressableScale } from "@/components/animations";
import { RolePlayGameIcon } from "@/components/icons/GameHubIcons";
import { MicCaptureOrb } from "@/components/voice/MicCaptureOrb";
import {
  HomeLiquidButton,
  HomeLiquidCard,
  HomeLiquidPill,
  HomeMeshBackground,
  HomePalette,
  HomeType,
} from "@/components/ui/ios-liquid-home";
import { useI18n } from "@/hooks/useI18n";
import { useSpeechCapture } from "@/hooks/use-speech-capture";
import { crossShadow } from "@/utils/shadows";
import { hapticImpact, hapticSelection } from "@/utils/haptics";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Briefcase,
  Coffee,
  Rocket,
  Send,
  Store,
} from "lucide-react-native";
import { AppText } from "@/components/ui/AppText";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const C = HomePalette;
const { width: SW } = Dimensions.get("window");

type Scenario = {
  id: string;
  title: string;
  titleKu: string;
  subtitleKu: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
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
    icon: Coffee,
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
    icon: Rocket,
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
    icon: Briefcase,
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
    icon: Store,
    initialMessage:
      "Ah, my friend! This rug was woven under a blue moon. For you, only five hundred gold coins!",
    voicePitch: 0.85,
    voiceRate: 1.1,
    accent: "#EF4444",
  },
];

type Status = "idle" | "listening" | "thinking" | "speaking" | "error";

export function RolePlayScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const scrollRef = useRef<ScrollView>(null);
  const speech = useSpeechCapture("en-US");

  const [activeScenario, setActiveScenario] = useState<Scenario>(SCENARIOS[0]);
  const [status, setStatus] = useState<Status>("idle");
  const [history, setHistory] = useState<{ sender: "user" | "ai"; text: string }[]>([]);
  const [textInput, setTextInput] = useState("");
  const [showTyping, setShowTyping] = useState(false);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const statusRef = useRef(status);
  const scenarioRef = useRef(activeScenario);
  const listenTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);
  useEffect(() => {
    scenarioRef.current = activeScenario;
  }, [activeScenario]);

  useEffect(() => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
    if (!speech.available) setShowTyping(true);
    return () => {
      clearListenTimeout();
      stopSpeaking();
      speech.abort();
    };
  }, [speech]);

  const clearListenTimeout = () => {
    if (listenTimeoutRef.current) {
      clearTimeout(listenTimeoutRef.current);
      listenTimeoutRef.current = null;
    }
  };

  const stopSpeaking = () => {
    try {
      synthRef.current?.cancel();
    } catch {
      /* noop */
    }
  };

  const stopListening = () => {
    clearListenTimeout();
    speech.stop();
  };

  const stopAll = () => {
    stopSpeaking();
    stopListening();
  };

  const speak = (text: string) => {
    const sc = scenarioRef.current;
    if (synthRef.current && Platform.OS === "web") {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = sc.voicePitch;
      utterance.rate = sc.voiceRate;
      utterance.lang = "en-US";
      const voices = synthRef.current.getVoices();
      const pref = voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.includes("Google") ||
            v.name.includes("Natural") ||
            v.name.includes("Samantha")),
      );
      if (pref) utterance.voice = pref;
      utterance.onstart = () => setStatus("speaking");
      utterance.onend = () => {
        if (statusRef.current === "speaking") void startListening();
      };
      utterance.onerror = () => {
        if (statusRef.current === "speaking") setStatus("idle");
      };
      synthRef.current.speak(utterance);
      setStatus("speaking");
    } else {
      setStatus("speaking");
      setTimeout(() => {
        if (statusRef.current === "speaking") void startListening();
      }, 2200);
    }
  };

  const handleUserResponse = useCallback((userText: string) => {
    setHistory((p) => [...p, { sender: "user", text: userText }]);

    setTimeout(() => {
      const sc = scenarioRef.current;
      let r = "";
      const t = userText.toLowerCase();

      if (sc.id === "cafe") {
        r =
          t.includes("croissant") || t.includes("pastry")
            ? "Excellent choice! Our croissants are baked fresh. Would you like a café au lait with that?"
            : t.includes("espresso") || t.includes("coffee")
              ? "Double espresso, très bien! Coming right up. Shall I add a pain au chocolat?"
              : "Of course! Will you be enjoying that at our sunny patio, or is it to go?";
      } else if (sc.id === "space") {
        r =
          t.includes("oxygen") || t.includes("life support")
            ? "Life support systems are critical gear. Fee waived. Enjoy your journey to Mars!"
            : "My scanner detects dense materials. You must justify this weight in English, passenger.";
      } else if (sc.id === "job") {
        r =
          t.includes("optim") || t.includes("model") || t.includes("ai")
            ? "Impressive. How do you handle quantization trade-offs for mobile speech models?"
            : "Interesting. What's your approach to balancing responsiveness with heavy AI processing?";
      } else {
        const nums = userText.match(/\d+/g);
        r = nums
          ? parseInt(nums[0], 10) < 300
            ? "You break my heart! Four hundred is my final offer!"
            : "A skilled negotiator! Three fifty, and I add Turkish tea. Deal?"
          : "Feel the quality! Pure silk. Make me a serious offer in English!";
      }

      setHistory((p) => [...p, { sender: "ai", text: r }]);
      speak(r);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
    }, 1100);
  }, []);

  const startListening = useCallback(async () => {
    if (showTyping || !speech.available) {
      setStatus("idle");
      return;
    }

    stopSpeaking();
    setStatus("listening");

    const started = await speech.start({
      onResult: (text, isFinal) => {
        if (!isFinal) return;
        clearListenTimeout();
        setStatus("thinking");
        handleUserResponse(text);
      },
      onEnd: () => {
        if (statusRef.current === "listening") setStatus("idle");
      },
    });

    if (!started) {
      setShowTyping(true);
      setStatus("idle");
      return;
    }

    clearListenTimeout();
    listenTimeoutRef.current = setTimeout(() => {
      if (statusRef.current === "listening") {
        speech.stop();
        setStatus("idle");
      }
    }, 12000);
  }, [handleUserResponse, showTyping, speech]);

  const startSession = () => {
    stopAll();
    hapticImpact();
    const msg = scenarioRef.current.initialMessage;
    setHistory([{ sender: "ai", text: msg }]);
    speak(msg);
  };

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
        setStatus("idle");
        break;
      case "thinking":
        setStatus("idle");
        break;
    }
  };

  const handleTextSubmit = () => {
    const trimmed = textInput.trim();
    if (!trimmed) return;
    setTextInput("");
    setStatus("thinking");
    handleUserResponse(trimmed);
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

  return (
    <View style={styles.root}>
      <HomeMeshBackground />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <HomeLiquidPill onPress={() => { stopAll(); router.back(); }} size={44}>
            <ArrowLeft size={20} color={C.navy} strokeWidth={2.5} />
          </HomeLiquidPill>
          <View style={styles.headerCenter}>
            <RolePlayGameIcon size={40} />
            <View>
              <Text style={styles.headerTitle}>{t("rolePlay.headerTitle")}</Text>
              <Text style={styles.headerSub}>{t("rolePlay.headerSub")}</Text>
            </View>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + (sessionStarted ? 200 : 32),
          }}
          keyboardShouldPersistTaps="handled"
        >
          {!sessionStarted ? (
            <>
              <Text style={styles.pickerLabel}>{t("rolePlay.chooseScene")}</Text>
              <Text style={styles.disclaimer}>
                {t("rolePlay.practiceDisclaimer")}
              </Text>
              <View style={styles.scenarioGrid}>
                {SCENARIOS.map((sc) => {
                  const sel = activeScenario.id === sc.id;
                  const ScIcon = sc.icon;
                  return (
                    <PressableScale
                      key={sc.id}
                      onPress={() => {
                        hapticSelection();
                        setActiveScenario(sc);
                      }}
                      scaleDown={0.98}
                      style={{ width: (SW - 52) / 2 }}
                    >
                      <HomeLiquidCard
                        interactive
                        style={[
                          sel && {
                            borderWidth: 1.5,
                            borderColor: sc.accent + "55",
                          },
                          crossShadow({
                            color: sel ? sc.accent : "#1A2B48",
                            offsetY: 8,
                            blur: 18,
                            opacity: sel ? 0.1 : 0.05,
                            elevation: sel ? 5 : 2,
                          }),
                        ]}
                        contentStyle={styles.scenarioInner}
                      >
                        <View
                          style={[
                            styles.scenarioIconWrap,
                            { backgroundColor: sc.accent + "18" },
                          ]}
                        >
                          <ScIcon size={24} color={sc.accent} strokeWidth={2} />
                        </View>
                        <AppText
                          style={[styles.scenarioName, sel && { color: sc.accent }]}
                          numberOfLines={2}
                          forceKurdishFont
                        >
                          {sc.titleKu}
                        </AppText>
                        <Text style={styles.scenarioEn}>{sc.title}</Text>
                      </HomeLiquidCard>
                    </PressableScale>
                  );
                })}
              </View>

              <HomeLiquidCard
                style={styles.heroCard}
                contentStyle={styles.heroInner}
              >
                <View style={[styles.heroIconRing, { borderColor: accent + "40" }]}>
                  <Icon size={44} color={accent} strokeWidth={1.8} />
                </View>
                <AppText style={styles.heroTitle} forceKurdishFont>
                  {activeScenario.titleKu}
                </AppText>
                <AppText style={styles.heroSub} forceKurdishFont>
                  {activeScenario.subtitleKu}
                </AppText>
                <HomeLiquidButton
                  label={t("rolePlay.start")}
                  onPress={startSession}
                  style={styles.startBtn}
                />
              </HomeLiquidCard>
            </>
          ) : (
            <View style={styles.chatSection}>
              <View style={[styles.activeChip, { borderColor: accent + "35" }]}>
                <Icon size={14} color={accent} strokeWidth={2.5} />
                <Text style={[styles.activeChipText, { color: accent }]}>
                  {activeScenario.title}
                </Text>
              </View>

              {history.map((msg, i) => (
                <Animated.View
                  key={`${i}-${msg.text.slice(0, 12)}`}
                  entering={FadeInUp.duration(260)}
                >
                  <View style={msg.sender === "ai" ? styles.aiRow : styles.userRow}>
                    {msg.sender === "ai" ? (
                      <View
                        style={[
                          styles.avatar,
                          { backgroundColor: accent + "16" },
                        ]}
                      >
                        <Icon size={16} color={accent} strokeWidth={2.5} />
                      </View>
                    ) : null}
                    <HomeLiquidCard
                      style={[
                        styles.bubble,
                        msg.sender === "user" && styles.userBubble,
                      ]}
                      contentStyle={styles.bubbleInner}
                    >
                      <Text style={styles.msgText}>{msg.text}</Text>
                    </HomeLiquidCard>
                  </View>
                </Animated.View>
              ))}

              {status === "thinking" ? (
                <Animated.View entering={FadeInUp.duration(200)}>
                  <Text style={styles.thinking}>{t("rolePlay.thinking")}</Text>
                </Animated.View>
              ) : null}
            </View>
          )}
        </ScrollView>

        {sessionStarted ? (
          <View
            style={[
              styles.bottomBar,
              { paddingBottom: Math.max(insets.bottom, 16) },
            ]}
          >
            <MicCaptureOrb
              listening={status === "listening" || speech.listening}
              disabled={status === "thinking"}
              color={status === "listening" ? C.red : accent}
              size={100}
              hint={micHint}
              onPress={handleMicTap}
            />

            {showTyping || speech.error ? (
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.textField}
                  placeholder="Type in English…"
                  placeholderTextColor={C.grayLight}
                  value={textInput}
                  onChangeText={setTextInput}
                  onSubmitEditing={handleTextSubmit}
                  returnKeyType="send"
                />
                <Pressable
                  onPress={handleTextSubmit}
                  disabled={!textInput.trim()}
                  style={[
                    styles.sendBtn,
                    { backgroundColor: accent, opacity: textInput.trim() ? 1 : 0.4 },
                  ]}
                >
                  <Send size={18} color="#FFF" strokeWidth={2.5} />
                </Pressable>
              </View>
            ) : (
              <Pressable onPress={() => setShowTyping(true)}>
                <Text style={styles.typeLink}>{t("rolePlay.typeInstead")}</Text>
              </Pressable>
            )}
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.meshBottom },
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
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
    color: C.navy,
    fontFamily: "DINNextRoundedBold",
    letterSpacing: -0.3,
  },
  headerSub: {
    ...HomeType.caption,
    color: C.grayLight,
  },
  pickerLabel: {
    ...HomeType.section,
    color: C.navy,
    marginTop: 8,
    marginBottom: 6,
  },
  disclaimer: {
    ...HomeType.caption,
    color: C.grayLight,
    marginBottom: 14,
    lineHeight: 18,
  },
  scenarioGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  scenarioInner: {
    padding: 16,
    alignItems: "center",
    gap: 8,
    minHeight: 120,
  },
  scenarioIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  scenarioName: {
    fontSize: 13,
    fontWeight: "700",
    color: C.navy,
    textAlign: "center",
    fontFamily: "DINNextRoundedBold",
  },
  scenarioEn: {
    fontSize: 11,
    fontWeight: "600",
    color: C.grayLight,
    textAlign: "center",
  },
  heroCard: {
    marginTop: 4,
  },
  heroInner: {
    alignItems: "center",
    padding: 24,
    gap: 12,
  },
  heroIconRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: C.navy,
    textAlign: "center",
    fontFamily: "DINNextRoundedBold",
  },
  heroSub: {
    ...HomeType.body,
    color: C.gray,
    textAlign: "center",
    lineHeight: 22,
  },
  startBtn: {
    marginTop: 8,
    alignSelf: "stretch",
  },
  chatSection: {
    paddingTop: 12,
    gap: 12,
  },
  activeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.85)",
    marginBottom: 8,
  },
  activeChipText: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "DINNextRoundedBold",
  },
  aiRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    maxWidth: "92%",
  },
  userRow: {
    alignSelf: "flex-end",
    maxWidth: "88%",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  bubble: {
    flex: 1,
  },
  userBubble: {
    backgroundColor: "#E8F2FF",
  },
  bubbleInner: {
    padding: 14,
  },
  msgText: {
    fontSize: 15,
    fontWeight: "500",
    color: C.navy,
    lineHeight: 23,
    fontFamily: "DINNextRoundedRegular",
  },
  thinking: {
    ...HomeType.caption,
    color: C.grayLight,
    textAlign: "center",
    paddingVertical: 8,
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    paddingTop: 12,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderTopWidth: 1,
    borderTopColor: C.divider,
    gap: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
  },
  textField: {
    flex: 1,
    height: 48,
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 15,
    color: C.navy,
    fontFamily: "DINNextRoundedRegular",
    borderWidth: 1,
    borderColor: C.divider,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  typeLink: {
    fontSize: 14,
    fontWeight: "700",
    color: C.blue,
    fontFamily: "DINNextRoundedBold",
    paddingVertical: 4,
  },
});
