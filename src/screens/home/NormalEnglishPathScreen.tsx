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
import { resolveUnitLessonStatus, type LessonType } from "../../data/list-items";
import { usePathScrollAfterLesson } from "../../hooks/usePathScrollAfterLesson";
import { usePathLessonSelection } from "../../hooks/use-path-lesson-selection";
import { useCurrentProgress } from "../../stores/useProgressStore";
import {
  getSkippedUnitsCount,
  normalSectionConfigs,
} from "../../data/normal-english";
import { ListFooter } from "./components/list-footer";
import { useSettingsStore } from "../../stores/useSettingsStore";
import {
  getPathUnitTitle,
  localizePathSections,
  splitPathUnitTitle,
} from "../../data/path-unit-titles";
import { useI18n } from "../../hooks/useI18n";
import { ltrText, rtlText } from "../lesson/games/game-text";
import { PATH_LIST_REMOVE_CLIPPED } from "../../utils/native-perf";
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
import { Image } from "expo-image";
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

const NORMAL_PATH_BACKGROUNDS = [
  require("../../../assets/images/path-backgrounds/normal-viking.png"),
  require("../../../assets/images/path-backgrounds/normal-rome.png"),
  require("../../../assets/images/path-backgrounds/normal-islamic-golden-age.png"),
  require("../../../assets/images/path-backgrounds/normal-egypt.png"),
  require("../../../assets/images/path-backgrounds/normal-east-asia.png"),
  require("../../../assets/images/path-backgrounds/normal-maya.png"),
  require("../../../assets/images/path-backgrounds/normal-mali.png"),
  require("../../../assets/images/path-backgrounds/normal-renaissance.png"),
  require("../../../assets/images/path-backgrounds/normal-polynesia.png"),
] as const;

const NormalSectionHeader = React.memo(
  ({ section, isKu }: { section: SectionDataItem; isKu: boolean }) => {
    if (section.unitIndex === 0) return null;
    const direction = isKu ? rtlText : ltrText;

    return (
      <View style={darkStyles.sectionHeader}>
        <View style={darkStyles.sectionLine} />
        <AppText
          style={[darkStyles.sectionTitle, direction]}
          forceKurdishFont={isKu}
          forceLatinFont={!isKu}
          numberOfLines={2}
        >
          {section.title}
        </AppText>
        <View style={darkStyles.sectionLine} />
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
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [activeSectionTheme, setActiveSectionTheme] =
    useState<SectionTheme>("blue");
  const activePathBackground =
    NORMAL_PATH_BACKGROUNDS[
      Math.abs(activeSectionIndex) % NORMAL_PATH_BACKGROUNDS.length
    ];

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
          type: "practice" as LessonType,
          sectionTheme: displayTheme,
          displayTheme,
          status: itemStatus,
          isCurrent: itemStatus === "current",
          progressSegments: itemStatus === "current" ? 2 : 0,
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
            backgroundColor: "#0F172A",
            borderRadius: 20,
            borderBottomWidth: 4,
            borderBottomColor: "#020617",
          }}
          onPress={() => setVisibleUnitsCount((prev) => prev + 2)}
        >
          <AppText
            style={{
              color: "#FFFFFF",
              fontSize: 16,
              fontFamily: "DINNextRoundedBold",
            }}
            forceLatinFont
          >
            See More Units
          </AppText>
        </PressableScale>
      </View>
    );
  }, [hasMore]);

  usePathScrollAfterLesson("normal", localizedSections, listRef);

  const activeSectionDisplay = useMemo(() => {
    const fullTitle = getPathUnitTitle("normal", activeSectionIndex, locale);
    return splitPathUnitTitle(fullTitle);
  }, [activeSectionIndex, locale]);

  const buttonColors = useMemo(() => {
    if (isDark) {
      return { rim: "#0F172A", face: "#1E293B" };
    }
    const lightColorSets: Record<string, { face: string; rim: string }> = {
      green: { rim: "#0B8A6C", face: "#08c296" },
      purple: { rim: "#5E35B1", face: "#7E57C2" },
      blue: { rim: "#0277BD", face: "#039BE5" },
      mint: { rim: "#00695C", face: "#00897B" },
      gray: { rim: "#90A4AE", face: "#B0BEC5" },
      yellow: { rim: "#F57F17", face: "#FBC02D" },
      orange: { rim: "#E65100", face: "#FF9800" },
      red: { rim: "#B71C1C", face: "#F44336" },
    };
    return (
      lightColorSets[activeSectionTheme] ?? { rim: "#0277BD", face: "#039BE5" }
    );
  }, [isDark, activeSectionTheme]);

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
        onSelect={(node) => selectLesson(item, section.title, node)}
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
      <NormalSectionHeader section={section} isKu={isKu} />
    ),
    [isKu],
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

  return (
    <View
      ref={overlayRootRef}
      style={{ flex: 1, backgroundColor: colors.background }}
      onTouchStart={dismissLesson}
    >
      <Image
        source={activePathBackground}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        cachePolicy="memory-disk"
        transition={240}
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
      {isDark ? <View pointerEvents="none" style={darkStyles.backgroundDim} /> : null}
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
          onTouchMove={dismissLesson}
          scrollEventThrottle={16}
          style={darkStyles.list}
          contentContainerStyle={[
            darkStyles.listContent,
            { paddingBottom: tabBarScrollPadding(insets.bottom) },
          ]}
          stickySectionHeadersEnabled={false}
          initialNumToRender={6}
          maxToRenderPerBatch={4}
          windowSize={3}
          removeClippedSubviews={PATH_LIST_REMOVE_CLIPPED}
          updateCellsBatchingPeriod={100}
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
  backgroundDim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(2, 6, 23, 0.72)",
  },
  list: { flex: 1, backgroundColor: "transparent" },
  listContent: { backgroundColor: "transparent", paddingTop: 4 },
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
