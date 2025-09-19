<template>
  <sider-container>
    <template #menu-content>
      <el-menu :default-active="activeMenuKey" :ellipsis="false" @select="onMenuSelect">
        <template v-for="item in menuList">
          <!-- group -->
          <sub-menu v-if="item.subMenu && item.subMenu.length > 0" :menu-item="item"></sub-menu>
          <!-- module -->
          <el-menu-item v-else :index="item.key">
            <template #title>
              <span>{{ item.name }}</span>
            </template>
          </el-menu-item>
        </template>
      </el-menu>
    </template>
    <template #main-content>
      <router-view></router-view>
    </template>
  </sider-container>
</template>

<script setup>
import SiderContainer from '@elpisWidgets/sider-container/sider-container';
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMenuStore } from '@elpisStore/menu';
import SubMenu from './complex-view/sub-menu/sub-menu.vue';

const router = useRouter();
const route = useRoute();
const menuStore = useMenuStore();

const activeMenuKey = ref('');
// 设置激活菜单
const setActiveMenuKey = () => {
  let subMenuItem = menuStore.findMenuItem({
    key: 'key',
    value: route.query.sider_key,
  });
  // 如果首次加载side-view，用户未选中，则默认选中第一个
  if (!subMenuItem) {
    const headMenuItem = menuStore.findMenuItem({
      key: 'key',
      value: route.query.key,
    });
    const sideMenuList = headMenuItem?.siderConfig?.menu || [];
    // 找出左侧菜单中的第一项
    const sideMenuItem = menuStore.findFirstMenuItem(sideMenuList);
    if (sideMenuItem) {
      subMenuItem = sideMenuItem;
      // 处理选中菜单逻辑
      handleMenuSelect(sideMenuItem.key);
    }
  }
  activeMenuKey.value = subMenuItem?.key;
};

const menuList = ref([]);
// 设置菜单列表
const setMenuList = () => {
  const menuItem = menuStore.findMenuItem({
    key: 'key',
    value: route.query.key,
  });
  menuList.value = menuItem?.siderConfig?.menu || [];
};

// 选择菜单
const onMenuSelect = (menuKey) => {
  handleMenuSelect(menuKey);
};

const handleMenuSelect = (menuKey) => {
  const menuItem = menuStore.findMenuItem({
    key: 'key',
    value: menuKey,
  });

  const { moduleType, key, customConfig } = menuItem;

  if (key === route.query.side_key) return;

  const pathMap = {
    iframe: '/iframe',
    schema: '/schema',
    custom: customConfig?.path,
  };
  router.push({
    path: `/view/dashboard/sider${pathMap[moduleType]}`,
    query: {
      proj_key: route.query.proj_key,
      key: route.query.key,
      sider_key: key,
    },
  });
};

watch(
  [() => route.query.key, () => menuStore.menuList],
  () => {
    setMenuList();
    setActiveMenuKey();
  },
  { deep: true }
);
onMounted(() => {
  setMenuList();
  setActiveMenuKey();
});
</script>

<style lang="less" scoped></style>
