function hyphenate(str: string): string {
  return str.replace(/\B([A-Z])/g, '-$1').toLowerCase()
}

function join(style: Record<string, string | number>) {
  return Object.entries(style)
    .map(([k, v]) => {
      if (k && v) return `${hyphenate(k)}: ${v};`
    })
    .filter(Boolean)
    .join(' ')
}

function inlineStyle(style: Record<string, string | number>) {
  return `style="${join(style)}"`
}

const ellipsisStyle = (line: number) => ({
  '-webkit-box-orient': 'vertical',
  '-webkit-line-clamp': line,
  display: '-webkit-box',
  hyphens: 'auto',
  lineClamp: line,
  overflow: 'hidden',
  overflowWrap: 'anywhere',
  textOverflow: 'ellipsis',
  wordBreak: 'break-word'
})

/**
 * Generates complete inline styles for all link card components.
 */
export const STYLE = () => ({
  a: inlineStyle({
    color: 'unset !important',
    display: 'block',
    width: '100%',
    textDecoration: 'none'
  }),
  container: inlineStyle({
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    borderRadius: '12px',
    border: `1px solid var(--vp-c-bg-soft)`,
    backgroundColor: `var(--vp-c-bg-soft)`,
    boxSizing: 'border-box',
    width: '100%',
    height: '130px',
    transition: 'border-color 0.25s, background-color 0.25s'
  }),
  img: inlineStyle({
    borderRadius: '0px 12px 12px 0px',
    maxWidth: '40%',
    height: '128px', // container.height - 2px
    flexShrink: 0,
    objectFit: 'contain',
    overflow: 'hidden'
  }),
  texts: inlineStyle({
    flex: '1 1 0%',
    minWidth: '0'
  }),
  title: inlineStyle({
    ...ellipsisStyle(2),
    opacity: 1,
    fontSize: '16px',
    lineHeight: '22px',
    margin: '0 16px 8px 16px',
    fontWeight: 'bold'
  }),
  domain: inlineStyle({
    ...ellipsisStyle(1),
    opacity: 1,
    fontSize: '12px',
    lineHeight: '16px',
    margin: '8px 16px 8px 16px',
    textDecoration: 'underline'
  }),
  description: inlineStyle({
    ...ellipsisStyle(2),
    opacity: 0.8,
    fontSize: '12px',
    lineHeight: '16px',
    margin: '8px 16px 0px 16px'
  })
})

export const classNames = (prefix?: string) => ({
  container: `${prefix}__container`,
  img: `${prefix}__img`,
  texts: `${prefix}__texts`,
  title: `${prefix}__texts--title`,
  domain: `${prefix}__texts--domain`,
  description: `${prefix}__texts--desc`
})
