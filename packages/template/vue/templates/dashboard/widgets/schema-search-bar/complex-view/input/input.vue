<template>
  <el-input v-model="dtoValue" v-bind="schema.options" class="input" />
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
  dtoValue.value = schema?.options?.default;
};
defineExpose({
  getValue,
  reset,
});
</script>

<style lang="less" scoped></style>
