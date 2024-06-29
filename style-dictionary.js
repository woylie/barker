import StyleDictionary from "style-dictionary";
import { fileHeader, formattedVariables } from "style-dictionary/utils";

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
  filter: (token) => {
    return !isBaseColor(token);
  },
});

StyleDictionary.registerFilter({
  name: "noInternals",
  filter: (token) => {
    return !isInternal(token);
  },
});

StyleDictionary.registerFormat({
  name: "scss/mixin",
  format: async function ({ dictionary, file, options = {} }) {
    const { outputReferences } = options;
    return (
      (await fileHeader({ file })) +
      `@mixin tokens {\n` +
      formattedVariables({
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

await Promise.all(
  themes.map((theme) => {
    const sd = new StyleDictionary({
      include: [`src/tokens/**/!(*.${themes.join(`|*.`)}).{json,js}`],
      source: [`src/tokens/**/*.${theme}.{json,js}`],
      platforms: platforms(theme),
    });

    return sd.buildAllPlatforms();
  }),
);
