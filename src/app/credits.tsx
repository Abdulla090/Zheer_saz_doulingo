import { SubscriptionScreen } from "../screens/subscriptions/SubscriptionScreen";

/**
 * Standalone credit page.
 *
 * Web resolves SubscriptionScreen.web.tsx (Wayl checkout). Native resolves the
 * informational screen, which has no purchase button, URL, or WebView.
 */
export default function CreditsRoute() {
  return <SubscriptionScreen />;
}
