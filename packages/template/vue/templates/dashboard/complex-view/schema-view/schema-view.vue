<template>
  <el-row class="schema-view">
    <search-panel
      v-if="searchSchema?.properties && Object.keys(searchSchema.properties).length > 0"
      @search="onSearch"
    />
    <table-panel ref="tablePanelRef" @operate="onTableOperate" />
    <Component
      :is="ComponentConfig[key]?.component"
      v-for="(item, key) in components"
      :key="key"
      ref="comListRef"
      @command="onComponentCommand"
    />
  </el-row>
</template>

<script setup>
import { provide, ref } from 'vue';
import SearchPanel from './complex-view/search-panel/search-panel.vue';
import TablePanel from './complex-view/table-panel/table-panel.vue';
import { useSchema } from './hook/schema.js';
import ComponentConfig from './components/components-config.js';

const { api, tableSchema, tableConfig, searchSchema, searchConfig, components } = useSchema();

const apiParams = ref({});

provide('schemaViewData', {
  api,
  apiParams,
  tableSchema,
  tableConfig,
  searchSchema,
  searchConfig,
  components,
});

const tablePanelRef = ref(null);
const comListRef = ref([]);

const onSearch = (searchParams) => {
  apiParams.value = searchParams;
};

// table 事件映射
const EventHandlerMap = {
  showComponent: showComponent,
};

const onTableOperate = ({ btnConfig, rowData }) => {
  const { eventKey } = btnConfig;
  if (EventHandlerMap[eventKey]) {
    EventHandlerMap[eventKey]({ btnConfig, rowData });
  }
};

// showComponent 展示动态组件
function showComponent({ btnConfig, rowData }) {
  const { comName } = btnConfig.eventOptions;
  if (!comName) {
    console.error('没配置组件名');
    return;
  }
  const comRef = comListRef.value.find((item) => item.name === comName);
  if (!comRef || typeof comRef.show !== 'function') {
    console.error(`找不到组件${comName}`);
    return;
  }

  comRef.show(rowData);
}

// 相应组件事件
const onComponentCommand = (data) => {
  const { event } = data;
  if (event === 'loadTableData') {
    tablePanelRef.value.loadTableData();
  }
};
</script>

<style lang="less" scoped>
.schema-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
</style>
