const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");
const fs = require("fs");
const path = require("path");

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const projectRootPattern = escapeRegExp(__dirname).replace(/[/\\]/g, "[/\\\\]");

// Ensure .expo/types directory exists for uniwind dts output (required for EAS cloud builds)
const expoTypesDir = path.resolve(__dirname, ".expo/types");
if (!fs.existsSync(expoTypesDir)) {
  fs.mkdirSync(expoTypesDir, { recursive: true });
}

const config = getDefaultConfig(__dirname);

// Reduce parallel file opens — prevents EMFILE crashes on Windows
config.maxWorkers = 2;

const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
};

config.resolver = {
  ...resolver,
  // Keep generated native projects out of Metro without excluding dependency
  // internals such as expo-symbols/build/android/index.js.
  blockList: [
    new RegExp(`${projectRootPattern}[/\\\\]android[/\\\\].*`),
    new RegExp(`${projectRootPattern}[/\\\\]ios[/\\\\].*`),
  ],
  assetExts: [...resolver.assetExts.filter((ext) => ext !== "svg"), "riv"],
  sourceExts: [...resolver.sourceExts, "svg"],
  resolveRequest: (context, moduleName, platform) => {
    if (platform === "web" && moduleName.includes("react-native/Libraries/NativeComponent/NativeComponentRegistry")) {
      return {
        type: "sourceFile",
        filePath: path.resolve(__dirname, "src/mocks/native-component-registry.js"),
      };
    }
    if (platform === "web" && moduleName.includes("react-native/Libraries")) {
      return {
        type: "empty",
      };
    }
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = withUniwindConfig(config, {
  cssEntryFile: "./src/global.css",
  dtsFile: "./.expo/types/uniwind-types.d.ts",
});
