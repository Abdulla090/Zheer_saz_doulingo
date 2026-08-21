import { RolePlayScreen } from "../screens/roleplay/RolePlayScreen";
import React from "react";
import { ScreenOpeningShell } from "../components/animations/skia-gsap-opening";

export default function RolePlayRoute() {
  return (
    <ScreenOpeningShell variant="ai" screenKey="roleplay" firstTimeOnly={true}>
      <RolePlayScreen />
    </ScreenOpeningShell>
  );
}
