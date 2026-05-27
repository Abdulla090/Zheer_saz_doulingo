/**
 * NormalHomeScreen — "Normal English" learning path.
 * Dark slate theme. Structurally mirrors HomeScreen completely.
 */

import { BUTTON_FACE_RIM_COLORS } from "@/constants/button-theme-colors";
import type { SectionTheme } from "@/data/list-items";
import { normalSectionData } from "@/data/normal-english";
import { Image } from "expo-image";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  SectionList,
  SectionListRenderItemInfo,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeMainButton } from "./components/home-main-button";
import { PATH_SWITCHER_HEIGHT } from "./components/PathModeTabs";
import { ListItem } from "./components/list-item";

const keyExtractor = (item: { id: string }) => `ne-${item.id}`;

const NormalSectionHeader = React.memo(({ section }: { section: { title: string } }) => {
  const isFirst = section.title === normalSectionData[0]?.title;
  if (isFirst) return null;
  return (
    <View style={darkStyles.sectionHeader}>
      <View style={darkStyles.sectionLine} />
      <Text style={darkStyles.sectionTitle}>{section.title}</Text>
      <View style={darkStyles.sectionLine} />
    </View>
  );
});

const renderSectionHeader = ({ section }: { section: { title: string } }) => (
  <NormalSectionHeader section={section} />
);

const ListFooterSpacer = () => <View style={{ height: 120 }} />;

export function NormalEnglishPathScreen() {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const listRef = useRef<SectionList<any>>(null);
  const scrollYRef = useRef(0);
  const contentHeightRef = useRef(0);
  const viewportHeightRef = useRef(0);
  const maxScrollYRef = useRef(0);
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 100,
  }).current;

  const [activeSectionTitle, setActiveSectionTitle] = useState(
    normalSectionData[0]?.title ?? "",
  );
  const [activeSectionTheme, setActiveSectionTheme] = useState<SectionTheme>(
    normalSectionData[0]?.displayTheme ?? "blue",
  );
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  const activeSectionDisplay = useMemo(() => {
    const [unitLabel, ...rest] = activeSectionTitle.split(":");
    return {
      unitLabel: unitLabel?.trim() || "Unit",
      sectionTitle: rest.join(":").trim() || activeSectionTitle,
    };
  }, [activeSectionTitle]);

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
    ({ item }: SectionListRenderItemInfo<any>) => (
      <ListItem item={item} screenWidth={windowWidth} pathMode="normal" />
    ),
    [windowWidth],
  );

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    const firstVisible = viewableItems?.[0]?.section;
    const nextTitle = firstVisible?.title;
    const nextTheme = firstVisible?.displayTheme;

    if (typeof nextTitle === "string" && nextTitle.length > 0) {
      setActiveSectionTitle((prev) => (prev === nextTitle ? prev : nextTitle));
      const idx = normalSectionData.findIndex((s) => s.title === nextTitle);
      if (idx !== -1) setActiveSectionIndex((prev) => (prev === idx ? prev : idx));
    }
    if (typeof nextTheme === "string" && nextTheme in BUTTON_FACE_RIM_COLORS) {
      setActiveSectionTheme((prev) =>
        prev === nextTheme ? prev : (nextTheme as SectionTheme),
      );
    }
  }).current;

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={require("../../../assets/images/oceanbg.png")}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        cachePolicy="memory-disk"
        priority="low"
      />
      <View
        style={[
          darkStyles.root,
          {
            backgroundColor: "transparent",
            paddingTop: insets.top + PATH_SWITCHER_HEIGHT + 4,
          },
        ]}
      >
        <HomeMainButton
          unitLabel={activeSectionDisplay.unitLabel}
          sectionTitle={activeSectionDisplay.sectionTitle}
          faceColor={buttonColors.face}
          rimColor={buttonColors.rim}
          unitIndex={activeSectionIndex}
        />

        <SectionList
          sections={normalSectionData}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ref={listRef}
          renderSectionHeader={renderSectionHeader}
          onLayout={onListLayout}
          {...(Platform.OS !== "web" ? { onContentSizeChange } : {})}
          onScroll={onScroll}
          scrollEventThrottle={16}
          style={darkStyles.list}
          ListFooterComponent={ListFooterSpacer}
          contentContainerStyle={darkStyles.listContent}
          stickySectionHeadersEnabled={false}
          initialNumToRender={6}
          maxToRenderPerBatch={4}
          windowSize={3}
          removeClippedSubviews
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
  listContent: { paddingBottom: 10, backgroundColor: "transparent", paddingTop: 24 },
  sectionHeader: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  sectionLine: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.28)" },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
    letterSpacing: 0.5,
    maxWidth: "62%",
    textAlign: "center",
  },
});
