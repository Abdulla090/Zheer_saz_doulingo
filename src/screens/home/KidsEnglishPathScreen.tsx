/**
 * KidsEnglishPathScreen — playful "Kids" learning path.
 * Structurally mirrors the Street/Normal path screens, driven by kids progress.
 */

import { BUTTON_FACE_RIM_COLORS } from "@/constants/button-theme-colors";
import { tabBarScrollPadding } from "@/constants/layout";
import {
  type LessonListItem,
  type SectionDataItem,
  type SectionTheme,
} from "@/data/list-items";
import { buildKidsSectionData } from "@/data/kids-english";
import {
  getPathUnitTitle,
  localizePathSections,
  splitPathUnitTitle,
} from "@/data/path-unit-titles";
import { useI18n } from "@/hooks/useI18n";
import { HomeMeshBackground } from "@/components/ui/ios-liquid-home";
import { usePathScrollAfterLesson } from "@/hooks/usePathScrollAfterLesson";
import { useProgressStore } from "@/stores/useProgressStore";
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
import { KidsPathListRow } from "./components/kids-path-list-row";
import { PATH_LIST_REMOVE_CLIPPED } from "@/utils/native-perf";

const keyExtractor = (item: { id: string }) => `${item.id}`;

export function KidsEnglishPathScreen() {
  const insets = useSafeAreaInsets();
  const { locale } = useI18n();
  const { width: windowWidth } = useWindowDimensions();
  const listRef = useRef<SectionList<LessonListItem, SectionDataItem>>(null);
  const scrollYRef = useRef(0);
  const contentHeightRef = useRef(0);
  const viewportHeightRef = useRef(0);
  const maxScrollYRef = useRef(0);

  const kidsNextLessonPathIndex = useProgressStore(
    (s) => s.kidsNextLessonPathIndex,
  );
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [activeSectionTheme, setActiveSectionTheme] = useState<SectionTheme>(
    "green",
  );

  const localizedSections = useMemo(
    () =>
      localizePathSections(
        buildKidsSectionData(kidsNextLessonPathIndex),
        "kids",
        locale,
      ),
    [locale, kidsNextLessonPathIndex],
  );

  usePathScrollAfterLesson("kids", localizedSections, listRef);

  const activeSectionDisplay = useMemo(() => {
    const fullTitle = getPathUnitTitle("kids", activeSectionIndex, locale);
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
      <KidsPathListRow item={item} screenWidth={windowWidth} />
    ),
    [windowWidth],
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
          paddingTop: insets.top + PATH_TOP_CHROME_HEIGHT + 4,
        }}
      >
        <HomeMainButton
          unitLabel={activeSectionDisplay.unitLabel}
          sectionTitle={activeSectionDisplay.sectionTitle}
          faceColor={buttonColors.face}
          rimColor={buttonColors.rim}
          unitIndex={activeSectionIndex}
          pathMode="kids"
        />
        <SectionList<LessonListItem, SectionDataItem>
          sections={localizedSections}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ref={listRef}
          onLayout={onListLayout}
          {...(Platform.OS !== "web" ? { onContentSizeChange } : {})}
          onScroll={onScroll}
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
          onViewableItemsChanged={onViewableItemsChanged}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 10,
    backgroundColor: "transparent",
    paddingTop: 24,
  },
  list: { flex: 1, width: "100%", backgroundColor: "transparent" },
});
