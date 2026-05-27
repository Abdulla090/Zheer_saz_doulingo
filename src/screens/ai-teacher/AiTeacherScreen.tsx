import { DolphinFlat } from "@/components/icons/HomeDashboardIcons";
import {
  HomeLiquidButton,
  HomeLiquidCard,
  HomeMeshBackground,
  HomePalette,
  HomeType,
} from "@/components/ui/ios-liquid-home";
import { AI_TEACHER_PROMPTS } from "@/data/ai-teacher-prompts";
import type {
  AiTeacherAttempt,
  AiTeacherMode,
  AiTeacherPrompt,
  AiTeacherResult,
} from "@/data/ai-teacher-types";
import { MicCaptureOrb } from "@/components/voice/MicCaptureOrb";
import { useSpeechCapture } from "@/hooks/use-speech-capture";
import { evaluateEnglish } from "@/services/ai-teacher-service";
import { PATH_LIST_REMOVE_CLIPPED } from "@/utils/native-perf";
import { crossShadow } from "@/utils/shadows";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Sparkles } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
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
    AsyncStorage.getItem(HISTORY_KEY)
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
      setError("Write or record at least a short answer (12+ characters).");
      return;
    }
    setError(null);
    setPhase("loading");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});

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
  }, [answer, mode, prompt.id]);

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
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(attempt));
    setLastSaved(attempt);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {},
    );
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

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={PATH_LIST_REMOVE_CLIPPED}
          contentContainerStyle={{
            paddingTop: insets.top + 8,
            paddingBottom: insets.bottom + 32,
            paddingHorizontal: 20,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topBar}>
            <Pressable
              onPress={() => router.back()}
              style={styles.backBtn}
              hitSlop={12}
            >
              <ArrowLeft size={22} color={C.navy} strokeWidth={2.5} />
            </Pressable>
            <View style={styles.topTitles}>
              <Text style={styles.pageTitle}>AI Teacher</Text>
              <Text style={styles.pageSub}>IELTS-style English check</Text>
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
              <View style={styles.modeRow}>
                {(["speaking", "writing"] as AiTeacherMode[]).map((m) => (
                  <Pressable
                    key={m}
                    onPress={() => setMode(m)}
                    style={[styles.modeChip, mode === m && styles.modeChipOn]}
                  >
                    <Text
                      style={[
                        styles.modeChipText,
                        mode === m && styles.modeChipTextOn,
                      ]}
                    >
                      {m === "speaking" ? "Speaking" : "Writing"}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.sectionTitle}>Choose a prompt</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.promptScroll}
              >
                {promptsForMode.map((p) => (
                  <Pressable
                    key={p.id}
                    onPress={() => setPrompt(p)}
                    style={[
                      styles.promptCard,
                      prompt.id === p.id && styles.promptCardOn,
                    ]}
                  >
                    <Text style={styles.promptTitle}>{p.title}</Text>
                  </Pressable>
                ))}
              </ScrollView>

              <HomeLiquidCard contentStyle={styles.promptBody}>
                <View style={styles.promptHeader}>
                  <Sparkles size={18} color={C.blue} />
                  <Text style={styles.promptScenarioLabel}>Your task</Text>
                </View>
                <Text style={styles.promptScenario}>{prompt.scenario}</Text>
              </HomeLiquidCard>

              <Text style={styles.sectionTitle}>Your answer</Text>
              {mode === "speaking" && !showTyping ? (
                <View style={styles.speakingMicBlock}>
                  <MicCaptureOrb
                    listening={speech.listening}
                    disabled={phase === "loading"}
                    color={speech.listening ? C.blue : C.navy}
                    size={112}
                    hint={
                      speech.listening
                        ? "Tap to stop recording"
                        : "Tap the mic and speak your answer"
                    }
                    onPress={toggleMic}
                  />
                  {answer.trim().length > 0 ? (
                    <Text style={styles.speakingTranscript}>{answer}</Text>
                  ) : null}
                  <Pressable
                    onPress={() => setShowTyping(true)}
                    style={styles.typeInsteadBtn}
                  >
                    <Text style={styles.typeInsteadText}>Type instead</Text>
                  </Pressable>
                </View>
              ) : (
                <View style={styles.inputShell}>
                  <TextInput
                    value={answer}
                    onChangeText={setAnswer}
                    placeholder={
                      mode === "speaking"
                        ? "Type what you said…"
                        : "Type your response in English…"
                    }
                    placeholderTextColor={C.grayLight}
                    multiline
                    style={styles.textInput}
                    editable={phase !== "loading"}
                  />
                  {mode === "speaking" ? (
                    <Pressable
                      onPress={() => setShowTyping(false)}
                      style={styles.typeInsteadBtnInline}
                    >
                      <Text style={styles.typeInsteadText}>Use mic</Text>
                    </Pressable>
                  ) : null}
                </View>
              )}

              {error || speech.error ? (
                <Text style={styles.errorText}>{error || speech.error}</Text>
              ) : null}

              {phase === "loading" ? (
                <View style={styles.loadingBox}>
                  <ActivityIndicator color={C.blue} size="large" />
                  <Text style={styles.loadingText}>
                    Checking your English…
                  </Text>
                </View>
              ) : (
                <HomeLiquidButton
                  label="CHECK MY ENGLISH"
                  onPress={onSubmit}
                  style={styles.submitBtn}
                />
              )}

              {lastSaved ? (
                <HomeLiquidCard
                  style={styles.historyCard}
                  contentStyle={styles.historyInner}
                >
                  <Text style={styles.historyLabel}>Last saved attempt</Text>
                  <Text style={styles.historyBand}>
                    Band {lastSaved.overallBand} · {lastSaved.mode}
                  </Text>
                  <Text style={styles.historyExcerpt} numberOfLines={2}>
                    {lastSaved.excerpt}
                  </Text>
                </HomeLiquidCard>
              ) : null}

              <HomeLiquidCard
                style={styles.tipCard}
                contentStyle={styles.tipInner}
              >
                <DolphinFlat width={56} height={56} />
                <Text style={styles.tipText}>
                  Indicative bands only — practice tool, not an official IELTS
                  score. 💙
                </Text>
              </HomeLiquidCard>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
  return (
    <Animated.View entering={FadeInDown.duration(320)}>
      <HomeLiquidCard contentStyle={styles.overallCard}>
        <Text style={styles.overallLabel}>Overall indicative band</Text>
        <Text style={styles.overallBand}>{result.overallBand}</Text>
        <Text style={styles.overallHint}>Out of 9.0 (IELTS-style)</Text>
      </HomeLiquidCard>

      <Text style={styles.sectionTitle}>Criteria</Text>
      {result.criteria.map((c) => (
        <View key={c.key} style={styles.criterionCard}>
          <View style={styles.criterionTop}>
            <Text style={styles.criterionLabel}>{c.label}</Text>
            <Text style={styles.criterionBand}>{c.band}</Text>
          </View>
          <View style={styles.bandTrack}>
            <View
              style={[styles.bandFill, { width: `${(c.band / 9) * 100}%` }]}
            />
          </View>
          <Text style={styles.criterionNote}>{c.note}</Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Strengths</Text>
      <HomeLiquidCard contentStyle={styles.bulletCard}>
        {result.strengths.map((s) => (
          <Text key={s} style={styles.bullet}>
            • {s}
          </Text>
        ))}
      </HomeLiquidCard>

      <Text style={styles.sectionTitle}>To improve</Text>
      <HomeLiquidCard contentStyle={styles.bulletCard}>
        {result.improvements.map((s) => (
          <Text key={s} style={styles.bullet}>
            • {s}
          </Text>
        ))}
      </HomeLiquidCard>

      {result.sampleRewrite ? (
        <>
          <Text style={styles.sectionTitle}>Sample upgrade</Text>
          <HomeLiquidCard contentStyle={styles.rewriteCard}>
            <Text style={styles.rewriteText}>{result.sampleRewrite}</Text>
          </HomeLiquidCard>
        </>
      ) : null}

      <HomeLiquidButton
        label="SAVE ATTEMPT"
        onPress={onSave}
        style={styles.actionBtn}
      />
      <Pressable onPress={onTryAgain} style={styles.secondaryBtn}>
        <Text style={styles.secondaryBtnText}>Try again</Text>
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
  promptBody: { padding: 16, marginBottom: 16 },
  promptHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
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
  tipCard: { marginTop: 16 },
  tipInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
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
