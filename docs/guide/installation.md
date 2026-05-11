# 安装指南

本指南将帮助您：
在业务项目中接入 `@zelpis/core`。
克隆本仓库后如何跑通示例。

## 环境要求

与当前仓库根目录 `package.json` 保持一致（版本以后续仓库为准）：

| 工具 | 说明 |
|------|------|
| Vite | 作为业务项目的 devDependency 安装；版本需满足 `@zelpis/core` 对 `vite` 的 peer 要求（与框架发布说明或 npm 元数据一致）|

***

## 在业务项目中安装

只需要安装 `@zelpis/core` 即可：`@zelpis/builder`、`@zelpis/render`、`@zelpis/shared` 会作为其依赖由包管理器一并解析，不必再单独 `pnpm add @zelpis/builder`。

```bash
pnpm add @zelpis/core
```

***

## 克隆本仓库并运行官方示例

示例位于 `examples/react-example`、`examples/vue-example`，先安装对应的依赖包，然后进入对应的示例位置，执行对应的命令行启动程序。

```bash
git clone https://github.com/Z-TEAM-Z/zelpis.git
pnpm install
pnpm build
```

运行示例（任选其一）：

```bash
# 在仓库根目录用 filter
pnpm --filter react-example dev
pnpm --filter vue-example dev
```

或进入目录后执行（pnpm install）：

```bash
cd examples/react-example && pnpm dev
cd examples/vue-example && pnpm dev
```

***

## 配置 Vite

### 插件

从 `@zelpis/core/plugins` 使用 `zelpisPlugin` 即可：内部等价于同时使用 `buildPlugin` + `renderPlugin`。只有在你需要分别传参时，才手动拆成两个插件。

```typescript
import { zelpisPlugin } from '@zelpis/core/plugins'

zelpisPlugin({
  // build: { },   // 传给 builder 插件（可选）
  render: { baseDir: './' }, // 解析 entryPath / dslPath 时使用的基准目录，一般为项目根
})
```

### 根配置 `zelpis`

渲染插件会读取 `config.zelpis`；若缺少该字段，渲染插件在配置阶段会报错。因此必须在 `defineConfig` 里提供 `zelpis`，至少包含 `entrys`。

每个 入口（`entrys` 中一项）常用字段：

| 字段          | 说明 |
| ----------- | -------------------------------------------------------------------- |
| `entryPath` | 调用 `boot` 的入口文件（如 `entry.ts`） |
| `basePath`  | 该入口对应的 URL 前缀（如 `/` 或 `/vue`） |
| `dslPath`   | DSL 模块目录；**可省略**，省略时默认为入口文件同目录下的 `model`（与 `@zelpis/render` 内解析逻辑一致） |
| `html`      | 该入口的 HTML 片段配置（可选） |

全局还可配置 `defaultHtml`、`validateLevel` 等（类型见 `@zelpis/shared/html-config`）。

### 完整示例（Vue）

```typescript
import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import { zelpisPlugin } from '@zelpis/core/plugins'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    zelpisPlugin({
      render: { baseDir: './' },
    }),
  ],
  zelpis: {
    entrys: [
      {
        entryPath: path.resolve(__dirname, './entry.ts'),
        basePath: '/',
        dslPath: path.resolve(__dirname, './model'),
      },
    ],
  },
})
```

React 项目将 `vue()` 换成 `viteReact()`（`@vitejs/plugin-react`），其余 `zelpis` 结构相同。

入口文件需 `export default boot({ ... })`
详见 [快速开始](/guide/quick-start/) 与 [示例项目](/examples/)。

***

## 推荐目录（商场模版项目）例子

```text
project/
├── public/
├── src/
│   ├── pages/
│   │   ├── vue/
│   │   │   ├── entry.ts              # boot；registerApi / registerComponent；引用模板包
│   │   │   └── model/
│   │   │       └── index.ts          # dslPath；默认导出 DSL（字段由模板 types/dsl 约定）
│   │   └── react/
│   │       ├── entry.ts
│   │       └── model/
│   │           └── index.ts
│   └── template/                     # 模板层；
│       ├── utils/                    # 工具
│       ├── vue/
│       │   ├── app.vue               # 根组件：收 dsl、provide、RouterView
│       │   ├── layout/
│       │   ├── router/               # 路由
│       │   ├── api/                  # 请求封装、接口注册；与 model 里 apiMap 对齐
│       │   ├── components/           # 通用组件；extend/ 可放 DSL 扩展组件映射
│       │   ├── pages/
│       │   ├── types/                # 含 dsl.ts
│       │   ├── constant/
│       │   └── global.css
│       └── react/
│           ├── app.tsx
│           ├── index.tsx
│           ├── layout/
│           ├── router/
│           ├── api/
│           ├── components/
│           ├── pages/
│           ├── context/              # 如 DSLProvider
│           └── types/
├── vite.config.ts                    
├── tsconfig.json
├── package.json
└── index.html                        
```

## 下一步

- [快速开始](/guide/quick-start/)
- [示例项目](/examples/)

