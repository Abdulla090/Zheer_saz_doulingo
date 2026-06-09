/* eslint-disable */
import { DolphinFlat } from "../../components/icons/HomeDashboardIcons";
import { AppText } from "../../components/ui/AppText";
import {
  HomeLiquidButton,
  HomeLiquidCard,
  HomeMeshBackground,
  HomePalette,
  HomeType,
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
import { crossShadow } from "../../utils/shadows";
import { appStorage } from "../../lib/app-storage";
import { hapticImpact, hapticNotification } from "../../utils/haptics";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const C = HomePalette;
const HISTORY_KEY = "phingo.ai-teacher.last-attempt";

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

export function AiTeacherScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, isKu } = useI18n();
  const params = useLocalSearchParams<{ demo?: string }>();
  const isDemo = params.demo === "results";

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
    appStorage.getItem(HISTORY_KEY)
      .then((raw) => {
        if (raw) setLastSaved(JSON.parse(raw) as AiTeacherAttempt);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (promptsForMode.length && !promptsForMode.find((p) => p.id === prompt.id)) {
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
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 32,
          paddingHorizontal: 20,
        }}
        keyboardShouldPersistTaps="handled"
      >
          <View style={[styles.topBar, { flexDirection: isKu ? "row-reverse" : "row" }]}>
            <Pressable
              onPress={() => router.back()}
              style={styles.backBtn}
              hitSlop={12}
            >
              <View style={{ transform: [{ scaleX: isKu ? -1 : 1 }] }}>
                <ArrowLeft size={22} color={C.navy} strokeWidth={2.5} />
              </View>
            </Pressable>
            <View style={styles.topTitles}>
              <AppText style={styles.pageTitle} forceKurdishFont={isKu}>{t("aiTeacher.title")}</AppText>
              <AppText style={styles.pageSub} forceKurdishFont={isKu}>{t("aiTeacher.subtitle")}</AppText>
            </View>
            <View style={styles.backSpacer} />
          </View>

          {phase === "results" && result ? (
            <ResultsView
              result={result}
              onTryAgain={onTryAgain}
              onSave={onSave}
            />
          ) : (
            <>
              <View style={[styles.modeRow, { flexDirection: isKu ? "row-reverse" : "row" }]}>
                {((isKu ? ["writing", "speaking"] : ["speaking", "writing"]) as AiTeacherMode[]).map((m) => (
                  <Pressable
                    key={m}
                    onPress={() => setMode(m)}
                    style={[styles.modeChip, mode === m && styles.modeChipOn]}
                  >
                    <AppText
                      style={[
                        styles.modeChipText,
                        mode === m && styles.modeChipTextOn,
                      ]}
                      forceKurdishFont={isKu}
                    >
                      {m === "speaking" ? t("aiTeacher.speaking") : t("aiTeacher.writing")}
                    </AppText>
                  </Pressable>
                ))}
              </View>

              <AppText style={styles.sectionTitle} forceKurdishFont={isKu}>{t("aiTeacher.choosePrompt")}</AppText>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[styles.promptScroll, { flexDirection: isKu ? "row-reverse" : "row" }]}
              >
                {(isKu ? [...promptsForMode].reverse() : promptsForMode).map((p) => (
                  <Pressable
                    key={p.id}
                    onPress={() => setPrompt(p)}
                    style={[
                      styles.promptCard,
                      prompt.id === p.id && styles.promptCardOn,
                    ]}
                  >
                    <AppText style={styles.promptTitle} forceKurdishFont={isKu}>{p.title}</AppText>
                  </Pressable>
                ))}
              </ScrollView>

              <View style={[styles.promptStrip, { alignItems: isKu ? "flex-end" : "flex-start" }]}>
                <AppText style={styles.promptScenarioLabel} forceKurdishFont={isKu}>{t("aiTeacher.yourTask")}</AppText>
                <AppText style={[styles.promptScenario, { textAlign: isKu ? "right" : "left" }]} forceKurdishFont={isKu}>{prompt.scenario}</AppText>
              </View>

              <AppText style={styles.sectionTitle} forceKurdishFont={isKu}>{t("aiTeacher.yourAnswer")}</AppText>
              {mode === "speaking" && !showTyping ? (
                <View style={styles.speakingMicBlock}>
                  <MicCaptureOrb
                    listening={speech.listening}
                    disabled={phase === "loading"}
                    color={speech.listening ? C.blue : C.navy}
                    size={112}
                    hint={
                      speech.listening
                        ? t("aiTeacher.tapMicStop")
                        : t("aiTeacher.tapMicSpeak")
                    }
                    onPress={toggleMic}
                  />
                  {answer.trim().length > 0 ? (
                    <AppText style={styles.speakingTranscript} forceLatinFont>{answer}</AppText>
                  ) : null}
                  <Pressable
                    onPress={() => setShowTyping(true)}
                    style={styles.typeInsteadBtn}
                  >
                    <AppText style={styles.typeInsteadText} forceKurdishFont={isKu}>{t("aiTeacher.typeInstead")}</AppText>
                  </Pressable>
                </View>
              ) : (
                <View style={styles.inputShell}>
                  <TextInput
                    value={answer}
                    onChangeText={setAnswer}
                    placeholder={
                      mode === "speaking"
                        ? t("aiTeacher.typeSpeaking")
                        : t("aiTeacher.typeWriting")
                    }
                    placeholderTextColor={C.grayLight}
                    multiline
                    style={[styles.textInput, { textAlign: isKu ? "right" : "left" }]}
                    editable={phase !== "loading"}
                  />
                  {mode === "speaking" ? (
                    <Pressable
                      onPress={() => setShowTyping(false)}
                      style={[styles.typeInsteadBtnInline, { alignSelf: isKu ? "flex-end" : "flex-start" }]}
                    >
                      <AppText style={styles.typeInsteadText} forceKurdishFont={isKu}>{t("aiTeacher.useMic")}</AppText>
                    </Pressable>
                  ) : null}
                </View>
              )}

              {error || speech.error ? (
                <AppText style={styles.errorText} forceKurdishFont={isKu}>{error || speech.error}</AppText>
              ) : null}

              {phase === "loading" ? (
                <View style={styles.loadingBox}>
                  <ActivityIndicator color={C.blue} size="large" />
                  <AppText style={styles.loadingText} forceKurdishFont={isKu}>{t("aiTeacher.checking")}</AppText>
                </View>
              ) : (
                <HomeLiquidButton
                  label={t("aiTeacher.checkEnglish")}
                  onPress={onSubmit}
                  style={styles.submitBtn}
                />
              )}

              {lastSaved ? (
                <HomeLiquidCard
                  style={styles.historyCard}
                  contentStyle={styles.historyInner}
                >
                  <AppText style={styles.historyLabel} forceKurdishFont={isKu}>{isKu ? "دواین ھەوڵی پاشەکەوتکراو" : "Last saved attempt"}</AppText>
                  <AppText style={styles.historyBand} forceKurdishFont={isKu}>
                    {isKu ? `باند ${lastSaved.overallBand} · ${lastSaved.mode === "speaking" ? "خوێندنەوە" : "نووسین"}` : `Band ${lastSaved.overallBand} · ${lastSaved.mode}`}
                  </AppText>
                  <AppText style={styles.historyExcerpt} numberOfLines={2} forceLatinFont>
                    {lastSaved.excerpt}
                  </AppText>
                </HomeLiquidCard>
              ) : null}

              <View style={[styles.tipStrip, { flexDirection: isKu ? "row-reverse" : "row" }]}>
                <DolphinFlat width={48} height={48} />
                <AppText style={styles.tipText} forceKurdishFont={isKu}>
                  {isKu 
                    ? "نمرەکان تەنها وەک ئاماژەیەک وان — ئامرازێکی ڕاھێنانە نەک نمرەی فەرمی IELTS. زانیاری زیاتر لە ڕێکخستنەکاندا ببینە."
                    : "Indicative bands only — practice tool, not an official IELTS score. See AI & practice info in Settings."}
                </AppText>
              </View>
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
}: {
  result: AiTeacherResult;
  onTryAgain: () => void;
  onSave: () => void;
}) {
  const { isKu } = useI18n();
  return (
    <Animated.View entering={FadeInDown.duration(320)}>
      <HomeLiquidCard contentStyle={styles.overallCard}>
        <AppText style={styles.overallLabel} forceKurdishFont={isKu}>
          {isKu ? "نمرەی گشتی پێشبینیکراو" : "Overall indicative band"}
        </AppText>
        <AppText style={styles.overallBand} forceLatinFont>{result.overallBand}</AppText>
        <AppText style={styles.overallHint} forceKurdishFont={isKu}>
          {isKu ? "لە دەوری ٩.٠ (شێوازی IELTS)" : "Out of 9.0 (IELTS-style)"}
        </AppText>
      </HomeLiquidCard>

      <AppText style={styles.sectionTitle} forceKurdishFont={isKu}>
        {isKu ? "پێوەرەکان" : "Criteria"}
      </AppText>
      {result.criteria.map((c) => (
        <View key={c.key} style={styles.criterionCard}>
          <View style={[styles.criterionTop, { flexDirection: isKu ? "row-reverse" : "row" }]}>
            <AppText style={[styles.criterionLabel, { textAlign: isKu ? "right" : "left", paddingRight: isKu ? 0 : 8, paddingLeft: isKu ? 8 : 0 }]} forceKurdishFont={isKu}>
              {c.label}
            </AppText>
            <AppText style={styles.criterionBand} forceLatinFont>{c.band}</AppText>
          </View>
          <View style={styles.bandTrack}>
            <View
              style={[styles.bandFill, { width: `${(c.band / 9) * 100}%` }]}
            />
          </View>
          <AppText style={[styles.criterionNote, { textAlign: isKu ? "right" : "left" }]} forceKurdishFont={isKu}>{c.note}</AppText>
        </View>
      ))}

      <AppText style={styles.sectionTitle} forceKurdishFont={isKu}>
        {isKu ? "خاڵە بەهێزەکان" : "Strengths"}
      </AppText>
      <HomeLiquidCard contentStyle={styles.bulletCard}>
        {result.strengths.map((s) => (
          <AppText key={s} style={[styles.bullet, { textAlign: isKu ? "right" : "left" }]} forceKurdishFont={isKu}>
            • {s}
          </AppText>
        ))}
      </HomeLiquidCard>

      <AppText style={styles.sectionTitle} forceKurdishFont={isKu}>
        {isKu ? "خاڵەکان بۆ باشترکردن" : "To improve"}
      </AppText>
      <HomeLiquidCard contentStyle={styles.bulletCard}>
        {result.improvements.map((s) => (
          <AppText key={s} style={[styles.bullet, { textAlign: isKu ? "right" : "left" }]} forceKurdishFont={isKu}>
            • {s}
          </AppText>
        ))}
      </HomeLiquidCard>

      {result.sampleRewrite ? (
        <>
          <AppText style={styles.sectionTitle} forceKurdishFont={isKu}>
            {isKu ? "نموونەی نووسینی باشترکراو" : "Sample upgrade"}
          </AppText>
          <HomeLiquidCard contentStyle={styles.rewriteCard}>
            <AppText style={[styles.rewriteText, { textAlign: isKu ? "right" : "left" }]} forceKurdishFont={isKu}>{result.sampleRewrite}</AppText>
          </HomeLiquidCard>
        </>
      ) : null}

      <HomeLiquidButton
        label={isKu ? "پاشەکەوتکردنی هەوڵدانەکە" : "SAVE ATTEMPT"}
        onPress={onSave}
        style={styles.actionBtn}
      />
      <Pressable onPress={onTryAgain} style={styles.secondaryBtn}>
        <AppText style={styles.secondaryBtnText} forceKurdishFont={isKu}>
          {isKu ? "دووبارە هەوڵبدەرەوە" : "Try again"}
        </AppText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.meshBottom },
  flex: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
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
  topTitles: { flex: 1, alignItems: "center" },
  pageTitle: {
    ...HomeType.heading,
    fontSize: 20,
    color: C.navy,
  },
  pageSub: {
    ...HomeType.caption,
    color: C.grayLight,
    marginTop: 2,
  },
  modeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  modeChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: C.divider,
    alignItems: "center",
  },
  modeChipOn: {
    backgroundColor: C.blue,
    borderColor: C.blue,
  },
  modeChipText: {
    fontSize: 15,
    fontWeight: "700",
    color: C.gray,
    fontFamily: "DINNextRoundedBold",
  },
  modeChipTextOn: { color: "#FFFFFF" },
  sectionTitle: {
    ...HomeType.section,
    color: C.navy,
    marginBottom: 10,
    marginTop: 4,
  },
  promptScroll: { gap: 10, paddingBottom: 12 },
  promptCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: C.divider,
    maxWidth: 220,
  },
  promptCardOn: {
    borderColor: C.blue,
    backgroundColor: "#EEF4FF",
  },
  promptTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: C.navy,
    fontFamily: "DINNextRoundedBold",
  },
  promptStrip: {
    marginBottom: 16,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: C.divider,
  },
  promptScenarioLabel: {
    ...HomeType.caption,
    color: C.blue,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  promptScenario: {
    ...HomeType.body,
    color: C.navy,
    lineHeight: 22,
  },
  inputShell: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.divider,
    minHeight: 140,
    padding: 14,
    ...crossShadow({
      color: "#1A2B48",
      offsetY: 6,
      blur: 16,
      opacity: 0.05,
      elevation: 3,
    }),
  },
  textInput: {
    minHeight: 100,
    fontSize: 16,
    color: C.navy,
    fontFamily: "DINNextRoundedRegular",
    textAlignVertical: "top",
  },
  speakingMicBlock: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.divider,
    marginBottom: 4,
    ...crossShadow({
      color: "#1A2B48",
      offsetY: 6,
      blur: 16,
      opacity: 0.05,
      elevation: 3,
    }),
  },
  speakingTranscript: {
    fontSize: 16,
    lineHeight: 24,
    color: C.navy,
    textAlign: "center",
    paddingHorizontal: 20,
    fontFamily: "DINNextRoundedRegular",
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
    fontWeight: "700",
    color: C.blue,
    fontFamily: "DINNextRoundedBold",
  },
  errorText: {
    color: C.red,
    fontSize: 14,
    marginTop: 8,
    fontFamily: "DINNextRoundedMedium",
  },
  loadingBox: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 12,
  },
  loadingText: {
    ...HomeType.body,
    color: C.gray,
  },
  submitBtn: { marginTop: 16 },
  historyCard: { marginTop: 20 },
  historyInner: { padding: 16 },
  historyLabel: {
    ...HomeType.caption,
    color: C.grayLight,
  },
  historyBand: {
    fontSize: 17,
    fontWeight: "800",
    color: C.blue,
    marginTop: 4,
    fontFamily: "DINNextRoundedBold",
  },
  historyExcerpt: {
    ...HomeType.body,
    color: C.gray,
    marginTop: 6,
  },
  tipStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: C.divider,
  },
  tipText: {
    flex: 1,
    ...HomeType.body,
    color: C.navy,
    fontWeight: "600",
  },
  overallCard: {
    alignItems: "center",
    paddingVertical: 24,
    marginBottom: 8,
  },
  overallLabel: {
    ...HomeType.caption,
    color: C.grayLight,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  overallBand: {
    fontSize: 56,
    fontWeight: "800",
    color: C.blue,
    fontFamily: "DINNextRoundedBold",
    marginVertical: 4,
  },
  overallHint: {
    ...HomeType.caption,
    color: C.gray,
  },
  criterionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.divider,
  },
  criterionTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  criterionLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: C.navy,
    fontFamily: "DINNextRoundedBold",
    flex: 1,
    paddingRight: 8,
  },
  criterionBand: {
    fontSize: 20,
    fontWeight: "800",
    color: C.blue,
    fontFamily: "DINNextRoundedBold",
  },
  bandTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: C.track,
    marginTop: 10,
    overflow: "hidden",
  },
  bandFill: {
    height: "100%",
    backgroundColor: C.blue,
    borderRadius: 3,
  },
  criterionNote: {
    ...HomeType.caption,
    color: C.gray,
    marginTop: 8,
  },
  bulletCard: { padding: 14, gap: 8, marginBottom: 8 },
  bullet: {
    ...HomeType.body,
    color: C.navy,
    lineHeight: 22,
  },
  rewriteCard: { padding: 14, marginBottom: 8 },
  rewriteText: {
    ...HomeType.body,
    color: C.navy,
    fontStyle: "italic",
    lineHeight: 22,
  },
  actionBtn: { marginTop: 12 },
  secondaryBtn: {
    alignItems: "center",
    paddingVertical: 16,
  },
  secondaryBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: C.blue,
    fontFamily: "DINNextRoundedBold",
  },
});
