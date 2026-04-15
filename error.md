[4/10/2026 12:11 AM] Abdullla: Build failed: Gradle build failed with unknown error. See logs for the "Run gradlew" phase for more information.



Running 'gradlew :app:assembleRelease' in /home/expo/workingdir/build/android
Welcome to Gradle 9.0.0!
Here are the highlights of this release:
- Configuration Cache is the recommended execution mode
 - Gradle requires JVM 17 or higher to run
 - Build scripts use Kotlin 2.2 and Groovy 4.0
 - Improved Kotlin DSL script compilation avoidance
For more details see https://docs.gradle.org/9.0.0/release-notes.html
To honour the JVM settings for this build a single-use Daemon process will be forked. For more on this, please refer to https://docs.gradle.org/9.0.0/userguide/gradle_daemon.html#sec:disabling_the_daemon in the Gradle documentation.
Daemon will be stopped at the end of the build
> Task :expo-gradle-plugin:expo-autolinking-settings-plugin:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :gradle-plugin:settings-plugin:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :gradle-plugin:shared:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :expo-gradle-plugin:expo-autolinking-plugin-shared:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :expo-gradle-plugin:expo-autolinking-settings-plugin:pluginDescriptors
> Task :gradle-plugin:settings-plugin:pluginDescriptors
> Task :expo-gradle-plugin:expo-autolinking-settings-plugin:processResources
> Task :gradle-plugin:settings-plugin:processResources
> Task :expo-gradle-plugin:expo-autolinking-plugin-shared:processResources NO-SOURCE
> Task :gradle-plugin:shared:processResources
NO-SOURCE
> Task :gradle-plugin:shared:compileKotlin
> Task :gradle-plugin:shared:compileJava NO-SOURCE
> Task :gradle-plugin:shared:classes UP-TO-DATE
> Task :gradle-plugin:shared:jar
> Task :expo-gradle-plugin:expo-autolinking-plugin-shared:compileKotlin
> Task :expo-gradle-plugin:expo-autolinking-plugin-shared:compileJava
NO-SOURCE
> Task :expo-gradle-plugin:expo-autolinking-plugin-shared:classes
UP-TO-DATE
> Task :expo-gradle-plugin:expo-autolinking-plugin-shared:jar
> Task :gradle-plugin:settings-plugin:compileKotlin
> Task :gradle-plugin:settings-plugin:compileJava
NO-SOURCE
> Task :gradle-plugin:settings-plugin:classes
> Task :gradle-plugin:settings-plugin:jar
> Task :expo-gradle-plugin:expo-autolinking-settings-plugin:compileKotlin
> Task :expo-gradle-plugin:expo-autolinking-settings-plugin:compileJava NO-SOURCE
> Task :expo-gradle-plugin:expo-autolinking-settings-plugin:classes
> Task :expo-gradle-plugin:expo-autolinking-settings-plugin:jar
> Task :expo-gradle-plugin:expo-autolinking-plugin:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :expo-gradle-plugin:expo-max-sdk-override-plugin:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :expo-module-gradle-plugin:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :gradle-plugin:react-native-gradle-plugin:checkKotlinGradlePluginConfigurationErrors SKIPPED
> Task :expo-module-gradle-plugin:pluginDescriptors
> Task :expo-module-gradle-plugin:processResources
> Task :expo-gradle-plugin:expo-max-sdk-override-plugin:pluginDescriptors
> Task :expo-gradle-plugin:expo-max-sdk-override-plugin:processResources
> Task :expo-gradle-plugin:expo-autolinking-plugin:pluginDescriptors
> Task :expo-gradle-plugin:expo-autolinking-plugin:processResources
> Task :expo-gradle-plugin:expo-max-sdk-override-plugin:compileKotlin
> Task :expo-gradle-plugin:expo-max-sdk-override-plugin:compileJava NO-SOURCE
> Task :expo-gradle-plugin:expo-max-sdk-override-plugin:classes
> Task :expo-gradle-plugin:expo-max-sdk-override-plugin:jar
> Task :expo-gradle-plugin:expo-autolinking-plugin:compileKotlin
> Task :expo-gradle-plugin:expo-autolinking-plugin:compileJava NO-SOURCE
> Task :expo-gradle-plugin:expo-autolinking-plugin:classes
[4/10/2026 12:11 AM] Abdullla: > Task :expo-gradle-plugin:expo-autolinking-plugin:jar
> Task :gradle-plugin:react-native-gradle-plugin:pluginDescriptors
> Task :gradle-plugin:react-native-gradle-plugin:processResources
> Task :gradle-plugin:react-native-gradle-plugin:compileKotlin
> Task :gradle-plugin:react-native-gradle-plugin:compileJava NO-SOURCE
> Task :gradle-plugin:react-native-gradle-plugin:classes
> Task :gradle-plugin:react-native-gradle-plugin:jar
> Task :expo-module-gradle-plugin:compileKotlin
w: file:///home/expo/workingdir/build/node_modules/expo-modules-core/expo-module-gradle-plugin/src/main/kotlin/expo/modules/plugin/android/AndroidLibraryExtension.kt:9:24 'var targetSdk: Int?' is deprecated. Will be removed from library DSL in v9.0. Use testOptions.targetSdk or/and lint.targetSdk instead.
> Task :expo-module-gradle-plugin:compileJava NO-SOURCE
> Task :expo-module-gradle-plugin:classes
> Task :expo-module-gradle-plugin:jar
> Configure project :
 [32m[ExpoRootProject] [0m Using the following versions:
  - buildTools:   [32m36.0.0 [0m
  - minSdk:       [32m24 [0m
  - compileSdk:   [32m36 [0m
  - targetSdk:    [32m36 [0m
  - ndk:          [32m27.1.12297006 [0m
  - kotlin:       [32m2.1.20 [0m
  - ksp:          [32m2.1.20-2.0.1 [0m
> Configure project :app
ℹ️   [33mApplying gradle plugin [0m ' [32mexpo-max-sdk-override-plugin [0m'
  [expo-max-sdk-override-plugin] This plugin will find all permissions declared with android:maxSdkVersion. If there exists a declaration with the android:maxSdkVersion annotation and another one without, the plugin will remove the annotation from the final merged manifest. In order to see a log with the changes run a clean build of the app.
> Configure project :expo
Using expo modules
  -  [32mexpo-log-box [0m (55.0.10)
  -  [32mexpo-constants [0m (55.0.12)
> Configure project :expo-modules-core
Linking react-native-worklets native libs into expo-modules-core build tasks
task ':react-native-worklets:mergeDebugNativeLibs'
task ':react-native-worklets:mergeReleaseNativeLibs'
> Configure project :expo
  -  [32mexpo-modules-core [0m (55.0.21)
  -  [33m[📦] [0m  [32mexpo-dom-webview [0m (55.0.5)
  -  [33m[📦] [0m  [32mexpo-asset [0m (55.0.13)
  -  [33m[📦] [0m  [32mexpo-device [0m (55.0.13)
  -  [33m[📦] [0m  [32mexpo-file-system [0m (55.0.15)
  -  [33m[📦] [0m  [32mexpo-font [0m (55.0.6)
  -  [33m[📦] [0m  [32mexpo-haptics [0m (55.0.13)
  -  [33m[📦] [0m  [32mexpo-image [0m (55.0.8)
  -  [33m[📦] [0m  [32mexpo-keep-awake [0m (55.0.6)
  -  [33m[📦] [0m  [32mexpo-linear-gradient [0m (55.0.12)
  -  [33m[📦] [0m  [32mexpo-linking [0m (55.0.11)
  -  [33m[📦] [0m  [32mexpo-router [0m (55.0.11)
  -  [33m[📦] [0m  [32mexpo-splash-screen [0m (55.0.16)
  -  [33m[📦] [0m  [32mexpo-system-ui [0m (55.0.14)
  -  [33m[📦] [0m  [32mexpo-web-browser [0m (55.0.13)
> Configure project :react-native-nitro-modules
[NitroModules] 🔥 Your app is boosted by nitro modules!
> Configure project :rive-app_react-native
[NitroModules] 🔥 rive is boosted by nitro!
@rive-app/react-native: Rive Android SDK 11.3.1
Checking the license for package NDK (Side by side) 27.0.12077973 in /home/expo/Android/Sdk/licenses
License for package NDK (Side by side) 27.0.12077973 accepted.
Preparing "Install NDK (Side by side) 27.0.12077973 v.27.0.12077973".
"Install NDK (Side by side) 27.0.12077973 v.27.0.12077973" ready.
Installing NDK (Side by side) 27.0.12077973 in /home/expo/Android/Sdk/ndk/27.0.12077973
"Install NDK (Side by side) 27.0.12077973 v.27.0.12077973" complete.
"Install NDK (Side by side) 27.0.12077973 v.27.0.12077973" finished.
> Configure project :shopify_react-native-skia
react-native-skia: node_modules/ found at: /home/expo/workingdir/build/node_modules
react-native-skia: RN Version: 83 / 0.83.4
react-native-skia: isSourceBuild: false
react-native-skia: PrebuiltDir: /home/expo/workingdir/build/node_modules/@shopify/react-native-skia/android/build/react-native-0*/jni
[4/10/2026 12:11 AM] Abdullla: react-native-skia: buildType: release
react-native-skia: buildDir: /home/expo/workingdir/build/node_modules/@shopify/react-native-skia/android/build
react-native-skia: node_modules: /home/expo/workingdir/build/node_modules
react-native-skia: Enable Prefab: true
react-native-skia: aar state post 70, do nothing
> Task :expo-log-box:preBuild UP-TO-DATE
> Task :expo-modules-core:preBuild UP-TO-DATE
> Task :expo:generatePackagesList
> Task :expo:preBuild
> Task :app:generateAutolinkingNewArchitectureFiles
> Task :app:generateAutolinkingPackageList
> Task :app:generateCodegenSchemaFromJavaScript SKIPPED
> Task :app:generateCodegenArtifactsFromSchema SKIPPED
> Task :app:generateReactNativeEntryPoint
> Task :expo-constants:createExpoConfig
> Task :expo-constants:preBuild
The NODE_ENV environment variable is required but was not specified. Ensure the project is bundled with Expo CLI or NODE_ENV is set. Using only .env.local and .env
> Task :react-native-reanimated:assertMinimalReactNativeVersionTask
> Task :react-native-reanimated:assertNewArchitectureEnabledTask SKIPPED
> Task :react-native-ease:generateCodegenSchemaFromJavaScript
> Task :react-native-gesture-handler:generateCodegenSchemaFromJavaScript
> Task :react-native-reanimated:assertWorkletsVersionTask
> Task :react-native-nitro-modules:generateCodegenSchemaFromJavaScript
> Task :react-native-ease:generateCodegenArtifactsFromSchema
> Task :react-native-ease:preBuild
> Task :react-native-reanimated:generateCodegenSchemaFromJavaScript
> Task :react-native-gesture-handler:generateCodegenArtifactsFromSchema
> Task :react-native-gesture-handler:preBuild
> Task :react-native-nitro-modules:generateCodegenArtifactsFromSchema
> Task :react-native-nitro-modules:prepareHeaders
> Task :react-native-nitro-modules:preBuild
> Task :react-native-safe-area-context:generateCodegenSchemaFromJavaScript
> Task :react-native-reanimated:generateCodegenArtifactsFromSchema
> Task :react-native-reanimated:prepareReanimatedHeadersForPrefabs
> Task :react-native-reanimated:preBuild
> Task :react-native-screens:generateCodegenSchemaFromJavaScript
> Task :react-native-worklets:assertMinimalReactNativeVersionTask
> Task :react-native-worklets:assertNewArchitectureEnabledTask SKIPPED
> Task :react-native-svg:generateCodegenSchemaFromJavaScript
> Task :react-native-safe-area-context:generateCodegenArtifactsFromSchema
> Task :react-native-safe-area-context:preBuild
> Task :react-native-worklets:generateCodegenSchemaFromJavaScript
> Task :react-native-screens:generateCodegenArtifactsFromSchema
> Task :react-native-screens:preBuild
> Task :rive-app_react-native:generateCodegenSchemaFromJavaScript
No modules to process in combine-js-to-schema-cli. If this is unexpected, please check if you set up your NativeComponent correctly. See combine-js-to-schema.js for how codegen finds modules.
> Task :react-native-svg:generateCodegenArtifactsFromSchema
> Task :react-native-svg:preBuild
> Task :react-native-nitro-modules:preReleaseBuild
> Task :react-native-worklets:generateCodegenArtifactsFromSchema
> Task :shopify_react-native-skia:generateCodegenSchemaFromJavaScript
> Task :react-native-worklets:prepareWorkletsHeadersForPrefabs
> Task :react-native-worklets:preBuild
> Task :react-native-reanimated:preReleaseBuild
> Task :react-native-worklets:preReleaseBuild
> Task :rive-app_react-native:generateCodegenArtifactsFromSchema
> Task :rive-app_react-native:preBuild
> Task :expo:preReleaseBuild
> Task :expo:mergeReleaseJniLibFolders
> Task :expo:mergeReleaseNativeLibs NO-SOURCE
> Task :expo:copyReleaseJniLibsProjectOnly
> Task :expo-constants:preReleaseBuild
> Task :expo-constants:mergeReleaseJniLibFolders
> Task :expo-constants:mergeReleaseNativeLibs NO-SOURCE
> Task :expo-constants:copyReleaseJniLibsProjectOnly
> Task :expo-log-box:preReleaseBuild UP-TO-DATE
[4/10/2026 12:11 AM] Abdullla: > Task :expo-log-box:mergeReleaseJniLibFolders
> Task :expo-log-box:mergeReleaseNativeLibs NO-SOURCE
> Task :expo-log-box:copyReleaseJniLibsProjectOnly
> Task :expo-modules-core:preReleaseBuild UP-TO-DATE
> Task :expo-modules-core:mergeReleaseJniLibFolders
> Task :react-native-ease:preReleaseBuild
> Task :react-native-ease:mergeReleaseJniLibFolders
> Task :react-native-ease:mergeReleaseNativeLibs NO-SOURCE
> Task :react-native-ease:copyReleaseJniLibsProjectOnly
> Task :react-native-gesture-handler:preReleaseBuild
> Task :react-native-gesture-handler:mergeReleaseJniLibFolders
> Task :react-native-reanimated:mergeReleaseJniLibFolders
> Task :react-native-safe-area-context:preReleaseBuild
> Task :react-native-safe-area-context:mergeReleaseJniLibFolders
> Task :react-native-safe-area-context:mergeReleaseNativeLibs NO-SOURCE
> Task :react-native-safe-area-context:copyReleaseJniLibsProjectOnly
> Task :react-native-screens:preReleaseBuild
> Task :shopify_react-native-skia:generateCodegenArtifactsFromSchema
> Task :shopify_react-native-skia:prepareHeaders
> Task :shopify_react-native-skia:preBuild
> Task :app:preBuild
> Task :app:preReleaseBuild
> Task :shopify_react-native-skia:extractAARHeaders
> Task :shopify_react-native-skia:extractJNIFiles
> Task :shopify_react-native-skia:preReleaseBuild
> Task :react-native-nitro-modules:configureCMakeRelWithDebInfo[arm64-v8a]
Checking the license for package CMake 3.22.1 in /home/expo/Android/Sdk/licenses
License for package CMake 3.22.1 accepted.
Preparing "Install CMake 3.22.1 v.3.22.1".
"Install CMake 3.22.1 v.3.22.1" ready.
Installing CMake 3.22.1 in /home/expo/Android/Sdk/cmake/3.22.1
"Install CMake 3.22.1 v.3.22.1" complete.
"Install CMake 3.22.1 v.3.22.1" finished.
> Task :shopify_react-native-skia:configureCMakeRelWithDebInfo[arm64-v8a] FAILED
C/C++: ┌─────────────────────────────────────────────────────────────────────────────┐
C/C++: │                                                                             │
C/C++: │  ERROR: Skia prebuilt binaries not found!                                   │
C/C++: │                                                                             │
C/C++: │  The postinstall script has not run. This is required to download the      │
C/C++: │  Skia binaries. Some package managers (pnpm, bun, yarn berry) require       │
C/C++: │  explicit trust for packages with postinstall scripts.                      │
C/C++: │                                                                             │
C/C++: │  To fix this:                                                               │
C/C++: │                                                                             │
C/C++: │  • npm/yarn classic: Run 'npm rebuild @shopify/react-native-skia' or        │
C/C++: │                       reinstall the package                                 │
C/C++: │                                                                             │
C/C++: │  • bun: Run 'bun add --trust @shopify/react-native-skia'                    │
C/C++: │                                                                             │
C/C++: │  • pnpm: Add to package.json:                                               │
C/C++: │          "pnpm": { "onlyBuiltDependencies": ["@shopify/react-native-skia"] }│
C/C++: │          Then reinstall the package                                         │
C/C++: │                                                                             │
C/C++: │  See: https://shopify.github.io/react-native-skia/docs/getting-started/installation │
C/C++: │                                                                             │
C/C++: └─────────────────────────────────────────────────────────────────────────────┘
C/C++: CMake Error at CMakeLists.txt:37 (message):
C/C++:   Skia prebuilt binaries not found at
[4/10/2026 12:11 AM] Abdullla: C/C++:   /home/expo/workingdir/build/node_modules/@shopify/react-native-skia/android/../libs/android/arm64-v8a.
C/C++:   Please run the postinstall script.
> Task :react-native-screens:configureCMakeRelWithDebInfo[arm64-v8a]
> Task :react-native-worklets:configureCMakeRelWithDebInfo[arm64-v8a]
[Incubating] Problems report is available at: file:///home/expo/workingdir/build/android/build/reports/problems/problems-report.html
FAILURE: Build failed with an exception.
* What went wrong:
Execution failed for task ':shopify_react-native-skia:configureCMakeRelWithDebInfo[arm64-v8a]'.
> [CXX1429] error when building with cmake using /home/expo/workingdir/build/node_modules/@shopify/react-native-skia/android/CMakeLists.txt: -- The C compiler identification is Clang 18.0.2
  -- The CXX compiler identification is Clang 18.0.2
  -- Detecting C compiler ABI info
  -- Detecting C compiler ABI info - done
  -- Check for working C compiler: /home/expo/Android/Sdk/ndk/27.1.12297006/toolchains/llvm/prebuilt/linux-x86_64/bin/clang - skipped
  -- Detecting C compile features
  -- Detecting C compile features - done
  -- Detecting CXX compiler ABI info
  -- Detecting CXX compiler ABI info - done
  -- Check for working CXX compiler: /home/expo/Android/Sdk/ndk/27.1.12297006/toolchains/llvm/prebuilt/linux-x86_64/bin/clang++ - skipped
  -- Detecting CXX compile features
  -- Detecting CXX compile features - done
  -- Configuring incomplete, errors occurred!
  See also "/home/expo/workingdir/build/node_modules/@shopify/react-native-skia/android/.cxx/RelWithDebInfo/4e5w3o36/arm64-v8a/CMakeFiles/CMakeOutput.log".
  
  C++ build system [configure] failed while executing:
      /home/expo/Android/Sdk/cmake/3.22.1/bin/cmake \
        -H/home/expo/workingdir/build/node_modules/@shopify/react-native-skia/android \
        -DCMAKE_SYSTEM_NAME=Android \
        -DCMAKE_EXPORT_COMPILE_COMMANDS=ON \
        -DCMAKE_SYSTEM_VERSION=24 \
        -DANDROID_PLATFORM=android-24 \
        -DANDROID_ABI=arm64-v8a \
        -DCMAKE_ANDROID_ARCH_ABI=arm64-v8a \
        -DANDROID_NDK=/home/expo/Android/Sdk/ndk/27.1.12297006 \
        -DCMAKE_ANDROID_NDK=/home/expo/Android/Sdk/ndk/27.1.12297006 \
        -DCMAKE_TOOLCHAIN_FILE=/home/expo/Android/Sdk/ndk/27.1.12297006/build/cmake/android.toolchain.cmake \
        -DCMAKE_MAKE_PROGRAM=/home/expo/Android/Sdk/cmake/3.22.1/bin/ninja \
        "-DCMAKE_CXX_FLAGS=-fexceptions -frtti -std=c++1y -DONANDROID" \
        -DCMAKE_LIBRARY_OUTPUT_DIRECTORY=/home/expo/workingdir/build/node_modules/@shopify/react-native-skia/android/build/intermediates/cxx/RelWithDebInfo/4e5w3o36/obj/arm64-v8a \
        -DCMAKE_RUNTIME_OUTPUT_DIRECTORY=/home/expo/workingdir/build/node_modules/@shopify/react-native-skia/android/build/intermediates/cxx/RelWithDebInfo/4e5w3o36/obj/arm64-v8a \
        -DCMAKE_BUILD_TYPE=RelWithDebInfo \
        -DCMAKE_FIND_ROOT_PATH=/home/expo/workingdir/build/node_modules/@shopify/react-native-skia/android/.cxx/RelWithDebInfo/4e5w3o36/prefab/arm64-v8a/prefab \
        -B/home/expo/workingdir/build/node_modules/@shopify/react-native-skia/android/.cxx/RelWithDebInfo/4e5w3o36/arm64-v8a \
        -GNinja \
        -DANDROID_STL=c++_shared \
        -DREACT_NATIVE_VERSION=83 \
        -DREACT_NATIVE_DIR=/home/expo/workingdir/build/node_modules/react-native \
        -DNODE_MODULES_DIR=/home/expo/workingdir/build/node_modules \
        "-DPREBUILT_DIR=/home/expo/workingdir/build/node_modules/@shopify/react-native-skia/android/build/react-native-0*/jni" \
        -DANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON
    from /home/expo/workingdir/build/node_modules/@shopify/react-native-skia/android
  
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                                                                             │
[4/10/2026 12:11 AM] Abdullla: │  ERROR: Skia prebuilt binaries not found!                                   │
  │                                                                             │
  │  The postinstall script has not run. This is required to download the      │
  │  Skia binaries. Some package managers (pnpm, bun, yarn berry) require       │
  │  explicit trust for packages with postinstall scripts.                      │
  │                                                                             │
  │  To fix this:                                                               │
  │                                                                             │
  │  • npm/yarn classic: Run 'npm rebuild @shopify/react-native-skia' or        │
  │                       reinstall the package                                 │
  │                                                                             │
  │  • bun: Run 'bun add --trust @shopify/react-native-skia'                    │
  │                                                                             │
  │  • pnpm: Add to package.json:                                               │
  │          "pnpm": { "onlyBuiltDependencies": ["@shopify/react-native-skia"] }│
  │          Then reinstall the package                                         │
  │                                                                             │
  │  See: https://shopify.github.io/react-native-skia/docs/getting-started/installation │
  │                                                                             │
  └─────────────────────────────────────────────────────────────────────────────┘
  
  CMake Error at CMakeLists.txt:37 (message):
    Skia prebuilt binaries not found at
    /home/expo/workingdir/build/node_modules/@shopify/react-native-skia/android/../libs/android/arm64-v8a.
    Please run the postinstall script. : com.android.ide.common.process.ProcessException: -- The C compiler identification is Clang 18.0.2
  -- The CXX compiler identification is Clang 18.0.2
  -- Detecting C compiler ABI info
  -- Detecting C compiler ABI info - done
  -- Check for working C compiler: /home/expo/Android/Sdk/ndk/27.1.12297006/toolchains/llvm/prebuilt/linux-x86_64/bin/clang - skipped
  -- Detecting C compile features
  -- Detecting C compile features - done
  -- Detecting CXX compiler ABI info
  -- Detecting CXX compiler ABI info - done
  -- Check for working CXX compiler: /home/expo/Android/Sdk/ndk/27.1.12297006/toolchains/llvm/prebuilt/linux-x86_64/bin/clang++ - skipped
  -- Detecting CXX compile features
  -- Detecting CXX compile features - done
  -- Configuring incomplete, errors occurred!
  See also "/home/expo/workingdir/build/node_modules/@shopify/react-native-skia/android/.cxx/RelWithDebInfo/4e5w3o36/arm64-v8a/CMakeFiles/CMakeOutput.log".
  
  C++ build system [configure] failed while executing:
      /home/expo/Android/Sdk/cmake/3.22.1/bin/cmake \
        -H/home/expo/workingdir/build/node_modules/@shopify/react-native-skia/android \
        -DCMAKE_SYSTEM_NAME=Android \
        -DCMAKE_EXPORT_COMPILE_COMMANDS=ON \
        -DCMAKE_SYSTEM_VERSION=24 \
        -DANDROID_PLATFORM=android-24 \
        -DANDROID_ABI=arm64-v8a \
        -DCMAKE_ANDROID_ARCH_ABI=arm64-v8a \
        -DANDROID_NDK=/home/expo/Android/Sdk/ndk/27.1.12297006 \
        -DCMAKE_ANDROID_NDK=/home/expo/Android/Sdk/ndk/27.1.12297006 \
        -DCMAKE_TOOLCHAIN_FILE=/home/expo/Android/Sdk/ndk/27.1.12297006/build/cmake/android.toolchain.cmake \
        -DCMAKE_MAKE_PROGRAM=/home/expo/Android/Sdk/cmake/3.22.1/bin/ninja \
        "-DCMAKE_CXX_FLAGS=-fexceptions -frtti -std=c++1y -DONANDROID" \
        -DCMAKE_LIBRARY_OUTPUT_DIRECTORY=/home/expo/workingdir/build/node_modules/@shopify/react-native-skia/android/build/intermediates/cxx/RelWithDebInfo/4e5w3o36/obj/arm64-v8a \
[4/10/2026 12:11 AM] Abdullla: -DCMAKE_RUNTIME_OUTPUT_DIRECTORY=/home/expo/workingdir/build/node_modules/@shopify/react-native-skia/android/build/intermediates/cxx/RelWithDebInfo/4e5w3o36/obj/arm64-v8a \
        -DCMAKE_BUILD_TYPE=RelWithDebInfo \
        -DCMAKE_FIND_ROOT_PATH=/home/expo/workingdir/build/node_modules/@shopify/react-native-skia/android/.cxx/RelWithDebInfo/4e5w3o36/prefab/arm64-v8a/prefab \
        -B/home/expo/workingdir/build/node_modules/@shopify/react-native-skia/android/.cxx/RelWithDebInfo/4e5w3o36/arm64-v8a \
        -GNinja \
        -DANDROID_STL=c++_shared \
        -DREACT_NATIVE_VERSION=83 \
        -DREACT_NATIVE_DIR=/home/expo/workingdir/build/node_modules/react-native \
        -DNODE_MODULES_DIR=/home/expo/workingdir/build/node_modules \
        "-DPREBUILT_DIR=/home/expo/workingdir/build/node_modules/@shopify/react-native-skia/android/build/react-native-0*/jni" \
        -DANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON
    from /home/expo/workingdir/build/node_modules/@shopify/react-native-skia/android
  
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                                                                             │
  │  ERROR: Skia prebuilt binaries not found!                                   │
  │                                                                             │
  │  The postinstall script has not run. This is required to download the      │
  │  Skia binaries. Some package managers (pnpm, bun, yarn berry) require       │
  │  explicit trust for packages with postinstall scripts.                      │
  │                                                                             │
  │  To fix this:                                                               │
  │                                                                             │
  │  • npm/yarn classic: Run 'npm rebuild @shopify/react-native-skia' or        │
  │                       reinstall the package                                 │
  │                                                                             │
  │  • bun: Run 'bun add --trust @shopify/react-native-skia'                    │
  │                                                                             │
  │  • pnpm: Add to package.json:                                               │
  │          "pnpm": { "onlyBuiltDependencies": ["@shopify/react-native-skia"] }│
  │          Then reinstall the package                                         │
  │                                                                             │
  │  See: https://shopify.github.io/react-native-skia/docs/getting-started/installation │
  │                                                                             │
  └─────────────────────────────────────────────────────────────────────────────┘
  
  CMake Error at CMakeLists.txt:37 (message):
    Skia prebuilt binaries not found at
    /home/expo/workingdir/build/node_modules/@shopify/react-native-skia/android/../libs/android/arm64-v8a.
    Please run the postinstall script.
   at com.android.build.gradle.internal.cxx.process.ExecuteProcessKt.execute(ExecuteProcess.kt:288)
   at com.android.build.gradle.internal.cxx.process.ExecuteProcessKt$executeProcess$1.invoke(ExecuteProcess.kt:108)
at com.android.build.gradle.internal.cxx.process.ExecuteProcessKt$executeProcess$1.invoke(ExecuteProcess.kt:106)
   at com.android.build.gradle.internal.cxx.timing.TimingEnvironmentKt.time(TimingEnvironment.kt:32)
   at com.android.build.gradle.internal.cxx.process.ExecuteProcessKt.executeProcess(ExecuteProcess.kt:106)
   at com.android.build.gradle.internal.cxx.process.ExecuteProcessKt.executeProcess$default(ExecuteProcess.kt:85)
   at com.android.build.gradle.tasks.CmakeQueryMetadataGenerator.executeProcess(CmakeFileApiMetadataGenerator.kt:59)
[4/10/2026 12:11 AM] Abdullla: at com.android.build.gradle.tasks.ExternalNativeJsonGenerator$configureOneAbi$1$1$3.invoke(ExternalNativeJsonGenerator.kt:247)
   at com.android.build.gradle.tasks.ExternalNativeJsonGenerator$configureOneAbi$1$1$3.invoke(ExternalNativeJsonGenerator.kt:247)
   at com.android.build.gradle.internal.cxx.timing.TimingEnvironmentKt.time(TimingEnvironment.kt:32)
   at com.android.build.gradle.tasks.ExternalNativeJsonGenerator.configureOneAbi(ExternalNativeJsonGenerator.kt:247)
   at com.android.build.gradle.tasks.ExternalNativeJsonGenerator.configure(ExternalNativeJsonGenerator.kt:113)
   at com.android.build.gradle.tasks.ExternalNativeBuildJsonTask.doTaskAction(ExternalNativeBuildJsonTask.kt:89)
   at com.android.build.gradle.internal.tasks.UnsafeOutputsTask$taskAction$$inlined$recordTaskAction$1.invoke(BaseTask.kt:59)
   at com.android.build.gradle.internal.tasks.Blocks.recordSpan(Blocks.java:51)
   at com.android.build.gradle.internal.tasks.UnsafeOutputsTask.taskAction(UnsafeOutputsTask.kt:81)
   at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
   at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:77)
   at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
   at java.base/java.lang.reflect.Method.invoke(Method.java:569)
   at org.gradle.internal.reflect.JavaMethod.invoke(JavaMethod.java:125)
   at org.gradle.api.internal.project.taskfactory.StandardTaskAction.doExecute(StandardTaskAction.java:58)
   at org.gradle.api.internal.project.taskfactory.StandardTaskAction.execute(StandardTaskAction.java:51)
   at org.gradle.api.internal.project.taskfactory.StandardTaskAction.execute(StandardTaskAction.java:29)
   at org.gradle.api.internal.tasks.execution.TaskExecution$3.run(TaskExecution.java:252)
   at org.gradle.internal.operations.DefaultBuildOperationRunner$1.execute(DefaultBuildOperationRunner.java:29)
   at org.gradle.internal.operations.DefaultBuildOperationRunner$1.execute(DefaultBuildOperationRunner.java:26)
   at org.gradle.internal.operations.DefaultBuildOperationRunner$2.execute(DefaultBuildOperationRunner.java:66)
   at org.gradle.internal.operations.DefaultBuildOperationRunner$2.execute(DefaultBuildOperationRunner.java:59)
   at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:166)
   at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:59)
   at org.gradle.internal.operations.DefaultBuildOperationRunner.run(DefaultBuildOperationRunner.java:47)
   at org.gradle.api.internal.tasks.execution.TaskExecution.executeAction(TaskExecution.java:237)
   at org.gradle.api.internal.tasks.execution.TaskExecution.executeActions(TaskExecution.java:220)
   at org.gradle.api.internal.tasks.execution.TaskExecution.executeWithPreviousOutputFiles(TaskExecution.java:203)
   at org.gradle.api.internal.tasks.execution.TaskExecution.execute(TaskExecution.java:170)
   at org.gradle.internal.execution.steps.ExecuteStep.executeInternal(ExecuteStep.java:105)
   at org.gradle.internal.execution.steps.ExecuteStep.access$000(ExecuteStep.java:44)
   at org.gradle.internal.execution.steps.ExecuteStep$1.call(ExecuteStep.java:59)
   at org.gradle.internal.execution.steps.ExecuteStep$1.call(ExecuteStep.java:56)
   at org.gradle.internal.operations.DefaultBuildOperationRunner$CallableBuildOperationWorker.execute(DefaultBuildOperationRunner.java:209)
   at org.gradle.internal.operations.DefaultBuildOperationRunner$CallableBuildOperationWorker.execute(DefaultBuildOperationRunner.java:204)
   at org.gradle.internal.operations.DefaultBuildOperationRunner$2.execute(DefaultBuildOperationRunner.java:66)
   at org.gradle.internal.operations.DefaultBuildOperationRunner$2.execute(DefaultBuildOperationRunner.java:59)
[4/10/2026 12:11 AM] Abdullla: at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:166)
   at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:59)
   at org.gradle.internal.operations.DefaultBuildOperationRunner.call(DefaultBuildOperationRunner.java:53)
   at org.gradle.internal.execution.steps.ExecuteStep.execute(ExecuteStep.java:56)
   at org.gradle.internal.execution.steps.ExecuteStep.execute(ExecuteStep.java:44)
   at org.gradle.internal.execution.steps.CancelExecutionStep.execute(CancelExecutionStep.java:42)
   at org.gradle.internal.execution.steps.TimeoutStep.executeWithoutTimeout(TimeoutStep.java:75)
   at org.gradle.internal.execution.steps.TimeoutStep.execute(TimeoutStep.java:55)
   at org.gradle.internal.execution.steps.PreCreateOutputParentsStep.execute(PreCreateOutputParentsStep.java:50)
   at org.gradle.internal.execution.steps.PreCreateOutputParentsStep.execute(PreCreateOutputParentsStep.java:28)
   at org.gradle.internal.execution.steps.RemovePreviousOutputsStep.execute(RemovePreviousOutputsStep.java:68)
   at org.gradle.internal.execution.steps.RemovePreviousOutputsStep.execute(RemovePreviousOutputsStep.java:38)
   at org.gradle.internal.execution.steps.BroadcastChangingOutputsStep.execute(BroadcastChangingOutputsStep.java:61)
   at org.gradle.internal.execution.steps.BroadcastChangingOutputsStep.execute(BroadcastChangingOutputsStep.java:26)
   at org.gradle.internal.execution.steps.CaptureOutputsAfterExecutionStep.execute(CaptureOutputsAfterExecutionStep.java:69)
   at org.gradle.internal.execution.steps.CaptureOutputsAfterExecutionStep.execute(CaptureOutputsAfterExecutionStep.java:46)
   at org.gradle.internal.execution.steps.ResolveInputChangesStep.execute(ResolveInputChangesStep.java:39)
   at org.gradle.internal.execution.steps.ResolveInputChangesStep.execute(ResolveInputChangesStep.java:28)
   at org.gradle.internal.execution.steps.BuildCacheStep.executeWithoutCache(BuildCacheStep.java:189)
   at org.gradle.internal.execution.steps.BuildCacheStep.lambda$execute$1(BuildCacheStep.java:75)
   at org.gradle.internal.Either$Right.fold(Either.java:176)
   at org.gradle.internal.execution.caching.CachingState.fold(CachingState.java:62)
   at org.gradle.internal.execution.steps.BuildCacheStep.execute(BuildCacheStep.java:73)
   at org.gradle.internal.execution.steps.BuildCacheStep.execute(BuildCacheStep.java:48)
   at org.gradle.internal.execution.steps.StoreExecutionStateStep.execute(StoreExecutionStateStep.java:46)
   at org.gradle.internal.execution.steps.StoreExecutionStateStep.execute(StoreExecutionStateStep.java:35)
   at org.gradle.internal.execution.steps.SkipUpToDateStep.executeBecause(SkipUpToDateStep.java:75)
   at org.gradle.internal.execution.steps.SkipUpToDateStep.lambda$execute$2(SkipUpToDateStep.java:53)
   at java.base/java.util.Optional.orElseGet(Optional.java:364)
   at org.gradle.internal.execution.steps.SkipUpToDateStep.execute(SkipUpToDateStep.java:53)
   at org.gradle.internal.execution.steps.SkipUpToDateStep.execute(SkipUpToDateStep.java:35)
   at org.gradle.internal.execution.steps.legacy.MarkSnapshottingInputsFinishedStep.execute(MarkSnapshottingInputsFinishedStep.java:37)
   at org.gradle.internal.execution.steps.legacy.MarkSnapshottingInputsFinishedStep.execute(MarkSnapshottingInputsFinishedStep.java:27)
   at org.gradle.internal.execution.steps.ResolveIncrementalCachingStateStep.executeDelegate(ResolveIncrementalCachingStateStep.java:49)
   at org.gradle.internal.execution.steps.ResolveIncrementalCachingStateStep.executeDelegate(ResolveIncrementalCachingStateStep.java:27)
   at org.gradle.internal.execution.steps.AbstractResolveCachingStateStep.execute(AbstractResolveCachingStateStep.java:71)
   at org.gradle.internal.execution.steps.AbstractResolveCachingStateStep.execute(AbstractResolveCachingStateStep.java:39)
[4/10/2026 12:11 AM] Abdullla: at org.gradle.internal.execution.steps.ResolveChangesStep.execute(ResolveChangesStep.java:64)
   at org.gradle.internal.execution.steps.ResolveChangesStep.execute(ResolveChangesStep.java:35)
   at org.gradle.internal.execution.steps.ValidateStep.execute(ValidateStep.java:62)
   at org.gradle.internal.execution.steps.ValidateStep.execute(ValidateStep.java:40)
   at org.gradle.internal.execution.steps.AbstractCaptureStateBeforeExecutionStep.execute(AbstractCaptureStateBeforeExecutionStep.java:76)
   at org.gradle.internal.execution.steps.AbstractCaptureStateBeforeExecutionStep.execute(AbstractCaptureStateBeforeExecutionStep.java:45)
   at org.gradle.internal.execution.steps.AbstractSkipEmptyWorkStep.executeWithNonEmptySources(AbstractSkipEmptyWorkStep.java:136)
   at org.gradle.internal.execution.steps.AbstractSkipEmptyWorkStep.execute(AbstractSkipEmptyWorkStep.java:61)
   at org.gradle.internal.execution.steps.AbstractSkipEmptyWorkStep.execute(AbstractSkipEmptyWorkStep.java:38)
   at org.gradle.internal.execution.steps.legacy.MarkSnapshottingInputsStartedStep.execute(MarkSnapshottingInputsStartedStep.java:38)
   at org.gradle.internal.execution.steps.LoadPreviousExecutionStateStep.execute(LoadPreviousExecutionStateStep.java:36)
   at org.gradle.internal.execution.steps.LoadPreviousExecutionStateStep.execute(LoadPreviousExecutionStateStep.java:23)
   at org.gradle.internal.execution.steps.HandleStaleOutputsStep.execute(HandleStaleOutputsStep.java:75)
   at org.gradle.internal.execution.steps.HandleStaleOutputsStep.execute(HandleStaleOutputsStep.java:41)
   at org.gradle.internal.execution.steps.AssignMutableWorkspaceStep.lambda$execute$0(AssignMutableWorkspaceStep.java:35)
   at org.gradle.api.internal.tasks.execution.TaskExecution$4.withWorkspace(TaskExecution.java:297)
   at org.gradle.internal.execution.steps.AssignMutableWorkspaceStep.execute(AssignMutableWorkspaceStep.java:31)
   at org.gradle.internal.execution.steps.AssignMutableWorkspaceStep.execute(AssignMutableWorkspaceStep.java:22)
   at org.gradle.internal.execution.steps.ChoosePipelineStep.execute(ChoosePipelineStep.java:40)
   at org.gradle.internal.execution.steps.ChoosePipelineStep.execute(ChoosePipelineStep.java:23)
   at org.gradle.internal.execution.steps.ExecuteWorkBuildOperationFiringStep.lambda$execute$2(ExecuteWorkBuildOperationFiringStep.java:67)
   at java.base/java.util.Optional.orElseGet(Optional.java:364)
   at org.gradle.internal.execution.steps.ExecuteWorkBuildOperationFiringStep.execute(ExecuteWorkBuildOperationFiringStep.java:67)
   at org.gradle.internal.execution.steps.ExecuteWorkBuildOperationFiringStep.execute(ExecuteWorkBuildOperationFiringStep.java:39)
   at org.gradle.internal.execution.steps.IdentityCacheStep.execute(IdentityCacheStep.java:46)
   at org.gradle.internal.execution.steps.IdentityCacheStep.execute(IdentityCacheStep.java:34)
   at org.gradle.internal.execution.steps.IdentifyStep.execute(IdentifyStep.java:47)
   at org.gradle.internal.execution.steps.IdentifyStep.execute(IdentifyStep.java:34)
   at org.gradle.internal.execution.impl.DefaultExecutionEngine$1.execute(DefaultExecutionEngine.java:64)
   at org.gradle.api.internal.tasks.execution.ExecuteActionsTaskExecuter.executeIfValid(ExecuteActionsTaskExecuter.java:132)
   at org.gradle.api.internal.tasks.execution.ExecuteActionsTaskExecuter.execute(ExecuteActionsTaskExecuter.java:121)
   at org.gradle.api.internal.tasks.execution.ProblemsTaskPathTrackingTaskExecuter.execute(ProblemsTaskPathTrackingTaskExecuter.java:41)
   at org.gradle.api.internal.tasks.execution.FinalizePropertiesTaskExecuter.execute(FinalizePropertiesTaskExecuter.java:46)
   at org.gradle.api.internal.tasks.execution.ResolveTaskExecutionModeExecuter.execute(ResolveTaskExecutionModeExecuter.java:51)
   at org.gradle.api.internal.tasks.execution.SkipTaskWithNoActionsExecuter.execute(SkipTaskWithNoActionsExecuter.java:57)
[4/10/2026 12:11 AM] Abdullla: -DCMAKE_RUNTIME_OUTPUT_DIRECTORY=/home/expo/workingdir/build/node_modules/@shopify/react-native-skia/android/build/intermediates/cxx/RelWithDebInfo/4e5w3o36/obj/arm64-v8a -DCMAKE_BUILD_TYPE=RelWithDebInfo -DCMAKE_FIND_ROOT_PATH=/home/expo/workingdir/build/node_modules/@shopify/react-native-skia/android/.cxx/RelWithDebInfo/4e5w3o36/prefab/arm64-v8a/prefab -B/home/expo/workingdir/build/node_modules/@shopify/react-native-skia/android/.cxx/RelWithDebInfo/4e5w3o36/arm64-v8a -GNinja -DANDROID_STL=c++_shared -DREACT_NATIVE_VERSION=83 -DREACT_NATIVE_DIR=/home/expo/workingdir/build/node_modules/react-native -DNODE_MODULES_DIR=/home/expo/workingdir/build/node_modules -DPREBUILT_DIR=/home/expo/workingdir/build/node_modules/@shopify/react-native-skia/android/build/react-native-0*/jni -DANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON}
   at com.android.build.gradle.internal.process.GradleProcessResult.buildProcessException(GradleProcessResult.java:73)
   at com.android.build.gradle.internal.process.GradleProcessResult.assertNormalExitValue(GradleProcessResult.java:48)
   at com.android.build.gradle.internal.cxx.process.ExecuteProcessKt.execute(ExecuteProcess.kt:277)
   ... 142 more
  Caused by: org.gradle.process.ProcessExecutionException: Process 'command '/home/expo/Android/Sdk/cmake/3.22.1/bin/cmake'' finished with non-zero exit value 1
   at org.gradle.process.internal.DefaultExecHandle$ExecResultImpl.assertNormalExitValue(DefaultExecHandle.java:443)
   at com.android.build.gradle.internal.process.GradleProcessResult.assertNormalExitValue(GradleProcessResult.java:46)
   ... 143 more
* Try:
> Run with --stacktrace option to get the stack trace.
> Run with --info or --debug option to get more log output.
> Run with --scan to generate a Build Scan (Powered by Develocity).
> Get more help at https://help.gradle.org.
BUILD FAILED in 2m 37s
Deprecated Gradle features were used in this build, making it incompatible with Gradle 10.
You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.
For more on this, please refer to https://docs.gradle.org/9.0.0/userguide/command_line_interface.html#sec:command_line_warnings in the Gradle documentation.
79 actionable tasks: 79 executed
Error: Gradle build failed with unknown error. See logs for the "Run gradlew" phase for more information.