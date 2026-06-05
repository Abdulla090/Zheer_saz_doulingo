import { BUTTON_FACE_RIM_COLORS } from "@/constants/button-theme-colors";
import { tabBarScrollPadding } from "@/constants/layout";
import {
  buildSectionData,
  type LessonListItem,
  type SectionDataItem,
  type SectionTheme,
} from "@/data/list-items";
import { usePathScrollAfterLesson } from "@/hooks/usePathScrollAfterLesson";
import { useProgressStore } from "@/stores/useProgressStore";
import {
  getPathUnitTitle,
  localizePathSections,
  splitPathUnitTitle,
} from "@/data/path-unit-titles";
import { useI18n } from "@/hooks/useI18n";
import { HomeMeshBackground } from "@/components/ui/ios-liquid-home";
import { PATH_LIST_REMOVE_CLIPPED } from "@/utils/native-perf";
import { useCallback, useMemo, useRef, useState } from "react";
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

const keyExtractor = (item: { id: string }) => `${item.id}`;

export const StreetEnglishPathScreen = () => {
  const insets = useSafeAreaInsets();
  const { locale } = useI18n();
  const { width: windowWidth } = useWindowDimensions();
  const listRef = useRef<SectionList<LessonListItem, SectionDataItem>>(null);
  const scrollYRef = useRef(0);
  const contentHeightRef = useRef(0);
  const viewportHeightRef = useRef(0);
  const maxScrollYRef = useRef(0);
  const nextLessonPathIndex = useProgressStore((s) => s.nextLessonPathIndex);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [activeSectionTheme, setActiveSectionTheme] = useState<SectionTheme>(
    "green",
  );

  const localizedSections = useMemo(
    () =>
      localizePathSections(
        buildSectionData(nextLessonPathIndex),
        "street",
        locale,
      ),
    [locale, nextLessonPathIndex],
  );

  usePathScrollAfterLesson("street", localizedSections, listRef);

  const activeSectionDisplay = useMemo(() => {
    const fullTitle = getPathUnitTitle("street", activeSectionIndex, locale);
    return splitPathUnitTitle(fullTitle);
  }, [activeSectionIndex, locale]);

  const buttonColors =
    BUTTON_FACE_RIM_COLORS[
      activeSectionTheme as keyof typeof BUTTON_FACE_RIM_COLORS
    ] ?? BUTTON_FACE_RIM_COLORS.green;

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
    ({ item }: SectionListRenderItemInfo<LessonListItem, SectionDataItem>) => (
      <ListItem item={item} screenWidth={windowWidth} pathMode="street" />
    ),
    [windowWidth],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: SectionDataItem }) => (
      <ListSectionHeader section={section} />
    ),
    [],
  );

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
    <View style={{ flex: 1 }}>
      <HomeMeshBackground />
      <View
        style={{
          flex: 1,
          paddingTop: insets.top + PATH_TOP_CHROME_HEIGHT,
        }}
      >
        <HomeMainButton
          unitLabel={activeSectionDisplay.unitLabel}
          sectionTitle={activeSectionDisplay.sectionTitle}
          faceColor={buttonColors.face}
          rimColor={buttonColors.rim}
          unitIndex={activeSectionIndex}
          pathMode="street"
        />
        <SectionList<LessonListItem, SectionDataItem>
          sections={localizedSections}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ref={listRef}
          renderSectionHeader={renderSectionHeader}
          onLayout={onListLayout}
          {...(Platform.OS !== "web" ? { onContentSizeChange } : {})}
          onScroll={onScroll}
          scrollEventThrottle={16}
          style={styles.list}
          ListFooterComponent={ListFooter}
          contentContainerStyle={[
            styles.listContainer,
            { paddingBottom: tabBarScrollPadding(insets.bottom) },
          ]}
          stickySectionHeadersEnabled={false}
          initialNumToRender={6}
          maxToRenderPerBatch={4}
          windowSize={3}
          removeClippedSubviews={PATH_LIST_REMOVE_CLIPPED}
          updateCellsBatchingPeriod={100}
          onViewableItemsChanged={onViewableItemsChanged}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 10,
    backgroundColor: "transparent",
    paddingTop: 24,
  },
  list: { flex: 1, width: "100%", backgroundColor: "transparent" },
});

/** Re-export for callers that need fresh progress-based sections */
export { buildSectionData };
