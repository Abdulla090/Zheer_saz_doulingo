const { withProjectBuildGradle } = require("@expo/config-plugins");

/** @type {import('@expo/config-plugins').ConfigPlugin} */
const withAlignWorkManager = (config) => {
  return withProjectBuildGradle(config, (modConfig) => {
    if (modConfig.modResults.language === "groovy") {
      let buildGradle = modConfig.modResults.contents;

      const searchString = "allprojects {";
      if (buildGradle.includes(searchString) && !buildGradle.includes("androidx.work:work-runtime")) {
        const insertion = `
  configurations.all {
    resolutionStrategy {
      force 'androidx.work:work-runtime:2.8.1'
      force 'androidx.work:work-runtime-ktx:2.8.1'
    }
  }`;
        // Insert after 'allprojects {'
        buildGradle = buildGradle.replace(
          searchString,
          `${searchString}${insertion}`
        );
        modConfig.modResults.contents = buildGradle;
      }
    }
    return modConfig;
  });
};

module.exports = withAlignWorkManager;
