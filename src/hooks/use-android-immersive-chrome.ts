import { applyAndroidImmersiveChrome } from "@/lib/platform-chrome";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect, useRef } from "react";
import { AppState, Platform } from "react-native";

const REHIDE_MS = 2800;

/**
 * Android: hide status bar + nav bar (home/recents/back). User swipes edge to peek; auto-hides again.
 */
export function useAndroidImmersiveChrome(): void {
  const rehideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (Platform.OS !== "android") return;

    void applyAndroidImmersiveChrome();

    const appSub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        void applyAndroidImmersiveChrome();
      }
    });

    const visSub = NavigationBar.addVisibilityListener((event) => {
      if (event.visibility !== "visible") return;

      if (rehideTimer.current) clearTimeout(rehideTimer.current);
      rehideTimer.current = setTimeout(() => {
        void NavigationBar.setVisibilityAsync("hidden");
        void applyAndroidImmersiveChrome();
      }, REHIDE_MS);
    });

    return () => {
      appSub.remove();
      visSub.remove();
      if (rehideTimer.current) clearTimeout(rehideTimer.current);
    };
  }, []);
}
