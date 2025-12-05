import type { HTMLElement } from 'node-html-parser'
import type { HTMLRoot } from './parser'
import { findElement } from './element'
import { parseHtml, serializeHtml } from './parser'

/**
 * 设置元素的文本内容
 */
export function setTextContent(element: HTMLElement, text: string): void {
  element.textContent = text
}

/**
 * 获取元素的文本内容
 */
export function getTextContent(element: HTMLElement): string {
  return element.textContent
}

/**
 * 追加 HTML 内容到元素
 */
export function appendHtml(element: HTMLElement, html: string): void {
  element.innerHTML += html
}

/**
 * 在指定元素前插入注释
 */
export function insertCommentBefore(
  parent: HTMLElement,
  targetTag: string,
  comment: string,
): boolean {
  const target = parent.querySelector(targetTag)
  if (target) {
    target.insertAdjacentHTML('beforebegin', `<!-- ${comment} -->`)
    return true
  }
  return false
}

/**
 * 替换 body 内容
 */
export function replaceBodyContent(root: HTMLRoot, content: string): void {
  const body = root.querySelector('body')
  if (!body) {
    throw new Error('Body element not found')
  }
  body.innerHTML = content
}

/**
 * 查找所有 script 元素
 */
export function findScripts(
  root: HTMLRoot,
  predicate?: (script: HTMLElement) => boolean,
): HTMLElement[] {
  const scripts = root.querySelectorAll('script')
  return predicate ? scripts.filter(predicate) : scripts
}

/**
 * 移除空的 app 容器
 */
export function removeEmptyAppContainer(html: string): string {
  const document = parseHtml(html)
  const app = findElement(document, '#app')
  if (app && app.childNodes.length === 0 && (app.textContent ?? '').trim() === '') {
    app.remove()
  }
  return serializeHtml(document)
}
