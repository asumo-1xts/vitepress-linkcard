/**
 * Style generation utilities for link card rendering.
 *
 * This module provides functions to generate inline CSS styles and class names
 * for the link card components. The styles support customizable colors and
 * responsive design with text ellipsis for long content.
 *
 * @module style
 */

/**
 * Converts a camelCase string to hyphenated kebab-case.
 *
 * This is used to convert JavaScript style property names (e.g., `backgroundColor`)
 * to CSS property names (e.g., `background-color`).
 *
 * @param str - The camelCase string to convert
 * @returns The hyphenated kebab-case string
 *
 * @example
 * ```typescript
 * hyphenate('backgroundColor') // Returns: 'background-color'
 * hyphenate('fontSize')        // Returns: 'font-size'
 * ```
 *
 * @internal
 */
function hyphenate(str: string): string {
  return str.replace(/\B([A-Z])/g, '-$1').toLowerCase()
}

/**
 * Joins style properties into a CSS string.
 *
 * Converts a JavaScript object of style properties into a semicolon-separated
 * CSS string suitable for inline styles.
 *
 * @param style - Object containing CSS properties and values
 * @returns A string of CSS declarations
 *
 * @example
 * ```typescript
 * join({ fontSize: '16px', color: 'red' })
 * // Returns: 'font-size: 16px; color: red;'
 * ```
 *
 * @internal
 */
function join(style: Record<string, string | number>) {
  return Object.entries(style)
    .map(([k, v]) => {
      if (k && v) return `${hyphenate(k)}: ${v};`
    })
    .filter(Boolean)
    .join(' ')
}

/**
 * Wraps CSS declarations in an inline style attribute.
 *
 * @param style - Object containing CSS properties and values
 * @returns A complete HTML style attribute string
 *
 * @example
 * ```typescript
 * inlineStyle({ color: 'red', fontSize: '16px' })
 * // Returns: 'style="color: red; font-size: 16px;"'
 * ```
 *
 * @internal
 */
function inlineStyle(style: Record<string, string | number>) {
  return `style="${join(style)}"`
}

/**
 * Generates CSS properties for text ellipsis with line clamping.
 *
 * Creates styles that truncate text after a specified number of lines with
 * an ellipsis. Uses both WebKit-specific properties and standard line-clamp.
 *
 * @param line - Maximum number of lines to display before truncation
 * @returns CSS properties object for ellipsis effect
 *
 * @example
 * ```typescript
 * ellipsisStyle(2)
 * // Returns styles that truncate text after 2 lines with "..."
 * ```
 *
 * @internal
 */
const ellipsisStyle = (line: number) => ({
  '-webkit-box-orient': 'vertical',
  '-webkit-line-clamp': line,
  display: '-webkit-box',
  hyphens: 'auto',
  lineClamp: line,
  overflow: 'hidden',
  overflowWrap: 'anywhere',
  textOverflow: 'ellipsis',
  wordBreak: 'break-word'
})

/**
 * Generates complete inline styles for all link card components.
 *
 * Creates a set of inline style strings for each part of the link card:
 * - Container: main card box with border and background
 * - Image: logo/icon display
 * - Texts: wrapper for text content
 * - Title: card title (2-line ellipsis)
 * - Domain: domain name with underline
 * - Description: description text (2-line ellipsis)
 *
 * The styles are inspired by VitePress's VPFeature component design.
 *
 * The container uses CSS custom properties for theming:
 * - `--vitepress-linkcard-border-color`: Border color (default: #7d7d7dff)
 * - `--vitepress-linkcard-bg-color`: Background color (default: transparent)
 *
 * @returns Object containing style attribute strings for each card component
 *
 * @example
 * ```typescript
 * const styles = STYLE()
 * // Use in HTML: <div ${styles.container}>...</div>
 * ```
 *
 * @see {@link https://github.com/vuejs/vitepress/blob/main/src/client/theme-default/components/VPFeature.vue | VPFeature component}
 */
export const STYLE = () => ({
  a: inlineStyle({
    color: 'unset !important',
    display: 'block',
    width: '100%',
    textDecoration: 'none'
  }),
  container: inlineStyle({
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    borderRadius: '12px',
    border: `1px solid var(--vp-c-bg-soft)`,
    backgroundColor: `var(--vp-c-bg-soft)`,
    boxSizing: 'border-box',
    width: '100%',
    height: '130px',
    transition: 'border-color 0.25s, background-color 0.25s'
  }),
  img: inlineStyle({
    borderRadius: '0px 12px 12px 0px',
    maxWidth: '40%',
    height: '128px', // container.height - 2px
    flexShrink: 0,
    objectFit: 'contain',
    overflow: 'hidden'
  }),
  texts: inlineStyle({
    flex: '1 1 0%',
    minWidth: '0' // ellipsisを有効にするために必要
  }),
  title: inlineStyle({
    ...ellipsisStyle(2),
    opacity: 1,
    fontSize: '16px',
    lineHeight: '22px',
    margin: '0 16px 8px 16px',
    fontWeight: 'bold'
  }),
  domain: inlineStyle({
    ...ellipsisStyle(1),
    opacity: 1,
    fontSize: '12px',
    lineHeight: '16px',
    margin: '8px 16px 8px 16px',
    textDecoration: 'underline'
  }),
  description: inlineStyle({
    ...ellipsisStyle(2),
    opacity: 0.8,
    fontSize: '12px',
    lineHeight: '16px',
    margin: '8px 16px 0px 16px'
  })
})

/**
 * Generates CSS class names with a custom prefix.
 *
 * When using the `classPrefix` option, this function creates consistent
 * class names for all card components following a BEM-like naming convention.
 *
 * @param prefix - The prefix to prepend to all class names
 * @returns Object mapping component names to their class names
 *
 * @example
 * ```typescript
 * const classes = classNames('my-card')
 * // Returns: {
 * //   container: 'my-card__container',
 * //   title: 'my-card__texts--title',
 * //   ...
 * // }
 * ```
 *
 * @remarks
 * When class names are used instead of inline styles, you must provide
 * your own CSS definitions for these classes.
 */
export const classNames = (prefix?: string) => ({
  container: `${prefix}__container`,
  img: `${prefix}__img`,
  texts: `${prefix}__texts`,
  title: `${prefix}__texts--title`,
  domain: `${prefix}__texts--domain`,
  description: `${prefix}__texts--desc`
})
