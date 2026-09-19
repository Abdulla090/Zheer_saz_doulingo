import { Cancel01Icon, RefreshIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText } from "../../components/ui/AppText";
import type {
  RealAnalysis,
  RealConversationTurn,
} from "../../data/voice-tutor-types";
import { useI18n } from "../../hooks/useI18n";
import { useThemeColors } from "../../hooks/useThemeColors";
import { DirectionBoundary } from "../../i18n/layout-direction";
import { detectScriptLanguage } from "../../utils/streaming-transcript";

type Props = {
  visible: boolean;
  loading: boolean;
  analysis: RealAnalysis | null;
  turns: RealConversationTurn[];
  sourceLanguage: string;
  targetLanguage: string;
  onClose: () => void;
  onRetry: () => void;
};

export function FocusAnalysisModal({
  visible,
  loading,
  analysis,
  turns,
  sourceLanguage,
  targetLanguage,
  onClose,
  onRetry,
}: Props) {
  const insets = useSafeAreaInsets();
  const { colors } = useThemeColors();
  const { isKu, isAr, locale } = useI18n();
  const isRtl = isKu || isAr;
  const label = (ku: string, ar: string, en: string) =>
    isKu ? ku : isAr ? ar : en;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <DirectionBoundary
        direction={isRtl ? "rtl" : "ltr"}
        style={[styles.root, { backgroundColor: colors.background }]}
      >
        <View
          style={[
            styles.header,
            {
              paddingTop: Math.max(insets.top, 12),
              borderBottomColor: colors.border,
            },
          ]}
        >
          <AppText
            style={[styles.title, { color: colors.foreground }]}
            languageCode={locale}
            align="start"
          >
            {label("شیکردنەوەی گفتوگۆ", "تحليل المحادثة", "Conversation analysis")}
          </AppText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={label("داخستن", "إغلاق", "Close")}
            hitSlop={8}
            onPress={onClose}
            style={({ pressed }) => [
              styles.closeButton,
              { backgroundColor: colors.surfaceRaised, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={22} color={colors.foreground} />
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color={colors.primary} />
            <AppText style={{ color: colors.mutedForeground }} languageCode={locale} align="center">
              {label("گفتوگۆکەت شیدەکرێتەوە...", "جارٍ تحليل محادثتك...", "Analyzing your conversation…")}
            </AppText>
          </View>
        ) : !analysis || turns.length === 0 ? (
          <View style={styles.centerState}>
            <AppText style={{ color: colors.mutedForeground }} languageCode={locale} align="center">
              {label("هێشتا گفتوگۆیەک نییە بۆ شیکردنەوە.", "لا توجد محادثة لتحليلها بعد.", "There is no conversation to analyze yet.")}
            </AppText>
          </View>
        ) : analysis.analysisError ? (
          <View style={styles.centerState}>
            <AppText style={{ color: colors.error }} languageCode={locale} align="center">
              {analysis.analysisError}
            </AppText>
            <Pressable
              accessibilityRole="button"
              onPress={onRetry}
              style={({ pressed }) => [
                styles.retryButton,
                { borderColor: colors.border, opacity: pressed ? 0.72 : 1 },
              ]}
            >
              <HugeiconsIcon icon={RefreshIcon} size={18} color={colors.primary} />
              <AppText style={{ color: colors.primary }} languageCode={locale} latinRole="bold">
                {label("دووبارە هەوڵبدەرەوە", "أعد المحاولة", "Retry")}
              </AppText>
            </Pressable>
          </View>
        ) : (
          <ScrollView
            style={styles.scroll}
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.content,
              { paddingBottom: Math.max(insets.bottom, 20) + 24 },
            ]}
          >
            <View style={styles.metricsRow}>
              <Metric
                label={label("نمرە", "النتيجة", "Score")}
                value={analysis.overallScore === null ? "—" : `${analysis.overallScore}%`}
                colors={colors}
              />
              <Metric
                label={label("وەرەکان", "الجولات", "Turns")}
                value={String(analysis.turnCount)}
                colors={colors}
              />
              <Metric
                label={label("ماوە", "المدة", "Duration")}
                value={analysis.duration}
                colors={colors}
                compact
              />
            </View>

            <Section title={label("وشەکانی ئەم دانیشتنە", "مفردات هذه الجلسة", "Session vocabulary")} colors={colors} locale={locale}>
              <View style={styles.tags}>
                {analysis.wordsIntroduced.length > 0 ? (
                  analysis.wordsIntroduced.map((word) => (
                    <View key={word} style={[styles.tag, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
                      <AppText style={{ color: colors.foreground }} forceLatinFont>{word}</AppText>
                    </View>
                  ))
                ) : (
                  <AppText style={{ color: colors.mutedForeground }} languageCode={locale}>
                    {label("هیچ وشەیەکی نوێ تۆمار نەکراوە.", "لم تُسجل كلمات جديدة.", "No new vocabulary was recorded.")}
                  </AppText>
                )}
              </View>
            </Section>

            <Section title={label("چاکسازییەکان", "التحسينات", "Improvements")} colors={colors} locale={locale}>
              {analysis.grammarErrors.length > 0 ? (
                <View style={styles.cardList}>
                  {analysis.grammarErrors.map((item, index) => (
                    <View key={`${item.original}-${index}`} style={[styles.correctionCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
                      <AppText style={[styles.caption, { color: colors.error }]} languageCode={locale} latinRole="bold">
                        {label("ئەوەی وتت", "ما قلته", "You said")}
                      </AppText>
                      <AppText style={{ color: colors.foreground }} align="start">{item.original}</AppText>
                      <AppText style={[styles.caption, { color: "#10B981" }]} languageCode={locale} latinRole="bold">
                        {label("شێوازی سروشتیتر", "صياغة طبيعية", "More natural")}
                      </AppText>
                      <AppText style={{ color: colors.foreground }} align="start">{item.corrected}</AppText>
                      {item.explanation ? (
                        <AppText style={{ color: colors.mutedForeground }} languageCode={locale} align="start">
                          {item.explanation}
                        </AppText>
                      ) : null}
                    </View>
                  ))}
                </View>
              ) : (
                <AppText style={{ color: colors.mutedForeground }} languageCode={locale} align="start">
                  {label("هەڵەیەکی گرنگ نەدۆزرایەوە.", "لم تُكتشف أخطاء مهمة.", "No important errors were detected.")}
                </AppText>
              )}
            </Section>

            <Section title={label("دەقی گفتوگۆ", "نص المحادثة", "Transcript")} colors={colors} locale={locale}>
              <View style={styles.cardList}>
                {turns.map((turn) => {
                  const language = detectScriptLanguage(
                    turn.text,
                    sourceLanguage,
                    targetLanguage,
                  ).languageCode;
                  return (
                    <View key={turn.id} style={[styles.turnCard, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
                      <AppText style={[styles.caption, { color: turn.sender === "user" ? colors.primary : colors.mutedForeground }]} latinRole="bold">
                        {turn.sender === "user" ? label("تۆ", "أنت", "You") : "Twino"}
                      </AppText>
                      <AppText style={{ color: colors.foreground }} languageCode={language} align="start" selectable>
                        {turn.text}
                      </AppText>
                    </View>
                  );
                })}
              </View>
            </Section>
          </ScrollView>
        )}
      </DirectionBoundary>
    </Modal>
  );
}

function Metric({ label, value, colors, compact = false }: { label: string; value: string; colors: ReturnType<typeof useThemeColors>["colors"]; compact?: boolean }) {
  return (
    <View style={[styles.metric, { backgroundColor: colors.surfaceRaised, borderColor: colors.border }]}>
      <AppText style={[styles.metricLabel, { color: colors.mutedForeground }]} forceLatinFont>{label}</AppText>
      <AppText style={[compact ? styles.metricValueCompact : styles.metricValue, { color: colors.foreground }]} forceLatinFont latinRole="bold" align="center">{value}</AppText>
    </View>
  );
}

function Section({ title, colors, locale, children }: { title: string; colors: ReturnType<typeof useThemeColors>["colors"]; locale: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <AppText style={[styles.sectionTitle, { color: colors.foreground }]} languageCode={locale} align="start" latinRole="bold">{title}</AppText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { minHeight: 72, paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 16 },
  title: { flex: 1, fontSize: 24, lineHeight: 31 },
  closeButton: { width: 44, height: 44, borderRadius: 22, borderCurve: "continuous", alignItems: "center", justifyContent: "center" },
  centerState: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16, paddingHorizontal: 32 },
  retryButton: { minHeight: 48, paddingHorizontal: 18, borderRadius: 16, borderCurve: "continuous", borderWidth: 1, flexDirection: "row", alignItems: "center", gap: 8 },
  scroll: { flex: 1 },
  content: { width: "100%", maxWidth: 720, alignSelf: "center", paddingHorizontal: 20, paddingTop: 20, gap: 24 },
  metricsRow: { flexDirection: "row", gap: 8 },
  metric: { flex: 1, minHeight: 96, borderRadius: 20, borderCurve: "continuous", borderWidth: StyleSheet.hairlineWidth, padding: 12, alignItems: "center", justifyContent: "center", gap: 5 },
  metricLabel: { fontSize: 10, lineHeight: 14, textTransform: "uppercase", letterSpacing: 0.5 },
  metricValue: { fontSize: 23, lineHeight: 29, fontVariant: ["tabular-nums"] },
  metricValueCompact: { fontSize: 12, lineHeight: 17, fontVariant: ["tabular-nums"] },
  section: { gap: 12 },
  sectionTitle: { fontSize: 18, lineHeight: 24 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: { minHeight: 38, paddingHorizontal: 12, borderRadius: 13, borderCurve: "continuous", borderWidth: StyleSheet.hairlineWidth, alignItems: "center", justifyContent: "center" },
  cardList: { gap: 10 },
  correctionCard: { borderRadius: 18, borderCurve: "continuous", borderWidth: StyleSheet.hairlineWidth, padding: 16, gap: 7 },
  turnCard: { borderRadius: 16, borderCurve: "continuous", borderWidth: StyleSheet.hairlineWidth, padding: 14, gap: 5 },
  caption: { fontSize: 11, lineHeight: 15, textTransform: "uppercase", letterSpacing: 0.35 },
});
