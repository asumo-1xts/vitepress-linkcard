<h1 align="center">
vitepress-linkcard
</h1>

<div align="center">

**A VitePress plugin to generate a pretty linkcard with OGP.**

You can see: [A blog generated with this plugin](https://asumoranda.com/posts/10-vitepress-linkcard.html) | [Docs by TypeDoc](https://asumo-1xts.github.io/vitepress-linkcard/)

[![NPM Version](https://img.shields.io/npm/v/vitepress-linkcard?style=flat&logo=npm&logoColor=white&label=npmjs&color=%23CB3837)](https://www.npmjs.com/package/vitepress-linkcard)
[![VitePress](https://img.shields.io/badge/For_VitePress-v1_|_v2-%235C73E7?logo=vitepress&logoColor=white)](https://vuejs.github.io/vitepress/v1]/)
[![NPM License](https://img.shields.io/npm/l/vitepress-linkcard)](/LICENSE)

[![Yarn](https://img.shields.io/badge/Built_with_Yarn-v4.9.2-%232C8EBB?logo=yarn&logoColor=white)](https://yarnpkg.com/)
[![Oxc](https://img.shields.io/badge/Oxc-%2300F7F1?logo=oxc&logoColor=white&label=Lint%20and%20Format%20with&labelColor=gray)](https://oxc.rs/)

<img src="https://github.com/asumo-1xts/vitepress-linkcard/blob/main/.github/screen.gif?raw=true" width=90% alt="How it shows" />

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
import { defineConfig } from 'vitepress'
import { linkToCardPlugin } from 'vitepress-linkcard'
import type { LinkToCardPluginOptions } from 'vitepress-linkcard'

export default defineConfig({
  // ...
  markdown: {
    config: (md) => {
      md.use<LinkToCardPluginOptions>(linkToCardPlugin, {
        // target: "_self" // if needed
      })
    }
  }
  // ...
})
```

#### `*.md`

Generates a linkcard when `@:` appended.

```md
[example](@:https://example.com)
```

## Supported options

### Target

As shown in [Usage](#usage), you can specify the target window in which to open a link.

- `_blank` **(default)**
- `_self`
- `_top`
- `_parent`

### Color theme

You can customize:

- Border color
- Background color
- Border color when hovered
- Background color when hovered

**By default, all colors are set to `var(--vp-c-bg-soft)`.**

#### `docs/.vitepress/theme/custom.css`

```css
/* For example: like "Features" in VitePress */

.vitepress-linkcard-container {
  border-color: #00000000 !important;
  background-color: var(--vp-c-bg-soft) !important;
}

.vitepress-linkcard-container:hover {
  border-color: var(--vp-c-brand-1) !important;
  background-color: var(--vp-c-bg-soft) !important;
}
```

#### `docs/.vitepress/theme/index.ts`

```ts
import DefaultTheme from 'vitepress/theme-without-fonts'
import type { Theme as ThemeConfig } from 'vitepress'
import './custom.css'

const Theme: ThemeConfig = {
  extends: DefaultTheme
}

export default {
  ...Theme
}
```

## Other specifications

### `.linkcard_cache.json`

It is generated automatically in `docs/` and cache all the parsed metadata.

You can move it to root dir if needed.

### Special handling for `github.com`

When the domain is `github.com`, trimming is performed as shown in the following example to avoid duplication of the title and description.

|        | Title                                                                                     | Description                                                                                                                                 |
| ------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Before | GitHub - asumo-1xts/vitepress-linkcard: A VitePress plugin to generate a pretty linkcard. | A VitePress plugin to generate a pretty linkcard. Contribute to asumo-1xts/vitepress-linkcard development by creating an account on GitHub. |
| After  | asumo-1xts/vitepress-linkcard                                                             | A VitePress plugin to generate a pretty linkcard.                                                                                           |
