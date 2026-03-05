import { parse } from 'node-html-parser'

export type HTMLRoot = ReturnType<typeof parse>

/**
 * 解析 HTML
 */
export function parseHtml(html: string): HTMLRoot {
  return parse(html, {
    comment: true,
    blockTextElements: {
      script: true,
      style: true,
    },
  })
}

/**
 * 序列化 HTML
 */
export function serializeHtml(root: HTMLRoot): string {
  return root.toString()
}
