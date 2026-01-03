import { isPureObject } from '@luckrya/utility'
import fs from 'node:fs'

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
 */
export default class LocalFileCache<V extends Record<string, unknown>> {
  constructor() {}

  private setFile(data: Record<string, V>) {
    let content = data
    const _content = this.readFile()
    if (_content) {
      content = Object.assign(_content, content)
    }
    fs.writeFileSync(CONFIG_FILE(), JSON.stringify(content))
    format()
  }

  private readFile(): Record<string, V> | undefined {
    const content = fs.readFileSync(CONFIG_FILE(), 'utf-8')
    const data = JSON.parse(content)
    if (isPureObject(data)) return data

    return undefined
  }

  has(url: string) {
    return !!this.get(url)
  }

  get(url: string) {
    const cache = this.readFile()
    return cache?.[url]
  }

  set(url: string, data: V) {
    this.setFile({ [url]: data })
  }
}
