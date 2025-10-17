// 共享的 tsdown 基础配置
import type { OptionsWithoutConfig } from 'tsdown'
import { defineConfig } from 'tsdown'

export function createTsdownConfig(options: {
  entry: OptionsWithoutConfig['entry']
  external?: (string | RegExp)[]
}) {
  return defineConfig({
    entry: options.entry,
    format: ['esm'],
    dts: true,
    clean: true,
    sourcemap: true,
    external: [
      'react',
      'react-dom',
      'vue',
      'vite',
      'express',
      /^node:/,
      /^@zelpis\//,
      ...(options.external || []),
    ],
  })
}
