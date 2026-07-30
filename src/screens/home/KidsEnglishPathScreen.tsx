/* eslint-disable */
/**
 * KidsEnglishPathScreen — playful "Kids" learning path.
 * Structurally mirrors the Street/Normal path screens, driven by kids progress.
 */

import {
  BUTTON_FACE_RIM_COLORS,
  KIDS_BUTTON_FACE_RIM_COLORS,
} from "../../constants/button-theme-colors";
import { tabBarScrollPadding } from "../../constants/layout";
import { LinearGradient } from "expo-linear-gradient";
import {
  type LessonListItem,
  type SectionDataItem,
  type SectionTheme,
} from "../../data/list-items";
import { buildKidsSectionData } from "../../data/kids-english";
import {
  getPathUnitTitle,
  localizePathSections,
  splitPathUnitTitle,
} from "../../data/path-unit-titles";
import { useI18n } from "../../hooks/useI18n";
import { HomeMeshBackground } from "../../components/ui/ios-liquid-home";
import { usePathScrollAfterLesson } from "../../hooks/usePathScrollAfterLesson";
import { usePathLessonSelection } from "../../hooks/use-path-lesson-selection";
import { useCurrentProgress } from "../../stores/useProgressStore";
import { useThemeColors } from "../../hooks/useThemeColors";
import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { AppText } from "../../components/ui/AppText";
import { PressableScale } from "../../components/animations/PressableScale";
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
import { PATH_TOP_CHROME_HEIGHT } from "./components/PathModeTabs";
import { HomeMainButton } from "./components/home-main-button";
import { KidsPathListRow } from "./components/kids-path-list-row";
import { PathStatsBar } from "./components/path-stats-bar";
import { PathLessonPopup } from "./components/path-lesson-popup";
import { PATH_LIST_REMOVE_CLIPPED } from "../../utils/native-perf";
import {
  isDesktopWebWidth,
  WEB_DESKTOP_PATH_WIDTH,
} from "../../constants/web-layout";

import { ListFooter } from "./components/list-footer";

const keyExtractor = (item: { id: string }) => `${item.id}`;

export function KidsEnglishPathScreen({
  topChromeHeight = PATH_TOP_CHROME_HEIGHT,
}: {
  topChromeHeight?: number;
} = {}) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useThemeColors();
  const { locale } = useI18n();
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

  const { kidsNextLessonPathIndex } = useCurrentProgress();
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [activeSectionTheme, setActiveSectionTheme] =
    useState<SectionTheme>("green");

  const localizedSections = useMemo(
    () =>
      localizePathSections(
        buildKidsSectionData(kidsNextLessonPathIndex),
        "kids",
        locale,
      ),
    [locale, kidsNextLessonPathIndex],
  );

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
            backgroundColor: "#58CC02", // Duolingo Green for kids
            borderRadius: 20,
            borderBottomWidth: 4,
            borderBottomColor: "#3F9302",
          }}
          onPress={() => setVisibleUnitsCount((prev) => prev + 2)}
        >
          <AppText
            style={{
              color: "#FFFFFF",
              fontSize: 16,
              fontFamily: "DINNextRoundedBold",
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

  usePathScrollAfterLesson("kids", localizedSections, listRef);

  const activeSectionDisplay = useMemo(() => {
    const fullTitle = getPathUnitTitle("kids", activeSectionIndex, locale);
    return splitPathUnitTitle(fullTitle);
  }, [activeSectionIndex, locale]);

  const buttonColors = useMemo(() => {
    if (isDark) {
      return { rim: "#0F172A", face: "#1E293B" };
    }
    const lightColorSets: Record<string, { face: string; rim: string }> = {
      green: { rim: "#58A700", face: "#58CC02" },
      purple: { rim: "#7C3AED", face: "#A78BFA" },
      blue: { rim: "#1490CC", face: "#1CB0F6" },
      mint: { rim: "#0D9488", face: "#2DD4BF" },
      gray: { rim: "#94A3B8", face: "#CBD5E1" },
      yellow: { rim: "#E6A700", face: "#FFC800" },
      orange: { rim: "#EA580C", face: "#FB923C" },
      red: { rim: "#EA2B2B", face: "#FF4B4B" },
    };
    return (
      lightColorSets[activeSectionTheme] ?? { rim: "#58A700", face: "#58CC02" }
    );
  }, [isDark, activeSectionTheme]);

  const recalcMaxScroll = useCallback(() => {
    maxScrollYRef.current = Math.max(
      0,
      contentHeightRef.current - viewportHeightRef.current,
    );
  }, []);

  const onListLayout = useCallback(
    (event: { nativeEvent: { layout: { height: number } } }) => {
      viewportHeightRef.current = event.nativeEvent.layout.height;
      recalcMaxScroll();
    },
    [recalcMaxScroll],
  );

  const onContentSizeChange = useCallback(
    (_width: number, height: number) => {
      contentHeightRef.current = height;
      recalcMaxScroll();
    },
    [recalcMaxScroll],
  );

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollYRef.current = event.nativeEvent.contentOffset.y;
    },
    [],
  );

  const renderItem = useCallback(
    ({
      item,
      section,
    }: SectionListRenderItemInfo<LessonListItem, SectionDataItem>) => (
      <KidsPathListRow
        item={item}
        screenWidth={pathLayoutWidth}
        unitLessonCount={section.data.length}
        isActiveLesson={item.pathIndex === kidsNextLessonPathIndex}
        isSelected={selectedLesson?.item.id === item.id}
        onSelect={(node) => selectLesson(item, section.title, node)}
      />
    ),
    [
      kidsNextLessonPathIndex,
      selectLesson,
      selectedLesson?.item.id,
      pathLayoutWidth,
    ],
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 100,
  }).current;

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    const firstVisible = viewableItems?.[0]?.section;
    const nextIndex = firstVisible?.unitIndex;
    const nextTheme = firstVisible?.displayTheme;

    if (typeof nextIndex === "number" && nextIndex >= 0) {
      setActiveSectionIndex((prev) => (prev === nextIndex ? prev : nextIndex));
    }
    if (typeof nextTheme === "string" && nextTheme in BUTTON_FACE_RIM_COLORS) {
      const typedTheme = nextTheme as SectionTheme;
      setActiveSectionTheme((prev) =>
        prev === typedTheme ? prev : typedTheme,
      );
    }
  }).current;

  return (
    <View
      ref={overlayRootRef}
      style={{ flex: 1, backgroundColor: colors.background }}
      onTouchStart={dismissLesson}
    >
      {!isDark && <KidsMeshBackground />}
      <View
        style={{
          flex: 1,
          paddingTop: insets.top + topChromeHeight + desktopTopInset,
        }}
      >
        <PathStatsBar pathMode="kids" />
        <HomeMainButton
          unitLabel={activeSectionDisplay.unitLabel}
          sectionTitle={activeSectionDisplay.sectionTitle}
          faceColor={buttonColors.face}
          rimColor={buttonColors.rim}
          unitIndex={activeSectionIndex}
          pathMode="kids"
        />
        <SectionList<LessonListItem, SectionDataItem>
          sections={visibleSections}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListFooterComponent={renderFooter}
          ref={listRef}
          onLayout={onListLayout}
          {...(Platform.OS !== "web" ? { onContentSizeChange } : {})}
          onScroll={onScroll}
          onScrollBeginDrag={dismissLesson}
          onTouchMove={dismissLesson}
          scrollEventThrottle={16}
          style={styles.list}
          contentContainerStyle={[
            styles.listContainer,
            { paddingBottom: tabBarScrollPadding(insets.bottom) },
          ]}
          stickySectionHeadersEnabled={false}
          initialNumToRender={6}
          maxToRenderPerBatch={4}
          windowSize={3}
          removeClippedSubviews={false}
          updateCellsBatchingPeriod={100}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
        />
      </View>
      <PathLessonPopup
        selection={selectedLesson}
        pathMode="kids"
        onDismiss={dismissLesson}
      />
    </View>
  );
}

function KidsMeshBackground() {
  return (
    <>
      <LinearGradient
        colors={[
          "#E0F2FE", // Soft blue
          "#F0FDF4", // Soft green/mint
          "#FFF7ED", // Soft orange
        ]}
        locations={[0, 0.46, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View
        style={[
          styles.meshOrb,
          { top: -90, left: -70, backgroundColor: "rgba(251, 146, 60, 0.16)" },
        ]}
        pointerEvents="none"
      />
      <View
        style={[
          styles.meshOrb,
          { top: -70, right: -62, backgroundColor: "rgba(56, 189, 248, 0.16)" },
        ]}
        pointerEvents="none"
      />
      <View
        style={[
          styles.meshOrb,
          {
            top: 292,
            left: -74,
            width: 190,
            height: 190,
            borderRadius: 95,
            backgroundColor: "rgba(250, 204, 21, 0.14)",
          },
        ]}
        pointerEvents="none"
      />
    </>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 10,
    backgroundColor: "transparent",
    paddingTop: 8,
  },
  list: { flex: 1, width: "100%", backgroundColor: "transparent" },
  meshOrb: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 115,
  },
});
