// packages/shared/src/html-config/resolve-html-template.ts
import type { HtmlConfig, HtmlValidationLevel, ResolveHtmlOptions } from './types'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import * as constants from './constants'
import {
  appendHtml,
  cleanAppInjectScript,
  findElement,
  findMetaByName,
  formatValidationOutput,
  getAttribute,
  getOrCreateElement,
  parseHtml,
  replaceBodyContent,
  serializeHtml,
  setAttribute,
  setTextContent,
  smartMergePlaceholders,
  STANDARD_PLACEHOLDERS,
  validateHtmlTemplate,
} from './utils'

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
    validateCustom = 'warn',
  } = options
  const htmlConfig = { ...defaultHtml, ...entry.html }

  // 获取基础模板
  let html = htmlConfig.custom || getBaseTemplate(htmlConfig, rootDir)

  // 应用配置增强（custom 完全覆盖其他配置）
  if (!htmlConfig.custom && (htmlConfig.meta || htmlConfig.head || htmlConfig.body)) {
    html = applyHtmlConfig(html, htmlConfig)
  }

  // 如果启用校验（不是 false）
  if (validateCustom !== false) {
    validateCustomHtml(html, validateCustom)
  }

  return ensureHtmlPlaceholder(html, replacements, context)
}

/**
 * 校验 HTML 模板
 */
function validateCustomHtml(html: string, validateCustom: HtmlValidationLevel): void {
  const validation = validateHtmlTemplate(html)
  // 输出校验结果
  if (validation.warnings.length > 0 || validation.errors.length > 0) {
    formatValidationOutput(validation, validateCustom)
  }

  // strict 模式下，如果校验失败则抛出错误
  if (validateCustom === 'strict' && !validation.valid) {
    throw new Error(
      `Custom HTML validation failed:\n${
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
    if (fs.existsSync(templatePath)) {
      return fs.readFileSync(templatePath, 'utf-8')
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
  if (fs.existsSync(defaultPath)) {
    return fs.readFileSync(defaultPath, 'utf-8')
  }

  return constants.DEFAULT_HTML_TEMPLATE
}

/**
 * 使用 DOM 操作应用 HTML 配置
 */
function applyHtmlConfig(html: string, config: HtmlConfig): string {
  // 解析为 DOM
  const document = parseHtml(html)

  // 应用 meta 配置
  if (config.meta) {
    applyMetaConfig(document, config.meta)
  }

  // 应用 head 内容
  if (config.head && config.head.length > 0) {
    applyHeadContent(document, config.head)
  }

  // 应用 body 配置
  if (config.body) {
    applyBodyConfig(document, config.body)
  }

  // 序列化回 HTML
  return serializeHtml(document)
}

/**
 * 使用 DOM 应用 meta 配置
 */
function applyMetaConfig(
  document: any,
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
      const metas = head.childNodes.filter(
        node => 'tagName' in node && node.tagName === 'meta',
      )
      const charsetMeta = metas.find(meta =>
        getAttribute(meta as any, 'charset') !== null,
      )

      if (charsetMeta) {
        setAttribute(charsetMeta as any, 'charset', charset)
      }
      else {
        // 创建新的 charset meta
        appendHtml(head, `<meta charset="${charset}" />`)
      }
    }
  }

  // 设置 title
  if (title) {
    const titleEl = getOrCreateElement(document, 'head', 'title')
    setTextContent(titleEl, title)
  }

  // 设置其他 meta 标签
  if (viewport) {
    updateMetaTag(document, 'viewport', viewport)
  }
  if (description) {
    updateMetaTag(document, 'description', description)
  }
  if (keywords) {
    updateMetaTag(document, 'keywords', keywords)
  }
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
      appendHtml(head, `<meta name="${name}" content="${content}" />`)
    }
  }
}

/**
 * 使用 DOM 应用 head 内容
 */
function applyHeadContent(document: any, headContent: string[]): void {
  const head = findElement(document, 'head')
  if (!head)
    return

  for (const content of headContent) {
    appendHtml(head, content)
  }
}

/**
 * 使用 DOM 应用 body 配置
 */
function applyBodyConfig(
  document: any,
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
 * 确保 HTML 包含占位符
 * 这部分仍然保留字符串操作，因为占位符是注释节点，更适合字符串处理
 */
function ensureHtmlPlaceholder(
  html: string,
  replacements: Record<string, string>,
  context: Record<string, any>,
): string {
  let result = html
  const placeholders = Object.keys(replacements)

  // 第一步：清理模板中的默认内容
  for (const placeholder of placeholders) {
    if (placeholder === STANDARD_PLACEHOLDERS.APP_INJECT_SCRIPT) {
      result = cleanAppInjectScript(result, context)
    }
    // 清理 <div id="app"></div>
    if (placeholder === STANDARD_PLACEHOLDERS.APP_BODY_START) {
      result = result.replace(/<div\s+id=["']app["']>\s*<\/div>/gi, '')
    }
  }

  // 第二步：确保占位符存在
  for (const placeholder of placeholders) {
    if (!result.includes(placeholder)) {
      result = insertPlaceholder(result, placeholder)
    }
  }

  // 第三步：确保每个占位符只出现一次
  for (const placeholder of placeholders) {
    const firstIndex = result.indexOf(placeholder)
    if (firstIndex !== -1) {
      const before = result.substring(0, firstIndex + placeholder.length)
      const after = result.substring(firstIndex + placeholder.length)
      result = before + after.replaceAll(placeholder, '')
    }
  }

  // 第四步：执行替换
  for (const [placeholder, replacement] of Object.entries(replacements)) {
    if (placeholder === STANDARD_PLACEHOLDERS.APP_INJECT_SCRIPT) {
      result = smartMergePlaceholders(replacement, result, placeholder)
    }
    else {
      result = result.replace(placeholder, replacement)
    }
  }

  // 第五步：清理空白
  result = cleanupWhitespace(result)

  return result
}

/**
 * 插入占位符（简化版，只处理关键位置）
 */
function insertPlaceholder(html: string, placeholder: string): string {
  if (placeholder.includes('app-body-start')) {
    // 在 <body> 后插入
    return html.replace(/<body([^>]*)>/i, `$&\n  ${placeholder}`)
  }

  if (placeholder.includes('app-inject-script')) {
    // 在 </body> 前插入
    return html.replace(/<\/body>/i, `  ${placeholder}\n</body>`)
  }

  // 兜底：在 </body> 前插入
  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, `  ${placeholder}\n</body>`)
  }

  return `${html}\n${placeholder}`
}

/**
 * 清理空白
 */
function cleanupWhitespace(html: string): string {
  return html
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .replace(/[ \t]+$/gm, '')
}
