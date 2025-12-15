import type { HTMLRoot } from '../dom'
import type { ResolveHtmlContext } from '../types'
import { parseHtml, serializeHtml } from '../dom'
import { ZELPIS_DATA_ATTR } from './placeholders'

/**
 * DOM 版本：清理注入脚本，直接操作已有 DOM，避免重复解析
 */
export function cleanAppInjectScriptDom(root: HTMLRoot, context?: ResolveHtmlContext): void {
  root.querySelectorAll(`script[${ZELPIS_DATA_ATTR}]`).forEach(el => el.remove())

  if (context?.entryPath) {
    root
      .querySelectorAll(`script[type="module"][src="${context.entryPath}"]`)
      .forEach(el => el.remove())
  }
}

/**
 * 兼容字符串入口：如需字符串输入则内部解析一次
 */
export function cleanAppInjectScript(html: string, context?: ResolveHtmlContext): string {
  const root = parseHtml(html)
  cleanAppInjectScriptDom(root, context)
  return serializeHtml(root)
}
