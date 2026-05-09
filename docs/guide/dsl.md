# DSL 配置指南

DSL (Domain-Specific Language) 是 Zelpis 的核心特性，通过 DSL 配置可以驱动前端渲染，减少重复代码，提高开发效率。

## 什么是 DSL？

DSL 是一种专门为特定领域设计的语言，在 Zelpis 中，DSL 是一种 JSON 或 TypeScript 对象格式，用于描述页面结构、组件配置和路由信息。

zelpis 中 对于 dsl 的消费主要模块导出内容，每个 zelpis.entrys 可配置一个 dslPath 目录；这个目录里可以包含多个 DSL 模块（多个子目录各自一个 index 文件），zelpis 读取 dslPath 去加载 DSL 内容，交给入口的 HTML 模版做渲染。

## 基本结构 (这里只是作为一个例子参考，实际上每个引入的板块的DSL结构不一定相同，根据渲染模版的定义来)

一个基本的 DSL 配置文件结构如下：

```typescript
export default {
  pages: [
    {
      id: 'home',
      url: '/',
      title: 'Home Page',
      component_type: 'SchemaPage',
      schema: {
        type: 'page',
        children: [
          // 组件配置
        ],
      },
    },
    // 更多页面...
  ],
}
```

## 组件注册

在 React 项目中，可以注册自定义组件：

```typescript
import { boot } from '@zelpis/core'
import { Button } from './custom-component/button'
import { register, Root } from './remote-template'

// 注册自定义组件
register('SchemaButton', Button)

export default boot({
  framework: 'react',
  Component: Root,
})
```


## 下一步

- [示例项目](/examples/)：查看完整的示例项目