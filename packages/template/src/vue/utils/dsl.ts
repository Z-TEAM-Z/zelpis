import type { DslData } from '../templates/dashboard_v1/types'

/**
 * 深度合并两个 DSL 对象
 * @param base 基础 DSL（来自 render 函数）
 * @param override 覆盖 DSL（来自 props 或其他来源）
 * @returns 合并后的 DSL
 */
export function mergeDsl(
  base: Partial<DslData> | undefined,
  override: Partial<DslData> | undefined,
): DslData {
  const baseDsl = base || {} as DslData
  const overrideDsl = override || {} as DslData

  return {
    template_id: overrideDsl.template_id || baseDsl.template_id || '',
    version: overrideDsl.version || baseDsl.version || '1.0.0',
    global_config: {
      title: overrideDsl.global_config?.title || baseDsl.global_config?.title || '',
      theme_color: overrideDsl.global_config?.theme_color || baseDsl.global_config?.theme_color,
      logo_url: overrideDsl.global_config?.logo_url || baseDsl.global_config?.logo_url,
      // 可以添加更多自定义合并逻辑
    },
    pages: overrideDsl.pages && overrideDsl.pages.length > 0
      ? overrideDsl.pages
      : baseDsl.pages || [],
  }
}
