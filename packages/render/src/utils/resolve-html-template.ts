import type { Entry, HtmlConfig } from '@zelpis/builder'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

interface ResolveHtmlOptions {
  entry: Entry
  defaultHtml?: HtmlConfig
  rootDir?: string
}

export function resolveHtmlTemplate(options: ResolveHtmlOptions): string {
  const { entry, defaultHtml, rootDir = process.cwd() } = options
  const htmlConfig = { ...defaultHtml, ...entry.html }

  // 使用自定义模板文件
  if (htmlConfig.template) {
    const templatePath = path.resolve(rootDir, htmlConfig.template)
    if (fs.existsSync(templatePath)) {
      const content = fs.readFileSync(templatePath, 'utf-8')
      return ensureHtmlPlaceholder(content)
    }
  }

  // 使用字符串模板自定义 HTML
  if (htmlConfig.custom) {
    return ensureHtmlPlaceholder(htmlConfig.custom)
  }

  // 使用 JSON 配置生成 HTML
  if (htmlConfig.meta || htmlConfig.head || htmlConfig.body) {
    return generateHtmlFromConfig(htmlConfig)
  }

  // 默认回退到 index.html
  const defaultPath = path.resolve(rootDir, 'index.html')
  // 如果默认模板存在就输出默认文件，否则输出默认字符串
  if (fs.existsSync(defaultPath)) {
    const content = fs.readFileSync(defaultPath, 'utf-8')
    return ensureHtmlPlaceholder(content)
  }
  return getDefaultHtmlTemplate()
}

function generateHtmlFromConfig(config: HtmlConfig): string {
  const meta = config.meta || {}
  const head = config.head || []
  const body = config.body || {}

  return `<!DOCTYPE html>
				<html lang="${meta.lang || 'en'}">
				<head>
					<meta charset="${meta.charset || 'UTF-8'}">
					<meta name="viewport" content="${meta.viewport || 'width=device-width, initial-scale=1.0'}">
					<title>${meta.title || 'Zelpis'}</title>
					${meta.description ? `<meta name="description" content="${meta.description}">` : ''}
					${meta.keywords ? `<meta name="keywords" content="${meta.keywords}">` : ''}
					${head.join('\n  ')}
				</head>
				<body${body.attributes ? Object.entries(body.attributes).map(([k, v]) => ` ${k}="${v}"`).join('') : ''}>
					${body.content || '<div id="app"></div>'}
					<!-- app-inject-script -->
				</body>
				</html>`
}

function getDefaultHtmlTemplate(): string {
  return `<!DOCTYPE html>
					<html lang="en">
					<head>
						<meta charset="UTF-8">
						<meta name="viewport" content="width=device-width, initial-scale=1.0">
						<title>Zelpis App</title>
					</head>
					<body>
						<div id="app"></div>
						<!-- app-inject-script -->
					</body>
					</html>`
}

/**
 * 确保 HTML 模板包含必需的脚本注入占位符
 * 如果缺失，会自动添加
 */
function ensureHtmlPlaceholder(html: string): string {
  const REQUIRED_PLACEHOLDER = '<!-- app-inject-script -->'

  if (!html.includes(REQUIRED_PLACEHOLDER)) {
    // 尝试在 </body> 前插入
    if (html.includes('</body>')) {
      return html.replace('</body>', `    ${REQUIRED_PLACEHOLDER}\n  </body>`)
    }

    // 如果没有 </body>，尝试在 </html> 前插入
    if (html.includes('</html>')) {
      return html.replace('</html>', `  ${REQUIRED_PLACEHOLDER}\n</html>`)
    }

    // 如果都没有，追加到末尾
    return `${html}\n${REQUIRED_PLACEHOLDER}`
  }

  return html
}
