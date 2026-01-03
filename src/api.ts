import type { UrlMetadata, CardDomRenderOptions } from './types'
import { xhr, generateCardDomFragment, parserMetadata } from './assemble'

const cache = new Map<string, CardResponse>()

interface CardResponse {
  url: string
  data: UrlMetadata
  options: Omit<CardDomRenderOptions, 'href'>
  dom: string
}

/**
 * Generates a link card by fetching and parsing metadata from a URL.
 *
 * @param url - The URL to fetch metadata from
 * @param options - Rendering options for the card
 * @returns A promise that resolves to a CardResponse containing the card data and HTML
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
