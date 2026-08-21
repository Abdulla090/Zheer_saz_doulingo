import GuidebookScreen from "../screens/guidebook/GuidebookScreen";
import React from "react";
import { ScreenOpeningShell } from "../components/animations/skia-gsap-opening";

export default function GuidebookRoute() {
  return (
    <ScreenOpeningShell variant="guidebook" screenKey="guidebook" firstTimeOnly={true}>
      <GuidebookScreen />
    </ScreenOpeningShell>
  );
}
