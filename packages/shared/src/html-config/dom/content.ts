import type { HTMLElement } from 'node-html-parser'
import type { HTMLRoot } from './parser'
import { parse } from 'node-html-parser'
import { findElement } from './element'
import { parseHtml, serializeHtml } from './parser'

interface MetaOptions {
  name?: string
  property?: string
  httpEquiv?: string
  charset?: string
  content?: string
}

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
 * ⚠️ 仅在 html 完全可信时使用
 */
export function appendHtml(element: HTMLElement, html: string): void {
  element.innerHTML += html
}

/**
 * meta 标签，避免注入任意 HTML
 */
export function appendMeta(head: HTMLElement, options: MetaOptions): void {
  if (head.rawTagName !== 'head') {
    throw new Error('appendMeta 仅可操作 <head> 元素')
  }

  const meta = parse('<meta />').firstChild as HTMLElement

  const attributes: (keyof MetaOptions)[] = ['name', 'property', 'httpEquiv', 'charset', 'content']
  for (const key of attributes) {
    const value = options[key]
    if (value) {
      meta.setAttribute(key === 'httpEquiv' ? 'http-equiv' : key, value)
    }
  }

  head.appendChild(meta)
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
  const safeContent = sanitizeBodyContent(content)
  body.innerHTML = safeContent
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

/**
 * 处理 body 内容，仅允许 id、class、style、data-* 或其它必要属性，任何 on* 事件、javascript: 协议、srcdoc 等直接移除
 */
function sanitizeBodyContent(content: string): string {
  const ALLOWED_TAGS = new Set(['div', 'main', 'section', 'article', 'header', 'footer', 'p', 'span'])
  const ALLOWED_ATTRS = new Set(['id', 'class', 'style', 'data-*'])
  const fragment = parse(`<wrapper>${content}</wrapper>`)
  fragment.querySelectorAll('*').forEach((node) => {
    if (!ALLOWED_TAGS.has(node.rawTagName)) {
      node.remove()
      return
    }
    Object.keys(node.attributes).forEach((attr) => {
      const value = node.getAttribute(attr) ?? ''
      const allowed
        = ALLOWED_ATTRS.has(attr)
          || (attr.startsWith('data-') && ALLOWED_ATTRS.has('data-*'))
      if (
        !allowed
        || attr.startsWith('on')
        || value.trim().toLowerCase().startsWith('javascript:')
      ) {
        node.removeAttribute(attr)
      }
    })
  })
  const wrapper = fragment.firstChild as HTMLElement | null
  return wrapper ? wrapper.innerHTML : ''
}
