import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CustomTabIcon } from "./custom-tab-icon";

import {
  Cup,
  Feed,
  Home,
  HorizontalMore,
  LessonDumbbell,
  LessonVideo,
  NavBarChest,
  Profile,
  Subscriptions,
} from "@/constants/icons";
import { Settings } from "lucide-react-native";
import { useRouter, type Href } from "expo-router";

type SvgIconProps = {
  width?: number;
  height?: number;
  opacity?: number;
  stroke?: string;
  fill?: string;
};

// Use a strict type for your routes rather than a generic string

type RouteName =
  | "index"
  | "quest"
  | "feed"
  | "league"
  | "subscription"
  | "more";

const ROUTE_HREFS: Record<RouteName, Href> = {
  index: "/",
  quest: "/quest",
  feed: "/feed",
  league: "/league",
  subscription: "/subscription",
  more: "/more",
};

const ROUTE_ICONS: Record<
  RouteName | string,
  React.ComponentType<SvgIconProps>
> = {
  index: Home,
  quest: NavBarChest,
  feed: Feed,
  league: Cup,
  subscription: Subscriptions,
  more: HorizontalMore,
};

const TAB_BAR_BASE_HEIGHT = 61;
const NAV_BAR_BORDER_COLOR = "#E5E5E5";
const NAV_BAR_BORDER_WIDTH = 3;

const moreActions = [
  {
    key: "profile",
    title: "هەژمار",
    Icon: Profile,
    fill: "#8d8deb",
    stroke: "#8d8deb",
    route: null,
  },
  {
    key: "video-call",
    title: "پەیوەندی ڤیدیۆیی",
    Icon: LessonVideo,
    fill: "#23236e",
    stroke: "#23236e",
    route: null,
  },
  {
    key: "practice",
    title: "ڕاهێنان",
    Icon: LessonDumbbell,
    fill: "#c894f9",
    stroke: "green",
    route: null,
  },
  {
    key: "settings",
    title: "فۆنتەکان / ڕێکخستنەکان",
    Icon: null,
    fill: "#1CB0F6",
    stroke: "#1CB0F6",
    route: "/more" as const,
  },
];

export function CustomTabBar({ state, descriptors }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPad = insets.bottom;
  const tabBarReservedSpace = TAB_BAR_BASE_HEIGHT + bottomPad;
  const router = useRouter();
  const moreSheetRef = useRef<BottomSheetModal>(null);
  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);
  const snapPoints = useMemo(() => ["32%"], []);

  const openMoreSheet = useCallback(() => {
    setIsMoreSheetOpen(true);
    moreSheetRef.current?.present();
  }, []);

  const closeMoreSheet = useCallback(() => {
    setIsMoreSheetOpen(false);
    moreSheetRef.current?.dismiss();
  }, []);

  // 2. Apply strict Gorhom types instead of `any`
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
        style={[props.style, { bottom: tabBarReservedSpace }]}
      />
    ),
    [tabBarReservedSpace],
  );

  const onPress = (
    route: (typeof state.routes)[0],
    isActionTab: boolean,
    isFocused: boolean,
  ) => {
    if (isActionTab) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      openMoreSheet();
      return;
    }

    if (!isFocused) {
      closeMoreSheet();
      router.navigate(ROUTE_HREFS[route.name as RouteName]);
    }
  };

  return (
    <>
      <View style={[styles.container, { paddingBottom: bottomPad }]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isActionTab = route.name === "more";
          const isFocused = isActionTab
            ? isMoreSheetOpen
            : !isMoreSheetOpen && state.index === index;

          const Icon = ROUTE_ICONS[route.name];

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={() => onPress(route, isActionTab, isFocused)}
              style={styles.item}
            >
              {Icon ? <CustomTabIcon focused={isFocused} Icon={Icon} /> : null}
              {options.tabBarShowLabel ? (
                <Text style={[styles.label, isFocused && styles.labelActive]}>
                  {typeof options.tabBarLabel === "string"
                    ? options.tabBarLabel
                    : route.name}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>

      <BottomSheetModal
        ref={moreSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        onDismiss={() => setIsMoreSheetOpen(false)}
        backgroundStyle={styles.sheetBackground}
        bottomInset={tabBarReservedSpace}
        handleComponent={null}
      >
        <BottomSheetView style={[styles.sheet, { paddingBottom: 0 }]}>
          {moreActions.map(({ key, title, Icon, fill, stroke, route }, index) => (
            <Pressable
              key={key}
              className={`flex-row items-center gap-3 py-4 px-3 ${
                index !== moreActions.length - 1
                  ? "border-b-[3px] border-[#E5E5E5]"
                  : ""
              }`}
              onPress={() => {
                closeMoreSheet();
                if (route) router.navigate(route as Href);
              }}
            >
              {Icon ? (
                <Icon width={30} height={30} stroke={stroke} fill={fill} />
              ) : (
                <Settings width={30} height={30} color={fill} />
              )}
              <Text className="text-base font-bold text-text-primary font-rd-bold">
                {title}
              </Text>
            </Pressable>
          ))}
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    paddingHorizontal: 10,
    borderTopWidth: NAV_BAR_BORDER_WIDTH,
    borderColor: NAV_BAR_BORDER_COLOR,
    backgroundColor: "#fff",
  },
  item: {
    flex: 1,
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    marginTop: 3,
    color: "#B4B8C3",
    fontSize: 11,
    fontWeight: "600",
  },
  labelActive: {
    color: "#FFFFFF",
  },
  sheet: {
    justifyContent: "center",
    paddingTop: 6,
    paddingHorizontal: 0,
  },
  handle: {
    backgroundColor: "#D9D9D9",
    width: 38,
  },
  sheetBackground: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4B4B4B",
    marginBottom: 10,
    fontFamily: "DINNextRoundedBold",
    paddingHorizontal: 16,
  },
});
