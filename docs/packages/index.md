# 核心包文档

Zelpis 采用 monorepo 结构，包含多个核心包，每个包负责特定的功能。

## 包结构

```
packages/
├── core/          # 核心包，整合所有模块
├── builder/       # 构建相关功能
├── render/        # 渲染引擎，支持 React 和 Vue
├── shared/        # 共享工具和配置
└── template/      # 模板系统
```

## 包概述

| 包名 | 描述 | 主要功能 |
|------|------|----------|
| `@zelpis/core` | 核心包 | 整合所有模块，提供统一 API |
| `@zelpis/builder` | 构建工具 | Vite 插件，处理构建流程 |
| `@zelpis/render` | 渲染引擎 | 支持 CSR 和 SSR，支持 React/Vue |
| `@zelpis/shared` | 共享工具 | 通用工具函数和配置 |
| `@zelpis/template` | 模板系统 | 预设模板和组件 |

## 模块依赖关系

```
@zelpis/core
    ├── @zelpis/builder
    ├── @zelpis/render
    └── @zelpis/shared

@zelpis/builder
    ├── @zelpis/render
    └── @zelpis/shared

@zelpis/render
    └── @zelpis/shared

@zelpis/template
    └── @zelpis/core
```

## 快速导航

- [@zelpis/core](/packages/core) - 核心包
- [@zelpis/builder](/packages/builder) - 构建工具
- [@zelpis/render](/packages/render) - 渲染引擎
- [@zelpis/shared](/packages/shared) - 共享工具
- [@zelpis/template](/packages/template) - 模板系统
