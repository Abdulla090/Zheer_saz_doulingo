import { TabScreenTransition } from "@/components/TabScreenTransition";
import { SubscriptionScreen } from "@/screens/subscriptions/SubscriptionScreen";

export default function SubscriptionRoute() {
  return (
    <TabScreenTransition>
      <SubscriptionScreen />
    </TabScreenTransition>
  );
}
