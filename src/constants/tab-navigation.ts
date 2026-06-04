export const TAB_BAR_HIDDEN_ROUTES = new Set([
  "lesson",
  "guidebook",
  "roleplay",
  "voice-tutor",
  "ai-teacher",
  "quest",
  "league",
  "privacy-policy",
  "ai-safety",
  "terms",
  "slang",
]);

export function pathnameHidesTabBar(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  const last = segments[segments.length - 1];
  if (last && TAB_BAR_HIDDEN_ROUTES.has(last)) return true;
  return segments.includes("admin");
}
