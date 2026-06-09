import AdminUnitScreen from "../../screens/admin/AdminUnitScreen";
import { ENABLE_ADMIN } from "../../constants/feature-flags";
import { Redirect } from "expo-router";
import React from "react";

export default function AdminUnitRoute() {
  if (!ENABLE_ADMIN) {
    return <Redirect href="/more" />;
  }
  return <AdminUnitScreen />;
}
