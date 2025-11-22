import type { DefaultTreeAdapterMap } from 'parse5'
import type { HtmlValidationLevel, HtmlValidationResult } from './types'
import { parse } from 'parse5'
import { dedent } from 'ts-dedent'
import * as constants from './constants'

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
  let result = html

  // 1. 清理带标记的（旧的 Zelpis 注入）
  result = result.replace(
    /<script[^>]*data-zelpis-inject[^>]*>[\s\S]*?<\/script>/gi,
    '',
  )

  // 2. 清理指向 entryPath 的 module 脚本（原来的入口，不带标记）
  if (context?.entryPath) {
    const entryPath = context.entryPath
    // 转义特殊字符
    const escapedPath = entryPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const pattern = new RegExp(
      `<script[^>]*type=["']module["'][^>]*src=["']${escapedPath}["'][^>]*><\\/script>`,
      'gi',
    )
    result = result.replace(pattern, '')
  }

  // 3. 清理包含 window.$zelpis 的脚本（不带标记的）
  // result = result.replace(
  //   /<script(?![^>]*data-zelpis-)[^>]*>[\s\S]*?window\.\$zelpis[\s\S]*?<\/script>/gi,
  //   '',
  // )

  return result
}

/**
 * 注入STANDARD_PLACEHOLDERS的内容
 */
export function getInjectScript(entryPath: string, { props }: any): string {
  return dedent`
    <script type="module" defer src="${entryPath}" data-zelpis-inject="entry"></script>
    <script data-zelpis-inject="hydrate">
      window.$zelpis = {hydrateData:${JSON.stringify(props)}};
    </script>
  `
}

/**
 * 智能合并STANDARD_PLACEHOLDERS的内容
 */
export function smartMergePlaceholders(replacement: string, result: string, placeholder: string): string {
  // 解析 replacement，提取 module script 和 hydrate code
  const moduleMatch = replacement.match(/<script[^>]*data-zelpis-inject="entry"[^>]*><\/script>/i)
  const hydrateMatch = replacement.match(/<script[^>]*data-zelpis-inject="hydrate"[^>]*>([\s\S]*?)<\/script>/i)

  if (moduleMatch && hydrateMatch) {
    const moduleScript = moduleMatch[0]
    const hydrateCode = hydrateMatch[1].trim()

    // 检查是否有已存在的内联 script（非 module，非 zelpis 注入的）
    const existingScriptRegex = /<script(?![^>]*type=["']module["'])(?![^>]*data-zelpis-)([^>]*)>([\s\S]*?)<\/script>/i
    const hasExistingScript = existingScriptRegex.test(result)

    if (hasExistingScript) {
      // 合并到已有的第一个内联 script
      let merged = false
      result = result.replace(
        existingScriptRegex,
        (match, attrs, content) => {
          if (!merged) {
            merged = true

            // 使用平衡括号匹配查找 window.$zelpis 定义
            const zelpisMatch = matchZelpisAssignment(content)
            if (zelpisMatch) {
              // 用户已有定义，替换整个语句
              const before = content.substring(0, zelpisMatch.start)
              const after = content.substring(zelpisMatch.end)
              const newContent = before + hydrateCode.trim() + after
              return `<script${attrs}>${newContent}</script>`
            }
            else {
              // 用户没有定义，插入到开头
              return `<script${attrs}>\n  ${hydrateCode}\n${content}</script>`
            }
          }
          return match
        },
      )
      // 只插入 module script
      result = result.replace(placeholder, moduleScript)
    }
    else {
      // 没有已有 script，完整插入
      result = result.replace(placeholder, replacement)
    }
  }
  else {
    // 解析失败，正常替换
    result = result.replace(placeholder, replacement)
  }
  return result
}

/**
 * 智能匹配平衡的 window.$zelpis 赋值语句，主要匹配 window.$zelpis = {hydrateData: {...}} 这种中括号，便以清除
 */
function matchZelpisAssignment(content: string): { matched: string, start: number, end: number } | null {
  const pattern = /window\.\$zelpis\s*=\s*\{/
  const match = pattern.exec(content)
  if (!match)
    return null

  const startIndex = match.index
  let braceCount = 1
  let i = match.index + match[0].length

  // 从第一个 { 后开始计数，找到匹配的 }
  while (i < content.length && braceCount > 0) {
    if (content[i] === '{')
      braceCount++
    else if (content[i] === '}')
      braceCount--
    i++
  }

  if (braceCount === 0) {
    // 继续检查是否有分号
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
 * @param html 自定义 HTML 字符串
 * @returns 校验结果
 */
export function validateHtmlTemplate(html: string): HtmlValidationResult {
  const warnings: string[] = []
  const errors: string[] = []

  // 1. 基本检查：是否为空
  if (!html || html.trim().length === 0) {
    errors.push('Custom HTML is empty')
    return { valid: false, warnings, errors }
  }

  // 2. 使用 parse5 解析 HTML
  let document: DefaultTreeAdapterMap['document']
  try {
    document = parse(html, {
      sourceCodeLocationInfo: true, // 启用位置信息，便于调试
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

  // 8. 检查标签嵌套顺序（使用正则简单检查）
  const htmlPos = html.search(constants.HTML_TAG_REGEX)
  const headPos = html.search(constants.HEAD_OPEN_REGEX)
  const bodyPos = html.search(constants.BODY_OPEN_REGEX)

  if (htmlPos !== -1 && headPos !== -1 && htmlPos > headPos) {
    warnings.push('<html> tag should come before <head> tag')
  }

  if (headPos !== -1 && bodyPos !== -1 && headPos > bodyPos) {
    warnings.push('<head> tag should come before <body> tag')
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
