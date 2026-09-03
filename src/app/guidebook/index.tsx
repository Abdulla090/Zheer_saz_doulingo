import GuidebookHubScreen from "../../screens/guidebook/GuidebookHubScreen";
import React from "react";
import { ScreenOpeningShell } from "../../components/animations/skia-gsap-opening";

/*
 * Guidebook hub — the surface the path's guide button opens. Four doors:
 * Letters, Nouns, Verbs and Everyday Talking (the unit guide, now at
 * /guidebook/everyday-talking, which receives the unit/mode params this
 * screen was opened with).
 */
export default function GuidebookHubRoute() {
  return (
    <ScreenOpeningShell variant="guidebook" screenKey="guidebook" firstTimeOnly={true}>
      <GuidebookHubScreen />
    </ScreenOpeningShell>
  );
}

