import { createTsdownConfig } from '../../tsdown.config'

export default createTsdownConfig({
  entry: ['./src/index.ts', './src/builder.ts', './src/dsl.ts', './src/plugins.ts'],
})
