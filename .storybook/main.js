const path = require("path");

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  framework: "@storybook/web-components",
  core: {
    builder: "webpack5",
  },
  webpackFinal: async (config, { configType }) => {
    config.module.rules.push({
      test: /\.(sa|sc|c)ss$/i,
      use: [
        { loader: "css-loader" },
        { loader: "postcss-loader" },
        { loader: "sass-loader" },
      ],
      include: path.resolve(__dirname, "../src/css"),
    });

    return config;
  },
};
