import { Redirect } from "expo-router";
import React from "react";
import { useOnboardingStore } from "../stores/useOnboardingStore";

export default function RootIndex() {
  // Read once on mount to prevent double-navigation crash
  // when the store state changes while this component is in the background.
  const [completed] = React.useState(() => useOnboardingStore.getState().completed);
  return <Redirect href={completed ? "/(tabs)" : "/onboarding"} />;
}
