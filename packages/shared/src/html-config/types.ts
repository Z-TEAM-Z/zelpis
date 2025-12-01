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
 * 上下文
 */
export interface ResolveHtmlContext {
  entryPath?: string
}

/**
 * 解析 HTML 选项
 */
export interface ResolveHtmlOptions {
  entry: Entry
  defaultHtml?: HtmlConfig
  rootDir?: string
  replacements?: Record<string, string>
  context?: ResolveHtmlContext
  /** HTML 校验级别，默认 'warn' */
  validateCustom?: import('./validation/types').HtmlValidationLevel
}

/**
 * Zelpis 配置
 */
export interface ZElpisConfig {
  /**
   * 入口配置
   */
  entrys: Omit<Entry, 'dslEntrys'>[]
  /**
   * 默认 HTML 配置
   */
  defaultHtml?: HtmlConfig
  /**
   * HTML 校验级别
   * - false: 不校验
   * - 'warn': 只警告（默认）
   * - 'strict': 严格模式，有错误则抛出异常
   */
  validateCustomHtml?: import('./validation/types').HtmlValidationLevel
}

/**
 * 验证类型
 */
export type {
  HtmlValidationLevel,
  HtmlValidationResult,
} from './validation/types'
