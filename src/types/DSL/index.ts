
export type ElementTableSortOrder = 'ascending' | 'descending' | null

/** 菜单类型 */
export enum MenuType {
  /** 分组 */
  GROUP = 'GROUP',
  /** 模块 */
  MODULE = 'MODULE'
}

/** 模块类型 */
export enum ModuleType {
  /** iframe 模块 */
  IFRAME = 'IFRAME',
  /** 自定义模块 */
  CUSTOM = 'CUSTOM',
  /** schema 模块 */
  SCHEMA = 'SCHEMA',
  /** 侧边栏模块 */
  SIDEBAR = 'SIDEBAR'
}

/** iframe 模块配置 */
export interface IframeModuleConfig {
  /** iframe路径 */
  path: string
}

/** 自定义模块配置 */
export interface CustomModuleConfig {
  /** 自定义模块路径 */
  path: string
}

/** 单元格的格式化规则 */
export interface FormatRule {
  /** 格式化类型 */
  type: 'date' | 'number' | 'string'
  /** 日期格式化pattern 当type为date时有效 */
  datePattern?: string
  /** 数字格式化小数位数 当type为number 或者 string 可以转换成数字时有效 */
  decimalPlaces?: number
  /** 数字格式化千分位 当type为number 或者 string 可以转换成数字时有效 */
  toThousand?: boolean
}

