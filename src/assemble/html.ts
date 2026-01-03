import type { CardDomRender } from '../types'
import { STYLE } from './style'

/**
 * Generates the HTML DOM fragment for a link card display.
 *
 * @param data - The metadata extracted from the URL
 * @param options - Rendering options including href, target, etc.
 * @returns An HTML string containing the card markup
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

  if (domain == 'github.com') {
    title = data.title?.split(':')[0].replace('GitHub - ', '') || 'No title'
    description =
      description?.replace(` - ${title}`, '').replace(
        `Contribute to ${title} development by creating an account on GitHub.`,
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
