import * as NavigationBar from "expo-navigation-bar";
import { setStatusBarHidden } from "expo-status-bar";
import { Platform } from "react-native";

/** Android immersive: hide status bar (wifi/time) + navigation bar (home/recents/back). */
export async function applyAndroidImmersiveChrome(): Promise<void> {
  if (Platform.OS !== "android") return;

  try {
    await NavigationBar.setVisibilityAsync("hidden");
    setStatusBarHidden(true, "fade");
  } catch {
    /* Expo Go may not support all APIs */
  }
}

/** @deprecated use applyAndroidImmersiveChrome */
export async function configurePlatformChrome(): Promise<void> {
  await applyAndroidImmersiveChrome();
}
