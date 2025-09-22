<template>
  <el-form v-if="schema && schema.properties" :inline="true" class="schema-search-bar">
    <!-- 动态组件区域 -->
    <el-form-item v-for="(SchemaItem, key) in schema.properties" :key="key" :label="SchemaItem.label">
      <!-- 展示子组件 -->
      <component
        :is="SearchItemConfig[SchemaItem?.options?.comType]?.component"
        ref="SearchComList"
        :schema-key="key"
        :schema="SchemaItem"
        @loaded="handleChildLoaded"
      />
    </el-form-item>
    <!-- 操作区域 -->
    <el-form-item>
      <el-button type="primary" plain class="search-btn" @click="search">搜索</el-button>
      <el-button plain class="reset-btn" @click="reset">清除</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, toRefs } from 'vue';
import SearchItemConfig from './search-item-config';

const props = defineProps({
  /**
   * schema配置，结构如下
   * type:'object',
    properties:{
        key:{
            ...schema,// 标准的shema配置
            type:'',// 字段类型
            label:'',// 字段的中文名
            // 字段在search-bar中的相关配置
            options:{
                ...eleComponentConfig,// 标准的el-component-column配置
                comType: '',// 配置组件类型，input/select/...
                default: '',// 默认值
            }
        },
   */
  schema: {
    type: Object,
    default: () => ({}),
  },
});

const { schema } = toRefs(props);

const emit = defineEmits(['loaded', 'search', 'reset']);

const SearchComList = ref([]);

const getValue = () => {
  let dtoObj = {};
  SearchComList.value.forEach((item) => {
    dtoObj = { ...dtoObj, ...item?.getValue() };
  });
  return dtoObj;
};
let childComLoadedCount = 0;
const handleChildLoaded = () => {
  childComLoadedCount++;
  if (childComLoadedCount === Object.keys(schema?.value?.properties).length) {
    emit('loaded', getValue());
  }
};

const search = () => {
  emit('search', getValue());
};
const reset = () => {
  SearchComList.value.forEach((item) => {
    item?.reset();
  });
  emit('reset');
};

defineExpose({
  reset,
  search,
  getValue,
});
</script>

<style lang="less">
.schema-search-bar {
  min-width: 500px;
  .search-btn {
    width: 100px;
  }
  .reset-btn {
    width: 100px;
  }
  .select {
    width: 180px;
  }
}
</style>
