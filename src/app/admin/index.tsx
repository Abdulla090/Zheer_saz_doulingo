import AdminHomeScreen from "../../screens/admin/AdminHomeScreen";
import { ENABLE_ADMIN } from "../../constants/feature-flags";
import { Redirect } from "expo-router";
import React from "react";

export default function AdminIndexRoute() {
  if (!ENABLE_ADMIN) {
    return <Redirect href="/more" />;
  }
  return <AdminHomeScreen />;
}
