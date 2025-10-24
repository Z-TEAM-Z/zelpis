import type { Root } from 'react-dom/client'
import type { App } from 'vue'
import { once } from '@zelpis/shared'

interface BaseBootOption {
  type?: 'csr' | 'ssr'
  framework: 'react' | 'vue'
  Component: (props: any) => any
  mount?: (app: any) => void
}

interface ReactBootOption extends BaseBootOption {
  framework: 'react'
  mount?: (app: Root) => void
}

interface VueBootOption extends BaseBootOption {
  framework: 'vue'
  mount?: (app: App) => void
}

export type BootOption = ReactBootOption | VueBootOption

async function getRenderFunc(framework: BootOption['framework']): Promise<(comp: any) => string> {
  if (framework === 'react') {
    const { renderToString } = await import('react-dom/server')
    return renderToString
  }
  if (framework === 'vue') {
    const { renderToString } = await import('vue/server-renderer')

    return renderToString as any
  }
  return () => ''
}

async function createComponent(
  framework: BootOption['framework'],
  Component: BootOption['Component'],
  props: any,
  option: BootOption,
): Promise<any> {
  if (framework === 'react') {
    const { createElement } = await import('react')
    return createElement(Component, props)
  }
  if (framework === 'vue') {
    if (option.type === 'csr') {
      const { createApp } = await import('vue')
      return createApp(Component, props)
    }
    const { createSSRApp } = await import('vue')
    return createSSRApp(Component, props)
  }
  return ''
}

function getRootDom(content = ''): string {
  return `<div id="app">${content}</div>`
}

function csrRenderer(option: BootOption): { option: BootOption, render: () => { html: string } } {
  const { framework, Component, mount } = option

  if (option.type !== 'csr') {
    console.warn('生产环境暂不支持 SSR 渲染, 后续版本考虑实现')
  }

  option.type = 'csr'

  const csrRender = async (): Promise<void> => {
    // @ts-expect-error any
    const props = { ...window.$zelpis.hydrateData }
    const Comp = await createComponent(framework, Component, props, option)
    if (framework === 'react') {
      const { hydrate } = await import('./hydrates/react')
      await hydrate(option.type!, Comp, props, mount)
    }
    else if (framework === 'vue') {
      const { hydrate } = await import('./hydrates/vue')
      await hydrate(option.type!, Comp, props, mount)
    }
  }

  if (!import.meta.env.SSR) {
    csrRender().catch(console.error)
  }

  return { option, render: () => ({ html: getRootDom() }) }
}

function ssrRenderer(option: BootOption): { option: BootOption, render: (props: any) => Promise<{ html: string, head: string, option: BootOption }> } {
  const { framework, Component } = option

  return {
    option,
    render: async (props: any) => {
      const result = {
        html: '',
        head: '',
        option,
      }

      try {
        const render = await getRenderFunc(framework)
        const Comp = await createComponent(framework, Component, props, option)
        const rendered = await render(Comp)
        result.html = getRootDom(rendered)
      }
      catch (e) {
        console.error(e)
        const csr = csrRenderer(option)
        const csrRendered = csr.render()
        result.html = csrRendered.html
      }

      return result
    },
  }
}

export const boot = once((option: BootOption) => {
  if (!import.meta.env.SSR || option.type === 'csr') {
    return csrRenderer(option)
  }

  return ssrRenderer(option)
})
