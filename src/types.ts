import type MarkdownIt from 'markdown-it'

/**
 * Type definition for the link-to-card plugin compatible with markdown-it.
 *
 * @see {@link https://markdown-it.github.io/markdown-it/#MarkdownIt.use | MarkdownIt.use}
 */
export type LinkToCardPlugin =
  MarkdownIt.PluginWithOptions<LinkToCardPluginOptions>

/**
 * Configuration options for the link-to-card plugin.
 *
 * This interface defines the customization options available when using the vitepress-linkcard plugin.
 * The plugin converts specially-formatted markdown links (prefixed with `@:`) into rich link preview cards
 * with Open Graph Protocol (OGP) metadata.
 *
 * @example
 * ```typescript
 * import { linkToCardPlugin } from 'vitepress-linkcard'
 *
 * markdownIt.use(linkToCardPlugin, {
 *   target: '_blank'
 * })
 * ```
 *
 * @see {@link https://daringfireball.net/projects/markdown/syntax#link | Markdown Link Syntax}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#target | HTML anchor target attribute}
 */
export interface LinkToCardPluginOptions {
  /**
   * Where to display the linked URL.
   * @defaultValue `'_blank'` - Opens the link in a new tab/window
   */
  target?: ATarget

  /**
   * CSS class name prefix for the card DOM elements.
   * When set, no inline styles are injected; only the class names are applied.
   *
   * @example `'my-docs__link-card'`
   */
  classPrefix?: string

  /**
   * Custom function to render the DOM fragment for the link card.
   * When provided, this function is used instead of the default card renderer.
   */
  render?: CardDomRender
}

/**
 * Metadata extracted from a URL's HTML page using Open Graph Protocol tags and meta tags.
 *
 * This interface represents the structured data fetched from a web page to populate the link card display.
 * The metadata is typically extracted from `<meta>` tags, OGP tags, and other HTML elements.
 *
 * @see {@link https://ogp.me/ | Open Graph Protocol}
 */
export interface UrlMetadata {
  /**
   * The title of the page, extracted from `<title>` or `<meta property="og:title">` tags.
   */
  title?: string

  /**
   * The description of the page, extracted from `<meta name="description">` or
   * `<meta property="og:description">` tags.
   */
  description?: string

  /**
   * The logo or icon URL for the page, extracted from `<meta property="og:image">` or
   * `<link rel="icon">` tags.
   */
  logo?: string

  /**
   * Additional metadata properties that may be extracted from the page.
   */
  [key: string]: unknown
}

/**
 * Valid values for the HTML anchor element's `target` attribute.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#target | MDN - target attribute}
 */
export type ATarget = '_self' | '_blank' | '_top' | '_parent'

/**
 * Options passed to the card DOM renderer function.
 *
 * This interface provides all the necessary information to render a link card,
 * including the URL, display preferences, and styling options.
 */
export interface CardDomRenderOptions {
  /**
   * The URL to link to.
   */
  href: string

  /**
   * The title text to display on the link (typically from the markdown link text).
   */
  linkTitle: string

  /**
   * Where to display the linked URL when clicked.
   */
  target: ATarget

  /**
   * CSS class name prefix for the card DOM elements.
   */
  classPrefix?: string
}

/**
 * Function signature for custom card DOM renderers.
 *
 * This type defines a function that takes URL metadata and rendering options,
 * and returns an HTML string representing the link card.
 *
 * @param data - The metadata extracted from the URL
 * @param options - Rendering and styling options for the card
 * @returns An HTML string representing the rendered link card
 *
 * @example
 * ```typescript
 * const customRender: CardDomRender = (data, options) => {
 *   return `<div class="${options.classPrefix}">
 *     <h3>${data.title}</h3>
 *     <p>${data.description}</p>
 *   </div>`
 * }
 * ```
 */
export type CardDomRender = (
  data: UrlMetadata,
  options: CardDomRenderOptions
) => string
