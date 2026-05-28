import { BUTTON_FACE_RIM_COLORS } from "@/constants/button-theme-colors";
import { sectionData, SectionTheme } from "@/data/list-items";
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
import { HomeMeshBackground } from "@/components/ui/ios-liquid-home";
import { PATH_LIST_REMOVE_CLIPPED } from "@/utils/native-perf";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { tabBarScrollPadding } from "@/constants/layout";
import { PATH_SWITCHER_HEIGHT } from "./components/PathModeTabs";
import { HomeMainButton } from "./components/home-main-button";
import { ListFooter } from "./components/list-footer";
import { ListItem } from "./components/list-item";
import { ListSectionHeader } from "./components/list-section-header";

const keyExtractor = (item: { id: string }) => `${item.id}`;

const renderSectionHeader = ({ section }: { section: { title: string } }) => (
  <ListSectionHeader section={section} />
);

export const StreetEnglishPathScreen = () => {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const listRef = useRef<SectionList<any>>(null);
  const scrollYRef = useRef(0);
  const contentHeightRef = useRef(0);
  const viewportHeightRef = useRef(0);
  const maxScrollYRef = useRef(0);
  const [activeSectionTitle, setActiveSectionTitle] = useState(
    sectionData[0]?.title ?? "",
  );
  const [activeSectionTheme, setActiveSectionTheme] = useState(
    sectionData[0]?.displayTheme ?? "green",
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
    ({ item }: SectionListRenderItemInfo<any>) => (
      <ListItem item={item} screenWidth={windowWidth} pathMode="street" />
    ),
    [windowWidth],
  );

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    const firstVisible = viewableItems?.[0]?.section;
    const nextTitle = firstVisible?.title;
    const nextTheme = firstVisible?.displayTheme;

    if (typeof nextTitle === "string" && nextTitle.length > 0) {
      setActiveSectionTitle((prev) => (prev === nextTitle ? prev : nextTitle));
      const idx = sectionData.findIndex((s) => s.title === nextTitle);
      if (idx !== -1) setActiveSectionIndex((prev) => (prev === idx ? prev : idx));
    }
    if (typeof nextTheme === "string" && nextTheme in BUTTON_FACE_RIM_COLORS) {
      const typedTheme = nextTheme as SectionTheme;
      setActiveSectionTheme((prev: SectionTheme) =>
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
          paddingTop: insets.top + PATH_SWITCHER_HEIGHT + 4,
        }}
      >
        <HomeMainButton
          unitLabel={activeSectionDisplay.unitLabel}
          sectionTitle={activeSectionDisplay.sectionTitle}
          faceColor={buttonColors.face}
          rimColor={buttonColors.rim}
          unitIndex={activeSectionIndex}
        />
        <SectionList
          sections={sectionData}
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
