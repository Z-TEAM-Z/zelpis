import { createTsdownConfig } from '../../tsdown.config.ts'

export default createTsdownConfig({
  entry: ['./src/index.ts', './src/builder.ts', './src/dsl.ts', './src/plugins.ts'],
})
