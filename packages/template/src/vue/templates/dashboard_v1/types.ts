export interface DslData {
  template_id: string
  version: string
  global_config: GlobalConfig
  pages: Page[]
}

export interface GlobalConfig {
  title: string
  theme_color?: string
  logo_url?: string
}

export type Page = SchemaPageConfig | IframePageConfig

export interface BasePage {
  id: string
  label: string
  url: string
}

export interface SchemaPageConfig extends BasePage {
  component_type: 'SchemaPage'
  page_schema: PageSchema
  components: Component[]
}
export interface Component {
  id: any
  layout: any
  type: string
  data: Record<string, any>
}

export interface IframePageConfig extends BasePage {
  component_type: 'IframePage'
  iframe_url: string
}

export interface PageSchema {
  layout: 'grid' | 'flex' | 'stack'
  columns?: number
  sections: ComponentSection[]
}

export interface ComponentSection {
  component: string
  id: string
  span?: number
  config: Record<string, any>
}

// 具体组件配置类型（可选，用于更强的类型检查）
export interface StatCardConfig {
  icon: string
  title: string
  value: number | string
  footer_text?: string
}

export interface ChartConfig {
  title: string
  data_source_api: string
  line_color?: string
}

export interface TableConfig {
  title: string
  data_source_api: string
  columns: string[]
}
