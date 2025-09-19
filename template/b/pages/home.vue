<template>
  <main>
    <div>hello world</div>
    <div>
      <a href="/a">goto /a</a>
      <router-link to="/blog">goto /blog</router-link>
    </div>
    <button @click="count++" type="button">
      count is {{ count }}
    </button>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  dsl: any;
}>();

console.debug('renderProps', props);

// biome-ignore lint/correctness/noUnusedVariables: any
const count = ref(0);
</script>
