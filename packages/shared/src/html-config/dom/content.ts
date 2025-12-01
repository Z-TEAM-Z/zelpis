import type { HTMLElement } from 'node-html-parser'
import type { HTMLRoot } from './parser'

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
 * 获取 script 元素的文本内容
 */
export function getScriptContent(script: HTMLElement): string {
  return script.textContent
}

/**
 * 设置 script 元素的文本内容
 */
export function setScriptContent(script: HTMLElement, content: string): void {
  script.textContent = content
}

/**
 * 检查文本是否包含指定模式
 */
export function containsPattern(text: string, pattern: string): boolean {
  return text.includes(pattern)
}

/**
 * 检查 HTML 是否包含危险模式
 */
export function containsDangerousPattern(html: string, pattern: RegExp): boolean {
  return pattern.test(html)
}
