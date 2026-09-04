import { LegalDocumentScreen } from "../screens/legal/LegalDocumentScreen";
import React from "react";
import { ScreenOpeningShell } from "../components/animations/skia-gsap-opening";

export default function PrivacyPolicyRoute() {
  return (
    <ScreenOpeningShell variant="general" screenKey="privacy-policy">
      <LegalDocumentScreen docId="privacy" />
    </ScreenOpeningShell>
  );
}
