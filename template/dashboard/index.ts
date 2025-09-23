import { boot } from '../../packages/render';

import Dashboard from '../../packages/template/vue/templates/dashboard/index.vue';
import root from '../../packages/template/vue/templates/dashboard/root';

console.log("🚀 ~ window.$zelpis:", window.$zelpis)

// biome-ignore lint/style/noDefaultExport: any
export default boot({
  framework: 'vue',
  Component: Dashboard,
  mount: root
});
