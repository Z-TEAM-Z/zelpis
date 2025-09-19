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
import { useMenuStore } from '@elpisStore/menu.js';
import { useProjectStore } from '@elpisStore/project.js';
import { useRouter, useRoute } from 'vue-router';
import $curl from '@elpisCommon/curl';

const router = useRouter();
const route = useRoute();
const menuStore = useMenuStore();
const projectStore = useProjectStore();

const projectName = ref('order');

onMounted(() => {
  getProjectList();
  getProjectConfig();
});

// 请求/api/project/list接口，获取项目列表，存在projectStore
async function getProjectList() {
  const res = await $curl({
    url: '/api/project/list',
    method: 'get',
    // 动态获取当前项目key
    query: { proj_key: route.query.proj_key },
    errorMessage: '获取项目列表失败',
  });
  if (!res || !res.success || !res.data) {
    return;
  }
  projectStore.setProjectList(res.data);
}

// 请求/api/project接口，获取项目列表，存在menuStore
async function getProjectConfig() {
  const res = await $curl({
    url: '/api/project',
    method: 'get',
    // 动态获取当前项目key
    query: { proj_key: route.query.proj_key },
    errorMessage: '获取项目配置失败',
  });
  if (!res || !res.success || !res.data) {
    return;
  }
  const { name, menu } = res.data;
  projectName.value = name;
  menuStore.setMenuList(menu);
}

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
