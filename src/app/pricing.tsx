import { SubscriptionScreen } from "../screens/subscriptions/SubscriptionScreen";
import React from "react";
import { ScreenOpeningShell } from "../components/animations/skia-gsap-opening";

/** Web checkout lives here; native renders the external-checkout overview. */
export default function PricingRoute() {
  return (
    <ScreenOpeningShell variant="pricing" screenKey="pricing" firstTimeOnly={true}>
      <SubscriptionScreen />
    </ScreenOpeningShell>
  );
}
