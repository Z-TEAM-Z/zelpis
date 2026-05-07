# @zelpis/render

`@zelpis/render` 是 Zelpis 框架的渲染引擎，支持客户端渲染（CSR）和服务端渲染（SSR），同时支持 React 和 Vue 框架。

## 安装

```bash
pnpm add @zelpis/render
```

## 核心功能

### 1. 应用启动

```typescript
import { boot } from '@zelpis/render'

export default boot({
  framework: 'react',
  Component: App
})
```

### 2. 客户端水合

```typescript
import { hydrate } from '@zelpis/render/hydrates/react'

hydrate('csr', <App />, props, mount)
```

### 3. DSL 处理

```typescript
import { loadDsl, mergeDsl, defineDsl } from '@zelpis/render/dsl'
```

## API 参考

### boot(options)

启动应用，根据配置选择 CSR 或 SSR 模式。

#### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `framework` | `'react' \| 'vue'` | 是 | 前端框架 |
| `Component` | `(props: any) => any` | 是 | 根组件 |
| `type` | `'csr' \| 'ssr'` | 否 | 渲染模式 |
| `mount` | `(app: any) => void` | 否 | 挂载回调 |

#### 返回值

- CSR 模式：返回 `{ option, render }`
- SSR 模式：返回 `{ option, render(props) }`

### hydrate(type, Component, props, mount)

客户端水合函数，将组件渲染到 DOM。

### loadDsl(modelDir, dslName)

加载 DSL 配置文件。

### mergeDsl(base, ...dsls)

合并多个 DSL 对象。

### defineDsl(obj)

定义和验证 DSL 配置。

## 渲染模式

### CSR (客户端渲染)

```typescript
boot({
  framework: 'react',
  Component: App,
  type: 'csr'
})
```

### SSR (服务端渲染)

```typescript
boot({
  framework: 'react',
  Component: App,
  type: 'ssr'
})
```

## 框架支持

### React

```typescript
import { hydrate } from '@zelpis/render/hydrates/react'
```

### Vue

```typescript
import { hydrate } from '@zelpis/render/hydrates/vue'
```

## 目录结构

```
packages/render/
├── src/
│   ├── dsl/
│   │   ├── define.ts
│   │   ├── index.ts
│   │   ├── load.ts
│   │   ├── merge.ts
│   │   └── server.ts
│   ├── hydrates/
│   │   ├── react.ts
│   │   └── vue.ts
│   ├── plugins/
│   │   ├── index.ts
│   │   └── render-plugin.ts
│   ├── boot.ts
│   └── index.ts
├── package.json
└── tsdown.config.ts
```

## 依赖关系

```
@zelpis/render
    └── @zelpis/shared
```

