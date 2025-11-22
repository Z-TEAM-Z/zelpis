import type { HtmlConfig, HtmlValidationLevel, PlaceholderRule, ResolveHtmlOptions } from './types'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import * as constants from './constants'
import {
  cleanAppInjectScript,
  formatValidationOutput,
  smartMergePlaceholders,
  STANDARD_PLACEHOLDERS,
  validateHtmlTemplate,
} from './utils'

// 占位符规则 Map
const PREDEFINED_RULES = new Map<string, PlaceholderRule>([
  [STANDARD_PLACEHOLDERS.APP_BODY_START, {
    target: constants.BODY_OPEN_REGEX,
    position: 'after',
    func: insertPlaceholder,
    cleanPatterns: [/<div\s+id=["']app["']>\s*<\/div>/gi],
  }],
  [STANDARD_PLACEHOLDERS.APP_INJECT_SCRIPT, {
    target: constants.BODY_CLOSE_REGEX,
    position: 'before',
    func: insertPlaceholder,
    cleanPatterns: [cleanAppInjectScript],
  }],
])

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
  const {
    entry,
    defaultHtml,
    rootDir = process.cwd(),
    replacements = {},
    context = {},
    validateCustom = 'warn',
  } = options
  const htmlConfig = { ...defaultHtml, ...entry.html }

  // custom 完全覆盖
  if (htmlConfig.custom) {
    // 如果启用校验（不是 false）
    if (validateCustom !== false) {
      validateCustomHtml(htmlConfig.custom, validateCustom)
    }
    return ensureHtmlPlaceholder(htmlConfig.custom, replacements, context)
  }

  // 获取基础模板
  let html = getBaseTemplate(htmlConfig, rootDir)

  // 应用配置增强
  if (htmlConfig.meta || htmlConfig.head || htmlConfig.body) {
    html = applyHtmlConfig(html, htmlConfig)
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

  // 尝试使用默认的 index.html
  const defaultPath = path.resolve(rootDir, 'index.html')
  if (fs.existsSync(defaultPath)) {
    return fs.readFileSync(defaultPath, 'utf-8')
  }

  // 使用内置默认模板
  return constants.DEFAULT_HTML_TEMPLATE
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
      constants.HTML_LANG_REGEX,
      constants.HTML_LANG_REPLACE_REGEX,
      `$1lang="${escapedLang}"`,
      constants.HTML_TAG_REGEX,
      `<html lang="${escapedLang}"`,
    )
  }

  // 设置或更新 charset
  if (charset) {
    if (charset) {
      const escapedCharset = escapeAttrValue(charset)
      result = updateOrInsert(
        result,
        constants.META_CHARSET_REGEX,
        constants.META_CHARSET_REPLACE_REGEX,
        `$1charset="${escapedCharset}"`,
        constants.HEAD_OPEN_REGEX,
        `$&\n  <meta charset="${escapedCharset}" />`,
      )
    }
  }

  // 设置或更新 viewport
  if (viewport) {
    result = updateMetaTag(result, 'viewport', viewport, constants.META_VIEWPORT_REGEX, constants.META_VIEWPORT_REPLACE_REGEX)
  }

  // 设置或更新 title
  if (title) {
    result = updateOrInsert(
      result,
      constants.TITLE_REGEX,
      constants.TITLE_REGEX,
      `<title>${title}</title>`,
      constants.HEAD_CLOSE_REGEX,
      `<title>${title}</title>\n</head>`,
    )
  }

  // 设置或更新 description
  if (description) {
    result = updateMetaTag(result, 'description', description, constants.META_DESCRIPTION_REGEX, constants.META_DESCRIPTION_REPLACE_REGEX)
  }

  // 设置或更新 keywords
  if (keywords) {
    result = updateMetaTag(result, 'keywords', keywords, constants.META_KEYWORDS_REGEX, constants.META_KEYWORDS_REPLACE_REGEX)
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
  return html.replace(constants.HEAD_CLOSE_REGEX, `${content}\n</head>`)
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

    if (constants.BODY_OPEN_REGEX.test(result)) {
      result = result.replace(constants.BODY_REPLACE_REGEX, (match, existingAttrs) => {
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
      constants.BODY_FULL_REGEX,
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
function ensureHtmlPlaceholder(html: string, replacements: Record<string, string>, context: Record<string, any>): string {
  let result = html
  const placeholders = Object.keys(replacements)

  // 第一步：清理模板中的默认内容
  for (const placeholder of placeholders) {
    const rule = PREDEFINED_RULES.get(placeholder)
    if (rule?.cleanPatterns) {
      for (const pattern of rule.cleanPatterns) {
        if (typeof pattern === 'function') {
          // 函数类型：直接调用
          result = pattern(result, context)
        }
        else {
          // 正则类型：执行替换
          result = result.replace(pattern, '')
        }
      }
    }
  }

  // 第二步：确保占位符存在
  for (const placeholder of placeholders) {
    const rule = PREDEFINED_RULES.get(placeholder)
    if (rule) {
      result = rule.func(result, placeholder, rule)
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

  // 第四步：执行替换（智能合并）
  for (const [placeholder, replacement] of Object.entries(replacements)) {
    // 特殊处理：尝试合并到已有的内联 script
    if (placeholder === STANDARD_PLACEHOLDERS.APP_INJECT_SCRIPT) {
      result = smartMergePlaceholders(replacement, result, placeholder)
    }
    else {
      // 其他占位符正常替换
      result = result.replace(placeholder, replacement)
    }
  }

  // 第五步：清理多余的空行和空白
  result = cleanupWhitespace(result)

  return result
}

/**
 * 清理 HTML 中多余的空行和空白
 */
function cleanupWhitespace(html: string): string {
  return html
    // 删除连续的空行（保留最多一个空行）
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    // 清理行尾空格
    .replace(/[ \t]+$/gm, '')
}

/**
 * 根据占位符名称中的关键词判断应该插入的位置
 */
function insertPlaceholder(html: string, placeholder: string, rule: PlaceholderRule): string {
  // 如果已存在，跳过
  if (html.includes(placeholder)) {
    return html
  }

  // 如果匹配到规则，插入占位符
  if (rule.target.test(html)) {
    const replacement = rule.position === 'after'
      ? `$&\n  ${placeholder}`
      : `  ${placeholder}\n$&`
    return html.replace(rule.target, replacement)
  }

  // 兜底：</head> > </body> > </html>
  if (constants.HEAD_CLOSE_REGEX.test(html)) {
    return html.replace(constants.HEAD_CLOSE_REGEX, `  ${placeholder}\n</head>`)
  }
  if (constants.BODY_CLOSE_REGEX.test(html)) {
    return html.replace(constants.BODY_CLOSE_REGEX, `  ${placeholder}\n</body>`)
  }
  if (constants.HTML_CLOSE_REGEX.test(html)) {
    return html.replace(constants.HTML_CLOSE_REGEX, `  ${placeholder}\n</html>`)
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
    constants.HEAD_CLOSE_REGEX,
    `<meta name="${name}" content="${escapedValue}" />\n</head>`,
  )
}
