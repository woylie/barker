const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const StylelintPlugin = require("stylelint-webpack-plugin");

module.exports = {
  entry: "./src/js/main.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  plugins: [
    new StylelintPlugin({ context: path.resolve(__dirname, "src/css") }),
    new MiniCssExtractPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                mode: "icss",
              },
            },
          },
          {
            loader: "sass-loader",
          },
        ],
      },
    ],
  },
};
