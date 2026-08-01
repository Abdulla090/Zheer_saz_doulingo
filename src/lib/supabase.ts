import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() || "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn("Supabase credentials missing! Check your .env file.");
}

// Keep module evaluation safe so a misconfigured release can render a useful
// error screen instead of destroying React Native behind the native splash.
const clientUrl = supabaseUrl || "https://unconfigured.supabase.co";
const clientAnonKey = supabaseAnonKey || "unconfigured-public-key";

const secureStoreOptions: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

const nativeAuthStorage = {
  async getItem(key: string) {
    const secureValue = await SecureStore.getItemAsync(key);
    if (secureValue) return secureValue;

    // One-time migration for sessions created before SecureStore was enabled.
    const legacyValue = await AsyncStorage.getItem(key);
    if (!legacyValue) return null;

    await SecureStore.setItemAsync(key, legacyValue, secureStoreOptions);
    await AsyncStorage.removeItem(key);
    return legacyValue;
  },
  async setItem(key: string, value: string) {
    await SecureStore.setItemAsync(key, value, secureStoreOptions);
    await AsyncStorage.removeItem(key);
  },
  async removeItem(key: string) {
    await Promise.all([
      SecureStore.deleteItemAsync(key),
      AsyncStorage.removeItem(key),
    ]);
  },
};

const webAuthStorage = {
  async getItem(key: string) {
    return typeof window === "undefined" ? null : window.localStorage.getItem(key);
  },
  async setItem(key: string, value: string) {
    if (typeof window !== "undefined") window.localStorage.setItem(key, value);
  },
  async removeItem(key: string) {
    if (typeof window !== "undefined") window.localStorage.removeItem(key);
  },
};

const authStorage = Platform.OS === "web" ? webAuthStorage : nativeAuthStorage;

export const supabase = createClient(clientUrl, clientAnonKey, {
  auth: {
    storage: authStorage,
    autoRefreshToken: true,
    persistSession: true,
    // Web password-recovery links return an auth session in the URL. Native
    // keeps URL detection off because deep links are handled by Expo Router.
    detectSessionInUrl: Platform.OS === "web",
  },
});
