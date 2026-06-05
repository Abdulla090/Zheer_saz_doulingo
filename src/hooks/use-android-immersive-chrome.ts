import { applyAndroidImmersiveChrome } from "@/lib/platform-chrome";
import { useEffect } from "react";
import { AppState, Platform } from "react-native";

/**
 * Android: hide status bar + nav bar (home/recents/back).
 * Re-applies on foreground; declarative `<NavigationBar hidden />` in root layout handles persistence.
 */
export function useAndroidImmersiveChrome(): void {
  useEffect(() => {
    if (Platform.OS !== "android") return;

    void applyAndroidImmersiveChrome();

    const appSub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        void applyAndroidImmersiveChrome();
      }
    });

    return () => {
      appSub.remove();
    };
  }, []);
}
