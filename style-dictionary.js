const StyleDictionary = require("style-dictionary");

const isInternal = (token) => {
  return token.attributes.category == "internal";
};

const isBaseColor = (token) => {
  return (
    token.attributes.category === "color" && token.attributes.type === "base"
  );
};

StyleDictionary.registerFilter({
  name: "noBaseColors",
  matcher: (token) => {
    return !isBaseColor(token);
  },
});

StyleDictionary.registerFilter({
  name: "noInternals",
  matcher: (token) => {
    return !isInternal(token);
  },
});

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
        filter: (token) => {
          return !isBaseColor(token) && !isInternal(token);
        },
        format: "scss/mixin",
      },
      {
        destination: "tokens.scss",
        filter: "noBaseColors",
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
        filter: (token) => {
          return !isBaseColor(token) && !isInternal(token);
        },
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
  source: ["src/tokens/**/*.{json,js}"],
  platforms: platforms,
});

base.buildAllPlatforms();
