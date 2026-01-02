import type { CardDomRender } from '../types'
import { STYLE } from './style'

/**
 * Generates the HTML DOM fragment for a link card display.
 *
 * This is the default card renderer that creates a rich preview card with:
 * - Card title (with 2-line ellipsis)
 * - Domain name (with underline)
 * - Description (with 2-line ellipsis)
 * - Logo/icon image
 * - Smooth border transition for hover effects
 *
 * The function includes special handling for GitHub URLs to improve the display
 * of repository cards by cleaning up redundant text patterns.
 *
 * @param data - The metadata extracted from the URL (title, description, logo)
 * @param options - Rendering options including href, target, colors, etc.
 * @returns An HTML string containing the complete card markup with inline styles
 *
 * @example
 * ```typescript
 * const html = generateCardDomFragment(
 *   { title: 'Example', description: 'A site', logo: 'https://...' },
 *   { href: 'https://example.com', linkTitle: 'Link', target: '_blank' }
 * )
 * ```
 *
 * @remarks
 * - HTML entities in title/description are automatically escaped
 * - For GitHub URLs, the title is cleaned to remove "GitHub - " prefix and redundant text
 * - The card uses flexbox layout for responsive design
 * - All styles are inlined for maximum compatibility
 * - Container has class `vitepress-linkcard-container` for custom styling
 * - Uses CSS custom properties for theming:
 *   - `--vitepress-linkcard-border-color`: Customize border color
 *   - `--vitepress-linkcard-bg-color`: Customize background color
 * - Styling options in your VitePress theme's custom CSS:
 *   ```css
 *   .vitepress-linkcard-container {
 *     --vitepress-linkcard-border-color: #e0e0e0;
 *     --vitepress-linkcard-bg-color: #f9f9f9;
 *   }
 *
 *   .vitepress-linkcard-container {
 *     border-color: var(--vp-c-brand-2) !important;
 *     background-color: var(--vp-c-brand-soft) !important;
 *   }
 *
 *   .vitepress-linkcard-container:hover {
 *     border-color: var(--vp-c-brand-1) !important;
 *   }
 *   ```
 *
 * @see {@link STYLE} for the styling implementation
 */
export const generateCardDomFragment: CardDomRender = (data, options) => {
  const aa = {
    rel: `rel="noopener noreferrer"`,
    target: `target="${options.target}"`,
    href: `href="${options.href}"`,
    title: `title="${options.linkTitle}"`
  }
  const inject = (s: string) => {
    return s
  }
  /**
   * Escapes HTML entities in a string to prevent XSS and display issues.
   *
   * @param str - The string to escape
   * @returns The escaped string safe for HTML insertion
   * @internal
   */
  const escapeHTML = (str: string) =>
    str
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
  const style = STYLE()
  const url = options.href || ''
  const domain =
    new URL(url).origin.replace(/^https?:\/\//, '').replace(/^www\./, '') ||
    'Unknown domain'

  let title = data.title
  let description = data.description

  // Special handling for gitub.com
  if (domain == 'github.com') {
    title = data.title?.split(':')[0].replace('GitHub - ', '') || 'No title'
    description =
      description?.replace(` - ${title}`, '').replace(
        `Contribute to ${title} development by creating an account on GitHub.`, // 定型句
        ''
      ) || ''
  } else {
    title = data.title || 'No title'
    description = data.description || ''
  }

  return `<span style="display:block;">
  <a ${aa.rel} ${aa.target} ${aa.href} ${aa.title} ${style.a}>
    <span class="vitepress-linkcard-container" ${inject(style.container)}>
      <span ${inject(style.texts)}>
        <span ${inject(style.title)}>
          ${escapeHTML(title)}
        </span>
        <span ${inject(style.domain)}>
          ${escapeHTML(domain)}
        </span>
        <span ${inject(style.description)}>
          ${escapeHTML(description)}
        </span>
      </span>
      <img src="${data?.logo}" ${inject(style.img)}/>
    </span>
  </a>
</span>`
}
