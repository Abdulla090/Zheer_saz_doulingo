import { AppText } from "../../components/ui/AppText";
import React from "react";
import { StyleSheet, View } from "react-native";

export function LegacyDashboardScreen() {
  return (
    <View style={styles.root}>
      <AppText>Legacy Dashboard Screen</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
});
