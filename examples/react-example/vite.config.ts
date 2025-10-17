import path from 'node:path'
import { fileURLToPath } from 'node:url'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { buildPlugin } from '../../packages/builder/builder-plugin'
import { renderPlugin } from '../../packages/render/plugins/render-plugin'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    viteReact(),
    buildPlugin(),
    renderPlugin({
      baseDir: './',
      entrys: [
        {
          basePath: '/',
          entryPath: path.resolve(__dirname, './entry.ts'),
          dslPath: './model',
        },
      ],
    }),
  ],
})
