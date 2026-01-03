import type { UrlMetadata } from '../types'
import { isString } from '@luckrya/utility'
import { cleanPath, extractUrl } from './url'

const DEFAULT_LOGO = 'https://resources.whatwg.org/logo-url.svg'

const HtmlTagContentReg = /(<[A-Za-z]+\s*[^>]*>(.*)<\/[A-Za-z]+>)/
const ContentAttrValueHtmlMetaTagReg = /content=["|']([^>]*)["|']/
const HrefAttrValueHtmlLinkTagReg = /href=["|']([^>]*)["|']/
const HtmlTitleTagReg = /(<title\s*[^>]*>(.*)<\/title>)/g

const containArrSelfLosingHtmlTagReg = (attr: string, tag = 'meta') =>
  new RegExp(`<${tag}\\s[^>]*\\w+=['|"]([a-zA-Z]|:|\\s)*${attr}['|"][^>]*\\/?>`)

function matchTitleByMetaTag(htmlString: string) {
  let title: string | undefined
  const metas = htmlString.match(containArrSelfLosingHtmlTagReg('title'))

  if (metas?.length) {
    const content = metas[0].match(ContentAttrValueHtmlMetaTagReg)
    if (content && isString(content[1])) title = content[1]
  } else {
    const titleHtmlTag = htmlString.match(HtmlTitleTagReg)

    if (titleHtmlTag?.length) {
      const content = titleHtmlTag[0].match(HtmlTagContentReg)
      if (content && isString(content[2])) title = content[2]
    }
  }

  return title
}

function matchDescriptionByMetaTag(htmlString: string) {
  let description: string | undefined
  const metas = htmlString.match(containArrSelfLosingHtmlTagReg('description'))

  if (metas?.length) {
    const content = metas[0].match(ContentAttrValueHtmlMetaTagReg)
    if (content && isString(content[1])) description = content[1]
  }
  return description
}

function matchLogoByLinkOrMetaTag(htmlString: string) {
  let logo: string | undefined
  const metas = htmlString.match(containArrSelfLosingHtmlTagReg('image'))

  if (metas?.length) {
    const content = metas[0].match(ContentAttrValueHtmlMetaTagReg)
    if (content && isString(content[1])) logo = content[1]
  } else {
    const linkHtmlTags = htmlString.match(
      containArrSelfLosingHtmlTagReg('icon', 'link')
    )

    if (linkHtmlTags?.length) {
      const content = linkHtmlTags[0].match(HrefAttrValueHtmlLinkTagReg)
      if (content && isString(content[1])) logo = content[1]
    }
  }

  return logo
}

/**
 * Parses HTML string to extract structured metadata for link card generation.
 *
 * @param htmlString - The HTML content to parse
 * @param url - The URL of the page
 * @returns Parsed metadata object, or null if no valid metadata found
 */
export function parserMetadata(
  htmlString: string,
  url: string
): UrlMetadata | null {
  function absolute(logo?: string) {
    if (!logo) return DEFAULT_LOGO
    return extractUrl(logo)
      ? logo
      : `${extractUrl(url)?.origin}${cleanPath(`/${logo}`)}`
  }

  const metadata = {
    title: matchTitleByMetaTag(htmlString),
    description: matchDescriptionByMetaTag(htmlString),
    logo: absolute(matchLogoByLinkOrMetaTag(htmlString))
  }

  if (isEmptyStringObject(metadata)) return null
  else return metadata
}

function isEmptyStringObject(obj: Record<string, string | undefined>) {
  return !Object.values(obj).filter((v) => isString(v)).length
}
