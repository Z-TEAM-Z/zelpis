import type { HTMLElement } from 'node-html-parser'
import type { HTMLRoot } from './parser'
import { parse } from 'node-html-parser'

/**
 * 查找元素
 */
export function findElement(
  parent: HTMLRoot | HTMLElement,
  tagName: string,
): HTMLElement | null {
  return parent.querySelector(tagName)
}

/**
 * 查找所有元素
 */
export function findAllElements(
  parent: HTMLRoot | HTMLElement,
  tagName: string,
): HTMLElement[] {
  return parent.querySelectorAll(tagName)
}

/**
 * 查找 meta 元素
 */
export function findMetaByName(root: HTMLRoot, name: string): HTMLElement | null {
  return root.querySelector(`meta[name="${name}"]`)
}

/**
 * 获取或创建元素
 */
export function getOrCreateElement(
  root: HTMLRoot,
  parentTag: string,
  childTag: string,
): HTMLElement {
  const parent = root.querySelector(parentTag)
  if (!parent) {
    throw new Error(`Parent element <${parentTag}> not found`)
  }

  let child = parent.querySelector(childTag)
  if (!child) {
    child = parse(`<${childTag}></${childTag}>`).firstChild as HTMLElement
    parent.appendChild(child)
  }

  return child
}

/**
 * 删除元素
 */
export function removeElement(parent: HTMLRoot | HTMLElement, element: HTMLElement): boolean {
  element.remove()
  return true
}

/**
 * 删除所有元素
 */
export function removeElements(
  root: HTMLRoot,
  tagName: string,
  predicate: (element: HTMLElement) => boolean,
): number {
  const elements = root.querySelectorAll(tagName)
  let removed = 0

  elements.forEach((element) => {
    if (predicate(element)) {
      element.remove()
      removed++
    }
  })

  return removed
}
