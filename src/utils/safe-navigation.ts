type SafeExitRouter<T> = {
  replace: (target: T) => unknown;
  navigate: (target: T) => unknown;
};

/** Replace a feature route with its owning tab without popping parent navigators. */
export function replaceWithFallback<T>(router: SafeExitRouter<T>, fallback: T) {
  try {
    router.replace(fallback);
  } catch {
    try {
      router.navigate(fallback);
    } catch {
      // Navigation must never escape into the app-wide error boundary.
    }
  }
}
