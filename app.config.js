module.exports = ({ config }) => {
  const isKids = process.env.EXPO_PUBLIC_APP_VARIANT === 'kids';
  
  const finalConfig = {
    ...config,
    name: isKids ? "TWINO Kids" : "TWINO",
    slug: isKids ? "twino-kids" : "twino",
  };

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
