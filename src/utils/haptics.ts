import { useSettingsStore } from "../stores/useSettingsStore";
import * as Haptics from "expo-haptics";

function enabled(): boolean {
  return useSettingsStore.getState().hapticsEnabled;
}

export function hapticSelection() {
  if (!enabled()) return;
  void Haptics.selectionAsync().catch(() => {});
}

export function hapticImpact(style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) {
  if (!enabled()) return;
  void Haptics.impactAsync(style).catch(() => {});
}

export function hapticNotification(type: Haptics.NotificationFeedbackType) {
  if (!enabled()) return;
  void Haptics.notificationAsync(type).catch(() => {});
}
