<script setup>
import { ElHeader, ElInput } from 'element-plus'
import { computed } from 'vue'
import { resolveConfig } from '../../utils/dslParser'

const props = defineProps({
  config: { type: Object },
  globalConfig: { type: Object, required: true },
})

const resolvedConfig = computed(() => {
  return resolveConfig(props.config, { globalConfig: props.globalConfig })
})

const headerStyle = computed(() => ({
  background: resolvedConfig.value.backgroundColor || '#FFFFFF',
  padding: '0 24px',
  lineHeight: '64px',
  boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)',
}))
</script>

<template>
  <ElHeader :style="headerStyle">
    <div class="header-content">
      <h2 :style="{ margin: 0, color: '#333' }">
        {{ resolvedConfig.titleText }}
      </h2>
      <ElInput v-if="resolvedConfig.showSearch" placeholder="搜索..." style="width: 200px" />
    </div>
  </ElHeader>
</template>

<style scoped>
.header-content { display: flex; justify-content: space-between; align-items: center; }
</style>
