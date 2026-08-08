/**
 * Lesson sound effects — the "correct answer" celebration and the end-of-lesson
 * fanfare, shared by every game.
 *
 * Players are created lazily and then reused for the life of the app rather than
 * rebuilt per use: `createAudioPlayer` decodes the asset on construction, so
 * building one inside an answer handler would put decode latency between the tap
 * and the sound, and would leak a native player per question unless every caller
 * remembered to release it.
 */

import { createAudioPlayer, type AudioPlayer } from "expo-audio";

import { useSettingsStore } from "../stores/useSettingsStore";

const SOURCES = {
  celebrate: require("../../assets/sounds/game-celebrate-sound.mp3"),
  lessonFinish: require("../../assets/sounds/lesson-finish-sound.mp3"),
} as const;

type SoundName = keyof typeof SOURCES;

const players = new Map<SoundName, AudioPlayer>();
const unavailable = new Set<SoundName>();

function getPlayer(name: SoundName): AudioPlayer | null {
  const existing = players.get(name);
  if (existing) return existing;
  // A failed construction is permanent (missing codec, no audio device); retrying
  // on every correct answer would just burn time in the tap handler.
  if (unavailable.has(name)) return null;
  try {
    const created = createAudioPlayer(SOURCES[name]);
    players.set(name, created);
    return created;
  } catch {
    unavailable.add(name);
    return null;
  }
}

/**
 * Play one effect, cutting off any other one still sounding.
 *
 * Answering the last question correctly fires the celebration and then, one tap
 * later, the lesson fanfare — close enough to overlap if the learner is quick.
 * The newest effect wins, the same way the newest utterance wins in `useTTS`.
 *
 * Never throws and never blocks: a missing or broken sound must not be able to
 * take a lesson down with it.
 */
function play(name: SoundName): void {
  // Honours the existing "Sound effects" setting, which until now toggled nothing.
  if (!useSettingsStore.getState().soundsEnabled) return;

  const active = getPlayer(name);
  if (!active) return;

  for (const [other, otherPlayer] of players) {
    if (other === name) continue;
    try {
      otherPlayer.pause();
    } catch {
      /* Already released or never started — nothing to silence. */
    }
  }

  try {
    /*
     * Rewind before replaying. Two correct answers can land inside the clip's
     * own length, and a player left at its end would otherwise stay silent on
     * the second call. `seekTo` resolves asynchronously, but pausing first
     * means playback restarts from the head either way.
     */
    active.pause();
    void active.seekTo(0).catch(() => {});
    active.play();
  } catch {
    /* Non-essential audio: swallow and let the lesson continue. */
  }
}

/** Correct answer, any game type. */
export function playCelebrateSound(): void {
  play("celebrate");
}

/** Lesson cleared. Not played when the learner runs out of hearts. */
export function playLessonFinishSound(): void {
  play("lessonFinish");
}
