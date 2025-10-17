import type { App } from 'vue'

export async function hydrate(
  _type: 'csr' | 'ssr',
  Component: App,
  _props: Record<string, any>,
  mount?: (app: App) => void,
): Promise<void> {
  mount?.(Component)
  Component.mount(document.querySelector('#app')!)
}
