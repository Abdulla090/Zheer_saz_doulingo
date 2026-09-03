import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import { AppText } from "../../components/ui/AppText";
import { IOSPressable } from "../../components/ui/ios-pressable";
import {
  getReferenceContent,
  type GrammarSection,
  type LetterEntry,
  type ReferenceCategory,
} from "../../data/reference-content";
import { useI18n } from "../../hooks/useI18n";
import { useTTS } from "../../hooks/use-tts";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useSafeBack } from "../../hooks/use-safe-back";
import { useLocaleStore } from "../../stores/useLocaleStore";
import { hapticSelection } from "../../utils/haptics";
import { getGuidebookCopy } from "./guidebook-copy";
import {
  getGuidebookSectionsCopy,
  type GuidebookSectionsCopy,
} from "./guidebook-hub-copy";
import { GuidebookScreenShell } from "./GuidebookScreenShell";
import { getGuidebookAccent, type GuidebookAccent } from "./guidebook-theme";
import { ltrText, rtlText } from "../lesson/games/game-text";
import { VolumeHighIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";

/*
 * Shared reader for the Guidebook hub's Letters / Nouns / Verbs pages.
 *
 * One screen, three renderings: letters draw a chip grid with a detail card,
 * nouns and verbs draw sectioned grammar tables. Everything the learner reads
 * about the language is written in their own language; everything they are
 * learning is the target language itself, and every target-language form is
 * tappable for audio.
 *
 * The back button always returns to the hub (`/guidebook`), which is the
 * screen that pushed here — the hub is the guidebook's home surface.
 */

const CATEGORY_ACCENT: Record<ReferenceCategory, string> = {
  letters: "blue",
  nouns: "green",
  verbs: "purple",
};

const SECTION_TITLES = {
  letters: (c: GuidebookSectionsCopy) => c.lettersTitle,
  nouns: (c: GuidebookSectionsCopy) => c.nounsTitle,
  verbs: (c: GuidebookSectionsCopy) => c.verbsTitle,
} as const;

const SECTION_SUBTITLES = {
  letters: (c: GuidebookSectionsCopy) => c.lettersSubtitle,
  nouns: (c: GuidebookSectionsCopy) => c.nounsSubtitle,
  verbs: (c: GuidebookSectionsCopy) => c.verbsSubtitle,
} as const;

export default function ReferenceScreen({
  category,
}: {
  category: ReferenceCategory;
}) {
  const safeBack = useSafeBack("/guidebook");
  const { locale, isKu, isAr } = useI18n();
  const { colors } = useThemeColors();
  const { speak, stop, activeId } = useTTS();
  const targetLanguage = useLocaleStore((state) => state.selectedTargetLanguage);

  const isRtl = isKu || isAr;
  const copy = useMemo(() => getGuidebookSectionsCopy(locale), [locale]);
  const accent = useMemo(
    () => getGuidebookAccent(CATEGORY_ACCENT[category]),
    [category],
  );

  const content = useMemo(
    () => getReferenceContent(category, targetLanguage),
    [category, targetLanguage],
  );

  const targetLanguageName = useMemo(() => {
    const names: Record<string, string> = {
      en: "English",
      ar: "العربية",
      ru: "Русский",
    };
    return names[targetLanguage] ?? targetLanguage;
  }, [targetLanguage]);

  const handleSpeak = useCallback(
    (id: string, text: string) => {
      if (activeId === id) {
        void stop();
        return;
      }
      void speak(text, targetLanguage, id, { provider: "device" });
    },
    [activeId, speak, stop, targetLanguage],
  );

  const handleClose = useCallback(() => {
    void stop();
    safeBack();
  }, [safeBack, stop]);

  React.useEffect(() => () => void stop(), [stop]);

  return (
    <GuidebookScreenShell
      eyebrow={SECTION_TITLES[category](copy)}
      title={targetLanguageName}
      subtitle={SECTION_SUBTITLES[category](copy)}
      accentColor={accent.strong}
      isRtl={isRtl}
      isKurdish={isKu}
      languageCode={locale}
      onBack={handleClose}
      backLabel={copy.back}
    >
      {!content ? (
        <AppText
          style={[styles.unavailable, { color: colors.mutedForeground }]}
          forceKurdishFont={isKu}
        >
          {getGuidebookCopy(locale).notAvailable}
        </AppText>
      ) : content.category === "letters" ? (
        <LettersPanel
          letters={content.set.letters}
          copy={copy}
          accent={accent}
          isRtl={isRtl}
          isKurdish={isKu}
          activeId={activeId}
          onSpeak={handleSpeak}
        />
      ) : (
        <View style={styles.sectionList}>
          {content.set.sections.map((section, index) => (
            <GrammarSectionCard
              key={`section-${index}`}
              section={section}
              accent={accent}
              isRtl={isRtl}
              isKurdish={isKu}
              targetLanguage={targetLanguage}
              activeId={activeId}
              onSpeak={handleSpeak}
            />
          ))}
        </View>
      )}
    </GuidebookScreenShell>
  );
}

/** Letters: a chip grid plus one detail card for the selected letter. */
function LettersPanel({
  letters,
  copy,
  accent,
  isRtl,
  isKurdish,
  activeId,
  onSpeak,
}: {
  letters: LetterEntry[];
  copy: GuidebookSectionsCopy;
  accent: GuidebookAccent;
  isRtl: boolean;
  isKurdish: boolean;
  activeId: string | null;
  onSpeak: (id: string, text: string) => void;
}) {
  const { colors } = useThemeColors();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const safeIndex = Math.min(selectedIndex, letters.length - 1);
  const selected = letters[safeIndex];
  const explanationLocale = isKurdish ? "ku" : isRtl ? "ar" : "en";

  const handleSelect = useCallback(
    (index: number) => {
      hapticSelection();
      setSelectedIndex(index);
      const entry = letters[index];
      onSpeak(`letter-${index}`, entry.glyph.replace(/\s+/g, ""));
    },
    [letters, onSpeak],
  );

  if (!selected) return null;

  return (
    <View style={styles.lettersWrap}>
      <View style={styles.chipGrid}>
        {letters.map((letter, index) => {
          const isSelected = index === safeIndex;
          return (
            <IOSPressable
              key={`letter-${letter.glyph}-${index}`}
              onPress={() => handleSelect(index)}
              accessibilityRole="button"
              accessibilityLabel={letter.glyph}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? accent.strong : colors.card,
                  borderColor: isSelected ? accent.strong : colors.border,
                },
              ]}
            >
              <AppText
                style={[
                  styles.chipGlyph,
                  { color: isSelected ? "#FFFFFF" : colors.foreground },
                ]}
              >
                {letter.glyph}
              </AppText>
              <AppText
                numberOfLines={1}
                style={[
                  styles.chipName,
                  {
                    color: isSelected
                      ? "rgba(255,255,255,0.85)"
                      : colors.mutedForeground,
                  },
                ]}
              >
                {letter.name}
              </AppText>
            </IOSPressable>
          );
        })}
      </View>

      <View
        style={[
          styles.detailCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <AppText style={[styles.detailGlyph, { color: accent.strong }]}>
          {selected.glyph}
        </AppText>

        <View style={styles.detailBody}>
          <DetailRow
            label={copy.letterName}
            value={selected.name}
            isKurdish={isKurdish}
          />
          <DetailRow
            label={copy.letterSound}
            value={selected.sound[explanationLocale]}
            isKurdish={isKurdish}
          />
          <DetailRow
            label={copy.letterExample}
            value={selected.example}
            valueMeaning={selected.exampleMeaning[explanationLocale]}
            isKurdish={isKurdish}
            speakId={`letter-detail-${safeIndex}`}
            speakText={selected.example}
            activeId={activeId}
            onSpeak={onSpeak}
            accent={accent}
          />
        </View>
      </View>
    </View>
  );
}

function DetailRow({
  label,
  value,
  valueMeaning,
  isKurdish,
  speakId,
  speakText,
  activeId,
  onSpeak,
  accent,
}: {
  label: string;
  value: string;
  valueMeaning?: string;
  isKurdish: boolean;
  speakId?: string;
  speakText?: string;
  activeId?: string | null;
  onSpeak?: (id: string, text: string) => void;
  accent?: GuidebookAccent;
}) {
  const { colors } = useThemeColors();
  const isActive = speakId != null && activeId === speakId;
  const showSpeak = speakId != null && speakText != null && onSpeak != null && accent != null;

  return (
    <View style={styles.detailRow}>
      <View style={styles.detailText}>
        <AppText
          style={[styles.detailLabel, { color: colors.mutedForeground }]}
          forceKurdishFont={isKurdish}
        >
          {label}
        </AppText>
        <View style={styles.detailValueRow}>
          <AppText
            style={[styles.detailValue, { color: colors.foreground }]}
            forceKurdishFont={isKurdish}
          >
            {value}
          </AppText>
          {valueMeaning ? (
            <AppText
              style={[
                styles.detailValueMeaning,
                { color: colors.mutedForeground },
              ]}
              forceKurdishFont={isKurdish}
            >
              {` — ${valueMeaning}`}
            </AppText>
          ) : null}
        </View>
      </View>
      {showSpeak ? (
        <IOSPressable
          onPress={() => onSpeak!(speakId!, speakText!)}
          accessibilityRole="button"
          accessibilityLabel={speakText}
          style={[
            styles.speakButton,
            {
              backgroundColor: isActive ? accent!.strong : colors.card,
              borderColor: isActive ? accent!.strong : colors.border,
            },
          ]}
        >
          <HugeiconsIcon
            icon={VolumeHighIcon}
            size={18}
            color={isActive ? "#FFFFFF" : accent!.strong}
            strokeWidth={2}
          />
        </IOSPressable>
      ) : null}
    </View>
  );
}

/** Nouns & verbs: a titled card of rows — label, target form, meaning, audio. */
function GrammarSectionCard({
  section,
  accent,
  isRtl,
  isKurdish,
  targetLanguage,
  activeId,
  onSpeak,
}: {
  section: GrammarSection;
  accent: GuidebookAccent;
  isRtl: boolean;
  isKurdish: boolean;
  targetLanguage: string;
  activeId: string | null;
  onSpeak: (id: string, text: string) => void;
}) {
  const { colors } = useThemeColors();
  const explanationLocale = isKurdish ? "ku" : isRtl ? "ar" : "en";
  const isTargetRtl = targetLanguage === "ar";

  return (
    <View
      style={[
        styles.sectionCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.sectionTitleRow}>
        <View
          style={[styles.sectionAccentBar, { backgroundColor: accent.strong }]}
        />
        <AppText
          style={[styles.sectionTitle, { color: colors.foreground }]}
          forceKurdishFont={isKurdish}
        >
          {section.title[explanationLocale]}
        </AppText>
      </View>

      {section.note ? (
        <AppText
          style={[styles.sectionNote, { color: colors.mutedForeground }]}
          forceKurdishFont={isKurdish}
        >
          {section.note[explanationLocale]}
        </AppText>
      ) : null}

      <View style={styles.rowList}>
        {section.rows.map((row, index) => {
          const speakId = `row-${section.title.en}-${index}`;
          const isActive = activeId === speakId;
          return (
            <View
              key={`row-${index}`}
              style={[
                styles.grammarRow,
                { borderBottomColor: colors.border },
                isRtl && styles.rowReverse,
                index === section.rows.length - 1 && styles.rowLast,
              ]}
            >
              <View style={styles.grammarText}>
                {row.label ? (
                  <AppText
                    style={[
                      styles.grammarLabel,
                      { color: colors.mutedForeground },
                    ]}
                    forceKurdishFont={isKurdish}
                  >
                    {row.label[explanationLocale]}
                  </AppText>
                ) : null}
                <AppText
                  style={[
                    styles.grammarForm,
                    { color: colors.foreground },
                    isTargetRtl ? rtlText : ltrText,
                  ]}
                  forceLatinFont={!isTargetRtl}
                >
                  {row.form}
                </AppText>
                <AppText
                  style={[
                    styles.grammarMeaning,
                    { color: colors.mutedForeground },
                  ]}
                  forceKurdishFont={isKurdish}
                >
                  {row.meaning[explanationLocale]}
                </AppText>
              </View>
              <IOSPressable
                onPress={() => onSpeak(speakId, row.speak ?? row.form)}
                accessibilityRole="button"
                accessibilityLabel={row.speak ?? row.form}
                style={[
                  styles.speakButton,
                  {
                    backgroundColor: isActive ? accent.strong : "transparent",
                    borderColor: isActive ? accent.strong : colors.border,
                  },
                ]}
              >
                <HugeiconsIcon
                  icon={VolumeHighIcon}
                  size={18}
                  color={isActive ? "#FFFFFF" : accent.strong}
                  strokeWidth={2}
                />
              </IOSPressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  unavailable: {
    paddingHorizontal: 22,
    paddingTop: 20,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700",
  },
  rowReverse: { flexDirection: "row-reverse" },

  lettersWrap: {
    paddingHorizontal: 16,
    gap: 16,
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    flexGrow: 1,
    flexBasis: "21%",
    aspectRatio: 0.92,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingVertical: 8,
    paddingHorizontal: 2,
  },
  chipGlyph: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "900",
  },
  chipName: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "600",
  },
  detailCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    gap: 14,
    alignItems: "center",
  },
  detailGlyph: {
    fontSize: 56,
    lineHeight: 64,
    fontWeight: "900",
  },
  detailBody: {
    width: "100%",
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  detailText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  detailLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
  },
  detailValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    flexWrap: "wrap",
  },
  detailValue: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "800",
  },
  detailValueMeaning: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  speakButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  sectionList: {
    paddingHorizontal: 16,
    gap: 14,
  },
  sectionCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sectionAccentBar: {
    width: 4,
    height: 20,
    borderRadius: 2,
  },
  sectionTitle: {
    flex: 1,
    minWidth: 0,
    fontSize: 18,
    lineHeight: 25,
    fontWeight: "900",
  },
  sectionNote: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
  },
  rowList: {
    gap: 0,
  },
  grammarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLast: { borderBottomWidth: 0 },
  grammarText: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  grammarLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
  },
  grammarForm: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "900",
  },
  grammarMeaning: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
});
