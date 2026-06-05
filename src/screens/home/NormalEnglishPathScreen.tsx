/**
 * NormalHomeScreen — "Normal English" learning path.
 * Dark slate theme. Structurally mirrors HomeScreen completely.
 */

import { AppText } from "@/components/ui/AppText";
import { BUTTON_FACE_RIM_COLORS } from "@/constants/button-theme-colors";
import { tabBarScrollPadding } from "@/constants/layout";
import type { LessonListItem, SectionDataItem, SectionTheme } from "@/data/list-items";
import { buildNormalSectionData } from "@/data/normal-english";
import { usePathScrollAfterLesson } from "@/hooks/usePathScrollAfterLesson";
import { useProgressStore } from "@/stores/useProgressStore";
import {
  getPathUnitTitle,
  localizePathSections,
  splitPathUnitTitle,
} from "@/data/path-unit-titles";
import { useI18n } from "@/hooks/useI18n";
import { HomeMeshBackground } from "@/components/ui/ios-liquid-home";
import { ltrText, rtlText } from "@/screens/lesson/games/game-text";
import { PATH_LIST_REMOVE_CLIPPED } from "@/utils/native-perf";
import React, { useCallback, useMemo, useRef, useState } from "react";
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

const keyExtractor = (item: { id: string }) => `ne-${item.id}`;

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

export function NormalEnglishPathScreen() {
  const insets = useSafeAreaInsets();
  const { locale, isKu } = useI18n();
  const { width: windowWidth } = useWindowDimensions();
  const listRef = useRef<SectionList<LessonListItem, SectionDataItem>>(null);
  const scrollYRef = useRef(0);
  const contentHeightRef = useRef(0);
  const viewportHeightRef = useRef(0);
  const maxScrollYRef = useRef(0);
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 100,
  }).current;

  const normalNextLessonPathIndex = useProgressStore(
    (s) => s.normalNextLessonPathIndex,
  );
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [activeSectionTheme, setActiveSectionTheme] = useState<SectionTheme>(
    "blue",
  );

  const localizedSections = useMemo(
    () =>
      localizePathSections(
        buildNormalSectionData(normalNextLessonPathIndex),
        "normal",
        locale,
      ),
    [locale, normalNextLessonPathIndex],
  );

  usePathScrollAfterLesson("normal", localizedSections, listRef);

  const activeSectionDisplay = useMemo(() => {
    const fullTitle = getPathUnitTitle("normal", activeSectionIndex, locale);
    return splitPathUnitTitle(fullTitle);
  }, [activeSectionIndex, locale]);

  const buttonColors =
    BUTTON_FACE_RIM_COLORS[
      activeSectionTheme as keyof typeof BUTTON_FACE_RIM_COLORS
    ] ?? BUTTON_FACE_RIM_COLORS.blue;

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

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollYRef.current = e.nativeEvent.contentOffset.y;
    },
    [],
  );

  const renderItem = useCallback(
    ({ item }: SectionListRenderItemInfo<LessonListItem, SectionDataItem>) => (
      <ListItem item={item} screenWidth={windowWidth} pathMode="normal" />
    ),
    [windowWidth],
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
    <View style={{ flex: 1 }}>
      <HomeMeshBackground />
      <View
        style={[
          darkStyles.root,
          {
            paddingTop: insets.top + PATH_TOP_CHROME_HEIGHT,
          },
        ]}
      >
        <HomeMainButton
          unitLabel={activeSectionDisplay.unitLabel}
          sectionTitle={activeSectionDisplay.sectionTitle}
          faceColor={buttonColors.face}
          rimColor={buttonColors.rim}
          unitIndex={activeSectionIndex}
          pathMode="normal"
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
    </View>
  );
}

const darkStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "transparent" },
  list: { flex: 1, backgroundColor: "transparent" },
  listContent: { backgroundColor: "transparent", paddingTop: 24 },
  sectionHeader: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  sectionLine: { flex: 1, height: 1, backgroundColor: "#E2E8F0" },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    letterSpacing: 0.5,
    maxWidth: "62%",
    textAlign: "center",
  },
});
