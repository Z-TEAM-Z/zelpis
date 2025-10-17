import { boot } from '@zelpis/core'
import { Button } from './custom-component/button'
import { register, Root } from './remote-template'

register('SchemaButton', Button)

// biome-ignore lint/style/noDefaultExport: any
export default boot({
  // type: 'csr',
  framework: 'react',
  Component: Root,
})
