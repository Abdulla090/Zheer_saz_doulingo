import * as Sentry from "@sentry/react-native";

const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

let initialized = false;

export function initSentry(): void {
  if (initialized || !dsn) return;

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

export function captureError(error: unknown, context?: Record<string, unknown>) {
  if (!dsn) {
    if (__DEV__) console.error(error, context);
    return;
  }
  Sentry.withScope((scope) => {
    if (context) scope.setContext("extra", context);
    Sentry.captureException(error);
  });
}

export { Sentry };
