import { Alert, Platform } from "react-native";

export function confirmAction(
  title: string,
  message: string,
  onConfirm: () => void | Promise<void>,
  options?: { confirmLabel?: string; cancelLabel?: string; destructive?: boolean },
) {
  const confirmLabel = options?.confirmLabel ?? "OK";
  const cancelLabel = options?.cancelLabel ?? "Cancel";

  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      const ok = window.confirm(`${title}\n\n${message}`);
      if (ok) void onConfirm();
    }
    return;
  }

  Alert.alert(title, message, [
    { text: cancelLabel, style: "cancel" },
    {
      text: confirmLabel,
      style: options?.destructive ? "destructive" : "default",
      onPress: () => void onConfirm(),
    },
  ]);
}
