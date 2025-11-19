/**
 * HTML 配置
 */
export interface HtmlConfig {
  /** 使用模板文件路径 */
  template?: string

  /** 自定义 meta 内容 */
  meta?: {
    title?: string
    description?: string
    keywords?: string
    viewport?: string
    charset?: string
    lang?: string
  }

  /** 自定义 head 内容 */
  head?: string[]

  /** 自定义 body 属性和内容 */
  body?: {
    attributes?: Record<string, string>
    content?: string
  }

  /** 完全自定义 HTML 字符串 */
  custom?: string
}

/**
 * 入口配置
 */
export interface Entry {
  /**
   * url base path
   */
  basePath: string
  /**
   * 入口文件路径
   */
  entryPath: string
  /**
   * 当前入口文件对应的 DSL 文件夹路径
   */
  dslPath?: string
  /**
   * 当前入口文件对应的 DSL 文件
   */
  dslEntrys?: any[]
  /**
   * HTML 配置
   */
  html?: HtmlConfig
}

/**
 * 解析 HTML 选项
 */
export interface ResolveHtmlOptions {
  entry: Entry
  defaultHtml?: HtmlConfig
  rootDir?: string
  ensurePlaceholders?: string[]
}

export interface ZElpisConfig {
  /**
   * 入口配置
   */
  entrys: Omit<Entry, 'dslEntrys'>[]
  /**
   * 默认 HTML 配置
   */
  defaultHtml?: HtmlConfig
}

export interface PlaceholderRule {
  target: RegExp
  position: 'before' | 'after'
  func: (html: string, placeholder: string, rule: PlaceholderRule) => string
}
