// Web stub for Sentry to prevent @sentry/react-native crashing on web due to missing NativeModules.

export function initSentry(): void {
  // Sentry is disabled on web for now. To enable it, use @sentry/react
}

export function captureError(error: unknown, context?: Record<string, unknown>) {
  if (__DEV__) console.error("Sentry (Web Mock) captured error:", error, context);
}

export const Sentry = {
  wrap: (App: any) => App,
  captureException: captureError,
};
