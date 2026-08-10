export const USER_AGE_MIN = 6;
export const USER_AGE_MAX = 80;
export const DEFAULT_USER_AGE = 18;

export const USER_SEXES = ["female", "male"] as const;
export type UserSex = (typeof USER_SEXES)[number];

export function isUserSex(value: unknown): value is UserSex {
  return value === "female" || value === "male";
}

export function resolveUserAge(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number.parseInt(String(value), 10);
  if (!Number.isFinite(parsed)) return DEFAULT_USER_AGE;
  return Math.min(USER_AGE_MAX, Math.max(USER_AGE_MIN, Math.round(parsed)));
}

export function ageFromTrackPosition(position: number, trackWidth: number): number {
  "worklet";
  if (trackWidth <= 0) return DEFAULT_USER_AGE;
  const progress = Math.min(1, Math.max(0, position / trackWidth));
  return Math.round(USER_AGE_MIN + progress * (USER_AGE_MAX - USER_AGE_MIN));
}

export function trackPositionFromAge(age: number, trackWidth: number): number {
  "worklet";
  if (trackWidth <= 0) return 0;
  const safeAge = Math.min(USER_AGE_MAX, Math.max(USER_AGE_MIN, age));
  return ((safeAge - USER_AGE_MIN) / (USER_AGE_MAX - USER_AGE_MIN)) * trackWidth;
}
