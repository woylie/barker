# Tinnef SCSS Starter Kit

This is an SCSS starter kit for the design system setup described in this
article series: https://www.mathiaspolligkeit.com/tags/design-systems/.

It includes:

- project layout as described in the articles
- themes, components, layouts and base styles
- style dictionary
- mixins and functions
- webpack
- dart-sass
- stylelint
- postcss
- style guide generation

It doesn't have all the features I'd like it to have yet, but you can certainly
use it to get started with a project. Just clone the repository.

## Commands

- dev build (tokens + : `yarn build`
- build style dictionary tokens: `yarn build-tokens`
- watch mode (does not watch style dictionary tokens): `yarn watch`
- stylelint: `yarn stylelint`
- fix stylelint errors: `yarn stylelint --fix`
- format with prettier: `yarn prettier . --write`
