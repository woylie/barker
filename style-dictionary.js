const StyleDictionary = require("style-dictionary");

StyleDictionary.registerFormat({
  name: "scss/mixin",
  formatter: function ({ dictionary, options = {}, file }) {
    const { outputReferences } = options;
    return (
      `@mixin tokens {\n` +
      StyleDictionary.formatHelpers.formattedVariables({
        format: "css",
        dictionary,
        outputReferences,
      }) +
      `\n}\n`
    );
  },
});

const platforms = {
  scss: {
    transformGroup: "scss",
    buildPath: "build/tokens/scss/",
    files: [
      {
        destination: `_mixin.scss`,
        format: "scss/mixin",
      },
      {
        destination: "tokens.scss",
        format: "scss/map-deep",
      },
    ],
  },
  css: {
    transformGroup: "css",
    buildPath: "build/tokens/css/",
    files: [
      {
        destination: "tokens.css",
        format: "css/variables",
      },
    ],
  },
  js: {
    transformGroup: "js",
    buildPath: "build/tokens/js/",
    files: [
      {
        destination: "tokens.js",
        format: "javascript/es6",
      },
    ],
  },
  json: {
    transformGroup: "js",
    buildPath: "build/tokens/json/",
    files: [
      {
        destination: "tokens.json",
        format: "json",
      },
    ],
  },
};

const base = StyleDictionary.extend({
  source: ["src/tokens/**/*.json"],
  platforms: platforms,
});

base.buildAllPlatforms();
