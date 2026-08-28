/* eslint-disable */
/**
 * NormalHomeScreen — "Normal English" learning path.
 * Dark slate theme. Structurally mirrors HomeScreen completely.
 */

import { AppText } from "../../components/ui/AppText";
import { BUTTON_FACE_RIM_COLORS } from "../../constants/button-theme-colors";
import { tabBarScrollPadding } from "../../constants/layout";
import type {
  LessonListItem,
  SectionDataItem,
  SectionTheme,
} from "../../data/list-items";
import { getUnitsForPath } from "../../data/content-access";
import {
  lessonTypeForIndex,
  resolveUnitLessonStatus,
} from "../../data/list-items";
import { usePathScrollAfterLesson } from "../../hooks/usePathScrollAfterLesson";
import { usePathLessonSelection } from "../../hooks/use-path-lesson-selection";
import { scrollPathToCurrentLesson } from "../../utils/path-scroll";
import { useCurrentProgress } from "../../stores/useProgressStore";
import {
  getSkippedUnitsCount,
  normalSectionConfigs,
} from "../../data/normal-english";
import { ListFooter } from "./components/list-footer";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { useLocaleStore } from "../../stores/useLocaleStore";
import { getLanguage } from "../../config/languages";
import {
  getPathUnitTitle,
  localizePathSections,
  splitPathUnitTitle,
} from "../../data/path-unit-titles";
import { useI18n } from "../../hooks/useI18n";
import { ltrText, rtlText } from "../lesson/games/game-text";
import { PATH_LIST_REMOVE_CLIPPED, PATH_LIST_TUNING } from "../../utils/native-perf";
import { shadeHex } from "../../utils/color-shade";
import {
  SVG_BUTTON_COLOR_SETS,
  type SvgButtonVariant,
} from "./components/list-button";
import { Duo } from "../lesson/games/lesson-light-design";
import { PressableScale } from "../../components/animations/PressableScale";
import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  SectionList,
  SectionListRenderItemInfo,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeMainButton } from "./components/home-main-button";
import { PATH_TOP_CHROME_HEIGHT } from "./components/PathModeTabs";
import { ListItem } from "./components/list-item";
import { PathStatsBar } from "./components/path-stats-bar";
import { PathLessonPopup } from "./components/path-lesson-popup";
import { useThemeColors } from "../../hooks/useThemeColors";
import {
  isDesktopWebWidth,
  WEB_DESKTOP_PATH_WIDTH,
} from "../../constants/web-layout";

const keyExtractor = (item: { id: string }) => `ne-${item.id}`;

const NormalSectionHeader = React.memo(
  ({
    section,
    isKu,
    lineColor,
    titleColor,
  }: {
    section: SectionDataItem;
    isKu: boolean;
    lineColor: string;
    titleColor: string;
  }) => {
    if (section.unitIndex === 0) return null;
    const direction = isKu ? rtlText : ltrText;

    return (
      <View style={darkStyles.sectionHeader}>
        <View style={[darkStyles.sectionLine, { backgroundColor: lineColor }]} />
        <AppText
          style={[darkStyles.sectionTitle, { color: titleColor }, direction]}
          forceKurdishFont={isKu}
          forceLatinFont={!isKu}
          numberOfLines={2}
        >
          {section.title}
        </AppText>
        <View style={[darkStyles.sectionLine, { backgroundColor: lineColor }]} />
      </View>
    );
  },
);

export function NormalEnglishPathScreen({
  topChromeHeight = PATH_TOP_CHROME_HEIGHT,
}: {
  topChromeHeight?: number;
} = {}) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useThemeColors();
  const { locale, isKu } = useI18n();
  const { width: windowWidth } = useWindowDimensions();
  const pathLayoutWidth =
    Platform.OS === "web" && isDesktopWebWidth(windowWidth)
      ? WEB_DESKTOP_PATH_WIDTH
      : windowWidth;
  const desktopTopInset =
    Platform.OS === "web" && isDesktopWebWidth(windowWidth) ? 24 : 0;
  const listRef = useRef<SectionList<LessonListItem, SectionDataItem>>(null);
  const overlayRootRef = useRef<View>(null);
  const scrollYRef = useRef(0);
  const contentHeightRef = useRef(0);
  const viewportHeightRef = useRef(0);
  const maxScrollYRef = useRef(0);
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 100,
  }).current;

  const { normalNextLessonPathIndex } = useCurrentProgress();
  const englishLevel = useSettingsStore((s) => s.englishLevel);
  const targetLanguage = useLocaleStore((s) => s.selectedTargetLanguage);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [activeSectionTheme, setActiveSectionTheme] =
    useState<SectionTheme>("blue");

  const localizedSections = useMemo(() => {
    const units = getUnitsForPath("normal");
    const skipCount = getSkippedUnitsCount(englishLevel || 5);
    const activeConfigs = normalSectionConfigs.slice(skipCount);
    let pathIndex = skipCount * 10;

    const sections: SectionDataItem[] = units.map((unit, unitIndex) => {
      const config = activeConfigs[unitIndex] || {
        theme: "blue",
        displayTheme: "blue",
      };
      const displayTheme = config.displayTheme;

      const data: LessonListItem[] = unit.map((lesson, lessonIndex) => {
        const itemStatus = resolveUnitLessonStatus(
          pathIndex,
          normalNextLessonPathIndex,
          lessonIndex,
        );
        const currentIndex = pathIndex++;
        return {
          id: `normal-level-${currentIndex}`,
          pathIndex: currentIndex,
          globalIndex: currentIndex,
          sectionItemIndex: lessonIndex,
          type: lessonTypeForIndex(lessonIndex),
          sectionTheme: displayTheme,
          displayTheme,
          status: itemStatus,
          isCurrent: itemStatus === "current",
          // No per-lesson progress is tracked yet — the store only records which
          // path index you are on. Reporting 0 keeps the ring an honest "you are
          // here" halo instead of a permanent fake fraction.
          progressSegments: 0,
          lessonId: unitIndex + skipCount,
        };
      });

      return {
        unitIndex: unitIndex + skipCount,
        title: "",
        theme: displayTheme,
        displayTheme,
        data,
      };
    });

    return localizePathSections(sections, "normal", locale);
  }, [locale, normalNextLessonPathIndex, englishLevel]);

  // Find the unit index of the user's active/current lesson
  const currentUnitIndex = useMemo(() => {
    const idx = localizedSections.findIndex((section) =>
      section.data.some((item) => item.isCurrent),
    );
    return idx !== -1 ? idx : 0;
  }, [localizedSections]);

  const [visibleUnitsCount, setVisibleUnitsCount] = useState(() =>
    Math.min(localizedSections.length, Math.max(currentUnitIndex + 2, 2)),
  );

  // Sync visibleUnitsCount if user's currentUnitIndex advances or list expands
  useEffect(() => {
    setVisibleUnitsCount((prev) =>
      Math.max(
        prev,
        Math.min(localizedSections.length, Math.max(currentUnitIndex + 2, 2)),
      ),
    );
  }, [localizedSections.length, currentUnitIndex]);

  const visibleSections = useMemo(
    () => localizedSections.slice(0, visibleUnitsCount),
    [localizedSections, visibleUnitsCount],
  );

  const hasMore = visibleUnitsCount < localizedSections.length;
  const { selectedLesson, selectLesson, dismissLesson } =
    usePathLessonSelection(listRef, visibleSections, overlayRootRef);

  const renderFooter = useCallback(() => {
    if (!hasMore) return <ListFooter />;
    return (
      <View
        style={{ width: "100%", alignItems: "center", paddingVertical: 20 }}
      >
        <PressableScale
          style={{
            paddingVertical: 14,
            paddingHorizontal: 28,
            backgroundColor: Duo.accent,
            borderRadius: 20,
            borderBottomWidth: 4,
            borderBottomColor: Duo.accentDark,
          }}
          onPress={() => setVisibleUnitsCount((prev) => prev + 2)}
        >
          <AppText
            style={{
              color: "#FFFFFF",
              fontSize: 16,
              fontFamily: "Rabar_044",
            }}
            languageCode={locale}
            forceKurdishFont={locale === "ku"}
            forceLatinFont={locale !== "ku" && locale !== "ar"}
          >
            {locale === "ku"
              ? "یەکەی زیاتر ببینە"
              : locale === "ar"
                ? "عرض وحدات إضافية"
                : "See More Units"}
          </AppText>
        </PressableScale>
      </View>
    );
  }, [hasMore, locale]);

  usePathScrollAfterLesson("normal", localizedSections, listRef);

  const activeSectionDisplay = useMemo(() => {
    const fullTitle = getPathUnitTitle("normal", activeSectionIndex, locale);
    return splitPathUnitTitle(fullTitle);
  }, [activeSectionIndex, locale]);

  const buttonColors = useMemo(() => {
    /*
     * The unit banner now takes the colour of the unit it labels, so scrolling
     * into a new unit recolours the header along with its nodes. Sourced from
     * `SVG_BUTTON_COLOR_SETS` — the same table the nodes read — rather than a
     * parallel palette, so the two can never drift apart.
     *
     * Dark mode darkens both stops: the node colours are tuned for a white
     * canvas and read as glare on a dark one.
     */
    const theme = localizedSections[activeSectionIndex]?.displayTheme;
    const set =
      (theme && SVG_BUTTON_COLOR_SETS[theme as SvgButtonVariant]) ||
      SVG_BUTTON_COLOR_SETS.orange;

    if (isDark) {
      return { rim: shadeHex(set.rim, 0.72), face: shadeHex(set.face, 0.82) };
    }
    return set;
  }, [isDark, localizedSections, activeSectionIndex]);

  const recalcMaxScroll = useCallback(() => {
    maxScrollYRef.current = Math.max(
      0,
      contentHeightRef.current - viewportHeightRef.current,
    );
  }, []);

  const onListLayout = useCallback(
    (e: { nativeEvent: { layout: { height: number } } }) => {
      viewportHeightRef.current = e.nativeEvent.layout.height;
      recalcMaxScroll();
    },
    [recalcMaxScroll],
  );

  const onContentSizeChange = useCallback(
    (_: number, h: number) => {
      contentHeightRef.current = h;
      recalcMaxScroll();
    },
    [recalcMaxScroll],
  );

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollYRef.current = e.nativeEvent.contentOffset.y;
  }, []);

  const renderItem = useCallback(
    ({
      item,
      section,
    }: SectionListRenderItemInfo<LessonListItem, SectionDataItem>) => (
      <ListItem
        item={item}
        screenWidth={pathLayoutWidth}
        unitLessonCount={section.data.length}
        pathMode="normal"
        isActiveLesson={item.pathIndex === normalNextLessonPathIndex}
        isSelected={selectedLesson?.item.id === item.id}
        // A unit counts as reached once its first lesson is unlocked, which
        // covers both "working through it" and "already finished it".
        isUnitReached={
          normalNextLessonPathIndex >= (section.data[0]?.pathIndex ?? 0)
        }
        onSelect={(node) =>
          selectLesson(item, section.title, node, section.data.length)
        }
      />
    ),
    [
      normalNextLessonPathIndex,
      selectLesson,
      selectedLesson?.item.id,
      pathLayoutWidth,
    ],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: SectionDataItem }) => (
      <NormalSectionHeader
        section={section}
        isKu={isKu}
        lineColor={colors.border}
        titleColor={colors.mutedForeground}
      />
    ),
    [isKu, colors.border, colors.mutedForeground],
  );

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    const firstVisible = viewableItems?.[0]?.section;
    const nextIndex = firstVisible?.unitIndex;
    const nextTheme = firstVisible?.displayTheme;

    if (typeof nextIndex === "number" && nextIndex >= 0) {
      setActiveSectionIndex((prev) => (prev === nextIndex ? prev : nextIndex));
    }
    if (typeof nextTheme === "string" && nextTheme in BUTTON_FACE_RIM_COLORS) {
      setActiveSectionTheme((prev) =>
        prev === nextTheme ? prev : (nextTheme as SectionTheme),
      );
    }
  }).current;

  const onScrollToIndexFailed = useCallback(
    (info: { index: number; highestMeasuredFrameIndex: number; averageItemLength: number }) => {
      const offset = Math.max(0, info.highestMeasuredFrameIndex * (info.averageItemLength || 80));
      listRef.current?.getScrollResponder()?.scrollTo({
        y: offset,
        animated: true,
      });
      setTimeout(() => {
        try {
          if (visibleSections.length > 0) {
            scrollPathToCurrentLesson(listRef, visibleSections, true);
          }
        } catch {
          // Ignore fallback errors
        }
      }, 100);
    },
    [visibleSections],
  );

  if (localizedSections.length === 0) {
    const targetName = getLanguage(targetLanguage)?.nativeName ?? targetLanguage;
    const emptyCopy = locale === "ku"
      ? { title: `${targetName} بۆ فێربوون ئامادە نییە`, body: "پاکێجی وانەی تەواو هێشتا بڵاونەکراوەتەوە. لە ڕێکخستنەکاندا زمانێکی تر هەڵبژێرە." }
      : locale === "ar"
        ? { title: `دورة ${targetName} غير جاهزة بعد`, body: "لم تُنشر حزمة الدروس الكاملة بعد. اختر لغة أخرى من الإعدادات." }
        : { title: `${targetName} course is not ready yet`, body: "The complete lesson pack has not been published yet. Choose another target in Settings." };

    return (
      <View style={[darkStyles.emptyState, { backgroundColor: colors.background }]}>
        <AppText
          style={[darkStyles.emptyTitle, { color: colors.foreground }]}
          languageCode={locale}
          align="center"
        >
          {emptyCopy.title}
        </AppText>
        <AppText
          style={[darkStyles.emptyBody, { color: colors.mutedForeground }]}
          languageCode={locale}
          align="center"
        >
          {emptyCopy.body}
        </AppText>
      </View>
    );
  }

  return (
    <View
      ref={overlayRootRef}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <View
        style={[
          darkStyles.root,
          {
            paddingTop: insets.top + topChromeHeight + desktopTopInset,
          },
        ]}
      >
        <PathStatsBar pathMode="normal" />
        <HomeMainButton
          unitLabel={activeSectionDisplay.unitLabel}
          sectionTitle={activeSectionDisplay.sectionTitle}
          faceColor={buttonColors.face}
          rimColor={buttonColors.rim}
          unitIndex={activeSectionIndex}
          pathMode="normal"
        />

        <SectionList<LessonListItem, SectionDataItem>
          sections={visibleSections}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListFooterComponent={renderFooter}
          ref={listRef}
          renderSectionHeader={renderSectionHeader}
          onLayout={onListLayout}
          {...(Platform.OS !== "web" ? { onContentSizeChange } : {})}
          onScroll={onScroll}
          onScrollBeginDrag={dismissLesson}
          onScrollToIndexFailed={onScrollToIndexFailed}
          scrollEventThrottle={16}
          style={darkStyles.list}
          contentContainerStyle={[
            darkStyles.listContent,
            { paddingBottom: tabBarScrollPadding(insets.bottom) },
          ]}
          stickySectionHeadersEnabled={false}
          // Virtualization budget scales with the device: old hardware wins more
          // from a small render window than from any single visual effect.
          initialNumToRender={PATH_LIST_TUNING.initialNumToRender}
          maxToRenderPerBatch={PATH_LIST_TUNING.maxToRenderPerBatch}
          windowSize={PATH_LIST_TUNING.windowSize}
          removeClippedSubviews={PATH_LIST_REMOVE_CLIPPED}
          updateCellsBatchingPeriod={PATH_LIST_TUNING.updateCellsBatchingPeriod}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
        />
      </View>
      <PathLessonPopup
        selection={selectedLesson}
        pathMode="normal"
        onDismiss={dismissLesson}
      />
    </View>
  );
}

const darkStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "transparent" },
  list: { flex: 1, backgroundColor: "transparent" },
  listContent: { backgroundColor: "transparent", paddingTop: 4 },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 10,
  },
  emptyTitle: { fontSize: 20, lineHeight: 28, color: "#F8FAFC" },
  emptyBody: { fontSize: 14, lineHeight: 22, color: "#CBD5E1" },
  sectionHeader: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 2,
  },
  sectionLine: { flex: 1, height: 1, backgroundColor: "#E2E8F0" },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    letterSpacing: 0.5,
    maxWidth: "62%",
    textAlign: "center",
  },
});
