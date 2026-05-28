/**
 * expo-widgets@56 writes widget display/description strings into res/xml/expo_widgets.xml
 * instead of res/values. Android AAPT expects @string/* in values — this plugin fixes that.
 */
const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

function toAndroidResourceName(name) {
  const resourceName = name
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[^A-Za-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();

  return /^[a-z]/.test(resourceName) ? resourceName : `widget_${resourceName}`;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getWidgetsFromConfig(config) {
  for (const entry of config.plugins ?? []) {
    if (Array.isArray(entry) && entry[0] === "expo-widgets") {
      return entry[1]?.widgets ?? [];
    }
  }
  return [];
}

/** @type {import('@expo/config-plugins').ConfigPlugin} */
const withAndroidWidgetStrings = (config) => {
  const widgets = getWidgetsFromConfig(config).filter((w) => w.android !== null);

  if (widgets.length === 0) {
    return config;
  }

  return withDangerousMod(config, [
    "android",
    async (cfg) => {
      const projectRoot = cfg.modRequest.platformProjectRoot;
      const valuesDir = path.join(projectRoot, "app/src/main/res/values");
      const stringsPath = path.join(valuesDir, "expo_widgets_strings.xml");

      const body = widgets
        .map((widget) => {
          const base = toAndroidResourceName(widget.name);
          return `  <string name="${base}_display_name">${escapeXml(widget.displayName)}</string>
  <string name="${base}_description">${escapeXml(widget.description)}</string>`;
        })
        .join("\n");

      const xml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
${body}
</resources>
`;

      fs.mkdirSync(valuesDir, { recursive: true });
      fs.writeFileSync(stringsPath, xml);

      return cfg;
    },
  ]);
};

module.exports = withAndroidWidgetStrings;
