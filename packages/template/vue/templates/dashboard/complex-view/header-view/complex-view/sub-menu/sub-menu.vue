<template>
  <el-sub-menu :index="menuItem.key || ''">
    <template #title>
      {{ menuItem.name }}
    </template>
    <div v-for="subMenuItem in menuItem.subMenu" :key="subMenuItem.key">
      <sub-menu v-if="subMenuItem.subMenu && subMenuItem.subMenu.length > 0" :menu-item="subMenuItem" />
      <el-menu-item v-else :index="subMenuItem.key">
        {{ subMenuItem.name }}
      </el-menu-item>
    </div>
  </el-sub-menu>
</template>

<script setup>
const { menuItem } = defineProps({
  menuItem: {
    type: Object,
    default: () => {},
  },
});
</script>

<style lang="less" scoped></style>
