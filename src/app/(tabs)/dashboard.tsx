import { PathModeTabs } from "@/screens/home/components/PathModeTabs";
import { LearningPathScreen } from "@/screens/home/LearningPathScreen";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function DashboardRoute() {
  return (
    <View style={styles.root}>
      <LearningPathScreen />
      <View style={styles.topChrome} pointerEvents="box-none">
        <PathModeTabs />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topChrome: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
});
