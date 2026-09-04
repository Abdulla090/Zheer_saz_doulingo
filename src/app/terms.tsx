import { LegalDocumentScreen } from "../screens/legal/LegalDocumentScreen";
import React from "react";
import { ScreenOpeningShell } from "../components/animations/skia-gsap-opening";

export default function TermsRoute() {
  return (
    <ScreenOpeningShell variant="general" screenKey="terms">
      <LegalDocumentScreen docId="terms" />
    </ScreenOpeningShell>
  );
}
