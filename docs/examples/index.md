# 示例项目

Zelpis 提供了两个示例项目，展示如何在 React 和 Vue 中使用 Zelpis。

## React 示例

### 项目结构

```text
examples/react-example/
├── custom-component/     # 自定义组件
│   ├── button.module.css
│   └── button.tsx        # SchemaButton
├── model/                # DSL（dslPath 指向此目录）
│   ├── taobao/
│   │   ├── shangou/
│   │   │   └── index.ts  # 示例 defineDsl
│   │   └── index.ts      # taobao 域
│   └── index.ts          # DSL 入口
├── remote-template/      # 路由 + 页面 + 注册表（本地模块）
│   ├── pages/
│   │   ├── blog.tsx      # /blog
│   │   ├── home.module.css
│   │   └── home.tsx      # 首页，getComp 示例
│   ├── router/
│   │   └── index.tsx     # Hash 路由
│   ├── component-register.ts # register / getComp
│   ├── context.tsx       # 渲染上下文 Provider
│   ├── index.ts          # 导出 register、Root
│   └── main.tsx          # 根组件：Router + Provider
├── entry.ts              # boot + register
├── index.html
├── package.json
└── vite.config.ts        # React 插件 + Zelpis entrys
```

### 核心文件

#### entry.ts

```typescript
import { boot } from '@zelpis/core'
import { Button } from './custom-component/button'
import { register, Root } from './remote-template'

register('SchemaButton', Button)

export default boot({
  framework: 'react',
  Component: Root,
})
```

#### vite.config.ts

`buildPlugin` / `renderPlugin`，`zelpis.entrys` 见[安装与使用](/guide/installation)。

### 运行示例

```bash
cd examples/react-example
pnpm install
pnpm dev
```

### 在仓库根目录用 filter

```bash
pnpm --filter react-example dev
pnpm --filter vue-example dev
```

## Vue 示例

### 项目结构

```text
examples/vue-example/
├── model/                # DSL（dslPath 指向此目录）
│   ├── taobao/
│   │   ├── shangou/
│   │   │   └── index.ts  # 示例 defineDsl
│   │   └── index.ts      # taobao 域
│   └── index.ts          # DSL 入口
├── pages/
│   ├── blog.vue          # /blog
│   └── home.vue          # 首页
├── router/
│   └── index.ts          # Hash 路由
├── app.vue               # 根组件 + router-view；示例 hydrateData
├── entry.ts              # boot + app.use(router)
├── index.html
├── package.json
└── vite.config.ts        # Vue 插件 + Zelpis entrys
```

### 核心文件

#### entry.ts

```typescript
import { boot } from '@zelpis/core'
import App from './app.vue'
import { router } from './router'

export default boot({
  framework: 'vue',
  Component: App as any,
  mount(app) {
    app.use(router)
  },
})
```

#### vite.config.ts

`buildPlugin` / `renderPlugin`，`zelpis.entrys` 见[安装与使用](/guide/installation)。

### 运行示例

```bash
cd examples/vue-example
pnpm install
pnpm dev
```

### 在仓库根目录用 filter

```bash
pnpm --filter react-example dev
pnpm --filter vue-example dev
```

## 下一步
- [快速开始](/guide/quick-start)：了解如何快速创建一个 Zelpis 应用
