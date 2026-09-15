import { GamesScreen } from '../../screens/games/GamesScreen';
import { FocusGamesScreen } from "../../screens/focus/FocusModeScreens";
import { TabScreenChrome } from "../../components/TabScreenChrome";
import { useSettingsStore } from "../../stores/useSettingsStore";
import React from 'react';

export default function PlayRoute() {
  const focusModeEnabled = useSettingsStore((state) => state.focusModeEnabled);

  if (focusModeEnabled) return <FocusGamesScreen />;

  return (
    <TabScreenChrome openingVariant="practice">
      <GamesScreen />
    </TabScreenChrome>
  );
}
