import { defineComponent, h } from 'vue';
import DefaultDashboardLayout from './index.vue';

export function createDashboardRoot(config: any, overrides?: Record<string, any>) {
  return defineComponent({
    name: 'DashboardRoot',
    setup() {
      // routes will be built by render package via provided router builder; here we only render layout
      const Layout = overrides?.Layout ?? DefaultDashboardLayout;
      return () => h(Layout, { config });
    }
  });
}