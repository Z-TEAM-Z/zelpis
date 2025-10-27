import type { ZElpisConfig } from '@zelpis/shared/html-config'

export * from './plugins/builder-plugin'

// 扩展 Vite 配置类型
declare module 'vite' {
  interface UserConfig {
    zelpis?: ZElpisConfig
  }
}
