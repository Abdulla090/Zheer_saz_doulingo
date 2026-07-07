import { AppText } from "../../components/ui/AppText";
import {
  HomeMeshBackground,
  HomePalette as C,
} from "../../components/ui/ios-liquid-home";
import { useGeminiLiveTutor } from "../../hooks/use-gemini-live-tutor";
import { useI18n } from "../../hooks/useI18n";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { LEVEL_CONFIGS } from "../../data/voice-tutor-word-banks";
import { hapticImpact } from "../../utils/haptics";
import { useRouter } from "expo-router";
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from "react-native-svg";
import { ActivityIndicator , StyleSheet, View, Dimensions, ScrollView, PanResponder, Image } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  AlertCircleIcon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  Cancel01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { PressableScale } from "../../components/animations";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
  useAnimatedProps,
  runOnJS,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BRAND_LOGO = require("../../../assets/images/logo-compressed.png");

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

const AnimatedPath = Animated.createAnimatedComponent(Path);

const IOS_SPRING_CONFIG = {
  damping: 30,
  stiffness: 220,
  mass: 0.5,
  overshootClamping: true, // Prevents any bouncing/overshoot completely
};

export function VoiceTutorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, isKu, isAr } = useI18n();
  const isRtl = isKu || isAr;
  const tutor = useGeminiLiveTutor();
  const { colors } = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const level = useSettingsStore((s) => s.englishLevel) || 5;
  const onboardingComplete = useSettingsStore((s) => s.tutorOnboardingComplete);
  const analysisData = useSettingsStore((s) => s.lastAnalysis);

  // ── Animated voice reactive waveforms ──
  const phase = useSharedValue(0);
  const waveAmplitude = useSharedValue(8);

  useEffect(() => {
    phase.value = withRepeat(
      withTiming(2 * Math.PI, {
        duration: 8000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [phase]);

  useEffect(() => {
    if (tutor.speaking) {
      waveAmplitude.value = withRepeat(
        withSequence(
          withTiming(45, { duration: 400 }),
          withTiming(15, { duration: 300 }),
          withTiming(35, { duration: 500 }),
          withTiming(20, { duration: 350 }),
        ),
        -1,
        true
      );
    } else if (tutor.listening) {
      waveAmplitude.value = withRepeat(
        withSequence(
          withTiming(35, { duration: 500 }),
          withTiming(12, { duration: 400 }),
          withTiming(40, { duration: 600 }),
          withTiming(15, { duration: 450 }),
        ),
        -1,
        true
      );
    } else if (tutor.thinking) {
      waveAmplitude.value = withRepeat(
        withSequence(
          withTiming(20, { duration: 1000 }),
          withTiming(10, { duration: 1000 }),
        ),
        -1,
        true
      );
    } else {
      waveAmplitude.value = withTiming(8, { duration: 800 });
    }
  }, [tutor.speaking, tutor.listening, tutor.thinking, waveAmplitude]);

  const handleBack = useCallback(() => {
    tutor.stopAll();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  }, [router, tutor]);

  const statusLabel = useMemo(() => {
    if (tutor.thinking) return t("voiceTutor.statusThinking");
    if (tutor.speaking) return t("voiceTutor.statusSpeaking");
    if (tutor.listening) return t("voiceTutor.statusListening");
    if (tutor.status === "error") return t("voiceTutor.statusError");
    if (!tutor.sessionActive) return t("voiceTutor.statusConnect");
    return t("voiceTutor.statusWaiting");
  }, [tutor, t]);

  const logoScale = useSharedValue(1);

  // Pulse animation depending on tutor status (no rotation — it's the actual brand logo)
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
      { scale: logoScale.value },
    ],
  }));

  // Swipe Up / Analysis Modal Animation
  const bottomSheetY = useSharedValue(screenHeight);
  const topSheetY = useSharedValue(-screenHeight);
  const isDragging = useSharedValue("none"); // "none" | "top" | "bottom"
  const [analysisOpen, setAnalysisOpen] = useState(false);

  const openAnalysis = () => {
    setAnalysisOpen(true);
    bottomSheetY.value = withSpring(0, IOS_SPRING_CONFIG);
    hapticImpact();
    tutor.runAnalysis();
  };

  const closeAnalysis = useCallback(() => {
    bottomSheetY.value = withSpring(screenHeight, IOS_SPRING_CONFIG);
    setAnalysisOpen(false);
  }, [bottomSheetY]);

  const analysisAnim = useAnimatedStyle(() => ({
    transform: [{ translateY: bottomSheetY.value }],
  }));

  const topSheetAnim = useAnimatedStyle(() => ({
    transform: [{ translateY: topSheetY.value }],
  }));

  const topWaveProps = useAnimatedProps(() => {
    const numPoints = 40;
    const points = [];
    const midline = 60;
    const amplitude = waveAmplitude.value;
    
    for (let i = 0; i <= numPoints; i++) {
      const x = (i / numPoints) * screenWidth;
      const angle = (i / numPoints) * 2 * Math.PI - phase.value;
      const y = midline + amplitude * Math.sin(angle);
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    
    const d = `M 0,0 L ${points.join(" L ")} L ${screenWidth},0 Z`;
    return { d };
  });

  const bottomWaveProps = useAnimatedProps(() => {
    const numPoints = 40;
    const points = [];
    const midline = 120;
    const amplitude = waveAmplitude.value;
    
    for (let i = 0; i <= numPoints; i++) {
      const x = (i / numPoints) * screenWidth;
      const angle = (i / numPoints) * 2 * Math.PI + phase.value;
      const y = midline + amplitude * Math.sin(angle);
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    
    const d = `M 0,180 L ${points.join(" L ")} L ${screenWidth},180 Z`;
    return { d };
  });

  // Gesture responder for real-time swipe down (return to path) and swipe up (open analysis)
  const panHandlers = useMemo(
    () => PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (analysisOpen) return false;
        return Math.abs(gestureState.dy) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        const { dy } = gestureState;
        if (dy < 0 && isDragging.value !== "top") {
          isDragging.value = "bottom";
          bottomSheetY.value = Math.max(0, screenHeight + dy);
        } else if (dy > 0 && isDragging.value !== "bottom") {
          isDragging.value = "top";
          topSheetY.value = Math.min(0, -screenHeight + dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dy, vy } = gestureState;
        if (isDragging.value === "bottom") {
          if (dy < -120 || vy < -0.5) {
            bottomSheetY.value = withSpring(0, IOS_SPRING_CONFIG);
            setAnalysisOpen(true);
            tutor.runAnalysis();
          } else {
            bottomSheetY.value = withSpring(screenHeight, IOS_SPRING_CONFIG);
            setAnalysisOpen(false);
          }
        } else if (isDragging.value === "top") {
          if (dy > 120 || vy > 0.5) {
            topSheetY.value = withTiming(0, { duration: 250 }, () => {
              runOnJS(handleBack)();
            });
          } else {
            topSheetY.value = withSpring(-screenHeight, IOS_SPRING_CONFIG);
          }
        }
        isDragging.value = "none";
      },
    }).panHandlers,
    [analysisOpen, bottomSheetY, handleBack, isDragging, topSheetY, tutor],
  );

  // Analysis drag-handle responder
  const analysisCloseHandlers = useMemo(
    () => PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const { dy } = gestureState;
        if (dy > 0) {
          bottomSheetY.value = Math.min(screenHeight, dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dy, vy } = gestureState;
        if (dy > 100 || vy > 0.5) {
          closeAnalysis();
        } else {
          bottomSheetY.value = withSpring(0, IOS_SPRING_CONFIG);
        }
      }
    }).panHandlers,
    [bottomSheetY, closeAnalysis],
  );

  return (
    <View style={styles.root} {...panHandlers}>
      <HomeMeshBackground />

      {/* ── TOP LIQUID SHEET (Pulls down from top) ── */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            width: screenWidth,
            height: screenHeight,
            backgroundColor: "#FFFFFF",
            zIndex: 15,
          },
          topSheetAnim,
        ]}
      >
        <View style={{ position: "absolute", bottom: -180, left: 0, width: screenWidth, height: 180 }}>
          <Svg width={screenWidth} height={180} viewBox={`0 0 ${screenWidth} 180`} preserveAspectRatio="none">
            <Defs>
              <SvgLinearGradient id="topWaveGrad" x1="0" y1="1" x2="0" y2="0">
                <Stop offset="0" stopColor="#3B82F6" stopOpacity="0.15" />
                <Stop offset="1" stopColor="#FFFFFF" stopOpacity="1" />
              </SvgLinearGradient>
            </Defs>
            <AnimatedPath animatedProps={topWaveProps} fill="url(#topWaveGrad)" />
          </Svg>
        </View>
      </Animated.View>

      {/* TOP BAR / SWIPE DOWN INDICATOR */}
      <View style={[styles.topSwipeContainer, { paddingTop: insets.top + 8 }]}>
        <View style={styles.swipeIndicatorCol}>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={18}
            color="#4F46E5"
            strokeWidth={2.5}
          />
          <AppText style={styles.swipeText}>
            {isKu ? "بخشە خوارەوە بۆ گەڕانەوە" : "Swipe down to return"}
          </AppText>
        </View>

        {/* Floating pill for level badge & language */}
        <View style={styles.topControlRow}>
          <View style={[styles.langBadge, { width: "auto", paddingHorizontal: 12, borderRadius: 20 }]}>
            <AppText style={styles.langText} forceLatinFont latinRole="bold">
              {onboardingComplete ? `Lv. ${level} / ${LEVEL_CONFIGS[level]?.cefr || "A1"}` : (isKu ? "ئۆنبۆردینگ" : "ONBOARDING")}
            </AppText>
          </View>
        </View>
      </View>

      {/* MAIN VISUAL AREA */}
      <View style={styles.main}>
        <PressableScale
          style={styles.orbContainer}
          onPress={tutor.handleMicPress}
        >
          {/* Actual Brand Logo (No glowing rings or outer circles) */}
          <Animated.View style={[styles.orbLogoContainer, logoAnimStyle]}>
            <Image
              source={BRAND_LOGO}
              style={{ width: 240, height: 240 }}
              resizeMode="contain"
            />
          </Animated.View>
        </PressableScale>

        {/* STATUS & LIVE TRANSCRIPT DISPLAY */}
        <View style={styles.transcriptBox}>
          <AppText
            style={[
              styles.statusLabel,
              tutor.listening && { color: C.blue },
            ]}
          >
            {statusLabel}
          </AppText>
          {tutor.speaking && tutor.transcript ? (
          <AppText style={[styles.transcriptText, isRtl && styles.rtlText]}>{tutor.transcript}</AppText>
          ) : tutor.speaking ? (
            <AppText style={[styles.transcriptText, isRtl && styles.rtlText, { opacity: 0.5 }]}>
              ...
            </AppText>
          ) : tutor.sessionActive ? (
            <AppText style={[styles.transcriptText, isRtl && styles.rtlText, { opacity: 0.75, fontSize: 16 }]}>
              {isKu ? "مایکی لایڤ کاردەکات. دەست بکە بە قسەکردن." : "Live microphone active. Start speaking."}
            </AppText>
          ) : (
            <AppText style={[styles.transcriptText, isRtl && styles.rtlText, { opacity: 0.45, fontSize: 15 }]}>
              {isKu ? "دەست لە گۆکە بدە بۆ دەستپێکردن" : "Tap the central logo to connect"}
            </AppText>
          )}
          {tutor.error && (
            <AppText style={[styles.transcriptText, isRtl && styles.rtlText, { color: C.red, fontSize: 14, marginTop: 8 }]}>
              {tutor.error}
            </AppText>
          )}
        </View>
      </View>

      {/* BOTTOM SWIPE UP INDICATOR */}
      <View style={[styles.bottomSwipeContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <PressableScale style={styles.swipeIndicatorCol} onPress={openAnalysis}>
          <HugeiconsIcon
            icon={ArrowUp01Icon}
            size={18}
            color="#4F46E5"
            strokeWidth={2.5}
          />
          <AppText style={styles.swipeText}>
            {isKu ? "بخشە سەرەوە بۆ بینینی شیکردنەوە" : "Swipe up to view analysis"}
          </AppText>
        </PressableScale>
      </View>

      {/* CONVERSATION ANALYSIS SHEET */}
      <Animated.View
        style={[styles.analysisOverlay, analysisAnim, { backgroundColor: "#FFFFFF" }]}
        pointerEvents={analysisOpen ? "auto" : "none"}
      >
        {/* Wave at top edge of bottom sheet */}
        <View style={{ position: "absolute", top: -180, left: 0, width: screenWidth, height: 180 }}>
          <Svg width={screenWidth} height={180} viewBox={`0 0 ${screenWidth} 180`} preserveAspectRatio="none">
            <Defs>
              <SvgLinearGradient id="bottomWaveGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#3B82F6" stopOpacity="0.15" />
                <Stop offset="1" stopColor="#FFFFFF" stopOpacity="1" />
              </SvgLinearGradient>
            </Defs>
            <AnimatedPath animatedProps={bottomWaveProps} fill="url(#bottomWaveGrad)" />
          </Svg>
        </View>

        <View
          style={[
            styles.analysisContainer,
            { paddingTop: insets.top + 8, paddingBottom: Math.max(insets.bottom, 16) }
          ]}
        >
          {/* Header Drag-handle */}
          <View style={styles.dragHandleArea} {...analysisCloseHandlers}>
            <View style={styles.analysisHandle} />
          </View>

          {/* Analysis Header */}
          <View style={[styles.analysisHeader, isRtl && styles.rtlRow]}>
            <AppText style={[styles.analysisHeaderTitle, isRtl && styles.rtlText]}>
              {isKu ? "شیکردنەوەی گفتوگۆکەت" : "Conversation Analysis"}
            </AppText>
            <PressableScale
              onPress={closeAnalysis}
              style={styles.analysisCloseBtn}
            >
              <HugeiconsIcon
                icon={Cancel01Icon}
                size={20}
                color={C.gray}
                strokeWidth={2.5}
              />
            </PressableScale>
          </View>

          {tutor.turns.length === 0 ? (
            <View style={styles.emptyState}>
              <AppText style={[styles.emptyText, isRtl && styles.rtlText]}>
                {isKu ? "سەرەتا گفتوگۆیەک ئەنجام بدە بۆ بینینی شیکردنەوە." : "Complete a dialogue first to view linguistic stats!"}
              </AppText>
            </View>
          ) : tutor.analysisLoading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="large" color="#4F46E5" style={{ marginBottom: 16 }} />
              <AppText style={[styles.emptyText, isRtl && styles.rtlText]}>
                {isKu ? "شیکردنەوەی دەقی گفتوگۆکە دەکرێت..." : "Analyzing conversation transcripts..."}
              </AppText>
            </View>
          ) : !analysisData ? (
            <View style={styles.emptyState}>
              <AppText style={[styles.emptyText, isRtl && styles.rtlText]}>
                {isKu ? "شیکردنەوە بەردەست نییە. تکایە دووبارە تاقیبکەرەوە." : "No analysis data compiled yet."}
              </AppText>
              <PressableScale style={[styles.vocabTag, { marginTop: 16 }]} onPress={() => tutor.runAnalysis()}>
                <AppText style={[styles.vocabTagText, isRtl && styles.rtlText]}>{isKu ? "شیکردنەوە بکە" : "Compute Analysis"}</AppText>
              </PressableScale>
            </View>
          ) : analysisData.analysisError ? (
            <View style={styles.emptyState}>
              <HugeiconsIcon icon={AlertCircleIcon} size={48} color={C.red} style={{ marginBottom: 16 }} />
              <AppText style={[styles.emptyText, isRtl && styles.rtlText, { color: C.red, fontWeight: "600" }]}>
                {analysisData.analysisError}
              </AppText>
              <PressableScale
                style={[styles.vocabTag, { marginTop: 16, flexDirection: isRtl ? "row-reverse" : "row", alignItems: "center", gap: 8 }]}
                onPress={() => tutor.runAnalysis()}
              >
                <HugeiconsIcon icon={RefreshIcon} size={16} color="#4F46E5" />
                <AppText style={[styles.vocabTagText, isRtl && styles.rtlText]}>{isKu ? "دووبارە هەوڵبدەرەوە" : "Retry"}</AppText>
              </PressableScale>
            </View>
          ) : (
            <ScrollView
              style={{ flex: 1, width: "100%" }}
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
            >
              {/* METRIC SCORE SUMMARY */}
              <View style={[styles.metricsRow, isRtl && styles.rtlRow]}>
                {/* Score */}
                <View style={styles.metricCard}>
                  <AppText style={styles.metricLabel}>{isKu ? "نمرە" : "SCORE"}</AppText>
                  <AppText style={styles.metricVal} forceLatinFont>
                    {analysisData.overallScore !== null ? `${analysisData.overallScore}%` : "—"}
                  </AppText>
                </View>

                {/* Level */}
                <View style={styles.metricCard}>
                  <AppText style={styles.metricLabel}>{isKu ? "ئاست" : "LEVEL"}</AppText>
                  <AppText style={[styles.metricVal, { fontSize: 13, textAlign: "center", marginTop: 4 }]} forceLatinFont>
                    Lv. {level}
                  </AppText>
                  <AppText style={{ fontSize: 9, color: C.gray, fontWeight: "600", textTransform: "uppercase" }}>
                    {LEVEL_CONFIGS[level]?.cefr || "A1"}
                  </AppText>
                </View>

                {/* Weak Words */}
                <View style={styles.metricCard}>
                  <AppText style={styles.metricLabel}>{isKu ? "هەڵەکان" : "MISTAKES"}</AppText>
                  <AppText style={[styles.metricVal, { color: C.red }]} forceLatinFont>
                    {analysisData.grammarErrors.length}
                  </AppText>
                </View>
              </View>

              {/* VOCABULARY HIGHLIGHTS */}
              <View style={styles.sectionWrap}>
                <AppText style={[styles.sectionHeading, isRtl && styles.rtlText]}>{isKu ? "وشە نوێیەکانی ئەم دانیشتنە" : "Vocabulary Taught this Session"}</AppText>
                <View style={[styles.vocabTagsWrap, isRtl && styles.rtlRow]}>
                  {analysisData.wordsIntroduced.length > 0 ? (
                    analysisData.wordsIntroduced.map((w: string, idx: number) => {
                      const isMastered = analysisData.wordsMastered.includes(w);
                      return (
                        <View 
                          key={idx} 
                          style={[
                            styles.vocabTag, 
                            isMastered 
                              ? { backgroundColor: "rgba(34, 197, 94, 0.08)", borderColor: "rgba(34, 197, 94, 0.2)" }
                              : { backgroundColor: "rgba(239, 68, 68, 0.08)", borderColor: "rgba(239, 68, 68, 0.2)" }
                          ]}
                        >
                          <AppText 
                            style={[
                              styles.vocabTagText,
                              isMastered ? { color: "#10B981" } : { color: C.red }
                            ]} 
                            forceLatinFont
                          >
                            {w} {isMastered ? "✓" : "✗"}
                          </AppText>
                        </View>
                      );
                    })
                  ) : (
                    <AppText style={[{ fontSize: 13, color: C.gray }, isRtl && styles.rtlText]}>
                      {isKu ? "هیچ وشەیەکی نوێ فێرنەکراوە." : "No new words introduced yet."}
                    </AppText>
                  )}
                </View>
              </View>

              {/* DIALOGUE TRANSCRIPT & RED WORD HIGHLIGHTING */}
              <View style={styles.sectionWrap}>
                <AppText style={[styles.sectionHeading, isRtl && styles.rtlText]}>{isKu ? "دەقی گفتوگۆکە" : "Linguistic Transcript"}</AppText>
                <View style={styles.transcriptLog}>
                  {tutor.turns.map((turn) => {
                    const isUser = turn.sender === "user";
                    return (
                      <View
                        key={turn.id}
                        style={[
                          styles.chatRow,
                          isUser
                            ? { justifyContent: isRtl ? "flex-start" : "flex-end" }
                            : { justifyContent: isRtl ? "flex-end" : "flex-start" }
                        ]}
                      >
                        <View
                          style={[
                            styles.bubble,
                            isUser ? styles.userBubble : styles.aiBubble,
                            isRtl && (isUser ? styles.userBubbleRtl : styles.aiBubbleRtl),
                          ]}
                        >
                          <AppText style={[isUser ? styles.userBubbleSender : styles.aiBubbleSender, isRtl && styles.rtlText]}>
                            {isUser ? (isKu ? "تۆ" : "YOU") : "TWINO"}
                          </AppText>

                          {isUser ? (
                            <AppText style={[styles.userBubbleText, isRtl && styles.rtlText]}>
                              {turn.text.split(" ").map((word: string, idx: number) => {
                                const clean = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"").toLowerCase();
                                const isTargetWord = turn.targetWord?.toLowerCase() === clean;
                                const isWrongWord = isTargetWord && turn.wordCorrect === false;
                                return (
                                  <AppText
                                    key={idx}
                                    style={isWrongWord ? { color: "#FF7B7B", fontWeight: "800" as any, textDecorationLine: "underline" } : null}
                                    forceLatinFont
                                  >
                                    {word}{" "}
                                  </AppText>
                                );
                              })}
                            </AppText>
                          ) : (
                            <AppText style={[styles.aiBubbleText, isRtl && styles.rtlText]} forceLatinFont>
                              {turn.text}
                            </AppText>
                          )}
                          <AppText style={[styles.bubbleTime, isRtl && styles.bubbleTimeRtl]}>{turn.timestamp}</AppText>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* LINGUISTIC MISTAKES & RECOMMENDATIONS */}
              {analysisData.grammarErrors.length > 0 && (
                <View style={styles.sectionWrap}>
                  <AppText style={[styles.sectionHeading, isRtl && styles.rtlText]}>{isKu ? "پێشنیارەکانی باشترکردن" : "Weak Phrases & Improvements"}</AppText>
                  {analysisData.grammarErrors.map((error, idx) => (
                    <View key={idx} style={[styles.recommendationCard, isRtl && { alignItems: "flex-end" }]}>
                      <View style={styles.recOriginal}>
                        <View style={[styles.recBadge, isRtl && styles.recBadgeRtl, { backgroundColor: "rgba(239, 68, 68, 0.1)" }]}>
                          <AppText style={[styles.recBadgeText, isRtl && styles.rtlText, { color: C.red }]}>{isKu ? "وتت" : "YOU SAID"}</AppText>
                        </View>
                        <AppText style={[styles.recOriginalText, isRtl && styles.rtlText]} forceLatinFont>
                          {`"${error.original}"`}
                        </AppText>
                      </View>
                      
                      <View style={styles.recBetter}>
                        <View style={[styles.recBadge, isRtl && styles.recBadgeRtl, { backgroundColor: "rgba(34, 197, 94, 0.1)" }]}>
                          <AppText style={[styles.recBadgeText, isRtl && styles.rtlText, { color: "#10B981" }]}>{isKu ? "باشتر وایە" : "SUGGESTION"}</AppText>
                        </View>
                        <AppText style={[styles.recBetterText, isRtl && styles.rtlText]} forceLatinFont>
                          {error.corrected}
                        </AppText>
                      </View>

                      {error.explanation ? (
                        <View style={{ marginTop: 4 }}>
                          <AppText style={[{ fontSize: 12, color: C.gray, lineHeight: 18 }, isRtl && styles.rtlText]} forceLatinFont>
                            {error.explanation}
                          </AppText>
                        </View>
                      ) : null}
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>
          )}
        </View>
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
    rtlRow: {
      flexDirection: "row-reverse",
    },
    rtlText: {
      textAlign: "right",
      writingDirection: "rtl",
    },
    topSwipeContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      alignItems: "center",
      paddingHorizontal: 24,
    },
    swipeIndicatorCol: {
      alignItems: "center",
      gap: 4,
      marginBottom: 16,
    },
    swipeText: {
      fontSize: 10,
      fontWeight: "800",
      color: "#4F46E5",
      textTransform: "uppercase",
      letterSpacing: 1.2,
    },
    topControlRow: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      justifyContent: "flex-end",
      marginTop: 4,
    },
    topicPill: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 99,
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      borderWidth: 1,
      borderColor: "rgba(26, 43, 72, 0.08)",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    topicPillText: {
      fontSize: 13,
      fontWeight: "700",
      color: C.navy,
    },
    langBadge: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(255, 107, 74, 0.1)",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "rgba(255, 107, 74, 0.25)",
    },
    langText: {
      fontSize: 13,
      color: C.blue,
    },
    main: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
    },
    orbContainer: {
      width: 240,
      height: 240,
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    orbLogoContainer: {
      width: 240,
      height: 240,
      alignItems: "center",
      justifyContent: "center",
    },
    transcriptBox: {
      width: "100%",
      minHeight: 120,
      marginTop: 36,
      alignItems: "center",
    },
    statusLabel: {
      fontSize: 12,
      color: C.gray,
      fontWeight: "800",
      letterSpacing: 1.2,
      textTransform: "uppercase",
      marginBottom: 16,
    },
    transcriptText: {
      fontSize: 22,
      fontWeight: "400",
      color: C.navy,
      textAlign: "center",
      lineHeight: 32,
      fontFamily: "DINNextRoundedRegular",
      paddingHorizontal: 20,
    },
    bottomSwipeContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      alignItems: "center",
      zIndex: 10,
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
    analysisOverlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
      zIndex: 1000,
    },
    analysisContainer: {
      flex: 1,
      backgroundColor: "rgba(255, 255, 255, 0.98)",
      overflow: "hidden",
    },
    dragHandleArea: {
      width: "100%",
      height: 36,
      alignItems: "center",
      justifyContent: "center",
    },
    analysisHandle: {
      width: 50,
      height: 6,
      borderRadius: 3,
      backgroundColor: "rgba(26, 43, 72, 0.12)",
    },
    analysisHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 24,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderColor: "rgba(26, 43, 72, 0.06)",
    },
    analysisHeaderTitle: {
      fontSize: 22,
      fontWeight: "800",
      color: C.navy,
      fontFamily: "DINNextRoundedBold",
    },
    analysisCloseBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "rgba(26, 43, 72, 0.05)",
      alignItems: "center",
      justifyContent: "center",
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 40,
    },
    emptyText: {
      fontSize: 15,
      color: C.gray,
      textAlign: "center",
      lineHeight: 24,
    },
    metricsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
      marginBottom: 28,
      gap: 12,
    },
    metricCard: {
      flex: 1,
      backgroundColor: "#FFFFFF",
      borderRadius: 20,
      paddingVertical: 18,
      alignItems: "center",
      borderWidth: 1,
      borderColor: "rgba(26, 43, 72, 0.06)",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.02,
      shadowRadius: 6,
      elevation: 2,
    },
    metricLabel: {
      fontSize: 10,
      fontWeight: "800",
      color: C.gray,
      letterSpacing: 1.1,
    },
    metricVal: {
      fontSize: 22,
      fontWeight: "800",
      color: C.blue,
      marginTop: 4,
      fontFamily: "DINNextRoundedBold",
    },
    sectionWrap: {
      width: "100%",
      marginBottom: 28,
    },
    sectionHeading: {
      fontSize: 15,
      fontWeight: "800",
      color: C.navy,
      marginBottom: 16,
      letterSpacing: 0.2,
      fontFamily: "DINNextRoundedBold",
    },
    vocabTagsWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    vocabTag: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 12,
      backgroundColor: "rgba(79, 70, 229, 0.06)",
      borderWidth: 1,
      borderColor: "rgba(79, 70, 229, 0.12)",
    },
    vocabTagText: {
      fontSize: 13,
      fontWeight: "700",
      color: "#4F46E5",
    },
    transcriptLog: {
      width: "100%",
      gap: 16,
    },
    chatRow: {
      flexDirection: "row",
      width: "100%",
    },
    bubble: {
      maxWidth: "80%",
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 12,
      position: "relative",
    },
    userBubble: {
      backgroundColor: "#4F46E5",
      borderTopRightRadius: 4,
      shadowColor: "#4F46E5",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    userBubbleRtl: {
      borderTopRightRadius: 20,
      borderTopLeftRadius: 4,
    },
    aiBubble: {
      backgroundColor: "#F3F4F6",
      borderTopLeftRadius: 4,
      borderWidth: 1,
      borderColor: "rgba(26, 43, 72, 0.04)",
    },
    aiBubbleRtl: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 4,
    },
    userBubbleSender: {
      fontSize: 8,
      fontWeight: "800",
      color: "rgba(255, 255, 255, 0.7)",
      marginBottom: 4,
      letterSpacing: 0.8,
    },
    aiBubbleSender: {
      fontSize: 8,
      fontWeight: "800",
      color: C.gray,
      marginBottom: 4,
      letterSpacing: 0.8,
    },
    userBubbleText: {
      fontSize: 15,
      color: "#FFFFFF",
      lineHeight: 22,
      fontFamily: "DINNextRoundedMedium",
    },
    aiBubbleText: {
      fontSize: 15,
      color: C.navy,
      lineHeight: 22,
      fontFamily: "DINNextRoundedMedium",
    },
    bubbleTime: {
      fontSize: 8,
      color: "rgba(0,0,0,0.25)",
      alignSelf: "flex-end",
      marginTop: 4,
    },
    bubbleTimeRtl: {
      alignSelf: "flex-start",
    },
    recommendationCard: {
      width: "100%",
      backgroundColor: "#FFFFFF",
      borderRadius: 24,
      padding: 20,
      borderWidth: 1,
      borderColor: "rgba(26, 43, 72, 0.06)",
      gap: 16,
      marginBottom: 12,
    },
    recOriginal: {
      width: "100%",
      gap: 6,
    },
    recBetter: {
      width: "100%",
      gap: 6,
    },
    recBadge: {
      alignSelf: "flex-start",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    recBadgeRtl: {
      alignSelf: "flex-end",
    },
    recBadgeText: {
      fontSize: 9,
      fontWeight: "800",
      letterSpacing: 0.8,
    },
    recOriginalText: {
      fontSize: 14,
      color: C.navy,
      fontWeight: "500",
      lineHeight: 20,
    },
    recBetterText: {
      fontSize: 14,
      color: "#10B981",
      fontWeight: "700",
      lineHeight: 20,
    },
  });
