import { boot } from '../../packages/render';

import Dashboard from '../../packages/template/vue/templates/dashboard/index.vue';
import root from '../../packages/template/vue/templates/dashboard/root';

// biome-ignore lint/style/noDefaultExport: any
export default boot({
  framework: 'vue',
  Component: Dashboard,
  mount: root,
});
