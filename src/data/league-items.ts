// Leaderboard rows now come from the secured `get_leaderboard` database RPC.
// Keep this module intentionally data-free so development builds cannot ship
// fake learners or generated profile photos.
export type LeagueEntry = {
  id: string;
  rank: number;
  name: string;
  level: number;
  xp: number;
  avatarUrl: string | null;
  selectedMascotId: string;
  isCurrentUser?: boolean;
};
