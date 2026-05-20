import type { DefaultTheme } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { defineConfig } from 'vitepress'
import llmstxt from 'vitepress-plugin-llms'
import { version } from '../../package.json'
import vite from './vite.config'

const GUIDES: DefaultTheme.NavItemWithLink[] = [
  { text: '快速开始', link: '/guide/quick-start' },
  { text: '安装与使用', link: '/guide/installation' },
  { text: 'DSL 配置', link: '/guide/dsl' },
]

/** 侧栏：core 为入口，其余为内置模块说明 */
const PACKAGE_SIDEBAR: DefaultTheme.NavItemWithLink[] = [
  { text: '@zelpis/core', link: '/packages/core' },
  { text: '@zelpis/builder', link: '/packages/builder' },
  { text: '@zelpis/render', link: '/packages/render' },
  { text: '@zelpis/shared', link: '/packages/shared' },
]

const EXAMPLES: DefaultTheme.NavItemWithLink[] = [
  { text: '示例', link: '/examples/' },
]

export default defineConfig({
  title: 'Zelpis',
  description: '一个 DSL 驱动的跨框架前端渲染框架',
  ignoreDeadLinks: [
    /localhost/,
    /127\.0\.0\.1/,
  ],
  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    codeTransformers: [
      transformerTwoslash(),
    ],
    languages: ['js', 'jsx', 'ts', 'tsx'],
  },
  cleanUrls: true,
  vite: {
    ...vite,
    plugins: [
      ...(vite.plugins || []),
      ...llmstxt(),
    ],
  },
  themeConfig: {
    nav: [
      {
        text: '指南',
        items: [
          {
            items: GUIDES,
          },
        ],
      },
      { text: '插件', link: '/packages/core' },
      {
        text: '示例',
        items: [
          {
            items: EXAMPLES,
          },
        ],
      },
      {
        text: `v${version}`,
        link: '/',
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '快速开始', link: '/guide/quick-start' },
            { text: '安装与使用', link: '/guide/installation' },
            { text: 'DSL 配置', link: '/guide/dsl' },
          ],
        },
      ],
      '/packages/': [
        {
          text: '插件',
          items: PACKAGE_SIDEBAR,
        },
      ],
      '/examples/': [
        {
          text: '示例',
          items: EXAMPLES,
        },
      ],
    },
    editLink: {
      pattern: 'https://github.com/Z-TEAM-Z/zelpis/edit/main/docs/:path',
      text: '建议修改此页面',
    },
    search: {
      provider: 'local',
    },

    outline: {
      label: '本页目录',
      level: 'deep',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Z-TEAM-Z/zelpis' },
    ],

    footer: {
      message: '基于 MIT 许可证发布',
      copyright: 'Copyright © 2025-PRESENT Zelpis Team',
    },
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'author', content: 'Zelpis Team' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' }],
  ],
})
