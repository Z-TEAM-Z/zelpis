<template>
  <div>
    <div v-if="id && name">
      id: {{ id }} name: {{ name }}
    </div>
    <router-link to="/">goto /home</router-link>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: string;
  name: string;
}>();
</script>
