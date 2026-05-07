# @zelpis/template

`@zelpis/template` 是 Zelpis 框架的模板系统，提供预设模板和组件。

## 安装

```bash
pnpm add @zelpis/template
```

## 核心功能

### 1. 模板渲染

```typescript
import { renderTemplate } from '@zelpis/template'

const destroy = await renderTemplate({
  templateId: 'project_dashboard_v1',
  dsl: myDsl
})
```

### 2. 组件注册

```typescript
import componentMap from '@zelpis/template/vue/components'
import pageMap from '@zelpis/template/vue/pages'
```

## API 参考

### renderTemplate(options)

渲染指定模板。

#### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `templateId` | `string` | 是 | 模板 ID |
| `dsl` | `Record<string, any>` | 是 | DSL 配置 |

#### 返回值

返回销毁函数，用于清理模板。

#### 使用示例

```typescript
import { renderTemplate } from '@zelpis/template'

const dsl = {
  pages: [],
  global_config: {}
}

const destroy = await renderTemplate({
  templateId: 'project_dashboard_v1',
  dsl
})

// 清理模板
// destroy()
```

## 模板列表

| 模板 ID | 描述 | 框架 |
|---------|------|------|
| `project_dashboard_v1` | 项目仪表盘模板 | Vue |

## 组件模块

### Vue 组件

```typescript
import { Header, Text } from '@zelpis/template/vue/components'
```

### Vue 页面

```typescript
import { SchemaPage, IframePage } from '@zelpis/template/vue/pages'
```

## 目录结构

```
packages/template/
├── src/
│   ├── dsl/
│   │   └── mock_data.json
│   ├── registry/
│   │   └── template_engine.ts
│   ├── utils/
│   │   └── dslParser.ts
│   ├── vue/
│   │   ├── components/
│   │   │   ├── Header.vue
│   │   │   ├── Text.vue
│   │   │   └── index.ts
│   │   ├── pages/
│   │   │   ├── IframePage.vue
│   │   │   ├── SchemaPage.vue
│   │   │   └── index.ts
│   │   ├── templates/
│   │   │   └── dashboard_v1/
│   │   └── utils/
│   └── index.ts
├── package.json
└── tsdown.config.ts
```

## 依赖关系

```
@zelpis/template
    └── @zelpis/core
```

## 相关链接

- [@zelpis/core](/packages/core) - 核心包
- [DSL 配置指南](/guide/dsl) - DSL 使用指南
