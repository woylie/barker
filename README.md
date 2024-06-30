# Barker

Barker is an SCSS starter kit for design systems.

It includes:

- A [Style Dictionary](https://v4.styledictionary.com/) configuration for defining design tokens.
- A sensible project layout and organized SCSS files for themes, components, layouts, and base styles.
- SCSS mixins and functions for accessing design tokens.
- A [Webpack](https://webpack.js.org/) configuration with [Esbuild](https://esbuild.github.io/), [dart-sass](https://sass-lang.com/dart-sass/) and [PostCSS](https://postcss.org/).
- A [Stylelint](https://stylelint.io/) configuration.

## Usage

This kit cannot be installed and does not include any generators. Instead, clone
the repository into your project and adapt it to your needs.

```bash
git clone git@github.com:woylie/barker.git
cd barker
rm -rf .github .git
```

## Commands

| Description                                         | Command                   |
| --------------------------------------------------- | ------------------------- |
| Development build (tokens, CSS, JS, etc.)           | `yarn build`              |
| Build Style Dictionary tokens                       | `yarn build-tokens`       |
| Watch mode (does not watch Style Dictionary tokens) | `yarn watch`              |
| Stylelint                                           | `yarn stylelint`          |
| Fix Stylelint issues                                | `yarn stylelint --fix`    |
| Format with Prettier                                | `yarn prettier . --write` |

## Resources

Barker is based on ideas described in the
[Design Systems article series](https://www.mathiaspolligkeit.com/tags/design-systems/).
