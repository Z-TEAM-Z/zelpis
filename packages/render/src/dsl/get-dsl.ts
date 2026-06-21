import type { DSL } from './define'

/**
 * 获取当前页面的 DSL（CSR）。
 * 读取 HTML 注入的 `window.$zelpis.hydrateData.dsl`。
 */
export function getDsl<T extends Record<string, any> = DSL>(): T {
  const dsl = window.$zelpis?.hydrateData?.dsl
  if (dsl !== undefined) {
    return dsl as T
  }
  throw new Error('DSL not found')
}
