const { withGradleProperties } = require("@expo/config-plugins");

/**
 * Ensures Rive Android runtime version is set for EAS/CNG builds.
 * @see https://github.com/rive-app/rive-nitro-react-native#native-sdk-version-customization
 */
function withRiveGradle(config) {
  return withGradleProperties(config, (config) => {
    const rivePackage = require("@rive-app/react-native/package.json");
    const androidVersion = rivePackage.runtimeVersions?.android;

    if (androidVersion) {
      config.modResults.push({
        type: "property",
        key: "Rive_RiveRuntimeAndroidVersion",
        value: androidVersion,
      });
    }

    return config;
  });
}

module.exports = withRiveGradle;
