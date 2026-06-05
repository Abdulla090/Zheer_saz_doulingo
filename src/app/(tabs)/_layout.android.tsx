import { usesJsTabBar } from "@/constants/tab-mode";
import JsTabsLayout from "@/navigation/JsTabsLayout";
import NativeTabsShell from "@/navigation/NativeTabsShell";

/**
 * Default: JS floating frosted glass tab bar (fluid glass on Android).
 * EXPO_PUBLIC_ANDROID_NATIVE_TABS=1: system Material 3 bar.
 * Expo Go: always JS glass.
 */
export default usesJsTabBar() ? JsTabsLayout : NativeTabsShell;
