import { OnboardingFlow } from "@/screens/onboarding/OnboardingFlow";
import { useOnboardingStore } from "@/stores/useOnboardingStore";
import { Redirect } from "expo-router";

export default function OnboardingRoute() {
  const completed = useOnboardingStore((s) => s.completed);
  const replayNonce = useOnboardingStore((s) => s.replayNonce);

  if (completed) {
    return <Redirect href="/(tabs)" />;
  }

  return <OnboardingFlow key={replayNonce} />;
}
