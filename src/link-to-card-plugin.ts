import type { LinkToCardPlugin } from './types'
import type Token from 'markdown-it/lib/token'
import { isFunction } from '@luckrya/utility'
import { getUrlMetadata, generateCardDomFragment } from './assemble'

/**
 * Markdown-it plugin that converts specially-formatted links into rich link preview cards.
 *
 * This plugin intercepts markdown links that start with the `@:` prefix and transforms them
 * into interactive cards displaying metadata (title, description, logo) fetched from the target URL.
 *
 * ## Usage
 *
 * In your markdown file:
 * ```md
 * [@:https://example.com](Link Title)
 * ```
 *
 * Plugin configuration:
 * ```typescript
 * import MarkdownIt from 'markdown-it'
 * import { linkToCardPlugin } from 'vitepress-linkcard'
 *
 * const md = new MarkdownIt()
 * md.use(linkToCardPlugin, {
 *   target: '_blank'
 * })
 * ```
 *
 * @param md - The markdown-it instance
 * @param pluginOptions - Configuration options for the plugin
 *
 * @see {@link LinkToCardPluginOptions} for available options
 */
export const linkToCardPlugin: LinkToCardPlugin = (md, pluginOptions = {}) => {
  /**
   * Parses a link href to determine if it's a card link and extracts the URL.
   *
   * Card links are identified by the `@:` prefix (e.g., `@:https://example.com`).
   *
   * @param href - The href attribute from a markdown link token
   * @returns An object containing:
   *   - `isCardLink`: true if the href matches the card link pattern
   *   - `url`: the extracted URL (without the `@:` prefix)
   *
   * @internal
   */
  function parseCardLinkHref(href?: string) {
    const tagRegexp = new RegExp(`^(${'@'}:)([a-zA-Z0-9]+.*)`)
    const match = href?.match(tagRegexp)

    return {
      isCardLink: !!match,
      url: match?.[2]
    }
  }

  /**
   * Assembles the HTML template for a link card by fetching metadata and rendering.
   *
   * This function:
   * 1. Fetches URL metadata (title, description, logo)
   * 2. Hides remaining tokens in the link to prevent duplicate content
   * 3. Extracts the link title from tokens
   * 4. Renders the card using either a custom renderer or the default one
   *
   * @param options - Contains the URL and token information
   * @param options.url - The URL to create a card for
   * @param options.tokens - Array of markdown-it tokens
   * @param options.i - Current token index
   * @returns HTML string of the rendered card, or undefined if metadata cannot be fetched
   *
   * @internal
   */
  function assembleCardTpl(options: {
    url: string
    tokens: Token[]
    i: number
  }) {
    const urlMetadata = getUrlMetadata(options.url)

    if (urlMetadata) {
      ignoreRestToken(options.tokens, options.i) // linkTitle 依赖 ignoreRestToken 的处理结果

      const cardDomOptions = {
        href: options.url,
        linkTitle: joinLinkTitle(options.tokens),
        target: pluginOptions.target || '_blank',
        classPrefix: pluginOptions.classPrefix
      }

      return isFunction(pluginOptions.render)
        ? pluginOptions.render(urlMetadata, cardDomOptions)
        : generateCardDomFragment(urlMetadata, cardDomOptions)
    }
  }

  /**
   * Custom inline renderer that preserves hidden token handling.
   *
   * This overrides the default markdown-it inline renderer to properly handle
   * tokens marked as hidden, which is necessary for the card link processing.
   *
   * @param tokens - Array of tokens to render
   * @param rootOptions - Markdown-it rendering options
   * @param env - Markdown-it environment variables
   * @returns The rendered HTML string
   *
   * @see {@link https://markdown-it.github.io/markdown-it/#MarkdownIt.renderInline | MarkdownIt.renderInline}
   */
  md.renderer.renderInline = (tokens, rootOptions, env) => {
    let result = ''

    for (let i = 0; i < tokens.length; i++) {
      const currentToken = tokens[i]
      const ruleFunction = md.renderer.rules[currentToken.type]

      if (currentToken.hidden) {
        result += ''
      } else if (isFunction(ruleFunction)) {
        result += ruleFunction(tokens, i, rootOptions, env, md.renderer)
      } else {
        result += md.renderer.renderToken(tokens, i, rootOptions)
      }
    }

    return result
  }

  /**
   * Custom renderer for link_open tokens that intercepts card links.
   *
   * This function checks if a link is a card link (prefixed with `@:`) and if so,
   * generates and returns the card HTML. Regular links are passed through to the
   * default renderer.
   *
   * @param tokens - Array of tokens being rendered
   * @param i - Current token index
   * @param rootOptions - Markdown-it rendering options
   * @param env - Markdown-it environment (must be present even if unused to maintain signature)
   * @param self - The renderer instance
   * @returns HTML string for the link (either a card or a regular link)
   *
   * @remarks
   * The `env` parameter must not be removed even if unused, as it's part of the
   * markdown-it renderer signature.
   */
  md.renderer.rules.link_open = (tokens, i, rootOptions, env, self) => {
    const token = tokens[i]
    const isLinkOpenToken = token.tag === 'a' && token.type === 'link_open'
    const href = token.attrs?.filter((attr) => attr.includes('href'))[0]?.[1]
    const { url, isCardLink } = parseCardLinkHref(href)

    if (isLinkOpenToken && isCardLink && url) {
      const card = assembleCardTpl({ url, tokens, i })
      if (card) return card
    }

    return self.renderToken(tokens, i, rootOptions)
  }
}

/**
 * Marks all tokens except the one at index `i` as hidden.
 *
 * This is used to prevent the link text and closing tag from being rendered
 * when a card link is detected, as the card HTML replaces the entire link element.
 *
 * @param tokens - Array of tokens to modify
 * @param i - Index of the token to keep visible
 *
 * @todo Handle softbreak tokens properly
 * @see {@link https://markdown-it.github.io/ | markdown-it documentation}
 *
 * @internal
 */
function ignoreRestToken(tokens: Token[], i: number) {
  tokens.forEach((token, index) => {
    if (index !== i) token.hidden = true
  })
}

/**
 * Extracts and joins the content from hidden tokens to form the link title.
 *
 * When processing a card link, the link text tokens are marked as hidden.
 * This function collects the content from those hidden tokens to use as the
 * card's title attribute.
 *
 * @param tokens - Array of tokens to extract content from
 * @returns The concatenated content from all hidden tokens
 *
 * @internal
 */
function joinLinkTitle(tokens: Token[]) {
  return tokens
    .map(({ hidden, content }) => {
      if (hidden) return content
      return ''
    })
    .filter(Boolean)
    .join('')
}
