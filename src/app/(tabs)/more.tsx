import { TabScreenChrome } from "../../components/TabScreenChrome";
import ProfileScreen from "../../screens/profile/ProfileScreen";
import React from "react";

export { ALL_RABAR_FONTS } from "../../constants/rabar-fonts";

export default function MoreScreen() {
  return (
    <TabScreenChrome openingVariant="settings" lazy={false}>
      <ProfileScreen />
    </TabScreenChrome>
  );
}
