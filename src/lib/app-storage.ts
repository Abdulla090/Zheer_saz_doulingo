import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

import { migrateLegacyAsyncStorageOnce } from "./migrate-legacy-storage";

type MmkvInstance = {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  remove: (key: string) => void;
};

let mmkv: MmkvInstance | null = null;
let mmkvUnavailable = false;

function getMmkv(): MmkvInstance | null {
  if (Platform.OS === "web" || mmkvUnavailable) return null;
  if (mmkv) return mmkv;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
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

// Trigger migration in the background on startup, without blocking hot-path execution
if (Platform.OS !== "web") {
  const instance = getMmkv();
  if (instance) {
    void migrateLegacyAsyncStorageOnce(instance).catch((err) => {
      if (__DEV__) {
        console.warn("[app-storage] Legacy storage migration failed:", err);
      }
    });
  }
}

async function nativeGetItem(key: string): Promise<string | null> {
  const instance = getMmkv();
  if (instance) {
    return instance.getString(key) ?? null;
  }
  return AsyncStorage.getItem(key);
}

async function nativeSetItem(key: string, value: string): Promise<void> {
  const instance = getMmkv();
  if (instance) {
    instance.set(key, value);
    return;
  }
  await AsyncStorage.setItem(key, value);
}

async function nativeRemoveItem(key: string): Promise<void> {
  const instance = getMmkv();
  if (instance) {
    instance.remove(key);
    return;
  }
  await AsyncStorage.removeItem(key);
}

/** Fast key-value storage: MMKV on iOS/Android, localStorage/AsyncStorage on web. */
export const appStorage = {
  // Synchronous API
  getItemSync(key: string): string | null {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") {
        return localStorage.getItem(key);
      }
      return null;
    }
    const instance = getMmkv();
    if (instance) {
      return instance.getString(key) ?? null;
    }
    return null;
  },

  setItemSync(key: string, value: string): void {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(key, value);
      }
      return;
    }
    const instance = getMmkv();
    if (instance) {
      instance.set(key, value);
    }
  },

  removeItemSync(key: string): void {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(key);
      }
      return;
    }
    const instance = getMmkv();
    if (instance) {
      instance.remove(key);
    }
  },

  // Asynchronous API (kept for backward compatibility where needed)
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

