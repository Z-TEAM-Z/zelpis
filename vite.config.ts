import path from 'node:path';
import { fileURLToPath } from 'node:url';
import viteReact from '@vitejs/plugin-react';
import viteVue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { buildPlugin } from './packages/builder/builder-plugin';
import { renderPlugin } from './packages/render/render-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    viteVue(),
    viteReact(),
    buildPlugin(),
    renderPlugin({
      baseDir: './template',
      entrys: [
        {
          basePath: '/a',
          entryPath: path.resolve(__dirname, './template/a/entry.ts'),
          dslPath: './a/model',
        },
        {
          basePath: '/b/vue',
          entryPath: './b/entry.ts',
        },
        {
          basePath: '/dashboard',
          entryPath: './dashboard/index.ts',
          dslPath: './dashboard/model/buiness'
        },
      ],
    }),
  ],
});
