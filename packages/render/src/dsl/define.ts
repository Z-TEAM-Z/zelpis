export interface DSL {
  /**
   * 页面标题
   */
  title?: string
  
  /**
   * 页面描述
   */
  description?: string
  
  /**
   * 页面关键词
   */
  keywords?: string
  
  /**
   * 页面路由
   */
  route?: string
  
  /**
   * 页面组件
   */
  component?: string
  
  /**
   * 页面数据
   */
  data?: Record<string, any>
  
  /**
   * 页面配置
   */
  config?: Record<string, any>
  
  /**
   * 页面依赖
   */
  dependencies?: string[]
  
  /**
   * 页面元数据
   */
  meta?: Record<string, any>
}

export function defineDsl(obj: DSL): DSL {
  return obj
}

/**
 * 验证 DSL 对象的有效性
 * @param dsl 要验证的 DSL 对象
 * @returns 验证结果
 */
export function validateDsl(dsl: DSL): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // 验证必要字段
  if (!dsl.title) {
    errors.push('DSL 缺少 title 字段')
  }
  
  // 验证数据类型
  if (dsl.data && typeof dsl.data !== 'object') {
    errors.push('DSL 的 data 字段必须是对象类型')
  }
  
  if (dsl.config && typeof dsl.config !== 'object') {
    errors.push('DSL 的 config 字段必须是对象类型')
  }
  
  if (dsl.dependencies && !Array.isArray(dsl.dependencies)) {
    errors.push('DSL 的 dependencies 字段必须是数组类型')
  }
  
  if (dsl.meta && typeof dsl.meta !== 'object') {
    errors.push('DSL 的 meta 字段必须是对象类型')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * 类型安全的 DSL 定义辅助函数
 * @param dsl 类型安全的 DSL 对象
 * @returns 验证后的 DSL 对象
 */
export function defineTypedDsl<T extends DSL>(dsl: T): T {
  const validation = validateDsl(dsl)
  if (!validation.valid) {
    console.warn('DSL 验证警告:', validation.errors)
  }
  return dsl
}
