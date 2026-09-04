import { AiPodcastScreen } from "../screens/games/AiPodcastScreen";
import React from "react";
import { ScreenOpeningShell } from "../components/animations/skia-gsap-opening";

export default function PodcastRoute() {
  return (
    <ScreenOpeningShell variant="practice" screenKey="podcast">
      <AiPodcastScreen />
    </ScreenOpeningShell>
  );
}
