const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");

const config = getDefaultConfig(__dirname);

const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
};

const path = require("path");

config.resolver = {
  ...resolver,
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
  dtsFile: "./src/uniwind-types.d.ts",
});
