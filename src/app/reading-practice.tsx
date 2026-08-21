import ReadingPracticeScreen from "../screens/games/ReadingPracticeScreen";
import React from "react";
import { ScreenOpeningShell } from "../components/animations/skia-gsap-opening";

export default function ReadingPracticeRoute() {
  return (
    <ScreenOpeningShell variant="practice" screenKey="reading-practice" firstTimeOnly={true}>
      <ReadingPracticeScreen />
    </ScreenOpeningShell>
  );
}
