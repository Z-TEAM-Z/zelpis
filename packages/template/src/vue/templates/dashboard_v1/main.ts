import type { InjectionKey } from 'vue'
import type { DslData } from './types'

import { boot } from '@zelpis/core'
import { useInternalRouter } from '../../utils/useInternalRouter'
import App from './index.vue'
import 'element-plus/dist/index.css'

export const DSL_INJECTION_KEY: InjectionKey<DslData> = Symbol('dashboard-dsl')

/**
 * 暴露给 template_engine.ts 的渲染函数。
 * 负责创建、挂载和提供销毁机制。
 */
export function render({ dsl }: { dsl: DslData }): ReturnType<typeof boot> {
  const router = useInternalRouter(dsl)
  // 渲染组件
  return boot({
    // type: 'csr',
    framework: 'vue',
    Component: App as any,
    mount(app) {
      app.use(router)
      app.provide(DSL_INJECTION_KEY, dsl)
    },
  })
}
