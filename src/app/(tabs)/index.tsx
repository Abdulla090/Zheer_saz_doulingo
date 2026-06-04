/**
 * Home tab — Duolingo-style learn dashboard (Phingo).
 */

import { TabScreenTransition } from "@/components/TabScreenTransition";
import { PhingoLearnHomeScreen } from "@/screens/home/PhingoLearnHomeScreen";

export default function HomeIndex() {
  return (
    <TabScreenTransition>
      <PhingoLearnHomeScreen />
    </TabScreenTransition>
  );
}
