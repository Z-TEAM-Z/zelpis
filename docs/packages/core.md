# @zelpis/core

`@zelpis/core` 是 Zelpis 框架的核心包，整合了所有模块，提供统一的 API 入口。

## 安装

```bash
pnpm add @zelpis/core
```

## 核心功能

### 1. 应用启动

```typescript
import { boot } from '@zelpis/core'

export default boot({
  framework: 'react',
  Component: App,
  type: 'csr'
})
```

### 2. DSL 定义

```typescript
import { defineDsl } from '@zelpis/core'

const dsl = defineDsl({
  pages: [],
  global_config: {}
})
```

### 3. 插件系统

```typescript
import { buildPlugin, renderPlugin } from '@zelpis/core/plugins'
```

## 模块导出

### 主入口

```typescript
// @zelpis/core
export { boot } from '@zelpis/render'
export { defineDsl } from '@zelpis/render/dsl'
```

### 子模块

| 模块路径 | 导出内容 |
|----------|----------|
| `@zelpis/core/builder` | 构建相关 API |
| `@zelpis/core/dsl` | DSL 工具函数 |
| `@zelpis/core/plugins` | 插件系统 |

## API 参考

### boot(options)

启动应用，支持 React 和 Vue 框架。

### defineDsl(obj)

定义和验证 DSL 配置。

### 插件

- `buildPlugin()` - 构建插件
- `renderPlugin(options)` - 渲染插件

## 使用示例

### React 应用

```typescript
import { boot, defineDsl } from '@zelpis/core'
import App from './App'

const dsl = defineDsl({
  pages: [
    { id: 'home', url: '/', title: 'Home' }
  ]
})

export default boot({
  framework: 'react',
  Component: App,
  type: 'csr'
})
```

### Vue 应用

```typescript
import { boot, defineDsl } from '@zelpis/core'
import App from './App.vue'

const dsl = defineDsl({
  pages: [
    { id: 'home', url: '/', title: 'Home' }
  ]
})

export default boot({
  framework: 'vue',
  Component: App as any,
  type: 'csr'
})
```

## 依赖关系

```
@zelpis/core
    ├── @zelpis/builder
    ├── @zelpis/render
    └── @zelpis/shared
```

## 相关链接

- [@zelpis/render](/packages/render) - 渲染引擎
