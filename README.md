[![pkg.pr.new](https://pkg.pr.new/badge/Z-TEAM-Z/zelpis)](https://pkg.pr.new/~/Z-TEAM-Z/zelpis)

# Zelpis

## 项目介绍

Zelpis 是一个基于 DSL（领域特定语言）驱动的前端渲染框架，支持 React 和 Vue 两种主流前端框架，提供灵活的构建和渲染功能。

### 核心特性

- **DSL 驱动**：通过 DSL 定义来驱动渲染过程，简化前端开发
- **框架无关**：支持 React 和 Vue 两种前端框架
- **模块化设计**：清晰的包结构，职责分明
- **插件机制**：提供构建和渲染插件，增强扩展性
- **CSR 为主**：客户端渲染已支持；SSR 相关能力仍在演进，浏览器侧入口会以 CSR 方式运行
- **HTML 自定义**：灵活的 HTML 配置和校验功能

## 许可证

MIT

## 安装

在项目依赖中安装核心包（包名为作用域包 `@zelpis/core`）：

```bash
pnpm add @zelpis/core
```

## 快速开始

### 1. 配置 Vite，基本参考官网配置即可，只需要固定添加 zelpis 插件相关内容（根据对应项目的结构来配置 zelpis ）。

在在 `vite.config.ts` 中配置 zelpis，其他配置参考 vite 配置。

```typescript
import viteReact from '@vitejs/plugin-react'
import { zelpisPlugin } from '@zelpis/core/plugins'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    viteReact(),
    zelpisPlugin({
      render: { baseDir: './' },
    }),
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

### 2. 创建 DSL 模型 (各个模版约束不同，这里仅作为参考例子)

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
})
```

入口里可传入 `type?: 'csr' | 'ssr'`。在常见浏览器开发/构建产物中，非 CSR 会收到控制台提示并仍按 CSR 处理；SSR 场景请结合构建与服务端集成查阅示例与文档。

### 4. 创建应用组件

#### React 组件

```tsx
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

处理 React 和 Vue 的渲染逻辑；以 CSR 为主，SSR 相关逻辑仍在演进。

### @zelpis/builder

提供构建相关功能和插件，支持多入口配置和 HTML 自定义。

### @zelpis/shared

提供通用工具和配置，被其他包依赖。

## DSL 系统

Zelpis 的 DSL 通过 `defineDsl` 描述页面或模块配置。核心包里的 `DSL` 类型当前为可扩展的空接口，你可以在业务侧约定字段（例如 `title`、`route`、`data` 等），或与内部模块生成的类型对齐。

### 约定字段（示例）

```typescript
import { defineDsl } from '@zelpis/core'

export default defineDsl({
  name: 'Home Page',
  // ...more fields
})
```

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
