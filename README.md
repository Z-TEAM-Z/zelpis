[![pkg.pr.new](https://pkg.pr.new/badge/Z-TEAM-Z/zelpis)](https://pkg.pr.new/~/Z-TEAM-Z/zelpis)

# ZElpis

## 项目介绍

ZElpis 是一个基于 DSL（领域特定语言）驱动的前端渲染框架，支持 React 和 Vue 两种主流前端框架，提供灵活的构建和渲染功能。

### 核心特性

- **DSL 驱动**：通过 DSL 定义来驱动渲染过程，简化前端开发
- **框架无关**：支持 React 和 Vue 两种前端框架
- **模块化设计**：清晰的包结构，职责分明
- **插件机制**：提供构建和渲染插件，增强扩展性
- **支持 SSR/CSR**：支持客户端渲染，实验性支持服务器端渲染
- **HTML 自定义**：灵活的 HTML 配置和校验功能

## 许可证

MIT

## 安装

### 全局安装

```bash
pnpm add zelpis
```

### 安装核心包

```bash
pnpm add @zelpis/core
pnpm add @zelpis/builder
pnpm add @zelpis/render
pnpm add @zelpis/shared
```

## 快速开始

### 1. 配置 Vite

在 `vite.config.ts` 中配置 Zelpis：

```typescript
import { buildPlugin, renderPlugin } from '@zelpis/core/plugins'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    buildPlugin(),
    renderPlugin({ baseDir: './' }),
  ],
  zelpis: {
    entrys: [
      {
        basePath: '/',
        entryPath: './entry.ts',
        dslPath: './model',
      },
    ],
  },
})
```

### 2. 创建 DSL 模型

在 `model` 目录下创建 DSL 文件：

```typescript
// model/index.ts
import { defineDsl } from '@zelpis/core'

export default defineDsl({
  title: 'Home Page',
  description: 'Welcome to ZElpis',
  keywords: 'zelpis, dsl, frontend',
  route: '/',
  component: './components/Home',
  data: {
    message: 'Hello ZElpis!'
  }
})
```

### 3. 创建入口文件

创建 `entry.ts` 文件：

```typescript
// entry.ts
import { boot } from '@zelpis/core'
import App from './App'

boot({
  framework: 'react', // 或 'vue'
  Component: App,
  type: 'csr' // 或 'ssr'
})
```

### 4. 创建应用组件

#### React 组件

```typescript
// App.tsx
import React from 'react'

function App(props: any) {
  return (
    <div>
      <h1>{props.title || 'ZElpis App'}</h1>
      <p>{props.message || 'Welcome!'}</p>
    </div>
  )
}

export default App
```

#### Vue 组件

```vue
<!-- App.vue -->
<template>
  <div>
    <h1>{{ title || 'ZElpis App' }}</h1>
    <p>{{ message || 'Welcome!' }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  message?: string
}>()
</script>
```

## 核心模块

### @zelpis/core

核心包，导出渲染功能和 DSL 定义工具。

### @zelpis/render

处理 React 和 Vue 的渲染逻辑，支持客户端渲染和服务器端渲染。

### @zelpis/builder

提供构建相关功能和插件，支持多入口配置和 HTML 自定义。

### @zelpis/shared

提供通用工具和配置，被其他包依赖。

## DSL 系统

ZElpis 的 DSL 系统允许你通过简单的对象定义来描述页面结构和配置。

### DSL 接口定义

```typescript
interface DSL {
  title?: string           // 页面标题
  description?: string     // 页面描述
  keywords?: string        // 页面关键词
  route?: string           // 页面路由
  component?: string       // 页面组件
  data?: Record<string, any> // 页面数据
  config?: Record<string, any> // 页面配置
  dependencies?: string[]  // 页面依赖
  meta?: Record<string, any> // 页面元数据
}
```

### DSL 验证

ZElpis 提供了 DSL 验证功能，确保 DSL 对象的有效性：

```typescript
import { validateDsl } from '@zelpis/core'

const dsl = {
  title: 'Home Page',
  data: 'invalid data' // 类型错误
}

const result = validateDsl(dsl)
console.log(result) // { valid: false, errors: ['DSL 的 data 字段必须是对象类型'] }
```

### 类型安全的 DSL 定义

使用 `defineTypedDsl` 函数可以获得类型安全的 DSL 定义：

```typescript
import { defineTypedDsl } from '@zelpis/core'

const dsl = defineTypedDsl({
  title: 'Home Page',
  data: { message: 'Hello' }
})
```

## 配置选项

### 构建配置

在 `vite.config.ts` 中配置 `zelpis` 选项：

```typescript
interface ZElpisConfig {
  entrys: Entry[]              // 入口配置数组
  defaultHtml?: HtmlConfig      // 全局默认 HTML 配置
  validateLevel?: false | 'warn' | 'strict' // HTML 校验级别
}

interface Entry {
  basePath: string             // 应用的基础路径
  entryPath: string            // 入口文件的路径
  dslPath?: string             // DSL 模型文件的目录路径
  dslEntrys?: any[]            // DSL 入口数组
  html?: HtmlConfig            // 该入口特定的 HTML 配置
}
```

### HTML 配置

```typescript
interface HtmlConfig {
  template?: string           // 自定义 HTML 模板文件路径
  meta?: MetaConfig           // HTML meta 标签配置
  head?: string[]             // 插入到 `<head>` 标签中的额外内容
  body?: BodyConfig           // body 标签的属性和内容配置
  custom?: string             // 完全自定义的 HTML 字符串
}
```

## 使用示例

### 多入口配置

```typescript
export default defineConfig({
  zelpis: {
    entrys: [
      {
        basePath: '/',
        entryPath: './main-entry.ts',
        dslPath: './model/main',
        html: {
          meta: {
            title: 'Main App',
          },
        },
      },
      {
        basePath: '/admin',
        entryPath: './admin-entry.ts',
        dslPath: './model/admin',
        html: {
          meta: {
            title: 'Admin Panel',
          },
        },
      },
    ],
  },
})
```

### 自定义 HTML

```typescript
export default defineConfig({
  zelpis: {
    entrys: [
      {
        basePath: '/',
        entryPath: './entry.ts',
        dslPath: './model',
        html: {
          meta: {
            title: 'Custom App',
            description: 'An app with custom HTML',
          },
          head: [
            '<link rel="icon" href="/favicon.ico">',
            '<link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">',
          ],
          body: {
            attributes: {
              class: 'app-theme',
            },
          },
        },
      },
    ],
  },
})
```

## 开发指南

### 安装依赖

```bash
pnpm install
```

### 构建项目

```bash
pnpm build
```

### 运行开发服务器

```bash
pnpm dev
```

### 运行测试

```bash
pnpm test
```

### 类型检查

```bash
pnpm typecheck
```

## 相关资源

- [@zelpis/builder 文档](docs/builder/README.md)
- [React 示例](examples/react-example)
- [Vue 示例](examples/vue-example)
