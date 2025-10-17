<script setup>
const data = window.$zelpis.hydrateData
</script>

<template>
  <div>
    123 {{ data }}
    <router-view />
  </div>
</template>
