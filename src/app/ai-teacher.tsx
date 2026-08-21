import { AiTeacherScreen } from "../screens/ai-teacher/AiTeacherScreen";
import React from "react";
import { ScreenOpeningShell } from "../components/animations/skia-gsap-opening";

export default function AiTeacherRoute() {
  return (
    <ScreenOpeningShell variant="ai" screenKey="ai-teacher" firstTimeOnly={true}>
      <AiTeacherScreen />
    </ScreenOpeningShell>
  );
}
