<template>
  <header-container :title="projectName">
    <template #menu-content>
      <!-- 根据menuStore的menuList的渲染 -->
      <el-menu :default-active="activeMenuKey" :ellipsis="false" mode="horizontal" @select="onMenuSelect">
        <template v-for="menuItem in menuStore.menuList">
          <sub-menu v-if="menuItem.subMenu && menuItem.subMenu.length > 0" :menu-item="menuItem" />
          <el-menu-item v-else :index="menuItem.key">
            {{ menuItem.name }}
          </el-menu-item>
        </template>
      </el-menu>
    </template>
    <template #setting-content>
      <!-- 根据projectStore的projectList的渲染 -->
      <el-dropdown @command="handleProjectCommand">
        <span class="project-list">
          {{ projectName }}
          <el-icon v-if="projectStore.projectList.length > 1" class="el-icon-right">
            <ArrowDown />
          </el-icon>
        </span>
        <template v-if="projectStore.projectList.length > 1" #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="projectItem in projectStore.projectList"
              :command="projectItem.key"
              :disabled="projectItem.name === projectName"
            >
              {{ projectItem.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
        <el-dropdown-menu slot="dropdown" />
      </el-dropdown>
    </template>
    <template #main-content>
      <slot name="main-content" />
    </template>
  </header-container>
</template>

<script setup>
import HeaderContainer from '@elpisWidgets/head-container/head-container';
import { ref, watch, onMounted, computed } from 'vue';
import { ArrowDown } from '@element-plus/icons-vue';
import { useMenuStore } from '@elpisStore/menu.js';
import { useProjectStore } from '@elpisStore/project.js';
import { useRoute } from 'vue-router';
import { ComponentRegistry } from '@befool/elpis/registry/ComponentRegistry';

const menuStore = useMenuStore();
const projectStore = useProjectStore();
const route = useRoute();


defineProps({
  projectName: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['menu-select']);


const setActiveMenuKey = () => {
  if (!MenuComponent.value) {
    return;
  }
  const menuItem = menuStore.findMenuItem({
    key: 'key',
    value: route.query.key,
  });
};

watch(
  [() => route.query.key, () => menuStore.menuList],
  () => {
    setActiveMenuKey();
  },
  { deep: true }
);
onMounted(() => {
  setActiveMenuKey();
});

const onMenuSelect = (menuKey) => {
  const menuItem = menuStore.findMenuItem({
    key: 'key',
    value: menuKey,
  });
  emit('menu-select', menuItem);
};

const handleProjectCommand = (command) => {
  const projectItem = projectStore.projectList.find((item) => item.key === command);
  if (!projectItem || !projectItem.homePage) return;
  const { origin } = window.location;
  window.location.replace(`${origin}/view/dashboard${projectItem.homePage}`);
};
</script>

<style lang="less" scoped>
.project-list {
  margin-right: 20px;
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
  outline: none;
}
:deep(.el-menu--horizontal) {
  border-bottom: 0;
}
</style>
