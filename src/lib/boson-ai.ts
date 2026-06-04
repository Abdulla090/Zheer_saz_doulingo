import { Audio } from "expo-av";

const BOSON_API_KEY = "bai-09QmWbsH1_qMoX6GJ0IUZlL-D-Q_YJLa9W_tdBQbxQIVA4rn";
const BOSON_API_URL = "https://api.boson.ai/v1/audio/speech";

export async function generateSpeech(text: string, voice = "default") {
  try {
    const response = await fetch(BOSON_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BOSON_API_KEY}`,
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
  const { sound } = await Audio.Sound.createAsync({ uri });
  await sound.playAsync();
}
