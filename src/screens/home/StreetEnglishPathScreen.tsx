/* eslint-disable */
import { BUTTON_FACE_RIM_COLORS } from "../../constants/button-theme-colors";
import { tabBarScrollPadding } from "../../constants/layout";
import {
  buildSectionData,
  type LessonListItem,
  type SectionDataItem,
  type SectionTheme,
} from "../../data/list-items";
import { usePathScrollAfterLesson } from "../../hooks/usePathScrollAfterLesson";
import { usePathLessonSelection } from "../../hooks/use-path-lesson-selection";
import {
  useProgressStore,
  useCurrentProgress,
} from "../../stores/useProgressStore";
import {
  getPathUnitTitle,
  localizePathSections,
  splitPathUnitTitle,
} from "../../data/path-unit-titles";
import { useI18n } from "../../hooks/useI18n";
import { HomeMeshBackground } from "../../components/ui/ios-liquid-home";
import { PATH_LIST_REMOVE_CLIPPED } from "../../utils/native-perf";
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
import { ListFooter } from "./components/list-footer";
import { ListItem } from "./components/list-item";
import { ListSectionHeader } from "./components/list-section-header";
import { PathStatsBar } from "./components/path-stats-bar";
import { PathLessonPopup } from "./components/path-lesson-popup";

import { useThemeColors } from "../../hooks/useThemeColors";
import {
  isDesktopWebWidth,
  WEB_DESKTOP_PATH_WIDTH,
} from "../../constants/web-layout";

const keyExtractor = (item: { id: string }) => `${item.id}`;

export const StreetEnglishPathScreen = ({
  topChromeHeight = PATH_TOP_CHROME_HEIGHT,
}: {
  topChromeHeight?: number;
} = {}) => {
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
  const nextLessonPathIndex = useCurrentProgress().nextLessonPathIndex;
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [activeSectionTheme, setActiveSectionTheme] =
    useState<SectionTheme>("green");

  const localizedSections = useMemo(
    () =>
      localizePathSections(
        buildSectionData(nextLessonPathIndex),
        "street",
        locale,
      ),
    [locale, nextLessonPathIndex],
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

  usePathScrollAfterLesson("street", localizedSections, listRef);

  const activeSectionDisplay = useMemo(() => {
    const fullTitle = getPathUnitTitle("street", activeSectionIndex, locale);
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
      lightColorSets[activeSectionTheme] ?? { rim: "#0B8A6C", face: "#08c296" }
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
      <ListItem
        item={item}
        screenWidth={pathLayoutWidth}
        unitLessonCount={section.data.length}
        pathMode="street"
        isActiveLesson={item.pathIndex === nextLessonPathIndex}
        isSelected={selectedLesson?.item.id === item.id}
        onSelect={(node) =>
          selectLesson(item, section.title, node, section.data.length)
        }
      />
    ),
    [nextLessonPathIndex, pathLayoutWidth, selectLesson, selectedLesson?.item.id],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: SectionDataItem }) => (
      <ListSectionHeader section={section} />
    ),
    [],
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
      {!isDark && <HomeMeshBackground />}
      <View
        style={{
          flex: 1,
          paddingTop: insets.top + topChromeHeight + desktopTopInset,
        }}
      >
        <PathStatsBar pathMode="street" />
        <HomeMainButton
          unitLabel={activeSectionDisplay.unitLabel}
          sectionTitle={activeSectionDisplay.sectionTitle}
          faceColor={buttonColors.face}
          rimColor={buttonColors.rim}
          unitIndex={activeSectionIndex}
          pathMode="street"
        />
        <SectionList<LessonListItem, SectionDataItem>
          sections={visibleSections}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ref={listRef}
          renderSectionHeader={renderSectionHeader}
          onLayout={onListLayout}
          {...(Platform.OS !== "web" ? { onContentSizeChange } : {})}
          onScroll={onScroll}
          onScrollBeginDrag={dismissLesson}
          onTouchMove={dismissLesson}
          scrollEventThrottle={16}
          style={styles.list}
          ListFooterComponent={renderFooter}
          contentContainerStyle={[
            styles.listContainer,
            { paddingBottom: tabBarScrollPadding(insets.bottom) },
          ]}
          stickySectionHeadersEnabled={false}
          initialNumToRender={10}
          maxToRenderPerBatch={8}
          windowSize={5}
          removeClippedSubviews={PATH_LIST_REMOVE_CLIPPED}
          updateCellsBatchingPeriod={50}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
        />
      </View>
      <PathLessonPopup
        selection={selectedLesson}
        pathMode="street"
        onDismiss={dismissLesson}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 10,
    backgroundColor: "transparent",
    paddingTop: 8,
  },
  list: { flex: 1, width: "100%", backgroundColor: "transparent" },
});

/** Re-export for callers that need fresh progress-based sections */
export { buildSectionData };
