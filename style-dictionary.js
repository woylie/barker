const StyleDictionary = require("style-dictionary");

/*
Set themes here. The SCSS code uses the default theme to define the accessor
functions. Token files for a specific theme should be named `*.{theme}.json` or
`*.{theme}.js`. Files without the theme in the name are included in all themes.

When you add a theme, you will also need to add a theme file to `src/css/themes`
and use it in `src/css/themes/_index.scss`.
*/
const themes = ["default", "dark"];

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

const platforms = (theme = "") => {
  if (theme != "") {
    theme = "." + theme;
  }

  return {
    scss: {
      transformGroup: "scss",
      buildPath: "build/tokens/scss/",
      files: [
        {
          destination: `_mixin${theme}.scss`,
          filter: (token) => {
            return !isBaseColor(token) && !isInternal(token);
          },
          format: "scss/mixin",
        },
        {
          destination: `tokens${theme}.scss`,
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
          destination: `tokens${theme}.css`,
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
          destination: `tokens${theme}.js`,
          format: "javascript/es6",
        },
      ],
    },
    json: {
      transformGroup: "js",
      buildPath: "build/tokens/json/",
      files: [
        {
          destination: `tokens${theme}.json`,
          format: "json",
        },
      ],
    },
  };
};

for (const theme of themes) {
  const themeConfig = StyleDictionary.extend({
    include: [`src/tokens/**/!(*.${themes.join(`|*.`)}).{json,js}`],
    source: [`src/tokens/**/*.${theme}.{json,js}`],
    platforms: platforms(theme),
  });

  themeConfig.buildAllPlatforms();
}
