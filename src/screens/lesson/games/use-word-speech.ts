import { useCallback, useEffect } from "react";

import { useTTS } from "../../../hooks/use-tts";
import { isDeviceTtsSupported } from "../../../utils/tts-language-support";

type WordSpeechOptions = {
  rate?: number;
  pitch?: number;
  onDone?: () => void;
  /**
   * Overrides the hook's language for one call. Pair-matching games show a
   * native-language column beside a target-language one, and both should read
   * in their own voice — one hook instance with an override keeps that to a
   * single TTS instance, so the two columns cancel each other's audio instead
   * of talking over it.
   */
  language?: string | null;
};

/**
 * Tap-to-speak for lesson games.
 *
 * Every game that shows a target-language token the learner can tap — a bank
 * tile, an option row, a matched pair — should read that token aloud. Wiring
 * that by hand meant only some games got it, so a lesson that drew
 * `sentence_builder` spoke tapped words while one that drew `listen_build` sat
 * silent even though the two look identical on screen. This centralises the
 * three decisions that kept drifting:
 *
 * - `provider: "device"` — a tap must answer instantly. The default "auto"
 *   provider takes a Gemini network round-trip, which is right for a whole
 *   sentence and far too slow for a single word.
 * - `isDeviceTtsSupported` — no shipping device engine has a Sorani voice, and
 *   `useTTS` maps Kurdish onto `ar-IQ`, so it would read Kurdish orthography
 *   with Arabic phonology. Silence is the honest option.
 * - Empty/whitespace tokens never reach the engine.
 *
 * The raw `speak` is passed through for callers that also drive a longer
 * prompt (e.g. the slowed sentence in `ListenBuildGame`), so a game needs only
 * one TTS instance and its taps and prompt cancel each other correctly.
 */
export function useWordSpeech(languageCode?: string | null) {
  const { speak, stop, speaking, activeId } = useTTS();
  const language = languageCode?.trim() || "en";
  const canSpeak = isDeviceTtsSupported(language);

  const speakWord = useCallback(
    (text: string | null | undefined, id?: string, options?: WordSpeechOptions) => {
      const { language: override, ...speechOptions } = options ?? {};
      const spokenLanguage = override?.trim() || language;
      if (!isDeviceTtsSupported(spokenLanguage)) return;
      const normalized = text?.trim();
      if (!normalized) return;
      void speak(normalized, spokenLanguage, id, {
        ...speechOptions,
        provider: "device",
      });
    },
    [language, speak],
  );

  /*
   * Leaving the game kills whatever it was saying. `stop` is stable, so this
   * only runs on unmount — without it a word tapped just before the lesson
   * advances keeps reading over the next question.
   */
  useEffect(() => () => void stop(), [stop]);

  return { speakWord, speak, stop, speaking, activeId, canSpeak, language };
}
