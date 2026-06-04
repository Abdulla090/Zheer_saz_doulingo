import { TabScreenTransition } from "@/components/TabScreenTransition";
import { GamesScreen } from "@/screens/games/GamesScreen";

export default function FeedRoute() {
  return (
    <TabScreenTransition>
      <GamesScreen />
    </TabScreenTransition>
  );
}
