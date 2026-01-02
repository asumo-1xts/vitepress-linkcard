/**
 * URL utility functions for parsing and manipulating URLs.
 *
 * @module url
 */

/**
 * Parses a URL string and returns a URL object.
 *
 * This is a wrapper around the native URL constructor that provides
 * a consistent interface for URL parsing throughout the codebase.
 *
 * @param url - The URL string to parse
 * @returns A URL object containing the parsed components
 * @throws {TypeError} If the URL string is invalid
 *
 * @example
 * ```typescript
 * const urlObj = extractUrl('https://example.com/path')
 * console.log(urlObj.origin) // "https://example.com"
 * console.log(urlObj.pathname) // "/path"
 * ```
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/URL | MDN - URL}
 */
export function extractUrl(url: string) {
  return new URL(url)
}

/**
 * Removes duplicate consecutive slashes from a path string.
 *
 * This function normalizes paths by replacing multiple consecutive slashes
 * with a single slash. Useful for constructing clean URLs from path segments.
 *
 * @param path - The path string to clean
 * @returns The cleaned path with no consecutive slashes
 *
 * @example
 * ```typescript
 * cleanPath('/path//to///file')  // Returns: '/path/to/file'
 * cleanPath('//images//logo.png') // Returns: '/images/logo.png'
 * ```
 */
export function cleanPath(path: string) {
  return path.replace(/\/\//g, '/')
}
