/**
 * Live voice tutor — PINGO brand UI (mesh background, mascot, mic orb).
 */

import { PingoMascot } from "@/components/mascot/PingoMascot";
import { MicCaptureOrb } from "@/components/voice/MicCaptureOrb";
import {
  HomeLiquidButton,
  HomeMeshBackground,
  HomePalette,
  HomeType,
} from "@/components/ui/ios-liquid-home";
import { useGeminiLiveTutor } from "@/hooks/use-gemini-live-tutor";
import { useI18n } from "@/hooks/useI18n";
import { hapticImpact } from "@/utils/haptics";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const C = HomePalette;

export function VoiceTutorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const tutor = useGeminiLiveTutor();

  const mascotPose = useMemo(() => {
    if (tutor.speaking) return "happy" as const;
    if (tutor.sessionActive) return "headset" as const;
    return "wave" as const;
  }, [tutor.sessionActive, tutor.speaking]);

  const statusLabel = useCallback(() => {
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

  const showMicOrb = tutor.sessionActive && tutor.listening && !tutor.speaking;

  const breathe = useSharedValue(1);
  React.useEffect(() => {
    if (tutor.speaking) {
      breathe.value = withRepeat(
        withSequence(
          withTiming(1.04, { duration: 520 }),
          withTiming(1, { duration: 520 }),
        ),
        -1,
        true,
      );
    } else {
      breathe.value = withTiming(1, { duration: 200 });
    }
  }, [breathe, tutor.speaking]);

  const mascotAnim = useAnimatedStyle(() => ({
    transform: [{ scale: breathe.value }],
  }));

  return (
    <View style={styles.root}>
      <HomeMeshBackground />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable
          onPress={handleBack}
          style={styles.backBtn}
          hitSlop={12}
          accessibilityRole="button"
        >
          <ArrowLeft size={22} color={C.navy} strokeWidth={2.5} />
        </Pressable>
        <View style={styles.headerTitles}>
          <Text style={styles.pageTitle}>{t("voiceTutor.title")}</Text>
          <Text style={styles.pageSub}>{t("voiceTutor.subtitle")}</Text>
        </View>
        <View style={styles.backSpacer} />
      </View>

      <View style={styles.main}>
        {showMicOrb ? (
          <MicCaptureOrb
            listening
            color={C.blue}
            size={120}
            hint={t("voiceTutor.tapSpeak")}
            onPress={() => {
              hapticImpact();
              tutor.handleMicPress();
            }}
          />
        ) : (
          <Animated.View style={mascotAnim}>
            {tutor.thinking ? (
              <View style={styles.mascotWrap}>
                <PingoMascot size={148} pose={mascotPose} />
                <View style={styles.mascotLoader}>
                  <ActivityIndicator color={C.blue} size="large" />
                </View>
              </View>
            ) : (
              <PingoMascot size={148} pose={mascotPose} />
            )}
          </Animated.View>
        )}

        <View style={styles.statusPill}>
          <View
            style={[
              styles.statusDot,
              tutor.sessionActive && tutor.status !== "error"
                ? styles.statusDotLive
                : null,
            ]}
          />
          <Text style={styles.statusText}>{statusLabel()}</Text>
        </View>

        {!tutor.configured ? (
          <Text style={styles.demoTag}>{t("voiceTutor.demoMode")}</Text>
        ) : null}

        {tutor.error ? (
          <Text style={styles.errorText}>{tutor.error}</Text>
        ) : null}
      </View>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <Text style={styles.disclaimer}>{t("voiceTutor.disclaimer")}</Text>

        {!tutor.sessionActive ? (
          <HomeLiquidButton
            label={t("voiceTutor.startLive")}
            onPress={() => {
              hapticImpact();
              tutor.handleMicPress();
            }}
          />
        ) : (
          <Pressable
            onPress={() => {
              hapticImpact();
              tutor.handleMicPress();
            }}
            style={styles.secondaryMic}
            accessibilityRole="button"
          >
            <Text style={styles.secondaryMicText}>
              {tutor.listening ? t("voiceTutor.mute") : t("voiceTutor.speak")}
            </Text>
          </Pressable>
        )}

        {tutor.sessionActive ? (
          <Pressable
            onPress={() => {
              tutor.stopAll();
            }}
            style={styles.endSession}
          >
            <Text style={styles.endSessionText}>{t("voiceTutor.stop")}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.meshBottom,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.divider,
  },
  backSpacer: { width: 40 },
  headerTitles: { flex: 1, alignItems: "center" },
  pageTitle: {
    ...HomeType.heading,
    fontSize: 20,
    color: C.navy,
  },
  pageSub: {
    ...HomeType.caption,
    color: C.grayLight,
    marginTop: 2,
    textAlign: "center",
  },
  main: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 18,
  },
  mascotWrap: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  mascotLoader: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.35)",
    borderRadius: 999,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: C.divider,
    maxWidth: 320,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.grayLight,
  },
  statusDotLive: {
    backgroundColor: "#58CC02",
  },
  statusText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: C.navy,
    fontFamily: "DINNextRoundedMedium",
    textAlign: "center",
  },
  demoTag: {
    ...HomeType.caption,
    color: C.grayLight,
    textAlign: "center",
    paddingHorizontal: 12,
  },
  errorText: {
    color: C.red,
    textAlign: "center",
    fontSize: 14,
    fontFamily: "DINNextRoundedMedium",
    maxWidth: 300,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 12,
  },
  disclaimer: {
    ...HomeType.caption,
    color: C.grayLight,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 4,
  },
  secondaryMic: {
    alignItems: "center",
    paddingVertical: 14,
  },
  secondaryMicText: {
    fontSize: 16,
    fontWeight: "700",
    color: C.blue,
    fontFamily: "DINNextRoundedBold",
  },
  endSession: {
    alignItems: "center",
    paddingBottom: 4,
  },
  endSessionText: {
    fontSize: 14,
    fontWeight: "600",
    color: C.gray,
    fontFamily: "DINNextRoundedMedium",
  },
});
