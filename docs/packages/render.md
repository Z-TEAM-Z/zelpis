# @zelpis/render

运行时渲染与 DSL 处理：`boot` 挂载 React/Vue 根组件；`renderPlugin` 在开发/构建中与 HTML、虚拟模块配合；`@zelpis/render/dsl` 提供定义与合并；`@zelpis/render/dsl/server` 提供 Node 环境下的 `loadDsl`。

## 安装

```bash
pnpm add @zelpis/render
```

## `boot(options)`

应用入口启动函数，用于挂载 React/Vue 根组件。

**参数：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `framework` | `'react' \| 'vue'` | ✅ | 前端框架类型 |
| `Component` | `ComponentType` | ✅ | 根组件 |
| `type` | `'csr' \| 'ssr'` | ❌ | 渲染模式，浏览器环境默认 CSR |
| `mount` | `(app: App) => void` | ❌ | 根实例挂载后的回调，如注册路由、状态管理等 |

**示例：**

```typescript
import { boot } from '@zelpis/render'
import App from './app.vue'
import { router } from './router'

export default boot({
  framework: 'vue',
  Component: App,
  mount(app) {
    app.use(router)
  },
})
```

`boot` 使用 `@zelpis/shared` 的 `once` 包装，多次调用返回同一结果。

## `renderPlugin(options?)`

Vite 插件，用于开发环境和构建时的 HTML 处理与 DSL 解析。

**参数：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `baseDir` | `string` | ❌ | 解析 `entryPath`、`dslPath` 的基准目录，默认 `process.cwd()` |

**功能：**

- 读取 Vite 配置中的 `config.zelpis`，缺失时会报错
- 未配置 `dslPath` 时，默认解析为 `dirname(entryPath)/model`
- 提供虚拟模块 `virtual:zelpis/render-config`，运行时注入合并后的配置

**使用示例：**

```typescript
import { renderPlugin } from '@zelpis/render'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [renderPlugin({ baseDir: './' })],
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

与 `@zelpis/builder` 的 `buildPlugin` 配合使用：构建插件负责多 HTML 入口，渲染插件负责 dev / 解析与 DSL 相关逻辑。

## DSL API

### `defineDsl(obj)`

定义 DSL 对象，返回传入对象本身。

```typescript
import { defineDsl } from '@zelpis/render/dsl'

export const pageDsl = defineDsl({
  title: 'Home',
  data: { n: 1 },
})
```

`DSL` 接口当前为空对象类型，可在业务侧用 `satisfies` 或自管接口约束字段。

### `mergeDsl(target, ...sources)`

合并多个 DSL 对象，从 `target` 拷贝后依次 `Object.assign` 各 `source`，返回新对象。

```typescript
import { mergeDsl } from '@zelpis/render/dsl'

const baseDsl = { title: 'Base', data: { a: 1 } }
const pageDsl = mergeDsl(baseDsl, { title: 'Page', data: { b: 2 } })
// 结果: { title: 'Page', data: { b: 2 } }
```

### `loadDsl(modelDir, dslName)`（`@zelpis/render/dsl/server`）

Node 环境下加载 DSL 模块，用于构建时解析 DSL 配置。

- `modelDir`：DSL 根目录（或入口文件路径）
- `dslName`：相对 `modelDir` 的路径段数组，如 `['taobao', 'shangou']`

逐级加载并合并子目录默认导出，使用 jiti 在 Node 中执行 TS/JS/JSON 模块。

```typescript
import { loadDsl } from '@zelpis/render/dsl/server'

const dsl = await loadDsl('./model', ['taobao', 'shangou'])
```

## 相关链接

- [@zelpis/core](/packages/core)
- [@zelpis/shared](/packages/shared)
