import { TabScreenTransition } from "@/components/TabScreenTransition";
import SettingsScreen from "@/screens/settings/SettingsScreen";
import React from "react";

export { ALL_RABAR_FONTS } from "@/constants/rabar-fonts";

export default function MoreScreen() {
  return (
    <TabScreenTransition>
      <SettingsScreen />
    </TabScreenTransition>
  );
}
