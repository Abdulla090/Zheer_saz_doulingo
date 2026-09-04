import AdminUnitScreen from "../../screens/admin/AdminUnitScreen";
import { ENABLE_ADMIN } from "../../constants/feature-flags";
import { Redirect } from "expo-router";
import React from "react";
import { ScreenOpeningShell } from "../../components/animations/skia-gsap-opening";

export default function AdminUnitRoute() {
  if (!ENABLE_ADMIN) {
    return <Redirect href="/more" />;
  }
  return (
    <ScreenOpeningShell variant="general" screenKey="admin-unit">
      <AdminUnitScreen />
    </ScreenOpeningShell>
  );
}
