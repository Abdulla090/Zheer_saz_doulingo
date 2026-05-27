import React from "react";
import { Platform } from "react-native";
import SettingsExpoUIScreen from "@/screens/settings/SettingsExpoUIScreen";
import MoreScreenWeb from "@/screens/settings/MoreScreenWeb";

export { ALL_RABAR_FONTS } from "@/constants/rabar-fonts";

export default function MoreScreen() {
  if (Platform.OS === "web") {
    return <MoreScreenWeb />;
  }
  return <SettingsExpoUIScreen />;
}
