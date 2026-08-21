import { SlangDictionaryScreen } from "../screens/games/SlangDictionaryScreen";
import React from "react";
import { ScreenOpeningShell } from "../components/animations/skia-gsap-opening";

export default function SlangRoute() {
  return (
    <ScreenOpeningShell variant="practice" screenKey="slang" firstTimeOnly={true}>
      <SlangDictionaryScreen />
    </ScreenOpeningShell>
  );
}
