import { LegalDocumentScreen } from "../screens/legal/LegalDocumentScreen";
import React from "react";
import { ScreenOpeningShell } from "../components/animations/skia-gsap-opening";

export default function AiSafetyRoute() {
  return (
    <ScreenOpeningShell variant="general" screenKey="ai-safety">
      <LegalDocumentScreen docId="ai-safety" />
    </ScreenOpeningShell>
  );
}
