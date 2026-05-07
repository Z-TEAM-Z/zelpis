# @zelpis/builder

`@zelpis/builder` 是 Zelpis 框架的构建工具包，提供 Vite 插件和构建流程管理。

## 安装

```bash
pnpm add -D @zelpis/builder
```

## 核心功能

### 1. Vite 构建插件

```typescript
import { buildPlugin } from '@zelpis/builder'

export default defineConfig({
  plugins: [buildPlugin()]
})
```

### 2. 构建流程管理

```typescript
import { defineBuildConfig } from '@zelpis/builder'

export default defineBuildConfig({
  entrys: [
    { basePath: '/', entryPath: './entry.ts' }
  ]
})
```

## API 参考

### buildPlugin(options)

创建 Vite 构建插件。

#### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `entrys` | `Array` | 是 | 入口配置数组 |
| `baseDir` | `string` | 否 | 基础目录 |

#### 使用示例

```typescript
import { buildPlugin } from '@zelpis/builder'

export default defineConfig({
  plugins: [
    buildPlugin({
      entrys: [
        {
          basePath: '/',
          entryPath: './src/entry.ts',
          dslPath: './src/model'
        }
      ],
      baseDir: './'
    })
  ]
})
```

### defineBuildConfig(options)

定义构建配置。

## 入口配置

```typescript
interface EntryConfig {
  basePath: string        // 基础路径
  entryPath: string       // 入口文件路径
  dslPath?: string        // DSL 配置路径
  templatePath?: string   // 模板路径
}
```

## 构建流程

1. **解析入口配置**：读取所有入口配置
2. **加载 DSL**：根据配置加载 DSL 文件
3. **生成路由**：根据 DSL 生成路由配置
4. **构建应用**：使用 Vite 构建应用

## 目录结构

```
packages/builder/
├── src/
│   ├── plugins/
│   │   ├── builder-plugin.ts
│   │   └── index.ts
│   └── index.ts
├── package.json
└── tsdown.config.ts
```

## 依赖关系

```
@zelpis/builder
    ├── @zelpis/render
    └── @zelpis/shared
```

## 相关链接

- [@zelpis/core](/packages/core) - 核心包
- [@zelpis/render](/packages/render) - 渲染引擎
