<script setup>
import { getDsl } from '@zelpis/core/dsl'
const url = getDsl()
</script>

<template>
  <div>
    123 {{ url }}
    <router-view />
  </div>
</template>
