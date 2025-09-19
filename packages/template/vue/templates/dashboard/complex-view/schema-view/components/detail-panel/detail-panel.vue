<template>
  <el-drawer v-model="isShow" direction="rtl" :destory-on-close="true" :size="550">
    <template #header>
      <h3>{{ title }}</h3>
    </template>

    <template #default>
      <el-card v-loading="loading" class="detail-panel" shadow="always">
        <el-row
          v-for="(item, key) in components[name]?.schema?.properties"
          :key="key"
          type="flex"
          align="middle"
          class="row-item"
        >
          <el-row class="item-label">{{ item.label }}：</el-row>
          <el-row class="item-value">
            {{ dtoModel[key] }}
          </el-row>
        </el-row>
      </el-card>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, inject } from 'vue';
import $curl from '@elpisCommon/curl';

const { api, components } = inject('schemaViewData');

const name = ref('detailPanel');

const isShow = ref(false);
const loading = ref(false);
const title = ref('');
const mainKey = ref('');
const mainValue = ref();
const dtoModel = ref({});

const show = (rowData) => {
  const { config } = components.value[name.value];

  title.value = config.title;
  mainKey.value = config.mainKey;
  mainValue.value = rowData[mainKey.value];
  dtoModel.value = {};

  isShow.value = true;

  fetchFormData();
};

const fetchFormData = async () => {
  if (loading.value) return;

  loading.value = true;

  const res = await $curl({
    url: api.value,
    method: 'get',
    query: {
      [mainKey.value]: mainValue.value,
    },
  });

  loading.value = false;

  if (!res || !res.success || !res.data) return;

  dtoModel.value = res.data;
};

defineExpose({
  name,
  show,
});
</script>

<style lang="less" scoped>
.detail-panel {
  border: 1px solid #a6a6a6;
  padding: 30px;

  .row-item {
    line-height: 40px;
    font-size: 20px;
    align-items: normal;

    .item-label {
      margin-right: 20px;
      color: #fff;
      width: 120px;
    }

    .item-value {
      color: #d2dae4;
      width: 250px;
      word-break: break-word;
    }
  }
}
</style>
