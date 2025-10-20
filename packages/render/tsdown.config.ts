import { createTsdownConfig } from '../../tsdown.config'

export default createTsdownConfig({
  entry: {
    'index': './src/index.ts',
    'dsl/index': './src/dsl/index.ts',
    'dsl/server': './src/dsl/server.ts',
    'plugins/index': './src/plugins/index.ts',
  },
  external: ['jiti', 'ts-dedent'],
})
