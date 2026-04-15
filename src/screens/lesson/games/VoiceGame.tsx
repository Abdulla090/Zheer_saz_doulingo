import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import { EaseView } from "react-native-ease";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  cancelAnimation,
  Easing,
} from "react-native-reanimated";
import { VoiceQuestion } from "@/data/lesson-content";
import { Mic, MicOff, Volume2, CheckCircle2 } from "lucide-react-native";

type Props = { question: VoiceQuestion; onAnswer: (correct: boolean) => void };
type ListenState = "idle" | "listening" | "success" | "fail";

function getSpeechRec(): any {
  if (typeof window === "undefined") return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
}

const isWebWithSpeech = Platform.OS === "web" && getSpeechRec() !== null;

export default function VoiceGame({ question, onAnswer }: Props) {
  const [state, setState]           = useState<ListenState>("idle");
  const [transcript, setTranscript] = useState("");
  const recRef   = useRef<any>(null);
  // Guard: prevent calling onAnswer more than once per question
  const firedRef = useRef(false);
  // Track live state in a ref for use inside callbacks (avoids stale closure)
  const stateRef = useRef<ListenState>("idle");

  const fireAnswer = (correct: boolean) => {
    if (firedRef.current) return;
    firedRef.current = true;
    onAnswer(correct);
  };

  // Keep stateRef in sync with state
  const updateState = (s: ListenState) => {
    stateRef.current = s;
    setState(s);
  };

  // Reanimated — gesture-driven mic button
  const micTy    = useSharedValue(0);
  const shakeX   = useSharedValue(0);
  const micStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: micTy.value }, { translateX: shakeX.value }],
  }));

  // Reanimated — pulse ring loop
  const ringS = useSharedValue(1);
  const ringO = useSharedValue(0);
  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringS.value }],
    opacity: ringO.value,
  }));

  // Reanimated — action button (skip/trust)
  const skipO  = useSharedValue(0);
  const skipTy = useSharedValue(0);
  const skipStyle      = useAnimatedStyle(() => ({ opacity: skipO.value }));
  const skipFrontStyle = useAnimatedStyle(() => ({ transform: [{ translateY: skipTy.value }] }));

  const stopPulse = () => {
    cancelAnimation(ringS);
    ringS.value = withTiming(1,   { duration: 200 });
    ringO.value = withTiming(0,   { duration: 240 });
  };

  const onSuccess = (text: string) => {
    stopPulse();
    setTranscript(text);
    updateState("success");
    micTy.value = withSequence(
      withTiming(4, { duration: 105, easing: Easing.out(Easing.cubic) }),
      withTiming(0, { duration: 155, easing: Easing.inOut(Easing.quad) })
    );
    setTimeout(() => fireAnswer(true), 980);
  };

  const onFail = () => {
    if (stateRef.current === "fail" || stateRef.current === "success") return;
    stopPulse();
    updateState("fail");
    shakeX.value = withSequence(
      withTiming(-7, { duration: 43 }), withTiming( 7, { duration: 43 }),
      withTiming(-5, { duration: 37 }), withTiming( 5, { duration: 37 }),
      withTiming( 0, { duration: 50, easing: Easing.out(Easing.quad) })
    );
    // Show action buttons after shake
    skipO.value = withTiming(1, { duration: 300 });
  };

  const startListening = () => {
    if (stateRef.current !== "idle") return;
    updateState("listening");

    // Pulse ring animation
    ringO.value = withTiming(0.38, { duration: 180 });
    ringS.value = withRepeat(
      withSequence(
        withTiming(1.52, { duration: 720, easing: Easing.inOut(Easing.quad) }),
        withTiming(1.0,  { duration: 620, easing: Easing.inOut(Easing.quad) })
      ), -1, false
    );

    const Rec = getSpeechRec();
    const rec = new Rec();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    recRef.current = rec;

    rec.onresult = (e: any) => {
      const result = e.results[0][0].transcript.toLowerCase().trim();
      setTranscript(result);
      // Fuzzy match: check if spoken text contains the target (or target contains it)
      const target = question.targetWord.toLowerCase();
      if (result.includes(target) || target.includes(result)) {
        onSuccess(result);
      } else {
        onFail();
      }
    };
    rec.onerror = () => { onFail(); };
    // Use stateRef to avoid stale closure — state at callback creation time is always "idle"
    rec.onend = () => {
      if (stateRef.current === "listening") {
        onFail();
      }
    };

    rec.start();
    // Auto-stop after 7 seconds
    setTimeout(() => { try { rec.stop(); } catch (_) {} }, 7000);
  };

  // ── Mobile / No-Speech-API mode ─────────────────────────────────────
  // On mobile, we can't use the web Speech API. Show the phrase clearly
  // and let user self-assess with "I Said It" / "Skip" buttons.
  if (!isWebWithSpeech) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{question.prompt}</Text>

        <EaseView
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "timing", duration: 270, easing: "easeOut" }}
          style={[styles.card, { opacity: 0, transform: [{ scale: 0.9 }] }]}
        >
          <View style={styles.kuRow}>
            <Volume2 color="#1CB0F6" size={20} />
            <Text style={styles.kuHint}>{question.targetKurdish}</Text>
          </View>
          <Text style={styles.targetWord}>{question.targetWord}</Text>
        </EaseView>

        <Text style={styles.mobileInstruction}>
          ئەم دەقەیە بە دەنگی بەرز بڵێ، پاشان هەڵبژێرە
        </Text>

        {/* "I Said It" green button */}
        <EaseView
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 240, delay: 200, easing: "easeOut" }}
          style={[styles.mobileActionWrap, { opacity: 0, translateY: 16 }]}
        >
          <View style={styles.saidBtnBase}>
            <View style={styles.saidBtnFront}>
              <Pressable
                style={styles.saidBtnInner}
                onPress={() => fireAnswer(true)}
              >
                <CheckCircle2 color="#FFF" size={22} style={{ marginRight: 10 }} />
                <Text style={styles.saidBtnText}>بڵێیم کرد ✓</Text>
              </Pressable>
            </View>
          </View>

          {/* Skip/Can't Say it button */}
          <View style={[styles.skipBase, { marginTop: 12 }]}>
            <View style={styles.skipFront}>
              <Pressable style={styles.skipBtn} onPress={() => fireAnswer(false)}>
                <Text style={styles.skipText}>نەمتوانی بڵێم (Skip)</Text>
              </Pressable>
            </View>
          </View>
        </EaseView>
      </View>
    );
  }

  // ── Web mode: Full speech recognition ───────────────────────────────
  const micBg      = state === "listening" ? "#1CB0F6" : state === "success" ? "#58CC02" : state === "fail" ? "#FF4B4B" : "#FFFFFF";
  const micShadow  = state === "listening" ? "#1899D6" : state === "success" ? "#58A700" : state === "fail" ? "#EA2B2B" : "#E5E5E5";
  const statusColor = state === "success" ? "#58CC02" : state === "fail" ? "#FF4B4B" : "#888";
  const statusText  =
    state === "idle"      ? "دوگمەی مایکرۆفۆن بپەڕینە" :
    state === "listening" ? "گوێم لێیە... قسەبکە" :
    state === "success"   ? "باشە! دروستت بووە ✓" :
                            "هەڵەیە، دووبارە هەوڵبدەوە";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{question.prompt}</Text>

      <EaseView
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "timing", duration: 270, easing: "easeOut" }}
        style={[styles.card, { opacity: 0, transform: [{ scale: 0.9 }] }]}
      >
        <View style={styles.kuRow}>
          <Volume2 color="#1CB0F6" size={20} />
          <Text style={styles.kuHint}>{question.targetKurdish}</Text>
        </View>
        <Text style={styles.targetWord}>{question.targetWord}</Text>
      </EaseView>

      <EaseView
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 280, delay: 110, easing: "easeOut" }}
        style={[styles.micOuter, { opacity: 0, translateY: 14 }]}
      >
        {/* Pulse ring */}
        <Animated.View style={[styles.ring, { backgroundColor: micBg }, ringStyle]} />

        {/* 3D mic button */}
        <Animated.View style={[styles.micShadow, { backgroundColor: micShadow }]}>
          <Animated.View style={[micStyle, styles.micFront, { backgroundColor: micBg, borderColor: state === "idle" ? "#E5E5E5" : micBg }]}>
            <Pressable
              onPress={startListening}
              disabled={state !== "idle"}
              onPressIn={() => { micTy.value = withTiming(6, { duration: 80 }); }}
              onPressOut={() => { micTy.value = withTiming(0, { duration: 120 }); }}
              style={styles.micInner}
            >
              <Mic color={state === "idle" ? "#1CB0F6" : "#FFF"} size={38} />
            </Pressable>
          </Animated.View>
        </Animated.View>
      </EaseView>

      <Text style={[styles.status, { color: statusColor }]}>{statusText}</Text>

      {/* Transcript reveal */}
      {transcript.length > 0 && (
        <EaseView
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "timing", duration: 220, easing: "easeOut" }}
          style={[styles.transcriptBox, { opacity: 0, transform: [{ scale: 0.93 }] }]}
        >
          <Text style={styles.transcriptLabel}>بیلێی:</Text>
          <Text style={styles.transcriptText}>{transcript}</Text>
        </EaseView>
      )}

      {/* Skip / Retry buttons on fail */}
      {state === "fail" && (
        <Animated.View style={[styles.actionRow, skipStyle]}>
          {/* Try again */}
          <Animated.View style={[{ flex: 1 }, styles.skipBase]}>
            <Animated.View style={[styles.skipFront, skipFrontStyle]}>
              <Pressable
                style={styles.skipBtn}
                onPress={() => { firedRef.current = false; setState("idle"); setTranscript(""); }}
                onPressIn={() => { skipTy.value = withTiming(4, { duration: 80 }); }}
                onPressOut={() => { skipTy.value = withTiming(0, { duration: 120 }); }}
              >
                <Text style={[styles.skipText, { color: "#1CB0F6" }]}>دووبارە هەوڵبدە</Text>
              </Pressable>
            </Animated.View>
          </Animated.View>
          {/* Skip */}
          <Animated.View style={[{ flex: 1 }, styles.skipBase]}>
            <Animated.View style={[styles.skipFront, skipFrontStyle]}>
              <Pressable
                style={styles.skipBtn}
                onPress={() => fireAnswer(false)}
                onPressIn={() => { skipTy.value = withTiming(4, { duration: 80 }); }}
                onPressOut={() => { skipTy.value = withTiming(0, { duration: 120 }); }}
              >
                <Text style={styles.skipText}>بگوزەرێ (Skip)</Text>
              </Pressable>
            </Animated.View>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 24, alignItems: "center" },
  title: { fontFamily: "DINNextRoundedBold", fontSize: 20, color: "#4B4B4B", textAlign: "center", marginBottom: 20 },
  card: {
    width: "100%", backgroundColor: "#EAF6FF", borderRadius: 22, padding: 28, alignItems: "center", marginBottom: 30,
    borderWidth: 2, borderColor: "#1CB0F6",
    boxShadow: "0px 5px 12px rgba(28, 176, 246, 0.15)" as any, elevation: 5,
  },
  kuRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  kuHint: { fontFamily: "DINNextRoundedMedium", fontSize: 17, color: "#7EC8E8" },
  targetWord: { fontFamily: "DINNextRoundedBold", fontSize: 38, color: "#1CB0F6", letterSpacing: 2, textAlign: "center" },

  // Mobile-only UI
  mobileInstruction: { fontFamily: "DINNextRoundedMedium", fontSize: 16, color: "#888", textAlign: "center", marginBottom: 28 },
  mobileActionWrap: { width: "100%", gap: 0 },

  // "I Said It" green button
  saidBtnBase:  { backgroundColor: "#58A700", borderRadius: 18 },
  saidBtnFront: { backgroundColor: "#58CC02", borderRadius: 18, marginBottom: 4 },
  saidBtnInner: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 18 },
  saidBtnText:  { fontFamily: "DINNextRoundedBold", fontSize: 18, color: "#FFF" },

  // Web UI
  micOuter: { width: 130, height: 130, alignItems: "center", justifyContent: "center", marginBottom: 18 },
  ring: { position: "absolute", width: 110, height: 110, borderRadius: 55 },
  micShadow: { width: 96, height: 96, borderRadius: 48 },
  micFront:  { width: 96, height: 96, borderRadius: 48, borderWidth: 2, marginBottom: 6, alignItems: "center", justifyContent: "center" },
  micInner:  { width: 96, height: 96, borderRadius: 48, alignItems: "center", justifyContent: "center" },

  status: { fontFamily: "DINNextRoundedMedium", fontSize: 15, textAlign: "center", marginBottom: 14 },
  transcriptBox: {
    backgroundColor: "#E5E5E5", borderRadius: 16, padding: 16, width: "100%", alignItems: "center", marginBottom: 14,
  },
  transcriptLabel: { fontFamily: "DINNextRoundedMedium", color: "#888", fontSize: 14, marginBottom: 4 },
  transcriptText:  { fontFamily: "DINNextRoundedBold", color: "#4B4B4B", fontSize: 19 },

  actionRow: { flexDirection: "row", gap: 12, width: "100%", marginTop: "auto" as any },

  // Skip button (reused for retry + skip)
  skipBase:  { backgroundColor: "#E5E5E5", borderRadius: 16 },
  skipFront: { backgroundColor: "#FFF", borderWidth: 2, borderColor: "#E5E5E5", borderRadius: 16, marginBottom: 4 },
  skipBtn:   { paddingHorizontal: 20, paddingVertical: 18, alignItems: "center" },
  skipText:  { fontFamily: "DINNextRoundedBold", fontSize: 15, color: "#AFAFAF" },
});
