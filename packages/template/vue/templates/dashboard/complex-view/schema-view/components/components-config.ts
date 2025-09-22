import createForm from './create-form/create-form.vue';
import editForm from './edit-form/edit-form.vue';
import detailPanel from './detail-panel/detail-panel.vue';

interface ComponentItem {
  component: any;
}

interface ComponentConfig {
  [key: string]: ComponentItem;
}

// 业务拓展 component 配置
// @ts-ignore - This is a dynamic import that may not exist
let BusinessComponentConfig: ComponentConfig = {};
try {
  // @ts-ignore
  BusinessComponentConfig = require('@businessComponentConfig').default || {};
} catch (e) {
  console.warn('Business component config not found, using default configuration');
}

const componentConfig: ComponentConfig = {
  createForm: {
    component: createForm,
  },
  editForm: {
    component: editForm,
  },
  detailPanel: {
    component: detailPanel,
  },
};

export default {
  ...componentConfig,
  ...BusinessComponentConfig,
};
