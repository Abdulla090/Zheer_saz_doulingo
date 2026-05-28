import { PressableScale } from "@/components/animations";
import { Icon3DSettings } from "@/components/icons/Icon3D";
import { LessonDumbbell } from "@/constants/icons";
import { crossShadow } from "@/utils/shadows";
import {
    BottomSheetModal,
    BottomSheetView,
    type BottomSheetBackdropProps,
    type BottomSheetMethods,
} from "@expo/ui/community/bottom-sheet";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { useRouter, type Href } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, Rect } from "react-native-svg";

// Custom Sleek Icons for Capsule TabBar
function HomeIcon({ size = 26, color = "#B4B8C3" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V9.5z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CenterWaveIcon({ size = 24, color = "#FFFFFF" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 8c2.5-2.2 5.5 2.2 8 0s5.5 2.2 8 0M4 12c2.5-2.2 5.5 2.2 8 0s5.5 2.2 8 0M4 16c2.5-2.2 5.5 2.2 8 0s5.5 2.2 8 0"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function StatsIcon({ size = 26, color = "#B4B8C3" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="10" width="3.5" height="10" rx="1" stroke={color} strokeWidth={2} />
      <Rect x="10.25" y="4" width="3.5" height="16" rx="1" stroke={color} strokeWidth={2} />
      <Rect x="16.5" y="13" width="3.5" height="7" rx="1" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

const moreActions = [
  {
    key: "practice",
    title: "ڕاهێنان / قسەکردن",
    Icon: LessonDumbbell,
    fill: "#c894f9",
    stroke: "#58CC02",
    route: "/roleplay" as const,
  },
  {
    key: "settings",
    title: "ڕێکخستنەکان",
    Icon: null,
    fill: "#1CB0F6",
    stroke: "#1CB0F6",
    route: "/more" as const,
  },
];

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const moreSheetRef = useRef<BottomSheetMethods>(null);
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

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) =>
      Platform.OS === "web" ? (
        <Pressable
          {...props}
          onPress={closeMoreSheet}
          style={[props.style, StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.45)" }]}
        />
      ) : null,
    [closeMoreSheet],
  );

  const activeRouteName = state.routes[state.index]?.name;

  /* Routes that should NOT show the floating tab bar */
  const HIDDEN_ROUTES = new Set([
    "lesson",
    "guidebook",
    "roleplay",
    "ai-teacher",
    "privacy-policy",
    "ai-safety",
    "terms",
  ]);
  if (activeRouteName && HIDDEN_ROUTES.has(activeRouteName)) {
    return null;
  }

  const handleHomePress = () => {
    closeMoreSheet();
    navigation.navigate("index");
  };

  const handleStatsPress = () => {
    closeMoreSheet();
    navigation.navigate("league");
  };

  const handleCenterPress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    closeMoreSheet();
    router.push("/dashboard?mode=street");
  };

  const handleLongPress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    openMoreSheet();
  };

  const tabBarSurfaceStyle = useMemo(
    () => [
      styles.container,
      Platform.OS === "android" && styles.containerAndroid,
      crossShadow({
        color: "#0F172A",
        offsetY: 8,
        blur: 24,
        opacity: 0.1,
        elevation: 8,
      }),
    ],
    [],
  );

  const tabBarContent = (
    <>
      {/* Left: AI Wave Talk Action */}
      <PressableScale
        onPress={handleCenterPress}
        onLongPress={handleLongPress}
        style={styles.tabItem}
        scaleDown={0.9}
        haptic
        hapticStyle={Haptics.ImpactFeedbackStyle.Light}
      >
        <CenterWaveIcon
          color={activeRouteName === "dashboard" && !isMoreSheetOpen ? "#208AEF" : "#B4B8C3"}
          size={26}
        />
      </PressableScale>

      {/* Center: Home Tab (Floating Highlight) */}
      <PressableScale
        onPress={handleHomePress}
        onLongPress={handleLongPress}
        style={styles.centerItem}
        scaleDown={0.92}
      >
        <View
          style={[
            styles.centerCircle,
            { backgroundColor: activeRouteName === "index" && !isMoreSheetOpen ? "#208AEF" : "rgba(229, 231, 235, 0.4)" },
            activeRouteName === "index" && !isMoreSheetOpen ? crossShadow({
              color: "#208AEF",
              offsetY: 6,
              blur: 16,
              opacity: 0.32,
              elevation: 6,
            }) : null,
          ]}
        >
          <HomeIcon
            color={activeRouteName === "index" && !isMoreSheetOpen ? "#FFFFFF" : "#9CA3AF"}
            size={28}
          />
        </View>
      </PressableScale>

      {/* Right: Stats/League Tab */}
      <PressableScale
        onPress={handleStatsPress}
        onLongPress={handleLongPress}
        style={styles.tabItem}
        haptic
        hapticStyle={Haptics.ImpactFeedbackStyle.Light}
        scaleDown={0.9}
      >
        <StatsIcon
          color={
            (activeRouteName === "league" || activeRouteName === "quest") && !isMoreSheetOpen
              ? "#208AEF"
              : "#B4B8C3"
          }
        />
      </PressableScale>
    </>
  );

  return (
    <>
      <View style={[styles.floatingWrapper, { bottom: Math.max(16, insets.bottom) }]}>
        {Platform.OS === "android" ? (
          <View style={tabBarSurfaceStyle}>{tabBarContent}</View>
        ) : (
          <BlurView
            intensity={Platform.OS === "ios" ? 80 : 40}
            tint={Platform.OS === "ios" ? "systemThinMaterialLight" : "default"}
            style={tabBarSurfaceStyle}
          >
            {tabBarContent}
          </BlurView>
        )}
      </View>

      <BottomSheetModal
        ref={moreSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        onDismiss={() => setIsMoreSheetOpen(false)}
        backgroundStyle={styles.sheetBackground}
        handleComponent={null}
      >
        <BottomSheetView style={[styles.sheet, { paddingBottom: 0 }]}>
          {moreActions.map(({ key, title, Icon, fill, stroke, route }, index) => (
            <Pressable
              key={key}
              className={`flex-row items-center gap-3 py-4 px-4 ${
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
                <Icon width={28} height={28} stroke={stroke} fill={fill} />
              ) : (
                <Icon3DSettings size={28} />
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
  floatingWrapper: {
    position: "absolute",
    left: 20,
    right: 20,
    zIndex: 999,
  },
  container: {
    height: 72,
    borderRadius: 36,
    // @ts-ignore - RN supports this under the hood, heavily used in iOS
    borderCurve: "continuous",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    backgroundColor: Platform.OS === 'web' ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.15)", // Much lower opacity for true translucency
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.4)", // Glowing edge highlight
    // Subtle top-edge extra glow
    borderTopColor: "rgba(255, 255, 255, 0.8)",
    overflow: "hidden",
  },
  containerAndroid: {
    backgroundColor: "rgba(255, 255, 255, 0.94)",
  },
  tabItem: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  centerItem: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    top: -4, // Floating lift
  },
  centerCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    // Background color is handled dynamically in style array now
    alignItems: "center",
    justifyContent: "center",
  },
  sheet: {
    justifyContent: "center",
    paddingTop: 6,
    paddingHorizontal: 0,
  },
  sheetBackground: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
});
