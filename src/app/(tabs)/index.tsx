import { TabScreenChrome } from "../../components/TabScreenChrome";
import { LearningPathScreen } from "../../screens/home/LearningPathScreen";

export default function HomeIndex() {
  return (
    <TabScreenChrome lazy={false} openingVariant="path">
      <LearningPathScreen topChromeHeight={8} />
    </TabScreenChrome>
  );
}
