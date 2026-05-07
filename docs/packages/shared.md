# @zelpis/shared

跨包复用的轻量运行时工具与 HTML 配置 / 模板解析实现：主入口目前仅导出 `once`；与 Zelpis 配置、构建注入强相关的能力集中在 `@zelpis/shared/html-config`。

## 安装

```bash
pnpm add @zelpis/shared
```

## `once(fn)`

返回包装函数：首次调用执行 `fn` 并缓存返回值，之后调用直接返回同一引用（实现见 `packages/shared/src/index.ts`）。

```typescript
import { once } from '@zelpis/shared'

const getClient = once(() => createExpensiveClient())
```

## `@zelpis/shared/html-config`

### `resolveHtmlTemplate(options: ResolveHtmlOptions): string`

| 字段 | 说明 |
|------|------|
| `entry` | 必填。含 `basePath`、`entryPath`、可选 `dslPath`、`html`、`dslEntrys`（多为内部填充） |
| `defaultHtml` | 与 `entry.html` 合并的默认 `HtmlConfig` |
| `rootDir` | 解析相对路径，默认 `process.cwd()` |
| `replacements` | 占位符 → 字符串片段 |
| `context` | 如 `entryPath`，用于解析/校验上下文 |
| `validateLevel` | HTML 校验级别，默认 `'warn'` |

### `HtmlConfig`

与源码 `packages/shared/src/html-config/types.ts` 一致：

- `template`：自定义 HTML 模板文件路径  
- `meta`：`title`、`description`、`keywords`、`viewport`、`charset`、`lang` 等  
- `head`：`string[]`，插入 head 的原始片段  
- `body`：`attributes`、`content`  
- `custom`：非空时作为完整 HTML，跳过其它增强字段  

### `ZElpisConfig`

Vite 根配置 `zelpis` 的类型：

- `entrys`：`Omit<Entry, 'dslEntrys'>[]`（`dslEntrys` 由构建插件写入）  
- `defaultHtml`：全局默认 HTML 片段  
- `validateLevel`：校验级别  

### 其它导出

- `getInjectScript(entryPath, options?)`：生成注入到页面的脚本内容。  
- `STANDARD_PLACEHOLDERS`：与模板 DOM 清理、占位符替换相关的常量（供 builder / render 与 `resolveHtmlTemplate` 对齐）。

## 源码目录

```text
packages/shared/
├── package.json
├── tsdown.config.ts
└── src/
    ├── index.ts                          # 仅导出 once
    └── html-config/
        ├── index.ts                      # 对外聚合：resolveHtmlTemplate、getInjectScript、类型…
        ├── types.ts                      # HtmlConfig、Entry、ZElpisConfig、ResolveHtmlOptions …
        ├── resolve-html-template.ts      # 模板解析主流程、占位符流水线
        ├── dom/
        │   ├── index.ts
        │   ├── parser.ts                 # parseHtml / serializeHtml
        │   ├── element.ts                # 查改节点
        │   ├── attribute.ts
        │   └── content.ts                # body 内容替换等
        ├── injection/
        │   ├── index.ts
        │   ├── placeholders.ts           # STANDARD_PLACEHOLDERS 等
        │   ├── script-generator.ts       # getInjectScript
        │   ├── script-merger.ts          # smartMergePlaceholders
        │   └── script-cleaner.ts         # cleanAppInjectScriptDom
        └── validation/
            ├── index.ts
            ├── types.ts                  # 校验结果类型
            ├── validator.ts              # validateHtmlTemplate
            ├── formatters.ts             # formatValidationOutput
            └── messages.ts
```

## 相关链接

- [@zelpis/core](/packages/core)
- [@zelpis/render](/packages/render)
- [@zelpis/builder](/packages/builder)
