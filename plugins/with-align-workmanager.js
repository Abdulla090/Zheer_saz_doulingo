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
    // Redirect buildDir for all sub-projects EXCEPT root and :app
    // (:app must stay in-place so autolinking.json is found by Gradle)
    if (project != rootProject && project.name != 'app') {
      buildDir = "C:/tmp/build-twino/\${project.name}"
      new File(buildDir.toString()).mkdirs()
    }

    // Redirect cmake buildStagingDirectory for ALL android sub-projects including :app
    // This keeps all prefab packages co-located in C:/tmp/cxx-twino/ so CMake can find them
    if (project != rootProject) {
      afterEvaluate {
        if (project.extensions.findByName("android") != null) {
          android {
            externalNativeBuild {
              cmake {
                buildStagingDirectory = "C:/tmp/cxx-twino/\${project.name}"
              }
            }
          }
          new File("C:/tmp/cxx-twino/\${project.name}").mkdirs()
        }
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
