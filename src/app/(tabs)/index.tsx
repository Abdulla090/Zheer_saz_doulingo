/**
 * Home tab — Duolingo-style learn dashboard (Phingo).
 */

import { TabScreenChrome } from "@/components/TabScreenChrome";
import { PhingoLearnHomeScreen } from "@/screens/home/PhingoLearnHomeScreen";

export default function HomeIndex() {
  return (
    <TabScreenChrome lazy={false}>
      <PhingoLearnHomeScreen />
    </TabScreenChrome>
  );
}
