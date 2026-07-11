import { createAudioPlayer } from "expo-audio";
import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";

const BOSON_API_URL = "https://api.boson.ai/v1/audio/speech";

function getBosonApiKey(): string | undefined {
  const key = process.env.EXPO_PUBLIC_BOSON_API_KEY?.trim();
  return key || undefined;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  if (typeof globalThis.btoa !== "function") {
    throw new Error("Base64 encode unavailable.");
  }
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return globalThis.btoa(binary);
}

export function isBosonConfigured(): boolean {
  return Boolean(getBosonApiKey());
}

export async function generateSpeech(text: string, voice = "default") {
  const apiKey = getBosonApiKey();
  if (!apiKey) {
    throw new Error(
      "Boson TTS is not configured. Set EXPO_PUBLIC_BOSON_API_KEY or use the in-app roleplay screen.",
    );
  }

  try {
    const response = await fetch(BOSON_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        input: text,
        model: "higgs-audio-v3-tts",
        voice,
      }),
    });

    if (!response.ok) {
      throw new Error(`Boson API error: ${response.statusText}`);
    }

    if (Platform.OS === "web") {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }

    const audioBuffer = await response.arrayBuffer();
    const base64 = arrayBufferToBase64(audioBuffer);
    const cacheDir = FileSystem.cacheDirectory;
    if (!cacheDir) {
      throw new Error("Audio cache directory unavailable.");
    }

    const fileUri = `${cacheDir}boson-tts-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.mp3`;
    await FileSystem.writeAsStringAsync(fileUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return fileUri;
  } catch (error) {
    console.error("Failed to generate speech with Boson:", error);
    throw error;
  }
}

export async function playBosonSpeech(text: string) {
  const uri = await generateSpeech(text);
  const player = createAudioPlayer(uri);
  player.play();

  return new Promise<void>((resolve) => {
    const sub = player.addListener("playbackStatusUpdate", (status: any) => {
      if (status.didJustFinish || (status.currentTime > 0 && !status.playing)) {
        sub.remove();
        resolve();
      }
    });
    setTimeout(() => {
      resolve();
    }, 10000);
  });
}
