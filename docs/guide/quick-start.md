# 快速开始

## 新建 Vue 项目

### 1. 脚手架与依赖（注：在使用脚手架命令的时候会自动添加对应框架的依赖项和插件，一般无需手动添加）

```bash
pnpm create vite my-zelpis-vue --template vue-ts
pnpm add @zelpis/core
```

### 2. `vite.config.ts`

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
        entryPath: path.resolve(__dirname, './src/entry.ts'),
        basePath: '/',
        dslPath: path.resolve(__dirname, './src/model'),
      },
    ],
    validateLevel: 'warn',
  },
})
```

### 3. 维护基础文件，具体template可以根据不同应用维护

```text
project/
├── public/
├── src/
│   ├── pages/
│   │   └── vue/
│   │       ├── entry.ts              # boot；registerApi / registerComponent；引用模板包
│   │       └── model/
│   │           └── index.ts          # dslPath；默认导出 DSL（字段由模板 types/dsl 约定）
│   └── template/                     # 模板层，位于 src 下
│       ├── utils/                    # 与框架无关的工具（日志等）
│       └── vue/
│           ├── app.vue               # 根组件：收 dsl、provide、RouterView
│           ├── layout/
│           ├── router/               # 路由
│           ├── api/                  # 请求封装、接口注册；与 model 里 apiMap 对齐
│           ├── components/           # 通用组件；extend/ 可放 DSL 扩展组件映射
│           ├── pages/
│           ├── types/                # 含 dsl.ts
│           ├── constant/
│           └── global.css
├── vite.config.ts
├── tsconfig.json
├── package.json
└── index.html
```

### 4. `pnpm dev` 本地端口
```text
http://localhost:5174/vue
```
---

## 新建 React 项目

### 1. 脚手架与依赖

```bash
pnpm create vite my-zelpis-react --template react-ts
pnpm add @zelpis/core
pnpm add -D @vitejs/plugin-react
```

### 2. `vite.config.ts`

```typescript
import path from 'node:path'
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
        entryPath: path.resolve(__dirname, './src/entry.tsx'),
        basePath: '/',
        dslPath: path.resolve(__dirname, './src/model'),
      },
    ],
    validateLevel: 'warn',
  },
})
```

### 3. 维护基础文件，具体template可以根据不同应用维护

```text
project/
├── public/
├── src/
│   ├── pages/
│   │   └── react/
│   │       ├── entry.ts
│   │       └── model/
│   │           └── index.ts
│   └── template/                       # 模板层，位于 src 下
│       ├── utils/                      # 与框架无关的工具（日志等）
│       └── react/
│           ├── app.tsx
│           ├── index.tsx
│           ├── layout/
│           ├── router/
│           ├── api/
│           ├── components/
│           ├── pages/
│           ├── context/                # 如 DSLProvider
│           └── types/
├── vite.config.ts
├── tsconfig.json
├── package.json
└── index.html
```


### 4. `pnpm dev` 本地端口
```text
http://localhost:5174/react
```
