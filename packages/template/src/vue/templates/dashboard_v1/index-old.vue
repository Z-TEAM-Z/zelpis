<script setup lang="ts">
import type { DslData } from './types.ts'
import { ElCard, ElCol, ElContainer, ElHeader, ElMain, ElRow } from 'element-plus'
import { computed, defineProps, h, inject } from 'vue'
import { mergeDsl } from '../../utils/dsl.ts'
import { DSL_INJECTION_KEY } from './main.ts'

// 1. 定义 Props，接收 DSL 数据
const props = defineProps<{
  dsl: DslData // 宿主应用传入的数据结构
}>()

// 1. 通过 inject 获取 render 函数传入的 dsl（完整的外部 dsl）
const injectedDsl = inject(DSL_INJECTION_KEY)

const mergedDsl = computed(() => mergeDsl(injectedDsl, props.dsl))

// 2. 解析 DSL 数据（例如获取标题）
const pageTitle = computed(() => mergedDsl.value.global_config?.title || '未命名项目面板')
// 修复类型报错：Page 不是每种类型都有 components 字段，需显式做类型判断
const components = computed(() => {
  const page = mergedDsl.value.pages[0]
  // 只有类型为 Page 并且有 components 字段时返回 components
  if ('components' in page && Array.isArray(page.components)) {
    return page.components
  }
  return []
})

// 这是一个简化的 DSL 组件渲染器，使用 h 函数而不是 JSX
function renderComponent(comp: any) {
  switch (comp.type) {
    case 'HeaderCard':
      return h(ElCard, { header: comp.data.title }, () => '这是自定义头部卡片')
    case 'MetricPanel':
      return h(ElCard, {}, () => `关键指标：${comp.data.value}`)
    default:
      return null
  }
}
</script>

<template>
  <ElContainer class="template-layout">
    <ElHeader>
      <h1>{{ pageTitle }}</h1>
    </ElHeader>

    <ElMain style="padding: 24px;">
      <ElRow :gutter="16">
        <ElCol v-for="comp in components" :key="comp.id" :span="comp.layout.span">
          <component :is="renderComponent(comp)" />
        </ElCol>
      </ElRow>
    </ElMain>
  </ElContainer>
</template>

<style scoped>
.template-layout {
    min-height: 100%;
}
</style>
