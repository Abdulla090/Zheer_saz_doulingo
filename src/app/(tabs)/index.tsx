/**
 * Home tab — Duolingo-style learn dashboard (Phingo).
 */

import { TabScreenChrome } from "../../components/TabScreenChrome";
import { TwinoLearnHomeScreen } from "../../screens/home/TwinoLearnHomeScreen";

export default function HomeIndex() {
  return (
    <TabScreenChrome lazy={false} openingVariant="home">
      <TwinoLearnHomeScreen />
    </TabScreenChrome>
  );
}
