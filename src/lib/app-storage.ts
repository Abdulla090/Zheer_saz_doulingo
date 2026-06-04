import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

import { migrateLegacyAsyncStorageOnce } from "@/lib/migrate-legacy-storage";

type MmkvInstance = {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  remove: (key: string) => void;
};

let mmkv: MmkvInstance | null = null;
let mmkvUnavailable = false;
let migrationPromise: Promise<void> | null = null;

function getMmkv(): MmkvInstance | null {
  if (Platform.OS === "web" || mmkvUnavailable) return null;
  if (mmkv) return mmkv;
  try {
    const { createMMKV } = require("react-native-mmkv") as {
      createMMKV: (opts: { id: string }) => MmkvInstance;
    };
    mmkv = createMMKV({ id: "phingo-app" });
    return mmkv;
  } catch (error) {
    mmkvUnavailable = true;
    if (__DEV__) {
      console.warn(
        "[app-storage] MMKV native module unavailable; using AsyncStorage.",
        error,
      );
    }
    return null;
  }
}

async function ensureReady(): Promise<void> {
  if (Platform.OS === "web") return;
  const instance = getMmkv();
  if (!instance) return;
  if (!migrationPromise) {
    migrationPromise = migrateLegacyAsyncStorageOnce(instance);
  }
  await migrationPromise;
}

async function nativeGetItem(key: string): Promise<string | null> {
  await ensureReady();
  const instance = getMmkv();
  if (instance) {
    return instance.getString(key) ?? null;
  }
  return AsyncStorage.getItem(key);
}

async function nativeSetItem(key: string, value: string): Promise<void> {
  await ensureReady();
  const instance = getMmkv();
  if (instance) {
    instance.set(key, value);
    return;
  }
  await AsyncStorage.setItem(key, value);
}

async function nativeRemoveItem(key: string): Promise<void> {
  await ensureReady();
  const instance = getMmkv();
  if (instance) {
    instance.remove(key);
    return;
  }
  await AsyncStorage.removeItem(key);
}

/** Fast key-value storage: MMKV on iOS/Android, localStorage/AsyncStorage on web. */
export const appStorage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") {
        return localStorage.getItem(key);
      }
      return AsyncStorage.getItem(key);
    }
    return nativeGetItem(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(key, value);
        return;
      }
      await AsyncStorage.setItem(key, value);
      return;
    }
    await nativeSetItem(key, value);
  },

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(key);
        return;
      }
      await AsyncStorage.removeItem(key);
      return;
    }
    await nativeRemoveItem(key);
  },
};
