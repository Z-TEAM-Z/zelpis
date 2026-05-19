# @zelpis/builder

构建期 Vite 插件：在 `vite build` 时读取 `config.zelpis`，扫描各入口的 `dslPath`，加载并合并 DSL，生成最终 HTML，合并为 `build.rollupOptions.input` 的多页面入口。

## 安装

```bash
pnpm add -D @zelpis/builder
```

当前 `BuilderPluginOption` 为空接口；入口列表、HTML、校验级别等全部来自根配置的 `zelpis`（类型见 `@zelpis/shared/html-config` 的 `ZElpisConfig`）。

## 核心功能

### `buildPlugin()`
- 返回 `Promise<Plugin>`；通常直接写入 `plugins: [buildPlugin(), ...]`，由 Vite 处理 Promise；若需同步数组，可在 `defineConfig(async () => ...)` 中 `await buildPlugin()`。
- `apply: 'build'`，仅参与生产构建，不在 dev server 单独承担 HTML 入口生成（dev 侧由 `@zelpis/render` 的插件等行为配合）。
- 若未配置 `config.zelpis`，会在配置阶段报错：`Zelpis render config not found`。
- 对每个含 `dslPath` 的 entry：扫描目录下所有 DSL 入口文件，加载并合并，供后续 HTML 生成与注入脚本使用。

## 配置示例

```typescript
import { buildPlugin } from '@zelpis/builder'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [buildPlugin()],
  zelpis: {
    entrys: [
      {
        basePath: '/',
        entryPath: './entry.ts',
        dslPath: './model',
        html: { meta: { title: 'App' } },
      },
    ],
    validateLevel: 'warn',
  },
})
```

实际项目多与 `renderPlugin`、`@vitejs/plugin-react`（或 Vue 插件）一起使用；也可直接依赖 `@zelpis/core/plugins`。

## 构建流程

1. 读取 `zelpis.entrys`。
2. 对每个 entry 的 `dslPath` 扫描 DSL 入口文件并加载合并。
3. 生成 HTML，写入临时目录并登记备份以便构建结束后恢复。
4. 将生成的 HTML 路径汇总为 `rollupOptions.input`，供 Rollup 多页构建。

## 相关链接

- [@zelpis/core](/packages/core)
- [@zelpis/render](/packages/render)
- [@zelpis/shared](/packages/shared)
