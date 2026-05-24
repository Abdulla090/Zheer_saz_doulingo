/**
 * RolePlayScreen — Premium light-mode conversational AI practice.
 *
 * Design language: clean white surfaces, soft shadows, generous spacing,
 * subtle accent colors, lucide icons, spring animations.
 * Inspired by Headspace / Linear / Apple native apps.
 */

import { PressableScale } from "@/components/animations";
import { crossShadow } from "@/utils/shadows";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import {
    ArrowLeft,
    AudioLines,
    Briefcase,
    Coffee,
    Loader,
    Mic,
    MicOff,
    Rocket,
    Send,
    Sparkles,
    Store,
} from "lucide-react-native";
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
    View
} from "react-native";
import Animated, {
    Easing,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSpring,
    withTiming
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SW } = Dimensions.get("window");

// ── Scenarios ──────────────────────────────────────────────────────────────────
type Scenario = {
  id: string;
  title: string;
  titleKu: string;
  subtitleKu: string;
  icon: React.ComponentType<any>;
  systemPrompt: string;
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
    systemPrompt: "You are Jean, a friendly Parisian barista. Keep answers short. Gently correct English.",
    initialMessage: "Bonjour! Welcome to Le Petit Café. What can I get started for you today?",
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
    systemPrompt: "You are Boarding Droid T-800, strict but polite. The user's bag is 5kg overweight.",
    initialMessage: "Greetings space traveler. Your bag exceeds the Mars transit weight limit. Please justify.",
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
    systemPrompt: "You are Dr. Sarah Chen, lead AI researcher. Ask challenging questions in English.",
    initialMessage: "Thank you for joining us. Could you describe your experience optimizing small language models?",
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
    systemPrompt: "You are Yusuf, a warm carpet merchant. Start the rug at 500 gold coins.",
    initialMessage: "Ah, my friend! This rug was woven under a blue moon. For you, only five hundred gold coins!",
    voicePitch: 0.85,
    voiceRate: 1.1,
    accent: "#EF4444",
  },
];

// ── Main ───────────────────────────────────────────────────────────────────────
export function RolePlayScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const [activeScenario, setActiveScenario] = useState<Scenario>(SCENARIOS[0]);
  const [status, setStatus] = useState<"idle" | "listening" | "thinking" | "speaking" | "error">("idle");
  const [history, setHistory] = useState<{ sender: "user" | "ai"; text: string }[]>([]);
  const [showTextFallback, setShowTextFallback] = useState(false);
  const [textInput, setTextInput] = useState("");

  // Refs for stable access inside callbacks
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<any>(null);
  const statusRef = useRef(status);
  const scenarioRef = useRef(activeScenario);
  const listenTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep refs in sync
  useEffect(() => { statusRef.current = status; }, [status]);
  useEffect(() => { scenarioRef.current = activeScenario; }, [activeScenario]);

  // Pulse animation
  const pulse1 = useSharedValue(1);
  const pulse2 = useSharedValue(1);

  // ── Speech engine setup ────────────────────────────────────────────────────
  useEffect(() => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SR) {
        const rec = new SR();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = "en-US";
        rec.maxAlternatives = 1;

        rec.onstart = () => {
          setStatus("listening");
        };

        rec.onresult = (e: any) => {
          clearListenTimeout();
          const transcript = e.results[0][0].transcript;
          setStatus("thinking");
          handleUserResponse(transcript);
        };

        rec.onerror = (e: any) => {
          clearListenTimeout();
          const code = e?.error || "unknown";
          if (code === "not-allowed" || code === "service-not-allowed") {
            setShowTextFallback(true);
          }
          // Only go idle if we're still in listening state
          if (statusRef.current === "listening") {
            setStatus("idle");
          }
        };

        rec.onend = () => {
          clearListenTimeout();
          // Only reset to idle if still listening (not if we moved to thinking)
          if (statusRef.current === "listening") {
            setStatus("idle");
          }
        };

        recognitionRef.current = rec;
      } else {
        setShowTextFallback(true);
      }
    } else {
      // Native — no Web Speech API
      setShowTextFallback(true);
    }

    return () => {
      clearListenTimeout();
      stopSpeaking();
      stopListening();
    };
  }, []);

  // ── Pulse animations ───────────────────────────────────────────────────────
  useEffect(() => {
    if (status === "listening") {
      pulse1.value = withRepeat(withTiming(1.65, { duration: 1200, easing: Easing.out(Easing.quad) }), -1, false);
      pulse2.value = withDelay(350, withRepeat(withTiming(1.65, { duration: 1200, easing: Easing.out(Easing.quad) }), -1, false));
    } else {
      pulse1.value = withSpring(1, { damping: 14, stiffness: 200 });
      pulse2.value = withSpring(1, { damping: 14, stiffness: 200 });
    }
  }, [status]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const clearListenTimeout = () => {
    if (listenTimeoutRef.current) {
      clearTimeout(listenTimeoutRef.current);
      listenTimeoutRef.current = null;
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      try { synthRef.current.cancel(); } catch {}
    }
  };

  const stopListening = () => {
    clearListenTimeout();
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
    }
  };

  const stopAll = () => {
    stopSpeaking();
    stopListening();
  };

  // ── Speak text aloud ───────────────────────────────────────────────────────
  const speak = (text: string) => {
    const sc = scenarioRef.current;
    if (synthRef.current && Platform.OS === "web") {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = sc.voicePitch;
      utterance.rate = sc.voiceRate;
      utterance.lang = "en-US";

      // Try to pick a good voice
      const voices = synthRef.current.getVoices();
      const pref = voices.find((v: any) =>
        v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha"))
      );
      if (pref) utterance.voice = pref;

      utterance.onstart = () => setStatus("speaking");
      utterance.onend = () => {
        // After AI finishes speaking, auto-start listening
        if (statusRef.current === "speaking") {
          startListening();
        }
      };
      utterance.onerror = () => {
        if (statusRef.current === "speaking") {
          setStatus("idle");
        }
      };

      synthRef.current.speak(utterance);
      setStatus("speaking");
    } else {
      // No TTS available — simulate speaking for 2s then go to listening
      setStatus("speaking");
      setTimeout(() => {
        if (statusRef.current === "speaking") {
          startListening();
        }
      }, 2500);
    }
  };

  // ── Start listening for user speech ────────────────────────────────────────
  const startListening = () => {
    if (showTextFallback || !recognitionRef.current) {
      // Text-only mode — just show idle so user types
      setStatus("idle");
      return;
    }

    // Make sure nothing else is running
    stopSpeaking();

    setStatus("listening");

    // Small delay to let the browser release audio resources
    setTimeout(() => {
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Already started or other error
        console.warn("Recognition start failed:", e);
        setStatus("idle");
        return;
      }

      // Safety timeout — if no speech detected in 10s, stop
      listenTimeoutRef.current = setTimeout(() => {
        if (statusRef.current === "listening") {
          try { recognitionRef.current.stop(); } catch {}
          setStatus("idle");
        }
      }, 10000);
    }, 200);
  };

  // ── Start a new session ────────────────────────────────────────────────────
  const startSession = () => {
    stopAll();
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const msg = scenarioRef.current.initialMessage;
    setHistory([{ sender: "ai", text: msg }]);
    speak(msg);
  };

  // ── Handle user's response ─────────────────────────────────────────────────
  const handleUserResponse = useCallback((userText: string) => {
    setHistory(p => [...p, { sender: "user", text: userText }]);

    setTimeout(() => {
      const sc = scenarioRef.current;
      let r = "";
      const t = userText.toLowerCase();

      if (sc.id === "cafe") {
        r = t.includes("croissant") || t.includes("pastry")
          ? "Excellent choice! Our croissants are baked fresh. Would you like a café au lait with that?"
          : t.includes("espresso") || t.includes("coffee")
          ? "Double espresso, très bien! Coming right up. Shall I add a pain au chocolat?"
          : "Of course! Will you be enjoying that at our sunny patio, or is it to go?";
      } else if (sc.id === "space") {
        r = t.includes("oxygen") || t.includes("life support")
          ? "Life support systems are critical gear. Fee waived. Enjoy your journey to Mars!"
          : "My scanner detects dense materials. You must justify this weight in English, passenger.";
      } else if (sc.id === "job") {
        r = t.includes("optim") || t.includes("model") || t.includes("ai")
          ? "Impressive. How do you handle quantization trade-offs for mobile speech models?"
          : "Interesting. What's your approach to balancing responsiveness with heavy AI processing?";
      } else {
        const nums = userText.match(/\d+/g);
        r = nums
          ? parseInt(nums[0]) < 300
            ? "You break my heart! Four hundred is my final offer!"
            : "A skilled negotiator! Three fifty, and I add Turkish tea. Deal?"
          : "Feel the quality! Pure silk. Make me a serious offer in English!";
      }

      setHistory(p => [...p, { sender: "ai", text: r }]);
      speak(r);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
    }, 1200);
  }, []);

  // ── Mic button tap handler ─────────────────────────────────────────────────
  const handleMicTap = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    switch (statusRef.current) {
      case "idle":
      case "error":
        // Start session or resume listening
        if (history.length === 0) {
          startSession();
        } else {
          startListening();
        }
        break;

      case "speaking":
        // Interrupt AI speech → start listening
        stopSpeaking();
        startListening();
        break;

      case "listening":
        // Stop listening → go idle
        stopListening();
        setStatus("idle");
        break;

      case "thinking":
        // Cancel thinking → go idle (can't really cancel the timeout but reset state)
        setStatus("idle");
        break;
    }
  };

  // ── Text input submit ──────────────────────────────────────────────────────
  const handleTextSubmit = () => {
    const t = textInput.trim();
    if (!t) return;
    setTextInput("");
    setStatus("thinking");
    handleUserResponse(t);
  };

  const pulseStyle1 = useAnimatedStyle(() => ({ transform: [{ scale: pulse1.value }], opacity: 1 - (pulse1.value - 1) / 0.6 }));
  const pulseStyle2 = useAnimatedStyle(() => ({ transform: [{ scale: pulse2.value }], opacity: 1 - (pulse2.value - 1) / 0.6 }));

  const sessionStarted = history.length > 0;
  const accent = activeScenario.accent;
  const Icon = activeScenario.icon;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={st.root}>
        {/* Header */}
        <View style={[st.header, { paddingTop: insets.top + 8 }]}>
          <Pressable onPress={() => { stopAll(); router.back(); }} style={st.backBtn}>
            <ArrowLeft size={20} color="#1E293B" strokeWidth={2.5} />
          </Pressable>
          <View style={st.headerCenter}>
            <Text style={st.headerTitle}>AI Voice Practice</Text>
            <View style={[st.headerDot, { backgroundColor: accent }]} />
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Scenario picker — before session */}
          {!sessionStarted && (
            <View style={st.pickerSection}>
              <Text style={st.pickerLabel}>سیناریۆیەک هەڵبژێرە</Text>

              <View style={st.scenarioGrid}>
                {SCENARIOS.map((sc) => {
                  const sel = activeScenario.id === sc.id;
                  const ScIcon = sc.icon;
                  return (
                    <Pressable
                      key={sc.id}
                      onPress={() => { void Haptics.selectionAsync(); setActiveScenario(sc); }}
                      style={[
                        st.scenarioCard,
                        sel && { borderColor: sc.accent, backgroundColor: sc.accent + "0A" },
                        crossShadow({ color: sel ? sc.accent : "#000", offsetY: 6, blur: 16, opacity: sel ? 0.12 : 0.04, elevation: sel ? 6 : 2 }),
                      ]}
                    >
                      <View style={[st.scenarioIconWrap, { backgroundColor: sc.accent + "14" }]}>
                        <ScIcon size={22} color={sc.accent} strokeWidth={2} />
                      </View>
                      <Text style={[st.scenarioName, sel && { color: sc.accent }]}>{sc.titleKu}</Text>
                      <Text style={st.scenarioEn}>{sc.title}</Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Hero CTA */}
              <View style={st.heroArea}>
                <View style={[st.heroCircle, { borderColor: accent + "30" }]}>
                  <View style={[st.heroInner, { backgroundColor: accent + "12" }]}>
                    <Icon size={40} color={accent} strokeWidth={1.8} />
                  </View>
                </View>
                <Text style={st.heroTitle}>{activeScenario.titleKu}</Text>
                <Text style={st.heroSub}>{activeScenario.subtitleKu}</Text>
                <Pressable onPress={startSession} style={[st.startBtn, { backgroundColor: accent }]}>
                  <Sparkles size={18} color="#FFF" strokeWidth={2.5} />
                  <Text style={st.startBtnText}>دەستپێبکە</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Chat — active session */}
          {sessionStarted && (
            <View style={st.chatSection}>
              {/* Active scenario chip */}
              <View style={[st.activeChip, { borderColor: accent + "30" }]}>
                <Icon size={14} color={accent} strokeWidth={2.5} />
                <Text style={[st.activeChipText, { color: accent }]}>{activeScenario.titleKu}</Text>
              </View>

              {/* Messages */}
              {history.map((msg, i) => (
                <Animated.View key={i} entering={FadeInUp.delay(i > 1 ? 0 : i * 60).duration(280)}>
                  <View style={msg.sender === "ai" ? st.aiRow : st.userRow}>
                    {msg.sender === "ai" && (
                      <View style={[st.avatar, { backgroundColor: accent + "14" }]}>
                        <Icon size={16} color={accent} strokeWidth={2.5} />
                      </View>
                    )}
                    <View style={[
                      msg.sender === "ai" ? st.aiBubble : st.userBubble,
                      msg.sender === "ai" && { borderColor: accent + "18" },
                    ]}>
                      <Text style={st.msgText}>{msg.text}</Text>
                    </View>
                  </View>
                </Animated.View>
              ))}

              {status === "thinking" && (
                <Animated.View entering={FadeInUp.duration(200)}>
                  <View style={st.aiRow}>
                    <View style={[st.avatar, { backgroundColor: accent + "14" }]}>
                      <Loader size={14} color={accent} strokeWidth={2.5} />
                    </View>
                    <View style={[st.aiBubble, { borderColor: accent + "18" }]}>
                      <Text style={[st.msgText, { opacity: 0.4 }]}>Thinking...</Text>
                    </View>
                  </View>
                </Animated.View>
              )}
            </View>
          )}
        </ScrollView>

        {/* Bottom bar — mic + text input */}
        {sessionStarted && (
          <View style={[st.bottomBar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
            {/* Mic orb */}
            <View style={st.micArea}>
              {status === "listening" && (
                <>
                  <Animated.View style={[st.pulse, { borderColor: accent + "50", backgroundColor: accent + "12" }, pulseStyle1]} />
                  <Animated.View style={[st.pulse, { borderColor: accent + "30", backgroundColor: accent + "08" }, pulseStyle2]} />
                </>
              )}
              <PressableScale onPress={handleMicTap} scaleDown={0.92}>
                <View style={[
                  st.micBtn,
                  { backgroundColor: status === "listening" ? "#EF4444" : accent },
                  crossShadow({ color: status === "listening" ? "#EF4444" : accent, offsetY: 4, blur: 14, opacity: 0.3, elevation: 6 }),
                ]}>
                  {status === "thinking" ? <Loader size={22} color="#FFF" strokeWidth={2.5} />
                    : status === "speaking" ? <AudioLines size={22} color="#FFF" strokeWidth={2.5} />
                    : status === "listening" ? <MicOff size={22} color="#FFF" strokeWidth={2.5} />
                    : <Mic size={22} color="#FFF" strokeWidth={2.5} />}
                </View>
              </PressableScale>
            </View>

            <Text style={st.statusLabel}>
              {status === "idle" ? "داگرە بۆ قسەکردن"
                : status === "listening" ? "گوێم لێیە..."
                : status === "thinking" ? "بیردەکاتەوە..."
                : status === "speaking" ? "قسەدەکات..."
                : ""}
            </Text>

            {/* Text input fallback */}
            {showTextFallback && (
              <View style={st.inputRow}>
                <TextInput
                  style={st.textField}
                  placeholder="Type in English..."
                  placeholderTextColor="#94A3B8"
                  value={textInput}
                  onChangeText={setTextInput}
                  onSubmitEditing={handleTextSubmit}
                  returnKeyType="send"
                  editable={status === "listening" || status === "idle"}
                />
                <Pressable
                  onPress={handleTextSubmit}
                  disabled={!textInput.trim()}
                  style={[st.sendBtn, { backgroundColor: accent, opacity: textInput.trim() ? 1 : 0.35 }]}
                >
                  <Send size={16} color="#FFF" strokeWidth={2.5} />
                </Pressable>
              </View>
            )}
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}


// ── Styles ─────────────────────────────────────────────────────────────────────
const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFC" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderColor: "#F1F5F9",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  headerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Scenario picker
  pickerSection: {
    paddingTop: 24,
  },
  pickerLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#64748B",
    paddingHorizontal: 24,
    marginBottom: 16,
    textAlign: "right",
    writingDirection: "rtl",
  },
  scenarioGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
  },
  scenarioCard: {
    width: (SW - 52) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    padding: 18,
    alignItems: "center",
    gap: 10,
  },
  scenarioIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  scenarioName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
    textAlign: "center",
    writingDirection: "rtl",
  },
  scenarioEn: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
    textAlign: "center",
    letterSpacing: 0.2,
  },

  // Hero CTA
  heroArea: {
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 32,
    gap: 14,
  },
  heroCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  heroInner: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
    textAlign: "center",
    writingDirection: "rtl",
  },
  heroSub: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
    textAlign: "center",
    writingDirection: "rtl",
    lineHeight: 22,
  },
  startBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 16,
  },
  startBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },

  // Chat
  chatSection: {
    paddingHorizontal: 18,
    paddingTop: 18,
    gap: 14,
  },
  activeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#FFFFFF",
    marginBottom: 6,
  },
  activeChipText: {
    fontSize: 12,
    fontWeight: "700",
    writingDirection: "rtl",
  },

  // Bubbles
  aiRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    maxWidth: "88%",
  },
  userRow: {
    alignSelf: "flex-end",
    maxWidth: "82%",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  aiBubble: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderTopLeftRadius: 6,
    borderWidth: 1,
    padding: 14,
    flex: 1,
  },
  userBubble: {
    backgroundColor: "#EFF6FF",
    borderRadius: 18,
    borderTopRightRadius: 6,
    borderWidth: 1,
    borderColor: "#DBEAFE",
    padding: 14,
  },
  msgText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1E293B",
    lineHeight: 23,
    letterSpacing: -0.1,
  },

  // Bottom bar
  bottomBar: {
    alignItems: "center",
    paddingTop: 16,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderColor: "#F1F5F9",
    gap: 10,
  },
  micArea: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  micBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  pulse: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    textAlign: "center",
    writingDirection: "rtl",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
    marginTop: 4,
  },
  textField: {
    flex: 1,
    height: 44,
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: "500",
    color: "#0F172A",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});
