import type { BuilderPluginOption } from '@zelpis/builder/plugins'
import type { RenderPluginOption } from '@zelpis/render/plugins'
import type { PluginOption } from 'vite'

import { buildPlugin } from '@zelpis/builder/plugins'
import { renderPlugin } from '@zelpis/render/plugins'

export * from '@zelpis/builder/plugins'
export * from '@zelpis/render/plugins'

export interface ZelpisPluginOption {
  build?: BuilderPluginOption
  render?: RenderPluginOption
}

export function zelpisPlugin(options?: ZelpisPluginOption): PluginOption {
  const { build, render = {} } = options || {}

  return [buildPlugin(build), renderPlugin(render)]
}
