const { withAndroidManifest } = require("@expo/config-plugins");

const RECORD_AUDIO = "android.permission.RECORD_AUDIO";

/**
 * expo-image-picker correctly removes its own microphone request when profile
 * photos are library-only. Keep the separate speaking-practice permission
 * active for expo-audio and speech recognition after all other plugins run.
 *
 * @type {import("@expo/config-plugins").ConfigPlugin}
 */
const withSpeakingAudioPermission = (config) =>
  withAndroidManifest(config, (mod) => {
    const permissions = mod.modResults.manifest["uses-permission"] ?? [];
    mod.modResults.manifest["uses-permission"] = [
      ...permissions.filter(
        (permission) => permission?.$?.["android:name"] !== RECORD_AUDIO,
      ),
      { $: { "android:name": RECORD_AUDIO } },
    ];
    return mod;
  });

module.exports = withSpeakingAudioPermission;
