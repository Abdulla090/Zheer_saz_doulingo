import { LeagueScreen } from "../screens/league/LeagueScreen";
import React from "react";
import { ScreenOpeningShell } from "../components/animations/skia-gsap-opening";

const League = () => {
  return (
    <ScreenOpeningShell variant="general" screenKey="league" firstTimeOnly={false}>
      <LeagueScreen />
    </ScreenOpeningShell>
  );
};

export default League;
