import type { DefaultTreeAdapterMap } from 'parse5'
import type { HtmlValidationLevel, HtmlValidationResult } from './types'
import { parse, serialize } from 'parse5'
import { dedent } from 'ts-dedent'

type Element = DefaultTreeAdapterMap['element']
type Document = DefaultTreeAdapterMap['document']

// 标注占位符，用于预定义占位符
export const STANDARD_PLACEHOLDERS = {
  APP_BODY_START: createPlaceholder('app-body-start'),
  APP_INJECT_SCRIPT: createPlaceholder('app-inject-script'),
} as const

/**
 * 创建占位符
 * @param name 占位符名称
 */
function createPlaceholder(name: string): string {
  return `<!-- zelpis:${name} -->`
}

/**
 * STANDARD_PLACEHOLDERS.APP_INJECT_SCRIPT的清理方法
 */
export function cleanAppInjectScript(html: string, context?: Record<string, any>): string {
  try {
    const document = parseHtml(html)

    // 1. 清理带 data-zelpis-inject 标记的脚本
    removeElements(document, 'script', (script) => {
      return hasAttribute(script, 'data-zelpis-inject')
    })

    // 2. 清理指向 entryPath 的 module 脚本
    if (context?.entryPath) {
      const entryPath = context.entryPath
      removeElements(document, 'script', (script) => {
        const type = getAttribute(script, 'type')
        const src = getAttribute(script, 'src')
        return type === 'module' && src === entryPath
      })
    }

    return serializeHtml(document)
  }
  catch {
    // 如果 DOM 解析失败，降级使用正则（兜底方案）
    console.warn('[Zelpis] DOM parsing failed in cleanAppInjectScript, using fallback regex')
    return cleanAppInjectScriptFallback(html, context)
  }
}

/**
 * 降级方案：使用正则清理（仅作为兜底）
 */
function cleanAppInjectScriptFallback(html: string, context?: Record<string, any>): string {
  let result = html

  result = result.replace(
    /<script[^>]*data-zelpis-inject[^>]*>[\s\S]*?<\/script>/gi,
    '',
  )

  if (context?.entryPath) {
    const entryPath = context.entryPath
    const escapedPath = entryPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const pattern = new RegExp(
      `<script[^>]*type=["']module["'][^>]*src=["']${escapedPath}["'][^>]*><\\/script>`,
      'gi',
    )
    result = result.replace(pattern, '')
  }

  return result
}

/**
 * 安全地序列化 JSON 用于内联 script 标签
 * 防止 </script>、<!-- 等字符破坏 HTML 结构导致 XSS
 */
function safeJsonStringify(data: any): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c') // < -> \u003c (防止 </script>)
    .replace(/>/g, '\\u003e') // > -> \u003e (防止 -->)
    .replace(/\u2028/g, '\\u2028') // Line separator
    .replace(/\u2029/g, '\\u2029') // Paragraph separator
}

/**
 * 注入STANDARD_PLACEHOLDERS的内容
 */
export function getInjectScript(entryPath: string, { props }: any): string {
  return dedent`
    <script type="module" defer src="${entryPath}" data-zelpis-inject="entry"></script>
    <script data-zelpis-inject="hydrate">
      window.$zelpis = {hydrateData:${safeJsonStringify(props)}};
    </script>
  `
}

/**
 * 智能合并STANDARD_PLACEHOLDERS的内容
 */
export function smartMergePlaceholders(
  replacement: string,
  result: string,
  placeholder: string,
): string {
  try {
    // 解析 replacement 和 result
    const replacementDoc = parseHtml(`<body>${replacement}</body>`)
    const resultDoc = parseHtml(result)

    // 从 replacement 中提取 module script 和 hydrate script
    const replacementScripts = findScripts(replacementDoc)
    const moduleScript = replacementScripts.find(s =>
      hasAttributeValue(s, 'data-zelpis-inject', 'entry'),
    )
    const hydrateScript = replacementScripts.find(s =>
      hasAttributeValue(s, 'data-zelpis-inject', 'hydrate'),
    )

    if (!moduleScript || !hydrateScript) {
      // 解析失败，使用字符串替换
      return result.replace(placeholder, replacement)
    }

    const hydrateCode = getScriptContent(hydrateScript).trim()

    // 查找 result 中已存在的内联 script（非 module，非 zelpis 注入的）
    const resultScripts = findScripts(resultDoc, (script) => {
      const type = getAttribute(script, 'type')
      const hasZelpisInject = hasAttribute(script, 'data-zelpis-inject')
      return type !== 'module' && !hasZelpisInject
    })

    if (resultScripts.length > 0) {
      // 合并到第一个已有的内联 script
      const existingScript = resultScripts[0]
      const content = getScriptContent(existingScript)

      // 查找并替换 window.$zelpis 赋值
      const zelpisMatch = matchZelpisAssignment(content)
      if (zelpisMatch) {
        const before = content.substring(0, zelpisMatch.start)
        const after = content.substring(zelpisMatch.end)
        setScriptContent(existingScript, before + hydrateCode + after)
      }
      else {
        setScriptContent(existingScript, `\n  ${hydrateCode}\n${content}`)
      }

      // 序列化并只插入 module script
      const moduleScriptHtml = serializeHtml(
        parseHtml(`<body>${serializeHtml(replacementDoc)}</body>`),
      ).match(/<script[^>]*data-zelpis-inject="entry"[^>]*><\/script>/i)?.[0] || ''

      return serializeHtml(resultDoc).replace(placeholder, moduleScriptHtml)
    }

    // 没有已有 script，完整插入
    return serializeHtml(resultDoc).replace(placeholder, replacement)
  }
  catch {
    // DOM 解析失败，降级使用正则
    console.warn('[Zelpis] DOM parsing failed in smartMergePlaceholders, using fallback regex')
    return smartMergePlaceholdersFallback(replacement, result, placeholder)
  }
}

/**
 * 降级方案：使用正则合并（仅作为兜底）
 */
function smartMergePlaceholdersFallback(
  replacement: string,
  result: string,
  placeholder: string,
): string {
  const moduleMatch = replacement.match(/<script[^>]*data-zelpis-inject="entry"[^>]*><\/script>/i)
  const hydrateMatch = replacement.match(/<script[^>]*data-zelpis-inject="hydrate"[^>]*>([\s\S]*?)<\/script>/i)

  if (moduleMatch && hydrateMatch) {
    const moduleScript = moduleMatch[0]
    const hydrateCode = hydrateMatch[1].trim()

    const existingScriptRegex = /<script(?![^>]*type=["']module["'])(?![^>]*data-zelpis-)([^>]*)>([\s\S]*?)<\/script>/i
    const hasExistingScript = existingScriptRegex.test(result)

    if (hasExistingScript) {
      let merged = false
      result = result.replace(
        existingScriptRegex,
        (match, attrs, content) => {
          if (!merged) {
            merged = true

            const zelpisMatch = matchZelpisAssignment(content)
            if (zelpisMatch) {
              const before = content.substring(0, zelpisMatch.start)
              const after = content.substring(zelpisMatch.end)
              const newContent = before + hydrateCode.trim() + after
              return `<script${attrs}>${newContent}</script>`
            }
            else {
              return `<script${attrs}>\n  ${hydrateCode}\n${content}</script>`
            }
          }
          return match
        },
      )
      result = result.replace(placeholder, moduleScript)
    }
    else {
      result = result.replace(placeholder, replacement)
    }
  }
  else {
    result = result.replace(placeholder, replacement)
  }
  return result
}

/**
 * 智能匹配平衡的 window.$zelpis 赋值语句
 * 注意：这个函数处理的是纯文本内容，不适合用 DOM 操作，保持原样
 */
function matchZelpisAssignment(content: string): { matched: string, start: number, end: number } | null {
  const pattern = /window\.\$zelpis\s*=\s*\{/
  const match = pattern.exec(content)
  if (!match)
    return null

  const startIndex = match.index
  let braceCount = 1
  let i = match.index + match[0].length

  while (i < content.length && braceCount > 0) {
    if (content[i] === '{')
      braceCount++
    else if (content[i] === '}')
      braceCount--
    i++
  }

  if (braceCount === 0) {
    while (i < content.length && /[\s;]/.test(content[i])) {
      if (content[i] === ';') {
        i++
        break
      }
      i++
    }
    return {
      matched: content.substring(startIndex, i),
      start: startIndex,
      end: i,
    }
  }

  return null
}

/**
 * 验证自定义 HTML 的合法性（使用 parse5）
 */
export function validateHtmlTemplate(html: string): HtmlValidationResult {
  const warnings: string[] = []
  const errors: string[] = []

  // 1. 基本检查：是否为空
  if (!html || html.trim().length === 0) {
    errors.push('HTML is empty')
    return { valid: false, warnings, errors }
  }

  // 2. 使用 parse5 解析 HTML
  let document: DefaultTreeAdapterMap['document']
  try {
    document = parse(html, {
      sourceCodeLocationInfo: true,
      onParseError: (error) => {
        warnings.push(`HTML syntax: ${error.code} at line ${error.startLine}`)
      },
    })
  }
  catch (error) {
    errors.push(`Failed to parse HTML: ${error instanceof Error ? error.message : String(error)}`)
    return { valid: false, warnings, errors }
  }

  // 3. 检查 DOCTYPE
  const hasDoctype = document.childNodes.some(
    node => node.nodeName === '#documentType',
  )
  if (!hasDoctype) {
    warnings.push('Missing DOCTYPE declaration (recommended: <!DOCTYPE html>)')
  }

  // 4. 查找 html 节点
  const htmlNode = document.childNodes.find(
    (node): node is DefaultTreeAdapterMap['element'] =>
      'tagName' in node && node.tagName === 'html',
  )

  if (!htmlNode) {
    errors.push('Missing <html> tag')
    return { valid: false, warnings, errors }
  }

  // 5. 检查 head 和 body
  const headNode = htmlNode.childNodes.find(
    (node): node is DefaultTreeAdapterMap['element'] =>
      'tagName' in node && node.tagName === 'head',
  )
  const bodyNode = htmlNode.childNodes.find(
    (node): node is DefaultTreeAdapterMap['element'] =>
      'tagName' in node && node.tagName === 'body',
  )

  if (!headNode) {
    errors.push('Missing <head> tag')
  }

  if (!bodyNode) {
    errors.push('Missing <body> tag')
  }

  // 6. 检查 head 内的基本 meta 标签（建议性）
  if (headNode) {
    const headChildren = headNode.childNodes.filter(
      (node): node is DefaultTreeAdapterMap['element'] => 'tagName' in node,
    )

    const hasCharset = headChildren.some((node) => {
      if (node.tagName === 'meta') {
        return node.attrs.some(attr => attr.name === 'charset')
      }
      return false
    })

    if (!hasCharset) {
      warnings.push('Missing charset meta tag (recommended: <meta charset="UTF-8">)')
    }

    const hasViewport = headChildren.some((node) => {
      if (node.tagName === 'meta') {
        return node.attrs.some(attr => attr.name === 'name' && attr.value === 'viewport')
      }
      return false
    })

    if (!hasViewport) {
      warnings.push('Missing viewport meta tag (recommended for responsive design)')
    }

    const hasTitle = headChildren.some(node => node.tagName === 'title')
    if (!hasTitle) {
      warnings.push('Missing <title> tag')
    }
  }

  // 7. 检查危险内容（安全性）
  if (/javascript:\s*void/i.test(html)) {
    warnings.push('Potentially unsafe "javascript:void" pattern detected')
  }

  if (/<script[^>]*>[\s\S]*?eval\s*\(/i.test(html)) {
    warnings.push('Potentially unsafe "eval()" call detected in script')
  }

  // 8. 检查标签嵌套顺序（head 应该在 body 前面）
  if (htmlNode && headNode && bodyNode) {
    const htmlChildren = Array.from(htmlNode.childNodes)
    const headIndex = htmlChildren.findIndex(node =>
      'tagName' in node && node.tagName === 'head',
    )
    const bodyIndex = htmlChildren.findIndex(node =>
      'tagName' in node && node.tagName === 'body',
    )

    if (headIndex !== -1 && bodyIndex !== -1 && headIndex > bodyIndex) {
      warnings.push('<head> tag should come before <body> tag')
    }
  }

  // 判断是否有致命错误
  const hasCriticalErrors = errors.length > 0

  return {
    valid: !hasCriticalErrors,
    warnings,
    errors,
  }
}

/**
 * 格式化校验结果为控制台输出
 */
export function formatValidationOutput(result: HtmlValidationResult, level: HtmlValidationLevel): void {
  if (result.errors.length > 0) {
    console.error(
      `\x1B[31m[Zelpis] Custom HTML validation errors:\x1B[0m\n${
        result.errors.map(e => `  ❌ ${e}`).join('\n')}`,
    )
  }

  if (result.warnings.length > 0) {
    console.warn(
      `\x1B[33m[Zelpis] Custom HTML validation warnings:\x1B[0m\n${
        result.warnings.map(w => `  ⚠️  ${w}`).join('\n')}`,
    )
  }

  if (level === 'strict' && !result.valid) {
    console.error(
      `\x1B[31m[Zelpis] Custom HTML has critical issues. `
      + `Please fix the errors above or use template/meta/head/body configuration instead.\x1B[0m`,
    )
  }
}

/**
 * 解析 HTML 字符串为 DOM
 */
export function parseHtml(html: string): Document {
  return parse(html)
}

/**
 * 将 DOM 序列化为 HTML 字符串
 */
export function serializeHtml(document: Document): string {
  return serialize(document)
}

/**
 * 查找指定标签名的元素
 */
export function findElement(
  parent: Document | Element,
  tagName: string,
): Element | null {
  const nodes = 'childNodes' in parent ? parent.childNodes : []

  for (const node of nodes) {
    if ('tagName' in node && node.tagName === tagName) {
      return node as Element
    }
    // 递归查找
    if ('childNodes' in node) {
      const found = findElement(node as Element, tagName)
      if (found)
        return found
    }
  }

  return null
}

/**
 * 获取或创建元素
 */
export function getOrCreateElement(
  document: Document,
  parentTag: string,
  childTag: string,
): Element {
  const parent = findElement(document, parentTag)
  if (!parent) {
    throw new Error(`Parent element <${parentTag}> not found`)
  }

  let child = findElement(parent, childTag)
  if (!child) {
    child = {
      nodeName: childTag,
      tagName: childTag,
      attrs: [],
      namespaceURI: 'http://www.w3.org/1999/xhtml',
      childNodes: [],
      parentNode: parent,
    } as Element
    parent.childNodes.push(child)
  }

  return child
}

/**
 * 设置元素的文本内容
 */
export function setTextContent(element: Element, text: string): void {
  element.childNodes = [{
    nodeName: '#text',
    value: text,
    parentNode: element,
  }]
}

/**
 * 获取元素的文本内容
 */
export function getTextContent(element: Element): string {
  return element.childNodes
    .filter(node => node.nodeName === '#text')
    .map(node => ('value' in node ? node.value : ''))
    .join('')
}

/**
 * 设置或更新元素属性
 */
export function setAttribute(element: Element, name: string, value: string): void {
  const existing = element.attrs.find(attr => attr.name === name)
  if (existing) {
    existing.value = value
  }
  else {
    element.attrs.push({ name, value })
  }
}

/**
 * 获取元素属性
 */
export function getAttribute(element: Element, name: string): string | null {
  const attr = element.attrs.find(a => a.name === name)
  return attr ? attr.value : null
}

/**
 * 查找所有匹配的元素
 */
export function findAllElements(
  parent: Document | Element,
  tagName: string,
): Element[] {
  const results: Element[] = []
  const nodes = 'childNodes' in parent ? parent.childNodes : []

  for (const node of nodes) {
    if ('tagName' in node && node.tagName === tagName) {
      results.push(node as Element)
    }
    if ('childNodes' in node) {
      results.push(...findAllElements(node as Element, tagName))
    }
  }

  return results
}

/**
 * 查找符合条件的 meta 标签
 */
export function findMetaByName(document: Document, name: string): Element | null {
  const metas = findAllElements(document, 'meta')
  return metas.find(meta => getAttribute(meta, 'name') === name) || null
}

/**
 * 在指定元素末尾插入 HTML 字符串
 */
export function appendHtml(element: Element, html: string): void {
  // 解析 HTML 片段
  const fragment = parse(`<div>${html}</div>`)
  const wrapper = findElement(fragment, 'div')

  if (wrapper) {
    for (const child of wrapper.childNodes) {
      if ('parentNode' in child) {
        child.parentNode = element
      }
      element.childNodes.push(child)
    }
  }
}

/**
 * 在指定元素前插入注释节点（用于占位符）
 */
export function insertCommentBefore(
  parent: Element,
  targetTag: string,
  comment: string,
): boolean {
  const index = parent.childNodes.findIndex(
    node => 'tagName' in node && node.tagName === targetTag,
  )

  if (index !== -1) {
    parent.childNodes.splice(index, 0, {
      nodeName: '#comment',
      data: comment,
      parentNode: parent,
    })
    return true
  }

  return false
}

/**
 * 替换元素的 body 内容
 */
export function replaceBodyContent(document: Document, content: string): void {
  const body = findElement(document, 'body')
  if (!body) {
    throw new Error('Body element not found')
  }

  // 清空现有内容
  body.childNodes = []

  // 插入新内容
  appendHtml(body, content)
}

/**
 * 查找所有符合条件的 script 标签
 */
export function findScripts(
  document: Document,
  predicate?: (script: Element) => boolean,
): Element[] {
  const scripts = findAllElements(document, 'script')
  return predicate ? scripts.filter(predicate) : scripts
}

/**
 * 检查 script 是否有指定属性
 */
export function hasAttribute(element: Element, name: string): boolean {
  return element.attrs.some(attr => attr.name === name)
}

/**
 * 检查 script 属性值是否匹配
 */
export function hasAttributeValue(
  element: Element,
  name: string,
  value: string,
): boolean {
  const attr = element.attrs.find(a => a.name === name)
  return attr ? attr.value === value : false
}

/**
 * 移除指定的元素
 */
export function removeElement(parent: Document | Element, element: Element): boolean {
  const nodes = 'childNodes' in parent ? parent.childNodes : []
  const index = nodes.indexOf(element)

  if (index !== -1) {
    nodes.splice(index, 1)
    return true
  }

  // 递归查找并移除
  for (const node of nodes) {
    if ('childNodes' in node) {
      if (removeElement(node as Element, element)) {
        return true
      }
    }
  }

  return false
}

/**
 * 批量移除符合条件的元素
 */
export function removeElements(
  document: Document,
  tagName: string,
  predicate: (element: Element) => boolean,
): number {
  const elements = findAllElements(document, tagName)
  let removed = 0

  for (const element of elements) {
    if (predicate(element)) {
      if (element.parentNode && 'childNodes' in element.parentNode) {
        const parent = element.parentNode as Element | Document
        const index = parent.childNodes.indexOf(element)
        if (index !== -1) {
          parent.childNodes.splice(index, 1)
          removed++
        }
      }
    }
  }

  return removed
}

/**
 * 获取所有 script 标签的文本内容
 */
export function getScriptContent(script: Element): string {
  return script.childNodes
    .filter(node => node.nodeName === '#text')
    .map(node => ('value' in node ? node.value : ''))
    .join('')
}

/**
 * 设置 script 标签的文本内容
 */
export function setScriptContent(script: Element, content: string): void {
  script.childNodes = [{
    nodeName: '#text',
    value: content,
    parentNode: script,
  }]
}

/**
 * 检查文本内容中是否包含指定模式
 */
export function containsPattern(text: string, pattern: string): boolean {
  return text.includes(pattern)
}

/**
 * 检查 HTML 中是否包含危险模式（用于安全检查）
 */
export function containsDangerousPattern(html: string, pattern: RegExp): boolean {
  return pattern.test(html)
}
