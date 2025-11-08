<script setup>
defineProps({
  pageConfig: { type: Object, required: true },
  dsl: { type: Object, required: true },
})
</script>

<template>
  <iframe
    :src="pageConfig.iframe_url"
    style="width: 100%; height: 80vh; border: 1px solid #eee; border-radius: 4px;"
    :title="pageConfig.label"
  />
</template>
