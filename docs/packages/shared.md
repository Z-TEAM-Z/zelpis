# @zelpis/shared

跨包复用的轻量运行时工具与 HTML 配置 / 模板解析实现。

## 安装

```bash
pnpm add @zelpis/shared
```

## `once(fn)`

返回包装函数：首次调用执行 `fn` 并缓存返回值，之后调用直接返回同一引用。

```typescript
import { once } from '@zelpis/shared'

const getClient = once(() => createExpensiveClient())

// 第一次调用会执行 createExpensiveClient()
const client1 = getClient()
// 第二次调用直接返回缓存的结果
const client2 = getClient()
// client1 === client2
```

## `@zelpis/shared/html-config`

HTML 配置解析与模板处理工具，主要用于构建时生成最终 HTML。

### `resolveHtmlTemplate(options)`

根据配置生成最终 HTML 字符串。

**参数：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `entry` | `Entry` | ✅ | 入口配置，含 `basePath`、`entryPath`、可选 `dslPath`、`html` |
| `defaultHtml` | `HtmlConfig` | ❌ | 与 `entry.html` 合并的默认配置 |
| `rootDir` | `string` | ❌ | 解析相对路径，默认 `process.cwd()` |
| `replacements` | `Record<string, string>` | ❌ | 占位符替换映射 |
| `context` | `string` | ❌ | 解析/校验上下文 |
| `validateLevel` | `false \| 'warn' \| 'strict'` | ❌ | HTML 校验级别，默认 `'warn'` |

### `HtmlConfig`

HTML 配置接口：

- `template`：自定义 HTML 模板文件路径
- `meta`：`title`、`description`、`keywords`、`viewport`、`charset`、`lang` 等
- `head`：`string[]`，插入 head 的原始片段
- `body`：`attributes`、`content`
- `custom`：非空时作为完整 HTML，跳过其它增强字段

### `ZElpisConfig`

Vite 根配置 `zelpis` 的类型：

- `entrys`：入口配置数组（`dslEntrys` 由构建插件自动生成）
- `defaultHtml`：全局默认 HTML 片段
- `validateLevel`：校验级别

### 其它导出

- `getInjectScript(entryPath, options?)`：生成注入到页面的脚本内容
- `STANDARD_PLACEHOLDERS`：模板占位符常量

## 相关链接

- [@zelpis/core](/packages/core)
- [@zelpis/render](/packages/render)
- [@zelpis/builder](/packages/builder)
