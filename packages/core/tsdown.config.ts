import { createTsdownConfig } from '../../tsdown.config'

export default createTsdownConfig({
  entry: ['index.ts', 'builder.ts', 'dsl.ts', 'plugins.ts'],
})
