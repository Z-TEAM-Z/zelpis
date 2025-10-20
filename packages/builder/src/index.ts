export * from './plugins/builder-plugin'

export interface HtmlConfig {
  // 使用模板文件路径
  template?: string

  // 自定义 meta 内容
  meta?: {
    title?: string
    description?: string
    keywords?: string
    viewport?: string
    charset?: string
    lang?: string
  }

  // 自定义 head 内容
  head?: string[]

  // 自定义 body 属性和内容
  body?: {
    attributes?: Record<string, string>
    content?: string
  }

  // 完全自定义 HTML 字符串
  custom?: string
}

export interface Entry {
  basePath: string
  entryPath: string
  dslPath?: string
  dslEntrys?: any[]
  html?: HtmlConfig // HTML 配置
}

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
