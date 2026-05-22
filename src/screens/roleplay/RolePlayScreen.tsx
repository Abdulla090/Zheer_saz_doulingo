import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  withDelay,
  Easing,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { PressableScale } from "@/components/animations";
import { crossShadow } from "@/utils/shadows";

// ── Palette ────────────────────────────────────────────────────────────────────
const C = {
  bgTop: "#F5F9FF",
  bgBottom: "#FFFFFF",
  primary: "#208AEF",
  primaryGlow: "#93C5FD",
  ink: "#0F172A",
  inkSoft: "#475569",
  inkMuted: "#94A3B8",
  card: "#FFFFFF",
  cardBorder: "#E2E8F0",
  success: "#10B981",
  successGlow: "#A7F3D0",
  warning: "#F59E0B",
  error: "#EF4444",
};

const { width } = Dimensions.get("window");

// ── Error types with Kurdish translations ──────────────────────────────────────
type MicErrorType = "not-allowed" | "no-speech" | "network" | "aborted" | "unknown";

function getMicErrorMessage(errorType: MicErrorType): {
  title: string;
  desc: string;
  canRetry: boolean;
} {
  switch (errorType) {
    case "not-allowed":
      return {
        title: "مایکرۆفۆن ڕێگەپێنەدراوە",
        desc: "تکایە ڕێگە بدە بە مایکرۆفۆن لە ڕێکخستنەکانی وێبگەڕ، یان دەقەکەت بنووسە.",
        canRetry: false,
      };
    case "no-speech":
      return {
        title: "دەنگت نەبیستراوە",
        desc: "دوبارە هەوڵ بدە و بە دەنگی بەرز قسە بکە.",
        canRetry: true,
      };
    case "network":
      return {
        title: "کێشەی ئینترنێت",
        desc: "پەیوەندی کارنەکرد. پەیوەندیت بپشکنە.",
        canRetry: true,
      };
    case "aborted":
      return {
        title: "ڕاگیرا",
        desc: "گوێدانەوە ڕاگیرا. دوبارە بەست بکە.",
        canRetry: true,
      };
    default:
      return {
        title: "کێشەیەکی نەناسراو",
        desc: "کێشەیەک ڕووی دا. دووبارە هەوڵ بدە.",
        canRetry: true,
      };
  }
}

// ── Scenarios ──────────────────────────────────────────────────────────────────
type Scenario = {
  id: string;
  title: string;
  titleKu: string;
  subtitle: string;
  subtitleKu: string;
  icon: string;
  systemPrompt: string;
  initialMessage: string;
  voicePitch: number;
  voiceRate: number;
  accentColor: string;
};

const SCENARIOS: Scenario[] = [
  {
    id: "cafe",
    title: "Parisian Coffee Shop",
    titleKu: "قاوەخانەی پاریس",
    subtitle: "Order a croissant & warm espresso.",
    subtitleKu: "داواکردنی قاوە و کرۆسان بە زمانی ئینگلیزی.",
    icon: "cafe",
    systemPrompt:
      "You are Jean, a friendly Parisian barista. Keep answers short and natural. Gently correct the user's English if needed.",
    initialMessage:
      "Bonjour! Welcome to Le Petit Café. What can I get started for you today?",
    voicePitch: 0.95,
    voiceRate: 1.0,
    accentColor: "#F59E0B",
  },
  {
    id: "space",
    title: "Mars Flight Check-in",
    titleKu: "گەشتی مەریخ",
    subtitle: "Explain why your heavy bag is essential.",
    subtitleKu: "گفتوگۆ لەسەر کێشی زۆری جانتاکەت بە زمانی ئینگلیزی.",
    icon: "rocket",
    systemPrompt:
      "You are Boarding Droid T-800, strict but polite. The user's bag is 5kg overweight.",
    initialMessage:
      "Greetings space traveler. Your bag exceeds the Mars transit weight limit. Please justify.",
    voicePitch: 1.25,
    voiceRate: 1.05,
    accentColor: "#6366F1",
  },
  {
    id: "job",
    title: "Tech Job Interview",
    titleKu: "چاوپێکەوتنی کار",
    subtitle: "Interview for an AI engineer at Phingo.",
    subtitleKu: "چاوپێکەوتنی کار بۆ ئەندازیاری AI بە ئینگلیزی.",
    icon: "briefcase",
    systemPrompt:
      "You are Dr. Sarah Chen, lead AI researcher at Phingo. Ask challenging questions in English.",
    initialMessage:
      "Thank you for joining us. Could you describe your experience optimizing small language models?",
    voicePitch: 1.1,
    voiceRate: 0.95,
    accentColor: "#10B981",
  },
  {
    id: "market",
    title: "Grand Bazaar Bargain",
    titleKu: "بازاڕی گەورە",
    subtitle: "Haggle a rug price in English.",
    subtitleKu: "ڕێككەوتن لەسەر نرخی فەرش بە زمانی ئینگلیزی.",
    icon: "shopping",
    systemPrompt:
      "You are Yusuf, a warm carpet merchant. Start the rug at 500 gold coins. The user must haggle.",
    initialMessage:
      "Ah, my friend! This rug was woven under a blue moon. For you, only five hundred gold coins!",
    voicePitch: 0.85,
    voiceRate: 1.1,
    accentColor: "#EF4444",
  },
];

// ── Scenario Icon ──────────────────────────────────────────────────────────────
function ScenarioIcon({ icon, color }: { icon: string; color: string }) {
  if (icon === "cafe") {
    return (
      <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
        <Path d="M18 8h1a4 4 0 010 8h-1" stroke={color} strokeWidth={2} strokeLinecap="round" />
        <Path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" stroke={color} strokeWidth={2} />
        <Path d="M6 1v3M10 1v3M14 1v3" stroke={color} strokeWidth={2} strokeLinecap="round" />
      </Svg>
    );
  }
  if (icon === "rocket") {
    return (
      <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
        <Path d="M9 11l-2 2-1 5 5-1 2-2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M11 9l4-4a5 5 0 016 6l-4 4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx="17" cy="7" r="1" fill={color} />
      </Svg>
    );
  }
  if (icon === "briefcase") {
    return (
      <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
        <Rect x="2" y="7" width="20" height="14" rx="2" stroke={color} strokeWidth={2} />
        <Path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke={color} strokeWidth={2} />
        <Path d="M12 12v2" stroke={color} strokeWidth={2} strokeLinecap="round" />
      </Svg>
    );
  }
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Path d="M6 2l1.5 1.5L9 2l1.5 1.5L12 2l1.5 1.5L15 2l1.5 1.5L18 2v20l-1.5-1.5L15 22l-1.5-1.5L12 22l-1.5-1.5L9 22l-1.5-1.5L6 22V2z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <Path d="M9 8h6M9 12h6M9 16h4" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function RolePlayScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [activeScenario, setActiveScenario] = useState<Scenario>(SCENARIOS[0]);
  const [status, setStatus] = useState<"idle" | "listening" | "thinking" | "speaking" | "error">(
    "idle"
  );
  const [micError, setMicError] = useState<{
    title: string;
    desc: string;
    canRetry: boolean;
  } | null>(null);
  const [userSpeech, setUserSpeech] = useState<string>("");
  const [aiSpeech, setAiSpeech] = useState<string>("");
  const [history, setHistory] = useState<{ sender: "user" | "ai"; text: string }[]>([]);
  const [showTextFallback, setShowTextFallback] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [micAvailable, setMicAvailable] = useState<boolean | null>(null);

  // Web Speech APIs
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<any>(null);

  // Animations
  const pulse1 = useSharedValue(1);
  const pulse2 = useSharedValue(1);
  const waveAnim = useSharedValue(0);

  // ── Request mic permission proactively ────────────────────────────────────
  const checkMicPermission = useCallback(async () => {
    if (Platform.OS !== "web") {
      setMicAvailable(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
      setMicAvailable(true);
      setShowTextFallback(false);
    } catch {
      setMicAvailable(false);
      setShowTextFallback(true);
      const errInfo = getMicErrorMessage("not-allowed");
      setMicError(errInfo);
    }
  }, []);

  // ── Init speech engine ─────────────────────────────────────────────────────
  useEffect(() => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = "en-US";

        rec.onstart = () => {
          setStatus("listening");
          setMicError(null);
        };

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setUserSpeech(transcript);
          setStatus("thinking");
          handleUserResponse(transcript);
        };

        rec.onerror = (e: any) => {
          // e.error is the SpeechRecognitionErrorCode string
          const errorCode: string = e?.error || "unknown";
          console.warn("Speech recognition error code:", errorCode);

          if (errorCode === "not-allowed" || errorCode === "service-not-allowed") {
            const errInfo = getMicErrorMessage("not-allowed");
            setMicError(errInfo);
            setMicAvailable(false);
            setShowTextFallback(true);
            setStatus("idle");
          } else if (errorCode === "no-speech") {
            // Auto-retry no-speech silently
            const errInfo = getMicErrorMessage("no-speech");
            setMicError(errInfo);
            setStatus("idle");
          } else if (errorCode === "network") {
            const errInfo = getMicErrorMessage("network");
            setMicError(errInfo);
            setStatus("error");
          } else if (errorCode === "aborted") {
            // Aborted is intentional (user pressed stop) — don't show error
            setStatus("idle");
          } else {
            const errInfo = getMicErrorMessage("unknown");
            setMicError(errInfo);
            setStatus("idle");
          }
        };

        rec.onend = () => {
          setStatus((current) => (current === "listening" ? "idle" : current));
        };

        recognitionRef.current = rec;
      } else {
        // Browser doesn't support Web Speech API at all
        setMicAvailable(false);
        setShowTextFallback(true);
        setMicError({
          title: "وێبگەڕەکەت پشتگیری نەکردووە",
          desc: "وێبگەڕەکەت پشتگیری ناکات. Chrome یان Edge بەکاربهێنە، یان دەقت بنووسە.",
          canRetry: false,
        });
      }
    }

    return () => {
      stopAllAudio();
    };
  }, [activeScenario]);

  // ── Animations ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (status === "listening") {
      pulse1.value = withRepeat(
        withTiming(1.6, { duration: 1200, easing: Easing.out(Easing.quad) }),
        -1,
        false
      );
      pulse2.value = withDelay(
        400,
        withRepeat(
          withTiming(1.6, { duration: 1200, easing: Easing.out(Easing.quad) }),
          -1,
          false
        )
      );
    } else {
      pulse1.value = withSpring(1);
      pulse2.value = withSpring(1);
    }
  }, [status, pulse1, pulse2]);

  useEffect(() => {
    if (status === "speaking") {
      waveAnim.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 400, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.2, { duration: 400, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
    } else {
      waveAnim.value = withSpring(0);
    }
  }, [status, waveAnim]);

  const stopAllAudio = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (_) {}
    }
  };

  const startScenario = () => {
    stopAllAudio();
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const initMsg = activeScenario.initialMessage;
    setAiSpeech(initMsg);
    setUserSpeech("");
    setMicError(null);
    setHistory([{ sender: "ai", text: initMsg }]);
    setStatus("speaking");
    speakAloud(initMsg);
  };

  const speakAloud = (text: string) => {
    if (synthRef.current) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = activeScenario.voicePitch;
      utterance.rate = activeScenario.voiceRate;

      const voices = synthRef.current.getVoices();
      const preferredVoice = voices.find(
        (v: any) =>
          v.lang.startsWith("en") &&
          (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Apple"))
      );
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onstart = () => setStatus("speaking");
      utterance.onend = () => {
        setStatus("listening");
        startListening();
      };
      utterance.onerror = () => setStatus("idle");

      synthRef.current.speak(utterance);
    } else {
      setStatus("speaking");
      setTimeout(() => {
        setStatus("listening");
      }, 2500);
    }
  };

  const startListening = () => {
    if (showTextFallback) {
      // In fallback mode, just indicate listening visually
      setStatus("listening");
      return;
    }
    if (recognitionRef.current) {
      stopAllAudio();
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn("Could not start recognition:", e);
        setStatus("idle");
      }
    } else {
      setStatus("listening");
      // Simulate for non-web or if recognition truly unavailable
      setTimeout(() => {
        const mockPhrases = [
          "I would like to order a double espresso and a croissant please.",
          "This bag is very important! It contains my oxygen filter.",
          "I have experience optimizing speech models using Gemini.",
          "That rug is beautiful! How about three hundred gold coins?",
        ];
        const phrase = mockPhrases[SCENARIOS.indexOf(activeScenario)] || "Hello!";
        setUserSpeech(phrase);
        setStatus("thinking");
        handleUserResponse(phrase);
      }, 3000);
    }
  };

  const handleUserResponse = useCallback(
    (userText: string) => {
      setHistory((prev) => [...prev, { sender: "user", text: userText }]);

      setTimeout(() => {
        let aiResponse = "";
        const t = userText.toLowerCase();

        if (activeScenario.id === "cafe") {
          if (t.includes("croissant") || t.includes("pastry")) {
            aiResponse =
              "Excellent choice! Our croissants are baked fresh this morning. Would you like a café au lait or espresso with that?";
          } else if (t.includes("espresso") || t.includes("coffee") || t.includes("latte")) {
            aiResponse =
              "Double espresso, très bien! Coming right up. Shall I add a pain au chocolat?";
          } else {
            aiResponse =
              "Of course! Will you be enjoying that at our sunny patio, or is it to go, mon ami?";
          }
        } else if (activeScenario.id === "space") {
          if (t.includes("oxygen") || t.includes("suit") || t.includes("life support")) {
            aiResponse =
              "Life support systems are classified as critical gear. Fee waived. Enjoy your journey to Mars!";
          } else if (t.includes("sorry") || t.includes("remove") || t.includes("leave")) {
            aiResponse =
              "The disposal chute is behind you. Or pay 150 galactic credits to keep the bag.";
          } else {
            aiResponse =
              "My scanner detects dense materials. You must justify this weight in English, passenger.";
          }
        } else if (activeScenario.id === "job") {
          if (t.includes("optim") || t.includes("gemini") || t.includes("model") || t.includes("ai")) {
            aiResponse =
              "Impressive. How do you handle quantization trade-offs for mobile speech models?";
          } else {
            aiResponse =
              "Interesting perspective. What's your approach to balancing UI responsiveness with heavy background AI processing?";
          }
        } else if (activeScenario.id === "market") {
          const numbers = userText.match(/\d+/g);
          if (numbers) {
            const bid = parseInt(numbers[0]);
            if (bid < 250) {
              aiResponse =
                "Two hundred?! My friend, you break my heart! The weavers spent three months. Four hundred is my final offer!";
            } else if (bid >= 250 && bid < 450) {
              aiResponse =
                "Ah, a skilled negotiator! Three hundred and fifty, and I add a cup of Turkish tea. Deal?";
            } else {
              aiResponse = "It is a deal! May this moon rug bring great fortune to your home!";
            }
          } else {
            aiResponse =
              "Feel the quality, my friend! Pure silk. Make me a serious offer in English!";
          }
        }

        setAiSpeech(aiResponse);
        setHistory((prev) => [...prev, { sender: "ai", text: aiResponse }]);
        speakAloud(aiResponse);
      }, 1600);
    },
    [activeScenario]
  );

  const handleMicTap = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMicError(null);

    if (status === "idle" || status === "error") {
      if (micAvailable === null && Platform.OS === "web") {
        // First tap — check permission first
        checkMicPermission().then(() => startScenario());
      } else {
        startScenario();
      }
    } else if (status === "speaking") {
      stopAllAudio();
      setStatus("listening");
      startListening();
    } else if (status === "listening") {
      if (recognitionRef.current && !showTextFallback) {
        recognitionRef.current.abort();
      }
      setStatus("idle");
    }
  };

  const handleTextSubmit = () => {
    const text = textInput.trim();
    if (!text) return;
    setTextInput("");
    setUserSpeech(text);
    setStatus("thinking");
    handleUserResponse(text);
  };

  const pulseStyle1 = useAnimatedStyle(() => ({
    transform: [{ scale: pulse1.value }],
    opacity: 1 - (pulse1.value - 1) / 0.6,
  }));

  const pulseStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: pulse2.value }],
    opacity: 1 - (pulse2.value - 1) / 0.6,
  }));

  const isActive = status !== "idle" && status !== "error";
  const sessionStarted = history.length > 0;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.root}>
        {/* Background */}
        <LinearGradient
          colors={[C.bgTop, C.bgBottom]}
          locations={[0, 1]}
          style={StyleSheet.absoluteFill}
        />

        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity
            onPress={() => {
              stopAllAudio();
              router.back();
            }}
            style={styles.backBtn}
          >
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path
                d="M19 12H5M12 19l-7-7 7-7"
                stroke={C.ink}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle} className="font-rd-bold">
              ڕاهێنانی دەنگی AI
            </Text>
            <View style={styles.modelBadge}>
              <Text style={styles.modelBadgeText}>Gemini Flash Lite</Text>
            </View>
          </View>

          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
        >
          {/* Scenario Carousel — shown only when idle & no session started */}
          {!sessionStarted && (
            <View style={styles.carouselSection}>
              <Text style={styles.sectionLabel} className="font-rd-bold">
                سیناریۆیەک هەڵبژێرە:
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.carouselRow}
                snapToInterval={width * 0.74 + 14}
                decelerationRate="fast"
              >
                {SCENARIOS.map((sc) => {
                  const sel = activeScenario.id === sc.id;
                  return (
                    <TouchableOpacity
                      key={sc.id}
                      onPress={() => {
                        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setActiveScenario(sc);
                      }}
                      activeOpacity={0.88}
                      style={[
                        styles.scenarioCard,
                        sel && { borderColor: sc.accentColor, borderWidth: 2 },
                        crossShadow({
                          color: sel ? sc.accentColor : "#000",
                          offsetY: 6,
                          blur: 18,
                          opacity: sel ? 0.14 : 0.05,
                          elevation: sel ? 7 : 2,
                        }),
                      ]}
                    >
                      {/* Top accent strip */}
                      <View style={[styles.cardAccentBar, { backgroundColor: sc.accentColor }]} />

                      <View style={styles.cardBody}>
                        <View
                          style={[
                            styles.cardIconCircle,
                            { backgroundColor: sc.accentColor + "18" },
                          ]}
                        >
                          <ScenarioIcon icon={sc.icon} color={sc.accentColor} />
                        </View>

                        <View style={{ flex: 1 }}>
                          <Text style={styles.cardTitle} className="font-rd-bold">
                            {sc.titleKu}
                          </Text>
                          <Text style={styles.cardSubtitle} className="font-rd-medium">
                            {sc.subtitleKu}
                          </Text>
                          <Text style={[styles.cardEnLabel, { color: sc.accentColor + "CC" }]}>
                            {sc.title}
                          </Text>
                        </View>
                      </View>

                      {sel && (
                        <View style={[styles.selBadge, { backgroundColor: sc.accentColor }]}>
                          <Text style={styles.selBadgeText} className="font-rd-bold">
                            چالاکە
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Active session avatar & transcript */}
          {sessionStarted && (
            <View style={styles.sessionArea}>
              {/* Scenario pill */}
              <View
                style={[
                  styles.scenarioPill,
                  { borderColor: activeScenario.accentColor + "50" },
                ]}
              >
                <ScenarioIcon icon={activeScenario.icon} color={activeScenario.accentColor} />
                <Text style={[styles.scenarioPillText, { color: activeScenario.accentColor }]} className="font-rd-bold">
                  {activeScenario.titleKu}
                </Text>
              </View>

              {/* Conversation bubbles */}
              <View style={styles.transcriptArea}>
                {history.map((msg, i) =>
                  msg.sender === "ai" ? (
                    <View key={i} style={styles.aiBubble}>
                      <Text style={styles.aiBubbleLabel} className="font-rd-bold">
                        AI
                      </Text>
                      <Text style={styles.aiBubbleText}>{msg.text}</Text>
                    </View>
                  ) : (
                    <View key={i} style={styles.userBubble}>
                      <Text style={styles.userBubbleLabel} className="font-rd-bold">
                        تۆ
                      </Text>
                      <Text style={styles.userBubbleText}>{msg.text}</Text>
                    </View>
                  )
                )}
              </View>
            </View>
          )}

          {/* Error / Permission Banner */}
          {micError && (
            <View style={styles.errorBanner}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="10" stroke={C.warning} strokeWidth={2} />
                <Path d="M12 8v4M12 16h.01" stroke={C.warning} strokeWidth={2} strokeLinecap="round" />
              </Svg>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.errorTitle} className="font-rd-bold">
                  {micError.title}
                </Text>
                <Text style={styles.errorDesc} className="font-rd-medium">
                  {micError.desc}
                </Text>
              </View>
              {micError.canRetry && (
                <TouchableOpacity
                  onPress={() => {
                    setMicError(null);
                    if (status === "idle" || status === "error") {
                      startListening();
                    }
                  }}
                  style={styles.retryBtn}
                >
                  <Text style={styles.retryText} className="font-rd-bold">
                    دووبارە
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* ── Voice Stage ── */}
          <View style={styles.stage}>
            {/* Mic button with pulse rings */}
            <View style={styles.micStage}>
              {status === "listening" && (
                <>
                  <Animated.View style={[styles.pulseRing, pulseStyle1]} />
                  <Animated.View style={[styles.pulseRing, pulseStyle2]} />
                </>
              )}
              {(status === "speaking" || status === "thinking") && (
                <View
                  style={[
                    styles.auraRing,
                    {
                      backgroundColor:
                        status === "thinking"
                          ? "rgba(147,197,253,0.25)"
                          : "rgba(167,243,208,0.25)",
                      borderColor:
                        status === "thinking"
                          ? "rgba(32,138,239,0.2)"
                          : "rgba(16,185,129,0.2)",
                    },
                  ]}
                />
              )}

              <PressableScale onPress={handleMicTap} scaleDown={0.9} style={{ zIndex: 10 }}>
                <LinearGradient
                  colors={
                    status === "listening"
                      ? ["#EF4444", "#DC2626"]
                      : status === "speaking"
                      ? ["#10B981", "#059669"]
                      : status === "thinking"
                      ? ["#3B82F6", "#1D4ED8"]
                      : ["#208AEF", "#2563EB"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.micBtn,
                    crossShadow({
                      color: status === "listening" ? "#EF4444" : C.primary,
                      offsetY: 10,
                      blur: 24,
                      opacity: 0.3,
                      elevation: 10,
                    }),
                  ]}
                >
                  {status === "thinking" ? (
                    <Svg width={30} height={30} viewBox="0 0 24 24" fill="none">
                      <Circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth={2.5} />
                      <Path d="M12 2a10 10 0 0110 10" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
                    </Svg>
                  ) : status === "speaking" ? (
                    <Svg width={30} height={30} viewBox="0 0 24 24" fill="none">
                      <Path d="M9 9v6M12 6v12M15 9v6M6 11v2M18 11v2" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
                    </Svg>
                  ) : (
                    <Svg width={30} height={30} viewBox="0 0 24 24" fill="none">
                      <Path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z" fill="#fff" />
                      <Path d="M19 10v2a7 7 0 01-14 0v-2M12 19v3M8 22h8" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  )}
                </LinearGradient>
              </PressableScale>
            </View>

            {/* Status label */}
            <Text style={styles.statusText} className="font-rd-bold">
              {status === "idle"
                ? sessionStarted
                  ? "داگرە بۆ گفتوگۆی دووبارە"
                  : "داگرە بۆ دەستپێکردن"
                : status === "listening"
                ? "گوێم لێیە... قسە بکە بە ئینگلیزی"
                : status === "thinking"
                ? "بیردەکاتەوە..."
                : status === "speaking"
                ? "قسەت بۆ دەکەم..."
                : "کێشەیەکی ڕووی دا"}
            </Text>

            {!sessionStarted && status === "idle" && !showTextFallback && (
              <Text style={styles.hintText} className="font-rd-medium">
                دەنگت بۆ فێربوونی ئینگلیزی بەکاربهێنە
              </Text>
            )}

            {/* Speaking waveform */}
            {status === "speaking" && (
              <View style={styles.waveRow}>
                {Array.from({ length: 10 }, (_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.waveBar,
                      {
                        height: 8 + ((i * 7 + 3) % 36),
                        backgroundColor: C.success,
                        opacity: 0.6 + (i % 3) * 0.13,
                      },
                    ]}
                  />
                ))}
              </View>
            )}

            {/* Mic blocked hint */}
            {showTextFallback && status !== "speaking" && status !== "thinking" && (
              <TouchableOpacity
                style={styles.micBlockedBadge}
                onPress={() => checkMicPermission()}
              >
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z" fill={C.inkMuted} />
                  <Path d="M3 3l18 18" stroke={C.error} strokeWidth={2.5} strokeLinecap="round" />
                </Svg>
                <Text style={styles.micBlockedText} className="font-rd-medium">
                  مایکرۆفۆن بەسەربراوە — ڕێگە بدە
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        {/* Text Fallback Input — shown when mic is blocked */}
        {showTextFallback && sessionStarted && (
          <View style={[styles.textInputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
            <TextInput
              style={styles.textField}
              placeholder="Type your English response here..."
              placeholderTextColor={C.inkMuted}
              value={textInput}
              onChangeText={setTextInput}
              onSubmitEditing={handleTextSubmit}
              returnKeyType="send"
              multiline={false}
              editable={status === "listening" || status === "idle"}
            />
            <TouchableOpacity
              style={[
                styles.sendBtn,
                { opacity: textInput.trim().length > 0 ? 1 : 0.4 },
              ]}
              onPress={handleTextSubmit}
              disabled={textInput.trim().length === 0}
            >
              <LinearGradient
                colors={["#208AEF", "#2563EB"]}
                style={styles.sendBtnGrad}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                    stroke="#fff"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bgBottom },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderColor: "rgba(226,232,240,0.7)",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.cardBorder,
  },
  headerCenter: { alignItems: "center", gap: 4 },
  headerTitle: { fontSize: 17, color: C.ink },
  modelBadge: {
    backgroundColor: "rgba(32,138,239,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  modelBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: C.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Carousel
  carouselSection: { marginTop: 22 },
  sectionLabel: {
    fontSize: 13,
    color: C.inkSoft,
    paddingHorizontal: 20,
    marginBottom: 12,
    textAlign: "left",
  },
  carouselRow: { paddingHorizontal: 20, gap: 14, paddingBottom: 8 },
  scenarioCard: {
    backgroundColor: C.card,
    width: width * 0.74,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: C.cardBorder,
    overflow: "hidden",
  },
  cardAccentBar: { height: 4, width: "100%" },
  cardBody: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    padding: 18,
    paddingTop: 16,
  },
  cardIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { fontSize: 16, color: C.ink, marginBottom: 4, textAlign: "left" },
  cardSubtitle: { fontSize: 11, color: C.inkSoft, lineHeight: 16, textAlign: "left" },
  cardEnLabel: { fontSize: 10, fontWeight: "700", marginTop: 6, textTransform: "uppercase", textAlign: "left" },
  selBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  selBadgeText: { fontSize: 9, color: "#fff" },

  // Session
  sessionArea: { paddingHorizontal: 18, marginTop: 20, gap: 14 },
  scenarioPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  scenarioPillText: { fontSize: 13 },
  transcriptArea: { gap: 10 },
  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(16,185,129,0.08)",
    borderRadius: 18,
    borderTopStartRadius: 4,
    padding: 14,
    maxWidth: "86%",
  },
  aiBubbleLabel: { fontSize: 9, color: C.success, marginBottom: 4 },
  aiBubbleText: { fontSize: 14, color: C.ink, lineHeight: 21 },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(32,138,239,0.08)",
    borderRadius: 18,
    borderTopEndRadius: 4,
    padding: 14,
    maxWidth: "86%",
  },
  userBubbleLabel: { fontSize: 9, color: C.primary, marginBottom: 4, textAlign: "right" },
  userBubbleText: { fontSize: 14, color: C.ink, lineHeight: 21, textAlign: "right" },

  // Error banner
  errorBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(245,158,11,0.08)",
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.3)",
    borderRadius: 14,
    marginHorizontal: 18,
    marginTop: 14,
    padding: 14,
  },
  errorTitle: { fontSize: 13, color: C.ink },
  errorDesc: { fontSize: 11, color: C.inkSoft, marginTop: 2, lineHeight: 16 },
  retryBtn: {
    backgroundColor: C.warning,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  retryText: { fontSize: 11, color: "#fff" },

  // Stage
  stage: {
    alignItems: "center",
    marginTop: 36,
    gap: 14,
    paddingHorizontal: 20,
  },
  micStage: {
    width: 160,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  micBtn: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.25)",
  },
  pulseRing: {
    position: "absolute",
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(239,68,68,0.22)",
    borderWidth: 1.5,
    borderColor: "rgba(239,68,68,0.4)",
  },
  auraRing: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
  },

  // Status
  statusText: { fontSize: 15, color: C.ink, textAlign: "center" },
  hintText: { fontSize: 12, color: C.inkMuted, textAlign: "center" },
  waveRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    height: 54,
    marginTop: 6,
  },
  waveBar: { width: 4, borderRadius: 2 },

  // Mic blocked
  micBlockedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(239,68,68,0.06)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.2)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  micBlockedText: { fontSize: 11, color: C.inkSoft },

  // Text input fallback
  textInputBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: "rgba(226,232,240,0.8)",
    backgroundColor: "rgba(255,255,255,0.98)",
  },
  textField: {
    flex: 1,
    height: 44,
    backgroundColor: "rgba(241,245,249,0.9)",
    borderRadius: 22,
    paddingHorizontal: 18,
    fontSize: 14,
    color: C.ink,
    borderWidth: 1,
    borderColor: C.cardBorder,
  },
  sendBtn: { width: 44, height: 44 },
  sendBtnGrad: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});
