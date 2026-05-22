import { BUTTON_FACE_RIM_COLORS } from "@/constants/button-theme-colors";
import { sectionData, SectionTheme, type LessonType } from "@/data/list-items";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  SectionList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SectionListRenderItemInfo,
  StyleSheet,
  useWindowDimensions,
  View,
  Platform,
  ImageBackground,
} from "react-native";
import {
  ReduceMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeMainButton } from "./components/home-main-button";
import { LessonPressPopup } from "./components/lesson-press-popup";
import { ListFooter } from "./components/list-footer";
import { ListItem, ListItemPressMeasurement } from "./components/list-item";
import { ListSectionHeader } from "./components/list-section-header";

const keyExtractor = (item: any) => `${item.id}`;

const renderSectionHeader = ({ section }: any) => (
  <ListSectionHeader section={section} />
);

const POPUP_HEIGHT = 100;
const POPUP_GAP = 10;
const POPUP_LEFT_RATIO = 0.1;
const POPUP_WIDTH_RATIO = 0.8;
const POINTER_HALF = 8;
const POINTER_EDGE_PADDING = 12;
export const StreetEnglishPathScreen = () => {
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const tabBarHeight = useBottomTabBarHeight();
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
  const popupTop = useSharedValue(-POPUP_HEIGHT);
  const pointerCenterX = useSharedValue((windowWidth * POPUP_WIDTH_RATIO) / 2);
  const popupProgress = useSharedValue(0);
  const popupFaceColor = useSharedValue<string>(
    BUTTON_FACE_RIM_COLORS.green.face,
  );
  const popupRimColor = useSharedValue<string>(
    BUTTON_FACE_RIM_COLORS.green.rim,
  );
  const [popupLessonType, setPopupLessonType] =
    useState<LessonType>("practice");
  const [popupLessonId, setPopupLessonId] = useState(0);
  const [popupGlobalIndex, setPopupGlobalIndex] = useState(0);
  const [popupSectionItemIndex, setPopupSectionItemIndex] = useState(0);
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
    (event: any) => {
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

  const dismissPopup = useCallback(() => {
    popupProgress.value = withTiming(0, { duration: 120 });
  }, [popupProgress]);
  const handleLessonPress = useCallback(
    ({
      x,
      y,
      width,
      height,
      popupFaceColor: nextPopupFaceColor,
      popupRimColor: nextPopupRimColor,
      type,
      lessonId,
      globalIndex,
      sectionItemIndex,
    }: ListItemPressMeasurement) => {
      popupFaceColor.value = nextPopupFaceColor;
      popupRimColor.value = nextPopupRimColor;
      setPopupLessonType(type);
      setPopupLessonId(lessonId);
      setPopupGlobalIndex(globalIndex);
      setPopupSectionItemIndex(sectionItemIndex ?? 0);
      const viewportTop = insets.top;
      const viewportBottom = windowHeight - tabBarHeight;
      const usableHeight = Math.max(0, viewportBottom - viewportTop);
      const itemCenterY = y + height / 2;

      const lowerSafeCenterY = viewportTop + usableHeight * 0.65;
      let appliedDelta = 0;

      if (itemCenterY > lowerSafeCenterY) {
        const delta = itemCenterY - lowerSafeCenterY;

        if (Math.abs(delta) >= 4) {
          const nextOffset = Math.max(
            0,
            Math.min(scrollYRef.current + delta, maxScrollYRef.current),
          );

          appliedDelta = nextOffset - scrollYRef.current;

          listRef.current?.scrollToLocation?.({
            sectionIndex: sectionItemIndex > 0 ? 0 : 0,
            itemIndex: 0,
            animated: true,
            viewOffset: -nextOffset,
          });
        }
      }

      const expectedItemY = y - appliedDelta;
      const popupTopInWindow = expectedItemY + height + POPUP_GAP;
      const maxPopupTopInWindow = viewportBottom - POPUP_HEIGHT - POPUP_GAP;
      const clampedTopInWindow = Math.max(
        viewportTop + POPUP_GAP,
        Math.min(popupTopInWindow, maxPopupTopInWindow),
      );

      const popupLeft = windowWidth * POPUP_LEFT_RATIO;
      const popupWidth = windowWidth * POPUP_WIDTH_RATIO;
      const itemCenterX = x + width / 2;
      const minPointerCenter = POINTER_HALF + POINTER_EDGE_PADDING;
      const maxPointerCenter = popupWidth - POINTER_HALF - POINTER_EDGE_PADDING;
      const nextPointerCenterX = Math.max(
        minPointerCenter,
        Math.min(itemCenterX - popupLeft, maxPointerCenter),
      );

      if (popupProgress.value > 0.05) {
        popupProgress.value = withSequence(
          withSpring(
            0,
            {
              duration: 200,
              dampingRatio: 0.6,
              mass: 1,
              overshootClamping: false,
              energyThreshold: 6e-9,
              velocity: 0,
              reduceMotion: ReduceMotion.System,
            },
            (finished) => {
              if (finished) {
                popupTop.value = clampedTopInWindow - 4;
                pointerCenterX.value = nextPointerCenterX;
              }
            },
          ),
          withSpring(1, { duration: 120 }),
        );
      } else {
        popupTop.value = clampedTopInWindow - 4;
        pointerCenterX.value = nextPointerCenterX;
        popupProgress.value = withDelay(200, withTiming(1, { duration: 120 }));
      }
    },
    [
      insets.top,
      tabBarHeight,
      windowWidth,
      windowHeight,
      POPUP_GAP,
      POPUP_HEIGHT,
      POPUP_LEFT_RATIO,
      POPUP_WIDTH_RATIO,
      POINTER_HALF,
      POINTER_EDGE_PADDING,
    ],
  );

  const renderItem = useCallback(
    ({ item }: SectionListRenderItemInfo<any>) => (
      <ListItem item={item} onPressMeasure={handleLessonPress} />
    ),
    [handleLessonPress],
  );

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    const firstVisible = viewableItems?.[0]?.section;
    const nextTitle = firstVisible?.title;
    const nextTheme = firstVisible?.displayTheme;

    if (typeof nextTitle === "string" && nextTitle.length > 0) {
      setActiveSectionTitle((prev) => (prev === nextTitle ? prev : nextTitle));
      // Derive unit index from section title
      const idx = sectionData.findIndex((s) => s.title === nextTitle);
      if (idx !== -1) setActiveSectionIndex(idx);
    }
    if (typeof nextTheme === "string" && nextTheme in BUTTON_FACE_RIM_COLORS) {
      const typedTheme = nextTheme as SectionTheme;
      setActiveSectionTheme((prev: SectionTheme) =>
        prev === typedTheme ? prev : typedTheme,
      );
    }
  }, []);

  return (
    <ImageBackground 
      source={require("../../../assets/images/oceanbg.png")} 
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View
        onTouchStart={dismissPopup}
        className="flex-1"
        style={{ backgroundColor: 'rgba(0, 40, 80, 0.4)' }}
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
          contentContainerStyle={[styles.listContainer, { paddingBottom: 0 }]}
          stickySectionHeadersEnabled={false}
          onViewableItemsChanged={onViewableItemsChanged}
        />
        <LessonPressPopup
          top={popupTop}
          pointerCenterX={pointerCenterX}
          progress={popupProgress}
          faceColor={popupFaceColor}
          rimColor={popupRimColor}
          lessonType={popupLessonType}
          lessonId={popupLessonId}
          globalIndex={popupGlobalIndex}
          sectionItemIndex={popupSectionItemIndex}
          height={POPUP_HEIGHT}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent" },
  listContainer: {
    paddingBottom: 10,
    backgroundColor: "transparent",
    paddingTop: 24,
  },
  list: { flex: 1, width: "100%", backgroundColor: "transparent" },
  title: { fontSize: 21, fontWeight: "bold", color: "white" },
  subTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#B2EBF2",
    textTransform: "uppercase",
  },
});
