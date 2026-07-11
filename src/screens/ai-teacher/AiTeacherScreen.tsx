/* eslint-disable */
import { AppText } from "../../components/ui/AppText";
import {
  HomeMeshBackground,
  HomePalette as C,
} from "../../components/ui/ios-liquid-home";
import { AI_TEACHER_PROMPTS } from "../../data/ai-teacher-prompts";
import type {
  AiTeacherAttempt,
  AiTeacherMode,
  AiTeacherPrompt,
  AiTeacherResult,
} from "../../data/ai-teacher-types";
import { MicCaptureOrb } from "../../components/voice/MicCaptureOrb";
import { useSpeechCapture } from "../../hooks/use-speech-capture";
import { useI18n } from "../../hooks/useI18n";
import { evaluateEnglish } from "../../services/ai-teacher-service";
import { PATH_LIST_REMOVE_CLIPPED } from "../../utils/native-perf";
import { appStorage } from "../../lib/app-storage";
import { hapticImpact, hapticNotification } from "../../utils/haptics";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { PressableScale } from "../../components/animations";
// @ts-expect-error No type declarations for hugeicons cjs paths
import { HugeiconsIcon } from "@hugeicons/react-native/dist/cjs/index.js";
// @ts-expect-error No type declarations for hugeicons cjs paths
import { ArrowLeft01Icon, RobotIcon } from "@hugeicons/core-free-icons/dist/cjs/index.js";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Colors = {
  background: C.meshBottom,
  foreground: C.navy,
  primary: C.navy,
  accent: C.coral,
  secondary: "rgba(255,255,255,0.78)",
  mutedForeground: C.gray,
  border: "rgba(26,43,72,0.08)",
  borderStrong: "rgba(26,43,72,0.12)",
  card: "rgba(255,255,255,0.86)",
  cardSurface: "rgba(255,255,255,0.86)",
  warmBg: "rgba(255,98,84,0.12)",
  chart1: C.blue,
  destructive: "#EF4444",
  track: "rgba(26,43,72,0.1)",
};

const HISTORY_KEY = "twino.ai-teacher.last-attempt";

const DEMO_RESULT: AiTeacherResult = {
  overallBand: 6.5,
  criteria: [
    {
      key: "fluency",
      label: "Fluency & coherence",
      band: 6.5,
      note: "Ideas flow logically with only occasional hesitation.",
    },
    {
      key: "lexical",
      label: "Lexical resource",
      band: 6,
      note: "Good topic vocabulary; a few word-choice upgrades possible.",
    },
    {
      key: "grammar",
      label: "Grammatical range",
      band: 7,
      note: "Mix of simple and complex structures with minor slips.",
    },
    {
      key: "pronunciation",
      label: "Pronunciation",
      band: 6.5,
      note: "Generally clear; stress patterns could be more natural.",
    },
  ],
  strengths: [
    "Clear main idea with relevant supporting points.",
    "Uses linking phrases to connect sentences.",
  ],
  improvements: [
    "Add a concrete example to strengthen your argument.",
    "Vary intonation on key words in speaking mode.",
  ],
  sampleRewrite:
    "My hometown is a medium-sized city in the mountains. I enjoy the fresh air and friendly community, though I would improve public transport for students.",
};

type Phase = "input" | "loading" | "results";

function BrandCard({
  children,
  style,
  contentStyle,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.surfaceCard, style]}>
      <View style={contentStyle}>{children}</View>
    </View>
  );
}

function BrandPrimaryButton({
  label,
  onPress,
  style,
  disabled,
}: {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}) {
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      style={[styles.primaryBtn, style, disabled && styles.primaryBtnDisabled]}
      scaleDown={0.96}
    >
      <AppText style={styles.primaryBtnText} forceLatinFont latinRole="bold">
        {label}
      </AppText>
    </PressableScale>
  );
}

export function AiTeacherScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, locale, isKu } = useI18n();
  const isRtl = isKu || locale === "ar";
  const params = useLocalSearchParams<{ demo?: string }>();
  const isDemo = params.demo === "results";
  const directionStyle = useMemo(
    () => ({
      textAlign: isRtl ? "right" : "left",
      writingDirection: isRtl ? "rtl" : "ltr",
    }) as const,
    [isRtl],
  );

  const [mode, setMode] = useState<AiTeacherMode>("speaking");
  const [prompt, setPrompt] = useState<AiTeacherPrompt>(AI_TEACHER_PROMPTS[0]);
  const [answer, setAnswer] = useState("");
  const [phase, setPhase] = useState<Phase>(isDemo ? "results" : "input");
  const [result, setResult] = useState<AiTeacherResult | null>(
    isDemo ? DEMO_RESULT : null,
  );
  const [lastSaved, setLastSaved] = useState<AiTeacherAttempt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showTyping, setShowTyping] = useState(false);
  const speech = useSpeechCapture("en-US");

  const promptsForMode = useMemo(
    () => AI_TEACHER_PROMPTS.filter((p) => p.mode === mode),
    [mode],
  );

  useEffect(() => {
    appStorage
      .getItem(HISTORY_KEY)
      .then((raw) => {
        if (raw) setLastSaved(JSON.parse(raw) as AiTeacherAttempt);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (
      promptsForMode.length &&
      !promptsForMode.find((p) => p.id === prompt.id)
    ) {
      setPrompt(promptsForMode[0]);
    }
  }, [mode, promptsForMode, prompt.id]);

  useEffect(() => {
    if (mode !== "speaking") {
      speech.abort();
      setShowTyping(false);
    }
  }, [mode, speech]);

  const onSubmit = useCallback(async () => {
    const text = answer.trim();
    if (text.length < 12) {
      setError(t("aiTeacher.minAnswer"));
      return;
    }
    setError(null);
    setPhase("loading");
    hapticImpact(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const evaluation = await evaluateEnglish({
        text,
        mode,
        promptId: prompt.id,
      });
      setResult(evaluation);
      setPhase("results");
    } catch {
      setError("Could not check your English right now. Try again.");
      setPhase("input");
    }
  }, [answer, mode, prompt.id, t]);

  const onSave = useCallback(async () => {
    if (!result) return;
    const attempt: AiTeacherAttempt = {
      ...result,
      id: String(Date.now()),
      savedAt: new Date().toISOString(),
      mode,
      promptId: prompt.id,
      excerpt: answer.trim().slice(0, 120),
    };
    await appStorage.setItem(HISTORY_KEY, JSON.stringify(attempt));
    setLastSaved(attempt);
    hapticNotification(Haptics.NotificationFeedbackType.Success);
  }, [answer, mode, prompt.id, result]);

  const onTryAgain = useCallback(() => {
    setPhase("input");
    setResult(null);
    setAnswer("");
    setError(null);
    setShowTyping(false);
    speech.abort();
  }, [speech]);

  const toggleMic = useCallback(async () => {
    if (speech.listening) {
      speech.stop();
      return;
    }
    if (!speech.available) {
      setError("Speech recognition is not available on this device.");
      return;
    }
    setError(null);
    await speech.start(
      {
        onResult: (text, isFinal) => {
          if (!isFinal) {
            setAnswer(text);
            return;
          }
          setAnswer((prev) => {
            const next = text.trim();
            if (!prev.trim()) return next;
            if (prev.endsWith(next) || next.startsWith(prev)) return next;
            return `${prev.trimEnd()} ${next}`;
          });
        },
      },
      { continuous: true },
    );
  }, [speech]);

  return (
    <View style={styles.root}>
      <HomeMeshBackground />
      <KeyboardAwareScrollView
        style={styles.flex}
        bottomOffset={insets.bottom + 20}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={PATH_LIST_REMOVE_CLIPPED}
        contentContainerStyle={{
          paddingTop: Math.max(insets.top, 20),
          paddingBottom: insets.bottom + 32,
          paddingHorizontal: 24,
          direction: isRtl ? "rtl" : "ltr",
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.topBar,
            { flexDirection: "row" },
          ]}
        >
          <PressableScale
            onPress={() => router.back()}
            style={styles.backBtn}
            scaleDown={0.9}
          >
            <View style={{ transform: [{ scaleX: isRtl ? -1 : 1 }] }}>
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                size={22}
                color={Colors.foreground}
                strokeWidth={2.5}
              />
            </View>
          </PressableScale>
          <View
            style={[
              styles.topTitles,
              { alignItems: isRtl ? "flex-end" : "flex-start" },
            ]}
          >
            <AppText
              style={[styles.pageTitle, directionStyle]}
              forceKurdishFont={isKu}
              latinRole="bold"
            >
              {t("aiTeacher.title")}
            </AppText>
            <AppText
              style={[styles.pageSub, directionStyle]}
              forceKurdishFont={isKu}
              latinRole="medium"
            >
              {t("aiTeacher.subtitle")}
            </AppText>
          </View>
        </View>

        {phase === "results" && result ? (
          <ResultsView
            result={result}
            onTryAgain={onTryAgain}
            onSave={onSave}
            isRtl={isRtl}
          />
        ) : (
          <>
            <View
              style={[
                styles.modeRow,
                { flexDirection: isRtl ? "row-reverse" : "row" },
              ]}
            >
              {(
                (isRtl
                  ? ["writing", "speaking"]
                  : ["speaking", "writing"]) as AiTeacherMode[]
              ).map((m) => (
                <PressableScale
                  key={m}
                  onPress={() => setMode(m)}
                  style={[styles.modeChip, mode === m && styles.modeChipOn]}
                  scaleDown={0.96}
                >
                  <AppText
                    style={[
                      styles.modeChipText,
                      mode === m && styles.modeChipTextOn,
                    ]}
                    forceLatinFont
                    latinRole="bold"
                  >
                    {m === "speaking"
                      ? t("aiTeacher.speaking")
                      : t("aiTeacher.writing")}
                  </AppText>
                </PressableScale>
              ))}
            </View>

            <AppText
              style={[styles.sectionTitle, directionStyle]}
              forceKurdishFont={isKu}
              latinRole="bold"
            >
              {t("aiTeacher.choosePrompt")}
            </AppText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[
                styles.promptScroll,
                { flexDirection: isRtl ? "row-reverse" : "row" },
              ]}
            >
              {(isRtl ? [...promptsForMode].reverse() : promptsForMode).map(
                (p) => (
                  <PressableScale
                    key={p.id}
                    onPress={() => setPrompt(p)}
                    style={[
                      styles.promptCard,
                      prompt.id === p.id && styles.promptCardOn,
                    ]}
                    scaleDown={0.96}
                  >
                    <AppText
                      style={[
                        styles.promptTitle,
                        { textAlign: isRtl ? "right" : "left" },
                      ]}
                      forceLatinFont
                      latinRole="bold"
                    >
                      {p.title}
                    </AppText>
                  </PressableScale>
                ),
              )}
            </ScrollView>

            <BrandCard
              style={styles.taskCard}
              contentStyle={styles.taskCardInner}
            >
              <AppText
                style={[styles.promptScenarioLabel, directionStyle]}
                forceKurdishFont={isKu}
                latinRole="bold"
              >
                {t("aiTeacher.yourTask")}
              </AppText>
              <AppText
                style={[styles.promptScenario, directionStyle]}
                forceLatinFont
                latinRole="medium"
              >
                {prompt.scenario}
              </AppText>
            </BrandCard>

            <AppText
              style={[styles.sectionTitle, directionStyle]}
              forceKurdishFont={isKu}
              latinRole="bold"
            >
              {t("aiTeacher.yourAnswer")}
            </AppText>
            {mode === "speaking" && !showTyping ? (
              <BrandCard contentStyle={styles.speakingMicBlock}>
                <MicCaptureOrb
                  listening={speech.listening}
                  disabled={phase === "loading"}
                  color={speech.listening ? Colors.accent : Colors.foreground}
                  size={112}
                  hint={
                    speech.listening
                      ? t("aiTeacher.tapMicStop")
                      : t("aiTeacher.tapMicSpeak")
                  }
                  onPress={toggleMic}
                />
                {answer.trim().length > 0 ? (
                  <AppText style={[styles.speakingTranscript, directionStyle]} forceLatinFont>
                    {answer}
                  </AppText>
                ) : null}
                <PressableScale
                  onPress={() => setShowTyping(true)}
                  style={styles.typeInsteadBtn}
                  scaleDown={0.96}
                >
                  <AppText
                    style={styles.typeInsteadText}
                    forceLatinFont
                    latinRole="bold"
                  >
                    {t("aiTeacher.typeInstead")}
                  </AppText>
                </PressableScale>
              </BrandCard>
            ) : (
              <BrandCard contentStyle={styles.inputShell}>
                <TextInput
                  value={answer}
                  onChangeText={setAnswer}
                  placeholder={
                    mode === "speaking"
                      ? t("aiTeacher.typeSpeaking")
                      : t("aiTeacher.typeWriting")
                  }
                  placeholderTextColor={Colors.mutedForeground}
                  multiline
                  style={[
                    styles.textInput,
                    directionStyle,
                  ]}
                  editable={phase !== "loading"}
                />
                {mode === "speaking" ? (
                  <PressableScale
                    onPress={() => setShowTyping(false)}
                    style={[
                      styles.typeInsteadBtnInline,
                      { alignSelf: isRtl ? "flex-end" : "flex-start" },
                    ]}
                    scaleDown={0.96}
                  >
                    <AppText
                      style={styles.typeInsteadText}
                      forceLatinFont
                      latinRole="bold"
                    >
                      {t("aiTeacher.useMic")}
                    </AppText>
                  </PressableScale>
                ) : null}
              </BrandCard>
            )}

            {error || speech.error ? (
              <AppText
                style={[styles.errorText, directionStyle]}
                forceKurdishFont={isKu}
                latinRole="medium"
              >
                {error || speech.error}
              </AppText>
            ) : null}

            {phase === "loading" ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator color={Colors.accent} size="large" />
                <AppText
                style={[styles.loadingText, directionStyle]}
                forceKurdishFont={isKu}
                latinRole="medium"
              >
                  {t("aiTeacher.checking")}
                </AppText>
              </View>
            ) : (
              <BrandPrimaryButton
                label={t("aiTeacher.checkEnglish")}
                onPress={onSubmit}
                style={styles.submitBtn}
              />
            )}

            {lastSaved ? (
              <BrandCard
                style={styles.historyCard}
                contentStyle={styles.historyInner}
              >
                <AppText
                style={[styles.historyLabel, directionStyle]}
                forceKurdishFont={isKu}
                latinRole="bold"
              >
                  {isKu ? "دواین ھەوڵی پاشەکەوتکراو" : "Last saved attempt"}
                </AppText>
                <AppText
                style={[styles.historyBand, directionStyle]}
                forceKurdishFont={isKu}
                latinRole="bold"
              >
                  {isKu
                    ? `باند ${lastSaved.overallBand} · ${lastSaved.mode === "speaking" ? "قسەکردن" : "نووسین"}`
                    : `Band ${lastSaved.overallBand} · ${lastSaved.mode}`}
                </AppText>
                <AppText
                  style={[styles.historyExcerpt, directionStyle]}
                  numberOfLines={2}
                  forceLatinFont
                >
                  {lastSaved.excerpt}
                </AppText>
              </BrandCard>
            ) : null}
          </>
        )}
      </KeyboardAwareScrollView>
    </View>
  );
}

function ResultsView({
  result,
  onTryAgain,
  onSave,
  isRtl,
}: {
  result: AiTeacherResult;
  onTryAgain: () => void;
  onSave: () => void;
  isRtl: boolean;
}) {
  const { isKu } = useI18n();
  const directionStyle = {
    textAlign: isRtl ? "right" : "left",
    writingDirection: isRtl ? "rtl" : "ltr",
  } as const;
  return (
    <Animated.View entering={FadeInDown.duration(320)}>
      <BrandCard contentStyle={styles.overallCard}>
        <View style={styles.overallBadge}>
          <HugeiconsIcon
            icon={RobotIcon}
            size={18}
            color={Colors.foreground}
            strokeWidth={2.0}
          />
          <AppText
            style={styles.overallBadgeText}
            forceLatinFont
            latinRole="bold"
          >
            AI TEACHER
          </AppText>
        </View>
        <AppText style={[styles.overallLabel, { textAlign: "center" }]} forceKurdishFont={isKu} latinRole="bold">
          {isKu ? "نمرەی گشتی پێشبینیکراو" : "Overall indicative band"}
        </AppText>
        <AppText style={styles.overallBand} forceLatinFont latinRole="bold">
          {result.overallBand}
        </AppText>
        <AppText style={[styles.overallHint, { textAlign: "center" }]} forceKurdishFont={isKu} latinRole="medium">
          {isKu ? "لە دەوری ٩.٠ (شێوازی IELTS)" : "Out of 9.0 (IELTS-style)"}
        </AppText>
      </BrandCard>

      <AppText
        style={[styles.sectionTitle, directionStyle]}
        forceKurdishFont={isKu}
        latinRole="bold"
      >
        {isKu ? "پێوەرەکان" : "Criteria"}
      </AppText>
      {result.criteria.map((c) => (
        <View key={c.key} style={styles.criterionCard}>
          <View
            style={[
              styles.criterionTop,
              { flexDirection: isRtl ? "row-reverse" : "row" },
            ]}
          >
            <AppText
              style={[
                styles.criterionLabel,
                {
                  textAlign: isRtl ? "right" : "left",
                  writingDirection: isRtl ? "rtl" : "ltr",
                  paddingRight: isRtl ? 0 : 8,
                  paddingLeft: isRtl ? 8 : 0,
                },
              ]}
              forceLatinFont
              latinRole="bold"
            >
              {c.label}
            </AppText>
            <AppText
              style={styles.criterionBand}
              forceLatinFont
              latinRole="bold"
            >
              {c.band}
            </AppText>
          </View>
          <View style={styles.bandTrack}>
            <View
              style={[styles.bandFill, { width: `${(c.band / 9) * 100}%` }]}
            />
          </View>
          <AppText
            style={[
              styles.criterionNote,
              directionStyle,
            ]}
            forceLatinFont
            latinRole="medium"
          >
            {c.note}
          </AppText>
        </View>
      ))}

      <AppText
        style={[styles.sectionTitle, directionStyle]}
        forceKurdishFont={isKu}
        latinRole="bold"
      >
        {isKu ? "خاڵە بەهێزەکان" : "Strengths"}
      </AppText>
      <BrandCard contentStyle={styles.bulletCard}>
        {result.strengths.map((s) => (
          <AppText
            key={s}
            style={[styles.bullet, directionStyle]}
            forceLatinFont
            latinRole="medium"
          >
            • {s}
          </AppText>
        ))}
      </BrandCard>

      <AppText
        style={[styles.sectionTitle, directionStyle]}
        forceKurdishFont={isKu}
        latinRole="bold"
      >
        {isKu ? "خاڵەکان بۆ باشترکردن" : "To improve"}
      </AppText>
      <BrandCard contentStyle={styles.bulletCard}>
        {result.improvements.map((s) => (
          <AppText
            key={s}
            style={[styles.bullet, directionStyle]}
            forceLatinFont
            latinRole="medium"
          >
            • {s}
          </AppText>
        ))}
      </BrandCard>

      {result.sampleRewrite ? (
        <>
          <AppText
            style={[
              styles.sectionTitle,
              directionStyle,
            ]}
            forceKurdishFont={isKu}
            latinRole="bold"
          >
            {isKu ? "نموونەی نووسینی باشترکراو" : "Sample upgrade"}
          </AppText>
          <BrandCard contentStyle={styles.rewriteCard}>
            <AppText
              style={[
                styles.rewriteText,
                directionStyle,
              ]}
              forceLatinFont
              latinRole="medium"
            >
              {result.sampleRewrite}
            </AppText>
          </BrandCard>
        </>
      ) : null}

      <BrandPrimaryButton
        label={isKu ? "پاشەکەوتکردنی هەوڵدانەکە" : "Save attempt"}
        onPress={onSave}
        style={styles.actionBtn}
      />
      <PressableScale
        onPress={onTryAgain}
        style={styles.secondaryBtn}
        scaleDown={0.96}
      >
        <AppText
          style={styles.secondaryBtnText}
          forceLatinFont
          latinRole="bold"
        >
          {isKu ? "دووبارە هەوڵبدەرەوە" : "Try again"}
        </AppText>
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 28,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  topTitles: {
    flex: 1,
    gap: 4,
  },
  pageTitle: {
    fontSize: 30,
    color: Colors.foreground,
    letterSpacing: -0.5,
  },
  pageSub: {
    fontSize: 14,
    color: Colors.mutedForeground,
  },
  modeRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  modeChip: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 99,
    backgroundColor: Colors.cardSurface,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    alignItems: "center",
  },
  modeChipOn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  modeChipText: {
    fontSize: 15,
    color: Colors.mutedForeground,
  },
  modeChipTextOn: {
    color: "#FFFFFF",
  },
  sectionTitle: {
    fontSize: 18,
    color: Colors.foreground,
    marginBottom: 12,
    marginTop: 4,
  },
  promptScroll: {
    gap: 12,
    paddingBottom: 16,
  },
  promptCard: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: Colors.cardSurface,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    maxWidth: 220,
  },
  promptCardOn: {
    borderColor: "rgba(255, 112, 81, 0.45)",
    backgroundColor: Colors.warmBg,
  },
  promptTitle: {
    fontSize: 14,
    color: Colors.foreground,
  },
  taskCard: {
    marginBottom: 20,
  },
  taskCardInner: {
    padding: 20,
    gap: 8,
  },
  promptScenarioLabel: {
    fontSize: 11,
    color: Colors.accent,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  promptScenario: {
    fontSize: 16,
    color: Colors.foreground,
    lineHeight: 24,
  },
  surfaceCard: {
    backgroundColor: Colors.cardSurface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 24,
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  inputShell: {
    minHeight: 140,
    padding: 16,
  },
  textInput: {
    minHeight: 100,
    fontSize: 16,
    color: Colors.foreground,
    fontFamily: "DINNextRoundedRegular",
    textAlignVertical: "top",
  },
  speakingMicBlock: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 12,
    marginBottom: 4,
  },
  speakingTranscript: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.foreground,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  typeInsteadBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  typeInsteadBtnInline: {
    alignSelf: "flex-start",
    paddingTop: 8,
  },
  typeInsteadText: {
    fontSize: 14,
    color: Colors.accent,
  },
  errorText: {
    color: Colors.destructive,
    fontSize: 14,
    marginTop: 8,
  },
  loadingBox: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    color: Colors.mutedForeground,
  },
  primaryBtn: {
    width: "100%",
    backgroundColor: C.blue,
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.blue,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  primaryBtnDisabled: {
    opacity: 0.6,
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  submitBtn: {
    marginTop: 16,
  },
  historyCard: {
    marginTop: 20,
  },
  historyInner: {
    padding: 20,
    gap: 6,
  },
  historyLabel: {
    fontSize: 11,
    color: Colors.mutedForeground,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  historyBand: {
    fontSize: 18,
    color: Colors.chart1,
  },
  historyExcerpt: {
    fontSize: 15,
    color: Colors.mutedForeground,
    lineHeight: 22,
  },
  tipCard: {
    marginTop: 20,
  },
  tipStrip: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 16,
  },
  tipIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: Colors.mutedForeground,
    lineHeight: 21,
  },
  overallCard: {
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 20,
    marginBottom: 8,
    gap: 6,
  },
  overallBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    marginBottom: 8,
  },
  overallBadgeText: {
    fontSize: 10,
    color: Colors.foreground,
    letterSpacing: 1.2,
  },
  overallLabel: {
    fontSize: 11,
    color: Colors.mutedForeground,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  overallBand: {
    fontSize: 56,
    color: Colors.foreground,
    lineHeight: 60,
  },
  overallHint: {
    fontSize: 14,
    color: Colors.mutedForeground,
  },
  criterionCard: {
    backgroundColor: Colors.cardSurface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  criterionTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  criterionLabel: {
    fontSize: 15,
    color: Colors.foreground,
    flex: 1,
    paddingRight: 8,
  },
  criterionBand: {
    fontSize: 20,
    color: Colors.chart1,
  },
  bandTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.track,
    marginTop: 12,
    overflow: "hidden",
  },
  bandFill: {
    height: "100%",
    backgroundColor: Colors.accent,
    borderRadius: 3,
  },
  criterionNote: {
    fontSize: 14,
    color: Colors.mutedForeground,
    marginTop: 10,
    lineHeight: 20,
  },
  bulletCard: {
    padding: 16,
    gap: 8,
    marginBottom: 8,
  },
  bullet: {
    fontSize: 15,
    color: Colors.foreground,
    lineHeight: 22,
  },
  rewriteCard: {
    padding: 16,
    marginBottom: 8,
  },
  rewriteText: {
    fontSize: 15,
    color: Colors.foreground,
    fontStyle: "italic",
    lineHeight: 22,
  },
  actionBtn: {
    marginTop: 12,
  },
  secondaryBtn: {
    alignItems: "center",
    paddingVertical: 16,
  },
  secondaryBtnText: {
    fontSize: 16,
    color: Colors.accent,
  },
});
