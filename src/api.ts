import type { UrlMetadata, CardDomRenderOptions } from './types'
import { xhr, generateCardDomFragment, parserMetadata } from './assemble'

/**
 * Internal cache storing generated card responses by URL.
 * This prevents redundant network requests and parsing operations for the same URLs.
 * @internal
 */
const cache = new Map<string, CardResponse>()

/**
 * Represents a complete card response with all necessary data for rendering.
 * @internal
 */
interface CardResponse {
  /**
   * The URL that was fetched.
   */
  url: string

  /**
   * Parsed metadata from the URL.
   */
  data: UrlMetadata

  /**
   * Rendering options (excluding href which is derived from url).
   */
  options: Omit<CardDomRenderOptions, 'href'>

  /**
   * The generated HTML string for the card.
   */
  dom: string
}

/**
 * Generates a link card by fetching and parsing metadata from a URL.
 *
 * This function performs the following operations:
 * 1. Fetches the HTML content from the provided URL synchronously
 * 2. Parses metadata (title, description, logo) from the HTML
 * 3. Generates an HTML card fragment with the metadata
 * 4. Caches the result for subsequent calls
 *
 * The function is primarily used by the link-to-card plugin during markdown processing
 * but can also be used standalone for programmatic card generation.
 *
 * @param url - The URL to fetch metadata from
 * @param options - Rendering options for the card (excluding href, which is set to the url parameter)
 * @returns A promise that resolves to a CardResponse containing the card data and HTML
 *
 * @example
 * ```typescript
 * const card = await generateCard('https://example.com', {
 *   linkTitle: 'Example Site',
 *   target: '_blank'
 * })
 * console.log(card.dom) // HTML string of the card
 * ```
 *
 * @see {@link parserMetadata} for details on metadata extraction
 * @see {@link generateCardDomFragment} for details on card HTML generation
 */
export function generateCard(
  url: string,
  options: Omit<CardDomRenderOptions, 'href'>
): Promise<CardResponse> {
  return new Promise((resolve) => {
    const htmlString = xhr.sync(url)

    if (htmlString) {
      const urlMetadata = parserMetadata(htmlString, url)
      if (urlMetadata) {
        const _options = {
          linkTitle: options.linkTitle,
          target: options.target || '_blank',
          classPrefix: options.classPrefix
        }
        const card = generateCardDomFragment(urlMetadata, {
          ..._options,
          href: url
        })
        const response = {
          url,
          data: urlMetadata,
          options: _options,
          dom: card
        }

        cache.set(url, response)
        resolve(response)
      }
    }
  })
}
