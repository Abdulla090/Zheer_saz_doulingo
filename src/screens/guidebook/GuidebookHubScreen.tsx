import {
  Activity01Icon,
  BookAIcon,
  BoxIcon,
  Cancel01Icon,
  Chatting01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import React, { useCallback, useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";

import { AppText } from "../../components/ui/AppText";
import { IOSPressable } from "../../components/ui/ios-pressable";
import {
  getReferenceContent,
  type ReferenceCategory,
} from "../../data/reference-content";
import { getPathUnitTitle, splitPathUnitTitle } from "../../data/path-unit-titles";
import { useI18n } from "../../hooks/useI18n";
import { useSafeBack } from "../../hooks/use-safe-back";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useLocaleStore } from "../../stores/useLocaleStore";
import { hapticSelection } from "../../utils/haptics";
import {
  getGuidebookSectionsCopy,
  type GuidebookSectionsCopy,
} from "./guidebook-hub-copy";
import { getGuidebookAccent } from "./guidebook-theme";

/*
 * Guidebook hub — the screen the path's guidebook button opens.
 *
 * Four reference sections in a strict two-column grid: Letters, Nouns, Verbs
 * and the unit's Everyday Talking guide (the original guide screen, now at
 * `/guidebook/everyday-talking`, which receives the `unit`/`mode` params this
 * screen was opened with).
 *
 * Design follows the guide screen's language — hairline toolbar, quiet
 * surfaces, accent used sparingly — with one accent hue per section so the
 * four destinations read at a glance without decoration for its own sake.
 */

const HUB_MAX_WIDTH = 560;
const PAGE_PADDING = 16;
const CARD_GAP = 12;
const CARD_RADIUS = 22;

type SectionCounts = {
  letters: number;
  nouns: number;
  verbs: number;
  everyday: number;
};

type SectionCard = {
  key: "letters" | "nouns" | "verbs" | "everyday";
  icon: typeof BookAIcon;
  accentTheme: string;
  title: (copy: GuidebookSectionsCopy) => string;
  subtitle: (copy: GuidebookSectionsCopy) => string;
  count: (copy: GuidebookSectionsCopy, counts: SectionCounts) => string;
  hasCount: (counts: SectionCounts) => boolean;
  route: string;
  /** Everyday Talking receives the hub's own `unit`/`mode` query. */
  forwardParams?: boolean;
};

const SECTIONS: SectionCard[] = [
  {
    key: "letters",
    icon: BookAIcon,
    accentTheme: "blue",
    title: (copy) => copy.lettersTitle,
    subtitle: (copy) => copy.lettersSubtitle,
    count: (copy, counts) => copy.lettersCount(counts.letters),
    hasCount: (counts) => counts.letters > 0,
    route: "/guidebook/letters",
  },
  {
    key: "nouns",
    icon: BoxIcon,
    accentTheme: "green",
    title: (copy) => copy.nounsTitle,
    subtitle: (copy) => copy.nounsSubtitle,
    count: (copy, counts) => copy.nounsCount(counts.nouns),
    hasCount: (counts) => counts.nouns > 0,
    route: "/guidebook/nouns",
  },
  {
    key: "verbs",
    icon: Activity01Icon,
    accentTheme: "purple",
    title: (copy) => copy.verbsTitle,
    subtitle: (copy) => copy.verbsSubtitle,
    count: (copy, counts) => copy.verbsCount(counts.verbs),
    hasCount: (counts) => counts.verbs > 0,
    route: "/guidebook/verbs",
  },
  {
    key: "everyday",
    icon: Chatting01Icon,
    accentTheme: "orange",
    title: (copy) => copy.everydayTitle,
    subtitle: (copy) => copy.everydaySubtitle,
    count: (copy, counts) => copy.everydayCount(counts.everyday),
    hasCount: (counts) => counts.everyday > 0,
    route: "/guidebook/everyday-talking",
    forwardParams: true,
  },
];

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default function GuidebookHubScreen() {
  const params = useLocalSearchParams<{
    unit?: string | string[];
    mode?: string | string[];
    lessons?: string | string[];
  }>();
  const router = useRouter();
  const safeBack = useSafeBack("/path");
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { locale, isKu } = useI18n();
  const { colors } = useThemeColors();
  const targetLanguage = useLocaleStore((state) => state.selectedTargetLanguage);
  const copy = useMemo(() => getGuidebookSectionsCopy(locale), [locale]);

  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const unitParam = firstParam(params.unit);
  const modeParam = firstParam(params.mode);
  const lessonsCount = Number(firstParam(params.lessons) ?? "0");

  /*
   * Counts come from the same target-language content the reference screens
   * read, so a badge never advertises material the card cannot open.
   */
  const counts = useMemo<SectionCounts>(() => {
    const letters = getReferenceContent("letters", targetLanguage);
    const grammarRowCount = (category: ReferenceCategory) => {
      const content = getReferenceContent(category, targetLanguage);
      if (!content || content.category === "letters") return 0;
      return content.set.sections.reduce(
        (total, section) => total + section.rows.length,
        0,
      );
    };
    return {
      letters: letters?.category === "letters" ? letters.set.letters.length : 0,
      nouns: grammarRowCount("nouns"),
      verbs: grammarRowCount("verbs"),
      everyday: lessonsCount,
    };
  }, [lessonsCount, targetLanguage]);

  const unitEyebrow = useMemo(() => {
    const index = Number.parseInt(unitParam ?? "", 10);
    if (!Number.isFinite(index) || index < 0) return "";
    const mode =
      modeParam === "street" || modeParam === "kids" ? modeParam : "normal";
    const full = getPathUnitTitle(mode, index, locale as never);
    const { sectionTitle } = splitPathUnitTitle(full);
    return sectionTitle;
  }, [locale, modeParam, unitParam]);

  const openSection = useCallback(
    (section: SectionCard) => {
      hapticSelection();
      if (!section.forwardParams) {
        router.push(section.route as never);
        return;
      }
      /*
       * Always forward a mode: a hub opened without params (deep link) would
       * otherwise send Everyday Talking to the street-path default, whose
       * content pack may not be downloaded — the guide renders as unavailable.
       */
      const query: Record<string, string> = {
        mode: modeParam ?? "normal",
      };
      if (unitParam != null) query.unit = unitParam;
      if (lessonsCount > 0) query.lessons = String(lessonsCount);
      const search = new URLSearchParams(query).toString();
      router.push(
        (search ? `${section.route}?${search}` : section.route) as never,
      );
    },
    [lessonsCount, modeParam, router, unitParam],
  );

  const gridWidth = Math.min(width, HUB_MAX_WIDTH) - PAGE_PADDING * 2;
  const cardWidth = (gridWidth - CARD_GAP) / 2;

  const renderCard = (section: SectionCard, index: number) => {
    const accent = getGuidebookAccent(section.accentTheme);
    const isPressed = pressedKey === section.key;

    return (
      <View
        key={section.key}
        style={{ width: cardWidth }}
      >
        <IOSPressable
          onPress={() => openSection(section)}
          onPressIn={() => setPressedKey(section.key)}
          onPressOut={() => setPressedKey(null)}
          accessibilityRole="button"
          accessibilityLabel={`${section.title(copy)} — ${section.count(copy, counts)}`}
          style={[
            styles.card,
            {
              backgroundColor: colors.surfaceRaised,
              borderColor: colors.border,
              transform: [{ scale: isPressed ? 0.977 : 1 }],
              opacity: isPressed ? 0.92 : 1,
            },
          ]}
        >
          <View style={styles.cardTop}>
            <View style={[styles.iconTile, { backgroundColor: accent.tint }]}>
              <HugeiconsIcon
                icon={section.icon}
                size={24}
                color={accent.strong}
                strokeWidth={1.9}
              />
            </View>
          </View>

          <View style={styles.cardText}>
            <AppText
              style={[styles.cardTitle, { color: colors.foreground }]}
              languageCode={locale}
              forceKurdishFont={isKu}
              align="start"
              fullWidth
              numberOfLines={1}
            >
              {section.title(copy)}
            </AppText>

            <AppText
              style={[styles.cardSubtitle, { color: colors.mutedForeground }]}
              languageCode={locale}
              forceKurdishFont={isKu}
              align="start"
              fullWidth
              numberOfLines={2}
            >
              {section.subtitle(copy)}
            </AppText>

            {section.hasCount(counts) ? (
              <AppText
                style={[styles.cardCount, { color: accent.strong }]}
                languageCode={locale}
                forceKurdishFont={isKu}
                forceLatinFont={!isKu}
                align="start"
                fullWidth
                numberOfLines={1}
              >
                {section.count(copy, counts)}
              </AppText>
            ) : null}
          </View>
        </IOSPressable>
      </View>
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.toolbar,
          { borderBottomColor: colors.border, paddingTop: insets.top },
        ]}
      >
        <AppText
          style={[styles.toolbarTitle, { color: colors.foreground }]}
          languageCode={locale}
          forceKurdishFont={isKu}
          align="center"
          numberOfLines={1}
        >
          {copy.hubTitle}
        </AppText>
        <IOSPressable
          onPress={safeBack}
          accessibilityRole="button"
          accessibilityLabel={copy.back}
          hitSlop={8}
          style={styles.closeButton}
        >
          <HugeiconsIcon
            icon={Cancel01Icon}
            size={26}
            color={colors.mutedForeground}
            strokeWidth={2.1}
          />
        </IOSPressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.page, { maxWidth: HUB_MAX_WIDTH }]}>
          {unitEyebrow ? (
            <AppText
              style={[styles.unitEyebrow, { color: colors.mutedForeground }]}
              languageCode={locale}
              forceKurdishFont={isKu}
              align="start"
              fullWidth
              numberOfLines={1}
            >
              {unitEyebrow}
            </AppText>
          ) : null}

          <View style={styles.grid}>
            {SECTIONS.map(renderCard)}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  toolbar: {
    minHeight: 64,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  toolbarTitle: { fontSize: 17, lineHeight: 23, fontWeight: "800" },
  closeButton: {
    position: "absolute",
    // Logical side: the close control trails the title under RTL too.
    end: 14,
    top: 0,
    bottom: 0,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  page: {
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: PAGE_PADDING,
  },
  unitEyebrow: {
    paddingTop: 16,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: CARD_GAP,
    paddingTop: 12,
  },
  card: {
    aspectRatio: 0.94,
    borderRadius: CARD_RADIUS,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
  },
  cardTop: { minHeight: 46 },
  iconTile: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: {
    flex: 1,
    justifyContent: "flex-end",
    gap: 3,
    marginTop: 12,
  },
  cardTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  cardSubtitle: { fontSize: 12.5, lineHeight: 17, fontWeight: "500" },
  cardCount: { fontSize: 12, lineHeight: 16, fontWeight: "800", marginTop: 3 },
});
