import { createTsdownConfig } from '../../tsdown.config'

export default createTsdownConfig({
  entry: {
    'index': 'index.ts',
    'dsl': 'dsl/index.ts',
    'dsl/server': 'dsl/server.ts',
    'plugins': 'plugins/index.ts',
  },
})
