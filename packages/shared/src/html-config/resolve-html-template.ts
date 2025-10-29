import type { HtmlConfig, ResolveHtmlOptions } from './types'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

// 正则表达式
const HTML_TAG_REGEX = /<html/i
const HTML_LANG_REGEX = /<html[^>]*\slang=/i
const HEAD_OPEN_REGEX = /<head[^>]*>/i
const HEAD_CLOSE_REGEX = /<\/head>/i
const BODY_OPEN_REGEX = /<body[^>]*>/i
const BODY_CLOSE_REGEX = /<\/body>/i
const TITLE_REGEX = /<title>.*?<\/title>/i
const META_CHARSET_REGEX = /<meta[^>]+charset=/i
const META_VIEWPORT_REGEX = /<meta[^>]+name="viewport"/i
const META_DESCRIPTION_REGEX = /<meta[^>]+name="description"/i
const META_KEYWORDS_REGEX = /<meta[^>]+name="keywords"/i
const HTML_CLOSE_REGEX = /<\/html>/i
const HTML_LANG_REPLACE_REGEX = /(<html[^>]*\s)lang="[^"]*"/i
const BODY_REPLACE_REGEX = /<body([^>]*)>/i
const BODY_FULL_REGEX = /<body([^>]*)>([\s\S]*?)<\/body>/i
const META_CHARSET_REPLACE_REGEX = /(<meta[^>]+)charset="[^"]*"/i
const META_VIEWPORT_REPLACE_REGEX = /(<meta[^>]+name="viewport"[^>]+)content="[^"]*"/i
const META_DESCRIPTION_REPLACE_REGEX = /(<meta[^>]+name="description"[^>]+)content="[^"]*"/i
const META_KEYWORDS_REPLACE_REGEX = /(<meta[^>]+name="keywords"[^>]+)content="[^"]*"/i

// 占位符插入的规则和位置
const INSERT_RULES = [
  {
    keywords: ['head-start', 'head-begin'],
    target: HEAD_OPEN_REGEX,
    position: 'after',
  },
  {
    keywords: ['body-start', 'body-begin'],
    target: BODY_OPEN_REGEX,
    position: 'after',
  },
  {
    keywords: ['body-end', 'script'],
    target: BODY_CLOSE_REGEX,
    position: 'before',
  },
  {
    keywords: ['head', 'meta', 'style', 'preload', 'link'],
    target: HEAD_CLOSE_REGEX,
    position: 'before',
  },
]

// 默认模板
const DEFAULT_HTML_TEMPLATE = `<!DOCTYPE html>
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
 * 创建占位符
 * @param name 占位符名称
 */
export function createPlaceholder(name: string): string {
  return `<!-- zelpis:${name} -->`
}

/**
 * 解析 HTML 模板
 *
 * 优先级：
 * 1. custom - 完全自定义 HTML（最高优先级，忽略其他配置）
 * 2. 基础模板（template > index.html > 内置）+ meta/head/body 增强
 *
 * @platform node
 */
export function resolveHtmlTemplate(options: ResolveHtmlOptions): string {
  const { entry, defaultHtml, rootDir = process.cwd(), ensurePlaceholders = [] } = options
  const htmlConfig = { ...defaultHtml, ...entry.html }

  // custom 完全覆盖
  if (htmlConfig.custom) {
    return ensureHtmlPlaceholder(htmlConfig.custom, ensurePlaceholders)
  }

  // 获取基础模板
  let html = getBaseTemplate(htmlConfig, rootDir)

  // 应用配置增强
  if (htmlConfig.meta || htmlConfig.head || htmlConfig.body) {
    html = applyHtmlConfig(html, htmlConfig)
  }

  return ensureHtmlPlaceholder(html, ensurePlaceholders)
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

  // 尝试使用默认的 index.html
  const defaultPath = path.resolve(rootDir, 'index.html')
  if (fs.existsSync(defaultPath)) {
    return fs.readFileSync(defaultPath, 'utf-8')
  }

  // 使用内置默认模板
  return DEFAULT_HTML_TEMPLATE
}

/**
 * 在基础 HTML 模板上应用配置
 * 使用字符串替换和正则表达式
 */
function applyHtmlConfig(html: string, config: HtmlConfig): string {
  let result = html

  // 应用 meta 配置
  if (config.meta) {
    result = applyMetaConfig(result, config.meta)
  }

  // 在 head 中追加额外内容
  if (config.head && config.head.length > 0) {
    result = applyHeadContent(result, config.head)
  }

  // 应用 body 配置
  if (config.body) {
    result = applyBodyConfig(result, config.body)
  }

  return result
}

/**
 * 应用 meta 配置
 */
function applyMetaConfig(html: string, meta: NonNullable<HtmlConfig['meta']>): string {
  let result = html
  const { title, description, keywords, viewport, charset, lang } = meta

  // 设置 html lang 属性
  if (lang) {
    const escapedLang = escapeAttrValue(lang)
    result = updateOrInsert(
      result,
      HTML_LANG_REGEX,
      HTML_LANG_REPLACE_REGEX,
      `$1lang="${escapedLang}"`,
      HTML_TAG_REGEX,
      `<html lang="${escapedLang}"`,
    )
  }

  // 设置或更新 charset
  if (charset) {
    if (charset) {
      const escapedCharset = escapeAttrValue(charset)
      result = updateOrInsert(
        result,
        META_CHARSET_REGEX,
        META_CHARSET_REPLACE_REGEX,
        `$1charset="${escapedCharset}"`,
        HEAD_OPEN_REGEX,
        `$&\n  <meta charset="${escapedCharset}">`,
      )
    }
  }

  // 设置或更新 viewport
  if (viewport) {
    result = updateMetaTag(result, 'viewport', viewport, META_VIEWPORT_REGEX, META_VIEWPORT_REPLACE_REGEX)
  }

  // 设置或更新 title
  if (title) {
    result = updateOrInsert(
      result,
      TITLE_REGEX,
      TITLE_REGEX,
      `<title>${title}</title>`,
      HEAD_CLOSE_REGEX,
      `<title>${title}</title>\n</head>`,
    )
  }

  // 设置或更新 description
  if (description) {
    result = updateMetaTag(result, 'description', description, META_DESCRIPTION_REGEX, META_DESCRIPTION_REPLACE_REGEX)
  }

  // 设置或更新 keywords
  if (keywords) {
    result = updateMetaTag(result, 'keywords', keywords, META_KEYWORDS_REGEX, META_KEYWORDS_REPLACE_REGEX)
  }

  return result
}

/**
 * 在 head 中追加额外内容
 */
function applyHeadContent(html: string, headContent: string[]): string {
  if (!headContent.length)
    return html

  const content = headContent.join('\n')
  return html.replace(HEAD_CLOSE_REGEX, `${content}\n</head>`)
}

/**
 * 应用 body 配置
 */
function applyBodyConfig(html: string, bodyConfig: NonNullable<HtmlConfig['body']>): string {
  let result = html

  // 设置 body 属性
  if (bodyConfig.attributes) {
    const newAttrs = Object.entries(bodyConfig.attributes)
      .map(([key, value]) => `${key}="${escapeAttrValue(value)}"`)
      .join(' ')

    if (BODY_OPEN_REGEX.test(result)) {
      result = result.replace(BODY_REPLACE_REGEX, (match, existingAttrs) => {
        const trimmedAttrs = existingAttrs.trim()
        if (trimmedAttrs) {
          return `<body ${trimmedAttrs} ${newAttrs}>`
        }
        return `<body ${newAttrs}>`
      })
    }
  }

  // 替换 body 内容
  if (bodyConfig.content) {
    result = result.replace(
      BODY_FULL_REGEX,
      (match, attrs) => {
        return `<body${attrs}>\n${bodyConfig.content}\n</body>`
      },
    )
  }

  return result
}

/**
 * 确保 HTML 模板包含必需的注入占位符
 * 如果缺失，会自动添加
 */
function ensureHtmlPlaceholder(html: string, placeholders: string[]): string {
  let result = html

  for (const placeholder of placeholders) {
    // 如果已存在，跳过
    if (result.includes(placeholder)) {
      continue
    }

    // 插入
    result = insertPlaceholder(result, placeholder)
  }

  return result
}

/**
 * 根据占位符名称中的关键词判断应该插入的位置
 */
function insertPlaceholder(html: string, placeholder: string): string {
  const lower = placeholder.toLowerCase()

  // 找到对应的规则
  const rule = INSERT_RULES.find(rule =>
    rule.keywords.some(keyword => lower.includes(keyword)) && rule.target.test(html),
  )

  if (rule) {
    const replacement = rule.position === 'after'
      ? `$&\n  ${placeholder}`
      : `  ${placeholder}\n$&`
    return html.replace(rule.target, replacement)
  }

  // 根据占位符类型选择位置
  const isHeadRelated = lower.includes('head') || lower.includes('meta')
    || lower.includes('style') || lower.includes('link')
  const isBodyRelated = lower.includes('body') || lower.includes('script')

  // Head 相关的占位符
  if (isHeadRelated) {
    if (HEAD_CLOSE_REGEX.test(html)) {
      return html.replace(HEAD_CLOSE_REGEX, `  ${placeholder}\n</head>`)
    }
    // 没有 head，尝试创建 head 区域或插入到 <html> 后
    if (/<html[^>]*>/i.test(html)) {
      return html.replace(/<html([^>]*)>/i, `<html$1>\n<head>\n  ${placeholder}\n</head>`)
    }
  }

  // Body 相关的占位符
  if (isBodyRelated) {
    if (BODY_CLOSE_REGEX.test(html)) {
      return html.replace(BODY_CLOSE_REGEX, `  ${placeholder}\n</body>`)
    }
  }

  // 兜底：</head> > </body> > </html>
  if (HEAD_CLOSE_REGEX.test(html)) {
    return html.replace(HEAD_CLOSE_REGEX, `  ${placeholder}\n</head>`)
  }
  if (BODY_CLOSE_REGEX.test(html)) {
    return html.replace(BODY_CLOSE_REGEX, `  ${placeholder}\n</body>`)
  }
  if (HTML_CLOSE_REGEX.test(html)) {
    return html.replace(HTML_CLOSE_REGEX, `  ${placeholder}\n</html>`)
  }

  // 最后的兜底：插入到文档末尾
  return `${html}\n${placeholder}`
}

/**
 * 转义 HTML 属性值中的双引号，防止属性值中的双引号破坏 HTML 结构
 */
function escapeAttrValue(text: string): string {
  return text.replace(/"/g, '&quot;')
}

/**
 * 通用的更新或插入函数
 * @param html 原始 HTML
 * @param checkRegex 检测是否存在的正则
 * @param updateRegex 更新时使用的正则
 * @param updateReplacement 更新时的替换内容
 * @param fallbackRegex 如果不存在，在此位置插入
 * @param fallbackReplacement 插入时的替换内容
 */
function updateOrInsert(
  html: string,
  checkRegex: RegExp,
  updateRegex: RegExp,
  updateReplacement: string,
  fallbackRegex: RegExp,
  fallbackReplacement: string,
): string {
  if (checkRegex.test(html)) {
    return html.replace(updateRegex, updateReplacement)
  }
  if (fallbackRegex.test(html)) {
    return html.replace(fallbackRegex, fallbackReplacement)
  }
  return html
}

/**
 * 辅助函数：更新 meta 标签的 content
 */
function updateMetaTag(
  html: string,
  name: string,
  value: string,
  checkRegex: RegExp,
  updateRegex: RegExp,
): string {
  const escapedValue = escapeAttrValue(value)
  return updateOrInsert(
    html,
    checkRegex,
    updateRegex,
    `$1content="${escapedValue}"`,
    HEAD_CLOSE_REGEX,
    `<meta name="${name}" content="${escapedValue}">\n</head>`,
  )
}
