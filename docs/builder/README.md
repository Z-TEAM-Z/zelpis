# @zelpis/builder

Zelpis Builder 是一个 Vite 插件，用于构建基于 DSL 的多入口应用程序。

## 安装

```bash
pnpm add @zelpis/builder
```

## 快速开始

在 `vite.config.ts` 中配置 Zelpis：

```typescript
import { buildPlugin } from '@zelpis/builder'
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

## 配置选项

### ZElpisConfig

主配置接口，在 Vite 配置的 `zelpis` 字段中使用。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `entrys` | `Entry[]` | ✅ | 入口配置数组，定义应用的多个入口点 |
| `defaultHtml` | `HtmlConfig` | ❌ | 全局默认 HTML 配置，会被各个 entry 的 html 配置覆盖 |

### Entry

入口配置接口，定义单个应用入口的相关信息。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `basePath` | `string` | ✅ | 应用的基础路径，如 `/` 或 `/admin` |
| `entryPath` | `string` | ✅ | 入口文件的路径，通常是 TypeScript/JavaScript 文件 |
| `dslPath` | `string` | ❌ | DSL 模型文件的目录路径 |
| `dslEntrys` | `any[]` | ❌ | DSL 入口数组（通常由构建器自动生成） |
| `html` | `HtmlConfig` | ❌ | 该入口特定的 HTML 配置 |

### HtmlConfig

HTML 配置接口，用于自定义生成的 HTML 文件。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `template` | `string` | ❌ | 自定义 HTML 模板文件路径 |
| `meta` | `MetaConfig` | ❌ | HTML meta 标签配置 |
| `head` | `string[]` | ❌ | 插入到 `<head>` 标签中的额外内容 |
| `body` | `BodyConfig` | ❌ | body 标签的属性和内容配置 |
| `custom` | `string` | ❌ | 完全自定义的 HTML 字符串，会覆盖所有其他配置 |

#### MetaConfig

| 字段 | 类型 | 说明 |
|------|------|------|
| `title` | `string` | 页面标题 |
| `description` | `string` | 页面描述 |
| `keywords` | `string` | 页面关键词 |
| `viewport` | `string` | viewport meta 标签内容 |
| `charset` | `string` | 字符编码 |
| `lang` | `string` | 页面语言 |

#### BodyConfig

| 字段 | 类型 | 说明 |
|------|------|------|
| `attributes` | `Record<string, string>` | body 标签的 HTML 属性 |
| `content` | `string` | 插入到 body 标签中的内容 |

## 使用示例

### 基础配置

最简单的配置，使用默认 HTML 模板：

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

### 自定义 Meta 信息

为应用添加 SEO 相关的 meta 信息：

```typescript
export default defineConfig({
  zelpis: {
    defaultHtml: {
      meta: {
        title: 'My Awesome App',
        description: 'A powerful application built with Zelpis',
        keywords: 'zelpis, vite, react, vue',
        viewport: 'width=device-width, initial-scale=1.0',
        charset: 'UTF-8',
        lang: 'zh-CN',
      },
    },
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

### 添加外部资源

在 head 中添加外部样式表、字体或其他资源：

```typescript
export default defineConfig({
  zelpis: {
    defaultHtml: {
      meta: {
        title: 'My App',
        charset: 'UTF-8',
      },
      head: [
        '<link rel="icon" href="/favicon.ico">',
        '<link rel="preconnect" href="https://fonts.googleapis.com">',
        '<link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">',
        '<script src="https://cdn.example.com/analytics.js"></script>',
      ],
    },
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

### 自定义 Body 属性

为 body 标签添加自定义属性（如主题类名）：

```typescript
export default defineConfig({
  zelpis: {
    entrys: [
      {
        basePath: '/',
        entryPath: './entry.ts',
        dslPath: './model',
        html: {
          body: {
            attributes: {
              'class': 'dark-theme',
              'data-theme': 'dark',
            },
          },
        },
      },
    ],
  },
})
```

### 使用自定义 HTML 模板

使用自己的 HTML 模板文件：

```typescript
export default defineConfig({
  zelpis: {
    entrys: [
      {
        basePath: '/',
        entryPath: './entry.ts',
        dslPath: './model',
        html: {
          template: './custom.html',
        },
      },
    ],
  },
})
```

**注意**：自定义模板中需要包含以下占位符：
- `<!-- app-html -->` - 应用挂载点将被插入此处
- `<!-- app-inject-script -->` - 应用脚本将被注入此处

示例模板 `custom.html`：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Custom Template</title>
</head>
<body>
  <!-- app-html -->
  <!-- app-inject-script -->
</body>
</html>
```

### 完全自定义 HTML

完全控制生成的 HTML 结构：

```typescript
export default defineConfig({
  zelpis: {
    entrys: [
      {
        basePath: '/',
        entryPath: './entry.ts',
        dslPath: './model',
        html: {
          custom: `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Custom HTML</title>
  <style>
    body { margin: 0; padding: 0; }
  </style>
</head>
<body>
  <div id="app"></div>
  <!-- app-inject-script -->
</body>
</html>
          `,
        },
      },
    ],
  },
})
```

### 多入口配置

配置多个应用入口，每个入口有不同的配置：

```typescript
export default defineConfig({
  zelpis: {
    // 全局默认配置
    defaultHtml: {
      meta: {
        charset: 'UTF-8',
        viewport: 'width=device-width, initial-scale=1.0',
      },
    },
    // 多个入口
    entrys: [
      {
        basePath: '/',
        entryPath: './main-entry.ts',
        dslPath: './model/main',
        html: {
          meta: {
            title: 'Main App',
            description: 'Main application',
          },
        },
      },
      {
        basePath: '/admin',
        entryPath: './admin-entry.ts',
        dslPath: './model/admin',
        html: {
          meta: {
            title: 'Admin Panel',
            description: 'Admin dashboard',
          },
          body: {
            attributes: {
              class: 'admin-theme',
            },
          },
        },
      },
    ],
  },
})
```

## DSL 路径配置

`dslPath` 用于指定 DSL 模型文件的目录。构建器会自动扫描该目录下的所有 `index.{ts,js,json}` 文件，并为每个 DSL 文件生成对应的入口页面。

目录结构示例：

```
model/
├── index.ts           # 生成 /index.html
├── taobao/
│   └── index.ts       # 生成 /taobao/index.html
│   └── shangou/
│       └── index.ts   # 生成 /taobao/shangou/index.html
```

## 配置优先级

HTML 配置的优先级从高到低：

1. `Entry.html` - 特定入口的 HTML 配置
2. `ZElpisConfig.defaultHtml` - 全局默认 HTML 配置
3. 内置默认配置

## TypeScript 支持

该包提供了完整的 TypeScript 类型定义，并扩展了 Vite 的配置类型：

```typescript
import type { Entry, HtmlConfig, ZElpisConfig } from '@zelpis/builder'

// 在 vite.config.ts 中可以获得完整的类型提示
export default defineConfig({
  zelpis: {
    // ... 完整的类型支持
  },
})
```

## 常见问题

### Q: 如何在开发和生产环境使用不同的配置？

A: 可以利用 Vite 的环境变量：

```typescript
export default defineConfig(({ mode }) => ({
  zelpis: {
    defaultHtml: {
      meta: {
        title: mode === 'production' ? 'My App' : 'My App (Dev)',
      },
      head: mode === 'production'
        ? ['<script src="https://analytics.example.com/script.js"></script>']
        : [],
    },
    entrys: [
      // ...
    ],
  },
}))
```

### Q: 自定义模板中的占位符是必须的吗？

A: 是的。`<!-- app-html -->` 和 `<!-- app-inject-script -->` 是必需的占位符，构建器会在这些位置注入应用的挂载点和脚本。

### Q: 可以动态生成 entry 配置吗？

A: 可以，entry 数组可以动态生成：

```typescript
const entrys = ['main', 'admin', 'mobile'].map(name => ({
  basePath: name === 'main' ? '/' : `/${name}`,
  entryPath: `./${name}-entry.ts`,
  dslPath: `./model/${name}`,
}))

export default defineConfig({
  zelpis: { entrys },
})
```
