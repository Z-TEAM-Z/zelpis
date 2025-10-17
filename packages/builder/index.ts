export * from './builder-plugin'

// 扩展 Vite 配置类型
declare module 'vite' {
  interface UserConfig {
    $zelpis?: {
      renderConfig: {
        entrys: Array<{
          basePath: string
          entryPath: string
          dslPath?: string
          dslEntrys?: any[]
        }>
      }
    }
  }
}
