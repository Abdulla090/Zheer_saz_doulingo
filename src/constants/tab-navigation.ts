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
  "podcast",
  "reading-practice",
  "exam-center",
]);

export function pathnameHidesTabBar(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.some((segment) => TAB_BAR_HIDDEN_ROUTES.has(segment))) return true;
  return segments.includes("admin");
}
