import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";
import StylelintPlugin from "stylelint-webpack-plugin";
import { EsbuildPlugin } from "esbuild-loader";

export default {
  entry: {
    main: "./src/js/main.js",
    styleguide: "./src/js/styleguide.js",
  },
  output: {
    path: path.resolve(import.meta.dirname, "build/css"),
    clean: true,
  },
  plugins: [
    new StylelintPlugin({
      context: path.resolve(import.meta.dirname, "src/css"),
    }),
    new MiniCssExtractPlugin(),
  ],
  optimization: {
    minimizer: [
      new EsbuildPlugin({
        target: "es2015",
        css: true,
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
          },
          {
            loader: "postcss-loader",
          },
          {
            loader: "sass-loader",
          },
        ],
      },
    ],
  },
};
