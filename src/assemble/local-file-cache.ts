/**
 * Local file-based cache implementation for persisting URL metadata.
 *
 * This module provides a simple key-value cache that persists data to a JSON file
 * on disk. It's used to cache fetched URL metadata to avoid redundant network requests
 * across different build sessions.
 *
 * @module local-file-cache
 */

import { isPureObject } from '@luckrya/utility'
import fs from 'node:fs'

/**
 * Determines the path to the cache file.
 *
 * Checks for cache file existence in two locations:
 * 1. `.linkcard_cache.json` in the project root (preferred)
 * 2. `.config/.linkcard_cache.json` as fallback
 *
 * If neither exists, creates a new cache file with example data.
 *
 * @returns The absolute path to the cache file
 *
 * @internal
 */
const CONFIG_FILE = () => {
  let filePath: string
  const defaultPath = `${process.cwd()}/.linkcard_cache.json`
  const fallbackPath = `${process.cwd()}/.config/.linkcard_cache.json`

  if (fs.existsSync(defaultPath)) {
    filePath = defaultPath
  } else if (fs.existsSync(fallbackPath)) {
    filePath = fallbackPath
  } else {
    filePath = defaultPath
    const initialData = {
      'https://example.com/': {
        description: 'Example Website',
        logo: 'https://example.com/example.png',
        title: 'Example Title'
      }
    }
    fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2))
  }
  return filePath
}

/**
 * Formats the cache file with consistent indentation.
 *
 * Reads the cache file, parses it, and rewrites it with proper JSON formatting
 * (2-space indentation) and a trailing newline.
 *
 * @internal
 */
const format = () => {
  const filePath = CONFIG_FILE()
  const content = fs.readFileSync(filePath, 'utf-8').trim()
  if (!content) return
  const parsed = JSON.parse(content)
  const formatted = JSON.stringify(parsed, null, 2) + '\n'
  fs.writeFileSync(filePath, formatted)
}

/**
 * A simple file-based cache for storing and retrieving structured data.
 *
 * This class provides a Map-like interface for caching data that persists to disk
 * in JSON format. Each cache entry is keyed by URL and stores structured metadata.
 *
 * The cache file is automatically created if it doesn't exist, and all writes are
 * synchronized and formatted for readability.
 *
 * @template V - The value type, must extend Record<string, unknown>
 *
 * @example
 * ```typescript
 * const cache = new LocalFileCache<UrlMetadata>()
 *
 * // Store metadata
 * cache.set('https://example.com', {
 *   title: 'Example',
 *   description: 'A site',
 *   logo: 'https://example.com/logo.png'
 * })
 *
 * // Retrieve metadata
 * const metadata = cache.get('https://example.com')
 *
 * // Check if URL is cached
 * if (cache.has('https://example.com')) {
 *   console.log('URL is cached')
 * }
 * ```
 *
 * @remarks
 * - Cache is stored in `.linkcard_cache.json` at project root
 * - All operations are synchronous
 * - Cache persists across process restarts
 * - Merges new data with existing cache entries
 */
export default class LocalFileCache<V extends Record<string, unknown>> {
  constructor() {}

  /**
   * Writes data to the cache file.
   *
   * Merges the provided data with existing cache content and writes the result
   * to disk. The file is automatically formatted after writing.
   *
   * @param data - Object mapping URLs to cached data
   *
   * @private
   */
  private setFile(data: Record<string, V>) {
    let content = data
    const _content = this.readFile()
    if (_content) {
      content = Object.assign(_content, content)
    }
    fs.writeFileSync(CONFIG_FILE(), JSON.stringify(content))
    format()
  }

  /**
   * Reads and parses the cache file.
   *
   * @returns The parsed cache data, or undefined if the file is empty or invalid
   *
   * @private
   */
  private readFile(): Record<string, V> | undefined {
    const content = fs.readFileSync(CONFIG_FILE(), 'utf-8')
    const data = JSON.parse(content)
    if (isPureObject(data)) return data

    return undefined
  }

  /**
   * Checks if a URL exists in the cache.
   *
   * @param url - The URL to check
   * @returns true if the URL has cached data, false otherwise
   *
   * @example
   * ```typescript
   * if (cache.has('https://example.com')) {
   *   console.log('Cache hit!')
   * }
   * ```
   */
  has(url: string) {
    return !!this.get(url)
  }

  /**
   * Retrieves cached data for a URL.
   *
   * @param url - The URL to retrieve data for
   * @returns The cached data for the URL, or undefined if not found
   *
   * @example
   * ```typescript
   * const metadata = cache.get('https://example.com')
   * if (metadata) {
   *   console.log(metadata.title)
   * }
   * ```
   */
  get(url: string) {
    const cache = this.readFile()
    return cache?.[url]
  }

  /**
   * Stores data in the cache for a URL.
   *
   * Adds or updates the cache entry for the specified URL. The data is merged
   * with existing cache content and persisted to disk.
   *
   * @param url - The URL to cache data for
   * @param data - The data to cache
   *
   * @example
   * ```typescript
   * cache.set('https://example.com', {
   *   title: 'Example Domain',
   *   description: 'Example description',
   *   logo: 'https://example.com/logo.png'
   * })
   * ```
   */
  set(url: string, data: V) {
    this.setFile({ [url]: data })
  }
}
