module.exports = function (api) {
  const isProd = api.env("production");
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ...(isProd
        ? [
            [
              "transform-remove-console",
              { exclude: ["error", "warn"] },
            ],
          ]
        : []),
      "react-native-reanimated/plugin",
    ],
  };
};
