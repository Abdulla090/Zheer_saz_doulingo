import { TabScreenChrome } from "../../components/TabScreenChrome";
import { FocusWordsScreen } from "../../screens/focus/FocusModeScreens";
import { LeaderboardScreen } from "../../screens/league/LeaderboardScreen";
import { useSettingsStore } from "../../stores/useSettingsStore";
import React from "react";

export default function DashboardRoute() {
  const focusModeEnabled = useSettingsStore((state) => state.focusModeEnabled);

  if (focusModeEnabled) return <FocusWordsScreen />;

  return (
    <TabScreenChrome openingVariant="path">
      <LeaderboardScreen />
    </TabScreenChrome>
  );
}
