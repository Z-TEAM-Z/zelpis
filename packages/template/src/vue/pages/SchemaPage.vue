<script setup>
import componentMap from '../components/index'

defineProps({
  pageConfig: { type: Object, required: true },
  dsl: { type: Object, required: true },
})

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
