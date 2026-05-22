import { fileURLToPath } from 'node:url'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import Tsconfig from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    Tsconfig({
      projects: [
        fileURLToPath(new URL('../../tsconfig.json', import.meta.url)),
      ],
    }),
    Components({
      dirs: [
        fileURLToPath(new URL('./components', import.meta.url)),
      ],
      dts: fileURLToPath(new URL('../components.d.ts', import.meta.url)),
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      extensions: ['vue', 'md'],
    }),
  ],
})
