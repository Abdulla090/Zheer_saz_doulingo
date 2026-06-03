/**
 * VoiceTutorScreen — Gemini Live native-audio tutor (voice in / voice out only).
 */

import { useGeminiLiveTutor } from "@/hooks/use-gemini-live-tutor";
import { useI18n } from "@/hooks/useI18n";
import { hapticImpact } from "@/utils/haptics";
import { useRouter } from "expo-router";
import { ArrowLeft, Mic, MicOff } from "lucide-react-native";
import React, { useCallback } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { VoiceTutorOrb } from "./components/VoiceTutorOrb";

const BG = "#08090F";
const FG = "#F8FAFC";

export function VoiceTutorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const tutor = useGeminiLiveTutor();

  const micScale = useSharedValue(1);
  const micStyle = useAnimatedStyle(() => ({
    transform: [{ scale: micScale.value }],
  }));

  const label = useCallback(() => {
    if (tutor.thinking) return t("voiceTutor.connecting");
    if (tutor.speaking) return t("voiceTutor.speaking");
    if (tutor.listening) return t("voiceTutor.listening");
    if (tutor.status === "error") return t("voiceTutor.error");
    if (!tutor.sessionActive) return t("voiceTutor.tapStart");
    return t("voiceTutor.voiceOnlyHint");
  }, [t, tutor]);

  const handleBack = () => {
    tutor.stopAll();
    router.back();
  };

  return (
    <View style={s.root}>
      <View style={s.blob1} />
      <View style={s.blob2} />

      <View style={[s.header, { paddingTop: insets.top + 10 }]}>
        <Pressable
          onPress={handleBack}
          style={({ pressed }) => [s.headerBtn, pressed && { opacity: 0.6 }]}
        >
          <ArrowLeft size={20} color="rgba(248,250,252,0.8)" strokeWidth={2} />
        </Pressable>

        <View style={s.headerCenter}>
          <Text style={s.headerTitle}>{t("voiceTutor.title")}</Text>
          <Text style={s.headerSub}>{t("voiceTutor.liveSubtitle")}</Text>
        </View>

        <View style={s.headerBtn} />
      </View>

      <View style={s.main}>
        <Pressable
          onPress={() => {
            hapticImpact();
            tutor.handleMicPress();
          }}
          accessibilityRole="button"
          accessibilityLabel={label()}
        >
          <VoiceTutorOrb
            status={tutor.status}
            speaking={tutor.speaking}
            listening={tutor.listening}
            size={168}
          />
        </Pressable>

        <Text style={s.statusLabel}>{label()}</Text>

        {!tutor.configured && (
          <Text style={s.demoTag}>{t("voiceTutor.demoMode")}</Text>
        )}

        {tutor.error ? <Text style={s.errorText}>{tutor.error}</Text> : null}

        <Text style={s.disclaimer}>{t("voiceTutor.disclaimer")}</Text>
      </View>

      <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <Animated.View style={[s.micRow, micStyle]}>
          <Pressable
            onPress={() => {
              hapticImpact();
              tutor.handleMicPress();
            }}
            onPressIn={() => {
              micScale.value = withSpring(0.93, { damping: 12 });
            }}
            onPressOut={() => {
              micScale.value = withSpring(1, { damping: 12 });
            }}
            style={[s.micBtn, tutor.listening && s.micBtnListening]}
          >
            {tutor.listening ? (
              <MicOff size={28} color={BG} strokeWidth={2.5} />
            ) : (
              <Mic size={28} color={BG} strokeWidth={2.5} />
            )}
          </Pressable>
          <Text style={s.micLabel}>
            {!tutor.sessionActive
              ? t("voiceTutor.startLive")
              : tutor.listening
                ? t("voiceTutor.mute")
                : t("voiceTutor.speak")}
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  blob1: {
    position: "absolute",
    top: -100,
    left: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  blob2: {
    position: "absolute",
    bottom: 40,
    right: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  headerBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: FG,
    fontFamily: "DINNextRoundedBold",
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 12,
    color: "rgba(248,250,252,0.35)",
    fontFamily: "DINNextRoundedMedium",
    marginTop: 1,
  },
  main: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 24,
  },
  statusLabel: {
    fontSize: 15,
    color: "rgba(248,250,252,0.5)",
    textAlign: "center",
    fontFamily: "DINNextRoundedMedium",
    maxWidth: 280,
  },
  demoTag: {
    fontSize: 11,
    color: "rgba(248,250,252,0.28)",
    textAlign: "center",
    fontFamily: "DINNextRoundedMedium",
  },
  errorText: {
    color: "#F87171",
    textAlign: "center",
    fontSize: 13,
    fontFamily: "DINNextRoundedMedium",
    maxWidth: 300,
  },
  disclaimer: {
    fontSize: 11,
    lineHeight: 16,
    color: "rgba(248,250,252,0.22)",
    textAlign: "center",
    fontFamily: "DINNextRoundedMedium",
    maxWidth: 300,
    marginTop: 8,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 8,
    gap: 14,
    alignItems: "center",
  },
  micRow: { alignItems: "center", gap: 8 },
  micBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: FG,
    alignItems: "center",
    justifyContent: "center",
    ...(Platform.OS === "ios"
      ? {
          shadowColor: "#FFF",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 16,
        }
      : { elevation: 8 }),
  },
  micBtnListening: {
    borderWidth: 2,
    borderColor: "rgba(248,250,252,0.35)",
  },
  micLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(248,250,252,0.45)",
    fontFamily: "DINNextRoundedMedium",
  },
});
