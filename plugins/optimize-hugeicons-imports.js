const fs = require("node:fs");
const path = require("node:path");

// The package's root embeds all 6 MB of icons. Its public per-icon exports
// contain exactly the same data, including aliases such as Trophy/ChampionIcon.
module.exports = function optimizeHugeiconsImports({ types: t }) {
  const root = path.dirname(require.resolve("@hugeicons/core-free-icons/package.json"));
  const source = fs.readFileSync(path.join(root, "dist/esm/index.js"), "utf8");
  const aliases = new Map([...source.slice(source.lastIndexOf("export {")).matchAll(/\b(\w+) as (\w+)\b/g)].map((match) => [match[2], match[1]]));
  return {
    visitor: {
      ImportDeclaration(importPath) {
        const node = importPath.node;
        if (node.source.value !== "@hugeicons/core-free-icons" || node.importKind === "type") return;
        const replacements = [];
        const retained = [];
        for (const specifier of node.specifiers) {
          if (!t.isImportSpecifier(specifier) || specifier.importKind === "type") {
            retained.push(specifier);
            continue;
          }
          const name = specifier.imported.name ?? specifier.imported.value;
          const icon = aliases.get(name) ?? name;
          if (!fs.existsSync(path.join(root, "dist/esm", `${icon}.js`))) {
            retained.push(specifier);
            continue;
          }
          replacements.push(t.importDeclaration([t.importDefaultSpecifier(specifier.local)], t.stringLiteral(`@hugeicons/core-free-icons/${icon}`)));
        }
        if (!replacements.length) return;
        if (retained.length) replacements.push(t.importDeclaration(retained, node.source));
        importPath.replaceWithMultiple(replacements);
      },
    },
  };
};
