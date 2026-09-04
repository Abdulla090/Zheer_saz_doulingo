import { TabScreenChrome } from "../../components/TabScreenChrome";
import { LearningPathScreen } from "../../screens/home/LearningPathScreen";

export default function HomeIndex() {
  return (
    <TabScreenChrome openingVariant="home">
      <LearningPathScreen topChromeHeight={8} />
    </TabScreenChrome>
  );
}
