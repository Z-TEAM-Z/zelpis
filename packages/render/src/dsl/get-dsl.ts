import type { DSL } from './define'

/**
 * 获取当前页面的 DSL（CSR）。
 * 读取 HTML 注入的 `window.$zelpis.hydrateData.dsl`。
 */
export function getDsl<T extends Record<string, any> = DSL>(): T {
  if (typeof window === 'undefined') {
    throw new Error('仅支持在浏览器环境中使用')
  }
  const dsl = window.$zelpis?.hydrateData?.dsl
  if (dsl !== undefined) {
    return dsl as T
  }
  throw new Error('DSL not found')
}
