import type { Entry, HtmlConfig } from '@zelpis/shared/html-config'

export * from './plugins/builder-plugin'

export interface ZElpisConfig {
  entrys: Entry[]
  defaultHtml?: HtmlConfig
}

// 扩展 Vite 配置类型
declare module 'vite' {
  interface UserConfig {
    zelpis?: ZElpisConfig
  }
}
