<template>
  <div class="dsl-text-component" :style="{ padding: '10px 0' }">
    <p>{{ resolvedConfig.content }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { resolveConfig } from '../../utils/dslParser'; 

const props = defineProps({
  config: { type: Object },
  globalConfig: { type: Object, required: true }
});

const resolvedConfig = computed(() => {
  return resolveConfig(props.config, { globalConfig: props.globalConfig });
});
</script>