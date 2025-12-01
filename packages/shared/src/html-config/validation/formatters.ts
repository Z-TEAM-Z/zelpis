import type { HtmlValidationLevel, HtmlValidationResult } from './types'

export function formatValidationOutput(
  result: HtmlValidationResult,
  level: HtmlValidationLevel,
): void {
  if (result.errors.length > 0) {
    console.error(
      `\x1B[31m[Zelpis] Custom HTML validation errors:\x1B[0m\n${
        result.errors.map(e => `  ❌ ${e}`).join('\n')}`,
    )
  }

  if (result.warnings.length > 0) {
    console.warn(
      `\x1B[33m[Zelpis] Custom HTML validation warnings:\x1B[0m\n${
        result.warnings.map(w => `  ⚠️  ${w}`).join('\n')}`,
    )
  }

  if (level === 'strict' && !result.valid) {
    console.error(
      `\x1B[31m[Zelpis] Custom HTML has critical issues. `
      + `Please fix the errors above or use template/meta/head/body configuration instead.\x1B[0m`,
    )
  }
}
