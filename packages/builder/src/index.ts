export * from './plugins/builder-plugin'

interface Entry {
  basePath: string
  entryPath: string
  dslPath?: string
  dslEntrys?: any[]
}

export interface ZElpisConfig {
  entrys: Entry[]
}

// 扩展 Vite 配置类型
declare module 'vite' {
  interface UserConfig {
    zelpis?: ZElpisConfig
  }
}
