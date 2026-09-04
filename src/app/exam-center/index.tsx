import React from "react";
import ExamCenterHomeScreen from "../../screens/exam-center/ExamCenterHomeScreen";
import { ScreenOpeningShell } from "../../components/animations/skia-gsap-opening";

export default function ExamCenterRoute() {
  return (
    <ScreenOpeningShell variant="exam" screenKey="exam-center">
      <ExamCenterHomeScreen />
    </ScreenOpeningShell>
  );
}
