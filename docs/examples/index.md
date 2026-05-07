# 示例项目

Zelpis 提供了两个示例项目，展示如何在 React 和 Vue 中使用 Zelpis。

## React 示例

### 项目结构

```
examples/react-example/
├── custom-component/     # 自定义组件
│   ├── button.module.css
│   └── button.tsx
├── model/                # DSL 配置
│   ├── taobao/
│   │   ├── shangou/
│   │   │   └── index.ts  # 做定义 DSL 配置
│   │   └── index.ts      # 定义 DSL 配置
│   └── index.ts          # 定义 DSL 配置
├── remote-template/      # 远程模板
│   ├── pages/            # 页面
│   │   ├── blog.tsx      # 其他应用页面
│   │   ├── home.module.css
│   │   └── home.tsx      # 主应用页面
│   ├── router/
│   │   └── index.tsx     # 路由配置
│   ├── component-register.ts # 组件注册配置（定义组件注册和渲染）
│   ├── context.tsx         # 上下文配置（定义全局状态和上下文）
│   ├── index.ts
│   └── main.tsx          # 应用入口
├── entry.ts              # 从远程模板启动 Zelpis
├── index.html            # 应用入口 HTML 文件
├── package.json
└── vite.config.ts
```

### 核心文件

#### entry.ts

```typescript
import { boot } from '@zelpis/core'
import { Button } from './custom-component/button'
import { register, Root } from './remote-template'

// 注册自定义组件
register('SchemaButton', Button)

// 启动 Zelpis
export default boot({
  framework: 'react',
  Component: Root,
})
```

### 运行示例

```bash
cd examples/react-example
pnpm install
pnpm dev
```

## Vue 示例

### 项目结构

```
examples/vue-example/
├── components/           # 组件
├── model/                # DSL 配置
│   ├── taobao/           # 定义 DSL 配置
│   │   ├── shangou/
│   │   │   └── index.ts
│   │   └── index.ts
│   └── index.ts
├── pages/                # 页面
│   ├── blog.vue          # 其他应用页面
│   └── home.vue          # 主应用页面
├── router/               # 路由
│   └── index.ts
├── app.vue               # 根组件
├── dsl.json              # DSL 配置文件
├── entry.ts              # 应用入口
├── index.html            # 应用入口 HTML 文件
├── package.json
└── vite.config.ts
```

### 核心文件

#### entry.ts

```typescript
import { boot } from '@zelpis/core'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './app.vue'
import SchemaPage from './components/SchemaPage.vue'
import IframePage from './components/IframePage.vue'
import dsl from './dsl.json'

// 生成路由配置
const routes = dsl.pages.map((page) => {
  const component = page.component_type === 'SchemaPage' ? SchemaPage : IframePage
  return {
    path: page.url,
    name: page.id,
    component,
    props: {
      pageConfig: page,
      dsl
    }
  }
})

// 创建路由器
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 启动 Zelpis
export default boot({
  framework: 'vue',
  Component: App as any,
  mount(app) {
    app.use(router)
  },
})
```

### 运行示例

```bash
cd examples/vue-example
pnpm install
pnpm dev
```

## 示例功能说明

### React 示例功能

1. **自定义组件**：展示如何创建和注册自定义组件
2. **DSL 配置**：展示如何使用 DSL 配置页面结构
3. **远程模板**：展示如何使用远程模板系统
4. **基本路由**：展示如何配置基本路由

### Vue 示例功能

1. **DSL 驱动路由**：展示如何根据 DSL 配置自动生成路由
2. **组件切换**：展示如何根据 `component_type` 切换不同的组件
3. **页面配置**：展示如何在 DSL 中配置页面结构和组件
4. **Vue Router 集成**：展示如何与 Vue Router 集成

## 下一步

- [快速开始](/guide/quick-start/)：了解如何快速创建一个 Zelpis 应用
- [DSL 配置](/guide/dsl/)：学习如何使用 DSL 配置驱动前端渲染
- [核心 API](/api/)：查看 Zelpis 的核心 API 文档