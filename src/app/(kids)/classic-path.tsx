import KidsClassicPathScreen from "../../screens/kids/KidsClassicPathScreen";
import { PathModeTabs } from "../../screens/home/components/PathModeTabs";
import React from "react";
import { View, StyleSheet } from "react-native";

export default function KidsClassicPathRoute() {
  return (
    <View style={styles.root}>
      <KidsClassicPathScreen />
      <View style={[styles.topChrome, { pointerEvents: "box-none" }]}>
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
