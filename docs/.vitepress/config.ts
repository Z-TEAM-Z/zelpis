import type { DefaultTheme } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { defineConfig } from 'vitepress'
import { version } from '../../package.json'
import llmstxt from 'vitepress-plugin-llms'
import vite from './vite.config'

const GUIDES: DefaultTheme.NavItemWithLink[] = [
  { text: '快速开始', link: '/guide/quick-start' },
  { text: '安装与使用', link: '/guide/installation' },
  { text: 'DSL 语法', link: '/guide/dsl' },
]

const PACKAGES: DefaultTheme.NavItemWithLink[] = [
  { text: 'Core', link: '/packages/core' },
  { text: 'Builder', link: '/packages/builder' },
  { text: 'Render', link: '/packages/render' },
  { text: 'Shared', link: '/packages/shared' },
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
      {
        text: '包',
        items: [
          {
            items: PACKAGES,
          },
        ],
      },
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
            { text: 'DSL 语法', link: '/guide/dsl' },
          ],
        },
      ],
      '/packages/': [
        {
          text: '包',
          items: PACKAGES,
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
      pattern: 'https://github.com/Z-TEAM-Z/zelpis',
      text: '建议修改此页面',
    },
    search: {
      provider: 'local',
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
    ['meta', { name: 'author', content: 'Zelpis Team' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' }],
  ],
})
