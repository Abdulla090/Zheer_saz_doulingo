module.exports = ({ config }) => {
  const isKids = process.env.EXPO_PUBLIC_APP_VARIANT === 'kids';
  const isProductionBuild = process.env.EAS_BUILD_PROFILE === 'production';
  const sentryDsn = process.env.EXPO_PUBLIC_SENTRY_DSN?.trim();
  const sentryOrg = process.env.SENTRY_ORG?.trim();
  const sentryProject = process.env.SENTRY_PROJECT?.trim();
  const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN?.trim();
  const sentryUploadReady = Boolean(
    sentryOrg && sentryProject && sentryAuthToken,
  );

  if (isProductionBuild && (!sentryDsn || !sentryUploadReady)) {
    const missing = [
      !sentryDsn && 'EXPO_PUBLIC_SENTRY_DSN',
      !sentryOrg && 'SENTRY_ORG',
      !sentryProject && 'SENTRY_PROJECT',
      !sentryAuthToken && 'SENTRY_AUTH_TOKEN',
    ].filter(Boolean);
    throw new Error(
      `Production monitoring is incomplete. Configure ${missing.join(', ')} in the EAS production environment.`,
    );
  }
  
  const finalConfig = {
    ...config,
    name: isKids ? "TWINO Kids" : "TWINO",
    slug: isKids ? "twino-kids" : "twino",
  };

  const sentryPlugin = [
    "@sentry/react-native",
    {
      ...(sentryOrg ? { organization: sentryOrg } : {}),
      ...(sentryProject ? { project: sentryProject } : {}),
      url: "https://sentry.io/",
      enableSourceMapsUpload: sentryUploadReady,
    },
  ];
  let hasSentryPlugin = false;
  finalConfig.plugins = (finalConfig.plugins ?? []).map((plugin) => {
    const pluginName = Array.isArray(plugin) ? plugin[0] : plugin;
    if (pluginName !== "@sentry/react-native") return plugin;
    hasSentryPlugin = true;
    return sentryPlugin;
  });
  if (!hasSentryPlugin) {
    finalConfig.plugins.push(sentryPlugin);
  }

  if (isKids) {
    // Override identifier/package name to build as a separate app
    finalConfig.ios = {
      ...finalConfig.ios,
      bundleIdentifier: "com.hewad.mubariz.twinokids",
    };
    finalConfig.android = {
      ...finalConfig.android,
      package: "com.hewad.mubariz.twinokids",
    };
  }

  return finalConfig;
};
