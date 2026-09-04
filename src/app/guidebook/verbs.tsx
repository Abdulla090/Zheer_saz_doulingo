import ReferenceScreen from "../../screens/guidebook/ReferenceScreen";
import React from "react";
import { ScreenOpeningShell } from "../../components/animations/skia-gsap-opening";

/* Verbs — the target language's verb system: tenses and conjugation. */
export default function VerbsRoute() {
  return (
    <ScreenOpeningShell variant="guidebook" screenKey="guidebook-verbs">
      <ReferenceScreen category="verbs" />
    </ScreenOpeningShell>
  );
}
