import SettingsScreen from "../../screens/settings/SettingsScreen";
import React from "react";
import { ScreenOpeningShell } from "../../components/animations/skia-gsap-opening";

export default function KidsProfileRoute() {
  return (
    <ScreenOpeningShell variant="settings">
      <SettingsScreen isKidsMode={true} />
    </ScreenOpeningShell>
  );
}
