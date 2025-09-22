import path from 'node:path';
import { fileURLToPath } from 'node:url';
import viteReact from '@vitejs/plugin-react';
import viteVue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { buildPlugin } from './packages/builder/builder-plugin';
import { renderPlugin } from './packages/render/render-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: __dirname,
  publicDir: 'public',
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
        },
      ],
    }),
    // CSR 开发环境中间件
    {
      name: 'csr-dev-middleware',
      configureServer(server) {
        server.middlewares.use('/', (req, _res, next) => {
          const url = req.url || '';
          
          // 如果是根路径，返回开发首页
          if (url === '/' || url === '/index.html') {
            return next();
          }
          
          // 对于模板路径，返回CSR HTML模板
          if (url.startsWith('/a') || url.startsWith('/b/vue') || url.startsWith('/dashboard')) {
            req.url = '/index.csr.html';
          }
          
          next();
        });
      },
    },
  ],
  server: {
    host: true,
    port: 3000,
    strictPort: false,
    hmr: {
      overlay: true,
    },
    open: false,
    fs: {
      allow: ['..'],
    },
  },
  build: {
    sourcemap: true,
    minify: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'vue', 'vue-router', 'react-router'],
        },
      },
    },
  },
  define: {
    __DEV__: true,
    'process.env.NODE_ENV': '"development"',
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router',
      'vue',
      'vue-router',
    ],
    exclude: [],
  },
});
