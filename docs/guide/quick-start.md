# 快速开始

本指南将帮助您快速创建和运行一个 Zelpis 应用。

## 创建 React 应用

### 步骤 1：创建项目

使用 Vite 创建一个新的 React 项目：

```bash
pnpm create vite my-react-app --template react-ts
cd my-react-app
```

### 步骤 2：安装 Zelpis

```bash
pnpm add @zelpis/core
pnpm add -D @zelpis/builder
```

### 步骤 3：配置 Vite

修改 `vite.config.ts` 文件：

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
        entryPath: './src/entry.tsx',
        dslPath: './src/model',
      },
    ],
  },
})
```

### 步骤 4：创建入口文件

创建 `src/entry.tsx` 文件：

```typescript
import { boot } from '@zelpis/core'
import App from './App'

export default boot({
  framework: 'react',
  Component: App,
})
```

### 步骤 5：创建 DSL 配置

创建 `src/model/index.ts` 文件：

```typescript
export default {
  pages: [
    {
      id: 'home',
      url: '/',
      title: 'Home Page',
      component_type: 'SchemaPage',
      schema: {
        type: 'page',
        children: [
          {
            type: 'text',
            props: {
              content: 'Hello, Zelpis!',
              style: {
                fontSize: '24px',
                textAlign: 'center',
                marginTop: '50px',
              },
            },
          },
        ],
      },
    },
  ],
}
```

### 步骤 6：运行应用

```bash
pnpm dev
```

## 创建 Vue 应用

### 步骤 1：创建项目

使用 Vite 创建一个新的 Vue 项目：

```bash
pnpm create vite my-vue-app --template vue-ts
cd my-vue-app
```

### 步骤 2：安装 Zelpis

```bash
pnpm add @zelpis/core
pnpm add -D @zelpis/builder
```

### 步骤 3：配置 Vite

修改 `vite.config.ts` 文件：

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
        entryPath: './src/entry.ts',
        dslPath: './src/model',
      },
    ],
  },
})
```

### 步骤 4：创建入口文件

创建 `src/entry.ts` 文件：

```typescript
import { boot } from '@zelpis/core'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import dsl from './model/index'

// 生成路由配置
const routes = dsl.pages.map((page) => {
  return {
    path: page.url,
    name: page.id,
    component: () => import('./components/SchemaPage.vue'),
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

export default boot({
  framework: 'vue',
  Component: App as any,
  mount(app) {
    app.use(router)
  },
})
```

### 步骤 5：创建 SchemaPage 组件

创建 `src/components/SchemaPage.vue` 文件：

```vue
<template>
  <div class="schema-page">
    <h1>{{ pageConfig.title }}</h1>
    <component
      v-for="(item, index) in pageConfig.schema.children"
      :key="index"
      :is="getComponent(item.type)"
      :props="item.props"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  pageConfig: any
  dsl: any
}

const props = defineProps<Props>()

const getComponent = (type: string) => {
  // 根据类型返回对应的组件
  switch (type) {
    case 'text':
      return {
        template: '<div :style="props.style">{{ props.content }}</div>',
        props: ['props']
      }
    default:
      return {
        template: '<div>Unknown component: {{ type }}</div>',
        props: ['type']
      }
  }
}
</script>

<style scoped>
.schema-page {
  padding: 20px;
}
</style>
```

### 步骤 6：创建 DSL 配置

创建 `src/model/index.ts` 文件：

```typescript
export default {
  pages: [
    {
      id: 'home',
      url: '/',
      title: 'Home Page',
      component_type: 'SchemaPage',
      schema: {
        type: 'page',
        children: [
          {
            type: 'text',
            props: {
              content: 'Hello, Zelpis!',
              style: {
                fontSize: '24px',
                textAlign: 'center',
                marginTop: '50px',
              },
            },
          },
        ],
      },
    },
  ],
}
```

### 步骤 7：运行应用

```bash
pnpm dev
```

## 下一步

- [核心 API](/api/)：了解 Zelpis 的核心 API
- [DSL 配置](/guide/dsl/)：学习如何使用 DSL 配置驱动前端渲染
- [示例项目](/examples/)：查看完整的示例项目