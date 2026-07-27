import { PressableScale } from "../../components/animations";
import { AppText } from "../../components/ui/AppText";
import {
  HomeLiquidCard,
  HomeMeshBackground,
} from "../../components/ui/ios-liquid-home";
import {
  SLANG_CATEGORIES,
  SLANG_DATA,
  type SlangContextFilter,
  type SlangItem,
} from "../../data/slang-dictionary";
import { useTTS } from "../../hooks/use-tts";
import { useI18n } from "../../hooks/useI18n";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useSafeBack } from "../../hooks/use-safe-back";
import { crossShadow } from "../../utils/shadows";
import * as Haptics from "expo-haptics";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowLeft01Icon, BookOpen01Icon, ChevronDownIcon, Search01Icon, VolumeHighIcon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useMemo, useState } from "react";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ThemeColors = {
  accentBlue: "#2563EB",
  accentBlueDark: "#1D4ED8",
  darkNavy: "#10213D",
  slate: "#5B6B85",
  lightSlate: "#8B98AD",
  blueSoft: "rgba(37, 99, 235, 0.08)",
  blueBorder: "rgba(37, 99, 235, 0.18)",
};

const getTypeBadgeStyle = () => ({
  backgroundColor: ThemeColors.blueSoft,
  borderColor: ThemeColors.blueBorder,
});

const getTypeBadgeTextStyle = () => ({ color: ThemeColors.accentBlueDark });

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
  const styles = useSlangStyles();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipsContainer}
      style={styles.chipsList}
    >
      {categoriesList.map((item) => {
        const cat = SLANG_CATEGORIES[item];
        const labelText = locale === "ku" ? cat.ku : locale === "ar" ? cat.ar : cat.en;
        const isSelected = selectedCategory === item;

        return (
          <View key={item}>
            <PressableScale
              onPress={() => {
                if (Platform.OS !== "web") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onSelectCategory(item);
              }}
              style={[styles.chip, isSelected && styles.chipSelected]}
            >
              <AppText
                style={[
                  styles.chipText,
                  isSelected && styles.chipTextSelected,
                ]}
                languageCode={locale}
                align="center"
              >
                {labelText}
              </AppText>
            </PressableScale>
          </View>
        );
      })}
    </ScrollView>
  );
});

const SlangItemRow = React.memo(function SlangItemRow({
  item,
  isExpanded,
  isItemSpeaking,
  onToggleExpand,
  onSpeak,
  isRtl,
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
  isRtl: boolean;
  t: any;
  speaking: boolean;
  activeId: string | null;
  locale: string;
}) {
  const { colors } = useThemeColors();
  const styles = useSlangStyles();
  const context = SLANG_CATEGORIES[item.context];
  const contextLabel = locale === "ku" ? context.ku : locale === "ar" ? context.ar : context.en;
  return (
    <View>
      <HomeLiquidCard style={styles.cardShell} contentStyle={styles.cardContent}>
        <View style={styles.itemHeader}>
          <PressableScale
            onPress={() => onToggleExpand(item.id)}
            scaleDown={0.99}
            style={styles.expandTarget}
            accessibilityRole="button"
          >
            <View style={[styles.phraseCol, { alignItems: isRtl ? "flex-end" : "flex-start" }]}>
              <View style={styles.badgeRow}>
                <View style={[styles.typeBadge, getTypeBadgeStyle()]}>
                  <AppText style={[styles.typeBadgeText, getTypeBadgeTextStyle()]} forceLatinFont>
                    {item.type}
                  </AppText>
                </View>
                <View style={styles.contextBadge}>
                  <AppText
                    style={styles.contextBadgeText}
                    languageCode={locale}
                    align="center"
                    numberOfLines={1}
                  >
                    {contextLabel}
                  </AppText>
                </View>
              </View>
              <AppText style={[styles.slangPhrase, styles.ltrText]} forceLatinFont>
                {item.phrase}
              </AppText>
              <AppText style={[styles.slangSubtitle, styles.ltrText]} forceLatinFont numberOfLines={1}>
                {item.pronunciation}
              </AppText>
            </View>
          </PressableScale>

          <View style={styles.actionRow}>
            <PressableScale
              onPress={() => onSpeak(item.phrase, item.id)}
              style={[styles.speakerBtn, isItemSpeaking && styles.speakerBtnSpeaking]}
              accessibilityRole="button"
              accessibilityLabel={t("slang.playAudio")}
            >
              <HugeiconsIcon
                icon={VolumeHighIcon}
                size={20}
                color={isItemSpeaking ? "#FFFFFF" : colors.foreground}
                strokeWidth={2.0}
              />
            </PressableScale>
            <PressableScale
              onPress={() => onToggleExpand(item.id)}
              style={styles.expandButton}
              scaleDown={0.92}
              accessibilityRole="button"
              accessibilityLabel={isExpanded ? t("slang.close") : t("slang.example")}
            >
              <Animated.View
                style={{
                  transform: [{ rotate: isExpanded ? "180deg" : "0deg" }],
                  transitionProperty: "transform",
                  transitionDuration: 180,
                }}
              >
                <HugeiconsIcon icon={ChevronDownIcon} size={20} color={colors.mutedForeground} strokeWidth={2.0} />
              </Animated.View>
            </PressableScale>
          </View>
        </View>

        {isExpanded && (
          <Animated.View
            entering={FadeInDown.duration(220)}
            exiting={FadeOutUp.duration(150)}
            style={styles.itemExpanded}
          >
            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <AppText style={styles.detailLabel} languageCode={locale} align="start">
                {t("aiTeacher.criteria.pronunciation")}
              </AppText>
              <AppText style={[styles.detailValue, styles.ltrText]} forceLatinFont>
                {item.pronunciation}
              </AppText>
            </View>

            <View style={styles.detailRow}>
              <AppText style={styles.detailLabel} languageCode={locale} align="start">
                {t("slang.meaning")}
              </AppText>
              <AppText style={[styles.detailValue, styles.detailFigurative]} languageCode="ku" align="start">
                {item.kuMeaning}
              </AppText>
            </View>

            <View style={styles.detailRow}>
              <AppText style={styles.detailLabel} languageCode={locale} align="start">
                {t("slang.example")}
              </AppText>
              <View style={styles.dialogueBox}>
                {/* Dialogue Bubble A */}
                <View style={styles.dialogueLine}>
                  <View style={styles.dialogueMarkerA}>
                    <AppText style={styles.dialogueMarkerText} forceLatinFont>
                      A
                    </AppText>
                  </View>
                  <View style={styles.dialogueContent}>
                    <AppText style={[styles.dialogueEn, styles.ltrText]} forceLatinFont>
                      {item.example.speakerA}
                    </AppText>
                    <AppText style={styles.dialogueKu} languageCode="ku" align="start">
                      {item.example.kuA}
                    </AppText>
                  </View>
                  <PressableScale
                    onPress={() => onSpeak(item.example.speakerA, `${item.id}_a`)}
                    style={[
                      styles.miniSpeakerBtn,
                      speaking && activeId === `${item.id}_a` && styles.speakerBtnSpeaking,
                    ]}
                    hitSlop={6}
                    accessibilityRole="button"
                    accessibilityLabel={t("slang.playAudio")}
                  >
                    <HugeiconsIcon
                      icon={VolumeHighIcon}
                      size={14}
                      color={speaking && activeId === `${item.id}_a` ? "#FFFFFF" : ThemeColors.slate}
                      strokeWidth={2.0}
                    />
                  </PressableScale>
                </View>

                <View style={styles.divider} />

                {/* Dialogue Bubble B */}
                <View style={styles.dialogueLine}>
                  <View style={styles.dialogueMarkerB}>
                    <AppText style={styles.dialogueMarkerText} forceLatinFont>
                      B
                    </AppText>
                  </View>
                  <View style={styles.dialogueContent}>
                    <AppText style={[styles.dialogueEn, styles.ltrText]} forceLatinFont>
                      {item.example.speakerB}
                    </AppText>
                    <AppText style={styles.dialogueKu} languageCode="ku" align="start">
                      {item.example.kuB}
                    </AppText>
                  </View>
                  <PressableScale
                    onPress={() => onSpeak(item.example.speakerB, `${item.id}_b`)}
                    style={[
                      styles.miniSpeakerBtn,
                      speaking && activeId === `${item.id}_b` && styles.speakerBtnSpeaking,
                    ]}
                    hitSlop={6}
                    accessibilityRole="button"
                    accessibilityLabel={t("slang.playAudio")}
                  >
                    <HugeiconsIcon
                      icon={VolumeHighIcon}
                      size={14}
                      color={speaking && activeId === `${item.id}_b` ? "#FFFFFF" : ThemeColors.slate}
                      strokeWidth={2.0}
                    />
                  </PressableScale>
                </View>
              </View>
            </View>
          </Animated.View>
        )}
      </HomeLiquidCard>
    </View>
  );
});

export function SlangDictionaryScreen() {
  const styles = useSlangStyles();
  const insets = useSafeAreaInsets();
  const safeBack = useSafeBack("/(tabs)/play");
  const { t, locale } = useI18n();
  const { speak, stop, speaking, activeId } = useTTS();

  const isRtl = locale === "ku" || locale === "ar";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<SlangContextFilter>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  return (
    <View style={styles.root}>
      <HomeMeshBackground />

      {/* Screen Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8, flexDirection: "row" }]}>
        <PressableScale onPress={handleBack} style={styles.backBtn}>
          <View style={{ transform: [{ scaleX: isRtl ? -1 : 1 }] }}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={22} color={ThemeColors.accentBlue} strokeWidth={2.1} />
          </View>
        </PressableScale>
        <AppText
          style={styles.headerTitle}
          languageCode={locale}
          align="start"
        >
          {t("slang.title")}
        </AppText>
        <View style={{ width: 44 }} />
      </View>

      <FlashList
        data={filteredSlang}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SlangItemRow
            item={item}
            isExpanded={expandedId === item.id}
            isItemSpeaking={speaking && activeId === item.id}
            onToggleExpand={toggleExpand}
            onSpeak={handleSpeak}
            isRtl={isRtl}
            t={t}
            speaking={speaking}
            activeId={activeId}
            locale={locale}
          />
        )}
        extraData={{ expandedId, activeId, speaking }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 28 },
        ]}
        ListHeaderComponent={
          <>
            {/* Slang of the Day Spotlight */}
            <HomeLiquidCard
              style={[styles.spotlightCard, crossShadow({ color: ThemeColors.accentBlue, opacity: 0.12, offsetY: 10, blur: 24, elevation: 6 })]}
              contentStyle={styles.spotlightContent}
            >
              <View style={styles.spotlightTopRow}>
                <View style={styles.spotlightBadge}>
                  <HugeiconsIcon icon={BookOpen01Icon} size={14} color={ThemeColors.accentBlueDark} strokeWidth={2.0} />
                  <AppText
                    style={styles.spotlightBadgeText}
                    languageCode={locale}
                    align="center"
                  >
                    {t("slang.slangOfTheDay")}
                  </AppText>
                </View>
                <View style={[styles.typeBadge, { backgroundColor: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.3)" }]}>
                  <AppText style={[styles.typeBadgeText, { color: "#FFFFFF" }]} forceLatinFont>
                    {slangOfTheDay.type}
                  </AppText>
                </View>
              </View>

              <View style={styles.spotlightMain}>
                <View style={{ flex: 1, alignItems: isRtl ? "flex-end" : "flex-start" }}>
                  <AppText style={[styles.spotlightPhrase, styles.ltrText]} forceLatinFont>
                    {slangOfTheDay.phrase}
                  </AppText>
                  <AppText style={[styles.spotlightTranslation, styles.ltrText]} forceLatinFont>
                    {slangOfTheDay.pronunciation}
                  </AppText>
                </View>
                <PressableScale
                  onPress={() => handleSpeak(slangOfTheDay.phrase, `spotlight_${slangOfTheDay.id}`)}
                  style={[
                    styles.spotlightSpeakBtn,
                    speaking && activeId === `spotlight_${slangOfTheDay.id}` && styles.speakerBtnSpeaking,
                  ]}
                >
                  <HugeiconsIcon
                    icon={VolumeHighIcon}
                    size={22}
                    color="#FFFFFF"
                    strokeWidth={2.0}
                  />
                </PressableScale>
              </View>

              <AppText style={styles.spotlightDescription} languageCode="ku" align="start">
                {slangOfTheDay.kuMeaning}
              </AppText>
            </HomeLiquidCard>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <HugeiconsIcon icon={Search01Icon} size={18} color={ThemeColors.accentBlue} style={styles.searchIcon} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={t("slang.searchPlaceholder")}
                placeholderTextColor={ThemeColors.lightSlate}
                style={[
                  styles.searchInput,
                  {
                    textAlign: isRtl ? "right" : "left",
                    writingDirection: isRtl ? "rtl" : "ltr",
                  },
                ]}
              />
              {searchQuery ? (
                <PressableScale
                  onPress={() => setSearchQuery("")}
                  style={styles.clearSearchBtn}
                  hitSlop={7}
                  accessibilityRole="button"
                  accessibilityLabel={t("slang.close")}
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={16} color={ThemeColors.slate} strokeWidth={2.0} />
                </PressableScale>
              ) : null}
            </View>

            {/* Category Filters — small set; avoid nested FlashList */}
            <SlangCategoryHeader
              categoriesList={categoriesList}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              locale={locale}
            />
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <HugeiconsIcon icon={BookOpen01Icon} size={48} color={ThemeColors.lightSlate} strokeWidth={1.5} />
            <AppText
              style={styles.emptyText}
              languageCode={locale}
              align="center"
            >
              {t("slang.noResults")}
            </AppText>
          </View>
        }
      />
    </View>
  );
}

function useSlangStyles() {
  const { colors } = useThemeColors();

  return useMemo(() => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.muted,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "800",
    color: colors.foreground,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
  },
  spotlightCard: {
    backgroundColor: ThemeColors.accentBlue,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderRadius: 22,
    marginBottom: 20,
    overflow: "hidden",
  },
  spotlightContent: {
    padding: 20,
    backgroundColor: ThemeColors.accentBlue,
  },
  spotlightTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  spotlightBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 6,
    marginBottom: 14,
  },
  spotlightBadgeText: {
    color: "#000000",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  spotlightMain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  spotlightPhrase: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  spotlightTranslation: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.65)",
    fontWeight: "600",
    marginTop: 2,
  },
  spotlightSpeakBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  spotlightDescription: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "500",
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: ThemeColors.blueBorder,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 12,
    ...crossShadow({ color: ThemeColors.accentBlue, opacity: 0.06, offsetY: 3, blur: 10, elevation: 2 }),
  },
  searchIcon: {
    marginEnd: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.foreground,
    fontWeight: "600",
    fontFamily: "DINNextRoundedMedium",
    paddingVertical: 0,
  },
  clearSearchBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  chipsList: {
    marginBottom: 16,
    maxHeight: 40,
  },
  chipsContainer: {
    gap: 8,
    paddingEnd: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: ThemeColors.accentBlue,
    borderColor: ThemeColors.accentBlue,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "700",
    color: ThemeColors.slate,
  },
  chipTextSelected: {
    color: "#FFFFFF",
  },
  slangList: {
    gap: 12,
  },
  cardShell: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    overflow: "hidden",
  },
  cardContent: {
    padding: 16,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  phraseCol: {
    flex: 1,
    gap: 2,
  },
  slangPhrase: {
    fontSize: 19,
    fontWeight: "800",
    color: colors.foreground,
    letterSpacing: -0.2,
  },
  slangSubtitle: {
    fontSize: 14,
    color: ThemeColors.slate,
    fontWeight: "500",
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  expandTarget: {
    flex: 1,
    minWidth: 0,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  contextBadge: {
    maxWidth: 170,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: ThemeColors.blueSoft,
    borderWidth: 1,
    borderColor: ThemeColors.blueBorder,
  },
  contextBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: ThemeColors.slate,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  expandButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.muted,
  },
  speakerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ThemeColors.blueSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  speakerBtnSpeaking: {
    backgroundColor: ThemeColors.accentBlue,
  },
  itemExpanded: {
    marginTop: 14,
    gap: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  detailRow: {
    gap: 4,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: ThemeColors.lightSlate,
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 14,
    color: colors.foreground,
    fontWeight: "600",
  },
  detailFigurative: {
    color: ThemeColors.accentBlue,
    fontSize: 15,
  },
  dialogueBox: {
    backgroundColor: colors.muted,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    gap: 12,
    marginTop: 4,
  },
  dialogueLine: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  dialogueMarkerA: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(37, 99, 235, 0.16)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  dialogueMarkerB: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: ThemeColors.blueSoft,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  dialogueMarkerText: {
    fontSize: 11,
    fontWeight: "900",
    color: ThemeColors.accentBlueDark,
  },
  dialogueContent: {
    flex: 1,
    gap: 2,
  },
  dialogueEn: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.foreground,
    lineHeight: 18,
  },
  dialogueKu: {
    fontSize: 13,
    color: ThemeColors.slate,
    fontWeight: "500",
    lineHeight: 18,
  },
  miniSpeakerBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: ThemeColors.blueSoft,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: ThemeColors.lightSlate,
    fontWeight: "600",
  },
  ltrText: {
    alignSelf: "stretch",
    textAlign: "left",
    writingDirection: "ltr",
  },
  rtlText: {
    alignSelf: "stretch",
    textAlign: "right",
    writingDirection: "rtl",
  },
  }), [colors]);
}
