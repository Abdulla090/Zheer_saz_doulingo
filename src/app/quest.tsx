import QuestScreen from "../screens/quest/QuestScreen";
import React from "react";
import { ScreenOpeningShell } from "../components/animations/skia-gsap-opening";

const quest = () => (
  <ScreenOpeningShell variant="quest" screenKey="quest" firstTimeOnly={true}>
    <QuestScreen />
  </ScreenOpeningShell>
);

export default quest;
