import { VoiceTutorScreen } from "../screens/voice-tutor/VoiceTutorScreen";
import React from "react";
import { ScreenOpeningShell } from "../components/animations/skia-gsap-opening";

export default function VoiceTutorRoute() {
  return (
    <ScreenOpeningShell variant="ai" screenKey="voice-tutor" firstTimeOnly={true}>
      <VoiceTutorScreen />
    </ScreenOpeningShell>
  );
}
