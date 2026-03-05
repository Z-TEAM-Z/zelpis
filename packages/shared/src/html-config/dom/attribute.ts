import type { HTMLElement } from 'node-html-parser'

/**
 * 设置或更新元素属性
 */
export function setAttribute(element: HTMLElement, name: string, value: string): void {
  element.setAttribute(name, value)
}

/**
 * 获取元素属性
 */
export function getAttribute(element: HTMLElement, name: string): string | null {
  return element.getAttribute(name) ?? null
}

/**
 * 检查元素是否有指定属性
 */
export function hasAttribute(element: HTMLElement, name: string): boolean {
  return element.hasAttribute(name)
}

/**
 * 检查元素属性值是否匹配
 */
export function hasAttributeValue(
  element: HTMLElement,
  name: string,
  value: string,
): boolean {
  return element.getAttribute(name) === value
}
