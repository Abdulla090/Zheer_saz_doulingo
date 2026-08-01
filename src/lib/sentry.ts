import * as Sentry from "@sentry/react-native";

const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN?.trim();

let initialized = false;

export function initSentry(): void {
  if (initialized) return;

  if (!dsn) {
    if (!__DEV__) {
      console.warn(
        "[Sentry] EXPO_PUBLIC_SENTRY_DSN is missing — production builds will not report crashes.",
      );
    }
    return;
  }

  const useLegacyRnFetch = process.env.EXPO_PUBLIC_USE_RN_FETCH === "1";

  Sentry.init({
    dsn,
    environment: __DEV__ ? "development" : "production",
    enabled: !__DEV__ || Boolean(process.env.EXPO_PUBLIC_SENTRY_DEBUG),
    tracesSampleRate: __DEV__ ? 1 : 0.15,
    integrations: [
      Sentry.reactNativeTracingIntegration({
        traceFetch: !useLegacyRnFetch,
      }),
      Sentry.breadcrumbsIntegration({ fetch: true }),
    ],
  });

  initialized = true;
}

export function isSentryInitialized(): boolean {
  return initialized;
}

export function wrapSentry<T>(Component: T): T {
  if (initialized) {
    return Sentry.wrap(Component as any) as unknown as T;
  }
  return Component;
}

export function captureError(error: unknown, context?: Record<string, unknown>) {
  if (!dsn || !initialized) {
    if (__DEV__) console.error(error, context);
    return;
  }
  Sentry.withScope((scope) => {
    if (context) scope.setContext("extra", context);
    Sentry.captureException(error);
  });
}

export { Sentry };
