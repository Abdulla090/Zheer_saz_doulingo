import { TabScreenChrome } from "@/components/TabScreenChrome";
import { SubscriptionScreen } from "@/screens/subscriptions/SubscriptionScreen";

export default function SubscriptionRoute() {
  return (
    <TabScreenChrome>
      <SubscriptionScreen />
    </TabScreenChrome>
  );
}
