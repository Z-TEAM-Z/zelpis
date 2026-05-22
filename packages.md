---
url: /zelpis/packages.md
---
# 包文档概览

Zelpis 以 monorepo 管理多个 npm 包：`@zelpis/core` 聚合对外入口，其余包按职责拆分，便于单独版本与依赖管理。

## 包一览

[@zelpis/core](/packages/core) | 聚合 `@zelpis/render`、`@zelpis/builder` 能力；提供 `@zelpis/core/plugins`、`@zelpis/core/dsl`、`@zelpis/core/builder` 子路径 ｜

[@zelpis/render](/packages/render) | 运行时启动（`boot`）、DSL 定义与合并、Vite 渲染插件、Node 侧 `loadDsl` |

[@zelpis/builder](/packages/builder) | 构建期 Vite 插件：扫描 DSL、生成多 HTML 入口 |

[@zelpis/shared](/packages/shared) | 通用工具（`once`）与 HTML 模板解析、注入、校验（`@zelpis/shared/html-config`） |

## 依赖关系

```text
@zelpis/core
  ├── @zelpis/builder
  ├── @zelpis/render
  └── @zelpis/shared

@zelpis/builder
  ├── @zelpis/render  （构建时调用 dsl/server）
  └── @zelpis/shared

@zelpis/render
  └── @zelpis/shared
```

## 文档索引

* [@zelpis/core](/packages/core)
* [@zelpis/render](/packages/render)
* [@zelpis/builder](/packages/builder)
* [@zelpis/shared](/packages/shared)
