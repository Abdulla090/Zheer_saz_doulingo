const { withProjectBuildGradle } = require("@expo/config-plugins");

/** @type {import('@expo/config-plugins').ConfigPlugin} */
const withAlignWorkManager = (config) => {
  return withProjectBuildGradle(config, (modConfig) => {
    if (modConfig.modResults.language === "groovy") {
      let buildGradle = modConfig.modResults.contents;

      const searchString = "allprojects {";
      if (buildGradle.includes(searchString) && !buildGradle.includes("androidx.work")) {
        const insertion = `
  // Only redirect buildDir/cmake on Windows local builds (not EAS/CI Linux)
  if (org.gradle.internal.os.OperatingSystem.current().isWindows() && System.getenv('EAS_BUILD') == null) {
    if (project.name != 'PINGO') {
      buildDir = "C:/tmp/build-phingo/\${project.name}"
      new File(buildDir.toString()).mkdirs()
    }

    afterEvaluate {
      if (project.extensions.findByName("android") != null) {
        android {
          externalNativeBuild {
            cmake {
              buildStagingDirectory = "C:/tmp/cxx-phingo/\${project.name}"
            }
          }
        }
        new File("C:/tmp/cxx-phingo/\${project.name}").mkdirs()
      }
    }
  }

  configurations.all {
    resolutionStrategy {
      force 'androidx.work:work-runtime:2.8.1'
    }
    exclude group: 'androidx.work', module: 'work-runtime-ktx'
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
