---
url: /zelpis/packages/core.md
---
# @zelpis/core

面向使用方的聚合包：在单一依赖下提供启动 API、Vite 插件组合入口，以及 DSL / Builder 的子路径再导出，无需单独引入其他功能包。

## 安装

```bash
pnpm add @zelpis/core
```

## 典型用法

### 应用启动与 DSL

```typescript
import { boot, defineDsl } from '@zelpis/core'

export const pageDsl = defineDsl({ title: 'Home', data: { n: 1 } })

export default boot({
  framework: 'react',
  Component: App,
})
```

`boot` 由 `@zelpis/render` 提供：浏览器侧以 CSR 为主；`type` 非 CSR 时会告警并仍按 CSR 处理（详见 [@zelpis/render](/packages/render)）。

### Vite：注册插件（与仓库示例一致）

`buildPlugin` 返回 `Promise<Plugin>`；在 Vite 的 `plugins` 数组中可直接放入该 Promise（由 Vite 解析），也可在 `defineConfig(async () => ({ ... }))` 里 `await` 后再组装。

```typescript
import viteReact from '@vitejs/plugin-react'
import { zelpisPlugin } from '@zelpis/core/plugins'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    viteReact(),
    zelpisPlugin({ render: { baseDir: './' } }),
  ],
  zelpis: {
    entrys: [
      { basePath: '/', entryPath: './entry.ts', dslPath: './model' },
    ],
  },
})
```

### `zelpisPlugin`

```typescript
import { zelpisPlugin } from '@zelpis/core/plugins'

// 等价于 [ buildPlugin(build), renderPlugin(render) ]
plugins: [...zelpisPlugin({ build: {}, render: { baseDir: './' } })]
```

### DSL 工具

```typescript
import { defineDsl, mergeDsl, getDsl } from '@zelpis/core/dsl'
```

## 内置模块说明

安装 `@zelpis/core` 即可使用全部能力；下列子包由依赖自动带入，一般无需单独安装。需要了解实现分工时可继续阅读：

* [@zelpis/builder](/packages/builder) — 构建期 Vite 插件：扫描 DSL、生成多 HTML 入口
* [@zelpis/render](/packages/render) — 运行时：`boot`、渲染插件与 DSL 定义/合并
* [@zelpis/shared](/packages/shared) — 共享工具与 HTML 模板配置

包文档总览见 [包文档概览](/packages/)。
