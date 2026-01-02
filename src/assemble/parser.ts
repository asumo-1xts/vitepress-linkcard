/**
 * HTML parser module for extracting metadata from web pages.
 *
 * This module provides functions to parse HTML strings and extract metadata such as
 * title, description, and logo/icon URLs. It supports both standard HTML meta tags
 * and Open Graph Protocol (OGP) tags.
 *
 * @module parser
 * @todo Refactor to improve maintainability and add support for more meta tag formats
 */

import type { UrlMetadata } from '../types'
import { isString } from '@luckrya/utility'
import { cleanPath, extractUrl } from './url'

/**
 * Default logo URL used when no logo can be extracted from the page.
 */
const DEFAULT_LOGO = 'https://resources.whatwg.org/logo-url.svg'

/**
 * Regular expression to match HTML tag content between opening and closing tags.
 * @example Matches: `<title>Page Title</title>` → captures "Page Title"
 */
const HtmlTagContentReg = /(<[A-Za-z]+\s*[^>]*>(.*)<\/[A-Za-z]+>)/

/**
 * Regular expression to extract the `content` attribute value from HTML meta tags.
 * @example Matches: `content="value"` or `content='value'`
 */
const ContentAttrValueHtmlMetaTagReg = /content=["|']([^>]*)["|']/

/**
 * Regular expression to extract the `href` attribute value from HTML link tags.
 * @example Matches: `href="value"` or `href='value'`
 */
const HrefAttrValueHtmlLinkTagReg = /href=["|']([^>]*)["|']/

/**
 * Regular expression to match HTML title tags.
 * @example Matches: `<title>Page Title</title>`
 */
const HtmlTitleTagReg = /(<title\s*[^>]*>(.*)<\/title>)/g

/**
 * Creates a regular expression to match self-closing or non-closing HTML tags with a specific attribute.
 *
 * This function generates patterns to find meta or link tags that contain a specific attribute,
 * which is useful for finding OGP tags like `og:title`, `og:description`, etc.
 *
 * @param attr - The attribute to search for (e.g., 'title', 'description', 'image')
 * @param tag - The HTML tag name to match (default: 'meta')
 * @returns A RegExp that matches tags containing the specified attribute
 *
 * @example
 * ```typescript
 * const reg = containArrSelfLosingHtmlTagReg('og:title')
 * // Matches: <meta property="og:title" content="...">
 * ```
 *
 * @internal
 */
const containArrSelfLosingHtmlTagReg = (attr: string, tag = 'meta') =>
  new RegExp(`<${tag}\\s[^>]*\\w+=['|"]([a-zA-Z]|:|\\s)*${attr}['|"][^>]*\\/?>`)

/**
 * Extracts the page title from HTML string.
 *
 * Attempts to find the title in the following order:
 * 1. Meta tags with 'title' attribute (e.g., `<meta property="og:title" content="...">`)
 * 2. Standard HTML `<title>` tag
 *
 * @param htmlString - The HTML content to parse
 * @returns The extracted title, or undefined if not found
 *
 * @example
 * ```typescript
 * const title = matchTitleByMetaTag('<title>Example Page</title>')
 * // Returns: "Example Page"
 * ```
 *
 * @internal
 */
function matchTitleByMetaTag(htmlString: string) {
  let title: string | undefined
  const metas = htmlString.match(containArrSelfLosingHtmlTagReg('title'))

  if (metas?.length) {
    const content = metas[0].match(ContentAttrValueHtmlMetaTagReg)
    if (content && isString(content[1])) title = content[1]
  } else {
    const titleHtmlTag = htmlString.match(HtmlTitleTagReg)

    if (titleHtmlTag?.length) {
      const content = titleHtmlTag[0].match(HtmlTagContentReg)
      if (content && isString(content[2])) title = content[2]
    }
  }

  return title
}

/**
 * Extracts the page description from HTML string.
 *
 * Searches for description in meta tags, supporting both standard and OGP formats:
 * - `<meta name="description" content="...">`
 * - `<meta property="og:description" content="...">`
 *
 * @param htmlString - The HTML content to parse
 * @returns The extracted description, or undefined if not found
 *
 * @example
 * ```typescript
 * const desc = matchDescriptionByMetaTag('<meta name="description" content="A great site">')
 * // Returns: "A great site"
 * ```
 *
 * @internal
 */
function matchDescriptionByMetaTag(htmlString: string) {
  let description: string | undefined
  const metas = htmlString.match(containArrSelfLosingHtmlTagReg('description'))

  if (metas?.length) {
    const content = metas[0].match(ContentAttrValueHtmlMetaTagReg)
    if (content && isString(content[1])) description = content[1]
  }
  return description
}

/**
 * Extracts the page logo/icon URL from HTML string.
 *
 * Attempts to find the logo in the following order:
 * 1. OGP image tag: `<meta property="og:image" content="...">`
 * 2. Icon link tag: `<link rel="icon" href="...">`
 *
 * @param htmlString - The HTML content to parse
 * @returns The extracted logo URL (may be relative), or undefined if not found
 *
 * @example
 * ```typescript
 * const logo = matchLogoByLinkOrMetaTag('<link rel="icon" href="/favicon.ico">')
 * // Returns: "/favicon.ico"
 * ```
 *
 * @internal
 */
function matchLogoByLinkOrMetaTag(htmlString: string) {
  let logo: string | undefined
  const metas = htmlString.match(containArrSelfLosingHtmlTagReg('image'))

  if (metas?.length) {
    const content = metas[0].match(ContentAttrValueHtmlMetaTagReg)
    if (content && isString(content[1])) logo = content[1]
  } else {
    const linkHtmlTags = htmlString.match(
      containArrSelfLosingHtmlTagReg('icon', 'link')
    )

    if (linkHtmlTags?.length) {
      const content = linkHtmlTags[0].match(HrefAttrValueHtmlLinkTagReg)
      // logo 判断是否是完整地址
      if (content && isString(content[1])) logo = content[1]
    }
  }

  return logo
}

/**
 * Parses HTML string to extract structured metadata for link card generation.
 *
 * This is the main parsing function that extracts title, description, and logo
 * from an HTML page. It handles both absolute and relative URLs, converting
 * relative logo paths to absolute URLs when necessary.
 *
 * @param htmlString - The HTML content to parse
 * @param url - The URL of the page (used to resolve relative logo URLs)
 * @returns Parsed metadata object, or null if no valid metadata could be extracted
 *
 * @example
 * ```typescript
 * const html = '<title>Example</title><meta name="description" content="Test">'
 * const metadata = parserMetadata(html, 'https://example.com')
 * // Returns: { title: 'Example', description: 'Test', logo: '...' }
 * ```
 *
 * @remarks
 * - Returns null if all metadata fields (title, description, logo) are empty
 * - Relative logo URLs are converted to absolute URLs using the page's origin
 * - Falls back to a default logo if no logo can be found
 *
 * @todo Handle protocol-relative URLs like `//img.example.com/logo.png`
 */
export function parserMetadata(
  htmlString: string,
  url: string
): UrlMetadata | null {
  /**
   * Converts a potentially relative logo URL to an absolute URL.
   *
   * @param logo - The logo URL (may be relative or absolute)
   * @returns Absolute URL for the logo, or default logo if input is invalid
   *
   * @internal
   */
  function absolute(logo?: string) {
    if (!logo) return DEFAULT_LOGO
    return extractUrl(logo)
      ? logo
      : `${extractUrl(url)?.origin}${cleanPath(`/${logo}`)}` // TODO: no match "content='//img.xx.com/a.png'"
  }

  const metadata = {
    title: matchTitleByMetaTag(htmlString),
    description: matchDescriptionByMetaTag(htmlString),
    logo: absolute(matchLogoByLinkOrMetaTag(htmlString))
  }

  if (isEmptyStringObject(metadata)) return null
  else return metadata
}

/**
 * Checks if an object contains only undefined or empty string values.
 *
 * This utility function is used to determine if any valid metadata was extracted
 * from a page. If all fields are empty, the metadata is considered invalid.
 *
 * @param obj - Object to check (typically a metadata object)
 * @returns true if the object has no non-empty string values, false otherwise
 *
 * @internal
 */
function isEmptyStringObject(obj: Record<string, string | undefined>) {
  return !Object.values(obj).filter((v) => isString(v)).length
}
