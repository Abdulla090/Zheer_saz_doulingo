import AdminHomeScreen from "../../screens/admin/AdminHomeScreen";
import { ENABLE_ADMIN } from "../../constants/feature-flags";
import { Redirect } from "expo-router";
import React from "react";
import { ScreenOpeningShell } from "../../components/animations/skia-gsap-opening";

export default function AdminIndexRoute() {
  if (!ENABLE_ADMIN) {
    return <Redirect href="/more" />;
  }
  return (
    <ScreenOpeningShell variant="general" screenKey="admin-index">
      <AdminHomeScreen />
    </ScreenOpeningShell>
  );
}
