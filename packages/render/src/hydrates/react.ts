import type React from 'react'
import type { Root } from 'react-dom/client'

export async function hydrate(
  type: 'csr' | 'ssr',
  Component: React.ReactNode,
  _props: Record<string, any>,
  mount?: (app: Root) => void,
): Promise<void> {
  if (type === 'csr') {
    // 开发环境 vite 并不会处理 commonjs 模块, 所以做一个兜底逻辑
    const module = await import('react-dom/client')
    const createRoot = module.createRoot || module.default.createRoot

    const root = createRoot(document.querySelector('#app')!)

    mount?.(root)
    return root.render(Component)
  }

  const { hydrateRoot } = await import('react-dom/client')

  const root = hydrateRoot(document.querySelector('#app')!, Component)

  mount?.(root)
}
