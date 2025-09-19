const routes = [];

// 头部菜单路由
routes.push({
  path: '/view/dashboard/iframe',
  component: () => import('./complex-view/iframe-view/iframe-view'),
});
routes.push({
  path: '/view/dashboard/schema',
  component: () => import('./complex-view/schema-view/schema-view'),
});

const siderRoutes = [
  {
    path: 'iframe',
    component: () => import('./complex-view/iframe-view/iframe-view'),
  },
  {
    path: 'schema',
    component: () => import('./complex-view/schema-view/schema-view'),
  },
];

// 侧边栏菜单路由
routes.push({
  path: '/view/dashboard/sider',
  component: () => import('./complex-view/sider-view/sider-view'),
  children: siderRoutes,
});

// 侧边栏兜底策略
routes.push({
  path: '/view/dashboard/sider/:chapters+',
  component: () => import('./complex-view/sider-view/sider-view'),
});

export default routes;