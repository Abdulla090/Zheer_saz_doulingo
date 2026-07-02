module.exports = ({ config }) => {
  const isKids = process.env.EXPO_PUBLIC_APP_VARIANT === 'kids';
  
  const finalConfig = {
    ...config,
    name: isKids ? "PINGO Kids" : "PINGO",
    slug: isKids ? "pingo-kids" : "duolingo-clone",
  };

  if (isKids) {
    // Override identifier/package name to build as a separate app
    finalConfig.ios = {
      ...finalConfig.ios,
      bundleIdentifier: "com.hewad.mubariz.pingokids",
    };
    finalConfig.android = {
      ...finalConfig.android,
      package: "com.hewad.mubariz.pingokids",
    };
  }

  return finalConfig;
};
