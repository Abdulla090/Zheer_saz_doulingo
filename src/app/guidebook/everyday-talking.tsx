import GuidebookScreen from "../../screens/guidebook/GuidebookScreen";
import React from "react";
import { ScreenOpeningShell } from "../../components/animations/skia-gsap-opening";

/*
 * Everyday Talking — the original unit guide (words + phrases with study and
 * practice modes). The guidebook hub's fourth card lands here, forwarding the
 * unit/mode query it received from the path.
 */
export default function GuidebookEverydayRoute() {
  return (
    <ScreenOpeningShell variant="guidebook" screenKey="guidebook-everyday" firstTimeOnly={true}>
      <GuidebookScreen />
    </ScreenOpeningShell>
  );
}
