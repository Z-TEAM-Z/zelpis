import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import { buildPlugin, renderPlugin } from '@zelpis/core/plugins'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    buildPlugin(),
    renderPlugin({
      baseDir: './',
    }),
  ],
  zelpis: {
    entrys: [
      {
        entryPath: path.resolve(__dirname, './entry.ts'),
        basePath: '/',
        dslPath: path.resolve(__dirname, './model'),
        // html: {
        //   custom: '<div>123',
        // },
      },
    ],
    validateHtml: 'warn',
  },
})
