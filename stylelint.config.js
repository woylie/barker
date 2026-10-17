/** @type {import("stylelint").Config} */
export default {
  ignoreFiles: ["node_modules"],
  extends: ["stylelint-config-standard-scss", "stylelint-config-recess-order"],
  plugins: ["stylelint-declaration-strict-value"],
  rules: {
    "scale-unlimited/declaration-strict-value": [
      [
        "/color/",
        "border-radius",
        "border-width",
        "font-family",
        "font-size",
        "font-weight",
        "letter-spacing",
        "line-height",
      ],
      {
        disableFix: true,
        ignoreKeywords: ["0", "inherit", "transparent", "dark", "light"],
      },
    ],
  },
};
