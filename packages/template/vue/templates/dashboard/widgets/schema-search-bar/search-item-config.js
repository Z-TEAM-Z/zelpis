import input from './complex-view/input/input';
import select from './complex-view/select/select';
import dynamicSelect from './complex-view/dynamic-select/dynamic-select';
import dataRange from './complex-view/date-range/date-range';

// 业务拓展 search-item  配置
import BusinessSearchItemConfig from '@businessSearchItemConfig';

const SearchItemConfig = {
  // 输入框
  input: {
    component: input,
  },
  // 选择框
  select: {
    component: select,
  },
  // 动态选择框
  dynamicSelect: {
    component: dynamicSelect,
  },
  // 日期选择
  dateRange: {
    component: dataRange,
  },
};

export default {
  ...SearchItemConfig,
  ...BusinessSearchItemConfig,
};
