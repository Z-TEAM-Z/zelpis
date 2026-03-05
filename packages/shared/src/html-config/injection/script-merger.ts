import type { HTMLElement } from 'node-html-parser'
import type { HTMLRoot } from '../dom'
import { parse } from 'node-html-parser'
import { ZELPIS_DATA_ATTR } from './placeholders'

/**
 * 智能合并占位符内容
 */
export function smartMergePlaceholders(
  replacement: string,
  result: string,
  placeholder: string,
): string {
  const replacementRoot = parse(`<body>${replacement}</body>`)
  const resultRoot = parse(result)

  const scripts = extractZelpisScripts(replacementRoot)
  if (!scripts) {
    return result.replace(placeholder, replacement)
  }

  const { moduleScript, hydrateScript } = scripts
  const existingScript = findExistingInlineScript(resultRoot)

  if (existingScript) {
    mergeHydrateScript(existingScript, hydrateScript?.textContent.trim() || '')
    return resultRoot.toString().replace(placeholder, moduleScript?.toString() || '')
  }

  return resultRoot.toString().replace(placeholder, replacement)
}

/**
 * 提取 Zelpis 注入的脚本
 */
function extractZelpisScripts(root: HTMLRoot): { moduleScript: HTMLElement | null, hydrateScript: HTMLElement | null } | null {
  const moduleScript = root.querySelector(`script[${ZELPIS_DATA_ATTR}="entry"]`)
  const hydrateScript = root.querySelector(`script[${ZELPIS_DATA_ATTR}="hydrate"]`)

  if (!moduleScript || !hydrateScript) {
    return null
  }

  return { moduleScript, hydrateScript }
}

/**
 * 查找现有的内联脚本
 */
function findExistingInlineScript(root: HTMLRoot): HTMLElement | null {
  const scripts = root.querySelectorAll('script')
    .filter((script) => {
      const type = script.getAttribute('type')
      const hasZelpisInject = script.hasAttribute(ZELPIS_DATA_ATTR)
      return type !== 'module' && !hasZelpisInject
    })

  return scripts[0] || null
}

/**
 * 合并 hydrate 脚本内容
 */
function mergeHydrateScript(existingScript: HTMLElement, hydrateCode: string): void {
  const content = existingScript.textContent
  const zelpisMatch = matchZelpisAssignment(content)

  if (zelpisMatch) {
    const before = content.substring(0, zelpisMatch.start)
    const after = content.substring(zelpisMatch.end)
    existingScript.textContent = before + hydrateCode + after
  }
  else {
    existingScript.textContent = `\n  ${hydrateCode}\n${content}`
  }
}

/**
 * 匹配 window.$zelpis 赋值语句
 */
function matchZelpisAssignment(content: string): { matched: string, start: number, end: number } | null {
  const pattern = /window\.\$zelpis\s*=\s*\{/
  const match = pattern.exec(content)
  if (!match)
    return null

  const startIndex = match.index
  let braceCount = 1
  let i = match.index + match[0].length

  // 匹配平衡的大括号
  while (i < content.length && braceCount > 0) {
    if (content[i] === '{')
      braceCount++
    else if (content[i] === '}')
      braceCount--
    i++
  }

  if (braceCount !== 0)
    return null

  // 包含可能的分号
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
