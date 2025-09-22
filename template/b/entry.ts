import { boot } from '../../packages/render';
// @ts-expect-error any
import App from './app.vue';
import { router } from './router';

// biome-ignore lint/style/noDefaultExport: any
export default boot({
  type: 'csr',
  framework: 'vue',
  Component: App,
  mount(app) {
    app.use(router);
  },
});
