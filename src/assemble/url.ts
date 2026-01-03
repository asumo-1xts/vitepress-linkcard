/**
 * Parses a URL string and returns a URL object.
 *
 * @param url - The URL string to parse
 * @returns A URL object containing the parsed components
 */
export function extractUrl(url: string) {
  return new URL(url)
}

/**
 * Removes duplicate consecutive slashes from a path string.
 *
 * @param path - The path string to clean
 * @returns The cleaned path with no consecutive slashes
 */
export function cleanPath(path: string) {
  return path.replace(/\/\//g, '/')
}
