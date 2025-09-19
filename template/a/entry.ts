import { boot } from '../../packages/render';
import { Button } from './custom-component/button';
import { Root, register } from './remote-template';

register('SchemaButton', Button);

// biome-ignore lint/style/noDefaultExport: any
export default boot({
  // type: 'csr',
  framework: 'react',
  Component: Root,
});
