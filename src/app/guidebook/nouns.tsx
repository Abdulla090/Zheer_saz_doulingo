import ReferenceScreen from "../../screens/guidebook/ReferenceScreen";
import React from "react";
import { ScreenOpeningShell } from "../../components/animations/skia-gsap-opening";

/* Nouns — the target language's noun system: articles, gender, plurals. */
export default function NounsRoute() {
  return (
    <ScreenOpeningShell variant="guidebook" screenKey="guidebook-nouns">
      <ReferenceScreen category="nouns" />
    </ScreenOpeningShell>
  );
}
