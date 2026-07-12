import { describe, expect, it } from "@jest/globals";

import { canStartPodcastPlayback } from "../podcast-playback";

describe("canStartPodcastPlayback", () => {
  const readyEpisode = {
    activeEpisodeId: "basic-1",
    autoPlayEpisodeId: "basic-1",
    isLoaded: true,
    playbackError: null,
  };

  it("starts only after the selected native audio asset is loaded", () => {
    expect(canStartPodcastPlayback(readyEpisode)).toBe(true);
    expect(canStartPodcastPlayback({ ...readyEpisode, isLoaded: false })).toBe(false);
  });

  it("does not start a stale or failed audio asset", () => {
    expect(
      canStartPodcastPlayback({ ...readyEpisode, autoPlayEpisodeId: "advanced-2" }),
    ).toBe(false);
    expect(
      canStartPodcastPlayback({ ...readyEpisode, playbackError: "Decoder failed" }),
    ).toBe(false);
  });
});
