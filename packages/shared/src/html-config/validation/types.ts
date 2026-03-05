/**
 * HTML 校验级别
 * - false: 不校验
 * - 'warn': 只警告（默认）
 * - 'strict': 严格模式，有错误则抛出异常
 */
export type HtmlValidationLevel = false | 'warn' | 'strict'

/**
 * HTML 校验结果
 */
export interface HtmlValidationResult {
  /** 是否通过校验 */
  valid: boolean
  /** 警告信息 */
  warnings: string[]
  /** 错误信息 */
  errors: string[]
}
