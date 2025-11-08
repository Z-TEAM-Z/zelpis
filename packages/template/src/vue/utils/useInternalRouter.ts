import type { RouteRecordRaw } from 'vue-router'
import type { DslData } from '../templates/dashboard_v1/types'
import { createRouter, createWebHashHistory } from 'vue-router'
import pageMap from '../pages'

export function useInternalRouter(dsl: DslData): ReturnType<typeof createRouter> {
  // 根据 DSL 的 pages 参数和 pageMap 生成路由配置
  const routes: RouteRecordRaw[] = dsl.pages.map((page) => {
    // 从 pageMap 中获取对应的组件
    const component = pageMap[page.component_type]

    if (!component) {
      console.warn(`Component type "${page.component_type}" not found in pageMap`)
    }

    return {
      path: page.url,
      name: page.id,
      component,
      // 将完整的 page 数据作为 props 传递给组件
      props: {
        pageConfig: page,
        dsl,
      },
    }
  })

  // 添加默认重定向：如果访问根路径，重定向到第一个页面
  if (routes.length > 0) {
    routes.unshift({
      path: '/',
      redirect: routes[0].path,
    })
  }

  return createRouter({
    history: createWebHashHistory(),
    routes,
  })
}
