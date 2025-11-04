/**
 * @param url
 * @returns
 */
export function extractUrl(url: string) {
  return new URL(url);
}

/**
 * @param path
 * @returns
 */
export function cleanPath(path: string) {
  return path.replace(/\/\//g, "/");
}
