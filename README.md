<h1 align="center">
vitepress-linkcard
</h1>

<div align="center">

**A VitePress plugin to generate a pretty linkcard with OGP.**

A blog generated with this plugin is [here](https://asumoranda.com/posts/10-vitepress-linkcard.html).

[![NPM Version](https://img.shields.io/npm/v/vitepress-linkcard?style=flat&logo=npm&logoColor=white&label=npmjs&color=%23CB3837)](https://www.npmjs.com/package/vitepress-linkcard)
[![NPM bundle size](https://img.shields.io/bundlephobia/min/vitepress-linkcard)](https://www.npmjs.com/package/vitepress-linkcard)
[![NPM License](https://img.shields.io/npm/l/vitepress-linkcard)](/LICENSE)

[![VitePress](https://img.shields.io/badge/For_VitePress-v1.6.4-%235C73E7?logo=vitepress&logoColor=white)](https://vuejs.github.io/vitepress/v1/)
[![Yarn](https://img.shields.io/badge/Built_with_Yarn-v4.9.2-%232C8EBB?logo=yarn&logoColor=white)](https://yarnpkg.com/)
[![ESLint](https://img.shields.io/badge/Lint_with-ESLint-%234B32C3?style=flat&logo=eslint&logoColor=white&labelColor=gray)](https://github.com/asumo-1xts/vitepress-linkcard/actions/workflows/eslint.yml)
[![Prettier](https://img.shields.io/badge/Format_with-Prettier-%23F7B93E?style=flat&logo=prettier&logoColor=white&labelColor=gray)](https://github.com/asumo-1xts/vitepress-linkcard/actions/workflows/prettier.yml)

<img src="https://github.com/asumo-1xts/vitepress-linkcard/blob/main/.github/screen.webp?raw=true" width=90% alt="How it shows" />

This plugin was forked from [markdown-it-link-to-card](https://github.com/luckrya/markdown-it-link-to-card).

</div>

## Getting started

### Install

```shell
npm i -D vitepress-linkcard     # npm
yarn add -D vitepress-linkcard  # yarn
pnpm add -D vitepress-linkcard  # pnpm
```

### Usage

#### `docs/.vitepress/config.ts`

```ts
import { defineConfig } from "vitepress";
import { linkToCardPlugin } from "vitepress-linkcard";
import type { LinkToCardPluginOptions } from "vitepress-linkcard";

export default defineConfig({
  // ...
  markdown: {
    config: (md) => {
      md.use<LinkToCardPluginOptions>(linkToCardPlugin, {
        // // Supported options:
        // target: "_self"
      });
    },
  }
  // ...
});
```

#### `docs/.vitepress/theme/custom.css` (Styling)

You can customize the appearance of linkcards using CSS:

**Method 1: Using CSS custom properties**
```css
.vitepress-linkcard-container {
  --vitepress-linkcard-border-color: #e0e0e0;
  --vitepress-linkcard-bg-color: #f9f9f9;
}
```
*Use this when: You want to set fixed colors independent of VitePress theme.*

**Method 2: Using standard CSS properties (requires `!important`)**
```css
.vitepress-linkcard-container {
  border-color: var(--vp-c-brand-2) !important;
  background-color: var(--vp-c-brand-soft) !important;
}
```
*Use this when: You want linkcards to follow VitePress theme colors automatically.*

**Add hover animation (similar to VitePress Features)**
```css
.vitepress-linkcard-container:hover {
  border-color: var(--vp-c-brand-1) !important;
}
```

Both methods allow you to override the default colors without modifying plugin options.

#### `*.md`

Generates a linkcard when `@:` appended.

```md
[example](@:https://example.com)
```

## Supported options

### target

Specifies the target window in which to open a link.

- `_blank` (default)
- `_self`
- `_top`
- `_parent`

## Other specifications

### `.linkcard_cache.json`

It is generated automatically in root dir and cache all the parsed metadata.

You can move it to `.config` directory or edit it if needed.

### Special handling for `github.com`

When the domain is `github.com`, trimming is performed as shown in the following example to avoid duplication of the title and description.

| | Title | Description |
| - | - | - |
| Before | GitHub - asumo-1xts/vitepress-linkcard: A VitePress plugin to generate a pretty linkcard. | A VitePress plugin to generate a pretty linkcard. Contribute to asumo-1xts/vitepress-linkcard development by creating an account on GitHub. |
| After | asumo-1xts/vitepress-linkcard | A VitePress plugin to generate a pretty linkcard. |
