import type { BuilderPluginOption } from '@zelpis/builder/plugins'
import type { RenderPluginOption } from '@zelpis/render/plugins'
import type { ZElpisConfig } from '@zelpis/shared/html-config'

import type { PluginOption } from 'vite'
import { buildPlugin } from '@zelpis/builder/plugins'
import { renderPlugin } from '@zelpis/render/plugins'

export * from '@zelpis/builder/plugins'
export * from '@zelpis/render/plugins'

export interface ZelpisPluginOption {
  /**
   * 构建插件配置
   */
  build?: BuilderPluginOption
  /**
   * 渲染插件配置
   */
  render?: RenderPluginOption
}

export function zelpisPlugin(options?: ZelpisPluginOption): PluginOption {
  const { build, render = {} } = options || {}

  return [buildPlugin(build), renderPlugin(render)]
}

// 扩展 Vite 配置类型
declare module 'vite' {
  interface UserConfig {
    zelpis?: ZElpisConfig
  }
}
