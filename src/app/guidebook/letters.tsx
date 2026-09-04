import ReferenceScreen from "../../screens/guidebook/ReferenceScreen";
import React from "react";
import { ScreenOpeningShell } from "../../components/animations/skia-gsap-opening";

/* Letters — the target language's alphabet, explained in the learner's own. */
export default function LettersRoute() {
  return (
    <ScreenOpeningShell variant="guidebook" screenKey="guidebook-letters">
      <ReferenceScreen category="letters" />
    </ScreenOpeningShell>
  );
}
