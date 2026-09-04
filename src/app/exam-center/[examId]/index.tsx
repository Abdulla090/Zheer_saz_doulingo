import React from "react";
import ExamHubScreen from "../../../screens/exam-center/ExamHubScreen";
import { ScreenOpeningShell } from "../../../components/animations/skia-gsap-opening";

export default function ExamHubRoute() {
  return (
    <ScreenOpeningShell variant="exam" screenKey="exam-hub">
      <ExamHubScreen />
    </ScreenOpeningShell>
  );
}
