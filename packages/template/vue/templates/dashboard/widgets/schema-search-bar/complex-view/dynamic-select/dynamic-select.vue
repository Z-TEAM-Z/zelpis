<template>
  <el-select v-model="dtoValue" v-bind="schema.options" class="select">
    <el-option v-for="(item, index) in enumList" :key="index" :label="item.label" :value="item.value" />
  </el-select>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import $curl from '../../../../common/curl';

const { schemaKey, schema } = defineProps({
  schemaKey: { type: String, default: '' },
  schema: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['loaded']);

const dtoValue = ref();
const getValue = () => {
  return dtoValue.value !== undefined
    ? {
        [schemaKey]: dtoValue.value,
      }
    : {};
};

const enumList = ref([]);
const fecthEnumList = async () => {
  const res = await $curl({
    url: schema?.options?.api,
    method: 'get',
    data: {},
    errorMessage: '获取枚举列表失败',
  });
  if (res?.data?.length > 0) {
    enumList.value.push(...res.data);
  }
};

onMounted(async () => {
  await fecthEnumList();
  reset();
  emit('loaded');
});

const reset = () => {
  dtoValue.value = schema?.options?.default ?? enumList.value[0]?.value ?? '';
};
defineExpose({
  getValue,
  reset,
});
</script>

<style lang="less" scoped></style>
