import { TabScreenChrome } from "../../components/TabScreenChrome";
import { FocusTalkScreen } from "../../screens/focus/FocusModeScreens";
import { LearningPathScreen } from "../../screens/home/LearningPathScreen";
import { useSettingsStore } from "../../stores/useSettingsStore";

export default function HomeIndex() {
  const focusModeEnabled = useSettingsStore((state) => state.focusModeEnabled);

  if (focusModeEnabled) return <FocusTalkScreen />;

  return (
    <TabScreenChrome openingVariant="home">
      <LearningPathScreen topChromeHeight={8} />
    </TabScreenChrome>
  );
}
