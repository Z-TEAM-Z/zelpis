<template>
  <el-select v-model="dtoValue" v-bind="schema.options" class="select">
    <el-option v-for="(item, index) in schema.options?.enumList" :key="index" :label="item.label" :value="item.value" />
  </el-select>
</template>

<script setup>
import { ref, onMounted } from 'vue';

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

onMounted(() => {
  reset();
  emit('loaded');
});

const reset = () => {
  dtoValue.value = schema?.options?.default ?? schema?.options?.enumList[0]?.value ?? '';
};
defineExpose({
  getValue,
  reset,
});
</script>

<style lang="less" scoped></style>
