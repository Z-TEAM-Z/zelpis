# @zelpis/builder

Zelpis Builder 是一个 Vite 插件，用于构建基于 DSL 的多入口应用程序。

## 安装

```bash
pnpm add @zelpis/builder
```

## 快速开始

在 `vite.config.ts` 中配置 Zelpis：

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
| `content` | `string` | 替换 body 标签中的所有内容（会完全覆盖原有内容）|

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

### 自定义 Body 内容

使用 `body.content` 可以完全替换 body 标签中的内容：

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
            content: `
              <div id="app" class="container">
                <div class="loading">Loading...</div>
              </div>
            `,
          },
        },
      },
    ],
  },
})
```

**注意**：`body.content` 会完全覆盖原有的 body 内容，请确保包含必要的应用挂载点（如 `<div id="app"></div>`）。

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
- `<!-- zelpis:app-body-start -->` - 应用挂载点将被插入此处
- `<!-- zelpis:app-inject-script -->` - 应用脚本将被注入此处

如果模板中缺少这些占位符，构建器会根据占位符名称自动判断并插入到合适的位置。

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
  <!-- zelpis:app-body-start -->
  <!-- zelpis:app-inject-script -->
</body>
</html>
```

### 完全自定义 HTML

完全控制生成的 HTML 结构（使用 `custom` 配置时会忽略其他所有 HTML 配置）：

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
  <!-- zelpis:app-inject-script -->
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

### HTML 配置优先级

HTML 配置的优先级从高到低：

1. **`Entry.html.custom`** - 完全自定义 HTML（最高优先级，会忽略所有其他配置）
2. **`Entry.html`** - 特定入口的 HTML 配置（会与 defaultHtml 合并）
3. **`ZElpisConfig.defaultHtml`** - 全局默认 HTML 配置
4. **内置默认配置** - 如果以上都未配置，使用内置默认模板

### 模板解析逻辑

模板的选择优先级：

1. **`html.custom`** - 如果设置了 custom，直接使用该 HTML 字符串，忽略其他所有配置
2. **基础模板** + **配置增强**：
   - **基础模板选择**（按优先级）：
     - `html.template` - 自定义模板文件路径
     - `index.html` - 项目根目录的 index.html 文件
     - 内置默认模板 - 如果以上都不存在
   - **配置增强**（在基础模板上应用）：
     - `html.meta` - 设置或更新 meta 标签
     - `html.head` - 在 `</head>` 前插入额外内容
     - `html.body` - 设置 body 属性或替换 body 内容

### 配置合并规则

- `Entry.html` 与 `defaultHtml` 会进行对象合并（浅合并）
- 如果 `Entry.html` 中设置了 `custom`，则忽略 `defaultHtml` 的所有配置
- `meta`、`head`、`body` 等子配置项也会进行合并，Entry 级别的配置优先

#### 配置合并示例

```typescript
export default defineConfig({
  zelpis: {
    // 全局默认配置
    defaultHtml: {
      meta: {
        charset: 'UTF-8',
        viewport: 'width=device-width, initial-scale=1.0',
        title: 'Default Title',
      },
      head: [
        '<link rel="icon" href="/favicon.ico">',
      ],
    },
    entrys: [
      {
        basePath: '/',
        entryPath: './entry.ts',
        dslPath: './model',
        html: {
          meta: {
            title: 'Custom Title', // 会覆盖 defaultHtml 的 title
            // charset 和 viewport 会从 defaultHtml 继承
          },
          head: [
            '<link rel="stylesheet" href="/custom.css">', // 会添加到 defaultHtml.head 之后
          ],
        },
      },
    ],
  },
})
```

**实际合并结果**：
- `meta.charset`: `'UTF-8'`（从 defaultHtml 继承）
- `meta.viewport`: `'width=device-width, initial-scale=1.0'`（从 defaultHtml 继承）
- `meta.title`: `'Custom Title'`（Entry.html 覆盖）
- `head`: 包含两个 link 标签（两者合并）

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

A: 不是必须的。虽然推荐在模板中显式包含 `<!-- zelpis:app-body-start -->` 和 `<!-- zelpis:app-inject-script -->` 占位符，但如果缺少，构建器会根据占位符名称中的关键词自动判断并插入到合适的位置：
- `app-body-start` 相关的占位符会插入到 `<body>` 标签之后
- `app-inject-script` 相关的占位符会插入到 `</body>` 标签之前

这种智能插入机制确保了即使忘记添加占位符，应用也能正常工作。

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

### Q: 如何在 HTML 模板中使用其他占位符？

A: 除了 `app-body-start` 和 `app-inject-script` 这两个特殊占位符，你还可以使用自定义占位符格式 `<!-- zelpis:your-name -->`。构建器会根据占位符名称中的关键词自动判断插入位置：

- 包含 `head-start` 或 `head-begin` → 插入到 `<head>` 标签之后
- 包含 `body-start` 或 `body-begin` → 插入到 `<body>` 标签之后
- 包含 `body-end` 或 `script` → 插入到 `</body>` 标签之前
- 包含 `head`、`meta`、`style`、`preload`、`link` → 插入到 `</head>` 标签之前

这种智能插入机制让你可以灵活地控制内容注入位置，而无需担心占位符放置不当。
