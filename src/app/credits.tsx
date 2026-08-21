import { SubscriptionScreen } from "../screens/subscriptions/SubscriptionScreen";
import React from "react";
import { ScreenOpeningShell } from "../components/animations/skia-gsap-opening";

/**
 * Standalone credit page.
 *
 * Web resolves SubscriptionScreen.web.tsx (Wayl checkout). Native resolves the
 * informational screen, which has no purchase button, URL, or WebView.
 */
export default function CreditsRoute() {
  return (
    <ScreenOpeningShell variant="subscription" screenKey="credits" firstTimeOnly={true}>
      <SubscriptionScreen />
    </ScreenOpeningShell>
  );
}
