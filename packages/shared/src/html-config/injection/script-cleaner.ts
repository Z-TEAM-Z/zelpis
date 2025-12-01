import type { ResolveHtmlContext } from '../types'
import { parseHtml } from '../dom'
import { ZELPIS_DATA_ATTR } from './placeholders'

export function cleanAppInjectScript(html: string, context?: ResolveHtmlContext): string {
  const root = parseHtml(html)

  root.querySelectorAll(`script[${ZELPIS_DATA_ATTR}]`).forEach(el => el.remove())

  if (context?.entryPath) {
    root.querySelectorAll(`script[type="module"][src="${context.entryPath}"]`)
      .forEach(el => el.remove())
  }

  return root.toString()
}
