# 安装指南

本指南将帮助您在项目中安装和配置 Zelpis。

## 前提条件

在安装 Zelpis 之前，请确保您的环境满足以下要求：

- **Node.js**：版本 16.0 或更高
- **pnpm**：版本 7.0 或更高（推荐使用 pnpm 作为包管理器）
- **Vite**：版本 4.0 或更高

## 安装方法

### 方法一：在现有项目中安装

1. **安装核心包**：

   ```bash
   pnpm add @zelpis/core
   ```

2. **安装构建工具**（可选，用于 DSL 驱动的构建）：

   ```bash
   pnpm add -D @zelpis/builder
   ```

### 方法二：使用示例项目作为起点

1. **克隆 Zelpis 仓库**：

   ```bash
   git clone https://github.com/your-username/zelpis.git
   cd zelpis
   ```

2. **安装依赖**：

   ```bash
   pnpm install
   ```

3. **构建项目**：

   ```bash
   pnpm build
   ```

## 配置 Vite

在 `vite.config.ts` 文件中配置 Zelpis：

### 基本配置

```typescript
import { buildPlugin } from '@zelpis/core/plugins'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    buildPlugin(),
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

### React 项目配置

```typescript
import viteReact from '@vitejs/plugin-react'
import { buildPlugin, renderPlugin } from '@zelpis/core/plugins'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    viteReact(),
    buildPlugin(),
    renderPlugin({ baseDir: './' }),
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

### Vue 项目配置

```typescript
import vue from '@vitejs/plugin-vue'
import { buildPlugin, renderPlugin } from '@zelpis/core/plugins'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    buildPlugin(),
    renderPlugin({ baseDir: './' }),
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

## 目录结构

推荐的项目目录结构：

```
├── model/            # DSL 配置目录
│   ├── index.ts      # 主 DSL 配置
│   └── other/        # 其他 DSL 配置
├── components/       # 组件目录
├── entry.ts          # 应用入口文件
├── vite.config.ts    # Vite 配置文件
└── package.json      # 项目配置文件
```

## 下一步

- [快速开始](/guide/quick-start/)：了解如何快速创建一个 Zelpis 应用
- [示例项目](/examples/)：查看完整的示例项目