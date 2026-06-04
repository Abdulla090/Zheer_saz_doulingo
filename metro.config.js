const { getDefaultConfig } = require("expo/metro-config");
const { FileStore } = require("@expo/metro-config/build/file-store");
const { DiskCacheManager } = require("@expo/metro-file-map");
const { withUniwindConfig } = require("uniwind/metro");
const fs = require("fs");
const path = require("path");

const isWindows = process.platform === "win32";
const projectRoot = __dirname;
const projectCacheRoot = path.join(projectRoot, ".metro-cache");
const transformCacheRoot = path.join(projectCacheRoot, "transform");

if (!fs.existsSync(projectCacheRoot)) {
  fs.mkdirSync(projectCacheRoot, { recursive: true });
}

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const projectRootPattern = escapeRegExp(projectRoot).replace(/[/\\]/g, "[/\\\\]");

const expoTypesDir = path.resolve(projectRoot, ".expo/types");
if (!fs.existsSync(expoTypesDir)) {
  fs.mkdirSync(expoTypesDir, { recursive: true });
}

const config = getDefaultConfig(projectRoot);

// Windows: limit parallel file handles (EMFILE)
config.maxWorkers = isWindows ? 1 : 2;
config.fileMapCacheDirectory = projectCacheRoot;
config.hasteMapCacheDirectory = projectCacheRoot;
config.cacheManagerFactory = (factoryParams) =>
  new DiskCacheManager(factoryParams, {
    cacheDirectory: projectCacheRoot,
    cacheFilePrefix: "metro-file-map",
  });

config.watcher = {
  ...config.watcher,
  additionalExcludes: [
    ...(config.watcher?.additionalExcludes ?? []),
    /[/\\]node_modules[/\\]\.babel-preset-expo-[^/\\]+[/\\].*/,
    /[/\\]node_modules[/\\]\.cache[/\\].*/,
    /[/\\]\.metro-cache[/\\].*/,
  ],
};

const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
  ...(isWindows ? { unstable_workerThreads: false } : {}),
};

config.resolver = {
  ...resolver,
  blockList: [
    new RegExp(`${projectRootPattern}[/\\\\]android[/\\\\].*`),
    new RegExp(`${projectRootPattern}[/\\\\]ios[/\\\\].*`),
    new RegExp(`${projectRootPattern}[/\\\\]dist[/\\\\].*`),
    new RegExp(`${projectRootPattern}[/\\\\]\\.metro-cache[/\\\\].*`),
    /[/\\]node_modules[/\\]\.babel-preset-expo-[^/\\]+[/\\].*/,
  ],
  assetExts: [...resolver.assetExts.filter((ext) => ext !== "svg"), "riv"],
  sourceExts: [...resolver.sourceExts, "svg"],
  resolveRequest: (context, moduleName, platform) => {
    if (
      platform === "web" &&
      moduleName.includes(
        "react-native/Libraries/NativeComponent/NativeComponentRegistry",
      )
    ) {
      return {
        type: "sourceFile",
        filePath: path.resolve(
          projectRoot,
          "src/mocks/native-component-registry.js",
        ),
      };
    }
    if (platform === "web" && moduleName.includes("react-native/Libraries")) {
      return { type: "empty" };
    }
    return context.resolveRequest(context, moduleName, platform);
  },
};

// Uniwind wraps Metro but replaces cacheStores with os.tmpdir()/metro-cache (EMFILE on Windows).
const metroConfig = withUniwindConfig(config, {
  cssEntryFile: "./src/global.css",
  dtsFile: "./.expo/types/uniwind-types.d.ts",
});

metroConfig.cacheStores = [new FileStore({ root: transformCacheRoot })];
metroConfig.fileMapCacheDirectory = projectCacheRoot;
metroConfig.hasteMapCacheDirectory = projectCacheRoot;
metroConfig.cacheManagerFactory = config.cacheManagerFactory;
metroConfig.maxWorkers = config.maxWorkers;
metroConfig.transformer = {
  ...metroConfig.transformer,
  babelTransformerPath: config.transformer.babelTransformerPath,
  ...(isWindows ? { unstable_workerThreads: false } : {}),
};
metroConfig.watcher = config.watcher;

module.exports = metroConfig;
