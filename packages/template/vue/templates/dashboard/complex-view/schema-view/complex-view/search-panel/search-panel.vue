<template>
  <el-card class="search-panel">
    <schema-search-bar :schema="searchSchema" @loaded="onLoad" @search="onSearch" @reset="onReset" />
  </el-card>
</template>

<script setup>
import { inject } from 'vue';
import SchemaSearchBar from '../../../widgets/schema-search-bar/schema-search-bar';

const { searchSchema } = inject('schemaViewData');

const emit = defineEmits(['search']);

const onLoad = (searchObj) => {
  emit('search', searchObj);
};

const onSearch = (searchObj) => {
  emit('search', searchObj);
};

const onReset = () => {
  emit('search', {});
};
</script>

<style lang="less" scoped>
.search-panel {
  margin: 10px 10px 0 10px;
}
:deep(.el-card__body) {
  padding-bottom: 2px;
}
</style>
