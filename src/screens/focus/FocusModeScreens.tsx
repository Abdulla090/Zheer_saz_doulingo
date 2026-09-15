import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  BookOpen01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { FlashList } from "@shopify/flash-list";
import { Host, Switch } from "@expo/ui";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PremiumPressable } from "../../components/PremiumPressable";
import {
  MicPulseIcon,
  SettingsTuneIcon,
  WaveformIcon,
} from "../../components/icons/TwinoHomeIcons";
import { TwinoBrandMark } from "../../components/branding/twino-brand-mark";
import { AppText } from "../../components/ui/AppText";
import { tabBarScrollPadding } from "../../constants/layout";
import { Colors } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { useI18n } from "../../hooks/useI18n";
import { useLiveVoiceTutor } from "../../hooks/use-live-voice-tutor";
import { useThemeColors } from "../../hooks/useThemeColors";
import { DirectionBoundary } from "../../i18n/layout-direction";
import { useLocaleStore } from "../../stores/useLocaleStore";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { aiPrice } from "../../types/entitlements";
import { hapticImpact, hapticSelection } from "../../utils/haptics";
import { crossShadow } from "../../utils/shadows";
import { detectScriptLanguage } from "../../utils/streaming-transcript";
import { GAME_MODES } from "../games/game-modes";
import { PracticeCard } from "../games/practice-card";
import { withAlpha } from "../games/games-theme";

type ThemeColors = (typeof Colors)["light"] | (typeof Colors)["dark"];
type SessionMinutes = 5 | 10 | 15;

const BRAND_LOGO = require("../../../assets/images/logo-compressed.png");

function FocusHeader() {
  const router = useRouter();
  const { colors, isDark } = useThemeColors();
  const { t } = useI18n();
  const enabled = useSettingsStore((state) => state.focusModeEnabled);
  const setEnabled = useSettingsStore((state) => state.setFocusModeEnabled);

  return (
    <View style={styles.header}>
      <TwinoBrandMark size={40} showName nameColor={colors.foreground} nameSize={23} />
      <View style={styles.headerActions}>
        <Host matchContents colorScheme={isDark ? "dark" : "light"} seedColor={colors.primary}>
          <Switch
            value={enabled}
            onValueChange={(value: boolean) => {
              hapticSelection();
              setEnabled(value);
            }}
            label={t("focus.mode")}
          />
        </Host>
      <PremiumPressable
        accessibilityRole="button"
        accessibilityLabel={t("settings.title")}
        onPress={() => router.push("/settings" as never)}
        containerStyle={styles.settingsButtonContainer}
        style={[
          styles.settingsButton,
          {
            backgroundColor: colors.surfaceRaised,
            borderColor: colors.border,
            ...crossShadow({
              color: isDark ? "#000000" : "#64748B",
              offsetY: 6,
              blur: 16,
              opacity: isDark ? 0.24 : 0.1,
              elevation: 2,
            }),
          },
        ]}
        pressScale={0.94}
      >
        <SettingsTuneIcon size={24} color={colors.foreground} />
      </PremiumPressable>
      </View>
    </View>
  );
}

function FocusOrb({
  active,
  listening,
  speaking,
}: {
  active: boolean;
  listening: boolean;
  speaking: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const pulse = useSharedValue(0);

  useEffect(() => {
    cancelAnimation(pulse);
    if (!reducedMotion && active && (listening || speaking)) {
      pulse.set(
        withRepeat(
          withTiming(1, {
            duration: speaking ? 720 : 980,
            easing: Easing.inOut(Easing.quad),
          }),
          -1,
          true,
        ),
      );
    } else {
      pulse.set(withTiming(0, { duration: 180 }));
    }

    return () => cancelAnimation(pulse);
  }, [active, listening, pulse, reducedMotion, speaking]);

  const logoStyle = useAnimatedStyle(() => {
    const progress = pulse.get();
    return {
      opacity: active ? 0.92 + progress * 0.08 : 1,
      transform: [{ scale: 1 + progress * 0.065 }],
    };
  });

  return (
    <View style={styles.orbStage}>
      <Animated.View style={[styles.logoStage, logoStyle]}>
        <Image
          source={BRAND_LOGO}
          style={styles.logoImage}
          contentFit="contain"
          accessibilityRole="image"
          accessibilityLabel="Twino"
        />
      </Animated.View>
    </View>
  );
}

export function FocusTalkScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { t, locale, isKu, isAr } = useI18n();
  const isRtl = isKu || isAr;
  const { colors } = useThemeColors();
  const sourceLanguage = useLocaleStore((state) => state.selectedSourceLanguage) || "ku";
  const targetLanguage = useLocaleStore((state) => state.selectedTargetLanguage) || "en";
  const { billingAccount, refreshBillingAccount } = useAuth();
  const [durationMinutes, setDurationMinutes] = useState<SessionMinutes>(5);
  const [starting, setStarting] = useState(false);
  const tutor = useLiveVoiceTutor();
  const {
    error,
    listening,
    runAnalysis,
    sessionActive,
    speaking,
    startSession,
    stopAll,
    thinking,
    transcript,
    handleMicPress,
  } = tutor;
  const liveMethodsRef = useRef({ runAnalysis, stopAll });
  const sessionActiveRef = useRef(sessionActive);

  useEffect(() => {
    liveMethodsRef.current = { runAnalysis, stopAll };
    sessionActiveRef.current = sessionActive;
  }, [runAnalysis, sessionActive, stopAll]);

  useFocusEffect(
    useCallback(
      () => () => {
        if (sessionActiveRef.current) {
          void liveMethodsRef.current.runAnalysis();
        }
        liveMethodsRef.current.stopAll();
      },
      [],
    ),
  );

  const statusLabel = useMemo(() => {
    if (error) return t("voiceTutor.statusError");
    if (thinking) return t("voiceTutor.statusThinking");
    if (speaking) return t("voiceTutor.statusSpeaking");
    if (listening) return t("voiceTutor.statusListening");
    if (sessionActive) return t("voiceTutor.statusWaiting");
    return t("focus.ready");
  }, [error, listening, sessionActive, speaking, t, thinking]);

  const transcriptLanguage = useMemo(
    () => detectScriptLanguage(transcript, sourceLanguage, targetLanguage).languageCode,
    [sourceLanguage, targetLanguage, transcript],
  );

  const startOrToggleMic = useCallback(async () => {
    if (starting) return;
    hapticImpact();
    if (sessionActive) {
      handleMicPress();
      return;
    }

    setStarting(true);
    try {
      await startSession(durationMinutes);
      await refreshBillingAccount();
    } finally {
      setStarting(false);
    }
  }, [durationMinutes, handleMicPress, refreshBillingAccount, sessionActive, startSession, starting]);

  const endSession = useCallback(() => {
    if (!sessionActive) return;
    hapticImpact();
    void runAnalysis();
    stopAll();
    void refreshBillingAccount();
  }, [refreshBillingAccount, runAnalysis, sessionActive, stopAll]);

  const maxWidth = width >= 760 ? 680 : undefined;
  const balance = billingAccount?.entitlements.creditBalance;

  return (
    <DirectionBoundary direction="ltr" style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.talkScroll,
          {
            maxWidth,
            paddingTop: Math.max(insets.top, 12),
            paddingBottom: tabBarScrollPadding(insets.bottom) + 16,
          },
        ]}
      >
        <FocusHeader />

        <DirectionBoundary direction={isRtl ? "rtl" : "ltr"} style={styles.talkIntro}>
          <AppText style={[styles.talkTitle, { color: colors.foreground }]} languageCode={locale} align="center" latinRole="bold" fullWidth>
            {t("focus.talkTitle")}
          </AppText>
        </DirectionBoundary>

        {!sessionActive ? (
          <View style={styles.sessionPicker}>
            <View style={styles.durationRow}>
              {([5, 10, 15] as const).map((minutes) => {
                const selected = durationMinutes === minutes;
                const cost = aiPrice(billingAccount?.entitlements, `live_tutor_${minutes}`);
                return (
                  <Pressable
                    key={minutes}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}
                    onPress={() => {
                      hapticSelection();
                      setDurationMinutes(minutes);
                    }}
                    style={({ pressed }) => [
                      styles.durationChip,
                      {
                        backgroundColor: selected ? colors.primary : colors.surfaceRaised,
                        borderColor: selected ? colors.primary : colors.border,
                        opacity: pressed ? 0.78 : 1,
                      },
                    ]}
                  >
                    <AppText style={[styles.durationMinutes, { color: selected ? colors.onPrimary : colors.foreground }]} forceLatinFont latinRole="bold">
                      {t("focus.minutes", { count: minutes })}
                    </AppText>
                    <AppText style={[styles.durationCost, { color: selected ? colors.onPrimary : colors.mutedForeground }]} forceLatinFont>
                      {t("focus.credits", { count: cost })}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
            <AppText style={[styles.balance, { color: colors.mutedForeground }]} languageCode={locale} align="center">
              {t("focus.balance")}: {balance ?? "—"}
            </AppText>
          </View>
        ) : null}

        <FocusOrb
          active={sessionActive}
          listening={listening}
          speaking={speaking}
        />

        <DirectionBoundary direction={isRtl ? "rtl" : "ltr"} style={styles.transcriptBlock}>
          {sessionActive || error ? (
            <AppText style={[styles.status, { color: listening ? colors.primary : colors.mutedForeground }]} languageCode={locale} align="center" latinRole="bold" fullWidth>
              {statusLabel}
            </AppText>
          ) : null}
          <AppText
            style={[styles.transcript, { color: colors.foreground }]}
            languageCode={transcript ? transcriptLanguage : locale}
            align="center"
            fullWidth
            selectable={Boolean(transcript)}
          >
            {transcript || (sessionActive ? t("focus.liveHint") : t("focus.tapToStart"))}
          </AppText>
          {error ? (
            <View style={styles.errorBlock}>
              <AppText style={[styles.errorText, { color: colors.error }]} languageCode={locale} align="center" fullWidth>
                {error}
              </AppText>
              {Platform.OS !== "web" && /microphone|permission/i.test(error) ? (
                <Pressable accessibilityRole="button" onPress={() => void Linking.openSettings()} hitSlop={8}>
                  <AppText style={[styles.errorAction, { color: colors.primary }]} languageCode={locale} align="center" latinRole="bold">
                    {t("focus.openSettings")}
                  </AppText>
                </Pressable>
              ) : null}
            </View>
          ) : null}
        </DirectionBoundary>

        <View style={styles.talkActions}>
          <PremiumPressable
            accessibilityRole="button"
            accessibilityLabel={t("focus.words")}
            onPress={() => router.navigate("/dashboard" as never)}
            containerStyle={styles.sideActionContainer}
            style={[styles.sideAction, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}
            pressScale={0.94}
          >
            <HugeiconsIcon icon={BookOpen01Icon} size={23} color={colors.foreground} strokeWidth={2.1} />
          </PremiumPressable>

          <PremiumPressable
            accessibilityRole="button"
            accessibilityLabel={t("focus.talk")}
            onPress={() => void startOrToggleMic()}
            disabled={starting}
            containerStyle={styles.micButtonContainer}
            style={[styles.micButton, { backgroundColor: colors.primary }]}
            pressScale={0.94}
          >
            {starting ? (
              <ActivityIndicator color={colors.onPrimary} />
            ) : (
              <MicPulseIcon size={38} color={colors.onPrimary} />
            )}
          </PremiumPressable>

          <PremiumPressable
            accessibilityRole="button"
            accessibilityLabel={t("focus.end")}
            accessibilityState={{ disabled: !sessionActive }}
            onPress={endSession}
            disabled={!sessionActive}
            containerStyle={[styles.sideActionContainer, !sessionActive && styles.disabledAction]}
            style={[styles.sideAction, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}
            pressScale={0.94}
          >
            <View style={[styles.endGlyph, { borderColor: sessionActive ? colors.foreground : colors.mutedForeground }]} />
          </PremiumPressable>
        </View>
        <View style={styles.actionLabels}>
          <AppText style={[styles.actionLabel, { color: colors.mutedForeground }]} languageCode={locale} align="center">{t("focus.words")}</AppText>
          <AppText style={[styles.actionLabel, { color: colors.foreground }]} languageCode={locale} align="center" latinRole="bold">{t("focus.talk")}</AppText>
          <AppText style={[styles.actionLabel, { color: colors.mutedForeground }]} languageCode={locale} align="center">{t("focus.end")}</AppText>
        </View>
      </ScrollView>
    </DirectionBoundary>
  );
}

export function FocusGamesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { t, locale, isKu, isAr } = useI18n();
  const { colors, isDark } = useThemeColors();
  const isRtl = isKu || isAr;
  const forwardIcon = isRtl ? ArrowLeft01Icon : ArrowRight01Icon;
  const maxWidth = width >= 900 ? 760 : undefined;

  return (
    <DirectionBoundary direction="ltr" style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.gamesScroll,
          {
            maxWidth,
            paddingTop: Math.max(insets.top, 12),
            paddingBottom: tabBarScrollPadding(insets.bottom) + 20,
          },
        ]}
      >
        <FocusHeader />
        <DirectionBoundary direction={isRtl ? "rtl" : "ltr"} style={styles.screenHeading}>
          <AppText style={[styles.screenTitle, { color: colors.foreground }]} languageCode={locale} align="start" latinRole="bold" fullWidth>
            {t("focus.gamesTitle")}
          </AppText>
        </DirectionBoundary>

        <PremiumPressable
          accessibilityRole="button"
          accessibilityLabel={t("focus.justTalk")}
          onPress={() => router.navigate("/" as never)}
          containerStyle={styles.justTalkContainer}
          style={[
            styles.justTalk,
            isRtl && styles.rowReverse,
            {
              backgroundColor: colors.surfaceRaised,
              borderColor: withAlpha(colors.primary, isDark ? 0.4 : 0.24),
              ...crossShadow({
                color: isDark ? "#000000" : colors.primary,
                offsetY: 8,
                blur: 20,
                opacity: isDark ? 0.25 : 0.1,
                elevation: 3,
              }),
            },
          ]}
          pressScale={0.98}
        >
          <View style={[styles.justTalkIcon, { backgroundColor: withAlpha(colors.primary, isDark ? 0.2 : 0.12) }]}>
            <WaveformIcon size={28} color={colors.primary} />
          </View>
          <DirectionBoundary direction={isRtl ? "rtl" : "ltr"} style={styles.justTalkCopy}>
            <AppText style={[styles.justTalkTitle, { color: colors.foreground }]} languageCode={locale} align="start" latinRole="bold" fullWidth>
              {t("focus.justTalk")}
            </AppText>
          </DirectionBoundary>
          <HugeiconsIcon icon={forwardIcon} size={23} color={colors.primary} strokeWidth={2.4} />
        </PremiumPressable>

        <View style={styles.gameGrid}>
          {GAME_MODES.map((mode) => (
            <PracticeCard key={mode.key} mode={mode} />
          ))}
        </View>
      </ScrollView>
    </DirectionBoundary>
  );
}

const WordCard = memo(function WordCard({
  word,
  status,
  colors,
  isDark,
  index,
}: {
  word: string;
  status: string;
  colors: ThemeColors;
  isDark: boolean;
  index: number;
}) {
  const accent = index % 2 === 0 ? colors.primary : colors.secondary;
  return (
    <View style={styles.wordCell}>
      <View
        style={[
          styles.wordCard,
          {
            backgroundColor: withAlpha(accent, isDark ? 0.15 : 0.09),
            borderColor: withAlpha(accent, isDark ? 0.32 : 0.2),
          },
        ]}
      >
        <View style={[styles.wordDot, { backgroundColor: accent }]} />
        <AppText style={[styles.wordText, { color: colors.foreground }]} languageCode="en" align="start" latinRole="bold" selectable numberOfLines={2} fullWidth>
          {word}
        </AppText>
        <AppText style={[styles.wordStatus, { color: colors.mutedForeground }]} align="start" numberOfLines={1} fullWidth>
          {status}
        </AppText>
      </View>
    </View>
  );
});

export function FocusWordsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { t, locale, isKu, isAr } = useI18n();
  const { colors, isDark } = useThemeColors();
  const isRtl = isKu || isAr;
  const knownWords = useSettingsStore((state) => state.knownWords);
  const wordsInProgress = useSettingsStore((state) => state.wordsInProgress);
  const [filter, setFilter] = useState<"learned" | "learning">("learned");
  const columns = width >= 760 ? 3 : 2;
  const data = filter === "learned" ? knownWords : wordsInProgress;
  const status = t(filter === "learned" ? "focus.mastered" : "focus.savedForReview");

  const renderItem = useCallback(
    ({ item, index }: { item: string; index: number }) => (
      <WordCard word={item} status={status} colors={colors} isDark={isDark} index={index} />
    ),
    [colors, isDark, status],
  );

  const emptyTitle = t(filter === "learned" ? "focus.emptyLearnedTitle" : "focus.emptyLearningTitle");

  return (
    <DirectionBoundary direction="ltr" style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.wordsContent, { paddingTop: Math.max(insets.top, 12) }]}>
        <FocusHeader />
        <DirectionBoundary direction={isRtl ? "rtl" : "ltr"} style={styles.screenHeading}>
          <AppText style={[styles.screenTitle, { color: colors.foreground }]} languageCode={locale} align="start" latinRole="bold" fullWidth>
            {t("focus.wordsTitle")}
          </AppText>
        </DirectionBoundary>

        <View style={[styles.segmented, { backgroundColor: colors.muted }]}>
          {(["learned", "learning"] as const).map((option) => {
            const selected = filter === option;
            const count = option === "learned" ? knownWords.length : wordsInProgress.length;
            return (
              <Pressable
                key={option}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                onPress={() => {
                  hapticSelection();
                  setFilter(option);
                }}
                style={({ pressed }) => [
                  styles.segment,
                  selected && {
                    backgroundColor: colors.surfaceRaised,
                    ...crossShadow({
                      color: isDark ? "#000000" : "#64748B",
                      offsetY: 2,
                      blur: 8,
                      opacity: isDark ? 0.18 : 0.08,
                      elevation: 1,
                    }),
                  },
                  pressed && styles.segmentPressed,
                ]}
              >
                <AppText style={[styles.segmentText, { color: selected ? colors.foreground : colors.mutedForeground }]} languageCode={locale} align="center" latinRole="bold" numberOfLines={1}>
                  {t(option === "learned" ? "focus.learned" : "focus.learning")} · {count}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        <FlashList
          key={`${columns}-${filter}`}
          data={data}
          numColumns={columns}
          keyExtractor={(item) => item.toLocaleLowerCase()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 14,
            paddingTop: 18,
            paddingBottom: tabBarScrollPadding(insets.bottom) + 18,
          }}
          ListEmptyComponent={
            <DirectionBoundary direction={isRtl ? "rtl" : "ltr"} style={styles.emptyWords}>
              <View style={[styles.emptyIcon, { backgroundColor: withAlpha(colors.primary, isDark ? 0.18 : 0.1) }]}>
                <BookOpen01IconView color={colors.primary} />
              </View>
              <AppText style={[styles.emptyTitle, { color: colors.foreground }]} languageCode={locale} align="center" latinRole="bold" fullWidth>
                {emptyTitle}
              </AppText>
              <PremiumPressable
                accessibilityRole="button"
                accessibilityLabel={t("focus.startTalking")}
                onPress={() => router.navigate("/" as never)}
                containerStyle={styles.emptyButtonContainer}
                style={[styles.emptyButton, { backgroundColor: colors.primary }]}
                pressScale={0.96}
              >
                <WaveformIcon size={20} color={colors.onPrimary} />
                <AppText style={[styles.emptyButtonText, { color: colors.onPrimary }]} languageCode={locale} align="center" latinRole="bold">
                  {t("focus.startTalking")}
                </AppText>
              </PremiumPressable>
            </DirectionBoundary>
          }
        />
      </View>
    </DirectionBoundary>
  );
}

function BookOpen01IconView({ color }: { color: string }) {
  return <HugeiconsIcon icon={BookOpen01Icon} size={30} color={color} strokeWidth={2} />;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    width: "100%",
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 8, flexShrink: 1 },
  settingsButtonContainer: { width: 48, height: 48, alignSelf: "auto" },
  settingsButton: {
    flex: 1,
    borderRadius: 24,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  talkScroll: {
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 4,
    alignItems: "center",
  },
  talkIntro: { width: "100%", alignItems: "center", paddingHorizontal: 20, paddingTop: 10 },
  talkTitle: { fontSize: 30, lineHeight: 38, letterSpacing: -0.7 },
  sessionPicker: { width: "100%", alignItems: "center", paddingHorizontal: 18, paddingTop: 12, gap: 9 },
  durationRow: { width: "100%", maxWidth: 430, flexDirection: "row", gap: 8 },
  durationChip: {
    flex: 1,
    minHeight: 55,
    borderRadius: 17,
    borderCurve: "continuous",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
    gap: 1,
  },
  durationMinutes: { fontSize: 13, lineHeight: 17 },
  durationCost: { fontSize: 10, lineHeight: 14, opacity: 0.9 },
  balance: { fontSize: 12, lineHeight: 17, fontVariant: ["tabular-nums"] },
  orbStage: { width: 240, height: 240, alignItems: "center", justifyContent: "center", marginTop: 8 },
  logoStage: { width: 240, height: 240, alignItems: "center", justifyContent: "center" },
  logoImage: { width: 240, height: 240 },
  transcriptBlock: { width: "100%", minHeight: 84, alignItems: "center", paddingHorizontal: 24, gap: 8 },
  status: { fontSize: 13, lineHeight: 18 },
  transcript: { maxWidth: 560, minHeight: 48, fontSize: 20, lineHeight: 28 },
  errorBlock: { width: "100%", alignItems: "center", gap: 5 },
  errorText: { fontSize: 12, lineHeight: 17 },
  errorAction: { fontSize: 13, lineHeight: 18 },
  talkActions: {
    width: "100%",
    maxWidth: 390,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginTop: 12,
  },
  sideActionContainer: { width: 58, height: 58, alignSelf: "auto" },
  sideAction: {
    flex: 1,
    borderRadius: 29,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  micButtonContainer: { width: 82, height: 82, alignSelf: "auto" },
  micButton: {
    flex: 1,
    borderRadius: 41,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    ...crossShadow({ color: "#FF6B4A", offsetY: 10, blur: 22, opacity: 0.25, elevation: 5 }),
  },
  disabledAction: { opacity: 0.42 },
  endGlyph: { width: 23, height: 11, borderWidth: 2.2, borderRadius: 9, transform: [{ rotate: "20deg" }] },
  actionLabels: {
    width: "100%",
    maxWidth: 390,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    marginTop: 5,
  },
  actionLabel: { width: 90, fontSize: 12, lineHeight: 17 },
  gamesScroll: { width: "100%", alignSelf: "center", paddingHorizontal: 20 },
  screenHeading: { width: "100%", paddingTop: 20 },
  screenTitle: { fontSize: 32, lineHeight: 39, letterSpacing: -0.7 },
  justTalkContainer: { marginTop: 18 },
  justTalk: {
    minHeight: 78,
    borderRadius: 24,
    borderCurve: "continuous",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    padding: 16,
  },
  rowReverse: { flexDirection: "row-reverse" },
  justTalkIcon: { width: 52, height: 52, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  justTalkCopy: { flex: 1, minWidth: 0 },
  justTalkTitle: { fontSize: 18, lineHeight: 23 },
  gameGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, paddingTop: 18 },
  wordsContent: { flex: 1, width: "100%", maxWidth: 900, alignSelf: "center" },
  segmented: { marginHorizontal: 20, marginTop: 18, borderRadius: 16, borderCurve: "continuous", padding: 4, flexDirection: "row", gap: 4 },
  segment: { flex: 1, minHeight: 44, borderRadius: 13, borderCurve: "continuous", alignItems: "center", justifyContent: "center", paddingHorizontal: 8 },
  segmentPressed: { opacity: 0.76 },
  segmentText: { fontSize: 13, lineHeight: 18 },
  wordCell: { flex: 1, paddingHorizontal: 6, paddingBottom: 12 },
  wordCard: { minHeight: 138, borderRadius: 24, borderCurve: "continuous", borderWidth: 1, padding: 16, justifyContent: "flex-end", gap: 5 },
  wordDot: { width: 9, height: 9, borderRadius: 5, marginBottom: "auto" },
  wordText: { fontSize: 19, lineHeight: 25 },
  wordStatus: { fontSize: 11, lineHeight: 15 },
  emptyWords: { minHeight: 330, alignItems: "center", justifyContent: "center", paddingHorizontal: 30, gap: 9 },
  emptyIcon: { width: 68, height: 68, borderRadius: 24, borderCurve: "continuous", alignItems: "center", justifyContent: "center", marginBottom: 5 },
  emptyTitle: { fontSize: 21, lineHeight: 27 },
  emptyButtonContainer: { marginTop: 12 },
  emptyButton: { minHeight: 50, borderRadius: 17, borderCurve: "continuous", paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9 },
  emptyButtonText: { fontSize: 14, lineHeight: 19 },
});
