<script setup>
import { inject } from 'vue'
import componentMap from '../components/index'
import { DSL_INJECTION_KEY } from '../templates/dashboard_v1/main'

const injectedDsl = inject(DSL_INJECTION_KEY)
console.log('🚀 ~ injectedDsl:', injectedDsl)

function getComponent(type) {
  const Component = componentMap[type]
  if (!Component) {
    return { template: `<div style="color: red; padding: 10px; border: 1px solid red;">Component **${type}** Not Found</div>` }
  }
  return Component
}
</script>

<template>
  <div class="schema-page-renderer">
    <template v-for="comp in pageConfig.components" :key="comp.id">
      <component
        :is="getComponent(comp.componentType)"
        :config="comp.config"
        :global-config="dsl.global_config"
        :style="{ marginBottom: '20px' }"
      />
    </template>
  </div>
</template>
