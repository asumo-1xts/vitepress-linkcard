/**
 * TODO: Refactor
 */

import type { UrlMetadata } from '../types'
import { isString } from '@luckrya/utility'
import { cleanPath, extractUrl } from './url'

const DEFAULT_LOGO = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23f0f0f0"/%3E%3Ctext x="100" y="100" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="20" fill="%23999"%3ENO IMAGE%3C/text%3E%3C/svg%3E'
const HtmlTagContentReg = /(<[A-Za-z]+\s*[^>]*>(.*)<\/[A-Za-z]+>)/
const ContentAttrValueHtmlMetaTagReg = /content=["|']([^>]*)["|']/
const HrefAttrValueHtmlLinkTagReg = /href=["|']([^>]*)["|']/
const HtmlTitleTagReg = /(<title\s*[^>]*>(.*)<\/title>)/g
// const HtmlMetaTagReg = /<meta\s[^>]*\/?>/g;
// const HtmlLinkTagReg = /<link\s[^>]*\/?>/g;
const containArrSelfLosingHtmlTagReg = (attr: string, tag = 'meta') =>
  new RegExp(`<${tag}\\s[^>]*\\w+=['|"]([a-zA-Z]|:|\\s)*${attr}['|"][^>]*\\/?>`)

/**
 * @param htmlString
 * @returns
 *   <title>$value</title>
 *   <meta property="og:title" content="$value" />
 *   <link data-react-helmet="true" href="https://s.xml" rel="search" title="$value" type="applon+xml">
 */
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

/**
 * @returns
 *   <meta name="description" content="$value" />
 *   <meta property="og:description" content="$value" />
 */
function matchDescriptionByMetaTag(htmlString: string) {
  let description: string | undefined
  const metas = htmlString.match(containArrSelfLosingHtmlTagReg('description'))

  if (metas?.length) {
    const content = metas[0].match(ContentAttrValueHtmlMetaTagReg)
    if (content && isString(content[1])) description = content[1]
  }
  return description
}

/**
 * @returns
 *   <meta property="og:image" content="$value" />
 *   <link rel="icon" href="$value">
 */
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
      // logo 判断是否是完整地址
      if (content && isString(content[1])) logo = content[1]
    }
  }

  return logo
}

/**
 * @param htmlString
 * @param url
 * @returns
 */
export function parserMetadata(
  htmlString: string,
  url: string
): UrlMetadata | null {
  function absolute(logo?: string) {
    if (!logo) return DEFAULT_LOGO
    return extractUrl(logo)
      ? logo
      : `${extractUrl(url)?.origin}${cleanPath(`/${logo}`)}` // TODO: no match "content='//img.xx.com/a.png'"
  }

  const metadata = {
    title: matchTitleByMetaTag(htmlString),
    description: matchDescriptionByMetaTag(htmlString),
    logo: absolute(matchLogoByLinkOrMetaTag(htmlString))
  }

  if (isEmptyStringObject(metadata)) return null
  else return metadata
}

/**
 * @param obj
 * @returns
 */
function isEmptyStringObject(obj: Record<string, string | undefined>) {
  return !Object.values(obj).filter((v) => isString(v)).length
}
