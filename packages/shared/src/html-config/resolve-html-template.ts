import type { Entry, HtmlConfig } from './types'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { parse } from 'node-html-parser'

interface ResolveHtmlOptions {
  entry: Entry
  defaultHtml?: HtmlConfig
  rootDir?: string
}

const REQUIRED_PLACEHOLDER = '<!-- app-inject-script -->'

const DEFAULT_HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zelpis App</title>
</head>
<body>
  <div id="app"></div>
  ${REQUIRED_PLACEHOLDER}
</body>
</html>`

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
  const { entry, defaultHtml, rootDir = process.cwd() } = options
  const htmlConfig = { ...defaultHtml, ...entry.html }

  // custom 完全覆盖
  if (htmlConfig.custom) {
    return ensureHtmlPlaceholder(htmlConfig.custom)
  }

  // 获取基础模板
  let html = getBaseTemplate(htmlConfig, rootDir)

  // 应用配置增强
  if (htmlConfig.meta || htmlConfig.head || htmlConfig.body) {
    html = applyHtmlConfig(html, htmlConfig)
  }

  return ensureHtmlPlaceholder(html)
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
 * 使用 node-html-parser 进行 DOM 操作
 */
function applyHtmlConfig(html: string, config: HtmlConfig): string {
  const root = parse(html, {
    comment: true, // 保留注释（包括 placeholder）
    blockTextElements: {
      script: true,
      style: true,
    },
  })

  const headEl = root.querySelector('head')
  const bodyEl = root.querySelector('body')
  const htmlEl = root.querySelector('html')

  // 应用 meta 配置
  if (config.meta) {
    const { title, description, keywords, viewport, charset, lang } = config.meta

    // 设置 html lang 属性
    if (lang && htmlEl) {
      htmlEl.setAttribute('lang', lang)
    }

    // 设置或更新 charset
    if (charset && headEl) {
      let charsetMeta = headEl.querySelector('meta[charset]')
      if (charsetMeta) {
        charsetMeta.setAttribute('charset', charset)
      }
      else {
        charsetMeta = parse(`<meta charset="${charset}">`)
        headEl.insertAdjacentHTML('afterbegin', charsetMeta.toString())
      }
    }

    // 设置或更新 viewport
    if (viewport && headEl) {
      let viewportMeta = headEl.querySelector('meta[name="viewport"]')
      if (viewportMeta) {
        viewportMeta.setAttribute('content', viewport)
      }
      else {
        viewportMeta = parse(`<meta name="viewport" content="${viewport}">`)
        headEl.appendChild(viewportMeta)
      }
    }

    // 设置或更新 title
    if (title && headEl) {
      let titleEl = headEl.querySelector('title')
      if (titleEl) {
        titleEl.textContent = title
      }
      else {
        titleEl = parse(`<title>${title}</title>`)
        headEl.appendChild(titleEl)
      }
    }

    // 设置或更新 description
    if (description && headEl) {
      let descMeta = headEl.querySelector('meta[name="description"]')
      if (descMeta) {
        descMeta.setAttribute('content', description)
      }
      else {
        descMeta = parse(`<meta name="description" content="${description}">`)
        headEl.appendChild(descMeta)
      }
    }

    // 设置或更新 keywords
    if (keywords && headEl) {
      let keywordsMeta = headEl.querySelector('meta[name="keywords"]')
      if (keywordsMeta) {
        keywordsMeta.setAttribute('content', keywords)
      }
      else {
        keywordsMeta = parse(`<meta name="keywords" content="${keywords}">`)
        headEl.appendChild(keywordsMeta)
      }
    }
  }

  // 在 head 中追加额外内容
  if (config.head && config.head.length > 0 && headEl) {
    config.head.forEach((htmlString) => {
      headEl.insertAdjacentHTML('beforeend', htmlString)
    })
  }

  // 应用 body 配置
  if (config.body && bodyEl) {
    // 设置 body 属性
    if (config.body.attributes) {
      Object.entries(config.body.attributes).forEach(([key, value]) => {
        bodyEl.setAttribute(key, value)
      })
    }

    // 替换 body 内容（保留 placeholder）
    if (config.body.content) {
      const currentContent = bodyEl.innerHTML
      const hasPlaceholder = currentContent.includes(REQUIRED_PLACEHOLDER)

      if (hasPlaceholder) {
        // 保留 placeholder，替换其他内容
        bodyEl.innerHTML = `  ${config.body.content}\n  ${REQUIRED_PLACEHOLDER}\n`
      }
      else {
        bodyEl.innerHTML = `  ${config.body.content}\n`
      }
    }
  }

  return root.toString()
}

/**
 * 确保 HTML 模板包含必需的脚本注入占位符
 * 如果缺失，会自动添加
 */
function ensureHtmlPlaceholder(html: string): string {
  if (html.includes(REQUIRED_PLACEHOLDER)) {
    return html
  }

  // 使用 node-html-parser 精确插入
  const root = parse(html, { comment: true })
  const bodyEl = root.querySelector('body')

  if (bodyEl) {
    // 在 body 结束前插入
    bodyEl.insertAdjacentHTML('beforeend', `  ${REQUIRED_PLACEHOLDER}\n`)
    return root.toString()
  }

  // 如果没有 body，尝试在 html 结束前插入
  const htmlEl = root.querySelector('html')
  if (htmlEl) {
    htmlEl.insertAdjacentHTML('beforeend', `  ${REQUIRED_PLACEHOLDER}\n`)
    return root.toString()
  }

  // 都没有，直接追加到末尾
  return `${html}\n${REQUIRED_PLACEHOLDER}`
}
