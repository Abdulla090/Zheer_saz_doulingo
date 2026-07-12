type PodcastAutoPlayState = {
  activeEpisodeId: string | null;
  autoPlayEpisodeId: string | null;
  isLoaded: boolean;
  playbackError: string | null;
};

export function canStartPodcastPlayback({
  activeEpisodeId,
  autoPlayEpisodeId,
  isLoaded,
  playbackError,
}: PodcastAutoPlayState): boolean {
  return Boolean(
    activeEpisodeId &&
      activeEpisodeId === autoPlayEpisodeId &&
      isLoaded &&
      !playbackError,
  );
}
