import type { UrlMetadata } from '../types'
import { parserMetadata, xhr } from '.'
import LocalFileCache from './local-file-cache'

/**
 * Local file cache instance for storing fetched URL metadata.
 * This cache persists metadata to disk to avoid repeated network requests.
 * @internal
 */
const cache = new LocalFileCache<UrlMetadata>()

/**
 * Retrieves metadata for a given URL, using cache when available.
 *
 * This function first checks if the metadata is already cached. If not, it fetches
 * the HTML content from the URL, parses the metadata, and caches the result for
 * future use.
 *
 * The metadata includes:
 * - Title (from `<title>` or OGP tags)
 * - Description (from meta description or OGP tags)
 * - Logo/icon (from OGP image or favicon)
 *
 * @param url - The URL to fetch metadata from
 * @returns The parsed URL metadata, or null if the URL cannot be fetched or parsed
 *
 * @example
 * ```typescript
 * const metadata = getUrlMetadata('https://example.com')
 * if (metadata) {
 *   console.log(metadata.title) // "Example Domain"
 *   console.log(metadata.description) // "Example website description"
 * }
 * ```
 *
 * @see {@link parserMetadata} for details on metadata extraction
 * @see {@link LocalFileCache} for caching implementation
 */
export function getUrlMetadata(url: string) {
  if (cache.has(url)) return cache.get(url)
  let metadata: UrlMetadata | null = null
  const htmlString = xhr.sync(url)

  if (htmlString) {
    metadata = parserMetadata(htmlString, url)

    if (metadata) cache.set(url, metadata)
  }

  return metadata
}
