import path from 'node:path'
import { fileURLToPath } from 'node:url'
import viteVue from '@vitejs/plugin-vue'
import { buildPlugin, renderPlugin } from '@zelpis/core/plugins'
import { defineConfig } from 'vite'
// import { renderPlugin } from '../../packages/render/plugins/render-plugin'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    viteVue(),
    buildPlugin(),
    renderPlugin({
      baseDir: './',
    }),
  ],
  zelpis: {
    // 全局默认 HTML 配置
    defaultHtml: {
      meta: {
        title: 'defaultHtml',
        description: 'A Vue.js example with Zelpis',
        viewport: 'width=device-width, initial-scale=1.0',
        charset: 'UTF-8',
        lang: 'zh-CN',
      },
      head: [
        '<link rel="icon" href="/favicon.ico">',
        '<link rel="preconnect" href="https://fonts.googleapis.com">',
      ],
    },
    entrys: [
      {
        basePath: '/',
        entryPath: path.resolve(__dirname, './entry.ts'),
        dslPath: './model',
        html: {
          template: './custom.html',
          custom: `<head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Vue Example custom222</title>
                  </head><div id="app"></div><!-- app-inject-script -->`,
        },
      },
    ],
  },
})
