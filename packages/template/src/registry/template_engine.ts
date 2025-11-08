// 定义统一的接口
export interface TemplateRenderOptions {
  templateId: string
  dsl: Record<string, any>
}

/**
 * 模板 ID 映射到其渲染函数模块的路径
 */
const templatePathMap: Record<string, () => Promise<any>> = {
  // 仅包含 MVP 实现的 Vue 模板
  project_dashboard_v1: () => import('../vue/templates/dashboard_v1/main'),
  // 'finance_report_v2': () => import('../react/templates/finance_report_v2/main.js'), // React 模板示例（未实现）
}

/**
 * 统一的模板渲染 API
 * 外部应用通过此函数启动任何模板。
 * @returns Promise<() => void> - 解析为模板的销毁函数
 */
export async function renderTemplate(
  options: TemplateRenderOptions,
): Promise<() => void> {
  const { templateId, dsl } = options
  const loader = templatePathMap[templateId]

  if (!loader) {
    throw new Error(`Template ID "${templateId}" not found in registry.`)
  }

  const module = await loader()

  if (typeof module.render !== 'function') {
    throw new TypeError(`Template module "${templateId}" does not export a 'render' function.`)
  }

  // 调用模板内部的 Vue 启动函数
  return module.render({ dsl })
}
