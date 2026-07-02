import { TabScreenChrome } from "../../components/TabScreenChrome";
import { LeaderboardScreen } from "../../screens/league/LeaderboardScreen";
import React from "react";

export default function DashboardRoute() {
  return (
    <TabScreenChrome openingVariant="path">
      <LeaderboardScreen />
    </TabScreenChrome>
  );
}
