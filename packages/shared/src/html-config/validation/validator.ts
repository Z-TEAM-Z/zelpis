import type { HTMLElement } from 'node-html-parser'
import type { HTMLRoot } from '../dom'
import type { HtmlValidationResult } from './types'
import { parse } from 'node-html-parser'
import { VALIDATION_MESSAGES } from './messages'

interface ValidationIssues {
  warnings: string[]
  errors: string[]
}

/**
 * 验证 HTML 模板
 */
export function validateHtmlTemplate(html: string, preParsed?: HTMLRoot): HtmlValidationResult {
  const issues: ValidationIssues = { warnings: [], errors: [] }

  // 基本验证
  if (!html?.trim()) {
    issues.errors.push(VALIDATION_MESSAGES.EMPTY_HTML)
    return buildResult(issues)
  }

  // 解析验证（可复用已有 DOM，避免重复 parse）
  const root = preParsed ?? tryParseHtml(html, issues)
  if (!root)
    return buildResult(issues)

  // 结构验证
  validateStructure(html, root, issues)

  return buildResult(issues)
}

/**
 * 尝试解析 HTML
 */
function tryParseHtml(html: string, issues: ValidationIssues): HTMLRoot | null {
  try {
    return parse(html, {
      comment: true,
      blockTextElements: {
        script: true,
        style: true,
      },
    })
  }
  catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    issues.errors.push(`${VALIDATION_MESSAGES.PARSE_FAILED}: ${message}`)
    return null
  }
}

/**
 * 构建验证结果
 */
function buildResult(issues: ValidationIssues): HtmlValidationResult {
  return {
    valid: issues.errors.length === 0,
    warnings: issues.warnings,
    errors: issues.errors,
  }
}

/**
 * 验证 HTML 结构
 */
function validateStructure(html: string, root: HTMLRoot, issues: ValidationIssues): void {
  // DOCTYPE 检查
  if (!html.trim().toLowerCase().startsWith('<!doctype')) {
    issues.warnings.push(VALIDATION_MESSAGES.MISSING_DOCTYPE)
  }

  // HTML 标签检查
  const htmlNode = root.querySelector('html')
  if (!htmlNode) {
    issues.errors.push(VALIDATION_MESSAGES.MISSING_HTML)
    return
  }

  // Head 和 Body 检查
  const headNode = htmlNode.querySelector('head')
  const bodyNode = htmlNode.querySelector('body')

  if (!headNode)
    issues.errors.push(VALIDATION_MESSAGES.MISSING_HEAD)
  if (!bodyNode)
    issues.errors.push(VALIDATION_MESSAGES.MISSING_BODY)

  // Meta 标签检查
  validateMetaTags(headNode, issues)

  // 安全性检查
  validateSecurity(html, issues)

  // 标签顺序检查
  validateTagOrder(htmlNode, headNode, bodyNode, issues)
}

/**
 * 验证 meta 标签
 */
function validateMetaTags(headNode: HTMLElement | null, issues: ValidationIssues): void {
  if (!headNode)
    return

  const checks = [
    { selector: 'meta[charset]', message: VALIDATION_MESSAGES.MISSING_CHARSET },
    { selector: 'meta[name="viewport"]', message: VALIDATION_MESSAGES.MISSING_VIEWPORT },
    { selector: 'title', message: VALIDATION_MESSAGES.MISSING_TITLE },
  ]

  checks.forEach(({ selector, message }) => {
    if (!headNode.querySelector(selector)) {
      issues.warnings.push(message)
    }
  })
}

/**
 * 验证安全性
 */
function validateSecurity(html: string, issues: ValidationIssues): void {
  // 覆盖所有 javascript: URI（不限于 javascript:void）
  if (/javascript\s*:/i.test(html)) {
    issues.warnings.push(VALIDATION_MESSAGES.UNSAFE_JAVASCRIPT)
  }

  if (/<script[^>]*>[\s\S]*?eval\s*\(/i.test(html)) {
    issues.warnings.push(VALIDATION_MESSAGES.UNSAFE_EVAL)
  }
}

/**
 * 验证标签顺序
 */
function validateTagOrder(
  htmlNode: HTMLElement,
  headNode: HTMLElement | null,
  bodyNode: HTMLElement | null,
  issues: ValidationIssues,
): void {
  if (!headNode || !bodyNode)
    return

  const htmlContent = htmlNode.toString()
  const headIndex = htmlContent.indexOf('<head')
  const bodyIndex = htmlContent.indexOf('<body')

  if (headIndex !== -1 && bodyIndex !== -1 && headIndex > bodyIndex) {
    issues.warnings.push(VALIDATION_MESSAGES.WRONG_TAG_ORDER)
  }
}
