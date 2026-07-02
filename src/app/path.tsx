import { PathModeTabs } from "../screens/home/components/PathModeTabs";
import { LearningPathScreen } from "../screens/home/LearningPathScreen";
import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PathRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <View style={{ flex: 1 }}>
        <LearningPathScreen />
        <View style={[styles.topChrome, { pointerEvents: "box-none", paddingTop: Math.max(insets.top, 20) }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.8}>
              <HugeiconsIcon icon={ArrowLeft01Icon} size={22} color="#0F172A" strokeWidth={2.5} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <PathModeTabs />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF" },
  topChrome: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderBottomWidth: 4,
    borderBottomColor: "#CBD5E1",
  },
});
