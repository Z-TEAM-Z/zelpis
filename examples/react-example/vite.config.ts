import path from 'node:path'
import { fileURLToPath } from 'node:url'
import viteReact from '@vitejs/plugin-react'
import { buildPlugin, renderPlugin } from '@zelpis/core/plugins'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    viteReact(),
    buildPlugin(),
    renderPlugin({
      baseDir: './',

    }),
  ],
  zelpis: {
    entrys: [
      {
        basePath: '/',
        entryPath: path.resolve(__dirname, './entry.ts'),
        dslPath: './model',
      },
    ],
  },
})
