# DSL 配置指南

DSL (Domain-Specific Language) 是 Zelpis 的核心特性，通过 DSL 配置可以驱动前端渲染，减少重复代码，提高开发效率。

## 什么是 DSL？

DSL 是一种专门为特定领域设计的语言，在 Zelpis 中，DSL 是一种 JSON 或 TypeScript 对象格式，用于描述页面结构、组件配置和路由信息。

## 基本结构

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

## 页面配置

每个页面配置包含以下字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 页面唯一标识符 |
| `url` | `string` | 页面路由路径 |
| `title` | `string` | 页面标题 |
| `component_type` | `string` | 页面组件类型 |
| `schema` | `object` | 页面结构配置 |

## 组件配置

组件配置包含以下字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | `string` | 组件类型 |
| `props` | `object` | 组件属性 |
| `children` | `array` | 子组件（可选） |

## 示例：基本页面

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
          {
            type: 'text',
            props: {
              content: 'Welcome to Zelpis!',
              style: {
                fontSize: '24px',
                textAlign: 'center',
                marginTop: '50px',
              },
            },
          },
          {
            type: 'button',
            props: {
              text: 'Click Me',
              onClick: () => alert('Hello!'),
              style: {
                marginTop: '20px',
                padding: '10px 20px',
              },
            },
          },
        ],
      },
    },
  ],
}
```

## 示例：嵌套组件

```typescript
export default {
  pages: [
    {
      id: 'about',
      url: '/about',
      title: 'About Page',
      component_type: 'SchemaPage',
      schema: {
        type: 'page',
        children: [
          {
            type: 'container',
            props: {
              style: {
                maxWidth: '800px',
                margin: '0 auto',
                padding: '20px',
              },
            },
            children: [
              {
                type: 'text',
                props: {
                  content: 'About Us',
                  style: {
                    fontSize: '32px',
                    fontWeight: 'bold',
                    marginBottom: '20px',
                  },
                },
              },
              {
                type: 'text',
                props: {
                  content: 'Zelpis is a DSL-driven frontend rendering framework.',
                  style: {
                    fontSize: '16px',
                    lineHeight: '1.5',
                  },
                },
              },
            ],
          },
        ],
      },
    },
  ],
}
```

## 示例：表单页面

```typescript
export default {
  pages: [
    {
      id: 'contact',
      url: '/contact',
      title: 'Contact Page',
      component_type: 'SchemaPage',
      schema: {
        type: 'page',
        children: [
          {
            type: 'form',
            props: {
              onSubmit: (data) => console.log('Form submitted:', data),
              style: {
                maxWidth: '500px',
                margin: '0 auto',
                padding: '20px',
                border: '1px solid #ccc',
                borderRadius: '8px',
              },
            },
            children: [
              {
                type: 'input',
                props: {
                  name: 'name',
                  label: 'Name',
                  placeholder: 'Enter your name',
                  style: {
                    marginBottom: '15px',
                  },
                },
              },
              {
                type: 'input',
                props: {
                  name: 'email',
                  label: 'Email',
                  type: 'email',
                  placeholder: 'Enter your email',
                  style: {
                    marginBottom: '15px',
                  },
                },
              },
              {
                type: 'textarea',
                props: {
                  name: 'message',
                  label: 'Message',
                  placeholder: 'Enter your message',
                  style: {
                    marginBottom: '15px',
                    height: '100px',
                  },
                },
              },
              {
                type: 'button',
                props: {
                  text: 'Submit',
                  type: 'submit',
                  style: {
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  },
                },
              },
            ],
          },
        ],
      },
    },
  ],
}
```

## 路由生成

在 Vue 项目中，可以根据 DSL 配置自动生成路由：

```typescript
import { boot } from '@zelpis/core'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import dsl from './model/index'
import SchemaPage from './components/SchemaPage.vue'
import IframePage from './components/IframePage.vue'

// 生成路由配置
const routes = dsl.pages.map((page) => {
  const component = page.component_type === 'SchemaPage' ? SchemaPage : IframePage
  return {
    path: page.url,
    name: page.id,
    component,
    props: {
      pageConfig: page,
      dsl
    }
  }
})

// 创建路由器
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default boot({
  framework: 'vue',
  Component: App as any,
  mount(app) {
    app.use(router)
  },
})
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

## 最佳实践

1. **模块化**：将 DSL 配置按功能或页面拆分到不同的文件中
2. **类型定义**：使用 TypeScript 为 DSL 配置添加类型定义
3. **组件复用**：通过 DSL 配置复用组件，减少重复代码
4. **配置分离**：将静态配置和动态数据分离，提高可维护性
5. **版本控制**：将 DSL 配置纳入版本控制，便于协作和回滚

## 下一步

- [核心 API](/api/)：了解 Zelpis 的核心 API
- [示例项目](/examples/)：查看完整的示例项目