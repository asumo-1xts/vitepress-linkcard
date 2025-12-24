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
        // target: "_self",
        // borderColor: "#039393",
        // bgColor: "#CB3837"
      });
    },
  }
  // ...
});
```

#### `docs/.vitepress/theme/custom.css` (Optional: Hover Animation)

To enable a hover animation similar to VitePress's Features component, add this CSS to your theme:

```css
.vitepress-linkcard-container:hover {
  border-color: var(--vp-c-brand-1) !important;
}
```

This will smoothly change the border color when hovering over a linkcard.

#### `*.md`

Generates a linkcard when `@:` appended.

```md
[example](@:https://example.com)
```

## Supported options

### borderColor

Specifies the border color of linkcards with a color code. For exmaple:

- `#7d7d7dff` (default)
- `rgba(3, 147, 147, 0.39)`
- ...

### bgColor

Specifies the background color of linkcards with a color code. For exmaple:

- `#7d7d7d00` (default)
- `rgba(3, 147, 147, 0.39)`
- ...

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
