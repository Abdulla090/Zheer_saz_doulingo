import { GamesScreen } from '../../screens/games/GamesScreen';
import { TabScreenChrome } from "../../components/TabScreenChrome";
import React from 'react';

export default function PlayRoute() {
  return (
    <TabScreenChrome openingVariant="practice">
      <GamesScreen />
    </TabScreenChrome>
  );
}
