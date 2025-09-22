<template>
  <el-date-picker
    v-model="dtoValue"
    v-bind="schema.options"
    type="daterange"
    range-separator="至"
    :start-placeholder="`${schema.label}开始日期`"
    :end-placeholder="`${schema.label}结束日期`"
    class="date-range"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import moment from 'moment';

const { schemaKey, schema } = defineProps({
  schemaKey: { type: String, default: '' },
  schema: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['loaded']);

const dtoValue = ref();
const getValue = () => {
  return dtoValue.value?.length === 2
    ? {
        [`${schemaKey}_start`]: moment(dtoValue.value[0]).format('YYYY-MM-DD'),
        [`${schemaKey}_end`]: moment(dtoValue.value[1]).format('YYYY-MM-DD'),
      }
    : {};
};

onMounted(() => {
  reset();
  emit('loaded');
});

const reset = () => {
  dtoValue.value = [];
};
defineExpose({
  getValue,
  reset,
});
</script>
<style lang="less" scoped>
.date-range {
  width: 280px;
}
</style>
