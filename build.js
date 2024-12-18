import * as esbuild from "esbuild";

import postcss from "postcss";
import autoprefixer from "autoprefixer";
import { sassPlugin } from "esbuild-sass-plugin";
import { purgeCSSPlugin } from "@fullhuman/postcss-purgecss";

const args = process.argv.slice(2);
const watch = args.includes("--watch");
const production = args.includes("--production");

// To enable PurgeCSS, set content folders here and uncomment purgeCssPlugin
// below.
const purgeCss = purgeCSSPlugin({
  content: ["./**/*.html"],
});

const postCssPlugins = [
  autoprefixer,
  // To enable PurgeCSS, set content folders above and uncomment line below.
  // purgeCss
];

const plugins = [
  sassPlugin({
    async transform(source, resolveDir) {
      const { css } = await postcss(postCssPlugins).process(source, {
        from: undefined,
      });
      return css;
    },
  }),
];

// Define esbuild options
let opts = {
  entryPoints: ["src/js/main.js"],
  bundle: true,
  logLevel: "info",
  target: "es2017",
  outdir: "build/css",
  plugins: plugins,
};

if (production) {
  opts = {
    ...opts,
    minify: true,
  };
}

if (watch) {
  opts = {
    ...opts,
    sourcemap: "inline",
  };
  esbuild
    .context(opts)
    .then((ctx) => {
      ctx.watch();
    })
    .catch((_error) => {
      process.exit(1);
    });
} else {
  esbuild.build(opts);
}
