import { CourseDetailsScreen } from "../screens/course/CourseDetailsScreen";
import React from "react";
import { ScreenOpeningShell } from "../components/animations/skia-gsap-opening";

export default function CourseDetailsRoute() {
  return (
    <ScreenOpeningShell variant="home" screenKey="course-details">
      <CourseDetailsScreen />
    </ScreenOpeningShell>
  );
}
