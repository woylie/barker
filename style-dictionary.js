import { rm } from "node:fs/promises";
import StyleDictionary from "style-dictionary";
import { fileHeader, formattedVariables } from "style-dictionary/utils";

/*
Token files for one theme are named `*.light.{json,js}` or `*.dark.{json,js}`.
Files without a theme in the name are included in both themes. The two themes
define the same tokens. They define only colors, because `light-dark()` accepts
only colors.

The SCSS mixin and the CSS file define each token once. A token from a theme
file has the value `light-dark(<light>, <dark>)`. The JSON output has one file
per theme. Do not set `outputReferences` on the SCSS or CSS files: a reference
would replace the `light-dark()` value.
*/
const include = [`src/tokens/**/!(*.light|*.dark).{json,js}`];
const source = (theme) => [`src/tokens/**/*.${theme}.{json,js}`];
const fromTheme = (token, theme) =>
  new RegExp(`\\.${theme}\\.(json|js)$`).test(token.filePath);

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

StyleDictionary.registerFormat({
  name: "scss/custom-properties",
  format: async function ({ dictionary, file }) {
    return (
      (await fileHeader({ file })) +
      dictionary.allTokens
        .map((prop) => `$${prop.name}: --${prop.name};`)
        .join("\n")
    );
  },
});

StyleDictionary.registerFormat({
  name: "scss/mixin",
  format: async function ({ dictionary, file, options = {} }) {
    const {
      outputReferences,
      themeable = true,
      formatting,
      usesDtcg,
    } = options;
    return (
      (await fileHeader({ file })) +
      `@mixin tokens {\n` +
      formattedVariables({
        format: "css",
        dictionary,
        outputReferences,
        themeable,
        formatting,
        usesDtcg,
      }) +
      `\n}\n`
    );
  },
});

// Returns the values of the tokens from the files of one theme, by name.
const themeValues = async (theme) => {
  const { allTokens } = await new StyleDictionary({
    include,
    source: source(theme),
    platforms: { css: { transformGroup: "css" } },
    log: { verbosity: "silent" },
  }).getPlatformTokens("css");

  return new Map(
    allTokens
      .filter((token) => fromTheme(token, theme))
      .map((token) => {
        if (token.$type !== "color") {
          throw new Error(
            `A theme file defines a token that is not a color. Move the token to a file without a theme in its name. Got: ${token.name} in ${token.filePath}`,
          );
        }

        return [token.name, token.$value ?? token.value];
      }),
  );
};

const lightValues = await themeValues("light");
const darkValues = await themeValues("dark");

const missingNames = (from, to) =>
  [...from.keys()].filter((name) => !to.has(name));

for (const [theme, names] of [
  ["dark", missingNames(lightValues, darkValues)],
  ["light", missingNames(darkValues, lightValues)],
]) {
  if (names.length > 0) {
    throw new Error(
      `The ${theme} theme does not define tokens that the other theme defines. Add the tokens to a file named *.${theme}.{json,js}. Missing: ${names.join(", ")}`,
    );
  }
}

StyleDictionary.registerTransform({
  name: "value/light-dark",
  type: "value",
  transitive: true,
  filter: (token) => fromTheme(token, "light"),
  transform: (token) =>
    `light-dark(${lightValues.get(token.name)}, ${darkValues.get(token.name)})`,
});

const isOutput = (token) => !isBaseColor(token) && !isInternal(token);

// Removes the files of earlier builds, so that nothing keeps importing them.
await rm("build/tokens", { recursive: true, force: true });

const sd = new StyleDictionary({
  include,
  source: source("light"),
  platforms: {
    scss: {
      transforms: [
        ...StyleDictionary.hooks.transformGroups.scss,
        "value/light-dark",
      ],
      buildPath: "build/tokens/scss/",
      files: [
        {
          destination: "_mixin.scss",
          filter: isOutput,
          format: "scss/mixin",
        },
        {
          destination: "_variables.scss",
          filter: isOutput,
          format: "scss/custom-properties",
        },
        {
          destination: "_tokens.scss",
          filter: "noBaseColors",
          format: "scss/map-deep",
          options: {
            formatting: {
              header:
                "/**\n * This output contains a map that is used to retrieve token names. Do not use\n * the tokens defined in this file directly.\n *\n",
            },
          },
        },
      ],
    },
    css: {
      transforms: [
        ...StyleDictionary.hooks.transformGroups.css,
        "value/light-dark",
      ],
      buildPath: "build/tokens/css/",
      files: [
        {
          destination: "tokens.css",
          filter: isOutput,
          format: "css/variables",
        },
      ],
    },
  },
});

await sd.buildAllPlatforms();

await Promise.all(
  ["light", "dark"].map((theme) =>
    new StyleDictionary({
      include,
      source: source(theme),
      platforms: {
        json: {
          transformGroup: "js",
          buildPath: "build/tokens/json/",
          files: [{ destination: `tokens.${theme}.json`, format: "json" }],
        },
      },
    }).buildAllPlatforms(),
  ),
);
