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
