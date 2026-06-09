import { useI18n } from "../hooks/useI18n";
import { useNetworkStatus } from "../hooks/use-network-status";
import React, { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "./ui/AppText";

export function OfflineBanner() {
  const { isOnline } = useNetworkStatus();
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(isOnline ? 0 : 1, { duration: 220 });
  }, [isOnline, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * -12 }],
  }));

  if (Platform.OS === "web") return null;

  return (
    <Animated.View
      pointerEvents={isOnline ? "none" : "auto"}
      style={[
        styles.banner,
        { paddingTop: insets.top + 6 },
        style,
      ]}
    >
      <View style={styles.inner}>
        <AppText style={styles.text}>{t("common.offline")}</AppText>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    backgroundColor: "#1F2937",
  },
  inner: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    alignItems: "center",
  },
  text: {
    color: "#F9FAFB",
    fontSize: 13,
    fontWeight: "600",
  },
});
