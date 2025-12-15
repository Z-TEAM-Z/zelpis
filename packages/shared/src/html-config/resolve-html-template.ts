import type { HTMLRoot } from './dom'
import type { HtmlConfig, HtmlValidationLevel, ResolveHtmlOptions } from './types'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { dedent } from 'ts-dedent'
import {
  appendMeta,
  findElement,
  findMetaByName,
  getOrCreateElement,
  parseHtml,
  removeEmptyAppContainerDom,
  replaceBodyContent,
  serializeHtml,
  setAttribute,
  setTextContent,
} from './dom'
import { cleanAppInjectScriptDom, smartMergePlaceholders, STANDARD_PLACEHOLDERS } from './injection'
import { formatValidationOutput, validateHtmlTemplate } from './validation'

// 默认模板
const DEFAULT_HTML_TEMPLATE = dedent`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zelpis App</title>
</head>
<body>
  <div id="app"></div>
</body>
</html>`

/**
 * 解析 HTML 模板
 */
export function resolveHtmlTemplate(options: ResolveHtmlOptions): string {
  const {
    entry,
    defaultHtml,
    rootDir = process.cwd(),
    replacements = {},
    context = {},
    validateLevel = 'warn',
  } = options
  const htmlConfig = { ...defaultHtml, ...entry.html }

  // 获取基础模板
  const html = htmlConfig.custom || getBaseTemplate(htmlConfig, rootDir)
  const document = parseHtml(html)

  // 应用配置增强（custom 完全覆盖其他配置）
  if (!htmlConfig.custom && (htmlConfig.meta || htmlConfig.head || htmlConfig.body)) {
    applyHtmlConfig(document, htmlConfig)
  }

  const placeholders = Object.keys(replacements)

  // DOM 清理：根据占位符需求去除默认注入脚本和空容器
  if (placeholders.includes(STANDARD_PLACEHOLDERS.APP_INJECT_SCRIPT)) {
    cleanAppInjectScriptDom(document, context)
  }
  if (placeholders.includes(STANDARD_PLACEHOLDERS.APP_BODY_START)) {
    removeEmptyAppContainerDom(document)
  }

  const htmlAfterDom = serializeHtml(document)

  // 如果启用校验（不是 false）
  if (validateLevel !== false) {
    validateHtml(htmlAfterDom, validateLevel, document)
  }

  return ensureHtmlPlaceholder(htmlAfterDom, replacements)
}

/**
 * 校验 HTML 模板
 */
function validateHtml(html: string, validateLevel: HtmlValidationLevel, root: HTMLRoot): void {
  const validation = validateHtmlTemplate(html, root)
  // 输出校验结果
  if (validation.warnings.length > 0 || validation.errors.length > 0) {
    formatValidationOutput(validation, validateLevel)
  }

  // strict 模式下，如果校验失败则抛出错误
  if (validateLevel === 'strict' && !validation.valid) {
    throw new Error(
      `HTML template validation failed:\n${
        validation.errors.map(e => `  - ${e}`).join('\n')}`,
    )
  }
}

/**
 * 获取基础 HTML 模板
 * 优先级：template > index.html > 内置模板
 */
function getBaseTemplate(config: HtmlConfig, rootDir: string): string {
  // 优先使用指定的 template 文件
  if (config.template) {
    const templatePath = path.resolve(rootDir, config.template)
    const content = tryReadTemplate(templatePath)
    if (content) {
      return content
    }
    else {
      // 文件不存在，发出警告并继续
      console.warn(
        `\x1B[33m[Zelpis] HTML template file not found: ${templatePath}\n`
        + `Falling back to default template (index.html or built-in template).\x1B[0m`,
      )
    }
  }

  const defaultPath = path.resolve(rootDir, 'index.html')
  const defaultContent = tryReadTemplate(defaultPath)

  if (defaultContent) {
    return defaultContent
  }

  return DEFAULT_HTML_TEMPLATE
}

// 文件读取逻辑
function tryReadTemplate(filePath: string): string | null {
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf-8')
  }
  return null
}

/**
 * 使用 DOM 操作应用 HTML 配置
 */
function applyHtmlConfig(document: HTMLRoot, config: HtmlConfig): void {
  // 应用 meta 配置
  if (config.meta) {
    applyMetaConfig(document, config.meta)
  }

  // 应用 head 内容,避免注入任意 HTML，先不开放
  // if (config.head && config.head.length > 0) {
  //   applyHeadContent(document, config.head)
  // }

  // 应用 body 配置
  if (config.body) {
    applyBodyConfig(document, config.body)
  }
}

/**
 * 使用 DOM 应用 meta 配置
 */
function applyMetaConfig(
  document: HTMLRoot,
  meta: NonNullable<HtmlConfig['meta']>,
): void {
  const { title, description, keywords, viewport, charset, lang } = meta

  // 设置 html lang 属性
  if (lang) {
    const htmlEl = findElement(document, 'html')
    if (htmlEl) {
      setAttribute(htmlEl, 'lang', lang)
    }
  }

  // 设置 charset
  if (charset) {
    const head = findElement(document, 'head')
    if (head) {
      const charsetMeta = head.querySelector('meta[charset]')

      if (charsetMeta) {
        setAttribute(charsetMeta, 'charset', charset)
      }
      else {
        // 创建新的 charset meta
        appendMeta(head, { charset })
      }
    }
  }

  // 设置 title
  if (title) {
    const titleEl = getOrCreateElement(document, 'head', 'title')
    setTextContent(titleEl, title)
  }

  // 设置其他 meta 标签
  const metaTags: Array<[string, string | undefined]> = [
    ['viewport', viewport],
    ['description', description],
    ['keywords', keywords],
  ]

  metaTags.forEach(([name, content]) => {
    if (content)
      updateMetaTag(document, name, content)
  })
}

/**
 * 更新或创建 meta 标签
 */
function updateMetaTag(document: any, name: string, content: string): void {
  const meta = findMetaByName(document, name)

  if (meta) {
    setAttribute(meta, 'content', content)
  }
  else {
    const head = findElement(document, 'head')
    if (head) {
      appendMeta(head, { name, content })
    }
  }
}

/**
 * 使用 DOM 应用 head 内容,避免注入任意 HTML，先不开放
 */
// function applyHeadContent(document: any, headContent: string[]): void {
//   const head = findElement(document, 'head')
//   if (!head)
//     return

//   for (const content of headContent) {
//     appendHtml(head, content)
//   }
// }

/**
 * 使用 DOM 应用 body 配置
 */
function applyBodyConfig(
  document: HTMLRoot,
  bodyConfig: NonNullable<HtmlConfig['body']>,
): void {
  const body = findElement(document, 'body')
  if (!body)
    return

  // 设置 body 属性
  if (bodyConfig.attributes) {
    for (const [key, value] of Object.entries(bodyConfig.attributes)) {
      setAttribute(body, key, value)
    }
  }

  // 替换 body 内容
  if (bodyConfig.content) {
    replaceBodyContent(document, bodyConfig.content)
  }
}

/**
 * 确保 HTML 包含占位符并执行替换
 */
function ensureHtmlPlaceholder(
  html: string,
  replacements: Record<string, string>,
): string {
  const placeholders = Object.keys(replacements)

  // 处理流程：插入 → 去重 → 替换 → 清理多余空白
  const pipeline = [
    (h: string) => insertMissingPlaceholders(h, placeholders),
    (h: string) => deduplicatePlaceholders(h, placeholders),
    (h: string) => replacePlaceholders(h, replacements),
    cleanupWhitespace,
  ]

  return pipeline.reduce((result, fn) => fn(result), html)
}

/**
 * 步骤1：插入缺失的占位符
 */
function insertMissingPlaceholders(html: string, placeholders: string[]): string {
  let result = html

  for (const placeholder of placeholders) {
    if (!result.includes(placeholder)) {
      result = insertPlaceholder(result, placeholder)
    }
  }

  return result
}

/**
 * 步骤2：确保每个占位符只出现一次（保留第一个，删除后续的）
 */
function deduplicatePlaceholders(html: string, placeholders: string[]): string {
  let result = html

  for (const placeholder of placeholders) {
    const firstIndex = result.indexOf(placeholder)

    if (firstIndex !== -1) {
      const before = result.substring(0, firstIndex + placeholder.length)
      const after = result.substring(firstIndex + placeholder.length)
      result = before + after.replaceAll(placeholder, '')
    }
  }

  return result
}

/**
 * 步骤3：执行占位符替换
 */
function replacePlaceholders(
  html: string,
  replacements: Record<string, string>,
): string {
  let result = html

  for (const [placeholder, replacement] of Object.entries(replacements)) {
    // 智能合并脚本注入
    if (placeholder === STANDARD_PLACEHOLDERS.APP_INJECT_SCRIPT) {
      result = smartMergePlaceholders(replacement, result, placeholder)
    }
    // 普通替换
    else {
      result = result.replace(placeholder, replacement)
    }
  }

  return result
}

/**
 * 插入占位符到合适的位置
 */
function insertPlaceholder(html: string, placeholder: string): string {
  // body 开始位置
  if (placeholder.includes('app-body-start')) {
    const replaced = html.replace(/<body([^>]*)>/i, `$&\n  ${placeholder}`)
    if (replaced !== html) {
      return replaced
    }
  }

  // 脚本注入位置
  if (placeholder.includes('app-inject-script')) {
    const replaced = html.replace(/<\/body>/i, `  ${placeholder}\n</body>`)
    if (replaced !== html) {
      return replaced
    }
  }

  // 默认：在 </body> 前插入
  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, `  ${placeholder}\n</body>`)
  }

  // 兜底：追加到末尾
  return `${html}\n${placeholder}`
}

/**
 * 清理多余空白
 */
function cleanupWhitespace(html: string): string {
  return html
    .replace(/\n\s*\n\s*\n/g, '\n\n') // 多个空行 → 两个空行
    .replace(/[ \t]+$/gm, '') // 移除行尾空白
}
