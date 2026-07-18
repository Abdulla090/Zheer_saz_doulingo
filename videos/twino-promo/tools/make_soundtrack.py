"""Generate TWINO's original 45-second launch soundtrack.

The track is deterministic and synthesized entirely with Python's standard
library so the rendered promo never depends on a remote or unlicensed asset.
"""

from __future__ import annotations

import math
import wave
from array import array
from pathlib import Path


SAMPLE_RATE = 48_000
BPM = 128.0
BEAT = 60.0 / BPM
BAR = BEAT * 4.0
BARS = 24
DURATION = BAR * BARS
TAU = math.tau


def midi(note: int) -> float:
    return 440.0 * (2.0 ** ((note - 69) / 12.0))


CHORDS = (
    (49, 52, 56, 61),  # C#m9
    (45, 49, 52, 56),  # Amaj7
    (40, 44, 47, 52),  # E
    (47, 51, 54, 59),  # B
)


def env_decay(age: float, decay: float) -> float:
    return math.exp(-age / decay) if age >= 0.0 else 0.0


def synth_sample(t: float) -> tuple[float, float]:
    bar_index = min(BARS - 1, int(t / BAR))
    bar_t = t - bar_index * BAR
    beat_index = int(bar_t / BEAT)
    beat_t = bar_t - beat_index * BEAT
    chord = CHORDS[(bar_index // 2) % len(CHORDS)]

    # Section automation: restrained opening, confident product build, warm CTA.
    if bar_index < 2:
        energy = 0.34
    elif bar_index < 8:
        energy = 0.56
    elif bar_index < 16:
        energy = 0.72
    elif bar_index < 20:
        energy = 0.88
    else:
        energy = 0.70

    left = 0.0
    right = 0.0

    # Wide, airy chord bed with slow filter-like amplitude movement.
    pad_attack = min(1.0, bar_t / 0.32)
    pad_release = min(1.0, (BAR - bar_t) / 0.38)
    pad_env = pad_attack * pad_release * (0.78 + 0.22 * math.sin(TAU * 0.12 * t))
    for idx, note in enumerate(chord):
        f = midi(note)
        detune = 1.0025 if idx % 2 else 0.9975
        base = math.sin(TAU * f * t) + 0.34 * math.sin(TAU * f * 2.0 * t + 0.25)
        wide = math.sin(TAU * f * detune * t + idx * 0.7)
        left += (base * 0.70 + wide * 0.30) * 0.042 * pad_env
        right += (base * 0.70 - wide * 0.30) * 0.042 * pad_env

    # Rounded sub bass, following chord roots and opening up in the feature run.
    root = midi(chord[0] - 12)
    bass_env = env_decay(beat_t, 0.31) * min(1.0, beat_t / 0.018)
    bass = (math.sin(TAU * root * t) + 0.22 * math.sin(TAU * root * 2.0 * t))
    bass *= 0.13 * bass_env * energy
    left += bass
    right += bass

    # 16th-note crystalline arpeggio. Notes spread slightly in stereo.
    step = BEAT / 4.0
    arp_index = int(bar_t / step)
    arp_age = bar_t - arp_index * step
    arp_note = chord[(arp_index + bar_index) % len(chord)] + 12
    arp_f = midi(arp_note)
    arp_env = env_decay(arp_age, 0.095) * min(1.0, arp_age / 0.006)
    arp = (math.sin(TAU * arp_f * t) + 0.24 * math.sin(TAU * arp_f * 2.0 * t))
    arp *= 0.072 * arp_env * energy
    pan = 0.32 * math.sin((arp_index + bar_index * 16) * 1.7)
    left += arp * (1.0 - pan)
    right += arp * (1.0 + pan)

    # Tight four-on-the-floor pulse with a short pitch drop.
    if bar_index >= 2:
        kick_age = beat_t
        kick_env = env_decay(kick_age, 0.13)
        kick_f = 48.0 + 92.0 * math.exp(-kick_age / 0.028)
        kick = math.sin(TAU * kick_f * kick_age) * kick_env * 0.34 * energy
        left += kick
        right += kick

    # Snare/clap on beats two and four; deterministic bright noise texture.
    if bar_index >= 4 and beat_index in (1, 3):
        snare_env = env_decay(beat_t, 0.095)
        noise = (
            math.sin(TAU * 6413.0 * t)
            + math.sin(TAU * 9137.0 * t + 1.3)
            + math.sin(TAU * 12347.0 * t + 0.4)
        ) / 3.0
        clap = (noise * 0.82 + math.sin(TAU * 188.0 * beat_t) * 0.18)
        clap *= snare_env * 0.19 * energy
        left += clap * 0.94
        right += clap * 1.06

    # Eighth-note hats, with extra offbeat lift in the final third.
    hat_step = BEAT / 2.0
    hat_index = int(bar_t / hat_step)
    hat_age = bar_t - hat_index * hat_step
    hat_env = env_decay(hat_age, 0.034)
    hat_noise = (
        math.sin(TAU * 10993.0 * t)
        + math.sin(TAU * 14341.0 * t + 0.9)
    ) * 0.5
    hat_gain = 0.052 * energy * (1.25 if bar_index >= 16 and hat_index % 2 else 1.0)
    hat = hat_noise * hat_env * hat_gain
    left += hat * 1.12
    right += hat * 0.88

    # Section-change impact and upward tonal sweep for cinematic handoffs.
    section_starts = (0, 4, 8, 12, 16, 20)
    for start_bar in section_starts:
        age = t - start_bar * BAR
        if 0.0 <= age < 1.3:
            impact = math.sin(TAU * (74.0 + 8.0 * age) * age) * env_decay(age, 0.42)
            shimmer = math.sin(TAU * (880.0 + 1250.0 * age) * age) * env_decay(age, 0.62)
            left += impact * 0.15 + shimmer * 0.018
            right += impact * 0.15 - shimmer * 0.018

    # Musical fade-in/out, then a transparent soft limiter.
    fade_in = min(1.0, t / 0.55)
    fade_out = min(1.0, (DURATION - t) / 1.45)
    master = fade_in * max(0.0, fade_out) * 0.92
    return math.tanh(left * master * 1.55), math.tanh(right * master * 1.55)


def main() -> None:
    out = Path(__file__).resolve().parents[1] / "assets" / "audio" / "twino-launch.wav"
    out.parent.mkdir(parents=True, exist_ok=True)
    frames = int(DURATION * SAMPLE_RATE)
    pcm = array("h")
    for i in range(frames):
        left, right = synth_sample(i / SAMPLE_RATE)
        pcm.append(int(max(-1.0, min(1.0, left)) * 32767))
        pcm.append(int(max(-1.0, min(1.0, right)) * 32767))
    with wave.open(str(out), "wb") as wav:
        wav.setnchannels(2)
        wav.setsampwidth(2)
        wav.setframerate(SAMPLE_RATE)
        wav.writeframes(pcm.tobytes())
    print(f"Wrote {out} ({DURATION:.2f}s, {SAMPLE_RATE}Hz stereo)")


if __name__ == "__main__":
    main()
