// @ts-expect-error: xmlhttprequest has no types
import xhrForNode from 'xmlhttprequest'
import { inBrowser, isString } from '@luckrya/utility'

const cache = new Map<string, string>()

const XHR = inBrowser ? window.XMLHttpRequest : xhrForNode.XMLHttpRequest

/**
 * Performs a synchronous HTTP GET request to fetch HTML content from a URL.
 *
 * @param url - The URL to fetch content from
 * @returns The HTML content as a string, or undefined if the request fails
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
 * @param url - The URL to fetch content from
 * @returns A Promise that resolves to the HTML content string
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
