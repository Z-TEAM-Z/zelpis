<template>
  <el-drawer v-model="isShow" direction="rtl" :destory-on-close="true" :size="550">
    <template #header>
      <h3>{{ title }}</h3>
    </template>
    <template #default>
      <schema-form ref="schemaFormRef" v-loading="loading" :schema="components[name]?.schema" />
    </template>
    <template #footer>
      <el-button type="primary" @click="save">
        {{ saveBtnText }}
      </el-button>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, inject } from 'vue';
import SchemaForm from '@/widgets/schema-form/schema-form.vue';
import $curl from '@/common/curl.ts';
import { ElNotification } from 'element-plus';

// 接收的参数
const { api, components } = inject('schemaViewData');

const emit = defineEmits(['command']);

const name = ref('createForm');

const schemaFormRef = ref(null);
const isShow = ref(false);
const title = ref('');
const saveBtnText = ref('');
const loading = ref(false);

const show = (rowData) => {
  const { config } = components.value[name.value];

  title.value = config.title;
  saveBtnText.value = config.saveBtnText;

  isShow.value = true;
  console.log(rowData);
};

const close = () => {
  isShow.value = false;
};

const save = async () => {
  if (loading.value) return;
  // 校验表单
  if (!schemaFormRef.value.validate()) return;

  loading.value = true;

  const res = await $curl({
    method: 'post',
    url: api.value,
    data: {
      ...schemaFormRef.value.getValue(),
    },
  });

  loading.value = false;

  if (!res || !res.success) return;
  ElNotification({
    title: '创建成功',
    message: '创建成功',
    type: 'success',
  });
  close();
  emit('command', {
    event: 'loadTableData',
  });
};

defineExpose({
  name,
  show,
});
</script>

<style lang="less" scoped></style>
