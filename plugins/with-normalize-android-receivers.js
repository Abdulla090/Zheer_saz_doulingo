/**
 * expo-widgets assumes every <receiver> meta-data entry is an array and calls
 * meta-data.some(...). Other config plugins may emit a single object — normalize
 * before expo-widgets runs to avoid prebuild/EAS failures.
 */
const {
  withAndroidManifest,
  AndroidConfig,
} = require("@expo/config-plugins");

function asMetaDataArray(metaData) {
  if (metaData == null) return metaData;
  return Array.isArray(metaData) ? metaData : [metaData];
}

function normalizeReceiver(receiver) {
  if (!receiver || typeof receiver !== "object") return receiver;
  return {
    ...receiver,
    "meta-data": asMetaDataArray(receiver["meta-data"]),
  };
}

/** @type {import('@expo/config-plugins').ConfigPlugin} */
const withNormalizeAndroidReceivers = (config) => {
  return withAndroidManifest(config, (mod) => {
    const app = AndroidConfig.Manifest.getMainApplicationOrThrow(
      mod.modResults,
    );
    if (app.receiver) {
      app.receiver = app.receiver.map(normalizeReceiver);
    }
    return mod;
  });
};

module.exports = withNormalizeAndroidReceivers;
