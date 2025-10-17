import { createTsdownConfig } from '../../tsdown.config'

export default createTsdownConfig({
  entry: ['index.ts'],
  external: ['fast-glob', 'pkg-types', 'ts-dedent'],
})
