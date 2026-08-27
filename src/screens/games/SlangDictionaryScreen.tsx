import { PressableScale } from "../../components/animations";
import { AppText } from "../../components/ui/AppText";
import {
  SLANG_CATEGORIES,
  SLANG_DATA,
  type SlangContextFilter,
  type SlangItem,
} from "../../data/slang-dictionary";
import { useTTS } from "../../hooks/use-tts";
import { useI18n } from "../../hooks/useI18n";
import { useSafeBack } from "../../hooks/use-safe-back";
import * as Haptics from "expo-haptics";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  BubbleChatIcon,
  BookOpen01Icon,
  ChevronDownIcon,
  Search01Icon,
  VolumeHighIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useMemo, useState } from "react";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { Platform, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  GamesBadge,
  GamesCard,
  GamesGlassHeader,
  GamesSectionLabel,
  GamesStateBlock,
  useGamesChrome,
} from "./components/games-chrome";
import {
  GamesMotion,
  GamesType,
  useGameHue,
  useGamesMetrics,
  useGamesTheme,
  withAlpha,
  type GamesTheme,
} from "./games-theme";

const SlangCategoryHeader = React.memo(function SlangCategoryHeader({
  categoriesList,
  selectedCategory,
  onSelectCategory,
  locale,
}: {
  categoriesList: SlangContextFilter[];
  selectedCategory: SlangContextFilter;
  onSelectCategory: (category: SlangContextFilter) => void;
  locale: string;
}) {
  const theme = useGamesTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingEnd: 16 }}
      style={{ marginBottom: 16, maxHeight: 42 }}
    >
      {categoriesList.map((item) => {
        const cat = SLANG_CATEGORIES[item];
        const labelText = locale === "ku" ? cat.ku : locale === "ar" ? cat.ar : cat.en;
        const isSelected = selectedCategory === item;

        return (
          <PressableScale
            key={item}
            onPress={() => {
              if (Platform.OS !== "web")
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSelectCategory(item);
            }}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 9,
              borderRadius: 999,
              backgroundColor: isSelected ? theme.accent : theme.surfaceSunken,
              borderWidth: 1,
              borderColor: isSelected ? theme.accentBorder : theme.border,
            }}
          >
            <AppText
              style={[
                GamesType.caption,
                { color: isSelected ? theme.onAccent : theme.mutedInk },
              ]}
              languageCode={locale}
              align="center"
            >
              {labelText}
            </AppText>
          </PressableScale>
        );
      })}
    </ScrollView>
  );
});

/** Round speak control. Accent-washed at rest, accent-filled while speaking. */
function SpeakButton({
  size,
  active,
  onPress,
  label,
  theme,
}: {
  size: number;
  active: boolean;
  onPress: () => void;
  label: string;
  theme: GamesTheme;
}) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      hitSlop={6}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: active ? theme.accent : theme.accentWash,
        borderWidth: 1,
        borderColor: active ? theme.accentBorder : withAlpha(theme.accent, 0.24),
      }}
    >
      <HugeiconsIcon
        icon={VolumeHighIcon}
        size={Math.round(size * 0.45)}
        color={active ? theme.onAccent : theme.accentInk}
        strokeWidth={2}
      />
    </PressableScale>
  );
}

const SlangItemRow = React.memo(function SlangItemRow({
  item,
  isExpanded,
  isItemSpeaking,
  onToggleExpand,
  onSpeak,
  t,
  speaking,
  activeId,
  locale,
}: {
  item: SlangItem;
  isExpanded: boolean;
  isItemSpeaking: boolean;
  onToggleExpand: (id: string) => void;
  onSpeak: (phrase: string, id: string) => void;
  t: any;
  speaking: boolean;
  activeId: string | null;
  locale: string;
}) {
  const theme = useGamesTheme();
  const metrics = useGamesMetrics(false);
  const hue = useGameHue("slang");
  const styles = useSlangStyles();
  const context = SLANG_CATEGORIES[item.context];
  const contextLabel =
    locale === "ku" ? context.ku : locale === "ar" ? context.ar : context.en;

  return (
    <GamesCard flat style={{ marginBottom: 10 }}>
      <View style={{ gap: 8 }}>
        <View style={styles.itemHeaderTopRow}>
          <View style={styles.badgeRow}>
            {/* Type is a taxonomy marker, so it carries the mode hue. */}
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 8,
                borderWidth: 1,
                backgroundColor: hue.wash,
                borderColor: hue.border,
              }}
            >
              <AppText
                style={[GamesType.eyebrow, { fontSize: 10, color: hue.ink }]}
                forceLatinFont
              >
                {item.type}
              </AppText>
            </View>
            <GamesBadge label={contextLabel} languageCode={locale} />
          </View>

          <View style={styles.actionRow}>
            <SpeakButton
              size={metrics.tapMin}
              active={isItemSpeaking}
              onPress={() => onSpeak(item.phrase, item.id)}
              label={t("slang.playAudio")}
              theme={theme}
            />
            <PressableScale
              onPress={() => onToggleExpand(item.id)}
              scaleDown={0.92}
              accessibilityRole="button"
              accessibilityState={{ expanded: isExpanded }}
              accessibilityLabel={isExpanded ? t("slang.close") : t("slang.example")}
              style={{
                width: metrics.tapMin,
                height: metrics.tapMin,
                borderRadius: metrics.tapMin / 2,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.surfaceSunken,
                borderWidth: 1,
                borderColor: theme.border,
              }}
            >
              <Animated.View
                style={{
                  transform: [{ rotate: isExpanded ? "180deg" : "0deg" }],
                  transitionProperty: "transform",
                  transitionDuration: GamesMotion.colorMs,
                }}
              >
                <HugeiconsIcon
                  icon={ChevronDownIcon}
                  size={20}
                  color={theme.mutedInk}
                  strokeWidth={2}
                />
              </Animated.View>
            </PressableScale>
          </View>
        </View>

        <PressableScale
          onPress={() => onToggleExpand(item.id)}
          scaleDown={0.99}
          style={{ width: "100%", minWidth: 0 }}
          accessibilityRole="button"
        >
          <View style={styles.phraseCol}>
            <AppText
              style={[GamesType.title, { fontSize: 19, color: theme.ink }]}
              languageCode="en"
              align="start"
              fullWidth
              forceLatinFont
            >
              {item.phrase}
            </AppText>
            <AppText
              style={[GamesType.body, { fontSize: 14, color: theme.mutedInk }]}
              languageCode="ku"
              align="start"
              fullWidth
              numberOfLines={1}
            >
              {item.pronunciation}
            </AppText>
          </View>
        </PressableScale>
      </View>

      {isExpanded && (
        <Animated.View
          entering={FadeInDown.duration(220)}
          exiting={FadeOutUp.duration(150)}
          style={{ marginTop: 14, gap: 12 }}
        >
          <View style={styles.divider} />

          <View style={{ gap: 4 }}>
            <GamesSectionLabel languageCode={locale}>
              {t("aiTeacher.criteria.pronunciation")}
            </GamesSectionLabel>
            <AppText
              style={[GamesType.body, { fontSize: 14, color: theme.ink }]}
              languageCode="ku"
              align="start"
              fullWidth
            >
              {item.pronunciation}
            </AppText>
          </View>

          <View style={{ gap: 4 }}>
            <GamesSectionLabel languageCode={locale}>
              {t("slang.meaning")}
            </GamesSectionLabel>
            <AppText
              style={[
                GamesType.section,
                { fontSize: 15, color: theme.ink, lineHeight: 22 },
              ]}
              languageCode="ku"
              align="start"
              fullWidth
            >
              {item.kuMeaning}
            </AppText>
          </View>

          <View style={{ gap: 4 }}>
            <GamesSectionLabel languageCode={locale}>
              {t("slang.example")}
            </GamesSectionLabel>
            <View style={styles.dialogueBox}>
              {(
                [
                  { key: "a", en: item.example.speakerA, ku: item.example.kuA, marker: "A" },
                  { key: "b", en: item.example.speakerB, ku: item.example.kuB, marker: "B" },
                ] as const
              ).map((line, idx) => (
                <React.Fragment key={line.key}>
                  {idx > 0 ? <View style={styles.divider} /> : null}
                  <View style={styles.dialogueLine}>
                    <View style={styles.dialogueMarker}>
                      <AppText
                        style={[GamesType.eyebrow, { fontSize: 11, color: theme.mutedInk }]}
                        forceLatinFont
                      >
                        {line.marker}
                      </AppText>
                    </View>
                    <View style={{ flex: 1, gap: 2 }}>
                      <AppText
                        style={[
                          GamesType.body,
                          { fontSize: 14, fontWeight: "700", color: theme.ink, lineHeight: 19 },
                        ]}
                        languageCode="en"
                        align="start"
                        fullWidth
                      >
                        {line.en}
                      </AppText>
                      <AppText
                        style={[
                          GamesType.body,
                          { fontSize: 13, color: theme.mutedInk, lineHeight: 19 },
                        ]}
                        languageCode="ku"
                        align="start"
                        fullWidth
                      >
                        {line.ku}
                      </AppText>
                    </View>
                    <SpeakButton
                      size={32}
                      active={speaking && activeId === `${item.id}_${line.key}`}
                      onPress={() => onSpeak(line.en, `${item.id}_${line.key}`)}
                      label={t("slang.playAudio")}
                      theme={theme}
                    />
                  </View>
                </React.Fragment>
              ))}
            </View>
          </View>
        </Animated.View>
      )}
    </GamesCard>
  );
});

export function SlangDictionaryScreen() {
  const insets = useSafeAreaInsets();
  const safeBack = useSafeBack("/(tabs)/play");
  const { t, locale } = useI18n();
  const { theme, hue, metrics, isWide } = useGamesChrome("slang");
  const styles = useSlangStyles(isWide);
  const { speak, stop, speaking, activeId } = useTTS();

  const isRtl = locale === "ku" || locale === "ar";

  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<SlangContextFilter>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  // Select Slang of the Day (seeded by current day of the month)
  const slangOfTheDay = useMemo(() => {
    const day = new Date().getDate();
    const index = day % SLANG_DATA.length;
    return SLANG_DATA[index];
  }, []);

  // Filter slang list
  const filteredSlang = useMemo(() => {
    return SLANG_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.context === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.phrase.toLowerCase().includes(q) ||
        item.pronunciation.toLowerCase().includes(q) ||
        item.kuMeaning.toLowerCase().includes(q) ||
        SLANG_CATEGORIES[item.context].en.toLowerCase().includes(q) ||
        SLANG_CATEGORIES[item.context].ku.toLowerCase().includes(q) ||
        SLANG_CATEGORIES[item.context].ar.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleBack = useCallback(() => {
    if (Platform.OS !== "web") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    safeBack();
  }, [safeBack]);

  const handleSpeak = useCallback(
    (text: string, id: string) => {
      if (Platform.OS !== "web") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (speaking && activeId === id) {
        void stop();
      } else {
        void speak(text, "en", id, { provider: "device" });
      }
    },
    [speaking, activeId, speak, stop]
  );

  const toggleExpand = useCallback((id: string) => {
    if (Platform.OS !== "web") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const categoriesList = useMemo(
    () => Object.keys(SLANG_CATEGORIES) as SlangContextFilter[],
    [],
  );

  const spotlightSpeaking = speaking && activeId === `spotlight_${slangOfTheDay.id}`;

  return (
    <View style={{ flex: 1, backgroundColor: theme.canvas }}>
      <GamesGlassHeader
        title={t("slang.title")}
        titleLanguageCode={locale}
        onBack={handleBack}
        scrolled={scrolled}
      />

      <FlashList
        data={filteredSlang}
        keyExtractor={(item) => item.id}
        onScroll={(e) => setScrolled(e.nativeEvent.contentOffset.y > 4)}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <SlangItemRow
            item={item}
            isExpanded={expandedId === item.id}
            isItemSpeaking={speaking && activeId === item.id}
            onToggleExpand={toggleExpand}
            onSpeak={handleSpeak}
            t={t}
            speaking={speaking}
            activeId={activeId}
            locale={locale}
          />
        )}
        extraData={{ expandedId, activeId, speaking }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: isWide ? 32 : metrics.gutter,
          paddingTop: isWide ? 24 : metrics.sectionGap,
          paddingBottom: insets.bottom + (isWide ? 56 : 28),
          maxWidth: isWide ? 960 : undefined,
          width: "100%",
          alignSelf: isWide ? "center" : undefined,
        }}
        ListHeaderComponent={
          <>
            {/*
              Slang of the Day.
            */}
            <GamesCard raised style={{ marginBottom: isWide ? 24 : 18, padding: isWide ? 24 : 16 }}>
              <View style={styles.spotlightTopRow}>
                <View style={[styles.spotlightBadge, { backgroundColor: hue.wash, borderColor: hue.border }]}>
                  <HugeiconsIcon
                    icon={BookOpen01Icon}
                    size={14}
                    color={hue.ink}
                    strokeWidth={2.2}
                  />
                  <AppText
                    style={[GamesType.eyebrow, { fontSize: 11, color: hue.ink }]}
                    languageCode={locale}
                    align="center"
                  >
                    {t("slang.slangOfTheDay")}
                  </AppText>
                </View>
                <GamesBadge label={slangOfTheDay.type} />
              </View>

              <View style={styles.spotlightMain}>
                <View style={{ flex: 1, alignItems: "stretch" }}>
                  <AppText
                    style={[GamesType.display, { fontSize: isWide ? 32 : 28, color: theme.ink }]}
                    languageCode="en"
                    align="start"
                    fullWidth
                    forceLatinFont
                  >
                    {slangOfTheDay.phrase}
                  </AppText>
                  <AppText
                    style={[
                      GamesType.body,
                      { fontSize: 15, fontWeight: "700", color: theme.mutedInk, marginTop: 4 },
                    ]}
                    languageCode="ku"
                    align="start"
                    fullWidth
                  >
                    {slangOfTheDay.pronunciation}
                  </AppText>
                </View>
                <SpeakButton
                  size={isWide ? 58 : 52}
                  active={spotlightSpeaking}
                  onPress={() =>
                    handleSpeak(slangOfTheDay.phrase, `spotlight_${slangOfTheDay.id}`)
                  }
                  label={t("slang.playAudio")}
                  theme={theme}
                />
              </View>

              <AppText
                style={[GamesType.body, { color: theme.ink, lineHeight: 24, marginTop: 12, fontSize: isWide ? 16 : 14 }]}
                languageCode="ku"
                align="start"
              >
                {slangOfTheDay.kuMeaning}
              </AppText>
            </GamesCard>

            {/* Search — focus is shown in coral, the same "active" signal used
                by every selected control in the system. */}
            <View
              style={[
                styles.searchContainer,
                {
                  backgroundColor: theme.surfaceSunken,
                  borderColor: searchFocused ? theme.accentBorder : theme.border,
                  borderWidth: searchFocused ? 2 : 1,
                  paddingHorizontal: searchFocused ? 11 : 12,
                },
              ]}
            >
              <HugeiconsIcon
                icon={Search01Icon}
                size={18}
                color={searchFocused ? theme.accentInk : theme.faintInk}
                strokeWidth={2}
                style={{ marginEnd: 8 }}
              />
              <TextInput
                underlineColorAndroid="transparent"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder={t("slang.searchPlaceholder")}
                placeholderTextColor={theme.faintInk}
                style={[
                  styles.searchInput,
                  {
                    color: theme.ink,
                    textAlign: isRtl ? "right" : "left",
                    writingDirection: isRtl ? "rtl" : "ltr",
                  },
                ]}
              />
              {searchQuery ? (
                <PressableScale
                  onPress={() => setSearchQuery("")}
                  hitSlop={7}
                  accessibilityRole="button"
                  accessibilityLabel={t("slang.close")}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: theme.surfaceSunken,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={16}
                    color={theme.mutedInk}
                    strokeWidth={2}
                  />
                </PressableScale>
              ) : null}
            </View>

            <SlangCategoryHeader
              categoriesList={categoriesList}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              locale={locale}
            />
          </>
        }
        ListEmptyComponent={
          <GamesStateBlock
            icon={BubbleChatIcon}
            languageCode={locale}
            title={t("slang.noResults")}
          />
        }
      />
    </View>
  );
}

function useSlangStyles(isWide = false) {
  const theme = useGamesTheme();
  const metrics = useGamesMetrics(false, isWide);

  return useMemo(
    () =>
      StyleSheet.create({
        itemHeaderTopRow: {
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 10,
        },
        badgeRow: {
          flex: 1,
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 6,
        },
        actionRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        },
        phraseCol: {
          width: "100%",
          alignItems: "stretch",
          gap: 2,
        },
        divider: {
          height: StyleSheet.hairlineWidth,
          backgroundColor: theme.border,
        },
        dialogueBox: {
          backgroundColor: theme.surfaceSunken,
          borderRadius: isWide ? 16 : metrics.radiusChip,
          borderWidth: 1,
          borderColor: theme.border,
          padding: isWide ? 16 : 12,
          gap: 12,
          marginTop: 4,
        },
        dialogueLine: {
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 12,
        },
        dialogueMarker: {
          width: 26,
          height: 26,
          borderRadius: 13,
          backgroundColor: theme.surfaceRaised,
          borderWidth: 1,
          borderColor: theme.border,
          alignItems: "center",
          justifyContent: "center",
          marginTop: 2,
        },
        spotlightTopRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
          gap: 8,
        },
        spotlightBadge: {
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "flex-start",
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 10,
          borderWidth: 1,
          gap: 6,
        },
        spotlightMain: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        },
        searchContainer: {
          flexDirection: "row",
          alignItems: "center",
          borderRadius: isWide ? 16 : metrics.radiusControl,
          height: isWide ? 54 : 50,
          marginBottom: isWide ? 16 : 12,
        },
        searchInput: {
          flex: 1,
          backgroundColor: "transparent",
          fontSize: 15,
          fontWeight: "600",
          fontFamily: "Rabar_044",
          paddingVertical: 0,
        },
      }),
    [theme, metrics, isWide],
  );
}
