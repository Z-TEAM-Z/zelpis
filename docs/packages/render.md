# @zelpis/render

运行时渲染与 DSL 处理：`boot` 挂载 React/Vue 根组件；`renderPlugin` 在开发/构建中与 HTML、虚拟模块配合；`@zelpis/render/dsl` 提供定义与合并；`@zelpis/render/dsl/server` 提供 Node 环境下的 `loadDsl`。

## 安装

```bash
pnpm add @zelpis/render
```
## `boot(options)`

- `framework`：`'react' | 'vue'`（必填）
- `Component`：根组件（必填）
- `type`：可选 `'csr' | 'ssr'`。在常见浏览器入口中，非 CSR 会打印警告并强制为 CSR；SSR 分支在 `import.meta.env.SSR` 且 `type !== 'csr'` 时走另一套 `render(props)` 返回值（见 `packages/render/src/boot.ts`）。
- `mount`：可选，框架相关的根实例回调。

`boot` 本身用 `@zelpis/shared` 的 `once` 包装，多次调用返回同一结果。

客户端水合逻辑在 `src/hydrates/react.ts`、`vue.ts`，由 `boot` 内部动态 `import`；未在 `package.json` 的 `exports` 中暴露，业务代码请勿依赖 `@zelpis/render/hydrates/...` 深路径。

## `renderPlugin(options?)`

- `baseDir`：解析 `zelpis.entrys` 里 `entryPath`、`dslPath` 时使用的基准目录，默认 `process.cwd()`。
- 插件会读取 Vite 配置上的 `config.zelpis`（类型为 `@zelpis/shared/html-config` 的 `ZElpisConfig`）；缺失会抛错。
- 未写 `dslPath` 时，会默认解析为 `dirname(entryPath)/model`。
- 提供虚拟模块 `virtual:zelpis/render-config`（内部解析 id 带 `\0` 前缀），用于在运行时注入合并后的配置。

与 `@zelpis/builder` 的 `buildPlugin` 配合使用：构建插件负责多 HTML 入口，渲染插件负责 dev / 解析与 DSL 相关逻辑。

## DSL API

### `defineDsl(obj)`

返回传入对象。`DSL` 接口当前为空对象类型，可在业务侧用 `satisfies` 或自管接口约束字段。

### `mergeDsl(target, ...sources)`

合并：从 `target` 拷贝后依次 `Object.assign` 各 `source`，返回新对象。

### `loadDsl(modelDir, dslName)`（`@zelpis/render/dsl/server`）

- `modelDir`：DSL 根目录（或入口文件路径，内部会解析 `index.{ts,js,json}`）。
- `dslName`：`string[]`，表示相对 `modelDir` 的路径段（如 `['taobao','shangou']`），用于逐级加载并合并子目录默认导出。

使用 jiti 在 Node 中执行 TS/JS/JSON 模块。

## 源码目录

```text
packages/render/src/
├── boot.ts
├── dsl/
│   ├── define.ts
│   ├── merge.ts
│   ├── load.ts
│   ├── server.ts      # 再导出 load
│   └── index.ts       # define + merge
├── hydrates/
│   ├── react.ts
│   └── vue.ts
├── plugins/
│   ├── render-plugin.ts
│   └── index.ts
└── index.ts
```

## 相关链接

- [@zelpis/core](/packages/core)
- [@zelpis/shared](/packages/shared)
