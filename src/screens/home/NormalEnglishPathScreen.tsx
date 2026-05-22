/**
 * NormalHomeScreen — "Normal English" learning path.
 * Dark slate theme. Structurally mirrors HomeScreen completely.
 */

import { BUTTON_FACE_RIM_COLORS } from "@/constants/button-theme-colors";
import { normalSectionData } from "@/data/normal-english";
import type { SectionTheme, LessonType } from "@/data/list-items";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Icon3DGradCap } from "@/components/icons/Icon3D";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  SectionList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  SectionListRenderItemInfo,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ImageBackground,
} from "react-native";
import Animated, {
  Easing,
  ReduceMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  FadeInDown,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeMainButton } from "./components/home-main-button";
import { LessonPressPopup } from "./components/lesson-press-popup";
import { ListItem, ListItemPressMeasurement } from "./components/list-item";

// ── Dark theme palette ─────────────────────────────────────────────────────────
const D = {
  bg:      "#0E1117",
  border:  "#1E2535",
  muted:   "#4A5568",
  text:    "#E2E8F0",
  textSub: "#718096",
};

const POPUP_HEIGHT      = 100;
const POPUP_GAP         = 10;
const POPUP_LEFT_RATIO  = 0.1;
const POPUP_WIDTH_RATIO = 0.8;
const POINTER_HALF      = 8;
const POINTER_EDGE_PAD  = 12;

const keyExtractor = (item: any) => `ne-${item.id}`;

import React from "react";

const NormalSectionHeader = React.memo(({ section }: { section: any }) => {
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

const ComingSoonCard = React.memo(() => (
  <Animated.View
    entering={FadeInDown.delay(200).duration(320)}
  >
    <View style={darkStyles.comingSoon}>
      <Icon3DGradCap size={38} />
      <Text style={darkStyles.comingSoonTitle}>More units coming soon</Text>
      <Text style={darkStyles.comingSoonSub}>Keep learning to unlock them</Text>
    </View>
  </Animated.View>
));

export function NormalEnglishPathScreen() {
  const insets        = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const tabBarHeight  = useBottomTabBarHeight();
  const listRef       = useRef<SectionList<any>>(null);
  const scrollYRef    = useRef(0);
  const contentHeightRef  = useRef(0);
  const viewportHeightRef = useRef(0);
  const maxScrollYRef = useRef(0);
  const isPopupOpenRef = useRef(false);

  const [activeSectionTitle, setActiveSectionTitle] = useState(
    normalSectionData[0]?.title ?? "",
  );
  const [activeSectionTheme, setActiveSectionTheme] = useState<SectionTheme>(
    normalSectionData[0]?.displayTheme ?? "blue",
  );
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  const popupTop        = useSharedValue(-POPUP_HEIGHT);
  const pointerCenterX  = useSharedValue((windowWidth * POPUP_WIDTH_RATIO) / 2);
  const popupProgress   = useSharedValue(0);
  const popupFaceColor  = useSharedValue<string>(BUTTON_FACE_RIM_COLORS.blue.face);
  const popupRimColor   = useSharedValue<string>(BUTTON_FACE_RIM_COLORS.blue.rim);
  const [popupLessonType, setPopupLessonType] = useState<LessonType>("practice");
  const [popupLessonId, setPopupLessonId]     = useState(0);
  const [popupGlobalIndex, setPopupGlobalIndex]         = useState(0);
  const [popupSectionItemIndex, setPopupSectionItemIndex] = useState(0);

  const activeSectionDisplay = useMemo(() => {
    const [unitLabel, ...rest] = activeSectionTitle.split(":");
    return {
      unitLabel:    unitLabel?.trim() || "Unit",
      sectionTitle: rest.join(":").trim() || activeSectionTitle,
    };
  }, [activeSectionTitle]);

  const buttonColors =
    BUTTON_FACE_RIM_COLORS[activeSectionTheme as keyof typeof BUTTON_FACE_RIM_COLORS]
    ?? BUTTON_FACE_RIM_COLORS.blue;

  const recalcMaxScroll = useCallback(() => {
    maxScrollYRef.current = Math.max(
      0,
      contentHeightRef.current - viewportHeightRef.current,
    );
  }, []);

  const onListLayout = useCallback((e: any) => {
    viewportHeightRef.current = e.nativeEvent.layout.height;
    recalcMaxScroll();
  }, [recalcMaxScroll]);

  const onContentSizeChange = useCallback((_: number, h: number) => {
    contentHeightRef.current = h;
    recalcMaxScroll();
  }, [recalcMaxScroll]);

  const dismissPopup = useCallback(() => {
    if (!isPopupOpenRef.current) return;
    isPopupOpenRef.current = false;
    popupTop.value      = withTiming(-POPUP_HEIGHT, { duration: 160, easing: Easing.in(Easing.quad) });
    popupProgress.value = withTiming(0, { duration: 160 });
  }, []);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollYRef.current = e.nativeEvent.contentOffset.y;
      if (isPopupOpenRef.current) dismissPopup();
    },
    [dismissPopup],
  );

  const handleLessonPress = useCallback(
    (m: ListItemPressMeasurement) => {
      const { popupFaceColor: fc, popupRimColor: rc, x, y, width, height,
              type, lessonId, globalIndex, sectionItemIndex } = m;

      isPopupOpenRef.current = true;
      popupFaceColor.value = fc;
      popupRimColor.value  = rc;
      setPopupLessonType(type);
      setPopupLessonId(lessonId);
      setPopupGlobalIndex(globalIndex);
      setPopupSectionItemIndex(sectionItemIndex ?? 0);

      const viewportTop    = insets.top;
      const viewportBottom = windowHeight - tabBarHeight;
      const usableHeight   = Math.max(0, viewportBottom - viewportTop);
      const itemCenterY    = y + height / 2;
      const lowerSafeCenterY = viewportTop + usableHeight * 0.65;
      let appliedDelta = 0;

      if (itemCenterY > lowerSafeCenterY) {
        const delta = itemCenterY - lowerSafeCenterY;
        if (Math.abs(delta) >= 4) {
          const nextOffset = Math.max(0, Math.min(scrollYRef.current + delta, maxScrollYRef.current));
          appliedDelta = nextOffset - scrollYRef.current;
          listRef.current?.scrollToLocation?.({
            sectionIndex: m.sectionItemIndex > 0 ? 0 : 0, // Fallback since scrollToLocation needs indexes
            itemIndex: 0,
            animated: true,
            viewOffset: -nextOffset,
          });
        }
      }

      const expectedItemY      = y - appliedDelta;
      const popupTopInWindow   = expectedItemY + height + POPUP_GAP;
      const maxPopupTopInWindow = viewportBottom - POPUP_HEIGHT - POPUP_GAP;
      const clampedTopInWindow = Math.max(viewportTop + POPUP_GAP, Math.min(popupTopInWindow, maxPopupTopInWindow));

      const popupLeft      = windowWidth * POPUP_LEFT_RATIO;
      const popupWidth     = windowWidth * POPUP_WIDTH_RATIO;
      const itemCenterX    = x + width / 2;
      const minPtrCenter   = POINTER_HALF + POINTER_EDGE_PAD;
      const maxPtrCenter   = popupWidth - POINTER_HALF - POINTER_EDGE_PAD;
      const nextPtrX       = Math.max(minPtrCenter, Math.min(itemCenterX - popupLeft, maxPtrCenter));

      if (popupProgress.value > 0.05) {
        popupProgress.value = withSequence(
          withSpring(0, { duration: 200, dampingRatio: 0.6, mass: 1, overshootClamping: false, energyThreshold: 6e-9, velocity: 0, reduceMotion: ReduceMotion.System },
            (finished) => {
              if (finished) {
                popupTop.value      = clampedTopInWindow - 4;
                pointerCenterX.value = nextPtrX;
              }
            },
          ),
          withSpring(1, { duration: 120 }),
        );
      } else {
        popupTop.value      = clampedTopInWindow - 4;
        pointerCenterX.value = nextPtrX;
        popupProgress.value = withDelay(200, withTiming(1, { duration: 120 }));
      }
    },
    [insets.top, tabBarHeight, windowWidth, windowHeight],
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
      const idx = normalSectionData.findIndex((s) => s.title === nextTitle);
      if (idx !== -1) setActiveSectionIndex(idx);
    }
    if (typeof nextTheme === "string" && nextTheme in BUTTON_FACE_RIM_COLORS) {
      setActiveSectionTheme((prev) => prev === nextTheme ? prev : nextTheme as SectionTheme);
    }
  }, []);

  return (
    <ImageBackground 
      source={require("../../../assets/images/oceanbg.png")} 
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View onTouchStart={dismissPopup} style={[darkStyles.root, { backgroundColor: 'rgba(10, 20, 40, 0.4)' }]}>
        <Animated.View entering={FadeInDown.springify().damping(12)}>
          <HomeMainButton
            unitLabel={activeSectionDisplay.unitLabel}
            sectionTitle={activeSectionDisplay.sectionTitle}
            faceColor={buttonColors.face}
            rimColor={buttonColors.rim}
            unitIndex={activeSectionIndex}
          />
        </Animated.View>

        <SectionList
          sections={normalSectionData}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ref={listRef}
          renderSectionHeader={({ section }) => <NormalSectionHeader section={section} />}
          onLayout={onListLayout}
          {...(Platform.OS !== "web" ? { onContentSizeChange } : {})}
          onScroll={onScroll}
          scrollEventThrottle={16}
          style={darkStyles.list}
          ListFooterComponent={ComingSoonCard}
          contentContainerStyle={darkStyles.listContent}
          stickySectionHeadersEnabled={false}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50,
            minimumViewTime: 100,
          }}
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
}

const darkStyles = StyleSheet.create({
  root:        { flex: 1, backgroundColor: "transparent" },
  list:        { flex: 1, backgroundColor: "transparent" },
  listContent: { paddingBottom: 10, backgroundColor: "transparent", paddingTop: 24 },
  sectionHeader: {
    height: 56, flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 10, paddingHorizontal: 20, marginBottom: 4,
  },
  sectionLine:  { flex: 1, height: 1, backgroundColor: D.border },
  sectionTitle: { fontSize: 14, fontWeight: "600", color: D.muted, letterSpacing: 0.5 },
  comingSoon: {
    alignItems: "center", paddingVertical: 48, paddingHorizontal: 32, gap: 10,
  },
  comingSoonTitle: { fontSize: 17, fontWeight: "700", color: D.text, marginTop: 4 },
  comingSoonSub:   { fontSize: 14, color: D.textSub },
});
