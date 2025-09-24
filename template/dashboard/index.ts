import { boot } from '../../packages/render';

import Dashboard from '@/index.vue';
import root from '@/root';
import router,{ addDashboardRoute } from '@/router';

addDashboardRoute({
  path: 'todo',  // 会自动转换为 '/view/dashboard/custom-page'
  name: 'Todo',
  component: () => import('./pages/todo/todo.vue')
})


// biome-ignore lint/style/noDefaultExport: any
export default boot({
  framework: 'vue',
  Component: Dashboard,
  mount: (app) => root(app, { router })
});
