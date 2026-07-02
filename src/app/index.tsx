import { Redirect } from "expo-router";
import React from "react";
import { useOnboardingStore } from "../stores/useOnboardingStore";

export default function RootIndex() {
  const completed = useOnboardingStore((s) => s.completed);
  return <Redirect href={completed ? "/(tabs)" : "/onboarding"} />;
}
