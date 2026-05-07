# @zelpis/shared

`@zelpis/shared` 是 Zelpis 框架的共享工具包，提供通用工具函数和配置。

## 安装

```bash
pnpm add @zelpis/shared
```

## 核心功能

### 1. HTML 配置

```typescript
import { resolveHtmlTemplate } from '@zelpis/shared/html-config'

const template = resolveHtmlTemplate({
  title: 'My App',
  head: '<meta name="description" content="...">'
})
```

### 2. 工具函数

```typescript
import { once } from '@zelpis/shared'

const init = once(() => {
  console.log('Initialized')
})

init() // 执行
init() // 不执行（已初始化）
```

## API 参考

### resolveHtmlTemplate(options)

解析 HTML 模板。

#### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | `string` | 否 | 页面标题 |
| `head` | `string` | 否 | head 内容 |
| `body` | `string` | 否 | body 内容 |
| `template` | `string` | 否 | 自定义模板 |

#### 返回值

返回处理后的 HTML 字符串。

#### 使用示例

```typescript
import { resolveHtmlTemplate } from '@zelpis/shared/html-config'

const html = resolveHtmlTemplate({
  title: 'My App',
  head: '<link rel="stylesheet" href="/style.css">',
  body: '<div id="app"></div>'
})
```

### once(fn)

确保函数只执行一次。

#### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `fn` | `() => T` | 是 | 要执行的函数 |

#### 返回值

返回包装后的函数，确保只执行一次。

#### 使用示例

```typescript
import { once } from '@zelpis/shared'

const initialize = once(() => {
  return { initialized: true }
})

const result1 = initialize() // { initialized: true }
const result2 = initialize() // { initialized: true }（同一实例）
```

## 类型定义

### HtmlConfig

```typescript
interface HtmlConfig {
  title?: string
  head?: string
  body?: string
  template?: string
}
```

## 目录结构

```
packages/shared/
├── src/
│   ├── html-config/
│   │   ├── index.ts
│   │   ├── resolve-html-template.ts
│   │   └── types.ts
│   └── index.ts
├── package.json
└── tsdown.config.ts
```

## 依赖关系

`@zelpis/shared` 无外部依赖。

## 相关链接

- [@zelpis/core](/packages/core) - 核心包
- [@zelpis/render](/packages/render) - 渲染引擎
