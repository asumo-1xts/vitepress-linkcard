/**
 * XHR module for fetching remote URL content.
 *
 * This module provides both synchronous and asynchronous HTTP GET request functionality
 * with built-in caching. It works in both browser and Node.js environments by using
 * the appropriate XMLHttpRequest implementation.
 *
 * @module xhr
 * @todo Replace xmlhttprequest with a modern alternative (e.g., node-fetch or axios)
 */

// Refactor: xmlhttprequest will be replaced later
// @ts-expect-error: xmlhttprequest has no types
import xhrForNode from 'xmlhttprequest'
import { inBrowser, isString } from '@luckrya/utility'

/**
 * In-memory cache for storing fetched HTML content by URL.
 * Prevents redundant network requests for the same URLs.
 * @internal
 */
const cache = new Map<string, string>()

/**
 * XMLHttpRequest implementation that works in both browser and Node.js.
 * @internal
 */
const XHR = inBrowser ? window.XMLHttpRequest : xhrForNode.XMLHttpRequest

/**
 * Performs a synchronous HTTP GET request to fetch HTML content from a URL.
 *
 * This function fetches the content synchronously, which means it blocks execution
 * until the request completes. The response is cached to avoid redundant requests.
 *
 * @param url - The URL to fetch content from
 * @returns The HTML content as a string, or undefined if the request fails
 *
 * @example
 * ```typescript
 * const html = sync('https://example.com')
 * if (html) {
 *   console.log('Fetched HTML content')
 * }
 * ```
 *
 * @remarks
 * - Returns cached content if available
 * - Only returns content if HTTP status is 200
 * - Errors are logged to console but not thrown
 * - Synchronous requests block the event loop - use with caution
 *
 * @see {@link async} for an asynchronous alternative
 */
export function sync(url: string) {
  if (cache.has(url)) return cache.get(url)
  let result: string | undefined

  try {
    const xhr = new XHR()
    xhr.open('GET', url, false)
    xhr.setRequestHeader('Content-Type', 'text/html')
    xhr.send()

    if (xhr.status === 200 && !!xhr.responseText) {
      result = xhr.responseText
      cache.set(url, xhr.responseText)
    }
  } catch (err) {
    console.error(
      `【XHR Error】：${err instanceof Error ? err.message : 'get remote URL resource exception!'}`
    )
  }

  return result
}

/**
 * Performs an asynchronous HTTP GET request to fetch HTML content from a URL.
 *
 * This function fetches content asynchronously using Promises. The response is
 * cached to avoid redundant requests.
 *
 * @param url - The URL to fetch content from
 * @returns A Promise that resolves to the HTML content string, or undefined if the request fails
 *
 * @example
 * ```typescript
 * async function fetchPage() {
 *   try {
 *     const html = await async('https://example.com')
 *     if (html) {
 *       console.log('Fetched HTML content')
 *     }
 *   } catch (error) {
 *     console.error('Failed to fetch:', error)
 *   }
 * }
 * ```
 *
 * @remarks
 * - Returns cached content if available
 * - Only resolves with content if HTTP status is 200 and readyState is 4
 * - Promise is rejected if the request throws an error
 * - Preferred over `sync()` for non-blocking operations
 *
 * @see {@link sync} for a synchronous alternative
 */
export function async(url: string): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    try {
      if (cache.has(url)) return resolve(cache.get(url))
      const xhr = new XHR()

      xhr.open('GET', url, false)
      xhr.setRequestHeader('Content-Type', 'text/html')
      xhr.onreadystatechange = function () {
        if (
          xhr.readyState === 4 &&
          xhr.status === 200 &&
          isString(xhr.responseText)
        ) {
          cache.set(url, xhr.responseText)
          resolve(xhr.responseText)
        }
      }
      xhr.send()
    } catch (err) {
      reject(err)
    }
  })
}
