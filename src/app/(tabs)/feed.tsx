import { TabScreenChrome } from "../../components/TabScreenChrome";
import { GamesScreen } from "../../screens/games/GamesScreen";

export default function FeedRoute() {
  return (
    <TabScreenChrome openingVariant="practice">
      <GamesScreen />
    </TabScreenChrome>
  );
}
