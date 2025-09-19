<template>
  <el-card class="table-panel">
    <!-- operation-panel -->
    <el-row v-if="tableConfig?.headerButtons?.length > 0" justify="end" class="operation-panel">
      <el-button
        v-for="(btn, index) in tableConfig.headerButtons"
        :key="index"
        v-bind="btn"
        @click="operationHandler({ btnConfig: btn })"
      >
        {{ btn.label }}
      </el-button>
    </el-row>
    <!-- schema-table(组件widgets) -->
    <schema-table
      ref="SchemaTableRef"
      :schema="tableSchema"
      :api="api"
      :buttons="tableConfig?.rowButtons ?? []"
      :api-params="apiParams"
      @operate="operationHandler"
    />
  </el-card>
</template>

<script setup>
import { ref, inject } from 'vue';
import $curl from '@elpisCommon/curl';
import { ElMessageBox, ElNotification } from 'element-plus';
import SchemaTable from '@elpisWidgets/schema-table/schema-table.vue';

const emit = defineEmits(['operate']);

const { api, tableSchema, tableConfig, apiParams } = inject('schemaViewData');

const SchemaTableRef = ref(null);

const EventHandlerMap = {
  remove: removeData,
};
const operationHandler = ({ rowData, btnConfig }) => {
  const { eventKey } = btnConfig;
  if (EventHandlerMap[eventKey]) {
    EventHandlerMap[eventKey]({ rowData, btnConfig });
  } else {
    emit('operate', { btnConfig, rowData });
  }
};

function removeData({ rowData, btnConfig }) {
  console.log('🚀 ~ removeData ~ rowData:', rowData);
  const { eventOptions } = btnConfig;
  const { params } = eventOptions;
  const removeKey = Object.keys(params)[0];

  if (!eventOptions?.params || !removeKey) return;

  let removeValue = rowData[params[removeKey]] || '';
  const removeValueList = params[removeKey].split('::');
  if (removeValueList[0] === 'schema' && removeValueList[1]) {
    removeValue = rowData[removeValueList[1]];
  }

  ElMessageBox.confirm(`确认删除${removeKey}为：${removeValue} 的数据?`, 'Warning', {
    confirmButtonText: '确认',
    cancleButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    SchemaTableRef.value.showLoading();
    const res = await $curl({
      url: api.value,
      method: 'delete',
      data: {
        [removeKey]: removeValue,
      },
      errorMessage: '删除失败',
    });
    SchemaTableRef.value.hideLoading();

    if (!res || !res.success || !res.data) return;

    ElNotification({
      title: '成功',
      message: '删除成功',
      type: 'success',
    });

    initTableData();
  });
}

const initTableData = () => {
  SchemaTableRef.value.initData();
};
const loadTableData = () => {
  SchemaTableRef.value.loadTableData();
};

defineExpose({
  loadTableData,
});
</script>

<style lang="less" scoped>
.table-panel {
  flex: 1;
  margin: 10px;
  .operation-panel {
    margin-bottom: 10px;
  }
}

:deep(.el-card__body) {
  height: 98%;
  display: flex;
  flex-direction: column;
}
</style>
