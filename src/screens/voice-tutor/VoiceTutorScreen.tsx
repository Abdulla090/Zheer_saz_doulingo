import { AppText } from "../../components/ui/AppText";
import {
  HomeMeshBackground,
  HomePalette as C,
} from "../../components/ui/ios-liquid-home";
import { useGeminiLiveTutor } from "../../hooks/use-gemini-live-tutor";
import { useI18n } from "../../hooks/useI18n";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useLocaleStore } from "../../stores/useLocaleStore";
import { hapticImpact } from "../../utils/haptics";
import { useRouter } from "expo-router";
// @ts-expect-error No type declarations for hugeicons cjs paths
import { HugeiconsIcon } from "@hugeicons/react-native/dist/cjs/index.js";

import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View, Dimensions, ScrollView } from "react-native";
import { PressableScale } from "../../components/animations";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur"; // For glassmorphism

/* eslint-disable @typescript-eslint/no-require-imports */
const {
  Cancel01Icon,
  Mic01Icon,
  MagicWandIcon,
  VolumeHighIcon,
  VolumeMuteIcon,
  Airplane01Icon,
  Coffee01Icon,
  Briefcase01Icon,
  Message01Icon,
} = require("@hugeicons/core-free-icons/dist/cjs/index.js");
/* eslint-enable @typescript-eslint/no-require-imports */

const { height: screenHeight } = Dimensions.get("window");

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const TOPICS = [
  { id: "airport", title: "At the Airport", icon: Airplane01Icon },
  { id: "coffee", title: "Ordering Coffee", icon: Coffee01Icon },
  { id: "interview", title: "Job Interview", icon: Briefcase01Icon },
  { id: "casual", title: "Casual Chat", icon: Message01Icon },
];

export function VoiceTutorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const tutor = useGeminiLiveTutor();
  const { colors, isDark } = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const targetLang = useLocaleStore((s) => s.selectedTargetLanguage);
  const langBadgeText = (targetLang || "en").toUpperCase();

  const handleBack = () => {
    tutor.stopAll();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const statusLabel = useMemo(() => {
    if (tutor.thinking) return t("voiceTutor.statusThinking");
    if (tutor.speaking) return t("voiceTutor.statusSpeaking");
    if (tutor.listening) return t("voiceTutor.statusListening");
    if (tutor.status === "error") return t("voiceTutor.statusError");
    if (!tutor.sessionActive) return t("voiceTutor.statusConnect");
    return t("voiceTutor.statusWaiting");
  }, [tutor, t]);

  const getTopicTitleKey = (id: string) => {
    switch (id) {
      case "airport":
        return "voiceTutor.topicAirport";
      case "coffee":
        return "voiceTutor.topicCoffee";
      case "interview":
        return "voiceTutor.topicInterview";
      default:
        return "voiceTutor.topicCasual";
    }
  };

  // Breathing animation for the glass orb glow
  const glowOpacity = useSharedValue(0.1);
  const glowScale = useSharedValue(1);

  useEffect(() => {
    if (tutor.speaking || tutor.thinking) {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.6, {
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0.2, {
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
          }),
        ),
        -1,
        true,
      );
      glowScale.value = withRepeat(
        withSequence(
          withTiming(1.2, {
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      );
    } else if (tutor.listening) {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      );
      glowScale.value = withRepeat(
        withSequence(
          withTiming(1.05, {
            duration: 800,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      );
    } else {
      glowOpacity.value = withTiming(0.1, { duration: 500 });
      glowScale.value = withTiming(1, { duration: 500 });
    }
  }, [glowOpacity, glowScale, tutor.speaking, tutor.thinking, tutor.listening]);

  const glowAnim = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: glowOpacity.value,
  }));

  // Ultra-thin Siri-style soundwaves (removed in favor of logo)
  const logoRotation = useSharedValue(0);
  const logoScale = useSharedValue(1);

  // Continuous rotation for playful animation
  useEffect(() => {
    logoRotation.value = withRepeat(
      withTiming(360, {
        duration: 12000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [logoRotation]);

  // Pulse animation depending on tutor status
  useEffect(() => {
    if (tutor.speaking) {
      logoScale.value = withRepeat(
        withSequence(
          withTiming(1.12, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.0, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true
      );
    } else if (tutor.listening) {
      logoScale.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.0, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true
      );
    } else {
      logoScale.value = withRepeat(
        withSequence(
          withTiming(1.04, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.0, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true
      );
    }
  }, [logoScale, tutor.speaking, tutor.listening]);

  const logoAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${logoRotation.value}deg` },
      { scale: logoScale.value },
    ],
  }));

  // iOS 27 Fluid Bottom Sheet Animation
  const sheetPosition = useSharedValue(screenHeight);
  const [sheetOpen, setSheetOpen] = useState(false);

  const openSheet = () => {
    setSheetOpen(true);
    sheetPosition.value = withSpring(0, {
      damping: 20,
      stiffness: 180,
      mass: 0.8,
    });
    hapticImpact();
  };

  const closeSheet = () => {
    sheetPosition.value = withSpring(
      screenHeight,
      { damping: 20, stiffness: 180, mass: 0.8 },
      (finished) => {
        // Intentionally delay removing from layout for smoothness
      },
    );
    setSheetOpen(false);
  };

  const selectTopic = (topic: string) => {
    tutor.changeTopic(topic);
    hapticImpact();
    closeSheet();
  };

  const sheetAnim = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetPosition.value }],
  }));

  return (
    <View style={styles.root}>
      <HomeMeshBackground />
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <PressableScale
          style={styles.closeBtn}
          onPress={handleBack}
          scaleDown={0.9}
        >
          <HugeiconsIcon
            icon={Cancel01Icon}
            size={24}
            color={colors.mutedForeground}
            strokeWidth={2.0}
          />
        </PressableScale>

        <View style={styles.headerTitles}>
          <AppText style={styles.inSessionBadge}>{t("voiceTutor.liveSession")}</AppText>
        </View>

        <View style={styles.langBadge}>
          <AppText style={styles.langText} forceLatinFont latinRole="bold">
            {langBadgeText}
          </AppText>
        </View>
      </View>

      {/* MAIN VISUAL: Glass Orb */}
      <View style={styles.main}>
        <PressableScale
          style={styles.orbContainer}
          onPress={tutor.handleMicPress}
        >
          {/* Outer diffuse glow */}
          <Animated.View style={[styles.orbGlow, glowAnim]} />

          {/* Inner frosted glass orb */}
          <BlurView
            intensity={20}
            style={styles.glassOrb}
            tint={isDark ? "dark" : "light"}
          >
            <View
              style={[
                styles.glassBorder,
                !isDark && { borderColor: "rgba(0, 0, 0, 0.1)" },
              ]}
            />

            {/* Logo image that rotates/pulses */}
            <Animated.Image
              source={require("../../../assets/images/logo-compressed.png")}
              style={[styles.orbLogo, logoAnimStyle]}
              resizeMode="contain"
            />
          </BlurView>
        </PressableScale>

        {/* TRANSCRIPT / STATUS */}
        <View style={styles.transcriptBox}>
          <AppText
            style={[
              styles.statusLabel,
              tutor.listening && { color: colors.primary },
            ]}
          >
            {statusLabel}
          </AppText>
          {tutor.speaking && tutor.transcript ? (
            <AppText style={styles.transcriptText}>{tutor.transcript}</AppText>
          ) : tutor.speaking ? (
            <AppText style={[styles.transcriptText, { opacity: 0.5 }]}>
              ...
            </AppText>
          ) : null}
          {tutor.error && (
            <AppText style={[styles.transcriptText, { color: colors.primary }]}>
              {tutor.error}
            </AppText>
          )}
        </View>
      </View>

      {/* FOOTER CONTROLS */}
      <View
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}
      >
        <View style={styles.controlsRow}>
          {/* Left Button: Cut off / Mute */}
          <PressableScale
            style={[
              styles.sideBtn,
              tutor.speaking && { borderColor: colors.primary },
            ]}
            onPress={() => {
              if (tutor.speaking) {
                tutor.interruptAi();
                hapticImpact();
              }
            }}
            scaleDown={0.92}
          >
            {tutor.speaking ? (
              <HugeiconsIcon
                icon={VolumeMuteIcon}
                size={24}
                color={colors.primary}
                strokeWidth={2.0}
              />
            ) : (
              <HugeiconsIcon
                icon={VolumeHighIcon}
                size={24}
                color={colors.mutedForeground}
                strokeWidth={2.0}
              />
            )}
          </PressableScale>

          {/* Center Button: Main Mic */}
          <PressableScale
            style={[
              styles.mainMicBtn,
              tutor.listening && styles.mainMicBtnActive,
            ]}
            onPress={() => {
              hapticImpact();
              tutor.handleMicPress();
            }}
            scaleDown={0.9}
          >
            <HugeiconsIcon
              icon={Mic01Icon}
              size={32}
              color={tutor.listening ? colors.background : colors.foreground}
              strokeWidth={2.0}
            />
          </PressableScale>

          {/* Right Button: Topics */}
          <PressableScale
            style={styles.sideBtn}
            onPress={openSheet}
            scaleDown={0.92}
          >
            <HugeiconsIcon
              icon={MagicWandIcon}
              size={24}
              color={colors.foreground}
              strokeWidth={2.0}
            />
          </PressableScale>
        </View>

        <AppText style={styles.footerHint}>
          {t("voiceTutor.footerHint")}
        </AppText>
      </View>

      {/* iOS 27 Fluid Bottom Sheet Overlay */}
      <Animated.View
        style={[styles.sheetOverlay, sheetAnim]}
        pointerEvents={sheetOpen ? "auto" : "none"}
      >
        <AnimatedBlurView
          intensity={isDark ? 70 : 90}
          tint={isDark ? "dark" : "light"}
          style={[
            styles.sheetContainer,
            { paddingBottom: Math.max(insets.bottom, 24) },
          ]}
        >
          <View
            style={[
              styles.sheetHandle,
              !isDark && { backgroundColor: "rgba(0,0,0,0.2)" },
            ]}
          />
          <View style={styles.sheetHeader}>
            <HugeiconsIcon
              icon={Message01Icon}
              size={24}
              color={C.blue}
              strokeWidth={2.0}
            />
            <AppText style={styles.sheetTitle}>{t("voiceTutor.chooseTopic")}</AppText>
            <PressableScale
              onPress={closeSheet}
              style={[
                styles.sheetCloseBtn,
                !isDark && { backgroundColor: "rgba(0,0,0,0.05)" },
              ]}
              scaleDown={0.9}
            >
              <HugeiconsIcon
                icon={Cancel01Icon}
                size={20}
                color={colors.mutedForeground}
                strokeWidth={2.0}
              />
            </PressableScale>
          </View>

          <ScrollView
            style={{ width: "100%" }}
            contentContainerStyle={styles.topicsGrid}
            showsVerticalScrollIndicator={false}
          >
            {TOPICS.map((topic) => (
              <PressableScale
                key={topic.id}
                style={[
                  styles.topicCard,
                  !isDark && {
                    backgroundColor: "rgba(0,0,0,0.02)",
                    borderColor: "rgba(0,0,0,0.05)",
                  },
                ]}
                onPress={() => selectTopic(topic.title)}
                scaleDown={0.97}
              >
                <HugeiconsIcon
                  icon={topic.icon}
                  size={28}
                  color={colors.primary}
                  strokeWidth={2.0}
                />
                 <AppText style={styles.topicTitle}>{t(getTopicTitleKey(topic.id))}</AppText>
              </PressableScale>
            ))}
          </ScrollView>
        </AnimatedBlurView>
      </Animated.View>
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: C.meshBottom,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 24,
      paddingBottom: 16,
    },
    closeBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: "rgba(255,255,255,0.78)",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "rgba(26,43,72,0.08)",
    },
    headerTitles: {
      alignItems: "center",
    },
    inSessionBadge: {
      fontSize: 12,
      fontWeight: "800",
      color: C.gray,
      textTransform: "uppercase",
      letterSpacing: 1.5,
    },
    langBadge: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: "rgba(255, 107, 74, 0.1)",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "rgba(255, 107, 74, 0.3)",
    },
    langText: {
      fontSize: 14,
      color: C.blue,
    },
    main: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
    },
    orbContainer: {
      width: 280,
      height: 280,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    orbGlow: {
      position: "absolute",
      width: 240,
      height: 240,
      borderRadius: 120,
      backgroundColor: C.blue,
      shadowColor: C.blue,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1,
      shadowRadius: 60,
      elevation: 24,
    },
    glassOrb: {
      width: 180,
      height: 180,
      borderRadius: 90,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    glassBorder: {
      ...StyleSheet.absoluteFill,
      borderRadius: 90,
      borderWidth: 1.5,
      borderColor: "rgba(255, 255, 255, 0.2)",
    },
    orbLogo: {
      width: 110,
      height: 110,
      borderRadius: 55,
    },
    transcriptBox: {
      width: "100%",
      minHeight: 120,
      marginTop: 48,
      alignItems: "center",
    },
    statusLabel: {
      fontSize: 13,
      color: C.gray,
      fontWeight: "800",
      letterSpacing: 1,
      textTransform: "uppercase",
      marginBottom: 20,
    },
    transcriptText: {
      fontSize: 24,
      fontWeight: "400",
      color: C.navy,
      textAlign: "center",
      lineHeight: 34,
      fontFamily: "DINNextRoundedRegular",
    },
    footer: {
      paddingHorizontal: 32,
      alignItems: "center",
      gap: 0,
    },
    controlsRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 32,
      width: "100%",
    },
    sideBtn: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: "rgba(255,255,255,0.78)",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "rgba(26,43,72,0.08)",
    },
    mainMicBtn: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: "rgba(255,255,255,0.86)",
      borderWidth: 1,
      borderColor: "rgba(26,43,72,0.08)",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 10,
    },
    mainMicBtnActive: {
      backgroundColor: C.blue,
      borderColor: C.blue,
      shadowColor: C.blue,
      shadowOpacity: 0.35,
      shadowRadius: 24,
    },
    footerHint: {
      display: "none",
    },
    sheetOverlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: screenHeight * 0.55,
      zIndex: 999,
    },
    sheetContainer: {
      flex: 1,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      paddingHorizontal: 24,
      paddingTop: 12,
      borderTopWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    sheetHandle: {
      width: 48,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      alignSelf: "center",
      marginBottom: 24,
    },
    sheetHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 32,
    },
    sheetTitle: {
      fontSize: 24,
      fontWeight: "800",
      color: C.navy,
      marginLeft: 12,
      flex: 1,
    },
    sheetCloseBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      alignItems: "center",
      justifyContent: "center",
    },
    topicsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      width: "100%",
      justifyContent: "space-between",
      rowGap: 16,
    },
    topicCard: {
      width: "48%",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderRadius: 24,
      padding: 24,
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.1)",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
    },
    topicTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: C.navy,
      textAlign: "center",
    },
  });
