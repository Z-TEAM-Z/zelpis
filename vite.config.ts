import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dsl from './plugin/dsl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [dsl({ 
    modelDir: 'src/modelaaa',
    exclude: [/index.ts/] 
  }), vue(), ], 
})
