# 示例项目

Zelpis 提供了两个示例项目，展示如何在 React 和 Vue 中使用 Zelpis。

## React 示例

### 项目结构

```text
examples/react-example/
├── custom-component/     # 自定义组件
│   ├── button.module.css
│   └── button.tsx
├── model/                # DSL 配置
│   ├── taobao/
│   │   ├── shangou/
│   │   │   └── index.ts  # 示例 DSL 配置
│   │   └── index.ts      # 定义 DSL 配置
│   └── index.ts          # 定义 DSL 配置
├── remote-template/      # 应用壳：路由、页面、注册表（本仓库内本地模块，非运行时拉取远端）
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
├── entry.ts              # boot：挂载 Root，并 register 自定义组件
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

```text
examples/vue-example/
├── model/                # 构建期 DSL 目录（由 vite 中 zelpis.entrys.dslPath 指向）
│   ├── taobao/
│   │   ├── shangou/
│   │   │   └── index.ts
│   │   └── index.ts
│   └── index.ts
├── pages/                # 页面组件
│   ├── blog.vue
│   └── home.vue
├── router/               # 路由
│   └── index.ts
├── app.vue               # 根组件（示例中演示 window.$zelpis.hydrateData）
├── entry.ts              # 应用入口，boot + 挂载 router
├── index.html
├── package.json
└── vite.config.ts        # vite 配置
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