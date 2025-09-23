<template>
  <el-config-provider :locale="zhCn">
    <header-view :project-name="projectName" @menu-select="onMenuSelect">
      <template #main-content>
        <router-view />
      </template>
    </header-view>
  </el-config-provider>
</template>

<script setup>
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import HeaderView from './complex-view/header-view/head-view.vue';
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useMenuStore } from './store/menu.js';

const router = useRouter();
const route = useRoute();

const projectName = ref('');
const menuStore = useMenuStore();


onMounted(() => {
  const { name, menu } = window.$zelpis?.hydrateData?.dsl || {};
  projectName.value = name;
  menuStore.setMenuList(menu);
})

// 点击菜单回调
const onMenuSelect = (menuItem) => {
  const { moduleType, key, customConfig } = menuItem;

  // 如果是当前页面就不处理
  if (route.query.key === key) return;

  const pathMap = {
    sider: '/sider',
    iframe: '/iframe',
    schema: '/schema',
    custom: customConfig?.path,
  };

  router.push({
    path: `/view/dashboard${pathMap[moduleType]}`,
    query: { key, proj_key: route.query.proj_key },
  });
};
</script>

<style lang="less" scoped></style>
