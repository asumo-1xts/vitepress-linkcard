# CONTRIBUTING

Always welcome.

## Environment

[mise](https://mise.jdx.dev/) is recommended.

```shell
mise install # Load .config/mise.toml and install tools

yarn install # Install dependencies

yarn dlx @yarnpkg/sdks vscode # If you develop with VScode
```

## Branch rule

`main` branch can only be pushed from Pull Requests.

## CI/CD

| Task           | When          | Action                                                                                      | On local       |
|----------------|---------------|---------------------------------------------------------------------------------------------|----------------|
| ESLint         | PR is opened  | Block merge until errors are resolved                                                       | `yarn lint`    |
| Prettier       | PR is merged  | Format files and push them on `HEAD`                                                        | `yarn format`  |
| Publish to npm | PR is merged  | Publish package to [npmjs](https://www.npmjs.com/package/vitepress-linkcard)                | -              |
| TypeDoc        | PR is merged  | Build and deploy docs to [GitHub Pages](https://asumo-1xts.github.io/vitepress-linkcard/)   | `yarn docs`    |

## devDependencies

> [!WARNING]
> To avoid build failures, these packages must not be updated any further.
>
> | Package            | Version   |
> |--------------------|-----------|
> | @types/markdown-it | ^13.0.2   |
> | markdown-it        | ^13.0.2   |
> | rollup             | ^2.79.2   |
>
> Of course, this restriction does not apply if you modify the source code of this plugin appropriately.
