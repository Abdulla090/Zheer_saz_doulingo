import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * iOS dev build: system NativeTabs (Liquid Glass).
 * Android: JS floating glass pill — Material NativeTabs cannot match frosted blur;
 * set EXPO_PUBLIC_ANDROID_NATIVE_TABS=1 to force system M3 bar.
 */
export function usesNativeTabBar(): boolean {
  if (Platform.OS === "web") return false;
  if (Platform.OS === "ios") return Constants.appOwnership !== "expo";
  if (Platform.OS === "android") {
    if (Constants.appOwnership === "expo") return false;
    if (process.env.EXPO_PUBLIC_ANDROID_NATIVE_TABS === "1") return true;
    return false;
  }
  return false;
}

export function usesJsTabBar(): boolean {
  return !usesNativeTabBar();
}
