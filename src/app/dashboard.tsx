import { PathModeTabs } from "@/screens/home/components/PathModeTabs";
import { LearningPathScreen } from "@/screens/home/LearningPathScreen";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function DashboardRoute() {
  return (
    <View style={styles.root}>
      <LearningPathScreen />
      <PathModeTabs />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
