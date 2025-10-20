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
      return fs.readFileSync(templatePath, 'utf-8')
    }
  }

  // 使用字符串模板自定义 HTML
  if (htmlConfig.custom) {
    return htmlConfig.custom
  }

  // 使用 JSON 配置生成 HTML
  if (htmlConfig.meta || htmlConfig.head || htmlConfig.body) {
    return generateHtmlFromConfig(htmlConfig)
  }

  // 默认回退到 index.html
  const defaultPath = path.resolve(rootDir, 'index.html')
  return fs.existsSync(defaultPath)
    ? fs.readFileSync(defaultPath, 'utf-8')
    : getDefaultHtmlTemplate()
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
