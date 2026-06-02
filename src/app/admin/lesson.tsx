import AdminLessonScreen from "@/screens/admin/AdminLessonScreen";
import { ENABLE_ADMIN } from "@/constants/feature-flags";
import { Redirect } from "expo-router";
import React from "react";

export default function AdminLessonRoute() {
  if (!ENABLE_ADMIN) {
    return <Redirect href="/more" />;
  }
  return <AdminLessonScreen />;
}
