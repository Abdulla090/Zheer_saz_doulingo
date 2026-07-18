"""Generate deterministic original UI and transition SFX for the TWINO promo."""

from __future__ import annotations

import math
import wave
from array import array
from pathlib import Path


SR = 48_000
TAU = math.tau


def write(name: str, duration: float, synth) -> None:
    out = Path(__file__).resolve().parents[1] / "assets" / "audio" / "sfx" / name
    out.parent.mkdir(parents=True, exist_ok=True)
    pcm = array("h")
    for i in range(int(duration * SR)):
        t = i / SR
        l, r = synth(t, duration)
        pcm.extend((int(max(-1, min(1, l)) * 32767), int(max(-1, min(1, r)) * 32767)))
    with wave.open(str(out), "wb") as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(SR)
        f.writeframes(pcm.tobytes())


def impact(t: float, d: float) -> tuple[float, float]:
    e = math.exp(-t / 0.22) * min(1.0, t / 0.005)
    low = math.sin(TAU * (72 + 28 * math.exp(-t / 0.05)) * t)
    crack = (math.sin(TAU * 2200 * t) + math.sin(TAU * 3710 * t + 0.7)) * math.exp(-t / 0.035)
    v = math.tanh((low * 0.72 + crack * 0.18) * e * 1.7)
    return v, v


def whoosh(t: float, d: float) -> tuple[float, float]:
    x = t / d
    e = math.sin(math.pi * x) ** 1.7
    f = 260 + 2600 * x * x
    noise = (math.sin(TAU * f * t) + math.sin(TAU * f * 1.73 * t + 0.8)) * 0.5
    pan = 0.75 * (x * 2 - 1)
    v = noise * e * 0.34
    return v * (1 - pan), v * (1 + pan)


def click(t: float, d: float) -> tuple[float, float]:
    e = math.exp(-t / 0.018)
    v = (math.sin(TAU * 1250 * t) + 0.55 * math.sin(TAU * 2400 * t)) * e * 0.32
    return v, v


def chime(t: float, d: float) -> tuple[float, float]:
    e = math.exp(-t / 0.38) * min(1.0, t / 0.008)
    l = (math.sin(TAU * 880 * t) + 0.5 * math.sin(TAU * 1320 * t)) * e * 0.22
    r = (math.sin(TAU * 990 * t) + 0.5 * math.sin(TAU * 1485 * t)) * e * 0.22
    return l, r


def bloom(t: float, d: float) -> tuple[float, float]:
    x = t / d
    e = math.sin(math.pi * x) ** 1.4
    base = math.sin(TAU * (220 + 520 * x) * t)
    air = math.sin(TAU * (920 + 1500 * x) * t + 0.5)
    return (base * 0.18 + air * 0.08) * e, (base * 0.18 - air * 0.08) * e


if __name__ == "__main__":
    write("impact.wav", 0.65, impact)
    write("whoosh.wav", 0.75, whoosh)
    write("click.wav", 0.16, click)
    write("chime.wav", 0.85, chime)
    write("bloom.wav", 1.25, bloom)
    print("Wrote five original TWINO SFX")
