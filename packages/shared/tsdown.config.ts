import { createTsdownConfig } from '../../tsdown.config.ts'

export default createTsdownConfig({
  entry: {
    'index': './src/index.ts',
    'html-config/index': './src/html-config/index.ts',
  },
})
