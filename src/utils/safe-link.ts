import { Alert, Linking } from "react-native";

export async function openMailto(email: string): Promise<boolean> {
  const url = `mailto:${email.replace(/^mailto:/i, "")}`;
  try {
    const can = await Linking.canOpenURL(url);
    if (!can) {
      Alert.alert("Email unavailable", `Contact us at ${email}`);
      return false;
    }
    await Linking.openURL(url);
    return true;
  } catch {
    Alert.alert("Email unavailable", `Contact us at ${email}`);
    return false;
  }
}

export async function openHttpsUrl(url: string): Promise<boolean> {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") {
      return false;
    }
    const can = await Linking.canOpenURL(url);
    if (!can) return false;
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}
