import { createAudioPlayer } from "expo-audio";

const BOSON_API_URL = "https://api.boson.ai/v1/audio/speech";

function getBosonApiKey(): string | undefined {
  const key = process.env.EXPO_PUBLIC_BOSON_API_KEY?.trim();
  return key || undefined;
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

    const blob = await response.blob();
    const uri = URL.createObjectURL(blob);
    return uri;
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
